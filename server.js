const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS middleware for Express
app.use(cors({
  origin: [
    "https://*.itch.io",
    "https://*.itchgames.com",
    "https://*.itch.zone",
    "https://html-classic.itch.zone",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://web-production-f6a26.up.railway.app"
  ],
  credentials: true
}));

// CORS configuration for itch.io and other domains
const io = socketIo(server, {
  cors: {
    origin: [
      "https://*.itch.io",
      "https://*.itchgames.com",
      "https://*.itch.zone",
      "https://html-classic.itch.zone",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://web-production-f6a26.up.railway.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});



// Game translations for objectives
const gameTranslations = {
  en: {
    conquerAnyContinents: 'Conquer {continent1}, {continent2} and any other',
    eliminatePlayer: 'Eliminate player {player}',
    dominate24Territories: 'Dominate 24 territories',
    dominate16TerritoriesWith2Troops: 'Dominate 16 territories with at least 2 troops each'
  },
  pt: {
    conquerAnyContinents: 'Conquistar {continent1}, {continent2} e qualquer outro',
    eliminatePlayer: 'Eliminar o jogador {player}',
    dominate24Territories: 'Dominar 24 territórios',
    dominate16TerritoriesWith2Troops: 'Dominar 16 territórios com pelo menos 2 tropas em cada'
  },
  ru: {
    conquerAnyContinents: 'Завоевать {continent1}, {continent2} и любой другой',
    eliminatePlayer: 'Устранить игрока {player}',
    dominate24Territories: 'Доминировать над 24 территориями',
    dominate16TerritoriesWith2Troops: 'Доминировать над 16 территориями с минимум 2 войсками в каждой'
  },
  zh: {
    conquerAnyContinents: '征服{continent1}、{continent2}和任何其他',
    eliminatePlayer: '消灭玩家{player}',
    dominate24Territories: '统治24个地区',
    dominate16TerritoriesWith2Troops: '统治16个地区，每个地区至少2个部队'
  },
  hi: {
    conquerAnyContinents: '{continent1}, {continent2} और कोई अन्य पर विजय प्राप्त करें',
    eliminatePlayer: 'खिलाड़ी {player} को हराएं',
    dominate24Territories: '24 क्षेत्रों पर प्रभुत्व स्थापित करें',
    dominate16TerritoriesWith2Troops: '16 क्षेत्रों पर प्रभुत्व स्थापित करें, प्रत्येक में कम से कम 2 सैनिक'
  },
  de: {
    conquerAnyContinents: '{continent1}, {continent2} und jeden anderen erobern',
    eliminatePlayer: 'Spieler {player} eliminieren',
    dominate24Territories: '24 Gebiete dominieren',
    dominate16TerritoriesWith2Troops: '16 Gebiete mit mindestens 2 Truppen in jedem dominieren'
  },
  ja: {
    conquerAnyContinents: '{continent1}、{continent2}とその他のいずれかを征服する',
    eliminatePlayer: 'プレイヤー{player}を排除する',
    dominate24Territories: '24の地域を支配する',
    dominate16TerritoriesWith2Troops: '各地域に最低2部隊ずつ配置して16の地域を支配する'
  }
};

// Default language
const defaultLang = 'en';

// Game Room Class for Multi-Room Support
class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    
    // Lobby variables
    this.lobbyActive = false;
    this.lobbyTimer = null;
    this.lobbyTimeLeft = 5; // 5 seconds
    this.gameStarted = false;
    
    // Turn timer variables
    this.turnTimer = null;
    this.turnTimeLeft = 90; // 1:30 in seconds
    this.turnTimerActive = false;
    
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
    this.jogadorVencedor = null;
    
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
  { nome: 'Qumaran', x: 1060, y: 247, dono: 'Vermelho', tropas: 5, vizinhos: ['Omradan', 'Sa\'Torran', 'Tzun\'Rakai', 'Darakai', 'Shōrenji','Kaer\'Tai','Ish\'Tanor', 'Mei\'Zhara'] },
  { nome: 'Tzun\'Rakai', x: 1122, y: 274, dono: 'Verde', tropas: 5, vizinhos: ['Qumaran', 'Omradan'] },
  { nome: 'Mei\'Zhara', x: 866, y: 220, dono: 'Amarelo', tropas: 5, vizinhos: ['Sa\'Torran', 'Qumaran', 'Xin\'Qari'] },
  { nome: 'Darakai', x: 961, y: 352, dono: 'Preto', tropas: 5, vizinhos: ['Qumaran', 'Kaer\'Tai', 'Ish\'Tanor','Winterholde'] },
  { nome: 'Ish\'Tanor', x: 963, y: 349, dono: 'Roxo', tropas: 5, vizinhos: ['Tzun\'Rakai', 'Darakai', 'Winterholde','Qumaran', 'Aetheris'] },
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
    
    // Sistema de rastreamento de tropas individuais movidas
    this.tropasMovidas = {}; // { jogador: { territorio: { tropasOriginais: X, tropasMovidas: Y, tropasIndividuais: [] } } }

    // Sistema de cartas território
    this.territoriosConquistadosNoTurno = {}; // { jogador: [territorios] }
    this.cartasTerritorio = {}; // { jogador: [cartas] }
    this.monteCartas = []; // Monte de cartas território disponíveis
    this.simbolosCartas = ['▲', '■', '●', '★']; // Triângulo, quadrado, círculo, coringa
    this.numeroTrocasRealizadas = 0; // Contador de trocas para bônus progressivo
    
    // 🎴 Sistema de rastreamento de conquistas para eliminações
    this.ultimoConquistador = {}; // { territorio: jogador }

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
      // Escolher um símbolo com probabilidades específicas
      const simbolo = this.escolherSimboloCarta();
      
      const carta = {
        territorio: pais.nome,
        simbolo: simbolo
      };
      
      this.monteCartas.push(carta);
    });
    
    // Embaralhar o monte
    this.embaralharMonte();
    
    
  }

  // Função para escolher símbolo de carta com probabilidades específicas
  escolherSimboloCarta() {
    const random = Math.random();
    
    // 10% de chance para estrela (★) - símbolo curinga
    if (random < 0.1) {
      return '★';
    }
    // 30% de chance para cada um dos outros símbolos (▲, ■, ●)
    else if (random < 0.4) {
      return '▲';
    }
    else if (random < 0.7) {
      return '■';
    }
    else {
      return '●';
    }
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
    
    
  }
}

// Global rooms management
const gameRooms = new Map();
let nextRoomId = 1;

// Turn Timer System Functions (Global scope)
function startTurnTimer(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  // Clear existing timer
  if (room.turnTimer) {
    clearInterval(room.turnTimer);
  }
  
  room.turnTimeLeft = 90; // Reset to 1:30
  room.turnTimerActive = true;
  
  
  
  // Send initial timer state to all players
  io.to(roomId).emit('turnTimerUpdate', {
    timeLeft: room.turnTimeLeft,
    active: true,
    currentPlayer: room.turno
  });
  
  room.turnTimer = setInterval(() => {
    room.turnTimeLeft--;
    
    // Send timer update to all players in the room
    io.to(roomId).emit('turnTimerUpdate', {
      timeLeft: room.turnTimeLeft,
      active: true,
      currentPlayer: room.turno
    });
    
    
    
    if (room.turnTimeLeft <= 0) {
      
      forceTurnPassByTimer(roomId);
    }
  }, 1000);
}

function stopTurnTimer(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  if (room.turnTimer) {
    clearInterval(room.turnTimer);
    room.turnTimer = null;
  }
  
  room.turnTimerActive = false;
  room.turnTimeLeft = 0;
  
  
  
  // Send timer stop to all players
  io.to(roomId).emit('turnTimerUpdate', {
    timeLeft: 0,
    active: false,
    currentPlayer: room.turno
  });
}

function forceTurnPassByTimer(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  
  
  // Stop current timer
  stopTurnTimer(roomId);
  
  // Find current player and move to next
  const currentPlayerIndex = room.jogadores.findIndex(j => j.nome === room.turno && j.ativo);
  if (currentPlayerIndex !== -1) {
    // Clear any remaining actions for current player
    room.faseRemanejamento = false;
    room.tropasBonusContinente = {};
    
    // Process cards for current player
    processarCartasJogador(room.turno, room);
    
    // Clear movement control for current player
    if (room.movimentosRemanejamento[room.turno]) {
      delete room.movimentosRemanejamento[room.turno];
    }
    
    // Clear troop movement tracking for current player
    if (room.tropasMovidas[room.turno]) {
      delete room.tropasMovidas[room.turno];
    }
    
    // Find next active player
    let nextPlayerIndex = (currentPlayerIndex + 1) % room.jogadores.length;
    let attempts = 0;
    
    while (!room.jogadores[nextPlayerIndex].ativo && attempts < room.jogadores.length) {
      nextPlayerIndex = (nextPlayerIndex + 1) % room.jogadores.length;
      attempts++;
    }
    
    if (attempts < room.jogadores.length) {
      room.turno = room.jogadores[nextPlayerIndex].nome;
      room.indiceTurno = nextPlayerIndex;
      
      const resultadoReforco = calcularReforco(room.turno, room);
      room.tropasReforco = resultadoReforco.base;
      room.tropasBonusContinente = resultadoReforco.bonus;
      
      
      
      // Send message about timeout
      io.to(roomId).emit('mostrarMensagem', `⏰ Turno de ${room.jogadores[currentPlayerIndex].nome} expirou. Agora é a vez de ${room.turno}.`);
      
      // Send updated state to all players
      enviarEstadoParaTodos(room);
      
      // Start timer for next player if they're human
      const nextPlayer = room.jogadores[nextPlayerIndex];
      if (!nextPlayer.isCPU) {
        setTimeout(() => {
          startTurnTimer(roomId);
        }, 1000); // Small delay to allow UI updates
      } else {
        // If next player is CPU, activate them
        setTimeout(() => {
          verificarTurnoCPU(room);
        }, 1000);
      }
    }
  }
}

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
      
      createRoomFromGlobalLobby();
      return;
    }
    
    // Debug log every 5 seconds
    if (globalLobby.timeLeft % 5 === 0) {
      
    }
  }, 1000);
}

