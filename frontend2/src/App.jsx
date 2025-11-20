import './App.css'
import Login from './pages/login/login.jsx';
import Chat from './pages/chat/chat.jsx';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';

function App() {
  const [nome, setNome] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />}/>
        
        <Route path='/login' element={<Login setNomeUsuario={setNome} />}/>
        
        <Route path='/chat' element={nome ? <Chat nome={nome} /> : <Navigate to="/login" />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App