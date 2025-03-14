const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const puppeteer = require('puppeteer');

// Função para registrar ações
const registrarAcao = (usuario_id, tipo_usuario, acao) => {
    db.query('INSERT INTO historico (usuario_id, tipo_usuario, acao) VALUES (?, ?, ?)', 
        [usuario_id, tipo_usuario, acao], 
        (err) => {
            if (err) console.error('Erro ao registrar ação:', err);
        }
    );
};

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Adiciona timestamp ao nome do arquivo
    },
});

const upload = multer({ storage: storage });

// Listar todos os exames
const listarExames = (req, res) => {
    db.query('SELECT * FROM exames', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Criar um novo exame com upload de arquivo
const criarExame = (req, res) => {
    const { paciente_id, analista_id, tipo_exame, data_exame, status, resultado } = req.body;
    const imagem_exame = req.file ? req.file.filename : null; // Nome do arquivo enviado

    db.query('INSERT INTO exames (paciente_id, analista_id, tipo_exame, data_exame, status, resultado, imagem_exame) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [paciente_id, analista_id, tipo_exame, data_exame, status, resultado, imagem_exame], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            const novoExame = { id: results.insertId, paciente_id, analista_id, tipo_exame, data_exame, status, resultado, imagem_exame };
            res.status(201).json(novoExame);

            // Registrar a ação
            registrarAcao(analista_id, 'Analista', `Criou um novo exame para o paciente ID: ${paciente_id}`);
        }
    );
};

// Obter um exame específico
const obterExame = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM exames WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Exame não encontrado' });
        res.json(results[0]);
    });
};

// Atualizar um exame específico
const atualizarExame = (req, res) => {
    const { id } = req.params;
    const { paciente_id, analista_id, tipo_exame, data_exame, status, resultado, imagem_exame } = req.body;

    const query = 'UPDATE exames SET paciente_id = ?, analista_id = ?, tipo_exame = ?, data_exame = ?, status = ?, resultado = ?, imagem_exame = ? WHERE id = ?';
    const values = [paciente_id, analista_id, tipo_exame, data_exame, status, resultado, imagem_exame, id];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Exame não encontrado' });
        res.json({ message: 'Exame atualizado com sucesso' });

        // Registrar a ação
        registrarAcao(analista_id, 'Analista', `Atualizou o exame ID: ${id}`);
    });
};

// Deletar um exame específico
const deletarExame = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM exames WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Exame não encontrado' });
        res.json({ message: 'Exame deletado com sucesso' });

        // Registrar a ação
        registrarAcao(req.userId, 'Analista', `Deletou o exame ID: ${id}`);
    });
};

// Gerar PDF do exame
const gerarPDF = async (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM exames WHERE id = ?', [id], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Exame não encontrado' });

        const exame = results[0];

        // Criar o conteúdo HTML para o PDF
        const htmlContent = `
            <h1>Laudo do Exame</h1>
            <p><strong>Paciente:</strong> ${exame.paciente_id}</p>
            <p><strong>Analista:</strong> ${exame.analista_id}</p>
            <p><strong>Tipo de Exame:</strong> ${exame.tipo_exame}</p>
            <p><strong>Data do Exame:</strong> ${exame.data_exame}</p>
            <p><strong>Status:</strong> ${exame.status}</p>
            <p><strong>Resultado:</strong> ${exame.resultado}</p>
            ${exame.imagem_exame ? `<img src="${path.join(__dirname, '../uploads', exame.imagem_exame)}" alt="Imagem do Exame" />` : ''}
        `;

        // Iniciar o Puppeteer para gerar o PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Definir o cabeçalho para download do PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=laudo_exame_${exame.id}.pdf`,
        });

        // Enviar o PDF como resposta
        res.send(pdfBuffer);
    });
};

console.log("Funções disponíveis:", {
    listarExames,
    criarExame,
    obterExame,
    atualizarExame,
    deletarExame,
    gerarPDF
})

// Exportando corretamente os métodos
module.exports = {
    listarExames,
    criarExame,
    obterExame,
    atualizarExame,
    deletarExame,
    gerarPDF
};
