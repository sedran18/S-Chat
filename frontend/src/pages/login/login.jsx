import DigitarNome from "./components/digitarNome";
import './style/login.css'
export default function Login({onlogin}) {
    return (<div className='contraste'>
        <div className="welcome">
            <h2>Bem vindo</h2>
            <p>Digite seu nome para continuar</p>
        </div>
        <DigitarNome />
    </div>)
}