function createRoomFromGlobalLobby() {
  
  
  if (globalLobby.timer) {
    clearInterval(globalLobby.timer);
    globalLobby.timer = null;
    
  }
  
  globalLobby.active = false;
  
  
  // Create a new room
  const roomId = nextRoomId.toString();
  nextRoomId++;
  
  
  const room = getOrCreateRoom(roomId);
  
  
  // Randomize the order of players (colors) for this game
  
  
  // Create a new array with randomized player order
  const nomesCores = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Preto', 'Roxo'];
  const nomesEmbaralhados = [...nomesCores];
  
  // Fisher-Yates shuffle
  for (let i = nomesEmbaralhados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nomesEmbaralhados[i], nomesEmbaralhados[j]] = [nomesEmbaralhados[j], nomesEmbaralhados[i]];
  }
  
  // Create new player objects with randomized names
  room.jogadores = nomesEmbaralhados.map(nome => ({
    nome: nome,
    ativo: true,
    socketId: null,
    isCPU: false
  }));
  
  
  
  // Randomize who plays first (real players vs CPUs)
  
  
  // First, create all player objects (real players + CPUs)
  const todosJogadores = [];
  
  // Add real players
  globalLobby.players.forEach((player, index) => {
    if (index < 6) { // Maximum 6 players
      const jogador = room.jogadores[index];
      jogador.socketId = player.socketId;
      jogador.isCPU = false;
      jogador.nomeReal = player.username; // Preservar o nome de usuário real
      jogador.language = player.language || 'en'; // Armazenar idioma do jogador
      todosJogadores.push({ jogador, player, isReal: true });
      
      
      
      // Join the player to the room
      const socket = io.sockets.sockets.get(player.socketId);
      if (socket) {
        socket.join(roomId);
        
      } else {
        
      }
    }
  });
  
  // Add CPUs
  const cpuSlots = 6 - globalLobby.players.length;
  
  for (let i = globalLobby.players.length; i < 6; i++) {
    const jogador = room.jogadores[i];
    jogador.isCPU = true;
    jogador.socketId = null;
    todosJogadores.push({ jogador, isReal: false });
    
  }
  
  // Shuffle the order of who plays first (real players and CPUs mixed)
  
  for (let i = todosJogadores.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todosJogadores[i], todosJogadores[j]] = [todosJogadores[j], todosJogadores[i]];
  }
  
  // Reorder room.jogadores based on the shuffled play order
  room.jogadores = todosJogadores.map(slot => slot.jogador);
  
  
  
  
  
  
  
  // Notify all players that game is starting
  
  io.to(roomId).emit('gameStarting', { roomId: roomId });
  
  // Start the game
  
  startGame(roomId);
  
  // Clear global lobby
  globalLobby.players = [];
  
}

