const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Game Room Class for Multi-Room Support
class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    
    // Lobby variables
    this.lobbyActive = false;
    this.lobbyTimer = null;
    this.lobbyTimeLeft = 5; // 5 seconds
    this.gameStarted = false;
    
    // Players
    this.jogadores = [
  { nome: 'Azul', ativo: true, socketId: null, isCPU: false },
  { nome: 'Vermelho', ativo: true, socketId: null, isCPU: false },
  { nome: 'Verde', ativo: true, socketId: null, isCPU: false },
  { nome: 'Amarelo', ativo: true, socketId: null, isCPU: false },
  { nome: 'Preto', ativo: true, socketId: null, isCPU: false },
  { nome: 'Roxo', ativo: true, socketId: null, isCPU: false }
];

    // Game state
    this.indiceTurno = 0;
    this.turno = this.jogadores[this.indiceTurno].nome;
    this.vitoria = false;
    this.derrota = false;
    
    // Game data will be initialized in initializeGameData()
  }
  
  // Initialize game data (continents and countries)
  initializeGameData() {
    // Continents definition
    this.continentes = {
  'Thaloria': {
    nome: 'Thaloria',
    bonus: 5,
    territorios: ['Redwyn', 'Stormfen', 'Cragstone', 'Hollowspire', 'Westreach', 'Barrowfell', 'Highmoor', 'Frosthollow']
  },
  'Zarandis': {
    nome: 'Zarandis',
    bonus: 3,
    territorios: ['Stonevale', 'Emberlyn', 'Duskwatch', 'Ravenspire', 'Stormhall']
  },
  'Elyndra': {
    nome: 'Elyndra',
    bonus: 5,
    territorios: ['Frosthelm', 'Eldoria', 'Ironreach', 'Greymoor', 'Blackmere', 'Duskmere', 'Thalengarde']
  },
  'Kharune': {
    nome: 'Kharune',
    bonus: 4,
    territorios: ['Zul\'Marak', 'Emberwaste', 'Sunjara', 'Tharkuun', 'Bareshi', 'Oru\'Kai']
  },
  'Xanthera': {
    nome: 'Xanthera',
    bonus: 7,
    territorios: ['Nihadara', 'Shōrenji', 'Kaer\'Tai', 'Xin\'Qari', 'Vol\'Zareth', 'Sa\'Torran', 'Omradan', 'Mei\'Zhara', 'Qumaran', 'Darakai', 'Ish\'Tanor', 'Tzun\'Rakai']
  },
  'Mythara': {
    nome: 'Mythara',
    bonus: 2,
    territorios: ['Mistveil', 'Dawnwatch', 'Aetheris', 'Winterholde']
  }
};

    // Countries definition
    this.paises = [
  { nome: 'Emberlyn', x: 402, y: 396, dono: 'Azul', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
  { nome: 'Ravenspire', x: 463, y: 450, dono: 'Vermelho', tropas: 5, vizinhos: ['Emberlyn','Duskwatch', 'Stormhall','Zul\'Marak'] },
  { nome: 'Stonevale', x: 356, y: 404, dono: 'Amarelo', tropas: 5, vizinhos: ['Emberlyn', 'Duskwatch',`Barrowfell`] },
  { nome: 'Duskwatch', x: 293, y: 454, dono: 'Verde', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Emberlyn', 'Stormhall'] },
  { nome: 'Stormhall', x: 325, y: 581, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne','Duskwatch'] },
  { nome: 'Redwyn', x: 111, y: 194, dono: 'Preto', tropas: 5, vizinhos: ['Stormfen', 'Cragstone', 'Omradan'] },
  { nome: 'Stormfen', x: 111, y: 194, dono: 'Roxo', tropas: 5, vizinhos: ['Redwyn', 'Cragstone',`Frosthollow`] },
  { nome: 'Highmoor', x: 305, y: 165, dono: 'Amarelo', tropas: 5, vizinhos: [`Frosthollow`, 'Cragstone','Westreach'] },
  { nome: 'Cragstone', x: 127, y: 264, dono: 'Verde', tropas: 5, vizinhos: ['Stormfen', 'Highmoor','Hollowspire'] },
  { nome: 'Hollowspire', x: 253, y: 222, dono: 'Preto', tropas: 5, vizinhos: ['Cragstone', 'Westreach'] },
  { nome: 'Westreach', x: 160, y: 340, dono: 'Roxo', tropas: 5, vizinhos: ['Hollowspire', 'Barrowfell','Highmoor'] },
  { nome: 'Barrowfell', x: 161, y: 343, dono: 'Azul', tropas: 5, vizinhos: ['Hollowspire', 'Westreach','Stonevale'] },
  { nome: 'Zul\'Marak', x: 527, y: 367, dono: 'Azul', tropas: 5, vizinhos: ['Emberwaste', 'Ravenspire', 'Duskmere','Thalengarde'] },
  { nome: 'Emberwaste', x: 663, y: 354, dono: 'Vermelho', tropas: 5, vizinhos: ['Zul\'Marak', 'Sunjara', 'Tharkuun','Duskmere','Kaer\'Tai'] },
  { nome: 'Sunjara', x: 783, y: 341, dono: 'Verde', tropas: 5, vizinhos: ['Emberwaste', 'Bareshi', 'Oru\'Kai', 'Kaer\'Tai','Tharkuun'] },
  { nome: 'Tharkuun', x: 625, y: 466, dono: 'Amarelo', tropas: 5, vizinhos: ['Sunjara', 'Emberwaste', 'Bareshi'] },
  { nome: 'Bareshi', x: 706, y: 456, dono: 'Preto', tropas: 5, vizinhos: ['Sunjara', 'Tharkuun', 'Oru\'Kai'] },
  { nome: 'Oru\'Kai', x: 809, y: 494, dono: 'Roxo', tropas: 5, vizinhos: ['Sunjara', 'Bareshi'] },
  { nome: 'Frosthollow', x: 310, y: 112, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Stormfen','Highmoor'] },
  { nome: 'Eldoria', x: 508, y: 130, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthollow', 'Greymoor', 'Ironreach','Frosthelm'] },
  { nome: 'Greymoor', x: 525, y: 193, dono: 'Verde', tropas: 5, vizinhos: ['Eldoria', 'Thalengarde', 'Duskmere','Ironreach'] },
  { nome: 'Thalengarde', x: 487, y: 262, dono: 'Amarelo', tropas: 5, vizinhos: ['Greymoor', 'Duskmere', 'Zul\'Marak'] },
  { nome: 'Duskmere', x: 555, y: 246, dono: 'Preto', tropas: 5, vizinhos: ['Greymoor', 'Thalengarde', 'Ironreach', 'Blackmere', 'Zul\'Marak','Emberwaste','Kaer\'Tai','Shōrenji'] },
  { nome: 'Ironreach', x: 533, y: 163, dono: 'Roxo', tropas: 5, vizinhos: ['Eldoria', 'Blackmere', 'Duskmere', 'Frosthelm','Greymoor'] },
  { nome: 'Frosthelm', x: 630, y: 113, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Ironreach', 'Blackmere'] },
  { nome: 'Blackmere', x: 592, y: 145, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthelm', 'Duskmere','Ironreach','Nihadara','Shōrenji'] },
  { nome: 'Kaer\'Tai', x: 711, y: 237, dono: 'Azul', tropas: 5, vizinhos: ['Shōrenji', 'Duksmere', 'Sunjara','Emberwaste','Qumaran','Darakai'] },
  { nome: 'Shōrenji', x: 823, y: 269, dono: 'Vermelho', tropas: 5, vizinhos: ['Kaer\'Tai', 'Nihadara', 'Xin\'Qari','Qumaran','Duskmere','Blackmere'] },
  { nome: 'Nihadara', x: 715, y: 135, dono: 'Verde', tropas: 5, vizinhos: ['Blackmere', 'Shōrenji', 'Xin\'Qari'] },
  { nome: 'Xin\'Qari', x: 826, y: 117, dono: 'Amarelo', tropas: 5, vizinhos: ['Shōrenji', 'Nihadara', 'Vol\'Zareth', 'Sa\'Torran','Mei\'Zhara'] },
  { nome: 'Vol\'Zareth', x: 1048, y: 124, dono: 'Preto', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan','Sa\'Torran'] },
  { nome: 'Omradan', x: 1050, y: 124, dono: 'Roxo', tropas: 5, vizinhos: ['Vol\'Zareth', 'Sa\'Torran', 'Qumaran','Tzun\'Rakai'] },
  { nome: 'Sa\'Torran', x: 897, y: 218, dono: 'Azul', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan', 'Qumaran', 'Mei\'Zhara','Vol\'Zareth'] },
  { nome: 'Qumaran', x: 1060, y: 247, dono: 'Vermelho', tropas: 5, vizinhos: ['Omradan', 'Sa\'Torran', 'Tzun\'Rakai', 'Darakai', 'Shōrenji','Kaer\'Tai','Ish\'Tanor'] },
  { nome: 'Tzun\'Rakai', x: 1122, y: 274, dono: 'Verde', tropas: 5, vizinhos: ['Qumaran', 'Omradan'] },
  { nome: 'Mei\'Zhara', x: 866, y: 220, dono: 'Amarelo', tropas: 5, vizinhos: ['Sa\'Torran', 'Qumaran', 'Xin\'Qari'] },
  { nome: 'Darakai', x: 961, y: 352, dono: 'Preto', tropas: 5, vizinhos: ['Qumaran', 'Kaer\'Tai', 'Ish\'Tanor','Winterholde'] },
  { nome: 'Ish\'Tanor', x: 963, y: 349, dono: 'Roxo', tropas: 5, vizinhos: ['Tzun\'Rakai', 'Darakai', 'Winterholde','Qumaran'] },
  { nome: 'Winterholde', x: 1020, y: 491, dono: 'Azul', tropas: 5, vizinhos: ['Ish\'Tanor', 'Mistveil','Darakai'] },
  { nome: 'Aetheris', x: 1094, y: 458, dono: 'Vermelho', tropas: 5, vizinhos: ['Ish\'Tanor', 'Dawnwatch', 'Mistveil'] },
  { nome: 'Dawnwatch', x: 1113, y: 475, dono: 'Verde', tropas: 5, vizinhos: ['Aetheris', 'Mistveil'] },
  { nome: 'Mistveil', x: 1078, y: 511, dono: 'Amarelo', tropas: 5, vizinhos: ['Winterholde', 'Aetheris', 'Dawnwatch'] }
];

    // Game state variables
    this.tropasReforco = 0;
    this.tropasBonusContinente = {}; // Track bonus troops by continent
    this.faseRemanejamento = false; // Controla se está na fase de remanejamento

// Sistema de objetivos
    this.objetivos = {}; // { jogador: objetivo }

// Sistema de controle de movimentação de tropas durante remanejamento
    this.movimentosRemanejamento = {}; // { jogador: { origem: { destino: quantidade } } }

// Sistema de cartas território
    this.territoriosConquistadosNoTurno = {}; // { jogador: [territorios] }
    this.cartasTerritorio = {}; // { jogador: [cartas] }
    this.monteCartas = []; // Monte de cartas território disponíveis
    this.simbolosCartas = ['▲', '■', '●', '★']; // Triângulo, quadrado, círculo, coringa
    this.numeroTrocasRealizadas = 0; // Contador de trocas para bônus progressivo

// Tipos de objetivos
    this.tiposObjetivos = [
  'conquistar3Continentes',
  'eliminarJogador', 
  'dominar24Territorios',
  'dominar16TerritoriosCom2Tropas'
];

    // Inicializar o monte de cartas território
    this.inicializarMonteCartas();
  }

  // Função para inicializar o monte de cartas território
  inicializarMonteCartas() {
    this.monteCartas = [];
    
    // Criar uma carta para cada território
    this.paises.forEach(pais => {
      // Escolher um símbolo aleatório para cada território
      const simbolo = this.simbolosCartas[Math.floor(Math.random() * this.simbolosCartas.length)];
      
      const carta = {
        territorio: pais.nome,
        simbolo: simbolo
      };
      
      this.monteCartas.push(carta);
    });
    
    // Embaralhar o monte
    this.embaralharMonte();
    
    console.log(`🎴 Monte de cartas inicializado com ${this.monteCartas.length} cartas`);
  }

  // Função para embaralhar o monte de cartas
  embaralharMonte() {
    for (let i = this.monteCartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.monteCartas[i], this.monteCartas[j]] = [this.monteCartas[j], this.monteCartas[i]];
    }
  }

  // Função para pegar uma carta do monte
  pegarCartaDoMonte() {
    if (this.monteCartas.length === 0) {
      console.log('⚠️ Monte de cartas vazio!');
      return null;
    }
    
    return this.monteCartas.pop();
  }

    // Função para devolver cartas ao monte
  devolverCartasAoMonte(cartas) {
    cartas.forEach(carta => {
      this.monteCartas.push(carta);
    });
    
    // Embaralhar o monte após devolver as cartas
    this.embaralharMonte();
    
    console.log(`🎴 ${cartas.length} cartas devolvidas ao monte. Monte agora tem ${this.monteCartas.length} cartas`);
  }
}

// Global rooms management
const gameRooms = new Map();
let nextRoomId = 1;

// Global Lobby Management
const globalLobby = {
  players: [],
  timer: null,
  timeLeft: 30, // 30 seconds
  active: false
};

// Helper function to get or create a room
function getOrCreateRoom(roomId) {
  if (!gameRooms.has(roomId)) {
    const room = new GameRoom(roomId);
    room.initializeGameData();
    gameRooms.set(roomId, room);
  }
  return gameRooms.get(roomId);
}

// Global Lobby Functions
function startGlobalLobby() {
  if (globalLobby.active) return;
  
  console.log('🌍 Iniciando lobby global...');
  globalLobby.active = true;
  globalLobby.timeLeft = 30;
  
  // Start global lobby timer
  globalLobby.timer = setInterval(() => {
    globalLobby.timeLeft--;
    
    // Send update to all players in global lobby
    globalLobby.players.forEach(player => {
      const socket = io.sockets.sockets.get(player.socketId);
      if (socket) {
        socket.emit('globalLobbyUpdate', {
          players: globalLobby.players,
          timeLeft: globalLobby.timeLeft,
          connectedPlayers: globalLobby.players.length,
          totalPlayers: 6
        });
      }
    });
    
    // Check if timer expired
    if (globalLobby.timeLeft <= 0) {
      console.log('⏰ Timer do lobby global expirou! Criando sala...');
      createRoomFromGlobalLobby();
      return;
    }
    
    // Debug log every 5 seconds
    if (globalLobby.timeLeft % 5 === 0) {
      console.log(`⏰ Lobby global: ${globalLobby.timeLeft}s restantes, ${globalLobby.players.length} jogadores`);
    }
  }, 1000);
}

function createRoomFromGlobalLobby() {
  console.log('🔧 DEBUG: createRoomFromGlobalLobby() iniciada');
  
  if (globalLobby.timer) {
    clearInterval(globalLobby.timer);
    globalLobby.timer = null;
    console.log('🔧 DEBUG: Timer do lobby global limpo');
  }
  
  globalLobby.active = false;
  console.log('🔧 DEBUG: Lobby global desativado');
  
  // Create a new room
  const roomId = nextRoomId.toString();
  nextRoomId++;
  console.log(`🔧 DEBUG: Criando sala com ID: ${roomId}`);
  
  const room = getOrCreateRoom(roomId);
  console.log(`🔧 DEBUG: Sala ${roomId} obtida/criada`);
  
  // Assign players to the room
  console.log(`🔧 DEBUG: Atribuindo ${globalLobby.players.length} jogadores à sala`);
  globalLobby.players.forEach((player, index) => {
    if (index < 6) { // Maximum 6 players
      const jogador = room.jogadores[index];
      jogador.socketId = player.socketId;
      jogador.isCPU = false;
      
      console.log(`🔧 DEBUG: Jogador ${player.username} atribuído a ${jogador.nome} (socket: ${player.socketId})`);
      
      // Join the player to the room
      const socket = io.sockets.sockets.get(player.socketId);
      if (socket) {
        socket.join(roomId);
        console.log(`🔧 DEBUG: Socket ${player.socketId} entrou na sala ${roomId}`);
      } else {
        console.log(`🔧 DEBUG: ERRO - Socket ${player.socketId} não encontrado!`);
      }
    }
  });
  
  // Fill remaining slots with CPUs
  const cpuSlots = 6 - globalLobby.players.length;
  console.log(`🔧 DEBUG: Preenchendo ${cpuSlots} slots com CPUs`);
  for (let i = globalLobby.players.length; i < 6; i++) {
    room.jogadores[i].isCPU = true;
    room.jogadores[i].socketId = null;
    console.log(`🔧 DEBUG: CPU ativada para ${room.jogadores[i].nome}`);
  }
  
  console.log(`🎮 Sala ${roomId} criada com ${globalLobby.players.length} jogadores reais e ${6 - globalLobby.players.length} CPUs`);
  
  // Notify all players that game is starting
  console.log(`🔧 DEBUG: Emitindo gameStarting para sala ${roomId}`);
  io.to(roomId).emit('gameStarting', { roomId: roomId });
  
  // Start the game
  console.log(`🔧 DEBUG: Chamando startGame(${roomId})`);
  startGame(roomId);
  
  // Clear global lobby
  globalLobby.players = [];
  console.log('🔧 DEBUG: Lobby global limpo');
}

function addPlayerToGlobalLobby(socketId, username) {
  // Check if player is already in lobby
  const existingPlayer = globalLobby.players.find(p => p.socketId === socketId);
  if (existingPlayer) return;
  
  // Add player to global lobby
  globalLobby.players.push({
    socketId: socketId,
    username: username
  });
  
  console.log(`👤 ${username} adicionado ao lobby global (${globalLobby.players.length}/6)`);
  
  // Start global lobby if this is the first player
  if (globalLobby.players.length === 1 && !globalLobby.active) {
    startGlobalLobby();
  }
  
  // Send update to all players in global lobby
  globalLobby.players.forEach(player => {
    const socket = io.sockets.sockets.get(player.socketId);
    if (socket) {
      socket.emit('globalLobbyUpdate', {
        players: globalLobby.players,
        timeLeft: globalLobby.timeLeft,
        connectedPlayers: globalLobby.players.length,
        totalPlayers: 6
      });
    }
  });
}

function removePlayerFromGlobalLobby(socketId) {
  const index = globalLobby.players.findIndex(p => p.socketId === socketId);
  if (index !== -1) {
    const player = globalLobby.players[index];
    console.log(`👤 ${player.username} removido do lobby global`);
    globalLobby.players.splice(index, 1);
    
    // Send update to all players in global lobby
    globalLobby.players.forEach(player => {
      const socket = io.sockets.sockets.get(player.socketId);
      if (socket) {
        socket.emit('globalLobbyUpdate', {
          players: globalLobby.players,
          timeLeft: globalLobby.timeLeft,
          connectedPlayers: globalLobby.players.length,
          totalPlayers: 6
        });
      }
    });
  }
}

// All game state is now encapsulated in GameRoom instances





app.use(express.static('public')); // coloque seu index.html e assets na pasta public

// Handle favicon.ico requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content - prevents 404 error
});

io.on('connection', (socket) => {
  console.log('Novo jogador conectado');

  // Handle player joining global lobby
  socket.on('playerJoinedGlobalLobby', (data) => {
    console.log(`🌍 ${data.username} entrou no lobby global`);
    
    // Add player to global lobby
    addPlayerToGlobalLobby(socket.id, data.username);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Jogador desconectado:', socket.id);
    
    // Remove from global lobby first
    removePlayerFromGlobalLobby(socket.id);
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        jogador.socketId = null;
        console.log(`Socket ${socket.id} removido de ${jogador.nome} na sala ${roomId}`);
        break;
      }
    }
    
    // Send lobby update to the room if found
    if (playerRoom) {
      sendLobbyUpdate(playerRoom.roomId);
    }
  });
  
  // Game events (only active after game starts)
  socket.on('transferirTropasConquista', (dados) => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota) return;
    
    // Verificar se está na fase de remanejamento (não pode transferir tropas de conquista)
    if (playerRoom.faseRemanejamento) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', `❌ ${playerRoom.turno} não pode transferir tropas durante a fase de remanejamento!`);
      return;
    }

    const territorioAtacante = playerRoom.paises.find(p => p.nome === dados.territorioAtacante);
    const territorioConquistado = playerRoom.paises.find(p => p.nome === dados.territorioConquistado);
    
    if (!territorioAtacante || !territorioConquistado) return;
    if (territorioAtacante.dono !== playerRoom.turno || territorioConquistado.dono !== playerRoom.turno) return;
            if (dados.quantidade < 1 || dados.quantidade > 3) return; // Mínimo 1 (automática), máximo 3 (1 automática + 2 adicionais)
    if (territorioAtacante.tropas - (dados.quantidade - 1) < 1) return; // Garantir pelo menos 1 tropa no atacante (descontando a automática)

    // Transferir tropas (1 já foi automaticamente transferida)
    const tropasAdicionais = dados.quantidade - 1; // Descontar a tropa automática
    territorioAtacante.tropas -= tropasAdicionais;
    territorioConquistado.tropas += tropasAdicionais;

    const mensagem = tropasAdicionais > 0 
      ? `${playerRoom.turno} transferiu ${tropasAdicionais} tropas adicionais de ${dados.territorioAtacante} para ${dados.territorioConquistado} (1 automática + ${tropasAdicionais} opcionais)`
      : `${playerRoom.turno} manteve apenas a tropa automática em ${dados.territorioConquistado}`;
    io.to(playerRoom.roomId).emit('mostrarMensagem', mensagem);
    io.to(playerRoom.roomId).emit('tocarSomMovimento');

    // Send updated state to all clients in this room
    enviarEstadoParaTodos(playerRoom);
    
    // Verificar vitória após transferir tropas
    checarVitoria(playerRoom);
  });

  socket.on('chatMessage', (dados) => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom) return;
    
    // Broadcast the chat message to all players in this room
    io.to(playerRoom.roomId).emit('chatMessage', {
      player: dados.player,
      message: dados.message,
      timestamp: new Date()
    });
  });

  socket.on('colocarReforco', (nomePais) => {
    console.log(`🔧 colocarReforco recebido: ${nomePais} do socket ${socket.id}`);
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) {
      console.log(`❌ Sala não encontrada ou jogo não iniciado`);
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota) {
      console.log(`❌ Não é o turno do jogador ou jogo terminado`);
      return;
    }
    
    // Verificar se está na fase de remanejamento (não pode colocar reforços)
    if (playerRoom.faseRemanejamento) {
      console.log(`❌ Jogador tentou colocar reforço durante fase de remanejamento`);
      io.to(playerRoom.roomId).emit('mostrarMensagem', `❌ ${playerRoom.turno} não pode colocar reforços durante a fase de remanejamento!`);
      return;
    }

    const pais = playerRoom.paises.find(p => p.nome === nomePais);
    
    if (!pais || pais.dono !== playerRoom.turno) {
      console.log(`❌ País não encontrado ou não pertence ao jogador atual`);
      return;
    }

    // Verificar se há tropas de bônus de continente para colocar
    let podeColocar = false;
    let continenteBonus = null;
    let mensagemErro = null;
    
    // Ordenar continentes por bônus (maior para menor)
    const continentesOrdenados = Object.entries(playerRoom.tropasBonusContinente)
      .filter(([nome, quantidade]) => quantidade > 0)
      .sort((a, b) => {
        const bonusA = playerRoom.continentes[a[0]].bonus;
        const bonusB = playerRoom.continentes[b[0]].bonus;
        return bonusB - bonusA; // Ordem decrescente
      });
    
    // Verificar se o país pertence ao continente com maior prioridade
    if (continentesOrdenados.length > 0) {
      const [nomeContinente, quantidade] = continentesOrdenados[0];
      const continente = playerRoom.continentes[nomeContinente];
      
      if (continente.territorios.includes(nomePais)) {
        // Pode colocar tropa de bônus neste país
        playerRoom.tropasBonusContinente[nomeContinente] -= 1;
        continenteBonus = nomeContinente;
        podeColocar = true;
      } else {
        // País não pertence ao continente prioritário
        const outrosContinentes = continentesOrdenados.slice(1);
        const podeColocarEmOutro = outrosContinentes.some(([nome, qty]) => {
          const cont = playerRoom.continentes[nome];
          return cont.territorios.includes(nomePais);
        });
        
        if (podeColocarEmOutro) {
          mensagemErro = `❌ Primeiro coloque todas as tropas de bônus do continente ${nomeContinente} (${quantidade} restantes)!`;
        } else {
          mensagemErro = `❌ Este país não pertence a nenhum continente com tropas de bônus pendentes!`;
        }
      }
    }
    
    // Se não conseguiu colocar tropa de bônus, verificar se pode colocar tropa base
    if (!podeColocar && !mensagemErro) {
      // Verificar se ainda há tropas de bônus pendentes
      const totalTropasBonus = Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
      
      if (totalTropasBonus > 0) {
        // Ainda há tropas de bônus para colocar, não pode colocar tropas base
        const [nomeContinente, quantidade] = continentesOrdenados[0];
        mensagemErro = `❌ Primeiro coloque todas as ${totalTropasBonus} tropas de bônus restantes! (${nomeContinente}: ${quantidade})`;
      } else if (playerRoom.tropasReforco > 0) {
        // Não há mais tropas de bônus, pode colocar tropas base
        podeColocar = true;
      } else {
        // Não há mais tropas para colocar
        mensagemErro = `❌ Não há mais tropas para colocar!`;
      }
    }

    if (mensagemErro) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', mensagemErro);
      return;
    }

    if (podeColocar) {
      console.log(`✅ Reforço aplicado em ${nomePais}`);
      pais.tropas += 1;
      
      // Só decrementar tropasReforco se não foi uma tropa de bônus
      if (!continenteBonus) {
        playerRoom.tropasReforco -= 1;
      }
      
      const mensagem = continenteBonus 
        ? `${playerRoom.turno} colocou 1 tropa de bônus (${continenteBonus}) em ${nomePais}. Reforços restantes: ${playerRoom.tropasReforco} base + ${Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`
        : `${playerRoom.turno} colocou 1 tropa em ${nomePais}. Reforços restantes: ${playerRoom.tropasReforco} base + ${Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`;
      
      io.to(playerRoom.roomId).emit('mostrarMensagem', mensagem);
      io.to(playerRoom.roomId).emit('tocarSomMovimento'); // Emitir evento para tocar som de movimento
      
      // Mostrar efeito visual de reforço
      io.to(playerRoom.roomId).emit('mostrarEfeitoReforco', {
        territorio: nomePais,
        jogador: playerRoom.turno,
        tipo: 'reforco'
      });

      // Send updated state to all clients in this room
      enviarEstadoParaTodos(playerRoom);
      
      // Verificar vitória após colocar reforço
      checarVitoria(playerRoom);
    } else {
      console.log(`❌ Não foi possível colocar reforço: ${mensagemErro}`);
    }
  });

    socket.on('atacar', ({ de, para }) => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota) return;
    
    // Verificar se está na fase de remanejamento (não pode atacar)
    if (playerRoom.faseRemanejamento) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', `❌ ${playerRoom.turno} não pode atacar durante a fase de remanejamento!`);
      return;
    }
    
    const atacantePais = playerRoom.paises.find(p => p.nome === de);
    const defensorPais = playerRoom.paises.find(p => p.nome === para);

    if (!atacantePais || !defensorPais) return;
    if (atacantePais.dono !== playerRoom.turno) return;
    if (!atacantePais.vizinhos.includes(defensorPais.nome)) return;
    if (atacantePais.tropas <= 1) return;

    // Número de dados de ataque: mínimo entre tropas - 1 e 3
    const dadosAtaque = Math.min(atacantePais.tropas - 1, 3);
    const dadosDefesa = Math.min(defensorPais.tropas, 2);

    const rolagemAtaque = Array.from({ length: dadosAtaque }, rolarDado).sort((a, b) => b - a);
    const rolagemDefesa = Array.from({ length: dadosDefesa }, rolarDado).sort((a, b) => b - a);

    let resultadoMensagem = `${de} ataca ${para}
    Ataque: [${rolagemAtaque.join(', ')}] | Defesa: [${rolagemDefesa.join(', ')}]\n`;

    const comparacoes = Math.min(rolagemAtaque.length, rolagemDefesa.length);
    for (let i = 0; i < comparacoes; i++) {
        if (rolagemAtaque[i] > rolagemDefesa[i]) {
        defensorPais.tropas--;
        resultadoMensagem += `Defesa perdeu 1 tropa.\n`;
        } else {
        atacantePais.tropas--;
        resultadoMensagem += `Ataque perdeu 1 tropa.\n`;
        }
    }

    if (defensorPais.tropas <= 0) {
        defensorPais.dono = atacantePais.dono;
        defensorPais.tropas = 1; // Colocar 1 tropa no território conquistado
        atacantePais.tropas -= 1; // Remover 1 tropa do território atacante
        resultadoMensagem += `${para} foi conquistado por ${playerRoom.turno}!\n`;
        
        // Registrar território conquistado no turno atual
        if (!playerRoom.territoriosConquistadosNoTurno[playerRoom.turno]) {
          playerRoom.territoriosConquistadosNoTurno[playerRoom.turno] = [];
        }
        playerRoom.territoriosConquistadosNoTurno[playerRoom.turno].push(para);
        
        // Calcular tropas disponíveis para transferência (incluindo a tropa automática)
        const tropasAdicionais = Math.min(atacantePais.tropas - 1, 2); // Máximo 2 tropas adicionais, mínimo 1 no atacante
        const tropasDisponiveis = tropasAdicionais + 1; // Incluir a tropa automática no total
        
        // Se há tropas adicionais disponíveis, mostrar interface de escolha
        if (tropasAdicionais > 0) {
          // Emitir evento para mostrar interface de transferência de tropas
          io.to(playerRoom.roomId).emit('territorioConquistado', {
            territorioConquistado: para,
            territorioAtacante: de,
            tropasDisponiveis: tropasDisponiveis, // Total incluindo tropa automática
            tropasAdicionais: tropasAdicionais, // Apenas tropas adicionais (sem a automática)
            jogadorAtacante: playerRoom.turno
          });
        } else {
          // Apenas a tropa automática foi transferida, não há escolha a fazer
          resultadoMensagem += `Apenas a tropa automática foi transferida para ${para}.\n`;
        }
        
        // Verificar se conquistou algum continente
        Object.values(playerRoom.continentes).forEach(continente => {
          const territoriosDoContinente = continente.territorios;
          const territoriosConquistados = territoriosDoContinente.filter(territorio => {
            const pais = playerRoom.paises.find(p => p.nome === territorio);
            return pais && pais.dono === playerRoom.turno;
          });
          
          if (territoriosConquistados.length === territoriosDoContinente.length) {
            resultadoMensagem += `🎉 ${playerRoom.turno} conquistou o continente ${continente.nome}! (+${continente.bonus} tropas por rodada)\n`;
          }
        });
        
        checarEliminacao(playerRoom);
        
        // Verificar vitória após conquista
        checarVitoria(playerRoom);
    }

    io.to(playerRoom.roomId).emit('mostrarMensagem', resultadoMensagem.trim());
    io.to(playerRoom.roomId).emit('tocarSomTiro'); // Emitir evento para tocar som de tiro
    
    // Mostrar efeito visual de ataque
    const sucesso = defensorPais.tropas <= 0;
    io.to(playerRoom.roomId).emit('mostrarEfeitoAtaque', {
      origem: de,
      destino: para,
      sucesso: sucesso
    });
    
    // Send updated state to all clients in this room
    enviarEstadoParaTodos(playerRoom);

    });

  socket.on('passarTurno', () => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== playerRoom.turno) return;
    if (playerRoom.vitoria || playerRoom.derrota) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', 'O jogo já terminou!');
      return;
    }

    // Verificar se ainda há tropas de bônus não colocadas
    const tropasBonusRestantes = Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    if (tropasBonusRestantes > 0) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', `❌ ${playerRoom.turno} ainda tem ${tropasBonusRestantes} tropas de bônus de continente para colocar!`);
      return;
    }

    // Se não está na fase de remanejamento, iniciar a fase de remanejamento
    if (!playerRoom.faseRemanejamento) {
      playerRoom.faseRemanejamento = true;
      io.to(playerRoom.roomId).emit('mostrarMensagem', `🔄 ${playerRoom.turno} está na fase de remanejamento. Clique em um território para mover tropas.`);
      io.to(playerRoom.roomId).emit('iniciarFaseRemanejamento');
      enviarEstadoParaTodos(playerRoom);
      return;
    }

    // Se está na fase de remanejamento, passar para o próximo jogador
    playerRoom.faseRemanejamento = false;
    
    // Processar cartas do jogador atual (se for humano)
    processarCartasJogador(playerRoom.turno, playerRoom);
    
    // Limpar o controle de movimentos do jogador atual
    if (playerRoom.movimentosRemanejamento[playerRoom.turno]) {
      delete playerRoom.movimentosRemanejamento[playerRoom.turno];
    }
    
    // Ativar CPUs se necessário
    ativarCPUs(playerRoom);
    
    let encontrouJogadorAtivo = false;
    let tentativas = 0;
    do {
      playerRoom.indiceTurno = (playerRoom.indiceTurno + 1) % playerRoom.jogadores.length;
      tentativas++;
      if (playerRoom.jogadores[playerRoom.indiceTurno].ativo) {
        encontrouJogadorAtivo = true;
      }
      if (tentativas > playerRoom.jogadores.length) {
        encontrouJogadorAtivo = false;
        break;
      }
    } while (!encontrouJogadorAtivo);

    if (!encontrouJogadorAtivo) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', 'Não há jogadores ativos!');
      return;
    }

    playerRoom.turno = playerRoom.jogadores[playerRoom.indiceTurno].nome;
    
    const resultadoReforco = calcularReforco(playerRoom.turno, playerRoom);
    playerRoom.tropasReforco = resultadoReforco.base;
    playerRoom.tropasBonusContinente = resultadoReforco.bonus;

    io.to(playerRoom.roomId).emit('mostrarMensagem', `🎮 Turno de ${playerRoom.turno}. Reforços: ${playerRoom.tropasReforco} base + ${Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
    enviarEstadoParaTodos(playerRoom);
    
    // Verificar se é turno de CPU
    verificarTurnoCPU(playerRoom);

  });

  // Player inactive event - handle player disconnection due to inactivity
  socket.on('playerInactive', (data) => {
    console.log('🚫 Player inactive event received:', data);
    console.log('🚫 Socket ID:', socket.id);
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        console.log('🚫 Found player room:', roomId);
        break;
      }
    }
    
    if (!playerRoom) {
      console.log('🚫 No player room found for socket:', socket.id);
      return;
    }
    
    if (!playerRoom.gameStarted) {
      console.log('🚫 Game not started in room:', playerRoom.roomId);
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (!jogador) {
      console.log('🚫 No player found for socket:', socket.id);
      return;
    }
    
    console.log(`🚫 Converting inactive player ${jogador.nome} to CPU`);
    console.log(`🚫 Current turn: ${playerRoom.turno}`);
    console.log(`🚫 Is this player's turn? ${playerRoom.turno === jogador.nome}`);
    
    // Convert player to CPU
    jogador.isCPU = true;
    jogador.ativo = true;
    jogador.socketId = null; // Remove socket association
    
    console.log(`🚫 Player ${jogador.nome} converted to CPU`);
    
    // Notify other players
    io.to(playerRoom.roomId).emit('mostrarMensagem', `🤖 ${jogador.nome} foi desconectado por inatividade e substituído por uma CPU`);
    
    // Send updated state
    enviarEstadoParaTodos(playerRoom);
    
    // If it was this player's turn, continue with CPU turn
    if (playerRoom.turno === jogador.nome) {
      console.log(`🚫 Continuing with CPU turn for ${jogador.nome}`);
      verificarTurnoCPU(playerRoom);
    } else {
      console.log(`🚫 Not this player's turn, continuing normally`);
    }
  });

  // Force turn change event for timer timeout
  socket.on('forceTurnChange', () => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== playerRoom.turno) return;
    
    console.log(`⏰ Forcing turn change due to timeout for ${playerRoom.turno} in room ${playerRoom.roomId}`);
    
    // Force end any current phase
    playerRoom.faseRemanejamento = false;
    
    // Clear any remaining bonus troops
    playerRoom.tropasBonusContinente = {};
    
    // Process cards for current player
    processarCartasJogador(playerRoom.turno, playerRoom);
    
    // Clear movement control for current player
    if (playerRoom.movimentosRemanejamento[playerRoom.turno]) {
      delete playerRoom.movimentosRemanejamento[playerRoom.turno];
    }
    
    // Activate CPUs if needed
    ativarCPUs(playerRoom);
    
    // Find next active player
    let encontrouJogadorAtivo = false;
    let tentativas = 0;
    do {
      playerRoom.indiceTurno = (playerRoom.indiceTurno + 1) % playerRoom.jogadores.length;
      tentativas++;
      if (playerRoom.jogadores[playerRoom.indiceTurno].ativo) {
        encontrouJogadorAtivo = true;
      }
      if (tentativas > playerRoom.jogadores.length) {
        encontrouJogadorAtivo = false;
        break;
      }
    } while (!encontrouJogadorAtivo);

    if (!encontrouJogadorAtivo) {
      io.to(playerRoom.roomId).emit('mostrarMensagem', 'Não há jogadores ativos!');
      return;
    }

    playerRoom.turno = playerRoom.jogadores[playerRoom.indiceTurno].nome;
    
    const resultadoReforco = calcularReforco(playerRoom.turno, playerRoom);
    playerRoom.tropasReforco = resultadoReforco.base;
    playerRoom.tropasBonusContinente = resultadoReforco.bonus;

    io.to(playerRoom.roomId).emit('mostrarMensagem', `⏰ Turno forçado para ${playerRoom.turno} devido ao timeout. Reforços: ${playerRoom.tropasReforco} base + ${Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
    enviarEstadoParaTodos(playerRoom);
    
    // Check if it's CPU turn
    verificarTurnoCPU(playerRoom);
  });

  socket.on('consultarObjetivo', () => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (!jogador) return;
    
    const objetivo = playerRoom.objetivos[jogador.nome];
    if (objetivo) {
      socket.emit('mostrarObjetivo', objetivo);
    }
  });

  socket.on('consultarCartasTerritorio', () => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (!jogador) return;
    
    const cartas = playerRoom.cartasTerritorio[jogador.nome] || [];
    socket.emit('mostrarCartasTerritorio', cartas);
  });

  socket.on('trocarCartasTerritorio', (cartasSelecionadas) => {
    console.log(`🔧 trocarCartasTerritorio recebido:`, cartasSelecionadas);
    console.log(`🔧 Tipo dos dados recebidos:`, Array.isArray(cartasSelecionadas) ? 'Array' : 'Outro tipo');
    console.log(`🔧 Length dos dados:`, cartasSelecionadas ? cartasSelecionadas.length : 'undefined');
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) {
      console.log(`❌ Sala não encontrada ou jogo não iniciado`);
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    console.log(`🔧 Jogador: ${jogador?.nome}, Turno atual: ${playerRoom.turno}`);
    
    if (!jogador || jogador.nome !== playerRoom.turno) {
      console.log(`❌ Não é o turno do jogador`);
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Não é sua vez!' });
      return;
    }
    
    // Verificar se está na fase de remanejamento (não pode trocar cartas)
    if (playerRoom.faseRemanejamento) {
      console.log(`❌ Jogador tentou trocar cartas durante fase de remanejamento`);
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: '❌ Não é possível trocar cartas durante a fase de remanejamento!' });
      return;
    }

    const cartas = playerRoom.cartasTerritorio[jogador.nome] || [];
    
    // Verificar se tem exatamente 3 cartas selecionadas
    if (cartasSelecionadas.length !== 3) {
      console.log(`❌ Número incorreto de cartas selecionadas: ${cartasSelecionadas.length}`);
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Você deve selecionar exatamente 3 cartas para trocar!' });
      return;
    }

    // Verificar se todas as cartas selecionadas existem no deck do jogador
    const cartasValidas = cartasSelecionadas.every(territorio => cartas.some(carta => carta.territorio === territorio));
    
    if (!cartasValidas) {
      console.log(`❌ Cartas inválidas selecionadas`);
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Cartas inválidas selecionadas!' });
      return;
    }

    // Extrair símbolos das cartas selecionadas
    const cartasSelecionadasObjetos = cartasSelecionadas.map(territorio => 
      cartas.find(carta => carta.territorio === territorio)
    );
    const simbolosSelecionados = cartasSelecionadasObjetos.map(carta => carta.simbolo);
    
    // Verificar regras de troca: 3 iguais ou 3 diferentes (incluindo coringa)
    const simbolosUnicos = [...new Set(simbolosSelecionados)];
    const temCoringa = simbolosSelecionados.includes('★');
    
    let podeTrocar = false;
    
    if (temCoringa) {
      // Se tem coringa, verificar se as outras cartas são válidas
      const simbolosSemCoringa = simbolosSelecionados.filter(simbolo => simbolo !== '★');
      const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
      
      if (simbolosSemCoringa.length === 2) {
        // 2 cartas + 1 coringa: pode ser 2 iguais ou 2 diferentes
        podeTrocar = simbolosUnicosSemCoringa.length === 1 || simbolosUnicosSemCoringa.length === 2;
      } else if (simbolosSemCoringa.length === 1) {
        // 1 carta + 2 coringas: sempre válido
        podeTrocar = true;
      } else if (simbolosSemCoringa.length === 0) {
        // 3 coringas: sempre válido
        podeTrocar = true;
      }
    } else {
      // Sem coringa: regra original
      podeTrocar = simbolosUnicos.length === 1 || simbolosUnicos.length === 3;
    }

    if (!podeTrocar) {
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Você deve trocar 3 cartas do mesmo símbolo ou 3 símbolos diferentes! O coringa (★) pode substituir qualquer símbolo.' });
      return;
    }

    // Extrair as cartas que serão trocadas
    const cartasParaTrocar = cartasSelecionadas.map(territorio => 
      cartas.find(carta => carta.territorio === territorio)
    );
    
    // Remover as cartas trocadas do jogador
    cartasSelecionadas.forEach(territorio => {
      const index = cartas.findIndex(carta => carta.territorio === territorio);
      if (index > -1) {
        cartas.splice(index, 1);
      }
    });

    // Atualizar o deck do jogador
    playerRoom.cartasTerritorio[jogador.nome] = cartas;
    
    // Devolver as cartas trocadas ao monte
    playerRoom.devolverCartasAoMonte(cartasParaTrocar);

    // Verificar se o jogador possui algum dos territórios das cartas trocadas e adicionar 2 tropas
    let territoriosReforcados = [];
    cartasSelecionadas.forEach(territorioNome => {
      const territorio = playerRoom.paises.find(p => p.nome === territorioNome);
      if (territorio && territorio.dono === jogador.nome) {
        territorio.tropas += 2;
        territoriosReforcados.push(territorioNome);
        console.log(`🎯 ${jogador.nome} recebeu 2 tropas em ${territorioNome} por possuir o território da carta trocada`);
        
        // Emitir efeito visual de reforço para o território
        io.to(playerRoom.roomId).emit('mostrarEfeitoReforco', {
          territorio: territorioNome,
          jogador: jogador.nome,
          tipo: 'carta'
        });
      }
    });

    // Calcular bônus progressivo para troca de cartas
    playerRoom.numeroTrocasRealizadas++;
    const bonusTroca = 2 + (playerRoom.numeroTrocasRealizadas * 2); // 4, 6, 8, 10, ...

    // Determinar tipo de troca considerando coringas
    let tipoTroca;
    if (temCoringa) {
      const simbolosSemCoringa = simbolosSelecionados.filter(simbolo => simbolo !== '★');
      const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
      tipoTroca = simbolosUnicosSemCoringa.length === 1 ? 'mesmo símbolo' : 'símbolos diferentes';
    } else {
      tipoTroca = simbolosUnicos.length === 1 ? 'mesmo símbolo' : 'símbolos diferentes';
    }
    
    // Criar mensagem detalhada sobre a troca
    let mensagemTroca = `🎴 ${jogador.nome} trocou 3 cartas de ${tipoTroca} (${cartasSelecionadas.join(', ')}) e recebeu ${bonusTroca} exércitos bônus!`;
    
    if (territoriosReforcados.length > 0) {
      mensagemTroca += `\n🎯 +2 tropas em: ${territoriosReforcados.join(', ')} (territórios possuídos)`;
    }
    
    io.to(playerRoom.roomId).emit('mostrarMensagem', mensagemTroca);
    io.to(playerRoom.roomId).emit('tocarSomTakeCard');
    
    // Mensagem para o jogador que fez a troca
    let mensagemJogador = `Cartas trocadas com sucesso! Você recebeu ${bonusTroca} exércitos bônus!`;
    if (territoriosReforcados.length > 0) {
      mensagemJogador += `\n🎯 +2 tropas adicionais em: ${territoriosReforcados.join(', ')}`;
    }
    
    console.log(`✅ Troca de cartas realizada com sucesso`);
    socket.emit('resultadoTrocaCartas', { sucesso: true, mensagem: mensagemJogador });
    
    // Se era uma troca obrigatória, continuar o turno
    const cartasRestantes = playerRoom.cartasTerritorio[jogador.nome] || [];
    if (cartasRestantes.length < 5) {
      // Continuar o turno normalmente com bônus adicional
      const resultadoReforco = calcularReforco(playerRoom.turno, playerRoom);
      playerRoom.tropasReforco = resultadoReforco.base + bonusTroca; // Adicionar bônus da troca
      playerRoom.tropasBonusContinente = resultadoReforco.bonus;

      io.to(playerRoom.roomId).emit('mostrarMensagem', `🎮 Turno de ${playerRoom.turno}. Reforços: ${resultadoReforco.base} base + ${bonusTroca} bônus da troca + ${Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus de continentes`);
    }
    
    // Atualizar estado para todos os clientes na sala
    enviarEstadoParaTodos(playerRoom);
    
    // Verificar vitória após troca de cartas
    checarVitoria(playerRoom);
  });

  socket.on('verificarMovimentoRemanejamento', (dados) => {
    console.log('🔧 DEBUG: verificarMovimentoRemanejamento recebido:', dados);
    console.log('🔧 DEBUG: Socket ID:', socket.id);
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) {
      console.log('🔧 DEBUG: Sala não encontrada ou jogo não iniciado');
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    console.log('🔧 DEBUG: Jogador:', jogador ? jogador.nome : 'não encontrado');
    console.log('🔧 DEBUG: Turno atual:', playerRoom.turno);
    console.log('🔧 DEBUG: Fase remanejamento:', playerRoom.faseRemanejamento);
    
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota || !playerRoom.faseRemanejamento) {
      console.log('🔧 DEBUG: Verificação falhou - não é sua vez ou não está na fase de remanejamento');
      console.log('🔧 DEBUG: jogador.nome:', jogador.nome);
      console.log('🔧 DEBUG: playerRoom.turno:', playerRoom.turno);
      console.log('🔧 DEBUG: playerRoom.faseRemanejamento:', playerRoom.faseRemanejamento);
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Não é sua vez ou não está na fase de remanejamento' });
      return;
    }

    const territorioOrigem = playerRoom.paises.find(p => p.nome === dados.origem);
    const territorioDestino = playerRoom.paises.find(p => p.nome === dados.destino);
    
    console.log('🔧 DEBUG: Território origem:', territorioOrigem ? territorioOrigem.nome : 'não encontrado');
    console.log('🔧 DEBUG: Território destino:', territorioDestino ? territorioDestino.nome : 'não encontrado');
    
    if (!territorioOrigem || !territorioDestino) {
      console.log('🔧 DEBUG: Territórios não encontrados');
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não encontrados' });
      return;
    }
    
    console.log('🔧 DEBUG: Dono origem:', territorioOrigem.dono, 'Dono destino:', territorioDestino.dono);
    console.log('🔧 DEBUG: Vizinhos de origem:', territorioOrigem.vizinhos);
    
    if (territorioOrigem.dono !== playerRoom.turno || territorioDestino.dono !== playerRoom.turno) {
      console.log('🔧 DEBUG: Territórios não são do jogador');
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não são seus' });
      return;
    }
    
    if (!territorioOrigem.vizinhos.includes(territorioDestino.nome)) {
      console.log('🔧 DEBUG: Territórios não são vizinhos');
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não são vizinhos' });
      return;
    }

    // Controle refinado de movimentos
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno]) playerRoom.movimentosRemanejamento[playerRoom.turno] = {};
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem]) playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem] = {};
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno][dados.destino]) playerRoom.movimentosRemanejamento[playerRoom.turno][dados.destino] = {};

    // Verificar se há tropas suficientes para mover (deixar pelo menos 1)
    const quantidadeMaxima = territorioOrigem.tropas - 1; // Deixar pelo menos 1 tropa

    if (quantidadeMaxima <= 0) {
      socket.emit('resultadoVerificacaoMovimento', { 
        podeMover: false, 
        quantidadeMaxima: 0, 
        motivo: `Não é possível mover tropas de ${dados.origem} - precisa deixar pelo menos 1 tropa.` 
      });
      return;
    }

    console.log('🔧 DEBUG: Movimento aprovado, quantidade máxima:', quantidadeMaxima);
    const resposta = { 
      podeMover: true, 
      quantidadeMaxima: quantidadeMaxima,
      territorioDestino: dados.destino,
      motivo: null
    };
    console.log('🔧 DEBUG: Enviando resposta:', resposta);
    socket.emit('resultadoVerificacaoMovimento', resposta);
  });

  socket.on('moverTropas', (dados) => {
    console.log('🔧 DEBUG: moverTropas recebido:', dados);
    console.log('🔧 DEBUG: Socket ID:', socket.id);
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota || !playerRoom.faseRemanejamento) return;

    const territorioOrigem = playerRoom.paises.find(p => p.nome === dados.origem);
    const territorioDestino = playerRoom.paises.find(p => p.nome === dados.destino);
    
    if (!territorioOrigem || !territorioDestino) return;
    if (territorioOrigem.dono !== playerRoom.turno || territorioDestino.dono !== playerRoom.turno) return;
    if (dados.quantidade < 1 || dados.quantidade > territorioOrigem.tropas - 1) return; // Deixar pelo menos 1 tropa
    if (!territorioOrigem.vizinhos.includes(territorioDestino.nome)) return; // Deve ser vizinho

    // Controle refinado de movimentos
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno]) playerRoom.movimentosRemanejamento[playerRoom.turno] = {};
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem]) playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem] = {};
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno][dados.destino]) playerRoom.movimentosRemanejamento[playerRoom.turno][dados.destino] = {};

    // Verificar se a quantidade é válida (deixar pelo menos 1 tropa)
    if (dados.quantidade > territorioOrigem.tropas - 1) {
      const mensagemErro = `Não é possível mover ${dados.quantidade} tropas de ${dados.origem} - precisa deixar pelo menos 1 tropa.`;
      socket.emit('mostrarMensagem', mensagemErro);
      return;
    }

    // Registrar o movimento
    playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem][dados.destino] = (playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem][dados.destino] || 0) + dados.quantidade;

    // Mover tropas
    territorioOrigem.tropas -= dados.quantidade;
    territorioDestino.tropas += dados.quantidade;

    const mensagem = `${playerRoom.turno} moveu ${dados.quantidade} tropas de ${dados.origem} para ${dados.destino}`;
    io.to(playerRoom.roomId).emit('mostrarMensagem', mensagem);
    io.to(playerRoom.roomId).emit('tocarSomMovimento');
    
    // Verificar vitória após mover tropas
    checarVitoria(playerRoom);

    // Send updated state to all clients in this room
    enviarEstadoParaTodos(playerRoom);
  });

  socket.on('reiniciarJogo', () => {
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        break;
      }
    }
    
    if (!playerRoom || !playerRoom.gameStarted) return;
    
    playerRoom.jogadores.forEach(j => j.ativo = true);
    playerRoom.indiceTurno = 0;
    playerRoom.turno = playerRoom.jogadores[playerRoom.indiceTurno].nome;
    playerRoom.vitoria = false;
    playerRoom.derrota = false;
    playerRoom.faseRemanejamento = false;
    playerRoom.tropasReforco = 0;
    playerRoom.tropasBonusContinente = {}; // Resetar tropas de bônus
    playerRoom.objetivos = {}; // Resetar objetivos
    playerRoom.movimentosRemanejamento = {}; // Resetar controle de movimentos
    playerRoom.numeroTrocasRealizadas = 0; // Resetar contador de trocas
    playerRoom.cartasTerritorio = {}; // Resetar cartas território
    playerRoom.inicializarMonteCartas(); // Reinicializar monte de cartas
    playerRoom.territoriosConquistadosNoTurno = {}; // Resetar territórios conquistados

    playerRoom.paises = [
      { nome: 'Emberlyn', x: 402, y: 396, dono: 'Azul', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
      { nome: 'Ravenspire', x: 463, y: 450, dono: 'Vermelho', tropas: 5, vizinhos: ['Emberlyn','Duskwatch', 'Stormhall','Zul\'Marak'] },
      { nome: 'Stonevale', x: 356, y: 404, dono: 'Amarelo', tropas: 5, vizinhos: ['Emberlyn', 'Duskwatch',`Barrowfell`] },
      { nome: 'Duskwatch', x: 293, y: 454, dono: 'Verde', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Emberlyn', 'Stormhall'] },
      { nome: 'Stormhall', x: 325, y: 581, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne','Duskwatch'] },
      { nome: 'Redwyn', x: 111, y: 194, dono: 'Preto', tropas: 5, vizinhos: ['Stormfen', 'Cragstone', 'Omradan'] },
      { nome: 'Stormfen', x: 111, y: 194, dono: 'Roxo', tropas: 5, vizinhos: ['Redwyn', 'Cragstone',`Frosthollow`] },
      { nome: 'Highmoor', x: 305, y: 165, dono: 'Amarelo', tropas: 5, vizinhos: [`Frosthollow`, 'Cragstone','Westreach'] },
      { nome: 'Cragstone', x: 127, y: 264, dono: 'Verde', tropas: 5, vizinhos: ['Stormfen', 'Highmoor','Hollowspire'] },
      { nome: 'Hollowspire', x: 253, y: 222, dono: 'Preto', tropas: 5, vizinhos: ['Cragstone', 'Westreach'] },
      { nome: 'Westreach', x: 160, y: 340, dono: 'Roxo', tropas: 5, vizinhos: ['Hollowspire', 'Barrowfell','Highmoor'] },
      { nome: 'Barrowfell', x: 161, y: 343, dono: 'Azul', tropas: 5, vizinhos: ['Hollowspire', 'Westreach','Stonevale'] },
      { nome: 'Zul\'Marak', x: 527, y: 367, dono: 'Azul', tropas: 5, vizinhos: ['Emberwaste', 'Ravenspire', 'Duskmere','Thalengarde'] },
      { nome: 'Emberwaste', x: 663, y: 354, dono: 'Vermelho', tropas: 5, vizinhos: ['Zul\'Marak', 'Sunjara', 'Tharkuun','Duskmere','Kaer\'Tai'] },
      { nome: 'Sunjara', x: 783, y: 341, dono: 'Verde', tropas: 5, vizinhos: ['Emberwaste', 'Bareshi', 'Oru\'Kai', 'Kaer\'Tai','Tharkuun'] },
      { nome: 'Tharkuun', x: 625, y: 466, dono: 'Amarelo', tropas: 5, vizinhos: ['Sunjara', 'Emberwaste', 'Bareshi'] },
      { nome: 'Bareshi', x: 706, y: 456, dono: 'Preto', tropas: 5, vizinhos: ['Sunjara', 'Tharkuun', 'Oru\'Kai'] },
      { nome: 'Oru\'Kai', x: 809, y: 494, dono: 'Roxo', tropas: 5, vizinhos: ['Sunjara', 'Bareshi'] },
      { nome: 'Frosthollow', x: 310, y: 112, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Stormfen','Highmoor'] },
      { nome: 'Eldoria', x: 508, y: 130, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthollow', 'Greymoor', 'Ironreach','Frosthelm'] },
      { nome: 'Greymoor', x: 525, y: 193, dono: 'Verde', tropas: 5, vizinhos: ['Eldoria', 'Thalengarde', 'Duskmere','Ironreach'] },
      { nome: 'Thalengarde', x: 487, y: 262, dono: 'Amarelo', tropas: 5, vizinhos: ['Greymoor', 'Duskmere', 'Zul\'Marak'] },
      { nome: 'Duskmere', x: 555, y: 246, dono: 'Preto', tropas: 5, vizinhos: ['Greymoor', 'Thalengarde', 'Ironreach', 'Blackmere', 'Zul\'Marak','Emberwaste','Kaer\'Tai','Shōrenji'] },
      { nome: 'Ironreach', x: 533, y: 163, dono: 'Roxo', tropas: 5, vizinhos: ['Eldoria', 'Blackmere', 'Duskmere', 'Frosthelm','Greymoor'] },
      { nome: 'Frosthelm', x: 630, y: 113, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Ironreach', 'Blackmere'] },
      { nome: 'Blackmere', x: 592, y: 145, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthelm', 'Duskmere','Ironreach','Nihadara','Shōrenji'] },
      { nome: 'Kaer\'Tai', x: 711, y: 237, dono: 'Azul', tropas: 5, vizinhos: ['Shōrenji', 'Duksmere', 'Sunjara','Emberwaste','Qumaran','Darakai'] },
      { nome: 'Shōrenji', x: 823, y: 269, dono: 'Vermelho', tropas: 5, vizinhos: ['Kaer\'Tai', 'Nihadara', 'Xin\'Qari','Qumaran','Duskmere','Blackmere'] },
      { nome: 'Nihadara', x: 715, y: 135, dono: 'Verde', tropas: 5, vizinhos: ['Blackmere', 'Shōrenji', 'Xin\'Qari'] },
      { nome: 'Xin\'Qari', x: 826, y: 117, dono: 'Amarelo', tropas: 5, vizinhos: ['Shōrenji', 'Nihadara', 'Vol\'Zareth', 'Sa\'Torran','Mei\'Zhara'] },
      { nome: 'Vol\'Zareth', x: 1048, y: 124, dono: 'Preto', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan','Sa\'Torran'] },
      { nome: 'Omradan', x: 1050, y: 124, dono: 'Roxo', tropas: 5, vizinhos: ['Vol\'Zareth', 'Sa\'Torran', 'Qumaran','Tzun\'Rakai'] },
      { nome: 'Sa\'Torran', x: 897, y: 218, dono: 'Azul', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan', 'Qumaran', 'Mei\'Zhara','Vol\'Zareth'] },
      { nome: 'Qumaran', x: 1060, y: 247, dono: 'Vermelho', tropas: 5, vizinhos: ['Omradan', 'Sa\'Torran', 'Tzun\'Rakai', 'Darakai', 'Shōrenji','Kaer\'Tai','Ish\'Tanor'] },
      { nome: 'Tzun\'Rakai', x: 1122, y: 274, dono: 'Verde', tropas: 5, vizinhos: ['Qumaran', 'Omradan'] },
      { nome: 'Mei\'Zhara', x: 866, y: 220, dono: 'Amarelo', tropas: 5, vizinhos: ['Sa\'Torran', 'Qumaran', 'Xin\'Qari'] },
      { nome: 'Darakai', x: 961, y: 352, dono: 'Preto', tropas: 5, vizinhos: ['Qumaran', 'Kaer\'Tai', 'Ish\'Tanor','Winterholde'] },
      { nome: 'Ish\'Tanor', x: 963, y: 349, dono: 'Roxo', tropas: 5, vizinhos: ['Tzun\'Rakai', 'Darakai', 'Winterholde','Qumaran'] },
      { nome: 'Winterholde', x: 1020, y: 491, dono: 'Azul', tropas: 5, vizinhos: ['Ish\'Tanor', 'Mistveil','Darakai'] },
      { nome: 'Aetheris', x: 1094, y: 458, dono: 'Vermelho', tropas: 5, vizinhos: ['Ish\'Tanor', 'Dawnwatch', 'Mistveil'] },
      { nome: 'Dawnwatch', x: 1113, y: 475, dono: 'Verde', tropas: 5, vizinhos: ['Aetheris', 'Mistveil'] },
      { nome: 'Mistveil', x: 1078, y: 511, dono: 'Amarelo', tropas: 5, vizinhos: ['Winterholde', 'Aetheris', 'Dawnwatch'] }
    ];

    const resultadoReforco = calcularReforco(playerRoom.turno, playerRoom);
    playerRoom.tropasReforco = resultadoReforco.base;
    playerRoom.tropasBonusContinente = resultadoReforco.bonus;
    io.to(playerRoom.roomId).emit('mostrarMensagem', `Jogo reiniciado! É a vez do jogador ${playerRoom.turno}.`);
    enviarEstadoParaTodos(playerRoom);
  });
});

function getEstado(socketId = null, room = null) {
  console.log(`🔧 DEBUG: getEstado(socketId: ${socketId}, room: ${room ? room.roomId : 'null'})`);
  
  let meuNome = null;
  if (socketId && room) {
    const jogador = room.jogadores.find(j => j.socketId === socketId);
    if (jogador) {
      meuNome = jogador.nome;
      console.log(`🔧 DEBUG: Jogador encontrado para socket ${socketId}: ${meuNome}`);
    } else {
      console.log(`🔧 DEBUG: Jogador não encontrado para socket ${socketId}`);
    }
  }

  // Calcular controle dos continentes por jogador
  console.log(`🔧 DEBUG: Calculando controle dos continentes`);
  const controleContinentes = {};
  Object.values(room.continentes).forEach(continente => {
    const territoriosDoContinente = continente.territorios;
    const controlePorJogador = {};
    
    room.jogadores.forEach(jogador => {
      const territoriosConquistados = territoriosDoContinente.filter(territorio => {
        const pais = room.paises.find(p => p.nome === territorio);
        return pais && pais.dono === jogador.nome;
      });
      
      controlePorJogador[jogador.nome] = {
        conquistados: territoriosConquistados.length,
        total: territoriosDoContinente.length,
        controla: territoriosConquistados.length === territoriosDoContinente.length
      };
    });
    
    controleContinentes[continente.nome] = {
      ...continente,
      controle: controlePorJogador
    };
  });

  // Calcular continente com prioridade para reforço
  const continentePrioritario = calcularContinentePrioritario(room);

  const estado = {
    jogadores: room.jogadores,
    turno: room.turno,
    paises: room.paises,
    tropasReforco: room.tropasReforco,
    tropasBonusContinente: room.tropasBonusContinente,
    vitoria: room.vitoria,
    derrota: room.derrota,
    meuNome,
    continentes: controleContinentes,
    objetivos: room.objetivos,
    continentePrioritario,
    faseRemanejamento: room.faseRemanejamento,
    cartasTerritorio: room.cartasTerritorio,
    cartasNoMonte: room.monteCartas.length
  };
  
  console.log(`🔧 DEBUG: Estado gerado:`, {
    meuNome: estado.meuNome,
    turno: estado.turno,
    paisesCount: estado.paises ? estado.paises.length : 0,
    jogadoresCount: estado.jogadores ? estado.jogadores.length : 0,
    tropasReforco: estado.tropasReforco,
    vitoria: estado.vitoria,
    derrota: estado.derrota
  });
  
  return estado;
}

// Função para enviar estado atualizado para todos os jogadores da sala
function enviarEstadoParaTodos(room) {
  console.log(`🔧 DEBUG: enviarEstadoParaTodos para sala ${room.roomId}`);
  
  room.jogadores.forEach(jogador => {
    if (jogador.socketId) {
      console.log(`🔧 DEBUG: Enviando estado para ${jogador.nome} (socket: ${jogador.socketId})`);
      io.to(jogador.socketId).emit('estadoAtualizado', getEstado(jogador.socketId, room));
    }
  });
}

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function calcularContinentePrioritario(room) {
  // Ordenar continentes por bônus (maior para menor)
  const continentesOrdenados = Object.entries(room.tropasBonusContinente)
    .filter(([nome, quantidade]) => quantidade > 0)
    .sort((a, b) => {
      const bonusA = room.continentes[a[0]].bonus;
      const bonusB = room.continentes[b[0]].bonus;
      return bonusB - bonusA; // Ordem decrescente
    });
  
  if (continentesOrdenados.length > 0) {
    const [nomeContinente, quantidade] = continentesOrdenados[0];
    return {
      nome: nomeContinente,
      quantidade: quantidade,
      bonus: room.continentes[nomeContinente].bonus
    };
  }
  
  return null; // Não há tropas de bônus pendentes
}

function calcularReforco(turnoAtual, room) {
  const territorios = room.paises.filter(p => p.dono === turnoAtual).length;
  let reforcoBase = Math.max(3, Math.floor(territorios / 2));
  
  // Calcular bônus dos continentes
  let bonusContinentes = {};
  Object.values(room.continentes).forEach(continente => {
    const territoriosDoContinente = continente.territorios;
    const territoriosConquistados = territoriosDoContinente.filter(territorio => {
      const pais = room.paises.find(p => p.nome === territorio);
      return pais && pais.dono === turnoAtual;
    });
    
    // Se o jogador controla todos os territórios do continente
    if (territoriosConquistados.length === territoriosDoContinente.length) {
      bonusContinentes[continente.nome] = continente.bonus;
    }
  });
  
  return { base: reforcoBase, bonus: bonusContinentes };
}

function checarEliminacao(room) {
  room.jogadores.forEach(jogador => {
    const temTerritorio = room.paises.some(p => p.dono === jogador.nome);
    if (!temTerritorio && jogador.ativo) {
      jogador.ativo = false;
      io.to(room.roomId).emit('mostrarMensagem', `Jogador ${jogador.nome} foi eliminado!`);
      if (room.turno === jogador.nome) {
        // Passa turno imediatamente se o jogador eliminado estava jogando
        let encontrouJogadorAtivo = false;
        let tentativas = 0;
        do {
          room.indiceTurno = (room.indiceTurno + 1) % room.jogadores.length;
          tentativas++;
          if (room.jogadores[room.indiceTurno].ativo) {
            encontrouJogadorAtivo = true;
          }
          if (tentativas > room.jogadores.length) {
            encontrouJogadorAtivo = false;
            break;
          }
        } while (!encontrouJogadorAtivo);

        if (!encontrouJogadorAtivo) {
          io.to(room.roomId).emit('mostrarMensagem', 'Jogo acabou! Não há mais jogadores ativos.');
          return;
        }
        room.turno = room.jogadores[room.indiceTurno].nome;
        const resultadoReforco = calcularReforco(room.turno, room);
        room.tropasReforco = resultadoReforco.base;
        room.tropasBonusContinente = resultadoReforco.bonus;
        io.to(room.roomId).emit('mostrarMensagem', `Agora é a vez do jogador ${room.turno}`);
      }
      room.jogadores.forEach(j => {
        if (j.nome === jogador.nome && j.socketId) {
            io.to(j.socketId).emit('derrota');
        }
        });
      enviarEstadoParaTodos(room);
    }
  });
  checarVitoria(room);
}

function gerarObjetivoAleatorio(jogador, room) {
  const tipo = room.tiposObjetivos[Math.floor(Math.random() * room.tiposObjetivos.length)];
  
  switch (tipo) {
    case 'conquistar3Continentes':
      const nomesContinentes = Object.keys(room.continentes);
      const continente1 = nomesContinentes[Math.floor(Math.random() * nomesContinentes.length)];
      let continente2 = nomesContinentes[Math.floor(Math.random() * nomesContinentes.length)];
      while (continente2 === continente1) {
        continente2 = nomesContinentes[Math.floor(Math.random() * nomesContinentes.length)];
      }
      return {
        tipo: 'conquistar3Continentes',
        continente1: continente1,
        continente2: continente2,
        descricao: `Conquistar 3 continentes: ${continente1}, ${continente2} e qualquer outro`
      };
      
    case 'eliminarJogador':
      const jogadoresDisponiveis = room.jogadores.filter(j => j.nome !== jogador);
      const jogadorAlvo = jogadoresDisponiveis[Math.floor(Math.random() * jogadoresDisponiveis.length)];
      return {
        tipo: 'eliminarJogador',
        jogadorAlvo: jogadorAlvo.nome,
        descricao: `Eliminar o jogador ${jogadorAlvo.nome}`
      };
      
    case 'dominar24Territorios':
      return {
        tipo: 'dominar24Territorios',
        descricao: 'Dominar 24 territórios'
      };
      
    case 'dominar16TerritoriosCom2Tropas':
      return {
        tipo: 'dominar16TerritoriosCom2Tropas',
        descricao: 'Dominar 16 territórios com pelo menos 2 tropas em cada'
      };
  }
}

function verificarObjetivo(jogador, room) {
  const objetivo = room.objetivos[jogador];
  if (!objetivo) {
    console.log(`❌ Nenhum objetivo encontrado para ${jogador}`);
    return false;
  }
  
  console.log(`🎯 Verificando objetivo de ${jogador}: ${objetivo.tipo}`);
  
  switch (objetivo.tipo) {
    case 'conquistar3Continentes':
      const continentesConquistados = Object.values(room.continentes).filter(continente => {
        const territoriosDoContinente = continente.territorios;
        const territoriosConquistados = territoriosDoContinente.filter(territorio => {
          const pais = room.paises.find(p => p.nome === territorio);
          return pais && pais.dono === jogador;
        });
        return territoriosConquistados.length === territoriosDoContinente.length;
      });
      
      const temContinente1 = continentesConquistados.some(c => c.nome === objetivo.continente1);
      const temContinente2 = continentesConquistados.some(c => c.nome === objetivo.continente2);
      const temTerceiroContinente = continentesConquistados.length >= 3;
      
      console.log(`🌍 Continentes conquistados: ${continentesConquistados.map(c => c.nome).join(', ')}`);
      console.log(`✅ Tem ${objetivo.continente1}: ${temContinente1}`);
      console.log(`✅ Tem ${objetivo.continente2}: ${temContinente2}`);
      console.log(`✅ Tem 3+ continentes: ${temTerceiroContinente}`);
      
      return temContinente1 && temContinente2 && temTerceiroContinente;
      
    case 'eliminarJogador':
      const jogadorAlvo = room.jogadores.find(j => j.nome === objetivo.jogadorAlvo);
      const eliminado = !jogadorAlvo || !jogadorAlvo.ativo;
      console.log(`🎯 Jogador alvo ${objetivo.jogadorAlvo} eliminado: ${eliminado}`);
      return eliminado;
      
    case 'dominar24Territorios':
      const territoriosDominados = room.paises.filter(p => p.dono === jogador).length;
      console.log(`🗺️ Territórios dominados por ${jogador}: ${territoriosDominados}/24`);
      return territoriosDominados >= 24;
      
    case 'dominar16TerritoriosCom2Tropas':
      const territoriosCom2Tropas = room.paises.filter(p => p.dono === jogador && p.tropas >= 2).length;
      console.log(`⚔️ Territórios com 2+ tropas de ${jogador}: ${territoriosCom2Tropas}/16`);
      return territoriosCom2Tropas >= 16;
  }
  
  console.log(`❌ Tipo de objetivo desconhecido: ${objetivo.tipo}`);
  return false;
}

function checarVitoria(room) {
  console.log('🔍 Verificando vitória...');
  
  // Verificar vitória por eliminação
  const ativos = room.jogadores.filter(j => j.ativo);
  if (ativos.length === 1) {
    console.log(`🏆 Vitória por eliminação: ${ativos[0].nome}`);
    room.vitoria = true;
    io.to(room.roomId).emit('vitoria', ativos[0].nome);
    return;
  }
  
  // Verificar vitória por objetivo
  for (const jogador of room.jogadores) {
    if (jogador.ativo) {
      console.log(`🔍 Verificando objetivo de ${jogador.nome}...`);
      const objetivo = room.objetivos[jogador.nome];
      console.log(`📋 Objetivo de ${jogador.nome}:`, objetivo);
      
      if (verificarObjetivo(jogador.nome, room)) {
        console.log(`🏆 Vitória por objetivo: ${jogador.nome}`);
        room.vitoria = true;
        io.to(room.roomId).emit('vitoria', jogador.nome);
        return;
      }
    }
  }
  
  console.log('❌ Nenhuma vitória encontrada');
}

// Inicializar o jogo
function inicializarJogo(room) {
  console.log(`🔧 DEBUG: inicializarJogo(room) iniciada para sala ${room.roomId}`);
  console.log(`🎮 Inicializando jogo na sala ${room.roomId}...`);
  
  // Distribuir territórios aleatoriamente
  console.log(`🔧 DEBUG: Distribuindo ${room.paises.length} territórios entre ${room.jogadores.length} jogadores`);
  const territoriosDisponiveis = [...room.paises];
  let indiceJogador = 0;
  
  while (territoriosDisponiveis.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * territoriosDisponiveis.length);
    const territorio = territoriosDisponiveis.splice(indiceAleatorio, 1)[0];
    territorio.dono = room.jogadores[indiceJogador].nome;
    territorio.tropas = 1;
    indiceJogador = (indiceJogador + 1) % room.jogadores.length;
  }
  console.log(`🔧 DEBUG: Distribuição de territórios concluída`);

  // Colocar tropas extras
  console.log(`🔧 DEBUG: Ajustando tropas extras`);
  room.paises.forEach(pais => {
    pais.tropas += 0; // Changed from 2 to 0 to start with 1 troop
  });
  console.log(`🔧 DEBUG: Tropas extras ajustadas`);

  // Gerar objetivos para cada jogador
  console.log(`🔧 DEBUG: Gerando objetivos para jogadores`);
  room.jogadores.forEach(jogador => {
    room.objetivos[jogador.nome] = gerarObjetivoAleatorio(jogador.nome, room);
    console.log(`🎯 Objetivo de ${jogador.nome}: ${room.objetivos[jogador.nome].descricao}`);
  });

  room.indiceTurno = 0;
  room.turno = room.jogadores[room.indiceTurno].nome;
  room.vitoria = false;
  room.derrota = false;
  console.log(`🔧 DEBUG: Estado inicial definido - turno: ${room.turno}, indiceTurno: ${room.indiceTurno}`);
  
  // Limpar cartas território e territórios conquistados
  room.cartasTerritorio = {};
  room.territoriosConquistadosNoTurno = {};
  room.numeroTrocasRealizadas = 0; // Resetar contador de trocas
  room.inicializarMonteCartas(); // Inicializar monte de cartas
  console.log(`🔧 DEBUG: Cartas e territórios conquistados limpos, monte inicializado`);
  
  console.log(`🎮 Jogo inicializado na sala ${room.roomId} - turno: ${room.turno}`);
  
  console.log(`🔧 DEBUG: Calculando reforços para ${room.turno}`);
  const resultadoReforco = calcularReforco(room.turno, room);
  room.tropasReforco = resultadoReforco.base;
  room.tropasBonusContinente = resultadoReforco.bonus;
  console.log(`🔧 DEBUG: Reforços calculados - base: ${room.tropasReforco}, bonus:`, room.tropasBonusContinente);

  console.log(`🔧 DEBUG: Enviando mensagem de início para sala ${room.roomId}`);
  io.to(room.roomId).emit('mostrarMensagem', `🎮 Jogo iniciado! Turno de ${room.turno}. Reforços: ${room.tropasReforco} base + ${Object.values(room.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
  
  console.log(`🔧 DEBUG: Enviando estadoAtualizado para sala ${room.roomId}`);
  const estadoGlobal = getEstado(null, room);
  console.log(`🔧 DEBUG: Estado global gerado:`, {
    turno: estadoGlobal.turno,
    paisesCount: estadoGlobal.paises ? estadoGlobal.paises.length : 0,
    jogadoresCount: estadoGlobal.jogadores ? estadoGlobal.jogadores.length : 0,
    tropasReforco: estadoGlobal.tropasReforco
  });
  io.to(room.roomId).emit('estadoAtualizado', estadoGlobal);
  
  console.log(`🔧 DEBUG: inicializarJogo(room) concluída`);
}

// ===== SISTEMA DE CPU =====

// Função para ativar CPUs para jogadores sem conexão
function ativarCPUs(room) {
  let cpusAtivadas = 0;
  const jogadoresSemConexao = room.jogadores.filter(jogador => !jogador.socketId && !jogador.isCPU);
  
  console.log(`🤖 Verificando CPUs na sala ${room.roomId} - jogadores sem conexão:`, jogadoresSemConexao.map(j => j.nome));
  
  // Só ativar CPUs se houver jogadores sem conexão
  if (jogadoresSemConexao.length > 0) {
    jogadoresSemConexao.forEach(jogador => {
      jogador.isCPU = true;
      cpusAtivadas++;
      console.log(`🤖 CPU ativada para ${jogador.nome} na sala ${room.roomId} (sem conexão)`);
      io.to(room.roomId).emit('adicionarAoHistorico', `🤖 CPU ativada para ${jogador.nome}`);
    });
    
    if (cpusAtivadas > 0) {
      io.to(room.roomId).emit('mostrarMensagem', `🤖 ${cpusAtivadas} CPU(s) ativada(s) para completar a partida!`);
    }
  } else {
    console.log(`🤖 Nenhuma CPU precisa ser ativada na sala ${room.roomId}`);
  }
  
  console.log(`🤖 Status final das CPUs na sala ${room.roomId}:`, room.jogadores.map(j => `${j.nome}: CPU=${j.isCPU}, Ativo=${j.ativo}, Socket=${j.socketId ? 'Conectado' : 'Desconectado'}`));
  return cpusAtivadas;
}

// Função para executar turno da CPU
function executarTurnoCPU(jogadorCPU, room) {
  console.log(`🤖 CPU ${jogadorCPU.nome} executando turno na sala ${room.roomId}...`);
  
  // Verificar se a CPU deve trocar cartas (inteligente)
  const cartasCPU = room.cartasTerritorio[jogadorCPU.nome] || [];
  console.log(`🃏 CPU ${jogadorCPU.nome} tem ${cartasCPU.length} cartas:`, cartasCPU.map(c => `${c.territorio}(${c.simbolo})`).join(', '));
  
  const deveTrocar = analisarSeCPUDeveriaTrocarCartas(jogadorCPU, cartasCPU);
  console.log(`🤔 CPU ${jogadorCPU.nome} deve trocar cartas? ${deveTrocar}`);
  
  if (deveTrocar) {
    console.log(`🤖 CPU ${jogadorCPU.nome} decidiu trocar cartas (${cartasCPU.length} cartas)...`);
    
    // CPU troca cartas de forma inteligente
    const cartasParaTrocar = selecionarCartasInteligentesParaTroca(cartasCPU);
    console.log(`🎯 CPU ${jogadorCPU.nome} selecionou cartas para trocar:`, cartasParaTrocar);
    
    if (cartasParaTrocar.length === 3) {
      // Simular troca de cartas da CPU
      setTimeout(() => {
              // Extrair as cartas que serão trocadas
      const cartasParaTrocarObjetos = cartasCPU.filter(carta => 
        cartasParaTrocar.includes(carta.territorio)
      );
      
      // Remover as 3 cartas trocadas
      const cartasRestantes = cartasCPU.filter(carta => 
        !cartasParaTrocar.includes(carta.territorio)
      );
      room.cartasTerritorio[jogadorCPU.nome] = cartasRestantes;
      
      // Devolver as cartas trocadas ao monte
      room.devolverCartasAoMonte(cartasParaTrocarObjetos);
        
        // Verificar se a CPU possui algum dos territórios das cartas trocadas e adicionar 2 tropas
        let territoriosReforcados = [];
        cartasParaTrocar.forEach(territorioNome => {
          const territorio = room.paises.find(p => p.nome === territorioNome);
          if (territorio && territorio.dono === jogadorCPU.nome) {
            territorio.tropas += 2;
            territoriosReforcados.push(territorioNome);
            console.log(`🎯 CPU ${jogadorCPU.nome} recebeu 2 tropas em ${territorioNome} por possuir o território da carta trocada`);
            
            // Emitir efeito visual de reforço para o território
            io.to(room.roomId).emit('mostrarEfeitoReforco', {
              territorio: territorioNome,
              jogador: jogadorCPU.nome,
              tipo: 'carta'
            });
          }
        });
        
        // Calcular bônus baseado no tipo de troca
        const bonusTroca = calcularBonusTrocaCartas(cartasParaTrocar, room);
        const territoriosDoJogador = room.paises.filter(p => p.dono === jogadorCPU.nome);
        
        // Distribuir tropas estrategicamente
        for (let i = 0; i < bonusTroca; i++) {
          if (territoriosDoJogador.length > 0) {
            const territorioEstrategico = selecionarTerritorioEstrategicoParaReforco(jogadorCPU, territoriosDoJogador, room);
            territorioEstrategico.tropas++;
            
            // Emitir efeito visual e som para todos os jogadores verem
            io.to(room.roomId).emit('mostrarEfeitoReforco', {
              territorio: territorioEstrategico.nome,
              jogador: jogadorCPU.nome
            });
            
            console.log(`🎯 CPU ${jogadorCPU.nome} reforçou ${territorioEstrategico.nome} com tropa de troca de cartas (${territorioEstrategico.tropas} tropas)`);
          }
        }
        
        // Criar mensagem detalhada sobre a troca da CPU
        let mensagemTroca = `🤖 CPU ${jogadorCPU.nome} trocou 3 cartas território e recebeu ${bonusTroca} tropas extras!`;
        
        if (territoriosReforcados.length > 0) {
          mensagemTroca += `\n🎯 +2 tropas em: ${territoriosReforcados.join(', ')} (territórios possuídos)`;
        }
        
        io.to(room.roomId).emit('mostrarMensagem', mensagemTroca);
        io.to(room.roomId).emit('adicionarAoHistorico', `🃏 CPU ${jogadorCPU.nome} trocou 3 cartas território (+${bonusTroca} tropas${territoriosReforcados.length > 0 ? `, +2 em ${territoriosReforcados.join(', ')}` : ''})`);
        io.to(room.roomId).emit('tocarSomTakeCard');
        
        // Continuar com o turno normal da CPU
        continuarTurnoCPU(jogadorCPU, room);
      }, 1000);
      
      return;
    }
  }
  
  // Delay para simular pensamento da CPU
  setTimeout(() => {
    if (room.vitoria || room.derrota) return;
    
    continuarTurnoCPU(jogadorCPU, room);
  }, 1500);
}

// Função auxiliar para continuar o turno da CPU após verificar cartas
function continuarTurnoCPU(jogadorCPU, room) {
  console.log(`🧠 CPU ${jogadorCPU.nome} analisando estratégia na sala ${room.roomId}...`);
  io.to(room.roomId).emit('adicionarAoHistorico', `🧠 CPU ${jogadorCPU.nome} iniciando turno`);
  
  // 1. ESTRATÉGIA DE REFORÇOS INTELIGENTE
  const resultadoReforco = calcularReforco(jogadorCPU.nome, room);
  const tropasReforcoCPU = resultadoReforco.base;
  const tropasBonusCPU = resultadoReforco.bonus;
  
  // Analisar objetivo da CPU
  const objetivo = room.objetivos[jogadorCPU.nome];
  console.log(`🎯 CPU ${jogadorCPU.nome} tem objetivo: ${objetivo?.tipo}`);
  
    // Iniciar sequência de reforços
  executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, 0, room);
}

// Função para executar reforços sequencialmente - ESTRATÉGIA DE CAMPEÃO MUNDIAL
function executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, index, room) {
  if (room.vitoria || room.derrota) return;
  
  // ESTRATÉGIA DE CAMPEÃO: Concentrar TODAS as tropas em UM SÓ lugar estratégico
  const totalTropas = tropasReforcoCPU + Object.values(tropasBonusCPU).reduce((sum, qty) => sum + qty, 0);
  
  if (totalTropas > 0) {
    // Encontrar o território MAIS estratégico para concentrar todas as tropas
    const territoriosDoJogador = room.paises.filter(p => p.dono === jogadorCPU.nome);
    let melhorTerritorio = null;
    let melhorPontuacao = -1;
    
    territoriosDoJogador.forEach(territorio => {
      const pais = room.paises.find(p => p.nome === territorio.nome);
      let pontuacao = 0;
      
      // 1. FRONTEIRAS COM INIMIGOS (mais importante)
      const vizinhosInimigos = pais.vizinhos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
      });
      pontuacao += vizinhosInimigos.length * 50; // Muito mais peso
      
      // 2. VULNERABILIDADE ATUAL
      if (pais.tropas <= 1) pontuacao += 100; // Prioridade máxima
      else if (pais.tropas <= 2) pontuacao += 80;
      else if (pais.tropas <= 3) pontuacao += 60;
      
      // 3. OBJETIVO ESTRATÉGICO
      if (objetivo?.tipo === 'conquistar3Continentes') {
        const continente = Object.keys(room.continentes).find(cont => 
          room.continentes[cont].territorios.includes(territorio.nome)
        );
        if (continente === objetivo.continente1 || continente === objetivo.continente2) {
          pontuacao += 200; // Prioridade absoluta
        }
      }
      
      // 4. POSIÇÃO CENTRAL (muitos vizinhos próprios para defesa)
      const vizinhosProprios = pais.vizinhos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho && paisVizinho.dono === jogadorCPU.nome;
      });
      pontuacao += vizinhosProprios.length * 20;
      
      // 5. OPORTUNIDADES DE ATAQUE
      vizinhosInimigos.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        if (paisVizinho.tropas <= 2) pontuacao += 30; // Alvos fracos próximos
      });
      
      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        melhorTerritorio = territorio;
      }
    });
    
    // Fallback: território com menos tropas
    if (!melhorTerritorio) {
      melhorTerritorio = territoriosDoJogador.reduce((min, atual) => 
        atual.tropas < min.tropas ? atual : min
      );
    }
    
    // CONCENTRAR TODAS AS TROPAS NO TERRITÓRIO ESCOLHIDO
    const pais = room.paises.find(p => p.nome === melhorTerritorio.nome);
    pais.tropas += totalTropas;
    
    console.log(`🏆 CPU ${jogadorCPU.nome} CONCENTROU ${totalTropas} tropas em ${melhorTerritorio.nome} (pontuação estratégica: ${melhorPontuacao})`);
    io.to(room.roomId).emit('adicionarAoHistorico', `🏆 CPU ${jogadorCPU.nome} CONCENTROU ${totalTropas} tropas em ${melhorTerritorio.nome}`);
    io.to(room.roomId).emit('tocarSomMovimento');
    
    // Mostrar efeito visual de reforço
    io.to(room.roomId).emit('mostrarEfeitoReforco', {
      territorio: melhorTerritorio.nome,
      jogador: jogadorCPU.nome,
      tipo: 'reforco'
    });
    
    // Atualizar estado para todos os jogadores
    enviarEstadoParaTodos(room);
  }
  
  // Iniciar ataques imediatamente após concentrar tropas
  setTimeout(() => {
    if (room.vitoria || room.derrota) return;
    executarAtaquesSequenciais(jogadorCPU, objetivo, room);
  }, 1000);
}

