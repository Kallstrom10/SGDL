const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função para registrar ações
const registrarAcao = (usuario_id, tipo_usuario, acao) => {
    db.query('INSERT INTO historico (usuario_id, tipo_usuario, acao) VALUES (?, ?, ?)', 
        [usuario_id, tipo_usuario, acao], 
        (err) => {
            if (err) console.error('Erro ao registrar ação:', err);
        }
    );
};

// Listar todos os administradores
const listarAdministradores = (req, res) => {
    db.query('SELECT * FROM administradores', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Criar um novo administrador
const criarAdministrador = (req, res) => {
    const { nome_completo, email, senha, permissoes } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);

    db.query('INSERT INTO administradores (nome_completo, email, senha, permissoes) VALUES (?, ?, ?, ?)', 
        [nome_completo, email, hashedPassword, permissoes], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, nome_completo, email, permissoes });
        }
    );
};

// Obter um administrador específico
const obterAdministrador = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM administradores WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Administrador não encontrado' });
        res.json(results[0]);
    });
};

// Atualizar um administrador específico
const atualizarAdministrador = (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, senha, permissoes } = req.body;
    const hashedPassword = senha ? bcrypt.hashSync(senha, 10) : undefined;

    const query = 'UPDATE administradores SET nome_completo = ?, email = ?, senha = ?, permissoes = ? WHERE id = ?';
    const values = [nome_completo, email, hashedPassword || null, permissoes, id];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Administrador não encontrado' });
        res.json({ message: 'Administrador atualizado com sucesso' });
    });
};

// Deletar um administrador específico
const deletarAdministrador = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM administradores WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Administrador não encontrado' });
        res.json({ message: 'Administrador deletado com sucesso' });
    });
};

// Login de administrador
const loginAdministrador = (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM administradores WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Administrador não encontrado' });

        const administrador = results[0];

        // Verificar a senha
        if (!bcrypt.compareSync(senha, administrador.senha)) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gerar o token
        const token = jwt.sign({ id: administrador.id, type: 'Administrador' }, process.env.JWT_SECRET, {
            expiresIn: '1h', // O token expira em 1 hora
        });

        res.json({ token });
    });
};

// Log das funções disponíveis
console.log("Funções disponíveis:", { 
    criarAdministrador, 
    listarAdministradores, 
    obterAdministrador, 
    atualizarAdministrador, 
    deletarAdministrador, 
    loginAdministrador 
});

// Exportação correta das funções
module.exports = {
    criarAdministrador,
    listarAdministradores,
    obterAdministrador,
    atualizarAdministrador,
    deletarAdministrador,
    loginAdministrador
};
