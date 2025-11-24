# 💬 S-Chat: Chat App em Tempo Real com IA (Sedran)

O S-Chat é um aplicativo de bate-papo completo construído com tecnologias modernas. Ele oferece comunicação em tempo real via **WebSocket (Socket.io)**, persistência de dados com **MongoDB** e integração com inteligência artificial através da API Gemini.

## 🌟 Funcionalidades Principais

### Backend (Node.js/Express)
* **Autenticação JWT:** Sistema seguro para criação e exclusão de usuários.
* **MongoDB/Mongoose:** Persistência de dados para usuários e mensagens (públicas e privadas).
* **WebSockets (Socket.io):** Comunicação em tempo real para envio e recebimento de mensagens.
* **Bate-papo com IA:** Integração com o modelo **Gemini** (apelidado de "Sedran") para:
    * `POST /api/ia/resposta`: Obter respostas diretas da IA.
    * `POST /api/ia/automatizar`: Sugerir respostas automatizadas para mensagens recebidas.
* **Testes:** Cobertura de testes unitários e de integração com **Jest** e `supertest`.

### Frontend (React/Vite)
* **Single Page Application (SPA):** Navegação fluida com `react-router-dom`.
* **Context API:** Uso de `SocketContext` para gerenciamento global da conexão Socket.io.
* **Interface de Chat:** Exibição de conversas públicas, privadas e com a IA (`sedran`).
* **Login Dinâmico:** Criação de usuário via HTTP e login de sessão via Socket.io.
* **Experiência em Tempo Real:** Atualização imediata de mensagens e status de conexão.
* **Mobile-first:** Layout responsivo priorizando telas menores.

⚠️ Obs: Os usuário não são persistentes, a partir do momento que o usuário é desconectado (ao atualizar a página por exemplo), ele é removido do banco de dados.

## ⚙️ Tecnologias Utilizadas

| Componente | Tecnologias |
| :--- | :--- |
| **Backend** | Node.js, Express, Socket.io, Mongoose, JWT, Jest |
| **Banco de Dados** | MongoDB |
| **Frontend** | React, Vite, react-router-dom, Socket.io-client |
| **IA** | Google Gemini API (via `geminiService.js`) |

## 🛠️ Configuração e Instalação

### Pré-requisitos
* Node.js (versão 18+)
* MongoDB (local ou na nuvem, como MongoDB Atlas)
* Chave de API do Google Gemini

### Backend

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/sedran18/S-Chat.git
    cd S-chat/backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do diretório do backend com as seguintes variáveis:
    ```
    # Exemplo de .env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/schatdb 
    JWT_SECRET=sua-chave-secreta-jwt-super-segura
    GEMINI_API_KEY=sua-chave-da-api-gemini
    ```

4.  **Execute o servidor:**
    ```bash
    npm run dev
    # ou para produção: npm start
    ```

### Frontend

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd ../frontend2 
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do diretório do frontend (Vite usa `VITE_` como prefixo):
    ```
    # Exemplo de .env
    VITE_BACK_URI=http://localhost:3000 # Altere para o URL de deploy
    ```

4.  **Execute o aplicativo:**
    ```bash
    npm run dev
    ```

## 🧪 Rodando Testes (Backend)

Para executar os testes unitários e de integração (que utilizam `mongodb-memory-server` para testes em memória):

```bash
npm test
```

## 🌐 Links do Projeto

Este projeto **S-Chat** é desenvolvido **sem fins lucrativos**, como um projeto pessoal de aprendizado e demonstração de tecnologias modernas (Node.js, React, Socket.io, MongoDB e integração com IA).

- **Frontend (S-Chat):** [https://s-chat-frontend.onrender.com](https://s-chat-frontend.onrender.com)  
- **Backend (API):** [https://srv-d4h247pr0fns739vdrm0.onrender.com](https://srv-d4h247pr0fns739vdrm0.onrender.com)
- **LinkedIn do Desenvolvedor:** [https://www.linkedin.com/in/gabriel-nardes/](https://www.linkedin.com/in/gabriel-nardes/)

## 🎬 Demonstração

Abaixo está um vídeo explicativo mostrando o funcionamento do S-Chat:

![Demonstração do S-Chat](frontend2/src/assets/videoReadme.gif)