// Função para executar remanejamento inteligente da CPU
function executarRemanejamentoCPU(jogadorCPU, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  console.log(`🔄 CPU ${jogadorCPU.nome} executando remanejamento estratégico na sala ${room.roomId}...`);
  io.to(room.roomId).emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} executando remanejamento estratégico...`);
  
  const territoriosDoJogador = room.paises.filter(p => p.dono === jogadorCPU.nome);
  const movimentos = [];
  
  // ESTRATÉGIA AVANÇADA: Análise completa do mapa
  territoriosDoJogador.forEach(territorio => {
    const pais = room.paises.find(p => p.nome === territorio.nome);
    const vizinhosInimigos = pais.vizinhos.filter(vizinho => {
      const paisVizinho = room.paises.find(p => p.nome === vizinho);
      return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
    });
    
    const vizinhosProprios = pais.vizinhos.filter(vizinho => {
      const paisVizinho = room.paises.find(p => p.nome === vizinho);
      return paisVizinho && paisVizinho.dono === jogadorCPU.nome;
    });
    
    // 1. TERRITÓRIOS VULNERÁVEIS (prioridade máxima)
    if (vizinhosInimigos.length > 0 && pais.tropas <= 2) {
      vizinhosProprios.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        if (paisVizinho.tropas > 3) {
          const tropasParaMover = Math.min(paisVizinho.tropas - 2, 2);
          if (tropasParaMover > 0) {
            movimentos.push({
              origem: paisVizinho,
              destino: pais,
              quantidade: tropasParaMover,
              prioridade: 1000 + vizinhosInimigos.length * 100 + (3 - pais.tropas) * 50
            });
          }
        }
      });
    }
    
    // 2. CONCENTRAÇÃO PARA ATAQUE (se tem objetivo de conquista)
    if (objetivo?.tipo === 'conquistar3Continentes' && vizinhosInimigos.length > 0) {
      const continente = Object.keys(room.continentes).find(cont => 
        room.continentes[cont].territorios.includes(territorio.nome)
      );
      
      if (continente === objetivo.continente1 || continente === objetivo.continente2) {
        // Concentrar tropas em territórios do continente objetivo
        vizinhosProprios.forEach(vizinho => {
          const paisVizinho = room.paises.find(p => p.nome === vizinho);
          const vizinhosInimigosVizinho = paisVizinho.vizinhos.filter(v => {
            const paisV = room.paises.find(p => p.nome === v);
            return paisV && paisV.dono !== jogadorCPU.nome;
          });
          
          // Se o vizinho tem menos inimigos, pode doar tropas
          if (vizinhosInimigosVizinho.length < vizinhosInimigos.length && paisVizinho.tropas > 2) {
            const tropasParaMover = Math.min(paisVizinho.tropas - 1, 3);
            if (tropasParaMover > 0) {
              movimentos.push({
                origem: paisVizinho,
                destino: pais,
                quantidade: tropasParaMover,
                prioridade: 800 + vizinhosInimigos.length * 80
              });
            }
          }
        });
      }
    }
    
    // 3. DEFESA ESTRATÉGICA (territórios com muitos inimigos)
    if (vizinhosInimigos.length >= 3 && pais.tropas <= 3) {
      vizinhosProprios.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        const vizinhosInimigosVizinho = paisVizinho.vizinhos.filter(v => {
          const paisV = room.paises.find(p => p.nome === v);
          return paisV && paisV.dono !== jogadorCPU.nome;
        });
        
        // Se o vizinho tem menos inimigos e mais tropas, pode doar
        if (vizinhosInimigosVizinho.length < vizinhosInimigos.length && paisVizinho.tropas > 4) {
          const tropasParaMover = Math.min(paisVizinho.tropas - 2, 2);
          if (tropasParaMover > 0) {
            movimentos.push({
              origem: paisVizinho,
              destino: pais,
              quantidade: tropasParaMover,
              prioridade: 600 + vizinhosInimigos.length * 60
            });
          }
        }
      });
    }
    
    // 4. OPORTUNIDADES DE ATAQUE (territórios com alvos fracos próximos)
    if (vizinhosInimigos.length > 0) {
      const alvosFracos = vizinhosInimigos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho.tropas <= 2;
      });
      
      if (alvosFracos.length > 0 && pais.tropas <= 3) {
        vizinhosProprios.forEach(vizinho => {
          const paisVizinho = room.paises.find(p => p.nome === vizinho);
          if (paisVizinho.tropas > 3) {
            const tropasParaMover = Math.min(paisVizinho.tropas - 2, 2);
            if (tropasParaMover > 0) {
              movimentos.push({
                origem: paisVizinho,
                destino: pais,
                quantidade: tropasParaMover,
                prioridade: 400 + alvosFracos.length * 40
              });
            }
          }
        });
      }
    }
  });
  
  // Ordenar movimentos por prioridade
  movimentos.sort((a, b) => b.prioridade - a.prioridade);
  
  // Limitar a 3 movimentos por turno para não sobrecarregar
  const movimentosLimitados = movimentos.slice(0, 3);
  
  console.log(`🎯 CPU ${jogadorCPU.nome} planejou ${movimentosLimitados.length} movimentos de remanejamento`);
  
  // Executar movimentos sequencialmente
  executarMovimentoRemanejamento(jogadorCPU, movimentosLimitados, 0, objetivo, room);
}

// Função para executar movimentos de remanejamento
function executarMovimentoRemanejamento(jogadorCPU, movimentos, index, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  if (index >= movimentos.length) {
    // Finalizar turno da CPU após remanejamento
    console.log(`🔄 CPU ${jogadorCPU.nome} finalizando turno após remanejamento na sala ${room.roomId}...`);
    console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} no final do turno:`, room.territoriosConquistadosNoTurno[jogadorCPU.nome] || []);
    io.to(room.roomId).emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} finalizando turno após remanejamento`);
    
    // Processar cartas da CPU ANTES de passar o turno
    processarCartasJogador(jogadorCPU.nome, room);
    
    passarTurno(room);
    return;
  }
  
  const movimento = movimentos[index];
  
  // Verificar se ainda é válido
  if (movimento.origem.tropas > movimento.quantidade && movimento.origem.dono === jogadorCPU.nome) {
    // Executar movimento
    movimento.origem.tropas -= movimento.quantidade;
    movimento.destino.tropas += movimento.quantidade;
    
    console.log(`🔄 CPU ${jogadorCPU.nome} moveu ${movimento.quantidade} tropas de ${movimento.origem.nome} para ${movimento.destino.nome}`);
    io.to(room.roomId).emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} moveu ${movimento.quantidade} tropas de ${movimento.origem.nome} para ${movimento.destino.nome}`);
    io.to(room.roomId).emit('tocarSomMovimento');
    
    // Atualizar estado para todos os jogadores
    enviarEstadoParaTodos(room);
  }
  
  // Processar próximo movimento após delay
  setTimeout(() => {
    executarMovimentoRemanejamento(jogadorCPU, movimentos, index + 1, objetivo, room);
  }, 500);
}

