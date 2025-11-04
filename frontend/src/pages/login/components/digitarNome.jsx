import { useState } from "react"; 

function DigitarNome({onLogin, loginErro}) { 
  const [nome, setNome] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (nome.trim()) {
      onLogin(nome)
    }
  }
  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      {loginErro && (
        <p> 
          <span className="material-symbols-outlined">warning</span> 
          Já existe um usuário ativo com esse nome
        </p>)}
        
      <input 
        type='text' 
        name='nome' 
        id='nome'
        value={nome}
        onChange={e => setNome(e.target.value)}>
        </input>
        
      <button>Log-in</button>
    </form>
  )
}
export default DigitarNome;