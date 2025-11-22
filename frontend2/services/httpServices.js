const BACK_URI = import.meta.env.VITE_BACK_URI;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
      const errorBody = await res.json(); 
      throw new Error(errorBody.error || 'Erro na requisição');
  }
  return res.json();
}

export async function criarUser(nome) {
    const res = await fetch(`${BACK_URI}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome })
    });

    if (!res.ok) {
        const errorBody = await res.json();
        const errorMessage = errorBody.error || 'Erro na requisição';

        if (res.status === 400 && errorMessage.includes('Usuário já existe')) {
            return { message: 'Usuário existente, prosseguindo para autenticação Socket.' };
        }
        
        throw new Error(errorMessage);
    }
    
    return res.json();
}

export async function respostaIA(mensagem) {
 const res = await fetch(`${BACK_URI}/api/ia/resposta`, {
  method: 'POST',
  headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
  body: JSON.stringify({ mensagem })
 });
  return handleResponse(res);
}

export async function automatizarIA(mensagem) {
 const res = await fetch(`${BACK_URI}/api/ia/automatizar`, {
  method: 'POST',
  headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
  body: JSON.stringify({ mensagem })
 });
  return handleResponse(res);
}