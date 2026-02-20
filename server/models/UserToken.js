const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const KodUser = require('./KodUser');

const UserToken = sequelize.define('UserToken', {
    tid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.STRING(512), // JWTs can be long
        allowNull: false,
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: KodUser,
            key: 'uid',
        },
    },
    expiresAt: { // Changed from expiry to expiresAt for clarity
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

KodUser.hasMany(UserToken, { foreignKey: 'uid' });
UserToken.belongsTo(KodUser, { foreignKey: 'uid' });

module.exports = UserToken;
