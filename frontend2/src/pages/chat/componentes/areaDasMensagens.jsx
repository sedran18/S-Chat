import { useEffect, useState, useContext} from 'react';
import './areaDasMensagens.css';
import { SocketContext } from '../../../socketContext';
import Mensagem from './mensagem';


const AreaDasMensagens = ({atual, 
  userName, 
  mensagensComIa, 
  handleMensagemPrivada, 
  setListaConversas, 
  mensagens, 
  setMensagens, 
  setOffline,
  offline}) => {

 const socket = useContext(SocketContext);

 const pegarMensagensPublicas = ({sala, limit}, callback) => {
  socket.once('pegarMensagensPublicas', callback);
  socket.emit('pegarMensagensPublicas', {sala, limit})
 }
 const pegarMensagensPrivadas = ({destinatario}, callback) => {
    socket.once('pegarMensagensPrivadas', callback);
    socket.emit('pegarMensagensPrivadas', {destinatario});
 }

useEffect(() => {
 setMensagens([]); 
  
 if (atual === 'Pública') {
  console.log(socket.id);
  pegarMensagensPublicas({sala: 'publica', limit: 100}, (data) => {
  setMensagens(data.mensagens); 
 })
 } else if (atual === 'sedran') { 
  setMensagens(mensagensComIa);
 } else { 
  pegarMensagensPrivadas({destinatario: atual}, (data) => {
   setMensagens(data.mensagens);
  });
 }

}, [atual, socket, mensagensComIa]);
  

  useEffect(() => {
    const handleNovaMensagemPrivada = (msg) => {
      if (msg.de === atual) {
      setMensagens(prev => [...prev, {user: msg.de, mensagem: msg.mensagem}]);
      } 
          
          setListaConversas(prevListaConversas => {
              if (!prevListaConversas.includes(msg.de)) {
                  return [...prevListaConversas, msg.de];
              }
              return prevListaConversas; 
          });
    };

    const handleNovaMensagemPublica = (msg) => {
          setMensagens(prev => [...prev, msg]);
    };

    socket.on('sendMensagemParaSalas', handleNovaMensagemPublica);
   socket.on('sendMensagemPrivada', handleNovaMensagemPrivada);
  
  return () => {
   if (atual === 'Pública') {
    socket.off('sendMensagemParaSalas', handleNovaMensagemPublica);
   } else if (atual !== 'sedran' && atual !== 'Pública') { 
    socket.off('sendMensagemPrivada', handleNovaMensagemPrivada);
    setOffline(false);
   }
  };
  
 }, [socket, atual]);


 return (
  <div className="areaDasMensagens">
   {mensagens.map((msg, index) => {
        if (!msg || !msg.user) return null;
        
        const isMine = msg.user === userName.toLowerCase();
        const key = `${msg.user}-${index}`; 

    if (isMine) {
     return <Mensagem 
     key={key} 
     nome={msg.user} 
     texto={msg.mensagem} 
     isMine={true}
     />
    } else {
     return <Mensagem 
     key={key} 
     nome={msg.user} 
     texto={msg.mensagem}
     handleMensagemPrivada={handleMensagemPrivada}/>
    }
   })} 
   {offline && <div className='offline'>{atual} está offline!</div>}
  </div>
 )
}
export default AreaDasMensagens;