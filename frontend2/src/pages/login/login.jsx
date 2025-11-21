import './login.css';
import Form from './components/form.jsx';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarUser } from '../../../services/httpServices.js'; 
import { SocketContext } from '../../socketContext.jsx';

export default function Login({ setNomeUsuario }) {
  const [inputNome, setInputNome] = useState('');
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false); 
  const socket = useContext(SocketContext);

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(false);
    const nomeLimpo = inputNome.trim();
    if (!nomeLimpo) return;

    const nomeLower = nomeLimpo.toLowerCase();
    if (nomeLower === 'pública' || nomeLower === 'publica' || nomeLower === 'sedran') {
      setErro(true);
      return;
    }

    setCarregando(true);

    try {
      const res = await criarUser(nomeLimpo);
      const token =  res.token;
      localStorage.setItem("token", token);

      
      const loginResultado = await new Promise((resolve) => {
        
        const onLoginSuccess = (data) => {
          socket.off('erro', onLoginError);
          resolve({ success: true, data });
        };
        
        const onLoginError = (err) => {
          if (err.evento === 'login') {
            socket.off('login', onLoginSuccess); 
            resolve({ success: false, error: err });
          }
        };

        socket.off('login', onLoginSuccess);
        socket.off('erro', onLoginError);
        socket.once('login', onLoginSuccess);
        socket.once('erro', onLoginError);

        socket.emit('login', {nome: nomeLimpo});
      });

      if (loginResultado.success) {
        console.log('Login feito com sucesso' + ' ' + socket.id);
        setNomeUsuario(nomeLimpo);
        navigate('/chat');
      } else {
        console.error('Login mal feito (Socket.io):', loginResultado.error.mensagem);
        setErro(true);
      }

    } catch (mensagemErro) {
      console.error("Erro no Login (HTTP ou Geral):", mensagemErro);
      setErro(true); 
      
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login">
      <Form 
        nome={inputNome} 
        setNome={setInputNome} 
        handleLogin={handleLogin} 
        erro={erro}
        carregando={carregando} 
      />
    </div>
  )
}