require('dotenv').config(); // Deve ser a primeira coisa no código

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "Não definida");
console.log("DB_NAME:", process.env.DB_NAME);


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Importar rotas
console.log("Carregando rotas...");
const administradoresRoutes = require('./routes/administradores');
console.log("Administradores carregado.");
const analistasRoutes = require('./routes/analistas');
console.log("Analistas carregado.");
const pacientesRoutes = require('./routes/pacientes');
console.log("Pacientes carregado.");
const examesRoutes = require('./routes/exames');
console.log("Exames carregado.");
const historicoRoutes = require('./routes/historico');
console.log("Histórico carregado.");

// Usar rotas
app.use('/api/administradores', administradoresRoutes);
app.use('/api/analistas', analistasRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/exames', examesRoutes);
app.use('/api/historico', historicoRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
