import { io } from 'socket.io-client';

const socket = io(process.env.BACK_URI, {
    transports: ['websocket'],
    autoConnect: true,
});

export function login(nome) {
    if (!nome) return console.error('Nome é obrigatório para login');
    socket.emit('login', { nome });
}

export function sendMensagemParaSalas({ mensagem, sala }) {
    if (!mensagem || !sala) return console.error('Parâmetros mensagem e sala são obrigatórios');
    socket.emit('sendMensagemParaSalas', { mensagem, sala });
}

export function sendMensagemPrivada({ toName, mensagem }) {
    if (!mensagem || !toName) return console.error('Parâmetros mensagem e toName são obrigatórios');
    socket.emit('sendMensagemPrivada', { toName, mensagem });
}

export function pegarMensagensPrivadas(destinatario, callback) {
    if (!destinatario) return console.error('Destinatário é obrigatório');
    socket.emit('pegarMensagensPrivadas', { destinatario });
    socket.once('mensagensPrivadas', callback); // só dispara uma vez
}

export function pegarMensagensPublicas({ limit = 20, skip = 0, sala }, callback) {
    if (!sala) return console.error('Parâmetro sala é obrigatório');
    socket.emit('pegarMensagensPublicas', { limit, skip, sala });
    socket.once('mensagensPublicas', callback);
}

export function entrarNaSala(sala) {
    if (!sala) return console.error('Parâmetro sala é obrigatório');
    socket.emit('entrarNaSala', sala);
}

export function usuariosOnline(callback) {
    socket.emit('usuariosOnline');
    if (callback) socket.once('usuariosOnline', callback);
}

export default socket;
