import { useState } from 'react'
import './styles/App.css';
import Login from './pages/login/login.jsx';
import Chat from './pages/chat/chat.jsx'

function App() {
  return (
    <>
      <Chat />
       {/* {!user ? (
        <Login  />
      ) : (
        <Chat username={user} />
      )} */}
    </>
  )
}

export default App
