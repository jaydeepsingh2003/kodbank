const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database "${DB_NAME}" created or successfully checked.`);
        await connection.end();
    } catch (error) {
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('❌ Access Denied: Please check your DB_PASSWORD in .env');
        } else {
            console.error('❌ Failed to initialize database:', error.message);
        }
        process.exit(1);
    }
}

initializeDatabase();
