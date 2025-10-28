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