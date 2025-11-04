import { useState } from 'react'
import './styles/App.css';
import Login from './pages/login/login.jsx';
import Chat from './pages/chat/chat.jsx';
import { criarUser } from './services/http.js';
import { login } from './services/socket.js';

function App() {
 const [user, setUser] = useState('');
 const [loginErro, setLoginErro] = useState(false);

 const handleLogin = async (nomeDoUsuario) => {
    setLoginErro(false); 
  try {
   if (nomeDoUsuario === 'sedran' ||
      nomeDoUsuario === 'pública' ||
      nomeDoUsuario === 'publica'
   ) {
      return setLoginErro(true);
   }
   const data = await criarUser(nomeDoUsuario); 
      
   const token = data.token; 
   localStorage.setItem('token', token);
      
   login(nomeDoUsuario); 
      
   setUser(nomeDoUsuario);

  } catch (err) {
   console.error(err.message);
   setLoginErro(true);
  }
 };
   //para verificar se o usuário está online, toda vez que alguém desconectar a gente verifica se ele está na nossa lista (pouco eficiente, mas para esse caso funciona), se estiver então a gente coloca ele como desativado.
 return (
  <>
   {!user ? (
    <Login onLogin={handleLogin} loginErro={loginErro}/>
   ) : (
    <Chat username={user} />
   )}
  </>
 )
}

export default App