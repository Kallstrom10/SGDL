const express = require('express');
const router = express.Router();
const administradoresController = require('../controllers/administradoresController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas
router.get('/administradores', authMiddleware, administradoresController.listarAdministradores);
router.post('/administradores', authMiddleware, administradoresController.criarAdministrador); // Corrigido
router.get('/administradores:id', authMiddleware, administradoresController.obterAdministrador);
router.put('/administradores:id', authMiddleware, administradoresController.atualizarAdministrador);
router.delete('/administradores:id', authMiddleware, administradoresController.deletarAdministrador);
router.post('/login', administradoresController.loginAdministrador); // Rota de login

module.exports = router;
