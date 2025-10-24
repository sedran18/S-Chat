const User = require('../models/users.js');
const path = require('path');
const Sala = require(path.join(__dirname, '..', 'models', 'sala.js'));

async function salvarMensagemAtomica(usuarioNome, conversaNome, mensagemObj) {
    try {
        const result = await User.findOneAndUpdate(
            { 
                nome: usuarioNome, 
                'conversas.nome': { $ne: conversaNome } 
            },
            { 
                $push: { 
                    conversas: { 
                        nome: conversaNome, 
                        mensagens: [mensagemObj] 
                    } 
                }
            }
        );

        if (result) {
            return; 
        }

        await User.findOneAndUpdate(
            { 
                nome: usuarioNome, 
                'conversas.nome': conversaNome 
            },
            {
                $push: { 
                    'conversas.$.mensagens': mensagemObj 
                }
            }
        );

    } catch (err) {
        console.error(`Erro ao salvar atomicamente para ${usuarioNome}:`, err.message);
        throw err;
    }
}


async function salvarNoBancoPrivado({ remetente, destinatario, mensagem }) {
    
    const mensagemObj = {
        user: remetente,
        mensagem: mensagem
    };

    const remetenteNomeLower = remetente.toLowerCase();
    const destNomeLower = destinatario.toLowerCase();

    const operacaoRemetente = salvarMensagemAtomica(
        remetenteNomeLower, 
        destNomeLower, 
        mensagemObj
    );
    
    const operacaoDestinatario = salvarMensagemAtomica(
        destNomeLower, 
        remetenteNomeLower, 
        mensagemObj
    );

    await Promise.all([
        operacaoRemetente,
        operacaoDestinatario
    ]);
}

async function salvaNoBancoPublico({ user, mensagem, sala }) {
    await Sala.findOneAndUpdate(
        { nome: sala },
        { 
            $push: { 
                mensagens: { user, mensagem: mensagem }
            }
        },
        { 
            upsert: true,
            new: true
        }
    );
}

module.exports = { salvarNoBancoPrivado, salvaNoBancoPublico };