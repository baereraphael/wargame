# 🚀 Deploy do Jogo War Multiplayer

Este guia explica como fazer o deploy do jogo no itch.io com o servidor rodando no Railway.

## 📋 Pré-requisitos

1. **Conta no Railway**: Para hospedar o servidor
2. **Conta no itch.io**: Para hospedar o frontend do jogo
3. **Código do jogo**: Este repositório

## 🔧 Configuração do Servidor (Railway)

### 1. Deploy no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Crie um novo projeto
3. Conecte este repositório ou faça upload dos arquivos
4. Configure as variáveis de ambiente se necessário
5. Deploy o projeto

### 2. Obter a URL do Railway

Após o deploy, você receberá uma URL como:
```
https://your-app-name.railway.app
```

**Guarde esta URL!** Você precisará dela para configurar o frontend.

## 🎮 Configuração do Frontend (itch.io)

### 1. Atualizar a URL do Servidor

Edite o arquivo `public/config.js` e altere a URL do Railway:

```javascript
// Railway production server
railway: {
  url: 'https://SUA-URL-AQUI.railway.app', // ← COLOQUE SUA URL AQUI
  name: 'Railway Production'
},

// itch.io deployment
itch: {
  url: 'https://SUA-URL-AQUI.railway.app', // ← MESMA URL AQUI
  name: 'itch.io Production'
}
```

### 2. Preparar para Upload

1. Certifique-se de que o arquivo `config.js` está na pasta `public/`
2. Verifique se o `index.html` inclui o `config.js` antes do `game.js`

### 3. Upload no itch.io

1. Acesse [itch.io](https://itch.io) e faça login
2. Crie um novo projeto de jogo
3. Faça upload da pasta `public/` completa
4. Configure as opções do projeto
5. Publique o jogo

## 🔍 Verificação da Configuração

### Logs do Console

Abra o console do navegador (F12) e verifique se aparece:

```
🔧 Server Configuration:
  • Environment: itch.io
  • Server URL: https://sua-url.railway.app
  • To change server URL, edit config.js file
```

### Teste de Conexão

1. Abra o jogo no itch.io
2. Tente fazer login
3. Verifique se consegue conectar ao servidor
4. Se houver erro, verifique a URL no `config.js`

## 🚨 Solução de Problemas

### Erro de Conexão

**Sintoma**: Jogo não consegue conectar ao servidor
**Solução**: Verificar se a URL no `config.js` está correta

### CORS Error

**Sintoma**: Erro de CORS no console
**Solução**: Verificar se o servidor Railway está configurado para aceitar requisições do itch.io

### Socket.io não carrega

**Sintoma**: Erro "socket.io not found"
**Solução**: Verificar se o arquivo `socket.io.js` está sendo carregado corretamente

## 📁 Estrutura de Arquivos para Upload

```
public/
├── assets/           ← Todos os arquivos de mídia
├── config.js         ← Configuração do servidor
├── game.js           ← Lógica principal do jogo
├── index.html        ← Página principal
└── favicon.svg       ← Ícone do jogo
```

## 🔄 Atualizações

Para atualizar o jogo:

1. Modifique o código localmente
2. Atualize o `config.js` se necessário
3. Faça upload da pasta `public/` atualizada no itch.io
4. O servidor Railway continuará funcionando normalmente

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do navegador
2. Confirme se a URL do Railway está correta
3. Teste a conexão com o servidor Railway diretamente
4. Verifique se todos os arquivos foram uploadados corretamente

---

**Nota**: O servidor Railway deve estar rodando 24/7 para que o jogo funcione. Considere usar o plano gratuito ou pago conforme sua necessidade.