// Função para executar ataques sequencialmente - ESTRATÉGIA DE CAMPEÃO MUNDIAL
function executarAtaquesSequenciais(jogadorCPU, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  console.log(`⚔️ CPU ${jogadorCPU.nome} executando ATAQUE ESMAGADOR na sala ${room.roomId}...`);
  io.to(room.roomId).emit('adicionarAoHistorico', `⚔️ CPU ${jogadorCPU.nome} executando ATAQUE ESMAGADOR...`);
  
  const territoriosDoJogador = room.paises.filter(p => p.dono === jogadorCPU.nome);
  const ataques = [];
  
  // ESTRATÉGIA DE CAMPEÃO: ATAQUE ESMAGADOR - Só atacar com vantagem esmagadora
  territoriosDoJogador.forEach(territorio => {
    if (territorio.tropas >= 4) { // Só atacar com 4+ tropas
      const vizinhosInimigos = territorio.vizinhos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
      });
      
      vizinhosInimigos.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        const vantagemNumerica = territorio.tropas - paisVizinho.tropas;
        
        // SÓ ATACAR COM VANTAGEM ESMAGADORA (3+ tropas de diferença)
        if (vantagemNumerica >= 3) {
          let pontuacao = 0;
          
          // 1. VANTAGEM NUMÉRICA (CRÍTICA)
          pontuacao += vantagemNumerica * 50; // Cada tropa de vantagem vale 50 pontos
          
          // 2. OBJETIVO ESTRATÉGICO (PRIORIDADE ABSOLUTA)
          if (objetivo?.tipo === 'conquistar3Continentes') {
            const continenteVizinho = Object.keys(room.continentes).find(cont => 
              room.continentes[cont].territorios.includes(vizinho)
            );
            if (continenteVizinho === objetivo.continente1 || continenteVizinho === objetivo.continente2) {
              pontuacao += 500; // Prioridade ABSOLUTA
            }
          }
          
          // 3. ELIMINAÇÃO DE JOGADOR (PRIORIDADE ABSOLUTA)
          if (objetivo?.tipo === 'eliminarJogador') {
            const jogadorAlvo = objetivo.jogadorAlvo;
            if (paisVizinho.dono === jogadorAlvo) {
              pontuacao += 1000; // Prioridade ABSOLUTA
            }
          }
          
          // 4. ALVOS FRACOS (FÁCEIS DE CONQUISTAR)
          if (paisVizinho.tropas <= 1) pontuacao += 200;
          else if (paisVizinho.tropas <= 2) pontuacao += 150;
          
          // 5. EXPANSÃO ESTRATÉGICA (mais vizinhos inimigos = mais oportunidades)
          const vizinhosDoVizinho = paisVizinho.vizinhos.filter(v => {
            const paisV = room.paises.find(p => p.nome === v);
            return paisV && paisV.dono !== jogadorCPU.nome;
          });
          pontuacao += vizinhosDoVizinho.length * 100;
          
          ataques.push({
            origem: territorio,
            destino: paisVizinho,
            pontuacao: pontuacao,
            vantagemNumerica: vantagemNumerica
          });
        }
      });
    }
  });
  
  // Ordenar ataques por pontuação (maior pontuação primeiro)
  ataques.sort((a, b) => b.pontuacao - a.pontuacao);
  
  console.log(`🏆 CPU ${jogadorCPU.nome} preparou ${ataques.length} ataques esmagadores`);
  if (ataques.length > 0) {
    console.log(`⚔️ Melhor ataque: ${ataques[0].origem.nome} (${ataques[0].origem.tropas} tropas) → ${ataques[0].destino.nome} (${ataques[0].destino.tropas} tropas) - Vantagem: +${ataques[0].vantagemNumerica} - Pontuação: ${ataques[0].pontuacao}`);
  }
  
  // Executar ataques sequencialmente
  executarAtaqueIndividual(jogadorCPU, ataques, 0, objetivo, room);
}

