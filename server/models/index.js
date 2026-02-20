const sequelize = require('../config/database');
const KodUser = require('./KodUser');
const UserToken = require('./UserToken');
const Card = require('./Card');
const Transaction = require('./Transaction');

// Define Associations
KodUser.hasMany(UserToken, { foreignKey: 'uid' });
UserToken.belongsTo(KodUser, { foreignKey: 'uid' });

KodUser.hasMany(Card, { foreignKey: 'uid' });
Card.belongsTo(KodUser, { foreignKey: 'uid' });

KodUser.hasMany(Transaction, { as: 'SentTransactions', foreignKey: 'fromUid' });
KodUser.hasMany(Transaction, { as: 'ReceivedTransactions', foreignKey: 'toUid' });
Transaction.belongsTo(KodUser, { as: 'Sender', foreignKey: 'fromUid' });
Transaction.belongsTo(KodUser, { as: 'Receiver', foreignKey: 'toUid' });

module.exports = {
    sequelize,
    KodUser,
    UserToken,
    Card,
    Transaction
};
