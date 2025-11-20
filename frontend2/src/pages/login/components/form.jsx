import './form.css';

export default function Form({ handleLogin, nome, setNome, erro, carregando = false }) {

    return (
        <form className="login-form" onSubmit={handleLogin}>
            
            <img src='../../../../assets/logo2.png' alt="Logo" className="logo-img" />
            
            <input 
                type="text"
                name="nome"
                id="nome"
                placeholder='Digite seu nome aqui'
                value={nome}
                onChange={e => setNome(e.target.value)}
                disabled={carregando}
                autoComplete="off"
            />
            
            {erro && (
                <p className="error-msg">
                    ⚠️ Usuário não disponível no momento!
                </p>
            )}
            
            <button 
                type="submit" 
                disabled={carregando || !nome.trim()} 
                className={carregando ? 'loading' : ''}
            >
                {carregando ? 'Conectando...' : 'Entrar'}
            </button>
        </form>
    )
}