// Função para executar um ataque individual
function executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  // Finalizar turno se não há mais oportunidades de ataque
  if (index >= oportunidadesAtaque.length) {
    // ESTRATÉGIA DE CAMPEÃO: Finalizar ataques e iniciar remanejamento
    if (room.vitoria || room.derrota) return;
    console.log(`🏆 CPU ${jogadorCPU.nome} finalizando ataques, iniciando remanejamento na sala ${room.roomId}...`);
    console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} no final dos ataques:`, room.territoriosConquistadosNoTurno[jogadorCPU.nome] || []);
    io.to(room.roomId).emit('adicionarAoHistorico', `🏆 CPU ${jogadorCPU.nome} finalizando ataques, iniciando remanejamento`);
    
    // Iniciar fase de remanejamento da CPU
    setTimeout(() => {
      if (room.vitoria || room.derrota) return;
      executarRemanejamentoCPU(jogadorCPU, objetivo, room);
    }, 1000);
    
    return;
  }
  
  const oportunidade = oportunidadesAtaque[index];
  
  // Só atacar se tiver vantagem numérica clara
  if (oportunidade.vantagemNumerica >= 1) {
    console.log(`⚔️ CPU ${jogadorCPU.nome} atacando ${oportunidade.destino.nome} (vantagem: +${oportunidade.vantagemNumerica}, pontuação: ${oportunidade.pontuacao})`);
    io.to(room.roomId).emit('adicionarAoHistorico', `⚔️ CPU ${jogadorCPU.nome} atacando ${oportunidade.destino.nome} (vantagem: +${oportunidade.vantagemNumerica})`);
    
    // Verificar se ainda tem tropas suficientes para atacar
    if (oportunidade.origem.tropas <= 1) {
      console.log(`❌ CPU ${jogadorCPU.nome} não pode atacar ${oportunidade.destino.nome} - origem tem apenas ${oportunidade.origem.tropas} tropas`);
      io.to(room.roomId).emit('adicionarAoHistorico', `❌ CPU ${jogadorCPU.nome} não pode atacar ${oportunidade.destino.nome} (tropas insuficientes)`);
      
      // Processar próximo ataque
      setTimeout(() => {
        executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index + 1, objetivo, room);
      }, 400); // Reduzido de 1200ms para 400ms para casos de tropas insuficientes
      return;
    }
    
    // Usar a mesma lógica de dados dos jogadores humanos
    const dadosAtaque = Math.min(oportunidade.origem.tropas - 1, 3);
    const dadosDefesa = Math.min(oportunidade.destino.tropas, 2);

    const rolagemAtaque = Array.from({ length: dadosAtaque }, rolarDado).sort((a, b) => b - a);
    const rolagemDefesa = Array.from({ length: dadosDefesa }, rolarDado).sort((a, b) => b - a);

    let resultadoMensagem = `${oportunidade.origem.nome} ataca ${oportunidade.destino.nome}
    Ataque: [${rolagemAtaque.join(', ')}] | Defesa: [${rolagemDefesa.join(', ')}]\n`;

    const comparacoes = Math.min(rolagemAtaque.length, rolagemDefesa.length);
    for (let i = 0; i < comparacoes; i++) {
        if (rolagemAtaque[i] > rolagemDefesa[i]) {
        oportunidade.destino.tropas--;
        resultadoMensagem += `Defesa perdeu 1 tropa.\n`;
        } else {
        oportunidade.origem.tropas--;
        resultadoMensagem += `Ataque perdeu 1 tropa.\n`;
        }
    }

    if (oportunidade.destino.tropas <= 0) {
        // Ataque bem-sucedido - conquista o território
        oportunidade.destino.dono = jogadorCPU.nome;
        oportunidade.destino.tropas = 1; // Colocar 1 tropa no território conquistado
        oportunidade.origem.tropas -= 1; // Remover 1 tropa do território atacante
        resultadoMensagem += `${oportunidade.destino.nome} foi conquistado por ${jogadorCPU.nome}!\n`;
        
        // Registrar território conquistado no turno atual
        if (!room.territoriosConquistadosNoTurno[jogadorCPU.nome]) {
          room.territoriosConquistadosNoTurno[jogadorCPU.nome] = [];
        }
        room.territoriosConquistadosNoTurno[jogadorCPU.nome].push(oportunidade.destino.nome);
        console.log(`🏆 CPU ${jogadorCPU.nome} registrou território conquistado: ${oportunidade.destino.nome}`);
        console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} neste turno:`, room.territoriosConquistadosNoTurno[jogadorCPU.nome]);
        
        // Verificar se conquistou algum continente
        Object.values(room.continentes).forEach(continente => {
          const territoriosDoContinente = continente.territorios;
          const territoriosConquistados = territoriosDoContinente.filter(territorio => {
            const pais = room.paises.find(p => p.nome === territorio);
            return pais && pais.dono === jogadorCPU.nome;
          });
          
          if (territoriosConquistados.length === territoriosDoContinente.length) {
            resultadoMensagem += `🎉 ${jogadorCPU.nome} conquistou o continente ${continente.nome}! (+${continente.bonus} tropas por rodada)\n`;
          }
        });
        
        checarEliminacao(room);
        checarVitoria(room);
        
        io.to(room.roomId).emit('mostrarMensagem', `⚔️ CPU ${jogadorCPU.nome} conquistou ${oportunidade.destino.nome} de ${oportunidade.origem.nome}!`);
        io.to(room.roomId).emit('adicionarAoHistorico', `🏆 CPU ${jogadorCPU.nome} conquistou ${oportunidade.destino.nome} de ${oportunidade.origem.nome}!`);
        io.to(room.roomId).emit('tocarSomTiro');
        
        // Mostrar efeito visual de ataque bem-sucedido
        io.to(room.roomId).emit('mostrarEfeitoAtaque', {
          origem: oportunidade.origem.nome,
          destino: oportunidade.destino.nome,
          sucesso: true
        });
        
        enviarEstadoParaTodos(room);
        // Recalcular oportunidades de ataque após conquista
        setTimeout(() => {
          recalcularOportunidadesAtaque(jogadorCPU, objetivo, index + 1, room);
        }, 800);
        return;
        
    } else {
        // Ataque falhou ou não conquistou
        console.log(`❌ CPU ${jogadorCPU.nome} falhou no ataque a ${oportunidade.destino.nome}`);
        io.to(room.roomId).emit('adicionarAoHistorico', `❌ CPU ${jogadorCPU.nome} falhou no ataque a ${oportunidade.destino.nome}`);
        io.to(room.roomId).emit('tocarSomTiro');
        
        // Mostrar efeito visual de ataque falhado
        io.to(room.roomId).emit('mostrarEfeitoAtaque', {
          origem: oportunidade.origem.nome,
          destino: oportunidade.destino.nome,
          sucesso: false
        });
    }
    
    // Atualizar estado para todos os jogadores
    enviarEstadoParaTodos(room);
    
  } else {
    console.log(`🤔 CPU ${jogadorCPU.nome} desistiu de atacar ${oportunidade.destino.nome} (desvantagem numérica)`);
    io.to(room.roomId).emit('adicionarAoHistorico', `🤔 CPU ${jogadorCPU.nome} desistiu de atacar ${oportunidade.destino.nome} (desvantagem)`);
  }
  

  enviarEstadoParaTodos(room);
  // Processar próximo ataque após delay
  setTimeout(() => {
    executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index + 1, objetivo, room);
  }, 800); // Reduzido de 1200ms para 800ms entre ataques
}

