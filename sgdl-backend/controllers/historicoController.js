const db = require('../config/db');

// Listar todas as ações
const listarHistorico = (req, res) => {
    db.query('SELECT * FROM historico', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Criar um novo registro de ação
const criarHistorico = (req, res) => {
    const { usuario_id, tipo_usuario, acao } = req.body;

    db.query('INSERT INTO historico (usuario_id, tipo_usuario, acao) VALUES (?, ?, ?)', 
        [usuario_id, tipo_usuario, acao], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, usuario_id, tipo_usuario, acao });
        }
    );
};

// Obter um registro de ação específico
const obterHistorico = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM historico WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Registro de ação não encontrado' });
        res.json(results[0]);
    });
};

// Deletar um registro de ação específico
const deletarHistorico = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM historico WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Registro de ação não encontrado' });
        res.json({ message: 'Registro de ação deletado com sucesso' });
    });
};

console.log("Funções disponíveis:", {
    criarHistorico,
    listarHistorico,
    obterHistorico,
    deletarHistorico
})

// Exportando corretamente todas as funções
module.exports = {
    listarHistorico,
    criarHistorico,
    obterHistorico,
    deletarHistorico
};
