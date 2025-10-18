export default function Conversa({nome, ativo}) {
    if (ativo) {
        return (
            <div className="conversaDiv">
                <span>{nome}</span> 
                <i class="fa-solid fa-circle ativo" id='ativo'></i>
            </div>
            )
    } else {
        return (
            <div className="conversaDiv">
                <span>{nome}</span>
                <i class="fa-solid fa-circle desativado" id='ativo'></i>
            </div>
            )
    }

}