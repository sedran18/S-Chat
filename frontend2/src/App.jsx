import "./App.css";
import Login from "./pages/login/login.jsx";
import Chat from "./pages/chat/chat.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { SocketProvider } from "./socketContext.jsx";

function App() {
  const [nome, setNome] = useState("");

  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login setNomeUsuario={setNome} />} />

          <Route
            path="/chat"
            element={
              nome ? <Chat nome={nome} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
