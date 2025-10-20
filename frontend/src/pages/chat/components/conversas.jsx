import Conversa from './conversas-componentes/conversa'
export default function Conversas({username, aoClicar, className}) {
    
    return (
        <div className={className} id="conversas">
            <div className='fantasma'>{username}</div>
            <Conversa nome='sedran' ativo={true} aoClicar={aoClicar}/>
            <Conversa nome='Pública' ativo={true} aoClicar={aoClicar}/>
            <Conversa nome='Networking' ativo={true} aoClicar={aoClicar}/>
        </div>
    )
}