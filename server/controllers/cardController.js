const Card = require('../models/Card');

exports.getCards = async (req, res) => {
    try {
        const uid = req.user.uid;
        let cards = await Card.findAll({ where: { uid } });

        // If user has no cards, create a default "Premium Black" card for them
        if (cards.length === 0) {
            const newCard = await Card.create({
                uid,
                cardNumber: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
                last4: Math.floor(1000 + Math.random() * 9000).toString(),
                brand: 'Visa',
                expiryDate: '12/28',
                cardHolder: req.user.username.toUpperCase(),
                status: 'Active'
            });
            cards = [newCard];
        }

        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch cards', error: err.message });
    }
};