// Função para recalcular oportunidades de ataque após uma conquista
function recalcularOportunidadesAtaque(jogadorCPU, objetivo, index, room) {
  if (room.vitoria || room.derrota) return;
  
  console.log(`🔄 CPU ${jogadorCPU.nome} recalculando oportunidades após conquista na sala ${room.roomId}...`);
  
  const territoriosDoJogador = room.paises.filter(p => p.dono === jogadorCPU.nome);
  const oportunidadesAtaque = [];
  
  // Analisar oportunidades de ataque (mesma lógica da função original)
  territoriosDoJogador.forEach(territorio => {
    if (territorio.tropas > 1) {
      const vizinhosInimigos = territorio.vizinhos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
      });
      
      vizinhosInimigos.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        const vantagemNumerica = territorio.tropas - paisVizinho.tropas;
        
        let pontuacao = 0;
        
        if (vantagemNumerica >= 2) pontuacao += 50;
        else if (vantagemNumerica >= 1) pontuacao += 30;
        else if (vantagemNumerica >= 0) pontuacao += 10;
        else pontuacao -= 50;
        
        if (objetivo?.tipo === 'conquistar3Continentes') {
          const continenteVizinho = Object.keys(room.continentes).find(cont => 
            room.continentes[cont].territorios.includes(vizinho)
          );
          if (continenteVizinho === objetivo.continente1 || continenteVizinho === objetivo.continente2) {
            pontuacao += 40;
          }
        }
        
        if (objetivo?.tipo === 'dominar24Territorios' || objetivo?.tipo === 'dominar16TerritoriosCom2Tropas') {
          pontuacao += 20;
        }
        
        const vizinhosDoVizinho = paisVizinho.vizinhos.filter(v => {
          const paisV = room.paises.find(p => p.nome === v);
          return paisV && paisV.dono !== jogadorCPU.nome;
        });
        if (vizinhosDoVizinho.length > 0) pontuacao += 15;
        
        // Só adicionar se tiver vantagem numérica
        if (vantagemNumerica >= 1) {
          oportunidadesAtaque.push({
            origem: territorio,
            destino: paisVizinho,
            pontuacao: pontuacao,
            vantagemNumerica: vantagemNumerica
          });
        }
      });
    }
  });
  
  // Ordenar oportunidades por pontuação
  oportunidadesAtaque.sort((a, b) => b.pontuacao - a.pontuacao);
  
  // Continuar ataques com as novas oportunidades
  if (oportunidadesAtaque.length > 0) {
    console.log(`🎯 CPU ${jogadorCPU.nome} encontrou ${oportunidadesAtaque.length} novas oportunidades após conquista`);
    executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, 0, objetivo, room);
  } else {
    // Finalizar turno se não há mais oportunidades
    console.log(`🔄 CPU ${jogadorCPU.nome} finalizando turno após recalcular oportunidades na sala ${room.roomId}...`);
    console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} no final do turno:`, room.territoriosConquistadosNoTurno[jogadorCPU.nome] || []);
    io.to(room.roomId).emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} finalizando turno`);
    
    // Processar cartas da CPU ANTES de passar o turno
    processarCartasJogador(jogadorCPU.nome, room);
    
    passarTurno(room);
  }
}
// Função para analisar se a CPU deveria trocar cartas
function analisarSeCPUDeveriaTrocarCartas(jogadorCPU, cartasCPU) {
  console.log(`🔍 Analisando se CPU ${jogadorCPU.nome} deve trocar cartas...`);
  console.log(`📊 Cartas: ${cartasCPU.length}, Símbolos: ${cartasCPU.map(c => c.simbolo).join(', ')}`);
  
  // Forçar troca se tem 5 ou mais cartas
  if (cartasCPU.length >= 5) {
    console.log(`✅ CPU ${jogadorCPU.nome} deve trocar (5+ cartas)`);
    return true;
  }
  
  // Trocar se tem 3 cartas e pode formar uma combinação válida
  if (cartasCPU.length >= 3) {
    const simbolos = cartasCPU.map(carta => carta.simbolo);
    const temCoringa = simbolos.includes('★');
    
    console.log(`🔍 Analisando combinações: tem coringa=${temCoringa}`);
    
    // Verificar se pode formar combinação válida
    if (temCoringa) {
      // Lógica com coringa
      const coringas = simbolos.filter(simbolo => simbolo === '★');
      const simbolosSemCoringa = simbolos.filter(simbolo => simbolo !== '★');
      const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
      
      console.log(`🎴 Com coringa - coringas: ${coringas.length}, símbolos sem coringa: [${simbolosSemCoringa.join(', ')}], únicos: [${simbolosUnicosSemCoringa.join(', ')}]`);
      
      // Pode trocar se:
      // 1. 3 coringas
      // 2. 2 coringas + 1 carta qualquer
      // 3. 1 coringa + 2 cartas iguais
      // 4. 1 coringa + 2 cartas diferentes
      const podeTrocar = coringas.length >= 3 || 
                        (coringas.length === 2 && simbolosSemCoringa.length === 1) ||
                        (coringas.length === 1 && simbolosSemCoringa.length === 2);
      
      console.log(`🎯 Com coringa: pode trocar=${podeTrocar} (${coringas.length} coringas, ${simbolosSemCoringa.length} sem coringa)`);
      return podeTrocar;
    } else {
      // Lógica sem coringa - verificar se tem 3 iguais ou 3 diferentes
      const contagemSimbolos = {};
      simbolos.forEach(simbolo => {
        contagemSimbolos[simbolo] = (contagemSimbolos[simbolo] || 0) + 1;
      });
      
      const simbolosUnicos = Object.keys(contagemSimbolos);
      const tem3Iguais = Object.values(contagemSimbolos).some(contagem => contagem >= 3);
      const tem3Diferentes = simbolosUnicos.length === 3;
      
      console.log(`🎴 Sem coringa - contagem:`, contagemSimbolos, `símbolos únicos: [${simbolosUnicos.join(', ')}]`);
      console.log(`🎯 Sem coringa: tem 3 iguais=${tem3Iguais}, tem 3 diferentes=${tem3Diferentes}`);
      
      const podeTrocar = tem3Iguais || tem3Diferentes;
      console.log(`🎯 Sem coringa: pode trocar=${podeTrocar}`);
      return podeTrocar;
    }
  }
  
  console.log(`❌ CPU ${jogadorCPU.nome} não deve trocar (${cartasCPU.length} cartas, não forma combinação válida)`);
  return false;
}

