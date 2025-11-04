import DivComNome from "./sala-componentes/divcomNome";
import AreaDeMensagem from "./sala-componentes/areaDeMensagens";
import AreaDoTeclado from "./sala-componentes/areaDeTeclado";

export default function Sala({className, onSalaClick, activeChat, aoClicarNoUser}) {

  return (
    <div className={className} id="sala" onClick={onSalaClick}>
     <DivComNome nome={activeChat.name}/> 
     <AreaDeMensagem activeChat={activeChat} aoClicarNoUser={aoClicarNoUser}/>
     <AreaDoTeclado sala={activeChat}  />
    </div>
  )
}