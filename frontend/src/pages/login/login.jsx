import DigitarNome from "./components/digitarNome";
import './style/login.css'

export default function Login({onLogin, loginErro}) {
  return (<div className='contraste'>
    <div className="welcome" style={{ display: loginErro ? 'none' : 'flex' }}>
      <h2>Bem vindo</h2>
      <p>Digite seu nome para continuar</p>
    </div>
    <DigitarNome onLogin={onLogin} loginErro={loginErro} />
  </div>)
}