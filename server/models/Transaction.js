const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const KodUser = require('./KodUser');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fromUid: {
        type: DataTypes.INTEGER,
        allowNull: true, // null if it's an external deposit/initial balance
        references: {
            model: KodUser,
            key: 'uid',
        },
    },
    toUid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: KodUser,
            key: 'uid',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Transfer', 'Deposit', 'Withdrawal', 'Payment'),
        defaultValue: 'Transfer',
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'General',
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

KodUser.hasMany(Transaction, { as: 'SentTransactions', foreignKey: 'fromUid' });
KodUser.hasMany(Transaction, { as: 'ReceivedTransactions', foreignKey: 'toUid' });
Transaction.belongsTo(KodUser, { as: 'Sender', foreignKey: 'fromUid' });
Transaction.belongsTo(KodUser, { as: 'Receiver', foreignKey: 'toUid' });

module.exports = Transaction;
