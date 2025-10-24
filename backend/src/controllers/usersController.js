const User = require('../models/users.js');

const verificarUser = async (nome) => {
    try {
        const userEncontrado = await User.findOne({nome: nome});
        return userEncontrado;
    } catch(err) {
        return err.message;
    }
}


const criarUser = async (req, res) => {
    const verificar = Object.keys(req.body);

    if (verificar.length !== 1 || verificar[0] !== 'nome') return res.status(400).json({error: 'Informe os argumentos corretos'});

    if (req.body.nome.toLowerCase() === 'sedran') return res.status(400).json({error: 'Infelizmente esse nome não está disponível'})

    const jaExiste = await verificarUser(req.body.nome);
    if (jaExiste) return res.status(400).json({error: 'Usuário já existe no banco de dados'});

    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.gerarToken();
      res.status(201).json({user, token});
    } catch(err){
        res.status(400).json({erro: err.message})
    }

}


const deletarUser = async (req, res) => {
    try {
        await req.user.deleteOne();
        res.json(req.user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}





module.exports = {criarUser, deletarUser}