function addPlayerToGlobalLobby(socketId, username, language = 'en') {
  // Check if player is already in lobby
  const existingPlayer = globalLobby.players.find(p => p.socketId === socketId);
  if (existingPlayer) return;
  
  // Add player to global lobby
  globalLobby.players.push({
    socketId: socketId,
    username: username,
    language: language || 'en'
  });
  
  
  
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
  

  // Handle player joining global lobby
  socket.on('playerJoinedGlobalLobby', (data) => {
    
    
    // Add player to global lobby
    addPlayerToGlobalLobby(socket.id, data.username, data.language);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    
    
    // Remove from global lobby first
    removePlayerFromGlobalLobby(socket.id);
    
    // Find which room this socket belongs to
    let playerRoom = null;
    let disconnectedPlayer = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        disconnectedPlayer = jogador;
        jogador.socketId = null;
        
        break;
      }
    }
    
    // Handle disconnection during game
    if (playerRoom && playerRoom.gameStarted && disconnectedPlayer) {
      
      
      // Notify all players about the disconnection
      io.to(playerRoom.roomId).emit('mostrarMensagem', `⚠️ ${disconnectedPlayer.nome} desconectou! CPU assumirá o controle.`);
      io.to(playerRoom.roomId).emit('adicionarAoHistorico', `⚠️ ${disconnectedPlayer.nome} desconectou - CPU assumindo controle`);
      
      // If it's the disconnected player's turn, pass the turn immediately
      if (playerRoom.turno === disconnectedPlayer.nome) {
        
        io.to(playerRoom.roomId).emit('mostrarMensagem', `🔄 Turno de ${disconnectedPlayer.nome} passado automaticamente devido à desconexão.`);
        
        // Pass the turn immediately
        passarTurno(playerRoom);
      }
      
      // Activate CPU for the disconnected player
      if (!disconnectedPlayer.isCPU) {
        disconnectedPlayer.isCPU = true;
        
        io.to(playerRoom.roomId).emit('mostrarMensagem', `🤖 CPU ativada para ${disconnectedPlayer.nome}`);
        
        // Check if it's now a CPU turn
        verificarTurnoCPU(playerRoom);
      }
      
      // Send updated state to all remaining clients
      enviarEstadoParaTodos(playerRoom);
    }
    
    // Send lobby update to the room if found (for lobby phase)
    if (playerRoom && !playerRoom.gameStarted) {
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
      
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota) {
      
      return;
    }
    
    // Verificar se está na fase de remanejamento (não pode colocar reforços)
    if (playerRoom.faseRemanejamento) {
      
      io.to(playerRoom.roomId).emit('mostrarMensagem', `❌ ${playerRoom.turno} não pode colocar reforços durante a fase de remanejamento!`);
      return;
    }

    const pais = playerRoom.paises.find(p => p.nome === nomePais);
    
    if (!pais || pais.dono !== playerRoom.turno) {
      
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
        tipo: 'reforco',
        quantidade: 1
      });

      // Send updated state to all clients in this room
      enviarEstadoParaTodos(playerRoom);
      
      // Verificar vitória após colocar reforço
      checarVitoria(playerRoom);
    } else {
      
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
    const dadosDefesa = Math.min(defensorPais.tropas, 3);

    const rolagemAtaque = Array.from({ length: dadosAtaque }, rolarDado).sort((a, b) => b - a);
    const rolagemDefesa = Array.from({ length: dadosDefesa }, rolarDado).sort((a, b) => b - a);

    let resultadoMensagem = `${de} ataca ${para}
    Ataque: [${rolagemAtaque.join(', ')}] | Defesa: [${rolagemDefesa.join(', ')}]\n`;

    const comparacoes = Math.min(rolagemAtaque.length, rolagemDefesa.length);
    for (let i = 0; i < comparacoes; i++) {
        if (rolagemAtaque[i] > rolagemDefesa[i]) {
        defensorPais.tropas--;
        resultadoMensagem += `Defesa perdeu 1 tropa.\n`;
        // Emitir efeito de explosão para tropas perdidas na defesa
        io.to(playerRoom.roomId).emit('mostrarEfeitoExplosaoTropas', {
          territorio: para
        });
        } else {
        atacantePais.tropas--;
        resultadoMensagem += `Ataque perdeu 1 tropa.\n`;
        // Emitir efeito de explosão para tropas perdidas no ataque
        io.to(playerRoom.roomId).emit('mostrarEfeitoExplosaoTropas', {
          territorio: de
        });
        }
    }

    if (defensorPais.tropas <= 0) {
        // 🎴 Registrar quem conquistou este território para rastrear eliminações
        if (!playerRoom.ultimoConquistador) {
          playerRoom.ultimoConquistador = {};
        }
        playerRoom.ultimoConquistador[para] = playerRoom.turno;
        
        defensorPais.dono = atacantePais.dono;
        defensorPais.tropas = 1; // Colocar 1 tropa no território conquistado
        atacantePais.tropas -= 1; // Remover 1 tropa do território atacante
        resultadoMensagem += `${para} foi conquistado por ${playerRoom.turno}!\n`;
        
        // Registrar território conquistado no turno atual
        if (!playerRoom.territoriosConquistadosNoTurno[playerRoom.turno]) {
          playerRoom.territoriosConquistadosNoTurno[playerRoom.turno] = [];
        }
        playerRoom.territoriosConquistadosNoTurno[playerRoom.turno].push(para);
        
        // Calcular tropas disponíveis para transferência
        // Máximo de tropas que podem ser transferidas: atacantePais.tropas - 1 (deixar pelo menos 1)
        // Mas limitado a 2 tropas adicionais (além da automática)
        const tropasAdicionais = Math.min(atacantePais.tropas - 1, 2); // Máximo 2 tropas adicionais, mínimo 1 no atacante
        const tropasDisponiveis = tropasAdicionais; // Apenas tropas adicionais (sem incluir a automática)
        
        // Sempre emitir evento de território conquistado para efeitos visuais
        io.to(playerRoom.roomId).emit('territorioConquistado', {
          territorioConquistado: para,
          territorioAtacante: de,
          tropasDisponiveis: tropasDisponiveis, // Apenas tropas adicionais (sem a automática)
          tropasAdicionais: tropasAdicionais, // Apenas tropas adicionais (sem a automática)
          jogadorAtacante: playerRoom.turno
        });
        
        // Emitir evento para mostrar explosão de conquista
        io.to(playerRoom.roomId).emit('mostrarEfeitoExplosaoConquista', {
          territorio: para,
          jogador: playerRoom.turno
        });
        
        // Se há tropas adicionais disponíveis, mostrar interface de escolha
        if (tropasAdicionais > 0) {
          // Interface será mostrada pelo cliente quando receber o evento
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
    
    // Limpar o rastreamento de tropas movidas do jogador atual
    if (playerRoom.tropasMovidas[playerRoom.turno]) {
      delete playerRoom.tropasMovidas[playerRoom.turno];
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
    
    // Stop timer for player who passed turn
    stopTurnTimer(playerRoom.roomId);
    
    // Start timer for next player if they're human
    const nextPlayer = playerRoom.jogadores[playerRoom.indiceTurno];
    if (!nextPlayer.isCPU) {
      setTimeout(() => {
        startTurnTimer(playerRoom.roomId);
      }, 1000); // Small delay to allow UI updates
    }
    
    // Verificar se é turno de CPU
    verificarTurnoCPU(playerRoom);

  });

  // Player inactive event - handle player disconnection due to inactivity
  socket.on('playerInactive', (data) => {
    
    
    
    // Find which room this socket belongs to
    let playerRoom = null;
    for (const [roomId, room] of gameRooms) {
      const jogador = room.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        playerRoom = room;
        
        break;
      }
    }
    
    if (!playerRoom) {
      
      return;
    }
    
    if (!playerRoom.gameStarted) {
      
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    if (!jogador) {
      
      return;
    }
    
    
    
    
    
    // Convert player to CPU
    jogador.isCPU = true;
    jogador.ativo = true;
    jogador.socketId = null; // Remove socket association
    
    
    
    // Notify other players
    io.to(playerRoom.roomId).emit('mostrarMensagem', `🤖 ${jogador.nome} foi desconectado por inatividade e substituído por uma CPU`);
    
    // Send updated state
    enviarEstadoParaTodos(playerRoom);
    
    // If it was this player's turn, continue with CPU turn
    if (playerRoom.turno === jogador.nome) {
      
      verificarTurnoCPU(playerRoom);
    } else {
      
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
    
    // Clear troop movement tracking for current player
    if (playerRoom.tropasMovidas[playerRoom.turno]) {
      delete playerRoom.tropasMovidas[playerRoom.turno];
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
      
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    
    
    if (!jogador || jogador.nome !== playerRoom.turno) {
      
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Não é sua vez!' });
      return;
    }
    
    // Verificar se está na fase de remanejamento (não pode trocar cartas)
    if (playerRoom.faseRemanejamento) {
      
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: '❌ Não é possível trocar cartas durante a fase de remanejamento!' });
      return;
    }

    const cartas = playerRoom.cartasTerritorio[jogador.nome] || [];
    
    // Verificar se tem exatamente 3 cartas selecionadas
    if (cartasSelecionadas.length !== 3) {
      
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Você deve selecionar exatamente 3 cartas para trocar!' });
      return;
    }

    // Verificar se todas as cartas selecionadas existem no deck do jogador
    const cartasValidas = cartasSelecionadas.every(territorio => cartas.some(carta => carta.territorio === territorio));
    
    if (!cartasValidas) {
      
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
        
        
        // Emitir efeito visual de reforço para o território
        io.to(playerRoom.roomId).emit('mostrarEfeitoReforco', {
          territorio: territorioNome,
          jogador: jogador.nome,
          tipo: 'carta',
          quantidade: 2
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
    
    
    socket.emit('resultadoTrocaCartas', { sucesso: true, mensagem: mensagemJogador });
    
    // Se era uma troca obrigatória, continuar o turno
    const cartasRestantes = playerRoom.cartasTerritorio[jogador.nome] || [];
    if (cartasRestantes.length < 5) {
      // Continuar o turno normalmente com bônus adicional
      // Preservar as tropas de bônus que já foram colocadas
      const tropasBonusExistentes = { ...playerRoom.tropasBonusContinente };
      
      // Calcular apenas as tropas base (sem recalcular bônus de continentes)
      const territorios = playerRoom.paises.filter(p => p.dono === playerRoom.turno).length;
      const reforcoBase = Math.max(3, Math.floor(territorios / 2));
      
      playerRoom.tropasReforco = reforcoBase + bonusTroca; // Adicionar bônus da troca
      playerRoom.tropasBonusContinente = tropasBonusExistentes; // Manter as tropas de bônus existentes

      io.to(playerRoom.roomId).emit('mostrarMensagem', `🎮 Turno de ${playerRoom.turno}. Reforços: ${reforcoBase} base + ${bonusTroca} bônus da troca + ${Object.values(playerRoom.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus de continentes restantes`);
    }
    
    // Atualizar estado para todos os clientes na sala
    enviarEstadoParaTodos(playerRoom);
    
    // Verificar vitória após troca de cartas
    checarVitoria(playerRoom);
  });

  socket.on('verificarMovimentoRemanejamento', (dados) => {
    
    
    
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
      
      return;
    }
    
    const jogador = playerRoom.jogadores.find(j => j.socketId === socket.id);
    
    
    
    
    if (jogador.nome !== playerRoom.turno || playerRoom.vitoria || playerRoom.derrota || !playerRoom.faseRemanejamento) {
      
      
      
      
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Não é sua vez ou não está na fase de remanejamento' });
      return;
    }

    const territorioOrigem = playerRoom.paises.find(p => p.nome === dados.origem);
    const territorioDestino = playerRoom.paises.find(p => p.nome === dados.destino);
    
    
    
    
    if (!territorioOrigem || !territorioDestino) {
      
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não encontrados' });
      return;
    }
    
    
    
    
    if (territorioOrigem.dono !== playerRoom.turno || territorioDestino.dono !== playerRoom.turno) {
      
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não são seus' });
      return;
    }
    
    if (!territorioOrigem.vizinhos.includes(territorioDestino.nome)) {
      
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não são vizinhos' });
      return;
    }

    // Inicializar rastreamento de tropas movidas para o jogador
    if (!playerRoom.tropasMovidas[playerRoom.turno]) {
      playerRoom.tropasMovidas[playerRoom.turno] = {};
    }
    
    // Inicializar rastreamento para o território de origem se não existir
    if (!playerRoom.tropasMovidas[playerRoom.turno][dados.origem]) {
      playerRoom.tropasMovidas[playerRoom.turno][dados.origem] = {
        tropasOriginais: territorioOrigem.tropas,
        tropasMovidas: 0,
        tropasIndividuais: [] // Array para rastrear cada tropa individualmente
      };
    }
    
    // Inicializar rastreamento para o território de destino se não existir
    if (!playerRoom.tropasMovidas[playerRoom.turno][dados.destino]) {
      playerRoom.tropasMovidas[playerRoom.turno][dados.destino] = {
        tropasOriginais: territorioDestino.tropas,
        tropasMovidas: 0,
        tropasIndividuais: []
      };
    }
    
    // Calcular quantas tropas já foram movidas deste território
    const tropasJaMovidas = playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasMovidas;
    
    // Calcular tropas disponíveis considerando as regras:
    // 1. Máximo de tropas transferíveis = tropas originais - 1 (sempre deve permanecer 1 tropa)
    // 2. O território de destino NÃO limita o movimento - pode receber quantas tropas quiser
    const tropasDisponiveis = playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasOriginais - tropasJaMovidas - 1; // Deixar pelo menos 1 tropa
    
    // Garantir que não seja negativo
    const tropasDisponiveisFinal = Math.max(0, tropasDisponiveis);
    
    if (tropasDisponiveisFinal <= 0) {
      socket.emit('resultadoVerificacaoMovimento', { 
        podeMover: false, 
        quantidadeMaxima: 0, 
        motivo: `Não é possível mover mais tropas de ${dados.origem} - todas as tropas disponíveis já foram movidas ou precisa deixar pelo menos 1 tropa.` 
      });
      return;
    }

    // A quantidade máxima é o mínimo entre as tropas disponíveis e o que pode ser movido
    const quantidadeMaxima = Math.min(tropasDisponiveisFinal, playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasOriginais - 1);

    
    const resposta = { 
      podeMover: true, 
      quantidadeMaxima: quantidadeMaxima,
      territorioDestino: dados.destino,
      motivo: null
    };
    
    socket.emit('resultadoVerificacaoMovimento', resposta);
  });

  socket.on('moverTropas', (dados) => {
    
    
    
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

    // Inicializar rastreamento de tropas movidas para o jogador
    if (!playerRoom.tropasMovidas[playerRoom.turno]) {
      playerRoom.tropasMovidas[playerRoom.turno] = {};
    }
    
    // Inicializar rastreamento para o território de origem se não existir
    if (!playerRoom.tropasMovidas[playerRoom.turno][dados.origem]) {
      playerRoom.tropasMovidas[playerRoom.turno][dados.origem] = {
        tropasOriginais: territorioOrigem.tropas,
        tropasMovidas: 0,
        tropasIndividuais: [] // Array para rastrear cada tropa individualmente
      };
    }
    
    // Calcular quantas tropas já foram movidas deste território
    const tropasJaMovidas = playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasMovidas;
    
    // Calcular tropas disponíveis considerando as regras:
    // 1. Máximo de tropas transferíveis = tropas originais - 1 (sempre deve permanecer 1 tropa)
    // 2. O território de destino NÃO limita o movimento - pode receber quantas tropas quiser
    const tropasDisponiveis = playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasOriginais - tropasJaMovidas - 1; // Deixar pelo menos 1 tropa
    
    // Garantir que não seja negativo
    const tropasDisponiveisFinal = Math.max(0, tropasDisponiveis);
    
    if (tropasDisponiveisFinal <= 0) {
      const mensagemErro = `Não é possível mover mais tropas de ${dados.origem} - todas as tropas disponíveis já foram movidas ou precisa deixar pelo menos 1 tropa.`;
      socket.emit('mostrarMensagem', mensagemErro);
      return;
    }



    // Verificar se a quantidade é válida (não exceder tropas disponíveis)
    if (dados.quantidade > tropasDisponiveisFinal) {
      const mensagemErro = `Não é possível mover ${dados.quantidade} tropas de ${dados.origem} - apenas ${tropasDisponiveisFinal} tropas estão disponíveis para movimento.`;
      socket.emit('mostrarMensagem', mensagemErro);
      return;
    }

    // Registrar o movimento no sistema de rastreamento de tropas
    playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasMovidas += dados.quantidade;
    
    // Rastrear cada tropa individualmente para garantir que não seja movida mais de uma vez
    for (let i = 0; i < dados.quantidade; i++) {
      const tropaId = `${dados.origem}_${Date.now()}_${i}`;
      playerRoom.tropasMovidas[playerRoom.turno][dados.origem].tropasIndividuais.push({
        id: tropaId,
        origem: dados.origem,
        destino: dados.destino,
        turno: playerRoom.turno
      });
    }
    
    // Inicializar rastreamento para o território de destino se não existir
    if (!playerRoom.tropasMovidas[playerRoom.turno][dados.destino]) {
      playerRoom.tropasMovidas[playerRoom.turno][dados.destino] = {
        tropasOriginais: territorioDestino.tropas,
        tropasMovidas: 0,
        tropasIndividuais: []
      };
    }
    
    // Registrar as tropas movidas no território de destino
    playerRoom.tropasMovidas[playerRoom.turno][dados.destino].tropasMovidas += dados.quantidade;
    
    // Manter o registro no sistema antigo para compatibilidade
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno]) playerRoom.movimentosRemanejamento[playerRoom.turno] = {};
    if (!playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem]) playerRoom.movimentosRemanejamento[playerRoom.turno][dados.origem] = {};
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
    playerRoom.tropasMovidas = {}; // Resetar rastreamento de tropas movidas
    playerRoom.numeroTrocasRealizadas = 0; // Resetar contador de trocas
    playerRoom.cartasTerritorio = {}; // Resetar cartas território
    playerRoom.inicializarMonteCartas(); // Reinicializar monte de cartas
    playerRoom.territoriosConquistadosNoTurno = {}; // Resetar territórios conquistados
    
    // 🎴 Resetar sistema de rastreamento de conquistas
    playerRoom.ultimoConquistador = {};

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
  
  
  let meuNome = null;
  if (socketId && room) {
    const jogador = room.jogadores.find(j => j.socketId === socketId);
    if (jogador) {
      meuNome = jogador.nome;
      
    } else {
      
    }
  }

  // Calcular controle dos continentes por jogador
  
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

  // Determinar vitória/derrota específica para este jogador
  let vitoria = false;
  let derrota = false;
  
  if (room.vitoria && meuNome) {
    // Se há um vencedor, verificar se é este jogador
    const jogadorVencedor = room.jogadorVencedor;
    if (jogadorVencedor) {
      vitoria = (meuNome === jogadorVencedor);
      derrota = (meuNome !== jogadorVencedor);
    }
  }

  const estado = {
    jogadores: room.jogadores,
    turno: room.turno,
    paises: room.paises,
    tropasReforco: room.tropasReforco,
    tropasBonusContinente: room.tropasBonusContinente,
    vitoria: vitoria,
    derrota: derrota,
    meuNome,
    continentes: controleContinentes,
    objetivos: room.objetivos,
    continentePrioritario,
    faseRemanejamento: room.faseRemanejamento,
    cartasTerritorio: room.cartasTerritorio,
    cartasNoMonte: room.monteCartas.length
  };
  
  return estado;
}

// Função para enviar estado atualizado para todos os jogadores da sala
function enviarEstadoParaTodos(room) {
  
  
  room.jogadores.forEach(jogador => {
    if (jogador.socketId) {
      
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
      io.to(room.roomId).emit('mostrarMensagem', `${jogador.nome} foi eliminado!`);
      
      // 🎴 TRANSFERIR CARTAS DO JOGADOR ELIMINADO PARA O JOGADOR QUE O ELIMINOU
      transferirCartasDoEliminado(jogador.nome, room);
      
      // 🎯 REATRIBUIR OBJETIVOS DE JOGADORES QUE TINHAM COMO ALVO O JOGADOR ELIMINADO
      reatribuirObjetivosEliminacao(jogador.nome, room);
      
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

// 🎴 Função para transferir cartas do jogador eliminado para o jogador que o eliminou
function transferirCartasDoEliminado(jogadorEliminado, room) {
  // Encontrar o jogador que eliminou (aquele que conquistou o último território)
  const jogadorEliminador = encontrarJogadorEliminador(jogadorEliminado, room);
  
  if (!jogadorEliminador) {
    
    return;
  }
  
  // Obter cartas do jogador eliminado
  const cartasDoEliminado = room.cartasTerritorio[jogadorEliminado] || [];
  
  if (cartasDoEliminado.length === 0) {
    
    return;
  }
  
  // Obter cartas atuais do jogador eliminador
  const cartasAtuaisEliminador = room.cartasTerritorio[jogadorEliminador] || [];
  
  // Calcular quantas cartas podem ser transferidas (máximo 5)
  const espacoDisponivel = 5 - cartasAtuaisEliminador.length;
  const cartasParaTransferir = Math.min(cartasDoEliminado.length, espacoDisponivel);
  
  if (cartasParaTransferir <= 0) {
    
    io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${jogadorEliminador} não pode receber cartas de ${jogadorEliminado} - já tem 5 cartas!`);
    return;
  }
  
  // Transferir as cartas
  const cartasTransferidas = cartasDoEliminado.slice(0, cartasParaTransferir);
  const cartasRestantes = cartasDoEliminado.slice(cartasParaTransferir);
  
  // Adicionar cartas ao jogador eliminador
  room.cartasTerritorio[jogadorEliminador] = [...cartasAtuaisEliminador, ...cartasTransferidas];
  
  // Limpar cartas do jogador eliminado
  room.cartasTerritorio[jogadorEliminado] = [];
  
  // Devolver cartas restantes ao monte (se houver)
  if (cartasRestantes.length > 0) {
    room.devolverCartasAoMonte(cartasRestantes);
    
  }
  
  // Log e mensagem para os jogadores
  
  
  if (cartasTransferidas.length === cartasDoEliminado.length) {
    io.to(room.roomId).emit('mostrarMensagem', `🎴 ${jogadorEliminador} recebeu TODAS as ${cartasTransferidas.length} cartas de ${jogadorEliminado} por eliminá-lo!`);
  } else {
    io.to(room.roomId).emit('mostrarMensagem', `🎴 ${jogadorEliminador} recebeu ${cartasTransferidas.length} cartas de ${jogadorEliminado} por eliminá-lo! (${cartasRestantes.length} cartas devolvidas ao monte)`);
  }
  
  // Log detalhado das cartas transferidas
  const detalhesCartas = cartasTransferidas.map(c => `${c.territorio}(${c.simbolo})`).join(', ');
  
  
}

// 🎴 Função para identificar quem eliminou o jogador
function encontrarJogadorEliminador(jogadorEliminado, room) {
  // Procurar pelo último território que foi conquistado do jogador eliminado
  // Vamos usar o histórico de conquistas do turno atual
  
  // Primeiro, tentar encontrar pelo histórico de conquistas do turno atual
  for (const [jogador, territorios] of Object.entries(room.territoriosConquistadosNoTurno)) {
    if (jogador !== jogadorEliminado) {
      // Verificar se algum dos territórios conquistados pertencia ao jogador eliminado
      for (const territorioNome of territorios) {
        // Se o território foi conquistado neste turno, o jogador que o conquistou é o eliminador
        return jogador;
      }
    }
  }
  
  // Se não encontrou pelo histórico, usar o sistema de rastreamento de conquistas
  if (room.ultimoConquistador) {
    // Procurar por territórios que eram do jogador eliminado e foram conquistados
    for (const [territorio, conquistador] of Object.entries(room.ultimoConquistador)) {
      // Verificar se este território ainda pertence ao conquistador (não foi reconquistado)
      const territorioAtual = room.paises.find(p => p.nome === territorio);
      if (territorioAtual && territorioAtual.dono === conquistador) {
        // Este território foi conquistado pelo conquistador e ainda pertence a ele
        // Verificar se era do jogador eliminado (isso seria feito de forma mais precisa)
        // Por enquanto, vamos usar uma abordagem mais simples
        return conquistador;
      }
    }
  }
  
  // Fallback: procurar pelo último território que foi conquistado no turno atual
  // Isso pode acontecer se a eliminação ocorreu em um turno anterior
  const territoriosDoEliminado = room.paises.filter(p => p.dono !== jogadorEliminado && p.dono !== 'neutro');
  
  // Encontrar o jogador que controla o território que era do eliminado
  if (territoriosDoEliminado.length > 0) {
    // Pegar o primeiro território que encontramos (não é a solução mais precisa, mas funciona)
    return territoriosDoEliminado[0].dono;
  }
  
  return null;
}

// 🎯 Função para reatribuir objetivos quando o jogador alvo for eliminado
function reatribuirObjetivosEliminacao(jogadorEliminado, room) {
  
  
  // Procurar por jogadores que tinham como objetivo eliminar o jogador que foi eliminado
  const jogadoresComObjetivoEliminado = [];
  
  for (const [nomeJogador, objetivo] of Object.entries(room.objetivos)) {
    if (objetivo.tipo === 'eliminarJogador' && objetivo.jogadorAlvo === jogadorEliminado) {
      jogadoresComObjetivoEliminado.push(nomeJogador);
      
    }
  }
  
  if (jogadoresComObjetivoEliminado.length === 0) {
    
    return;
  }
  
  // Reatribuir objetivos para cada jogador afetado
  jogadoresComObjetivoEliminado.forEach(nomeJogador => {
    // Verificar se o jogador ainda está ativo
    const jogador = room.jogadores.find(j => j.nome === nomeJogador);
    if (!jogador || !jogador.ativo) {
      
      return;
    }
    
    // Gerar novo objetivo (evitando que seja eliminar o jogador que acabou de ser eliminado)
    const playerLanguage = room.jogadores.find(j => j.nome === nomeJogador)?.language || defaultLang;
    const novoObjetivo = gerarObjetivoAleatorioEliminacao(nomeJogador, room, jogadorEliminado, playerLanguage);
    
    if (novoObjetivo) {
      // Atualizar o objetivo
      room.objetivos[nomeJogador] = novoObjetivo;
      
      // Notificar o jogador sobre o novo objetivo
      const socketJogador = room.jogadores.find(j => j.nome === nomeJogador)?.socketId;
      if (socketJogador) {
        io.to(socketJogador).emit('mostrarMensagem', `🎯 Seu objetivo foi alterado: ${novoObjetivo.descricao}`);
        io.to(socketJogador).emit('objetivoAtualizado', novoObjetivo);
      }
      
      // Notificar todos os jogadores sobre a mudança
      io.to(room.roomId).emit('mostrarMensagem', `🎯 ${nomeJogador} recebeu um novo objetivo após ${jogadorEliminado} ser eliminado!`);
      
      
    }
  });
}

// 🎯 Função para gerar objetivo aleatório evitando o jogador eliminado
function gerarObjetivoAleatorioEliminacao(jogador, room, jogadorEliminado, lang = defaultLang) {
  // Filtrar tipos de objetivos disponíveis
  const tiposDisponiveis = room.tiposObjetivos.filter(tipo => tipo !== 'eliminarJogador');
  
  // Se não há outros tipos disponíveis, usar eliminarJogador mas com jogador diferente
  if (tiposDisponiveis.length === 0) {
    tiposDisponiveis.push('eliminarJogador');
  }
  
  const tipo = tiposDisponiveis[Math.floor(Math.random() * tiposDisponiveis.length)];
  const translations = gameTranslations[lang] || gameTranslations[defaultLang];
  
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
        descricao: translations.conquerAnyContinents
          .replace('{continent1}', continente1)
          .replace('{continent2}', continente2)
      };
      
    case 'eliminarJogador':
      // Filtrar jogadores disponíveis (excluindo o jogador atual e o eliminado)
      const jogadoresDisponiveis = room.jogadores.filter(j => 
        j.nome !== jogador && 
        j.nome !== jogadorEliminado && 
        j.ativo
      );
      
      if (jogadoresDisponiveis.length === 0) {
        // Se não há outros jogadores para eliminar, usar objetivo de territórios
        return {
          tipo: 'dominar24Territorios',
          descricao: translations.dominate24Territories
        };
      }
      
      const jogadorAlvo = jogadoresDisponiveis[Math.floor(Math.random() * jogadoresDisponiveis.length)];
      return {
        tipo: 'eliminarJogador',
        jogadorAlvo: jogadorAlvo.nome,
        descricao: translations.eliminatePlayer.replace('{player}', jogadorAlvo.nome)
      };
      
    case 'dominar24Territorios':
      return {
        tipo: 'dominar24Territorios',
        descricao: translations.dominate24Territories
      };
      
    case 'dominar16TerritoriosCom2Tropas':
      return {
        tipo: 'dominar16TerritoriosCom2Tropas',
        descricao: translations.dominate16TerritoriesWith2Troops
      };
  }
}

function gerarObjetivoAleatorio(jogador, room, lang = defaultLang) {
  const tipo = room.tiposObjetivos[Math.floor(Math.random() * room.tiposObjetivos.length)];
  const translations = gameTranslations[lang] || gameTranslations[defaultLang];
  
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
        descricao: translations.conquerAnyContinents
          .replace('{continent1}', continente1)
          .replace('{continent2}', continente2)
      };
      
    case 'eliminarJogador':
      const jogadoresDisponiveis = room.jogadores.filter(j => j.nome !== jogador);
      const jogadorAlvo = jogadoresDisponiveis[Math.floor(Math.random() * jogadoresDisponiveis.length)];
      return {
        tipo: 'eliminarJogador',
        jogadorAlvo: jogadorAlvo.nome,
        descricao: translations.eliminatePlayer.replace('{player}', jogadorAlvo.nome)
      };
      
    case 'dominar24Territorios':
      return {
        tipo: 'dominar24Territorios',
        descricao: translations.dominate24Territories
      };
      
    case 'dominar16TerritoriosCom2Tropas':
      return {
        tipo: 'dominar16TerritoriosCom2Tropas',
        descricao: translations.dominate16TerritoriesWith2Troops
      };
  }
}

function verificarObjetivo(jogador, room) {
  const objetivo = room.objetivos[jogador];
  if (!objetivo) {
    
    return false;
  }
  
  
  
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
      
      
      
      
      
      
      return temContinente1 && temContinente2 && temTerceiroContinente;
      
    case 'eliminarJogador':
      const jogadorAlvo = room.jogadores.find(j => j.nome === objetivo.jogadorAlvo);
      const eliminado = !jogadorAlvo || !jogadorAlvo.ativo;
      
      return eliminado;
      
    case 'dominar24Territorios':
      const territoriosDominados = room.paises.filter(p => p.dono === jogador).length;
      
      return territoriosDominados >= 24;
      
    case 'dominar16TerritoriosCom2Tropas':
      const territoriosCom2Tropas = room.paises.filter(p => p.dono === jogador && p.tropas >= 2).length;
      
      return territoriosCom2Tropas >= 16;
  }
  
  
  return false;
}

function checarVitoria(room) {
  
  
  // Verificar vitória por eliminação
  const ativos = room.jogadores.filter(j => j.ativo);
  if (ativos.length === 1) {
    
    room.vitoria = true;
    room.jogadorVencedor = ativos[0].nome;
    
    // Preparar dados completos do resumo do jogo
    const resumoJogo = gerarResumoJogo(room, ativos[0].nome, 'eliminacao');
    io.to(room.roomId).emit('vitoria', ativos[0].nome, resumoJogo);
    return;
  }
  
  // Verificar vitória por objetivo
  for (const jogador of room.jogadores) {
    if (jogador.ativo) {
      
      const objetivo = room.objetivos[jogador.nome];
      
      
      if (verificarObjetivo(jogador.nome, room)) {
        
        room.vitoria = true;
        room.jogadorVencedor = jogador.nome;
        
        // Preparar dados completos do resumo do jogo
        const resumoJogo = gerarResumoJogo(room, jogador.nome, 'objetivo');
        io.to(room.roomId).emit('vitoria', jogador.nome, resumoJogo);
        return;
      }
    }
  }
  
  
}

// Função para gerar resumo completo do jogo
function gerarResumoJogo(room, jogadorVencedor, tipoVitoria) {
  
  
  // Calcular estatísticas de cada jogador
  const estatisticasJogadores = {};
  room.jogadores.forEach(jogador => {
    const territorios = room.paises.filter(p => p.dono === jogador.nome);
    const totalTropas = territorios.reduce((sum, p) => sum + p.tropas, 0);
    const continentesControlados = Object.values(room.continentes).filter(continente => {
      return continente.territorios.every(territorio => {
        const pais = room.paises.find(p => p.nome === territorio);
        return pais && pais.dono === jogador.nome;
      });
    });
    
    estatisticasJogadores[jogador.nome] = {
      ativo: jogador.ativo,
      territorios: territorios.length,
      totalTropas: totalTropas,
      continentesControlados: continentesControlados.map(c => c.nome),
      objetivo: room.objetivos[jogador.nome] || null,
      cartasTerritorio: (room.cartasTerritorio[jogador.nome] || []).length
    };
  });
  
  // Calcular estatísticas gerais do jogo
  const totalTerritorios = room.paises.length;
  const totalTropasJogo = room.paises.reduce((sum, p) => sum + p.tropas, 0);
  const jogadoresAtivos = room.jogadores.filter(j => j.ativo).length;
  const jogadoresEliminados = room.jogadores.filter(j => !j.ativo).length;
  
  // Determinar tipo de vitória
  let descricaoVitoria = '';
  if (tipoVitoria === 'eliminacao') {
    descricaoVitoria = `${jogadorVencedor} eliminou todos os outros jogadores!`;
  } else if (tipoVitoria === 'objetivo') {
    const objetivo = room.objetivos[jogadorVencedor];
    descricaoVitoria = `${jogadorVencedor} completou seu objetivo: ${objetivo.descricao}`;
  }
  
  return {
    jogadorVencedor: jogadorVencedor,
    tipoVitoria: tipoVitoria,
    descricaoVitoria: descricaoVitoria,
    estatisticasJogadores: estatisticasJogadores,
    estatisticasGerais: {
      totalTerritorios: totalTerritorios,
      totalTropasJogo: totalTropasJogo,
      jogadoresAtivos: jogadoresAtivos,
      jogadoresEliminados: jogadoresEliminados,
      numeroTrocasRealizadas: room.numeroTrocasRealizadas
    },
    objetivos: room.objetivos,
    continentes: room.continentes
  };
}

// Inicializar o jogo
function inicializarJogo(room) {
  
  
  
  // Distribuir territórios aleatoriamente
  
  const territoriosDisponiveis = [...room.paises];
  let indiceJogador = 0;
  
  while (territoriosDisponiveis.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * territoriosDisponiveis.length);
    const territorio = territoriosDisponiveis.splice(indiceAleatorio, 1)[0];
    territorio.dono = room.jogadores[indiceJogador].nome;
    territorio.tropas = 1;
    indiceJogador = (indiceJogador + 1) % room.jogadores.length;
  }
  

  // Colocar tropas extras
  
  room.paises.forEach(pais => {
    pais.tropas += 0; // Changed from 2 to 0 to start with 1 troop
  });
  

  // Gerar objetivos para cada jogador
  
  room.jogadores.forEach(jogador => {
    const playerLanguage = jogador.language || defaultLang;
    room.objetivos[jogador.nome] = gerarObjetivoAleatorio(jogador.nome, room, playerLanguage);
    
  });

  room.indiceTurno = 0;
  room.turno = room.jogadores[room.indiceTurno].nome;
  room.vitoria = false;
  room.derrota = false;
  room.jogadorVencedor = null;
  
  
  // Limpar cartas território e territórios conquistados
  room.cartasTerritorio = {};
  room.territoriosConquistadosNoTurno = {};
  room.numeroTrocasRealizadas = 0; // Resetar contador de trocas
  room.tropasMovidas = {}; // Resetar rastreamento de tropas movidas
  room.inicializarMonteCartas(); // Inicializar monte de cartas
  
  // 🎴 Resetar sistema de rastreamento de conquistas
  room.ultimoConquistador = {};
  
  
  
  
  
  const resultadoReforco = calcularReforco(room.turno, room);
  room.tropasReforco = resultadoReforco.base;
  room.tropasBonusContinente = resultadoReforco.bonus;
  

  
  io.to(room.roomId).emit('mostrarMensagem', `🎮 Jogo iniciado! Turno de ${room.turno}. Reforços: ${room.tropasReforco} base + ${Object.values(room.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
  
  
  const estadoGlobal = getEstado(null, room);
  io.to(room.roomId).emit('estadoAtualizado', estadoGlobal);
  
  
}

// ===== SISTEMA DE CPU =====

// Função para ativar CPUs para jogadores sem conexão
function ativarCPUs(room) {
  let cpusAtivadas = 0;
  const jogadoresSemConexao = room.jogadores.filter(jogador => !jogador.socketId && !jogador.isCPU);
  
  
  
  // Só ativar CPUs se houver jogadores sem conexão
  if (jogadoresSemConexao.length > 0) {
    jogadoresSemConexao.forEach(jogador => {
      jogador.isCPU = true;
      cpusAtivadas++;
      
      io.to(room.roomId).emit('adicionarAoHistorico', `🤖 CPU ativada para ${jogador.nome}`);
    });
    
    if (cpusAtivadas > 0) {
      io.to(room.roomId).emit('mostrarMensagem', `🤖 ${cpusAtivadas} CPU(s) ativada(s) para completar a partida!`);
    }
  } else {
    
  }
  
  
  return cpusAtivadas;
}

// Função para executar turno da CPU
function executarTurnoCPU(jogadorCPU, room) {
  
  
  // Verificar se a CPU deve trocar cartas (inteligente)
  const cartasCPU = room.cartasTerritorio[jogadorCPU.nome] || [];
  
  
  const deveTrocar = analisarSeCPUDeveriaTrocarCartas(jogadorCPU, cartasCPU);
  
  
  if (deveTrocar) {
    
    
    // CPU troca cartas de forma inteligente
    const cartasParaTrocar = selecionarCartasInteligentesParaTroca(cartasCPU);
    
    
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
            
            
            // Emitir efeito visual de reforço para o território
            io.to(room.roomId).emit('mostrarEfeitoReforco', {
              territorio: territorioNome,
              jogador: jogadorCPU.nome,
              tipo: 'carta',
              quantidade: 2
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
              jogador: jogadorCPU.nome,
              tipo: 'reforco',
              quantidade: 1
            });
            
            
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
  
  io.to(room.roomId).emit('adicionarAoHistorico', `🧠 CPU ${jogadorCPU.nome} iniciando turno`);
  
  // 1. ESTRATÉGIA DE REFORÇOS INTELIGENTE
  const resultadoReforco = calcularReforco(jogadorCPU.nome, room);
  const tropasReforcoCPU = resultadoReforco.base;
  const tropasBonusCPU = resultadoReforco.bonus;
  
  // Analisar objetivo da CPU
  const objetivo = room.objetivos[jogadorCPU.nome];
  
  
    // Iniciar sequência de reforços
  executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, 0, room);
}

// Função para executar reforços sequencialmente - ESTRATÉGIA DE CAMPEÃO MUNDIAL
function executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, index, room) {
  if (room.vitoria || room.derrota) return;

  // Função utilitária: calcula se território é fronteira (tem pelo menos 1 inimigo vizinho)
  function ehFronteira(p) {
    const pais = room.paises.find(x => x.nome === p.nome);
    return pais.vizinhos.some(v => {
      const pv = room.paises.find(x => x.nome === v);
      return pv && pv.dono !== jogadorCPU.nome;
    });
  }

  // Pontuar território para receber reforço
  function pontuarParaReforco(p) {
    const pais = room.paises.find(x => x.nome === p.nome);
    let score = 0;
    const inimigos = pais.vizinhos.filter(v => {
      const pv = room.paises.find(x => x.nome === v);
      return pv && pv.dono !== jogadorCPU.nome;
    });
    const fracos = inimigos.filter(v => (room.paises.find(x => x.nome === v)?.tropas || 0) <= 2);
    score += inimigos.length * 80; // fronteiras valem mais
    score += fracos.length * 40;   // alvos fracos por perto
    if (pais.tropas <= 1) score += 100; else if (pais.tropas === 2) score += 60;

    // Objetivo: priorizar continentes-alvo
    if (objetivo?.tipo === 'conquistar3Continentes') {
      const cont = Object.keys(room.continentes).find(c => room.continentes[c].territorios.includes(p.nome));
      if (cont === objetivo.continente1 || cont === objetivo.continente2) score += 150;
    }
    if (objetivo?.tipo === 'eliminarJogador') {
      const alvo = objetivo.jogadorAlvo;
      // mais inimigos do alvo ao redor → maior prioridade
      const alvoVizinhos = inimigos.filter(v => room.paises.find(x => x.nome === v)?.dono === alvo).length;
      score += alvoVizinhos * 120;
    }
    return score;
  }

  const meus = room.paises.filter(p => p.dono === jogadorCPU.nome);
  const fronteiras = meus.filter(ehFronteira);

  // Distribuir bônus de continente primeiro, dentro do próprio continente
  const reforcosBonus = {};
  for (const [continenteNome, qtd] of Object.entries(tropasBonusCPU || {})) {
    for (let i = 0; i < qtd; i++) {
      const candidatos = fronteiras.filter(t => room.continentes[continenteNome]?.territorios.includes(t.nome));
      const alvo = (candidatos.length > 0 ? candidatos : fronteiras).sort((a,b) => pontuarParaReforco(b)-pontuarParaReforco(a))[0] || meus[0];
      if (!alvo) continue;
      const pais = room.paises.find(p => p.nome === alvo.nome);
      pais.tropas += 1;
      
      // Acumular reforços por território para mostrar efeito único
      if (!reforcosBonus[alvo.nome]) reforcosBonus[alvo.nome] = 0;
      reforcosBonus[alvo.nome]++;
    }
  }

  // Distribuir reforço base, 1 a 1, entre as melhores fronteiras
  const reforcosBase = {};
  for (let i = 0; i < tropasReforcoCPU; i++) {
    const alvo = (fronteiras.length > 0 ? fronteiras : meus).sort((a,b) => pontuarParaReforco(b)-pontuarParaReforco(a))[0];
    if (!alvo) break;
    const pais = room.paises.find(p => p.nome === alvo.nome);
    pais.tropas += 1;
    
    // Acumular reforços por território para mostrar efeito único
    if (!reforcosBase[alvo.nome]) reforcosBase[alvo.nome] = 0;
    reforcosBase[alvo.nome]++;
  }

  // Enviar efeitos visuais únicos para cada território
  for (const [territorio, quantidade] of Object.entries(reforcosBonus)) {
    io.to(room.roomId).emit('mostrarEfeitoReforco', { 
      territorio: territorio, 
      jogador: jogadorCPU.nome, 
      tipo: 'reforco_bonus',
      quantidade: quantidade 
    });
  }
  
  for (const [territorio, quantidade] of Object.entries(reforcosBase)) {
    io.to(room.roomId).emit('mostrarEfeitoReforco', { 
      territorio: territorio, 
      jogador: jogadorCPU.nome, 
      tipo: 'reforco',
      quantidade: quantidade 
    });
  }

  // Emitir som de movimento para os reforços da CPU
  if (Object.keys(reforcosBonus).length > 0 || Object.keys(reforcosBase).length > 0) {
    io.to(room.roomId).emit('tocarSomMovimento');
  }

  enviarEstadoParaTodos(room);

  // Após reforçar de forma distribuída, seguir para ataques
  setTimeout(() => {
    if (room.vitoria || room.derrota) return;
    executarAtaquesSequenciais(jogadorCPU, objetivo, room);
  }, 800);
}

// Função para executar remanejamento inteligente da CPU - ESTRATÉGIA AVANÇADA
function executarRemanejamentoCPU(jogadorCPU, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  
  io.to(room.roomId).emit('adicionarAoHistorico', `🧠 CPU ${jogadorCPU.nome} executando remanejamento estratégico avançado...`);
  
  const territoriosDoJogador = room.paises.filter(p => p.dono === jogadorCPU.nome);
  const movimentos = [];
  
  // ANÁLISE ESTRATÉGICA COMPLETA DO MAPA
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
    
    // Calcular pontuação estratégica do território
    const pontuacaoTerritorio = calcularPontuacaoEstrategicaTerritorio(pais, jogadorCPU, objetivo, room);
    
    // 1. DEFESA CRÍTICA - Territórios extremamente vulneráveis (PRIORIDADE MÁXIMA)
    if (vizinhosInimigos.length >= 4 && pais.tropas <= 1) {
      
      vizinhosProprios.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        if (paisVizinho.tropas >= 3) {
          const tropasParaMover = Math.min(paisVizinho.tropas - 1, 3);
          if (tropasParaMover > 0) {
            movimentos.push({
              origem: paisVizinho,
              destino: pais,
              quantidade: tropasParaMover,
              prioridade: 2000 + vizinhosInimigos.length * 200 + (2 - pais.tropas) * 100,
              tipo: 'defesa_critica',
              razao: `Defesa crítica: ${vizinhosInimigos.length} inimigos vs ${pais.tropas} tropa`
            });
          }
        }
      });
    }
    
    // 2. CONCENTRAÇÃO ESTRATÉGICA - Territórios com alta pontuação estratégica
    if (pontuacaoTerritorio > 150 && vizinhosInimigos.length > 0) {
      
      vizinhosProprios.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        const pontuacaoVizinho = calcularPontuacaoEstrategicaTerritorio(paisVizinho, jogadorCPU, objetivo, room);
        
        // Mover tropas de territórios menos estratégicos para mais estratégicos
        if (pontuacaoVizinho < pontuacaoTerritorio * 0.7 && paisVizinho.tropas > 2) {
          const tropasParaMover = Math.min(paisVizinho.tropas - 1, 2);
          if (tropasParaMover > 0) {
            movimentos.push({
              origem: paisVizinho,
              destino: pais,
              quantidade: tropasParaMover,
              prioridade: 1500 + pontuacaoTerritorio * 10,
              tipo: 'concentracao_estrategica',
              razao: `Concentração estratégica: ${pontuacaoTerritorio} vs ${pontuacaoVizinho}`
            });
          }
        }
      });
    }
    
    // 3. PREPARAÇÃO PARA ATAQUE - Territórios com alvos fracos próximos
    if (vizinhosInimigos.length > 0) {
      const alvosFracos = vizinhosInimigos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho.tropas <= 2;
      });
      
      const alvosMedios = vizinhosInimigos.filter(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        return paisVizinho.tropas <= 4;
      });
      
      if ((alvosFracos.length > 0 || alvosMedios.length >= 2) && pais.tropas <= 4) {
        vizinhosProprios.forEach(vizinho => {
          const paisVizinho = room.paises.find(p => p.nome === vizinho);
          const vizinhosInimigosVizinho = paisVizinho.vizinhos.filter(v => {
            const paisV = room.paises.find(p => p.nome === v);
            return paisV && paisV.dono !== jogadorCPU.nome;
          });
          
          // Se o vizinho tem menos oportunidades de ataque, pode doar tropas
          if (vizinhosInimigosVizinho.length < vizinhosInimigos.length && paisVizinho.tropas > 3) {
            const tropasParaMover = Math.min(paisVizinho.tropas - 2, 2);
            if (tropasParaMover > 0) {
              const prioridade = 1200 + alvosFracos.length * 100 + alvosMedios.length * 50;
              movimentos.push({
                origem: paisVizinho,
                destino: pais,
                quantidade: tropasParaMover,
                prioridade: prioridade,
                tipo: 'preparacao_ataque',
                razao: `Preparação ataque: ${alvosFracos.length} alvos fracos, ${alvosMedios.length} alvos médios`
              });
            }
          }
        });
      }
    }
    
    // 4. DEFESA ESTRATÉGICA - Territórios com muitos inimigos mas não críticos
    if (vizinhosInimigos.length >= 3 && pais.tropas <= 2) {
      vizinhosProprios.forEach(vizinho => {
        const paisVizinho = room.paises.find(p => p.nome === vizinho);
        const vizinhosInimigosVizinho = paisVizinho.vizinhos.filter(v => {
          const paisV = room.paises.find(p => p.nome === v);
          return paisV && paisV.dono !== jogadorCPU.nome;
        });
        
        // Se o vizinho tem menos inimigos e mais tropas, pode doar
        if (vizinhosInimigosVizinho.length < vizinhosInimigos.length && paisVizinho.tropas > 3) {
          const tropasParaMover = Math.min(paisVizinho.tropas - 2, 2);
          if (tropasParaMover > 0) {
            movimentos.push({
              origem: paisVizinho,
              destino: pais,
              quantidade: tropasParaMover,
              prioridade: 800 + vizinhosInimigos.length * 80,
              tipo: 'defesa_estrategica',
              razao: `Defesa estratégica: ${vizinhosInimigos.length} inimigos vs ${vizinhosInimigosVizinho.length}`
            });
          }
        }
      });
    }
    
    // 5. CONSOLIDAÇÃO DE CONTINENTES - Se tem objetivo de conquista
    if (objetivo?.tipo === 'conquistar3Continentes') {
      const continente = Object.keys(room.continentes).find(cont => 
        room.continentes[cont].territorios.includes(territorio.nome)
      );
      
      if (continente === objetivo.continente1 || continente === objetivo.continente2) {
        const territoriosDoContinente = room.continentes[continente].territorios;
        const territoriosConquistados = territoriosDoContinente.filter(territorioNome => {
          const paisContinente = room.paises.find(p => p.nome === territorioNome);
          return paisContinente && paisContinente.dono === jogadorCPU.nome;
        });
        
        // Se controla a maioria do continente, consolidar posição
        if (territoriosConquistados.length >= territoriosDoContinente.length * 0.7) {
          vizinhosProprios.forEach(vizinho => {
            const paisVizinho = room.paises.find(p => p.nome === vizinho);
            const continenteVizinho = Object.keys(room.continentes).find(cont => 
              room.continentes[cont].territorios.includes(vizinho)
            );
            
            // Mover tropas de territórios fora do continente objetivo
            if (continenteVizinho !== continente && paisVizinho.tropas > 2) {
              const tropasParaMover = Math.min(paisVizinho.tropas - 1, 2);
              if (tropasParaMover > 0) {
                movimentos.push({
                  origem: paisVizinho,
                  destino: pais,
                  quantidade: tropasParaMover,
                  prioridade: 1000 + territoriosConquistados.length * 50,
                  tipo: 'consolidacao_continente',
                  razao: `Consolidação ${continente}: ${territoriosConquistados.length}/${territoriosDoContinente.length}`
                });
              }
            }
          });
        }
      }
    }
    
    // 6. ELIMINAÇÃO DE JOGADOR - Se tem objetivo de eliminar jogador específico
    if (objetivo?.tipo === 'eliminarJogador') {
      const jogadorAlvo = objetivo.jogadorAlvo;
      const territoriosDoAlvo = room.paises.filter(p => p.dono === jogadorAlvo);
      
      if (territoriosDoAlvo.length > 0) {
        // Encontrar território mais próximo do alvo
        const distanciaAoAlvo = Math.min(...territoriosDoAlvo.map(territorioAlvo => {
          return calcularDistanciaTerritorios(territorio.nome, territorioAlvo.nome, room);
        }));
        
        if (distanciaAoAlvo <= 2 && vizinhosInimigos.length > 0) {
          vizinhosProprios.forEach(vizinho => {
            const paisVizinho = room.paises.find(p => p.nome === vizinho);
            if (paisVizinho.tropas > 2) {
              const tropasParaMover = Math.min(paisVizinho.tropas - 1, 2);
              if (tropasParaMover > 0) {
                movimentos.push({
                  origem: paisVizinho,
                  destino: pais,
                  quantidade: tropasParaMover,
                  prioridade: 1400 + (3 - distanciaAoAlvo) * 100,
                  tipo: 'eliminacao_jogador',
                  razao: `Eliminação ${jogadorAlvo}: distância ${distanciaAoAlvo}`
                });
              }
            }
          });
        }
      }
    }
  });
  
  // Ordenar movimentos por prioridade
  movimentos.sort((a, b) => b.prioridade - a.prioridade);
  
  // Permitir mais movimentos para redistribuir melhor as linhas de frente
  const movimentosLimitados = movimentos.slice(0, 6);
  
  
  movimentosLimitados.forEach((mov, index) => {
    
  });
  
  // Executar movimentos sequencialmente
  executarMovimentoRemanejamento(jogadorCPU, movimentosLimitados, 0, objetivo, room);
}

