const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '');
        if (!token) {
            return res.status(401).json({error: 'Por favot autentifique'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if(!user) {
            return res.status(401).json({error: 'Usuário não encontrado'});
        }


        req.user = user;
        req.token = token;
    } catch (e) {
        res.status(401).json({error: 'Token inválido ou expirado'});
    }
}