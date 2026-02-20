const { Sequelize } = require('sequelize');
require('dotenv').config();

// Aiven MySQL Configuration
const dbUri = process.env.DB_URI || 'sqlite::memory:'; // Fallback so we don't leak secrets in git

const sequelize = new Sequelize(dbUri, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

sequelize.authenticate()
  .then(() => console.log('Successfully connected to Aiven MySQL.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
