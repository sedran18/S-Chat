import { useState } from 'react'
import './styles/App.css';
import Login from './pages/login/login.jsx';
import Chat from './pages/chat/chat.jsx';

function App() {
  const [user, setUser] = useState('');
  return (
    <>
      {/* <Chat username='Gabriel' /> */}
       {!user ? (
        <Login  />
      ) : (
        <Chat username={user} />
      )}
    </>
  )
}

export default App
