import DivComNome from "./sala-componentes/divcomNome";
import AreaDeMensagem from "./sala-componentes/areaDeMensagens";
import AreaDoTeclado from "./sala-componentes/areaDeTeclado";

export default function Sala(props) {
    return (
        <div className={props.className} id="sala" onClick={props.onSalaClick}>
        <DivComNome nome='Pública'/>
        <AreaDeMensagem/>
        <AreaDoTeclado />
        </div>
    )
}