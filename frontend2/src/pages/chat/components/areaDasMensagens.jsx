import { useEffect, useState } from 'react';
import './areaDasMensagens.css';
import socket, { pegarMensagensPublicas } from '../../../../services/socket';
import Mensagem from './mensagem';

const AreaDasMensagens = ({atual}) => {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    if (atual === 'Pública') {
        console.log(socket.id);
      pegarMensagensPublicas({sala: 'publica'}, (data) => {
        setMensagens(data.mensagens); 
      })
    }
  }, [atual]);

  return (
    <div className="areaDasMensagens">
      {mensagens.map((msg, index) => {
        return <Mensagem key={msg.user + index} nome={msg.user} texto={msg.mensagem}/>
      })}
    </div>
  )
}
export default AreaDasMensagens;