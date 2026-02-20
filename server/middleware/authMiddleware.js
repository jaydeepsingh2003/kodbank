const jwt = require('jsonwebtoken');
const UserToken = require('../models/UserToken');
const KodUser = require('../models/KodUser');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token exists in DB and is valid
        const storedToken = await UserToken.findOne({ where: { token } });

        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        if (new Date() > storedToken.expiresAt) {
            return res.status(401).json({ message: 'Token expired' });
        }

        req.user = decoded; // { uid, username }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = verifyToken;
