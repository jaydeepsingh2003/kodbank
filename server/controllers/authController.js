const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // You might need to install bcryptjs if not already
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { KodUser, UserToken } = require('../models');

// Setup Ethereal Email for testing
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

exports.register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Check if user exists
        const existingUser = await KodUser.findOne({ where: { username } });
        const existingEmail = await KodUser.findOne({ where: { email } });
        if (existingUser || existingEmail) return res.status(400).json({ message: 'Identity already registered' });

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await KodUser.create({
            username,
            email,
            password,
            phone,
            balance: 1000.00,
            verificationToken
        });

        // Send Email
        const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;
        const mailOptions = {
            from: '"Kodbank Admin" <noreply@kodbank.os>',
            to: email,
            subject: 'Kodbank System: Verify Your Identity',
            text: `Welcome to Kodbank. Please verify your identity by clicking the following link: ${verifyUrl}`,
            html: `<p>Welcome to Kodbank.</p>
                   <p>Please verify your identity by clicking the following link:</p>
                   <a href="${verifyUrl}" style="background:#00f2ea;color:#000;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">Verify Account</a>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification Email dispatched: %s', nodemailer.getTestMessageUrl(info));

        res.status(201).json({ message: 'Identity Registered. Verification link dispatched to secure comms.', uid: newUser.uid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'System error during registration', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await KodUser.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Identity not verified. Check secure comms (email) for verification link.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { uid: user.uid, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        // Save to UserToken
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await UserToken.create({
            token,
            uid: user.uid,
            expiresAt
        });

        res.json({
            message: 'Login success',
            token,
            user: {
                username: user.username,
                email: user.email,
                balance: user.balance
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await KodUser.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.json({ message: 'Identity verified successfully. You may now initialize a session.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Verification error', error: err.message });
    }
};