// Função para selecionar cartas inteligentes para troca
function selecionarCartasInteligentesParaTroca(cartasCPU) {
  console.log(`🎯 Selecionando cartas inteligentes para troca...`);
  console.log(`📋 Cartas disponíveis:`, cartasCPU.map(c => `${c.territorio}(${c.simbolo})`).join(', '));
  
  const simbolos = cartasCPU.map(carta => carta.simbolo);
  const temCoringa = simbolos.includes('★');
  
  console.log(`🔍 Símbolos: [${simbolos.join(', ')}], Tem coringa: ${temCoringa}`);
  
  if (temCoringa) {
    // Se tem coringa, tentar formar a melhor combinação
    const simbolosSemCoringa = simbolos.filter(simbolo => simbolo !== '★');
    const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
    
    console.log(`🎴 Com coringa - símbolos sem coringa: [${simbolosSemCoringa.join(', ')}], únicos: [${simbolosUnicosSemCoringa.join(', ')}]`);
    
    if (simbolosSemCoringa.length === 2) {
      // 2 cartas + 1 coringa
      if (simbolosUnicosSemCoringa.length === 1) {
        // Mesmo símbolo + coringa
        const simbolo = simbolosUnicosSemCoringa[0];
        const cartasMesmoSimbolo = cartasCPU.filter(carta => carta.simbolo === simbolo);
        const coringas = cartasCPU.filter(carta => carta.simbolo === '★');
        const selecao = [...cartasMesmoSimbolo.slice(0, 2), coringas[0]].map(carta => carta.territorio);
        console.log(`✅ Selecionado: 2 iguais + coringa = [${selecao.join(', ')}]`);
        return selecao;
      } else {
        // Símbolos diferentes + coringa
        const simbolo1 = simbolosSemCoringa[0];
        const simbolo2 = simbolosSemCoringa[1];
        const carta1 = cartasCPU.find(carta => carta.simbolo === simbolo1);
        const carta2 = cartasCPU.find(carta => carta.simbolo === simbolo2);
        const coringa = cartasCPU.find(carta => carta.simbolo === '★');
        const selecao = [carta1, carta2, coringa].map(carta => carta.territorio);
        console.log(`✅ Selecionado: 2 diferentes + coringa = [${selecao.join(', ')}]`);
        return selecao;
      }
    } else if (simbolosSemCoringa.length === 1) {
      // 1 carta + 2 coringas
      const simbolo = simbolosSemCoringa[0];
      const carta = cartasCPU.find(carta => carta.simbolo === simbolo);
      const coringas = cartasCPU.filter(carta => carta.simbolo === '★').slice(0, 2);
      const selecao = [carta, ...coringas].map(carta => carta.territorio);
      console.log(`✅ Selecionado: 1 + 2 coringas = [${selecao.join(', ')}]`);
      return selecao;
    } else {
      // 3 coringas
      const coringas = cartasCPU.filter(carta => carta.simbolo === '★').slice(0, 3);
      const selecao = coringas.map(carta => carta.territorio);
      console.log(`✅ Selecionado: 3 coringas = [${selecao.join(', ')}]`);
      return selecao;
    }
  } else {
    // Sem coringa, verificar se tem 3 iguais ou 3 diferentes
    const contagemSimbolos = {};
    simbolos.forEach(simbolo => {
      contagemSimbolos[simbolo] = (contagemSimbolos[simbolo] || 0) + 1;
    });
    
    const simbolosUnicos = Object.keys(contagemSimbolos);
    const tem3Iguais = Object.values(contagemSimbolos).some(contagem => contagem >= 3);
    const tem3Diferentes = simbolosUnicos.length === 3;
    
    console.log(`🎴 Sem coringa - contagem:`, contagemSimbolos, `símbolos únicos: [${simbolosUnicos.join(', ')}]`);
    
    if (tem3Iguais) {
      // 3 iguais - encontrar o símbolo que tem 3 ou mais
      const simboloCom3 = Object.keys(contagemSimbolos).find(simbolo => contagemSimbolos[simbolo] >= 3);
      const cartasIguais = cartasCPU.filter(carta => carta.simbolo === simboloCom3).slice(0, 3);
      const selecao = cartasIguais.map(carta => carta.territorio);
      console.log(`✅ Selecionado: 3 iguais (${simboloCom3}) = [${selecao.join(', ')}]`);
      return selecao;
    } else if (tem3Diferentes) {
      // 3 diferentes
      const cartasDiferentes = simbolosUnicos.map(simbolo => 
        cartasCPU.find(carta => carta.simbolo === simbolo)
      );
      const selecao = cartasDiferentes.map(carta => carta.territorio);
      console.log(`✅ Selecionado: 3 diferentes = [${selecao.join(', ')}]`);
      return selecao;
    }
  }
  
  // Fallback: primeiras 3 cartas
  const fallback = cartasCPU.slice(0, 3).map(carta => carta.territorio);
  console.log(`⚠️ Fallback: primeiras 3 cartas = [${fallback.join(', ')}]`);
  return fallback;
}

