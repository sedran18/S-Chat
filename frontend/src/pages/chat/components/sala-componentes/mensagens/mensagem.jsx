
export default function Mensagem({username, mensagem}) {
    return (
        <div className="message-container"> 
            <span className="user">&#128100;{username}: </span>
            <span className="mensagem">{mensagem}</span>
        </div>
    );
}