import { useState } from 'react';
import Conversas from './components/conversas';
import Sala from './components/sala';
import './style/chat.css';
import Menu from './components/menu'

export default function Chat({username}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    
  const [activeChat, setActiveChat] = useState({ type: 'sala', name: 'Pública' });

  const toggleConversas = () => {
    setIsMenuOpen(!isMenuOpen); 
  };
  const removerConversas = () => {
    if (isMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
  }

  const handleChatSelect = (chat) => {
   setActiveChat(chat);
      removerConversas(); 
  }

  return (
    <div className='chat'>
      <Menu onMenuClick={toggleConversas}/>
      <Conversas 
              className={`conversas ${isMenuOpen ? 'open' : ''}`} 
              username={username}
              activeChat={activeChat}
              onChatSelect={handleChatSelect} 
            />
      <Sala 
              className={`sala ${isMenuOpen ? 'tamanhoCem' : ''}`} 
              activeChat={activeChat}
              onSalaClick={removerConversas} 
              aoClicarNoUser={(nome) => handleChatSelect({ type: 'privada', name })}
            />
    </div>
  )
}