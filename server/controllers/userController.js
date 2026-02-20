const KodUser = require('../models/KodUser');

exports.getBalance = async (req, res) => {
    try {
        // 1st JWT token verification happened in middleware
        // "once token is verified extract the username information using token"
        const { username } = req.user;

        // "and fetch the balance from koduser using username"
        const user = await KodUser.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // "and send the balance to client"
        res.json({ balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
