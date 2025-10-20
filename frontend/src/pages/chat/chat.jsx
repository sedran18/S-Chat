import  {useState} from 'react';
import Conversas from './components/conversas';
import Sala from './components/sala';
import './style/chat.css';
import Menu from './components/menu'

export default function Chat() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleConversas = () => {
        setIsMenuOpen(!isMenuOpen); 
    };
    const removerConversas = () => {
        if (isMenuOpen) {
            setIsMenuOpen(!isMenuOpen);
        }
    }

    return (
        <div className='chat'>
            <Menu onMenuClick={toggleConversas}/>
            <Conversas className={`conversas ${isMenuOpen ? 'open' : ''}`}/>
            <Sala className={`sala ${isMenuOpen ? 'tamanhoCem' : ''}`} onSalaClick={removerConversas}/>
        </div>
    )
}