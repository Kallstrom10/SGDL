// routes/historico.js
const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

// Rotas
router.get('/', historicoController.listarHistorico);
router.post('/', historicoController.criarHistorico);
router.get('/:id', historicoController.obterHistorico);
router.delete('/:id', historicoController.deletarHistorico);

module.exports = router;