// Função para calcular pontuação estratégica de um território
function calcularPontuacaoEstrategicaTerritorio(pais, jogadorCPU, objetivo, room) {
  let pontuacao = 0;
  
  const vizinhosInimigos = pais.vizinhos.filter(vizinho => {
    const paisVizinho = room.paises.find(p => p.nome === vizinho);
    return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
  });
  
  const vizinhosProprios = pais.vizinhos.filter(vizinho => {
    const paisVizinho = room.paises.find(p => p.nome === vizinho);
    return paisVizinho && paisVizinho.dono === jogadorCPU.nome;
  });
  
  // 1. FRONTEIRAS COM INIMIGOS (muito importante)
  pontuacao += vizinhosInimigos.length * 100;
  
  // 2. VULNERABILIDADE ATUAL
  if (pais.tropas <= 1) pontuacao += 200;
  else if (pais.tropas <= 2) pontuacao += 150;
  else if (pais.tropas <= 3) pontuacao += 100;
  
  // 3. OBJETIVO ESTRATÉGICO
  if (objetivo?.tipo === 'conquistar3Continentes') {
    const continente = Object.keys(room.continentes).find(cont => 
      room.continentes[cont].territorios.includes(pais.nome)
    );
    if (continente === objetivo.continente1 || continente === objetivo.continente2) {
      pontuacao += 300; // Prioridade absoluta
    }
  }
  
  // 4. ELIMINAÇÃO DE JOGADOR
  if (objetivo?.tipo === 'eliminarJogador') {
    const jogadorAlvo = objetivo.jogadorAlvo;
    const territoriosDoAlvo = room.paises.filter(p => p.dono === jogadorAlvo);
    if (territoriosDoAlvo.length > 0) {
      const distanciaAoAlvo = Math.min(...territoriosDoAlvo.map(territorioAlvo => {
        return calcularDistanciaTerritorios(pais.nome, territorioAlvo.nome, room);
      }));
      pontuacao += (4 - distanciaAoAlvo) * 150; // Mais próximo = mais pontos
    }
  }
  
  // 5. OPORTUNIDADES DE ATAQUE
  vizinhosInimigos.forEach(vizinho => {
    const paisVizinho = room.paises.find(p => p.nome === vizinho);
    if (paisVizinho.tropas <= 1) pontuacao += 80;
    else if (paisVizinho.tropas <= 2) pontuacao += 60;
    else if (paisVizinho.tropas <= 3) pontuacao += 40;
  });
  
  // 6. POSIÇÃO CENTRAL (muitos vizinhos próprios para defesa)
  pontuacao += vizinhosProprios.length * 30;
  
  // 7. EXPANSÃO ESTRATÉGICA (mais vizinhos inimigos = mais oportunidades)
  pontuacao += vizinhosInimigos.length * 50;
  
  return pontuacao;
}

