const { Sequelize } = require('sequelize');
require('dotenv').config();

// SQLite Configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './kodbank_db.sqlite', // Database file path
  logging: false,
});

module.exports = sequelize;
