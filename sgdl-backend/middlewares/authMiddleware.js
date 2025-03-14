// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Salvar as informações do usuário decodificadas no request para uso posterior
        req.userId = decoded.id;
        req.userType = decoded.type; // Tipo de usuário (Administrador, Analista, Paciente)
        next();
    });
};

module.exports = authMiddleware;