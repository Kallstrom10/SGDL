// routes/pacientes.js
const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get('/', authMiddleware, pacientesController.listarPacientes);
router.post('/', authMiddleware, pacientesController.criarPaciente);
router.get('/:id', authMiddleware, pacientesController.obterPaciente);
router.put('/:id', authMiddleware, pacientesController.atualizarPaciente);
router.delete('/:id', authMiddleware, pacientesController.deletarPaciente);
router.post('/login', pacientesController.loginPaciente); // Rota de login

module.exports = router;