import { useState } from 'react'
import './styles/App.css';
import Login from './pages/login/login';

function App() {
  return (
    <>
      <Login />
       {/* {!user ? (
        <Login  />
      ) : (
        <Chat username={user} />
      )} */}
    </>
  )
}

export default App