// Função para calcular bônus de troca de cartas
function calcularBonusTrocaCartas(cartasParaTrocar, room) {
  // Simular o cálculo de bônus baseado no tipo de troca
  // Na implementação real, isso seria baseado no número de trocas já realizadas
  room.numeroTrocasRealizadas++;
  const bonus = 2 + (room.numeroTrocasRealizadas * 2); // 4, 6, 8, 10, ...
  console.log(`💰 Calculando bônus de troca na sala ${room.roomId}: troca #${room.numeroTrocasRealizadas} = ${bonus} tropas`);
  return bonus;
}

// Função para selecionar território estratégico para reforço
function selecionarTerritorioEstrategicoParaReforco(jogadorCPU, territoriosDoJogador, room) {
  const objetivo = room.objetivos[jogadorCPU.nome];
  console.log(`🎯 Selecionando território estratégico para CPU ${jogadorCPU.nome} na sala ${room.roomId} - objetivo: ${objetivo?.tipo}`);
  
  // Priorizar territórios baseado no objetivo
  if (objetivo?.tipo === 'conquistar3Continentes') {
    // Reforçar territórios em continentes alvo
    const territorioPrioritario = territoriosDoJogador.find(territorio => {
      const continente = Object.keys(room.continentes).find(cont => 
        room.continentes[cont].territorios.includes(territorio.nome)
      );
      return continente === objetivo.continente1 || continente === objetivo.continente2;
    });
    
    if (territorioPrioritario) {
      console.log(`🎯 Território prioritário selecionado: ${territorioPrioritario.nome} (continente alvo)`);
      return territorioPrioritario;
    }
  }
  
  // Reforçar territórios com menos tropas (mais vulneráveis)
  const territorioVulneravel = territoriosDoJogador.reduce((min, atual) => 
    atual.tropas < min.tropas ? atual : min
  );
  console.log(`🎯 Território vulnerável selecionado: ${territorioVulneravel.nome} (${territorioVulneravel.tropas} tropas)`);
  return territorioVulneravel;
}

