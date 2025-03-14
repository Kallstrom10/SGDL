const mysql = require('mysql');
require('dotenv').config(); // Carrega as variáveis de ambiente

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",  // Usa senha vazia se não for definida
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('✅ Conectado ao banco de dados MySQL');
});

module.exports = connection;
