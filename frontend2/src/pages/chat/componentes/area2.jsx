import './area2.css';
import './nomeDaConversa.jsx'
import NomeDaConversa from './nomeDaConversa.jsx';
import AreaDasMensagens from './areaDasMensagens.jsx';
import AreaDoTeclado from './areaDoTeclado.jsx';
import { respostaIA } from '../../../../services/httpServices.js';
import { useState } from 'react';

export default function Area2({atual, nomeUsuario, setAtual, setListaConversas}) {
const [mensagensComIa, setMensagensComIa] = useState([{user: 'sedran', mensagem: `✨ Olá ${nomeUsuario}! Eu sou a Sedran.
Se precisar de ajuda, uma explicação rápida ou resolver algo complicado, é só me chamar.
Estou aqui para deixar tudo mais simples — vamos começar?`}]);
const [mensagens, setMensagens] = useState([]);
const [offline, setOffline] = useState(false);

const handleMensagemPrivada = (nome) => {
    setAtual(nome);
}

const handleMensagensComIa = async (mensagem) => {
    setMensagensComIa(prev => [
        ...prev, 
        {user: nomeUsuario, mensagem}, 
        {user: 'sedran', mensagem: '...Carregando'}
    ]);
    const respostaFromAi = await respostaIA(mensagem);
    
    setMensagensComIa(prev => {
        const mensagensSemCarregando = prev.slice(0, prev.length - 1);
        
        return [
            ...mensagensSemCarregando, 
            {user: 'sedran', mensagem: respostaFromAi.resposta}
        ];
    });
}
    return (
        <div className='areaMensagem'>
            <NomeDaConversa nome={atual} />
            <AreaDasMensagens atual={atual}
             userName={nomeUsuario} 
             mensagensComIa={mensagensComIa}
             handleMensagemPrivada={handleMensagemPrivada}
             setListaConversas = {setListaConversas}
             mensagens={mensagens}
             setMensagens={setMensagens}
             offline={offline}
             setOffline={setOffline}/>
            <AreaDoTeclado atual={atual}
             handleMensagensComIa={handleMensagensComIa} 
             setMensagens={setMensagens}
             userName={nomeUsuario}
             setOffline={setOffline}/>
        </div>
    )
}