// Função para processar cartas de qualquer jogador (CPU ou humano)
function processarCartasJogador(nomeJogador, room) {
  console.log(`🎴 Processando cartas para ${nomeJogador} na sala ${room.roomId} - territórios conquistados:`, room.territoriosConquistadosNoTurno[nomeJogador] || []);
  
  if (room.territoriosConquistadosNoTurno[nomeJogador] && room.territoriosConquistadosNoTurno[nomeJogador].length > 0) {
    console.log(`🎴 ${nomeJogador} conquistou ${room.territoriosConquistadosNoTurno[nomeJogador].length} territórios neste turno`);
    
    // Inicializar cartas do jogador se não existir
    if (!room.cartasTerritorio[nomeJogador]) {
      room.cartasTerritorio[nomeJogador] = [];
    }
    
    // Verificar se o jogador já tem 5 cartas (máximo permitido)
    if (room.cartasTerritorio[nomeJogador].length >= 5) {
      io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${nomeJogador} não pode receber mais cartas território (máximo 5)!`);
      console.log(`⚠️ ${nomeJogador} já tem ${room.cartasTerritorio[nomeJogador].length} cartas (máximo 5)`);
    } else {
      // Pegar uma carta do monte
      const carta = room.pegarCartaDoMonte();
      
      if (carta) {
        room.cartasTerritorio[nomeJogador].push(carta);
        
        console.log(`🎴 ${nomeJogador} ganhou carta: ${carta.territorio} (${carta.simbolo}) - Total: ${room.cartasTerritorio[nomeJogador].length} cartas`);
        console.log(`🎴 Cartas restantes no monte: ${room.monteCartas.length}`);
        io.to(room.roomId).emit('mostrarMensagem', `🎴 ${nomeJogador} ganhou uma carta território de ${carta.territorio} (${carta.simbolo}) por conquistar territórios neste turno!`);
      } else {
        console.log(`⚠️ ${nomeJogador} não pode receber carta - monte vazio`);
        io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${nomeJogador} não pode receber carta território - monte vazio!`);
      }
    }
  } else {
    console.log(`🎴 ${nomeJogador} não conquistou territórios neste turno`);
  }
  
  // Limpar territórios conquistados do jogador
  console.log(`🧹 Limpando territórios conquistados de ${nomeJogador}:`, room.territoriosConquistadosNoTurno[nomeJogador] || []);
  room.territoriosConquistadosNoTurno[nomeJogador] = [];
}

// Função para verificar se é turno de CPU
function verificarTurnoCPU(room) {
  const jogadorAtual = room.jogadores[room.indiceTurno];
  console.log(`🤖 Verificando turno de CPU na sala ${room.roomId}: ${jogadorAtual.nome} - é CPU? ${jogadorAtual.isCPU}, ativo? ${jogadorAtual.ativo}`);
  
  if (jogadorAtual.isCPU && jogadorAtual.ativo) {
    console.log(`🤖 Iniciando turno da CPU ${jogadorAtual.nome} na sala ${room.roomId}`);
    executarTurnoCPU(jogadorAtual, room);
  } else {
    console.log(`👤 Turno de jogador humano: ${jogadorAtual.nome} na sala ${room.roomId} - aguardando ação do jogador`);
  }
}

// Função para passar turno (modificada para incluir CPU)
function passarTurno(room) {
  room.indiceTurno = (room.indiceTurno + 1) % room.jogadores.length;
  
  // Pular jogadores eliminados
  while (!room.jogadores[room.indiceTurno].ativo) {
    room.indiceTurno = (room.indiceTurno + 1) % room.jogadores.length;
  }
  
  room.turno = room.jogadores[room.indiceTurno].nome;
  
  // Verificar se o jogador tem 5 ou mais cartas território e forçar troca ANTES de dar reforços
  const cartasJogador = room.cartasTerritorio[room.turno] || [];
  console.log(`🔄 Passando turno para ${room.turno} na sala ${room.roomId} - cartas: ${cartasJogador.length}`);
  
  if (cartasJogador.length >= 5) {
    const jogadorAtual = room.jogadores.find(j => j.nome === room.turno);
    console.log(`⚠️ ${room.turno} tem ${cartasJogador.length} cartas - é CPU? ${jogadorAtual.isCPU}`);
    
    if (jogadorAtual.isCPU) {
      // CPU troca cartas automaticamente
      console.log(`🤖 CPU ${room.turno} forçada a trocar ${cartasJogador.length} cartas...`);
      const cartasParaTrocar = selecionarCartasInteligentesParaTroca(cartasJogador);
      
      if (cartasParaTrocar.length === 3) {
        // Extrair as cartas que serão trocadas
        const cartasParaTrocarObjetos = cartasJogador.filter(carta => 
          cartasParaTrocar.includes(carta.territorio)
        );
        
        // Remover as 3 cartas trocadas
        const cartasRestantes = cartasJogador.filter(carta => 
          !cartasParaTrocar.includes(carta.territorio)
        );
        room.cartasTerritorio[room.turno] = cartasRestantes;
        
        // Devolver as cartas trocadas ao monte
        room.devolverCartasAoMonte(cartasParaTrocarObjetos);
        
        // Verificar se a CPU possui algum dos territórios das cartas trocadas e adicionar 2 tropas
        let territoriosReforcados = [];
        cartasParaTrocar.forEach(territorioNome => {
          const territorio = room.paises.find(p => p.nome === territorioNome);
          if (territorio && territorio.dono === room.turno) {
            territorio.tropas += 2;
            territoriosReforcados.push(territorioNome);
            console.log(`🎯 CPU ${room.turno} recebeu 2 tropas em ${territorioNome} por possuir o território da carta trocada`);
            
            // Emitir efeito visual de reforço para o território
            io.to(room.roomId).emit('mostrarEfeitoReforco', {
              territorio: territorioNome,
              jogador: room.turno,
              tipo: 'carta'
            });
          }
        });
        
        // Calcular bônus
        const bonusTroca = calcularBonusTrocaCartas(cartasParaTrocar, room);
        const territoriosDoJogador = room.paises.filter(p => p.dono === room.turno);
        
        // Distribuir tropas estrategicamente
        for (let i = 0; i < bonusTroca; i++) {
          if (territoriosDoJogador.length > 0) {
            const territorioEstrategico = selecionarTerritorioEstrategicoParaReforco(jogadorAtual, territoriosDoJogador, room);
            territorioEstrategico.tropas++;
            
            // Emitir efeito visual e som para todos os jogadores verem
            io.to(room.roomId).emit('mostrarEfeitoReforco', {
              territorio: territorioEstrategico.nome,
              jogador: room.turno
            });
            
            console.log(`🎯 CPU ${room.turno} reforçou ${territorioEstrategico.nome} com tropa de troca obrigatória (${territorioEstrategico.tropas} tropas)`);
          }
        }
        
        // Criar mensagem detalhada sobre a troca obrigatória da CPU
        let mensagemTroca = `🤖 CPU ${room.turno} trocou 3 cartas território obrigatoriamente e recebeu ${bonusTroca} tropas extras!`;
        
        if (territoriosReforcados.length > 0) {
          mensagemTroca += `\n🎯 +2 tropas em: ${territoriosReforcados.join(', ')} (territórios possuídos)`;
        }
        
        console.log(`✅ CPU ${room.turno} trocou cartas obrigatoriamente e recebeu ${bonusTroca} tropas`);
        io.to(room.roomId).emit('mostrarMensagem', mensagemTroca);
        io.to(room.roomId).emit('adicionarAoHistorico', `🃏 CPU ${room.turno} trocou 3 cartas território obrigatoriamente (+${bonusTroca} tropas${territoriosReforcados.length > 0 ? `, +2 em ${territoriosReforcados.join(', ')}` : ''})`);
        io.to(room.roomId).emit('tocarSomTakeCard');
        
        // Continuar com o turno
        enviarEstadoParaTodos(room);
      } else {
        console.log(`❌ CPU ${room.turno} não conseguiu selecionar 3 cartas para trocar`);
      }
    } else {
      // Jogador humano
      console.log(`👤 Jogador humano ${room.turno} precisa trocar cartas`);
      io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${room.turno} tem ${cartasJogador.length} cartas território! É obrigatório trocar cartas antes de continuar.`);
      io.to(room.roomId).emit('forcarTrocaCartas', { jogador: room.turno, cartas: cartasJogador });
      return; // Não avança o turno até trocar as cartas
    }
  } else {
    console.log(`✅ ${room.turno} tem ${cartasJogador.length} cartas (não precisa trocar)`);
  }
  
  const resultadoReforco = calcularReforco(room.turno, room);
  room.tropasReforco = resultadoReforco.base;
  room.tropasBonusContinente = resultadoReforco.bonus;
  
  io.to(room.roomId).emit('mostrarMensagem', `🔄 Turno de ${room.turno}. Reforços: ${room.tropasReforco} base + ${Object.values(room.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
  
  io.sockets.sockets.forEach((s) => {
    if (s.rooms.has(room.roomId)) {
      s.emit('estadoAtualizado', getEstado(s.id, room));
    }
  });
  
  // Verificar se é turno de CPU
  verificarTurnoCPU(room);
}



// Lobby functions
function startLobby(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  console.log(`🎮 Iniciando lobby para sala ${roomId}...`);
  room.lobbyActive = true;
  room.lobbyTimeLeft = 5; // 5 seconds
  
  // Start lobby timer
  room.lobbyTimer = setInterval(() => {
    room.lobbyTimeLeft--;
    
    // Check if all players are connected
    const connectedPlayers = room.jogadores.filter(j => j.socketId !== null).length;
    const totalPlayers = room.jogadores.length;
    
    if (connectedPlayers === totalPlayers) {
      console.log(`🎮 Todos os jogadores conectados na sala ${roomId}! Iniciando jogo...`);
      startGame(roomId);
      return;
    }
    
    // Check if timer expired
    if (room.lobbyTimeLeft <= 0) {
      console.log(`⏰ Timer do lobby expirou na sala ${roomId}! Iniciando jogo com CPUs...`);
      startGameWithCPUs(roomId);
      return;
    }
    
    // Send lobby update
    sendLobbyUpdate(roomId);
  }, 1000);
}

function sendLobbyUpdate(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  const lobbyData = {
    players: room.jogadores,
    timeLeft: room.lobbyTimeLeft,
    connectedPlayers: room.jogadores.filter(j => j.socketId !== null).length,
    totalPlayers: room.jogadores.length
  };
  
  io.to(roomId).emit('lobbyUpdate', lobbyData);
}

function startGame(roomId) {
  console.log(`🔧 DEBUG: startGame(${roomId}) iniciada`);
  
  const room = gameRooms.get(roomId);
  if (!room) {
    console.log(`🔧 DEBUG: ERRO - Sala ${roomId} não encontrada!`);
    return;
  }
  
  console.log(`🎮 Iniciando jogo com jogadores reais na sala ${roomId}...`);
  room.gameStarted = true;
  room.lobbyActive = false;
  console.log(`🔧 DEBUG: Estado da sala atualizado - gameStarted: ${room.gameStarted}, lobbyActive: ${room.lobbyActive}`);
  
  if (room.lobbyTimer) {
    clearInterval(room.lobbyTimer);
    room.lobbyTimer = null;
    console.log(`🔧 DEBUG: Timer do lobby da sala ${roomId} limpo`);
  }
  
  // Initialize the game
  console.log(`🔧 DEBUG: Chamando inicializarJogo(room)`);
  inicializarJogo(room);
  console.log(`🔧 DEBUG: inicializarJogo(room) concluída`);
  
  // Notify all clients that game is starting
  console.log(`🔧 DEBUG: Enviando mensagem de início para sala ${roomId}`);
  io.to(roomId).emit('mostrarMensagem', '🎮 Jogo iniciado! É a vez do jogador Azul. Clique em "Encerrar" para começar a jogar.');
  
  // Send initial state to all clients in the room
  console.log(`🔧 DEBUG: Enviando estado inicial para todos os clientes na sala ${roomId}`);
  let clientesEncontrados = 0;
  io.sockets.sockets.forEach((s) => {
    if (s.rooms.has(roomId)) {
      console.log(`🔧 DEBUG: Enviando estadoAtualizado para socket ${s.id}`);
      const estado = getEstado(s.id, room);
      console.log(`🔧 DEBUG: Estado gerado para socket ${s.id}:`, {
        meuNome: estado.meuNome,
        turno: estado.turno,
        paisesCount: estado.paises ? estado.paises.length : 0,
        jogadoresCount: estado.jogadores ? estado.jogadores.length : 0
      });
      s.emit('estadoAtualizado', estado);
      clientesEncontrados++;
    }
  });
  console.log(`🔧 DEBUG: ${clientesEncontrados} clientes receberam estadoAtualizado`);
  
  // Verificar se é turno de CPU no início do jogo
  console.log(`🎮 Verificando turno inicial na sala ${roomId}...`);
  verificarTurnoCPU(room);
  console.log(`🔧 DEBUG: startGame(${roomId}) concluída`);
}

function startGameWithCPUs(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  console.log(`🎮 Iniciando jogo com CPUs na sala ${roomId}...`);
  room.gameStarted = true;
  room.lobbyActive = false;
  
  if (room.lobbyTimer) {
    clearInterval(room.lobbyTimer);
    room.lobbyTimer = null;
  }
  
  // Activate CPUs for unconnected players
  ativarCPUs(room);
  
  // Initialize the game
  inicializarJogo(room);
  
  // Notify all clients that game is starting
  io.to(roomId).emit('mostrarMensagem', '🎮 Jogo iniciado com CPUs! É a vez do jogador Azul. Clique em "Encerrar" para começar a jogar.');
  
  // Send initial state to all clients in the room
  io.sockets.sockets.forEach((s) => {
    if (s.rooms.has(roomId)) {
      s.emit('estadoAtualizado', getEstado(s.id, room));
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Não inicializar o jogo automaticamente - aguardar primeiro jogador
  console.log('🎮 Servidor aguardando jogadores para iniciar o jogo...');
});