const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const KodUser = require('./KodUser');

const Card = sequelize.define('Card', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: KodUser,
            key: 'uid',
        },
    },
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last4: {
        type: DataTypes.STRING(4),
        allowNull: false,
    },
    brand: {
        type: DataTypes.ENUM('Visa', 'Mastercard', 'Amex'),
        defaultValue: 'Visa',
    },
    expiryDate: {
        type: DataTypes.STRING, // MM/YY
        allowNull: false,
    },
    cardHolder: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Blocked', 'Expired'),
        defaultValue: 'Active',
    },
}, {
    timestamps: true,
});

KodUser.hasMany(Card, { foreignKey: 'uid' });
Card.belongsTo(KodUser, { foreignKey: 'uid' });

module.exports = Card;
