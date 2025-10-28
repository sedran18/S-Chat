
export default function Mensagem({username, mensagem, aoClicarNoUser}) {
    function handleClick() {
        aoClicarNoUser(username);
    }

    return (
        <div className="message-container"> 
            <span className="user" onClick={handleClick}>&#128100;{username}: </span>
            <span className="mensagem">{mensagem}</span>
        </div>
    );
}