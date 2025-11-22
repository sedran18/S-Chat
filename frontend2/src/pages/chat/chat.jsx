import './chat.css';
import Area2 from './componentes/area2';
import Area1 from './componentes/area1';
import Menu from './componentes/menu';
import { useState } from 'react';

export default function Chat({nome}) {
    const [activeArea1, setActiveArea1] = useState(true);
    const [currentChat, setCurrentChat] = useState('Pública');
    const initialValue =  ['sedran', 'Pública']
    const [conversas, setConversas] = useState(initialValue);

    const setConversaAtual = (cvrs) => {
        setCurrentChat(cvrs);
        setTimeout(() => {
            setActiveArea1(prev => !prev);
        }, 0)
    }

    const handleMenuClick = e => {
        setActiveArea1(prev => !prev);
    }
    return (
    <div className='chat'>
        <Area2 atual={currentChat}
            nomeUsuario={nome}
            setAtual={setCurrentChat}
            setListaConversas = {setConversas}/>
        <Menu click={handleMenuClick}/>
        <Area1 atual={currentChat}
            none={activeArea1}
            nome={nome}
            setConversaAtual={setConversaAtual}
            conversas={conversas}
            setConversas={setConversas}/>
    </div>)
}