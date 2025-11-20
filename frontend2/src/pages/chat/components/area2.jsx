import './area2.css';
import './nomeDaConversa.jsx'
import NomeDaConversa from './nomeDaConversa.jsx';
import AreaDasMensagens from './areaDasMensagens.jsx';
import AreaDoTeclado from './areaDoTeclado.jsx';

export default function Area2({atual, nomeUsuario}) {
    return (
        <div className='areaMensagem'>
            <NomeDaConversa nome={atual} />
            <AreaDasMensagens atual={atual} nomeUsuario={nomeUsuario}/>
            <AreaDoTeclado />
        </div>
    )
}