import { useState, useEffect } from 'react';
import Conversa from './conversas-componentes/conversa'

export default function Conversas({username, onChatSelect, className, activeChat, destinatario}) {
    
  const [conversas, setConversas] = useState([
      { type: 'privada', name: 'sedran', ativo: true },
      { type: 'sala', name: 'Pública', ativo: true }
    ]);

    useEffect(() => {
      if (destinatario) {
        const existe = conversas.some(c => c.name === destinatario);
        if (!existe) {
          setConversas(prev => [...prev, { type: 'privada', name: destinatario, ativo: true }]);
        }
      }
    }, [destinatario]); 

  return (
    <div className={className} id="conversas">
      <div className='fantasma'>{username}</div>
      {conversas.map((c) => (
       <Conversa 
                  key={c.name} 
                  nome={c.name} 
                  ativo={c.ativo}
                  aoClicar={() => onChatSelect({ type: c.type, name: c.name })}
                  isAtivo={activeChat.name === c.name}
                />
      ))}
    </div>
  )
}