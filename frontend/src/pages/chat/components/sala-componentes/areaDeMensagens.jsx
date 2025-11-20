import { useState, useEffect, useRef } from "react";
import Mensagem from "./mensagens/mensagem";
import { pegarMensagensPublicas, pegarMensagensPrivadas } from "../../../../services/socket";
import socket from "../../../../services/socket";
import { respostaIA } from "../../../../services/http";

export default function AreaDeMensagem({ activeChat, aoClicarNoUser }) {
 const [mensagens, setMensagens] = useState([]);
  const chatEndRef = useRef(null); 
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 useEffect(() => {
    setMensagens([]); 

  if (activeChat.type === 'sala') {
    const sala = activeChat.name.toLowerCase() === "pública" ? "publica" : activeChat.name;
    pegarMensagensPublicas({ sala }, (data) => {
    if (data?.mensagens) setMensagens(data.mensagens.slice().reverse());

   });
  } else if (activeChat.type === 'privada') {
    pegarMensagensPrivadas(activeChat.name, (data) => {
    if (data?.mensagens) setMensagens(data.mensagens.slice().reverse());

   }); 
  } else if (activeChat.type === 'ia') {
    // respostaIA(msgIA).then(data => setMensagens(data));
  }
  
  const publicListener = (novaMensagem) => {
      const salaAtiva = activeChat.name.toLowerCase() === "Pública" ? "publica" : activeChat.name;
   if (activeChat.type === 'sala' && novaMensagem.sala === salaAtiva) {
    setMensagens((prev) => [...prev, novaMensagem]);
   }
  };

    const privateListener = (novaMensagem) => {
      if (activeChat.type === 'privada' && 
         (novaMensagem.de === activeChat.name)) {
        setMensagens((prev) => [...prev, { user: novaMensagem.de, mensagem: novaMensagem.mensagem }]);
      }
    };

  socket.on("sendMensagemParaSalas", publicListener);
    socket.on("sendMensagemPrivada", privateListener);

  return () => {
   socket.off("sendMensagemParaSalas", publicListener);
      socket.off("sendMensagemPrivada", privateListener);
  };
 }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

 return (
  <div className="areaDeMensagem">
   {mensagens.map((m, index) => (
    <Mensagem key={index} username={m.user} mensagem={m.mensagem} aoClicarNoUser={aoClicarNoUser}/>
   ))}
      <div ref={chatEndRef} />
  </div>
 );
}