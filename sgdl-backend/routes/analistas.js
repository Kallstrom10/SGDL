const express = require('express');
const router = express.Router();
const analistasController = require('../controllers/analistasController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas por autenticação
router.get('/', authMiddleware, analistasController.listarAnalistas);
router.post('/', authMiddleware, analistasController.criarAnalista);
router.get('/:id', authMiddleware, analistasController.obterAnalista);
router.put('/:id', authMiddleware, analistasController.atualizarAnalista);
router.delete('/:id', authMiddleware, analistasController.deletarAnalista);

// Login não requer autenticação
router.post('/login', analistasController.loginAnalista);

module.exports = router;
