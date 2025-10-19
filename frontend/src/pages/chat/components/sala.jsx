import DivComNome from "./sala-componentes/divcomNome";
import AreaDeMensagem from "./sala-componentes/areaDeMensagens";
import AreaDoTeclado from "./sala-componentes/areaDeTeclado";

export default function Sala() {
    return (
        <div className="sala" id="sala">
        <DivComNome nome='Pública'/>
        <AreaDeMensagem/>
        <AreaDoTeclado />
        </div>
    )
}