import { useState } from "react"; 
function digitarNome() {

    const [nome, setNome] = useState('');
    const handleSubmit = e => {
        e.preventDefault();
        // if (nome.trim()) {
        //     onLogin(nome)
        // }
    }
    return (
        <form className="loginForm">
            <p>
                    <span class="material-symbols-outlined">warning
                    </span> Já existe um usuário ativo com esse nome</p>
            <input 
                type='text' 
                name='nome' 
                id='nome'
                value={nome}></input>
                
            <button  onClick={handleSubmit}>Log-in</button>
        </form>
    )
}
export default digitarNome;