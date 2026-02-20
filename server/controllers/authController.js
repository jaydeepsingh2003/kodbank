const jwt = require('jsonwebtoken');
const { KodUser, UserToken } = require('../models');

exports.register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Check if user exists
        const existingUser = await KodUser.findOne({ where: { username } });
        const existingEmail = await KodUser.findOne({ where: { email } });
        if (existingUser || existingEmail) return res.status(400).json({ message: 'Identity already registered' });

        const newUser = await KodUser.create({
            username,
            email,
            password,
            phone,
            balance: 1000.00,
            isVerified: true // Auto-verify since email flow is removed
        });

        res.status(201).json({ message: 'Identity Registered successfully.', uid: newUser.uid });
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
