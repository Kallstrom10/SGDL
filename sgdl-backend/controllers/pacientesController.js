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

// Listar todos os pacientes
const listarPacientes = (req, res) => {
    db.query('SELECT * FROM pacientes', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Criar um novo paciente
const criarPaciente = (req, res) => {
    const { nome_completo, email, senha, genero, data_nascimento, telefone } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);

    db.query('INSERT INTO pacientes (nome_completo, email, senha, genero, data_nascimento, telefone) VALUES (?, ?, ?, ?, ?, ?)', 
        [nome_completo, email, hashedPassword, genero, data_nascimento, telefone], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, nome_completo, email, genero, data_nascimento, telefone });
        }
    );
};

// Obter um paciente específico
const obterPaciente = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM pacientes WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Paciente não encontrado' });
        res.json(results[0]);
    });
};

// Atualizar um paciente específico
const atualizarPaciente = (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, senha, genero, data_nascimento, telefone } = req.body;
    const hashedPassword = senha ? bcrypt.hashSync(senha, 10) : undefined;

    const query = 'UPDATE pacientes SET nome_completo = ?, email = ?, senha = ?, genero = ?, data_nascimento = ?, telefone = ? WHERE id = ?';
    const values = [nome_completo, email, hashedPassword || null, genero, data_nascimento, telefone, id];

    db.query(query, values, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Paciente não encontrado' });
        res.json({ message: 'Paciente atualizado com sucesso' });
    });
};

// Deletar um paciente específico
const deletarPaciente = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM pacientes WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Paciente não encontrado' });
        res.json({ message: 'Paciente deletado com sucesso' });
    });
};

// Login de paciente
//const loginPaciente = (req, res) => {
 //   const { email, senha } = req.body;
//    db.query('SELECT * FROM pacientes WHERE email = ?', [email], (err, results) => {
//        if (err) return res.status(500).json(err);
//        if (results.length === 0) return res.status(404).json({ message: 'Paciente não encontrado' });
//        const paciente = results[0];

        // Verificar a senha
//        if (!bcrypt.compareSync(senha, paciente.senha)) {
  //          return res.status(401).json({ message: 'Senha incorreta' });
    //    }

        // Gerar o token
 //       const token = jwt.sign({ id: paciente.id, type: 'Paciente' }, process.env.JWT_SECRET, {
            expiresIn: '1h', // O token expira em 1 hora
  //      });
   //     res.json({ token });

        // Registrar a ação de login
     //   registrarAcao(paciente.id, 'Paciente', `Realizou login`);
   // });
//};

console.log("Funções disponíveis:", {
    criarPaciente,
    listarPacientes,
    obterPaciente,
    atualizarPaciente,
    deletarPaciente,
    loginPaciente
})

// Corrigindo a exportação
module.exports = {
    criarPaciente,
    listarPacientes,
    obterPaciente,
    atualizarPaciente,
    deletarPaciente,
    loginPaciente
};
