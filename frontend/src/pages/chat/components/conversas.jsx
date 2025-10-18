import Conversa from './conversas-componentes/conversa'
export default function Conversas() {
    return (
        <div className="conversas" id="conversas">
            <div className='fantasma'></div>
            <Conversa nome='sedran' ativo={true}/>
            <Conversa nome='Pública' ativo={true}/>
            <Conversa nome='Networking' ativo={true}/>
        </div>
    )
}