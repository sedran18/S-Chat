import DivComNome from "./sala-componentes/divcomNome";
import AreaDeMensagem from "./sala-componentes/areaDeMensagens";
import AreaDoTeclado from "./sala-componentes/areaDeTeclado";
import { useState } from "react";

export default function Sala({className, onSalaClick, activeChat, aoClicarNoUser}) {
  const [mensagemParaIA, setMensagemParaIA] = useState('');

  const handleMensagemParaIA = (texto) => {
    setMensagemParaIA(texto);
  }

  return (
    <div className={className} id="sala" onClick={onSalaClick}>
     <DivComNome nome={activeChat.name}/> 
     <AreaDeMensagem activeChat={activeChat} msgIA={mensagemParaIA} aoClicarNoUser={aoClicarNoUser}/>
     <AreaDoTeclado activeChat={activeChat}  msgIA={handleMensagemParaIA}/>
    </div>
  )
}