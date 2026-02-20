const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Imports the centralized models index
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Sync Database
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Required for Vercel Serverless Functions
