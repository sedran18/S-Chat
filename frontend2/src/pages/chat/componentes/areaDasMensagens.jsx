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
    if (atual === 'Pública') {
        console.log(socket.id);
        pegarMensagensPublicas({sala: 'publica'}, (data) => {
        setMensagens(data.mensagens); 
      })
    }
    return () => {
      setMensagens([]);
    }
  }, [atual]);

  return (
    <div className="areaDasMensagens">
      {mensagens.map((msg, index) => {
        if (msg.user === userName) {
          return <Mensagem 
          key={index} 
          nome={msg.user} 
          texto={msg.mensagem} 
          isMine={true}
          />
        } else {
          return <Mensagem 
          key={index} 
          nome={msg.user} 
          texto={msg.mensagem}/>
        }
      })}
    </div>
  )
}
export default AreaDasMensagens;