// Função para calcular distância entre territórios
function calcularDistanciaTerritorios(territorio1, territorio2, room) {
  const pais1 = room.paises.find(p => p.nome === territorio1);
  const pais2 = room.paises.find(p => p.nome === territorio2);
  
  if (!pais1 || !pais2) return 999;
  
  // Se são vizinhos diretos
  if (pais1.vizinhos.includes(territorio2)) return 1;
  
  // Busca em largura para encontrar caminho mais curto
  const visitados = new Set();
  const fila = [{ territorio: territorio1, distancia: 0 }];
  
  while (fila.length > 0) {
    const atual = fila.shift();
    
    if (atual.territorio === territorio2) {
      return atual.distancia;
    }
    
    if (visitados.has(atual.territorio)) continue;
    visitados.add(atual.territorio);
    
    const paisAtual = room.paises.find(p => p.nome === atual.territorio);
    if (!paisAtual) continue;
    
    paisAtual.vizinhos.forEach(vizinho => {
      if (!visitados.has(vizinho)) {
        fila.push({ territorio: vizinho, distancia: atual.distancia + 1 });
      }
    });
  }
  
  return 999; // Não encontrou caminho
}

// Função para executar movimentos de remanejamento
function executarMovimentoRemanejamento(jogadorCPU, movimentos, index, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  if (index >= movimentos.length) {
    // Finalizar turno da CPU após remanejamento
    
    
    io.to(room.roomId).emit('adicionarAoHistorico', `🧠 CPU ${jogadorCPU.nome} finalizando turno após remanejamento estratégico`);
    
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
    
    // Criar mensagem detalhada baseada no tipo de movimento
    let mensagemDetalhada = '';
    switch (movimento.tipo) {
      case 'defesa_critica':
        mensagemDetalhada = `🛡️ ${jogadorCPU.nome} reforçou defesa crítica em ${movimento.destino.nome}`;
        break;
      case 'concentracao_estrategica':
        mensagemDetalhada = `🎯 ${jogadorCPU.nome} concentrou tropas estrategicamente em ${movimento.destino.nome}`;
        break;
      case 'preparacao_ataque':
        mensagemDetalhada = `⚔️ ${jogadorCPU.nome} preparou ataque a partir de ${movimento.destino.nome}`;
        break;
      case 'defesa_estrategica':
        mensagemDetalhada = `🛡️ ${jogadorCPU.nome} reforçou defesa estratégica em ${movimento.destino.nome}`;
        break;
      case 'consolidacao_continente':
        mensagemDetalhada = `🌍 ${jogadorCPU.nome} consolidou posição no continente via ${movimento.destino.nome}`;
        break;
      case 'eliminacao_jogador':
        mensagemDetalhada = `🎯 ${jogadorCPU.nome} posicionou tropas para eliminar jogador via ${movimento.destino.nome}`;
        break;
      default:
        mensagemDetalhada = `🔄 ${jogadorCPU.nome} moveu ${movimento.quantidade} tropas de ${movimento.origem.nome} para ${movimento.destino.nome}`;
    }
    
    
    io.to(room.roomId).emit('adicionarAoHistorico', mensagemDetalhada);
    io.to(room.roomId).emit('tocarSomMovimento');
    
    // Atualizar estado para todos os jogadores
    enviarEstadoParaTodos(room);
  }
  
  // Processar próximo movimento após delay
  setTimeout(() => {
    executarMovimentoRemanejamento(jogadorCPU, movimentos, index + 1, objetivo, room);
  }, 800); // Delay maior para movimentos estratégicos
}

