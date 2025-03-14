// routes/exames.js
const express = require('express');
const router = express.Router();
const examesController = require('../controllers/examesController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configuração do Multer
const upload = multer({ dest: 'uploads/' });

// Rotas
router.get('/', authMiddleware, examesController.listarExames);
router.post('/', authMiddleware, upload.single('imagem_exame'), examesController.criarExame); // Middleware de upload
router.get('/:id', authMiddleware, examesController.obterExame);
router.put('/:id', authMiddleware, examesController.atualizarExame);
router.delete('/:id', authMiddleware, examesController.deletarExame);
router.get('/:id/pdf', authMiddleware, examesController.gerarPDF); // Rota para gerar PDF

module.exports = router;