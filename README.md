# War Game - Multiplayer Strategy Game

Um jogo de estratégia multiplayer inspirado no clássico War, desenvolvido com Node.js, Socket.IO e Phaser.js.

## 🚀 Deploy

### 🎮 itch.io (Frontend)
O jogo pode ser hospedado no itch.io para o frontend, conectando-se ao servidor no Railway.

**📖 Guia Completo**: Veja [DEPLOY_README.md](DEPLOY_README.md) para instruções detalhadas.

**Resumo Rápido**:
1. Configure a URL do Railway no arquivo `public/config.js`
2. Faça upload da pasta `public/` no itch.io
3. O jogo detectará automaticamente o ambiente e se conectará ao servidor correto

### 🖥️ Railway (Backend)
O servidor deve ser hospedado no Railway para funcionalidade multiplayer.

#### Pré-requisitos
- Conta no [Railway](https://railway.app/)
- Git configurado

#### Passos para Deploy

1. **Fazer push para o GitHub**
   ```bash
   git add .
   git commit -m "Preparando para deploy no Railway"
   git push origin main
   ```

2. **Conectar no Railway**
   - Acesse [railway.app](https://railway.app/)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha este repositório

3. **Configuração Automática**
   - O Railway detectará automaticamente que é um projeto Node.js
   - O `package.json` já tem o script `start` configurado
   - O `Procfile` garante que o comando correto seja executado

4. **Variáveis de Ambiente (Opcional)**
   - O projeto usa `process.env.PORT` automaticamente
   - Não são necessárias configurações adicionais

5. **Deploy**
   - O Railway fará o deploy automaticamente
   - Você receberá uma URL pública para acessar o jogo

6. **Configurar Frontend**
   - Copie a URL do Railway
   - Edite `public/config.js` e atualize a URL
   - Faça upload no itch.io

## 🎮 Como Jogar

1. **Login**: Digite seu nome de usuário
2. **Seleção de Modo**: 
   - **Skirmish**: Jogo rápido com jogadores aleatórios
   - **Dominium**: Modo estratégico (em desenvolvimento)
3. **Lobby**: Aguarde outros jogadores ou CPUs
4. **Jogo**: Domine territórios e elimine seus oponentes!

## 🛠️ Tecnologias

- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: Phaser.js (Game Engine)
- **Deploy**: Railway (Backend) + itch.io (Frontend)
- **Comunicação**: WebSockets em tempo real

## 📁 Estrutura do Projeto

```
wargame/
├── server.js          # Servidor principal
├── package.json       # Dependências e scripts
├── Procfile          # Configuração Railway
├── public/           # Arquivos estáticos (upload no itch.io)
│   ├── config.js     # Configuração do servidor
│   ├── game.js       # Lógica do jogo (cliente)
│   ├── index.html    # Interface principal
│   └── assets/       # Imagens e sons
├── DEPLOY_README.md  # Guia completo de deploy
└── README.md         # Este arquivo
```

## 🔧 Scripts Disponíveis

- `npm start`: Inicia o servidor de produção
- `npm run dev`: Inicia o servidor de desenvolvimento

## 🌐 Acesso

### Backend (Railway)
`https://seu-projeto.railway.app`

### Frontend (itch.io)
`https://seu-usuario.itch.io/nome-do-jogo`

---

**Desenvolvido com ❤️ para jogadores de estratégia!**