// Função para executar ataques sequencialmente - ESTRATÉGIA DE CAMPEÃO MUNDIAL
function executarAtaquesSequenciais(jogadorCPU, objetivo, room) {
  if (room.vitoria || room.derrota) return;
  
  
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
  
  
  if (ataques.length > 0) {
    
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
    
    io.to(room.roomId).emit('adicionarAoHistorico', `⚔️ CPU ${jogadorCPU.nome} atacando ${oportunidade.destino.nome} (vantagem: +${oportunidade.vantagemNumerica})`);
    
    // Verificar se ainda tem tropas suficientes para atacar
    if (oportunidade.origem.tropas <= 1) {
      
      io.to(room.roomId).emit('adicionarAoHistorico', `❌ CPU ${jogadorCPU.nome} não pode atacar ${oportunidade.destino.nome} (tropas insuficientes)`);
      
      // Processar próximo ataque
      setTimeout(() => {
        executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index + 1, objetivo, room);
      }, 400); // Reduzido de 1200ms para 400ms para casos de tropas insuficientes
      return;
    }
    
    // Usar a mesma lógica de dados dos jogadores humanos
    const dadosAtaque = Math.min(oportunidade.origem.tropas - 1, 3);
    const dadosDefesa = Math.min(oportunidade.destino.tropas, 3);

    const rolagemAtaque = Array.from({ length: dadosAtaque }, rolarDado).sort((a, b) => b - a);
    const rolagemDefesa = Array.from({ length: dadosDefesa }, rolarDado).sort((a, b) => b - a);

    let resultadoMensagem = `${oportunidade.origem.nome} ataca ${oportunidade.destino.nome}
    Ataque: [${rolagemAtaque.join(', ')}] | Defesa: [${rolagemDefesa.join(', ')}]\n`;

    const comparacoes = Math.min(rolagemAtaque.length, rolagemDefesa.length);
    for (let i = 0; i < comparacoes; i++) {
        if (rolagemAtaque[i] > rolagemDefesa[i]) {
        oportunidade.destino.tropas--;
        resultadoMensagem += `Defesa perdeu 1 tropa.\n`;
        // Emitir efeito de explosão para tropas perdidas na defesa
        io.to(room.roomId).emit('mostrarEfeitoExplosaoTropas', {
          territorio: oportunidade.destino.nome
        });
        } else {
        oportunidade.origem.tropas--;
        resultadoMensagem += `Ataque perdeu 1 tropa.\n`;
        // Emitir efeito de explosão para tropas perdidas no ataque
        io.to(room.roomId).emit('mostrarEfeitoExplosaoTropas', {
          territorio: oportunidade.origem.nome
        });
        }
    }

    if (oportunidade.destino.tropas <= 0) {
        // Ataque bem-sucedido - conquista o território
        oportunidade.destino.dono = jogadorCPU.nome;
        // Transferir uma quantidade razoável respeitando a regra (origem deve ficar com pelo menos 1)
        const maxTransferivel = Math.max(1, oportunidade.origem.tropas - 1);
        // Preferir mover mais se o novo território tiver inimigos ao redor
        const vizinhosInimigosNovo = oportunidade.destino.vizinhos.filter(v => {
          const pv = room.paises.find(p => p.nome === v);
          return pv && pv.dono !== jogadorCPU.nome;
        }).length;
        let transferir = Math.min(maxTransferivel, vizinhosInimigosNovo >= 2 ? 3 : (vizinhosInimigosNovo === 1 ? 2 : 1));
        // Se ainda há muita tropa na origem, pode mover um pouco mais
        if (oportunidade.origem.tropas - transferir >= 4) transferir = Math.min(maxTransferivel, transferir + 1);
        oportunidade.destino.tropas = transferir;
        oportunidade.origem.tropas -= transferir;
        resultadoMensagem += `${oportunidade.destino.nome} foi conquistado por ${jogadorCPU.nome}!\n`;
        
        // Registrar território conquistado no turno atual
        if (!room.territoriosConquistadosNoTurno[jogadorCPU.nome]) {
          room.territoriosConquistadosNoTurno[jogadorCPU.nome] = [];
        }
        room.territoriosConquistadosNoTurno[jogadorCPU.nome].push(oportunidade.destino.nome);
        
        
        
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
        
        // Emitir evento de território conquistado para verificar conquista de continente
        io.to(room.roomId).emit('territorioConquistado', {
          territorioConquistado: oportunidade.destino.nome,
          territorioAtacante: oportunidade.origem.nome,
          tropasDisponiveis: transferir,
          tropasAdicionais: 0,
          jogadorAtacante: jogadorCPU.nome
        });
        
        // Emitir evento para mostrar explosão de conquista
        io.to(room.roomId).emit('mostrarEfeitoExplosaoConquista', {
          territorio: oportunidade.destino.nome,
          jogador: jogadorCPU.nome
        });
        
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
    
    executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, 0, objetivo, room);
  } else {
    // Finalizar turno se não há mais oportunidades
    
    
    io.to(room.roomId).emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} finalizando turno`);
    
    // Processar cartas da CPU ANTES de passar o turno
    processarCartasJogador(jogadorCPU.nome, room);
    
    passarTurno(room);
  }
}
// Função para analisar se a CPU deveria trocar cartas
function analisarSeCPUDeveriaTrocarCartas(jogadorCPU, cartasCPU) {
  
  
  
  // Forçar troca se tem 5 ou mais cartas
  if (cartasCPU.length >= 5) {
    
    return true;
  }
  
  // Trocar se tem 3 cartas e pode formar uma combinação válida
  if (cartasCPU.length >= 3) {
    const simbolos = cartasCPU.map(carta => carta.simbolo);
    const temCoringa = simbolos.includes('★');
    
    
    
    // Verificar se pode formar combinação válida
    if (temCoringa) {
      // Lógica com coringa
      const coringas = simbolos.filter(simbolo => simbolo === '★');
      const simbolosSemCoringa = simbolos.filter(simbolo => simbolo !== '★');
      const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
      
      
      
      // Pode trocar se:
      // 1. 3 coringas
      // 2. 2 coringas + 1 carta qualquer
      // 3. 1 coringa + 2 cartas iguais
      // 4. 1 coringa + 2 cartas diferentes
      const podeTrocar = coringas.length >= 3 || 
                        (coringas.length === 2 && simbolosSemCoringa.length === 1) ||
                        (coringas.length === 1 && simbolosSemCoringa.length === 2);
      
      
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
      
      
      
      
      const podeTrocar = tem3Iguais || tem3Diferentes;
      
      return podeTrocar;
    }
  }
  
  
  return false;
}

// Função para selecionar cartas inteligentes para troca
function selecionarCartasInteligentesParaTroca(cartasCPU) {
  
  
  
  const simbolos = cartasCPU.map(carta => carta.simbolo);
  const temCoringa = simbolos.includes('★');
  
  
  
  if (temCoringa) {
    // Se tem coringa, tentar formar a melhor combinação
    const simbolosSemCoringa = simbolos.filter(simbolo => simbolo !== '★');
    const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
    
    
    
    if (simbolosSemCoringa.length === 2) {
      // 2 cartas + 1 coringa
      if (simbolosUnicosSemCoringa.length === 1) {
        // Mesmo símbolo + coringa
        const simbolo = simbolosUnicosSemCoringa[0];
        const cartasMesmoSimbolo = cartasCPU.filter(carta => carta.simbolo === simbolo);
        const coringas = cartasCPU.filter(carta => carta.simbolo === '★');
        const selecao = [...cartasMesmoSimbolo.slice(0, 2), coringas[0]].map(carta => carta.territorio);
        
        return selecao;
      } else {
        // Símbolos diferentes + coringa
        const simbolo1 = simbolosSemCoringa[0];
        const simbolo2 = simbolosSemCoringa[1];
        const carta1 = cartasCPU.find(carta => carta.simbolo === simbolo1);
        const carta2 = cartasCPU.find(carta => carta.simbolo === simbolo2);
        const coringa = cartasCPU.find(carta => carta.simbolo === '★');
        const selecao = [carta1, carta2, coringa].map(carta => carta.territorio);
        
        return selecao;
      }
    } else if (simbolosSemCoringa.length === 1) {
      // 1 carta + 2 coringas
      const simbolo = simbolosSemCoringa[0];
      const carta = cartasCPU.find(carta => carta.simbolo === simbolo);
      const coringas = cartasCPU.filter(carta => carta.simbolo === '★').slice(0, 2);
      const selecao = [carta, ...coringas].map(carta => carta.territorio);
      
      return selecao;
    } else {
      // 3 coringas
      const coringas = cartasCPU.filter(carta => carta.simbolo === '★').slice(0, 3);
      const selecao = coringas.map(carta => carta.territorio);
      
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
    
    
    
    if (tem3Iguais) {
      // 3 iguais - encontrar o símbolo que tem 3 ou mais
      const simboloCom3 = Object.keys(contagemSimbolos).find(simbolo => contagemSimbolos[simbolo] >= 3);
      const cartasIguais = cartasCPU.filter(carta => carta.simbolo === simboloCom3).slice(0, 3);
      const selecao = cartasIguais.map(carta => carta.territorio);
      
      return selecao;
    } else if (tem3Diferentes) {
      // 3 diferentes
      const cartasDiferentes = simbolosUnicos.map(simbolo => 
        cartasCPU.find(carta => carta.simbolo === simbolo)
      );
      const selecao = cartasDiferentes.map(carta => carta.territorio);
      
      return selecao;
    }
  }
  
  // Fallback: primeiras 3 cartas
  const fallback = cartasCPU.slice(0, 3).map(carta => carta.territorio);
  
  return fallback;
}

// Função para calcular bônus de troca de cartas
function calcularBonusTrocaCartas(cartasParaTrocar, room) {
  // Simular o cálculo de bônus baseado no tipo de troca
  // Na implementação real, isso seria baseado no número de trocas já realizadas
  room.numeroTrocasRealizadas++;
  const bonus = 2 + (room.numeroTrocasRealizadas * 2); // 4, 6, 8, 10, ...
  
  return bonus;
}

// Função para selecionar território estratégico para reforço
function selecionarTerritorioEstrategicoParaReforco(jogadorCPU, territoriosDoJogador, room) {
  const objetivo = room.objetivos[jogadorCPU.nome];
  
  
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
      
      return territorioPrioritario;
    }
  }
  
  // Reforçar territórios com menos tropas (mais vulneráveis)
  const territorioVulneravel = territoriosDoJogador.reduce((min, atual) => 
    atual.tropas < min.tropas ? atual : min
  );
  
  return territorioVulneravel;
}

// Função para processar cartas de qualquer jogador (CPU ou humano)
function processarCartasJogador(nomeJogador, room) {
  
  
  if (room.territoriosConquistadosNoTurno[nomeJogador] && room.territoriosConquistadosNoTurno[nomeJogador].length > 0) {
    
    
    // Inicializar cartas do jogador se não existir
    if (!room.cartasTerritorio[nomeJogador]) {
      room.cartasTerritorio[nomeJogador] = [];
    }
    
    // Verificar se o jogador já tem 5 cartas (máximo permitido)
    if (room.cartasTerritorio[nomeJogador].length >= 5) {
      io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${nomeJogador} não pode receber mais cartas território (máximo 5)!`);
      
    } else {
      // Pegar uma carta do monte
      const carta = room.pegarCartaDoMonte();
      
      if (carta) {
        room.cartasTerritorio[nomeJogador].push(carta);
        
        
        
        io.to(room.roomId).emit('mostrarMensagem', `🎴 ${nomeJogador} ganhou uma carta território de ${carta.territorio} (${carta.simbolo}) por conquistar territórios neste turno!`);
      } else {
        
        io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${nomeJogador} não pode receber carta território - monte vazio!`);
      }
    }
  } else {
    
  }
  
  // Limpar territórios conquistados do jogador
  
  room.territoriosConquistadosNoTurno[nomeJogador] = [];
}

// Função para verificar se é turno de CPU
function verificarTurnoCPU(room) {
  const jogadorAtual = room.jogadores[room.indiceTurno];
  
  
  if (jogadorAtual.isCPU && jogadorAtual.ativo) {
    
    executarTurnoCPU(jogadorAtual, room);
  } else {
    
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
  
  
  if (cartasJogador.length >= 5) {
    const jogadorAtual = room.jogadores.find(j => j.nome === room.turno);
    
    
    if (jogadorAtual.isCPU) {
      // CPU troca cartas automaticamente
      
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
            
            
            // Emitir efeito visual de reforço para o território
            io.to(room.roomId).emit('mostrarEfeitoReforco', {
              territorio: territorioNome,
              jogador: room.turno,
              tipo: 'carta',
              quantidade: 2
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
              jogador: room.turno,
              tipo: 'reforco',
              quantidade: 1
            });
            
            
          }
        }
        
        // Criar mensagem detalhada sobre a troca obrigatória da CPU
        let mensagemTroca = `🤖 CPU ${room.turno} trocou 3 cartas território obrigatoriamente e recebeu ${bonusTroca} tropas extras!`;
        
        if (territoriosReforcados.length > 0) {
          mensagemTroca += `\n🎯 +2 tropas em: ${territoriosReforcados.join(', ')} (territórios possuídos)`;
        }
        
        
        io.to(room.roomId).emit('mostrarMensagem', mensagemTroca);
        io.to(room.roomId).emit('adicionarAoHistorico', `🃏 CPU ${room.turno} trocou 3 cartas território obrigatoriamente (+${bonusTroca} tropas${territoriosReforcados.length > 0 ? `, +2 em ${territoriosReforcados.join(', ')}` : ''})`);
        io.to(room.roomId).emit('tocarSomTakeCard');
        
        // Continuar com o turno
        enviarEstadoParaTodos(room);
      } else {
        
      }
      } else {
    // Jogador humano
    
    
    // Calcular reforços ANTES de forçar a troca para definir o continente prioritário
    const resultadoReforco = calcularReforco(room.turno, room);
    room.tropasReforco = resultadoReforco.base;
    room.tropasBonusContinente = resultadoReforco.bonus;
    
    // Calcular e definir o continente prioritário para as tropas de bônus
    const continentePrioritario = calcularContinentePrioritario(room);
    if (continentePrioritario) {
      
    }
    
    io.to(room.roomId).emit('mostrarMensagem', `⚠️ ${room.turno} tem ${cartasJogador.length} cartas território! É obrigatório trocar cartas antes de continuar.`);
    io.to(room.roomId).emit('forcarTrocaCartas', { jogador: room.turno, cartas: cartasJogador });
    
    // Atualizar estado para mostrar o continente prioritário
    io.sockets.sockets.forEach((s) => {
      if (s.rooms.has(room.roomId)) {
        s.emit('estadoAtualizado', getEstado(s.id, room));
      }
    });
    
    return; // Não avança o turno até trocar as cartas
  }
} else {
  
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
const currentPlayer = room.jogadores.find(j => j.nome === room.turno);
if (!currentPlayer.isCPU) {
  // Start timer for human player
  setTimeout(() => {
    startTurnTimer(room.roomId);
  }, 1000); // Small delay to allow UI updates
} else {
  // Stop any existing timer for CPU turns
  stopTurnTimer(room.roomId);
}

verificarTurnoCPU(room);
}

// Lobby functions
function startLobby(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  
  room.lobbyActive = true;
  room.lobbyTimeLeft = 5; // 5 seconds
  
  // Start lobby timer
  room.lobbyTimer = setInterval(() => {
    room.lobbyTimeLeft--;
    
    // Check if all players are connected
    const connectedPlayers = room.jogadores.filter(j => j.socketId !== null).length;
    const totalPlayers = room.jogadores.length;
    
    if (connectedPlayers === totalPlayers) {
      
      startGame(roomId);
      return;
    }
    
    // Check if timer expired
    if (room.lobbyTimeLeft <= 0) {
      
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
  
  
  const room = gameRooms.get(roomId);
  if (!room) {
    
    return;
  }
  
  
  room.gameStarted = true;
  room.lobbyActive = false;
  
  
  if (room.lobbyTimer) {
    clearInterval(room.lobbyTimer);
    room.lobbyTimer = null;
    
  }
  
  // Initialize the game
  
  inicializarJogo(room);
  
  
  // Notify all clients that game is starting
  
  const primeiroJogador = room.jogadores[0].nome;
  io.to(roomId).emit('mostrarMensagem', `🎮 Jogo iniciado! É a vez do jogador ${primeiroJogador}. Clique em "Encerrar" para começar a jogar.`);
  
  // Send initial state to all clients in the room
  
  let clientesEncontrados = 0;
  io.sockets.sockets.forEach((s) => {
    if (s.rooms.has(roomId)) {
      
      const estado = getEstado(s.id, room);
      s.emit('estadoAtualizado', estado);
      clientesEncontrados++;
    }
  });
  
  
  // Start timer for first player if they're human
  const firstPlayer = room.jogadores.find(j => j.nome === room.turno);
  if (firstPlayer && !firstPlayer.isCPU) {
    setTimeout(() => {
      startTurnTimer(roomId);
    }, 2000); // Longer delay to allow game initialization
  }
  
  // Verificar se é turno de CPU no início do jogo
  
  verificarTurnoCPU(room);
  
}

function startGameWithCPUs(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  
  room.gameStarted = true;
  room.lobbyActive = false;
  
  if (room.lobbyTimer) {
    clearInterval(room.lobbyTimer);
    room.lobbyTimer = null;
  }
  
  // Randomize the order of players (colors) for this game
  
  
  // Create a new array with randomized player order
  const nomesCores = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Preto', 'Roxo'];
  const nomesEmbaralhados = [...nomesCores];
  
  // Fisher-Yates shuffle
  for (let i = nomesEmbaralhados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nomesEmbaralhados[i], nomesEmbaralhados[j]] = [nomesEmbaralhados[j], nomesEmbaralhados[i]];
  }
  
  // Create new player objects with randomized names
  room.jogadores = nomesEmbaralhados.map(nome => ({
    nome: nome,
    nomeReal: null, // Nome de usuário real (será null para CPUs)
    ativo: true,
    socketId: null,
    isCPU: false
  }));
  
  
  
  // Randomize the play order for CPU-only games
  
  const jogadoresEmbaralhados = [...room.jogadores];
  for (let i = jogadoresEmbaralhados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jogadoresEmbaralhados[i], jogadoresEmbaralhados[j]] = [jogadoresEmbaralhados[j], jogadoresEmbaralhados[i]];
  }
  
  // Update room.jogadores with the shuffled order
  room.jogadores = jogadoresEmbaralhados;
  
  
  
  
  // Activate CPUs for unconnected players
  ativarCPUs(room);
  
  // Initialize the game
  inicializarJogo(room);
  
  // Notify all clients that game is starting
  const primeiroJogador = room.jogadores[0].nome;
  io.to(roomId).emit('mostrarMensagem', `🎮 Jogo iniciado com CPUs! É a vez do jogador ${primeiroJogador}. Clique em "Encerrar" para começar a jogar.`);
  
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