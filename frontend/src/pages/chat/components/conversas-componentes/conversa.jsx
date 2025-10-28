export default function Conversa({nome, ativo, aoClicar, isAtivo}) {
    
    const classesDiv = `conversaDiv ${isAtivo ? 'chat-ativo' : ''}`;

  if (ativo) {
    return (
      <div className={classesDiv} onClick={() => aoClicar(nome)}>
        <span>{nome}</span> 
        <i className="fa-solid fa-circle ativo" id='ativo'></i>
      </div>
      )
  } else {
    return (
      <div className={classesDiv} onClick={() => aoClicar(nome)}>
        <span>{nome}</span>
        <i className="fa-solid fa-circle desativado" id='ativo'></i>
      </div>
      )
  }
}