import { useState } from 'react';
import { sendMensagemParaSalas } from '../../../../services/socket';
import { sendMensagemPrivada } from '../../../../services/socket';

const emjlist = ['👍', '👽', '😢', '😀', '😍', '😠', '🤑', '🤖', '❤️️', '🧐', '🖖', '🙏'];

export default function AreaDoTeclado({activeChat, msgIA}) {
    const [mostrarEmojis, setMostrarEmojis] = useState(false);
    const [texto, setTexto] = useState("");

    const adicionarEmoji = (emoji) => {
        setTexto(textoAtual => textoAtual + emoji);
    };

    const toggleEmojis = () => {
        setMostrarEmojis(estadoAtual => !estadoAtual);
    };

    const enviarMensagem = () => {
        if (texto.trim() === '') {
            return;
        }
        if (activeChat.type === 'sala') {
            sendMensagemParaSalas({ 
                sala: activeChat === 'Pública'? 'publica': activeChat.name, 
                mensagem: texto 
            });
        } else if (activeChat.type === 'privada'){
            sendMensagemPrivada({toName: activeChat.name, mensagem: texto})
        } else if (activeChat.type === 'ia') {
            msgIA(texto);
        }
        setTexto(''); 
        setMostrarEmojis(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    };

    return (
        <div className="areaDoTeclado">
            {mostrarEmojis && (
                <div className="emojisLista">
                    {emjlist.map((emoji) => (
                        <span
                            key={emoji}
                            onClick={() => adicionarEmoji(emoji)}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            )}

            <button 
                type="button" 
                className="emojis" 
                id="emojis" 
                onClick={toggleEmojis}
                aria-label="Abrir seletor de emojis"
            >
                😀
            </button>

            <textarea
                name="texto"
                id="texto"
                value={texto}
                onClick={() => setMostrarEmojis(false)}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
            />

            <button 
                type="button" 
                className="enviar" 
                onClick={enviarMensagem}
                aria-label="Enviar mensagem"
            >
                <i className="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    );
}