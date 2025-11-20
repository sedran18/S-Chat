import './conversa.css';

export default function Conversa({conversa, setConversaAtual, atual}) {
    return (
        <div className={`conversa ${atual === conversa && 'selected-chat'}`} onClick={e=> setConversaAtual(conversa)}>{conversa}</div>
    )
}