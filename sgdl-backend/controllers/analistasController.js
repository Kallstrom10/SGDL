const db = require('../config/db');
const bcrypt = require('bcrypt');

// Função para registrar ações no histórico
const registrarAcao = (usuario_id, tipo_usuario, acao) => {
    db.query('INSERT INTO historico (usuario_id, tipo_usuario, acao) VALUES (?, ?, ?)', 
        [usuario_id, tipo_usuario, acao], 
        (err) => {
            if (err) console.error('Erro ao registrar ação:', err);
        }
    );
};

// Listar todos os analistas (Correção aplicada)
const listarAnalistas = (req, res) => {
    db.query('SELECT id, nome_completo, email, especialidade FROM analistas', (err, results) => {
        if (err) {
            console.error('Erro ao buscar analistas:', err);
            return res.status(500).json({ error: 'Erro ao buscar analistas', details: err.message });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Nenhum analista encontrado' });
        }

        res.json(results);
    });
};

// Criar um novo analista
const criarAnalista = (req, res) => {
    const { nome_completo, email, senha, especialidade } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);

    db.query('INSERT INTO analistas (nome_completo, email, senha, especialidade) VALUES (?, ?, ?, ?)', 
        [nome_completo, email, hashedPassword, especialidade], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, nome_completo, email, especialidade });
        }
    );
};

// Obter um analista específico
const obterAnalista = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM analistas WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Analista não encontrado' });
        res.json(results[0]);
    });
};

// Atualizar um analista específico
const atualizarAnalista = (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, senha, especialidade } = req.body;
    const hashedPassword = senha ? bcrypt.hashSync(senha, 10) : undefined;

    const query = 'UPDATE analistas SET nome_completo = ?, email = ?, senha = ?, especialidade = ? WHERE id = ?';
    const values = [nome_completo, email, hashedPassword || null, especialidade, id];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Analista não encontrado' });
        res.json({ message: 'Analista atualizado com sucesso' });
    });
};

// Deletar um analista específico
const deletarAnalista = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM analistas WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Analista não encontrado' });
        res.json({ message: 'Analista deletado com sucesso' });
    });
};

// Login de analista
const loginAnalista = (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM analistas WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Analista não encontrado' });

        const analista = results[0];

        // Verificar a senha
        if (!bcrypt.compareSync(senha, analista.senha)) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }
    });
};

console.log("Funções disponíveis:", {
    criarAnalista,
    listarAnalistas,
    obterAnalista,
    atualizarAnalista,
    deletarAnalista,
    loginAnalista
})

// Correção no module.exports
module.exports = {
    listarAnalistas,
    criarAnalista,
    obterAnalista,
    atualizarAnalista,
    deletarAnalista,
    loginAnalista
};
