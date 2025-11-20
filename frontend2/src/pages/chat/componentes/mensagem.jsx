import './mensagem.css';

/**
 * Componente que exibe uma única mensagem na tela de chat.
 * @param {object} props
 * @param {string} props.nome Nome do remetente.
 * @param {string} props.texto Conteúdo da mensagem.
 * @param {string} props.hora Horário do envio (ex: "10:30").
 * @param {boolean} props.isMine Se a mensagem foi enviada pelo usuário logado.
 */
export default function Mensagem({ nome, texto, hora, isMine = false }) {
    const messageClass = isMine ? 'mensagem minha' : 'mensagem outro';

    return (
        <div className={messageClass}>
            <div className="mensagem-bolha">
                {!isMine && (
                    <div className="mensagem-nome">
                        {nome}
                    </div>
                )}
                
                <p className="mensagem-texto">{texto}</p>

            </div>
        </div>
    );
}