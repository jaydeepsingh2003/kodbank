const { KodUser, Transaction, sequelize } = require('../models');

exports.transferMoney = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { toUsername, amount, description } = req.body;
        const fromUid = req.user.uid;

        if (!toUsername || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid recipient or amount' });
        }

        // Find sender
        const sender = await KodUser.findByPk(fromUid, { transaction });
        if (sender.balance < amount) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Find receiver
        const receiver = await KodUser.findOne({ where: { username: toUsername }, transaction });
        if (!receiver) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if (receiver.uid === fromUid) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Cannot transfer to yourself' });
        }

        // Atomic Balance Update
        sender.balance = parseFloat(sender.balance) - parseFloat(amount);
        receiver.balance = parseFloat(receiver.balance) + parseFloat(amount);

        await sender.save({ transaction });
        await receiver.save({ transaction });

        // Log Transaction
        await Transaction.create({
            fromUid,
            toUid: receiver.uid,
            amount,
            type: 'Transfer',
            description: description || `Transfer to ${toUsername}`
        }, { transaction });

        await transaction.commit();
        res.json({ message: 'Transfer successful', newBalance: sender.balance });
    } catch (err) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ message: 'Transfer failed', error: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const uid = req.user.uid;
        const history = await Transaction.findAll({
            where: {
                [sequelize.Sequelize.Op.or]: [
                    { fromUid: uid },
                    { toUid: uid }
                ]
            },
            include: [
                { model: KodUser, as: 'Sender', attributes: ['username'] },
                { model: KodUser, as: 'Receiver', attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch history', error: err.message });
    }
};
