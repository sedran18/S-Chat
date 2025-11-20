import { useEffect, useState, useContext} from 'react';
import './areaDasMensagens.css';
import { SocketContext } from '../../../socketContext';
import Mensagem from './mensagem';

const AreaDasMensagens = ({atual, userName}) => {
 const [mensagens, setMensagens] = useState([]);
 const socket = useContext(SocketContext);

 const pegarMensagensPublicas = ({sala}, callback) => {
  socket.once('pegarMensagensPublicas', callback);
  socket.emit('pegarMensagensPublicas', {sala})
 }


 useEffect(() => {
  setMensagens([]); 
     
  if (atual === 'Pública') {
    console.log(socket.id);
    pegarMensagensPublicas({sala: 'publica', limit: 30}, (data) => {
    setMensagens(data.mensagens); 
   })
  }

 }, [atual, socket]); 
  

  useEffect(() => {
    
    const handleNovaMensagem = (msg) => {
      setMensagens(prev => [...prev, msg]);
   };
    
    socket.on('sendMensagemParaSalas', handleNovaMensagem);

    return () => {
        socket.off('sendMensagemParaSalas', handleNovaMensagem);
    };
    
  }, [socket]); 


 return (
  <div className="areaDasMensagens">
   {mensagens.map((msg, index) => {
        if (!msg || !msg.user) return null;
        
        const isMine = msg.user === userName;
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
     texto={msg.mensagem}/>
    }
   })}
  </div>
 )
}
export default AreaDasMensagens;