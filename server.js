const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const jogadores = [
  { nome: 'Azul', ativo: true, socketId: null },
  { nome: 'Vermelho', ativo: true, socketId: null },
  { nome: 'Verde', ativo: true, socketId: null },
  { nome: 'Amarelo', ativo: true, socketId: null },
  { nome: 'Preto', ativo: true, socketId: null },
  { nome: 'Roxo', ativo: true, socketId: null }
];

let indiceTurno = 0;
let turno = jogadores[indiceTurno].nome;

let vitoria = false;
let derrota = false;

// Definição dos continentes
const continentes = {
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

let paises = [
  { nome: 'Emberlyn', x: 190, y: 170, dono: 'Azul', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
  { nome: 'Ravenspire', x: 260, y: 160, dono: 'Vermelho', tropas: 5, vizinhos: ['Emberlyn','Duskwatch', 'Stormhall','Zul\'Marak'] },
  { nome: 'Stonevale', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: ['Emberlyn', 'Duskwatch',`Barrowfell`] },
  { nome: 'Duskwatch', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Emberlyn', 'Stormhall'] },
  { nome: 'Stormhall', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne','Duskwatch'] },
  { nome: 'Redwyn', x: 190, y: 170, dono: 'Preto', tropas: 5, vizinhos: ['Stormfen', 'Cragstone', 'Omradan'] },
  { nome: 'Stormfen', x: 260, y: 160, dono: 'Roxo', tropas: 5, vizinhos: ['Redwyn', 'Cragstone',`Frosthollow`] },
  { nome: 'Highmoor', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: [`Frosthollow`, 'Cragstone','Westreach'] },
  { nome: 'Cragstone', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Stormfen', 'Highmoor','Hollowspire'] },
  { nome: 'Hollowspire', x: 180, y: 305, dono: 'Preto', tropas: 5, vizinhos: ['Cragstone', 'Westreach'] },
  { nome: 'Westreach', x: 125, y: 295, dono: 'Roxo', tropas: 5, vizinhos: ['Hollowspire', 'Barrowfell','Highmoor'] },
  { nome: 'Barrowfell', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Hollowspire', 'Westreach','Stonevale'] },
  { nome: 'Zul\'Marak', x: 540, y: 380, dono: 'Azul', tropas: 5, vizinhos: ['Emberwaste', 'Ravenspire', 'Duskmere','Thalengarde'] },
  { nome: 'Emberwaste', x: 680, y: 350, dono: 'Vermelho', tropas: 5, vizinhos: ['Zul\'Marak', 'Sunjara', 'Tharkuun','Duskmere','Kaer\'Tai'] },
  { nome: 'Sunjara', x: 800, y: 400, dono: 'Verde', tropas: 5, vizinhos: ['Emberwaste', 'Bareshi', 'Oru\'Kai', 'Kaer\'Tai','Tharkuun'] },
  { nome: 'Tharkuun', x: 650, y: 500, dono: 'Amarelo', tropas: 5, vizinhos: ['Sunjara', 'Emberwaste', 'Bareshi'] },
  { nome: 'Bareshi', x: 720, y: 520, dono: 'Preto', tropas: 5, vizinhos: ['Sunjara', 'Tharkuun', 'Oru\'Kai'] },
  { nome: 'Oru\'Kai', x: 800, y: 510, dono: 'Roxo', tropas: 5, vizinhos: ['Sunjara', 'Bareshi'] },
  { nome: 'Frosthollow', x: 400, y: 130, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Stormfen','Highmoor'] },
  { nome: 'Eldoria', x: 500, y: 180, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthollow', 'Greymoor', 'Ironreach','Frosthelm'] },
  { nome: 'Greymoor', x: 520, y: 230, dono: 'Verde', tropas: 5, vizinhos: ['Eldoria', 'Thalengarde', 'Duskmere','Ironreach'] },
  { nome: 'Thalengarde', x: 530, y: 290, dono: 'Amarelo', tropas: 5, vizinhos: ['Greymoor', 'Duskmere', 'Zul\'Marak'] },
  { nome: 'Duskmere', x: 650, y: 240, dono: 'Preto', tropas: 5, vizinhos: ['Greymoor', 'Thalengarde', 'Ironreach', 'Blackmere', 'Zul\'Marak','Emberwaste','Kaer\'Tai','Shōrenji'] },
  { nome: 'Ironreach', x: 570, y: 180, dono: 'Roxo', tropas: 5, vizinhos: ['Eldoria', 'Blackmere', 'Duskmere', 'Frosthelm','Greymoor'] },
  { nome: 'Frosthelm', x: 630, y: 100, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Ironreach', 'Blackmere'] },
  { nome: 'Blackmere', x: 650, y: 150, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthelm', 'Duskmere','Ironreach','Nihadara','Shōrenji'] },
  { nome: 'Kaer\'Tai', x: 760, y: 290, dono: 'Azul', tropas: 5, vizinhos: ['Shōrenji', 'Duksmere', 'Sunjara','Emberwaste','Qumaran','Darakai'] },
  { nome: 'Shōrenji', x: 800, y: 220, dono: 'Vermelho', tropas: 5, vizinhos: ['Kaer\'Tai', 'Nihadara', 'Xin\'Qari','Qumaran','Duskmere','Blackmere'] },
  { nome: 'Nihadara', x: 780, y: 160, dono: 'Verde', tropas: 5, vizinhos: ['Blackmere', 'Shōrenji', 'Xin\'Qari'] },
  { nome: 'Xin\'Qari', x: 880, y: 150, dono: 'Amarelo', tropas: 5, vizinhos: ['Shōrenji', 'Nihadara', 'Vol\'Zareth', 'Sa\'Torran','Mei\'Zhara'] },
  { nome: 'Vol\'Zareth', x: 980, y: 150, dono: 'Preto', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan','Sa\'Torran'] },
  { nome: 'Omradan', x: 1100, y: 200, dono: 'Roxo', tropas: 5, vizinhos: ['Vol\'Zareth', 'Sa\'Torran', 'Qumaran','Tzun\'Rakai'] },
  { nome: 'Sa\'Torran', x: 970, y: 250, dono: 'Azul', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan', 'Qumaran', 'Mei\'Zhara','Vol\'Zareth'] },
  { nome: 'Qumaran', x: 1000, y: 320, dono: 'Vermelho', tropas: 5, vizinhos: ['Omradan', 'Sa\'Torran', 'Tzun\'Rakai', 'Darakai', 'Shōrenji','Kaer\'Tai','Ish\'Tanor'] },
  { nome: 'Tzun\'Rakai', x: 1120, y: 290, dono: 'Verde', tropas: 5, vizinhos: ['Qumaran', 'Omradan'] },
  { nome: 'Mei\'Zhara', x: 940, y: 280, dono: 'Amarelo', tropas: 5, vizinhos: ['Sa\'Torran', 'Qumaran', 'Xin\'Qari'] },
  { nome: 'Darakai', x: 950, y: 400, dono: 'Preto', tropas: 5, vizinhos: ['Qumaran', 'Kaer\'Tai', 'Ish\'Tanor','Winterholde'] },
  { nome: 'Ish\'Tanor', x: 1000, y: 400, dono: 'Roxo', tropas: 5, vizinhos: ['Tzun\'Rakai', 'Darakai', 'Winterholde','Qumaran'] },
  { nome: 'Winterholde', x: 1030, y: 495, dono: 'Azul', tropas: 5, vizinhos: ['Ish\'Tanor', 'Mistveil','Darakai'] },
  { nome: 'Aetheris', x: 1080, y: 470, dono: 'Vermelho', tropas: 5, vizinhos: ['Ish\'Tanor', 'Dawnwatch', 'Mistveil'] },
  { nome: 'Dawnwatch', x: 1150, y: 485, dono: 'Verde', tropas: 5, vizinhos: ['Aetheris', 'Mistveil'] },
  { nome: 'Mistveil', x: 1100, y: 550, dono: 'Amarelo', tropas: 5, vizinhos: ['Winterholde', 'Aetheris', 'Dawnwatch'] }
];

let tropasReforco = 0;
let tropasBonusContinente = {}; // Track bonus troops by continent

app.use(express.static('public')); // coloque seu index.html e assets na pasta public

io.on('connection', (socket) => {
  console.log('Novo jogador conectado');

   const jogadorDisponivel = jogadores.find(j => j.socketId === null);
  if (jogadorDisponivel) {
    jogadorDisponivel.socketId = socket.id;
    console.log(`Jogador ${jogadorDisponivel.nome} atribuído ao socket ${socket.id}`);
  } else {
    console.log('Não há jogadores disponíveis para atribuir a este socket.');
  }

  // Envia estado inicial para o cliente
  socket.emit('estadoAtualizado', getEstado(socket.id));


  socket.on('colocarReforco', (nomePais) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno || vitoria || derrota) return;

    const pais = paises.find(p => p.nome === nomePais);
    if (!pais || pais.dono !== turno) return;

    // Verificar se há tropas de bônus de continente para colocar
    let podeColocar = false;
    let continenteBonus = null;
    
    // Primeiro, tentar colocar tropas de bônus de continente
    for (const [nomeContinente, quantidade] of Object.entries(tropasBonusContinente)) {
      if (quantidade > 0) {
        const continente = continentes[nomeContinente];
        if (continente.territorios.includes(nomePais)) {
          // Pode colocar tropa de bônus neste país
          tropasBonusContinente[nomeContinente] -= 1;
          continenteBonus = nomeContinente;
          podeColocar = true;
          break;
        }
      }
    }
    
    // Se não conseguiu colocar tropa de bônus, verificar se pode colocar tropa base
    if (!podeColocar) {
      if (tropasReforco > 0) {
        // Ainda há tropas base para colocar
        podeColocar = true;
      } else {
        // Só há tropas de bônus restantes, mas não pode colocar neste país
        io.emit('mostrarMensagem', `❌ Tropas de bônus de continente só podem ser colocadas em países do continente conquistado!`);
        return;
      }
    }

    if (podeColocar) {
      pais.tropas += 1;
      
      // Só decrementar tropasReforco se não foi uma tropa de bônus
      if (!continenteBonus) {
        tropasReforco -= 1;
      }
      
      const mensagem = continenteBonus 
        ? `${turno} colocou 1 tropa de bônus (${continenteBonus}) em ${nomePais}. Reforços restantes: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`
        : `${turno} colocou 1 tropa em ${nomePais}. Reforços restantes: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`;
      
      io.emit('mostrarMensagem', mensagem);

      io.sockets.sockets.forEach((s) => {
        s.emit('estadoAtualizado', getEstado(s.id));
      });
    }
  });

    socket.on('atacar', ({ de, para }) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno || vitoria || derrota) return;
    const atacantePais = paises.find(p => p.nome === de);
    const defensorPais = paises.find(p => p.nome === para);

    if (!atacantePais || !defensorPais) return;
    if (atacantePais.dono !== turno) return;
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
        const tropasParaMover = dadosAtaque;
        defensorPais.tropas = tropasParaMover;
        atacantePais.tropas -= tropasParaMover;
        resultadoMensagem += `${para} foi conquistado por ${turno}!\n`;
        
        // Verificar se conquistou algum continente
        Object.values(continentes).forEach(continente => {
          const territoriosDoContinente = continente.territorios;
          const territoriosConquistados = territoriosDoContinente.filter(territorio => {
            const pais = paises.find(p => p.nome === territorio);
            return pais && pais.dono === turno;
          });
          
          if (territoriosConquistados.length === territoriosDoContinente.length) {
            resultadoMensagem += `🎉 ${turno} conquistou o continente ${continente.nome}! (+${continente.bonus} tropas por rodada)\n`;
          }
        });
        
        checarEliminacao();
    }

    io.emit('mostrarMensagem', resultadoMensagem.trim());
    io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
    });

    });

  socket.on('passarTurno', () => {
        const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno) return;
    if (vitoria || derrota) {
      io.emit('mostrarMensagem', 'O jogo já terminou!');
      return;
    }

    // Verificar se ainda há tropas de bônus não colocadas
    const tropasBonusRestantes = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    if (tropasBonusRestantes > 0) {
      io.emit('mostrarMensagem', `❌ ${turno} ainda tem ${tropasBonusRestantes} tropas de bônus de continente para colocar!`);
      return;
    }

    let encontrouJogadorAtivo = false;
    let tentativas = 0;
    do {
      indiceTurno = (indiceTurno + 1) % jogadores.length;
      tentativas++;
      if (jogadores[indiceTurno].ativo) {
        encontrouJogadorAtivo = true;
      }
      if (tentativas > jogadores.length) {
        encontrouJogadorAtivo = false;
        break;
      }
    } while (!encontrouJogadorAtivo);

    if (!encontrouJogadorAtivo) {
      io.emit('mostrarMensagem', 'Não há jogadores ativos!');
      return;
    }

    turno = jogadores[indiceTurno].nome;
    const resultadoReforco = calcularReforco(turno);
    tropasReforco = resultadoReforco.base;
    tropasBonusContinente = resultadoReforco.bonus;

    io.emit('mostrarMensagem', `🎮 Turno de ${turno}. Reforços: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
    io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
    });

  });

  socket.on('reiniciarJogo', () => {
    jogadores.forEach(j => j.ativo = true);
    indiceTurno = 0;
    turno = jogadores[indiceTurno].nome;
    vitoria = false;
    derrota = false;
    tropasReforco = 0;
    tropasBonusContinente = {}; // Resetar tropas de bônus

    paises = [
      { nome: 'Emberlyn', x: 190, y: 170, dono: 'Azul', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
      { nome: 'Ravenspire', x: 260, y: 160, dono: 'Vermelho', tropas: 5, vizinhos: ['Emberlyn','Duskwatch', 'Stormhall','Zul\'Marak'] },
      { nome: 'Stonevale', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: ['Emberlyn', 'Duskwatch',`Barrowfell`] },
      { nome: 'Duskwatch', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Emberlyn', 'Stormhall'] },
      { nome: 'Stormhall', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne'] },
      { nome: 'Redwyn', x: 190, y: 170, dono: 'Preto', tropas: 5, vizinhos: ['Stormfen', 'Cragstone', 'Omradan'] },
      { nome: 'Stormfen', x: 260, y: 160, dono: 'Roxo', tropas: 5, vizinhos: ['Redwyn', 'Cragstone',`Frosthollow`] },
      { nome: 'Highmoor', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: [`Frosthollow`, 'Cragstone','Westreach'] },
      { nome: 'Cragstone', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Stormfen', 'Highmoor','Hollowspire'] },
      { nome: 'Hollowspire', x: 180, y: 305, dono: 'Preto', tropas: 5, vizinhos: ['Cragstone', 'Westreach'] },
      { nome: 'Westreach', x: 125, y: 295, dono: 'Roxo', tropas: 5, vizinhos: ['Hollowspire', 'Barrowfell','Highmoor'] },
      { nome: 'Barrowfell', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Hollowspire', 'Westreach','Stonevale'] },
      { nome: 'Zul\'Marak', x: 540, y: 380, dono: 'Azul', tropas: 5, vizinhos: ['Emberwaste', 'Ravenspire', 'Duskmere','Thalengarde'] },
      { nome: 'Emberwaste', x: 680, y: 350, dono: 'Vermelho', tropas: 5, vizinhos: ['Zul\'Marak', 'Sunjara', 'Tharkuun','Duskmere','Kaer\'Tai'] },
      { nome: 'Sunjara', x: 800, y: 400, dono: 'Verde', tropas: 5, vizinhos: ['Emberwaste', 'Bareshi', 'Oru\'Kai', 'Kaer\'Tai','Tharkuun'] },
      { nome: 'Tharkuun', x: 650, y: 500, dono: 'Amarelo', tropas: 5, vizinhos: ['Sunjara', 'Emberwaste', 'Bareshi'] },
      { nome: 'Bareshi', x: 720, y: 520, dono: 'Preto', tropas: 5, vizinhos: ['Sunjara', 'Tharkuun', 'Oru\'Kai'] },
      { nome: 'Oru\'Kai', x: 800, y: 510, dono: 'Roxo', tropas: 5, vizinhos: ['Sunjara', 'Bareshi'] },
      { nome: 'Frosthollow', x: 400, y: 130, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Stormfen','Highmoor'] },
      { nome: 'Eldoria', x: 500, y: 180, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthollow', 'Greymoor', 'Ironreach','Frosthelm'] },
      { nome: 'Greymoor', x: 520, y: 230, dono: 'Verde', tropas: 5, vizinhos: ['Eldoria', 'Thalengarde', 'Duskmere','Ironreach'] },
      { nome: 'Thalengarde', x: 530, y: 290, dono: 'Amarelo', tropas: 5, vizinhos: ['Greymoor', 'Duskmere', 'Zul\'Marak'] },
      { nome: 'Duskmere', x: 650, y: 240, dono: 'Preto', tropas: 5, vizinhos: ['Greymoor', 'Thalengarde', 'Ironreach', 'Blackmere', 'Zul\'Marak','Emberwaste','Kaer\'Tai','Shōrenji'] },
      { nome: 'Ironreach', x: 570, y: 180, dono: 'Roxo', tropas: 5, vizinhos: ['Eldoria', 'Blackmere', 'Duskmere', 'Frosthelm','Greymoor'] },
      { nome: 'Frosthelm', x: 630, y: 100, dono: 'Azul', tropas: 5, vizinhos: ['Eldoria', 'Ironreach', 'Blackmere'] },
      { nome: 'Blackmere', x: 650, y: 150, dono: 'Vermelho', tropas: 5, vizinhos: ['Frosthelm', 'Duskmere','Ironreach','Nihadara','Shōrenji'] },
      { nome: 'Kaer\'Tai', x: 760, y: 290, dono: 'Azul', tropas: 5, vizinhos: ['Shōrenji', 'Duksmere', 'Sunjara','Emberwaste','Qumaran','Darakai'] },
      { nome: 'Shōrenji', x: 800, y: 220, dono: 'Vermelho', tropas: 5, vizinhos: ['Kaer\'Tai', 'Nihadara', 'Xin\'Qari','Qumaran','Duskmere','Blackmere'] },
      { nome: 'Nihadara', x: 780, y: 160, dono: 'Verde', tropas: 5, vizinhos: ['Blackmere', 'Shōrenji', 'Xin\'Qari'] },
      { nome: 'Xin\'Qari', x: 880, y: 150, dono: 'Amarelo', tropas: 5, vizinhos: ['Shōrenji', 'Nihadara', 'Vol\'Zareth', 'Sa\'Torran','Mei\'Zhara'] },
      { nome: 'Vol\'Zareth', x: 980, y: 150, dono: 'Preto', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan','Sa\'Torran'] },
      { nome: 'Omradan', x: 1100, y: 200, dono: 'Roxo', tropas: 5, vizinhos: ['Vol\'Zareth', 'Sa\'Torran', 'Qumaran','Tzun\'Rakai'] },
      { nome: 'Sa\'Torran', x: 970, y: 250, dono: 'Azul', tropas: 5, vizinhos: ['Xin\'Qari', 'Omradan', 'Qumaran', 'Mei\'Zhara','Vol\'Zareth'] },
      { nome: 'Qumaran', x: 1000, y: 320, dono: 'Vermelho', tropas: 5, vizinhos: ['Omradan', 'Sa\'Torran', 'Tzun\'Rakai', 'Darakai', 'Shōrenji','Kaer\'Tai','Ish\'Tanor'] },
      { nome: 'Tzun\'Rakai', x: 1120, y: 290, dono: 'Verde', tropas: 5, vizinhos: ['Qumaran', 'Omradan'] },
      { nome: 'Mei\'Zhara', x: 940, y: 280, dono: 'Amarelo', tropas: 5, vizinhos: ['Sa\'Torran', 'Qumaran', 'Xin\'Qari'] },
      { nome: 'Darakai', x: 950, y: 400, dono: 'Preto', tropas: 5, vizinhos: ['Qumaran', 'Kaer\'Tai', 'Ish\'Tanor','Winterholde'] },
      { nome: 'Ish\'Tanor', x: 1000, y: 400, dono: 'Roxo', tropas: 5, vizinhos: ['Tzun\'Rakai', 'Darakai', 'Winterholde','Qumaran'] },
      { nome: 'Winterholde', x: 1030, y: 495, dono: 'Azul', tropas: 5, vizinhos: ['Ish\'Tanor', 'Mistveil','Darakai'] },
      { nome: 'Aetheris', x: 1080, y: 470, dono: 'Vermelho', tropas: 5, vizinhos: ['Ish\'Tanor', 'Dawnwatch', 'Mistveil'] },
      { nome: 'Dawnwatch', x: 1150, y: 485, dono: 'Verde', tropas: 5, vizinhos: ['Aetheris', 'Mistveil'] },
      { nome: 'Mistveil', x: 1100, y: 550, dono: 'Amarelo', tropas: 5, vizinhos: ['Winterholde', 'Aetheris', 'Dawnwatch'] }
    ];

    tropasReforco = calcularReforco(turno).base;
    tropasBonusContinente = calcularReforco(turno).bonus;
    io.emit('mostrarMensagem', `Jogo reiniciado! É a vez do jogador ${turno}.`);
    io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
    });


        socket.on('disconnect', () => {
        console.log('Jogador desconectado:', socket.id);
        // Liberar o jogador atribuído ao socket desconectado
        const jogador = jogadores.find(j => j.socketId === socket.id);
        if (jogador) {
        jogador.socketId = null;
        jogador.ativo = true; // ou decidir outra lógica se quiser desativar
        console.log(`Jogador ${jogador.nome} liberado`);
        }
    });

    socket.on('reiniciarJogo', () => {
      inicializarJogo();
    });
  });
});

function getEstado(socketId = null) {
  let meuNome = null;
  if (socketId) {
    const jogador = jogadores.find(j => j.socketId === socketId);
    if (jogador) meuNome = jogador.nome;
  }

  // Calcular controle dos continentes por jogador
  const controleContinentes = {};
  Object.values(continentes).forEach(continente => {
    const territoriosDoContinente = continente.territorios;
    const controlePorJogador = {};
    
    jogadores.forEach(jogador => {
      const territoriosConquistados = territoriosDoContinente.filter(territorio => {
        const pais = paises.find(p => p.nome === territorio);
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

  return {
    jogadores,
    turno,
    paises,
    tropasReforco,
    tropasBonusContinente,
    vitoria,
    derrota,
    meuNome,
    continentes: controleContinentes
  };
}

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function calcularReforco(turnoAtual) {
  const territorios = paises.filter(p => p.dono === turnoAtual).length;
  let reforcoBase = Math.max(3, Math.floor(territorios / 2));
  
  // Calcular bônus dos continentes
  let bonusContinentes = {};
  Object.values(continentes).forEach(continente => {
    const territoriosDoContinente = continente.territorios;
    const territoriosConquistados = territoriosDoContinente.filter(territorio => {
      const pais = paises.find(p => p.nome === territorio);
      return pais && pais.dono === turnoAtual;
    });
    
    // Se o jogador controla todos os territórios do continente
    if (territoriosConquistados.length === territoriosDoContinente.length) {
      bonusContinentes[continente.nome] = continente.bonus;
    }
  });
  
  return { base: reforcoBase, bonus: bonusContinentes };
}

function checarEliminacao() {
  jogadores.forEach(jogador => {
    const temTerritorio = paises.some(p => p.dono === jogador.nome);
    if (!temTerritorio && jogador.ativo) {
      jogador.ativo = false;
      io.emit('mostrarMensagem', `Jogador ${jogador.nome} foi eliminado!`);
      if (turno === jogador.nome) {
        // Passa turno imediatamente se o jogador eliminado estava jogando
        let encontrouJogadorAtivo = false;
        let tentativas = 0;
        do {
          indiceTurno = (indiceTurno + 1) % jogadores.length;
          tentativas++;
          if (jogadores[indiceTurno].ativo) {
            encontrouJogadorAtivo = true;
          }
          if (tentativas > jogadores.length) {
            encontrouJogadorAtivo = false;
            break;
          }
        } while (!encontrouJogadorAtivo);

        if (!encontrouJogadorAtivo) {
          io.emit('mostrarMensagem', 'Jogo acabou! Não há mais jogadores ativos.');
          return;
        }
        turno = jogadores[indiceTurno].nome;
        const resultadoReforco = calcularReforco(turno);
        tropasReforco = resultadoReforco.base;
        tropasBonusContinente = resultadoReforco.bonus;
        io.emit('mostrarMensagem', `Agora é a vez do jogador ${turno}`);
      }
        jogadores.forEach(j => {
        if (j.nome === jogador.nome) {
            io.to(j.socketId).emit('derrota');
        }
        });
        io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
    });

    }
  });
  checarVitoria();
}

function checarVitoria() {
  const ativos = jogadores.filter(j => j.ativo);
  if (ativos.length === 1) {
    vitoria = true;
    io.emit('vitoria', ativos[0].nome);
  }
}

// Inicializar o jogo
function inicializarJogo() {
  // Distribuir territórios aleatoriamente
  const territoriosDisponiveis = [...paises];
  let indiceJogador = 0;
  
  while (territoriosDisponiveis.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * territoriosDisponiveis.length);
    const territorio = territoriosDisponiveis.splice(indiceAleatorio, 1)[0];
    territorio.dono = jogadores[indiceJogador].nome;
    territorio.tropas = 1;
    indiceJogador = (indiceJogador + 1) % jogadores.length;
  }

  // Colocar tropas extras
  paises.forEach(pais => {
    pais.tropas += 2;
  });

  indiceTurno = 0;
  turno = jogadores[indiceTurno].nome;
  vitoria = false;
  derrota = false;
  
  const resultadoReforco = calcularReforco(turno);
  tropasReforco = resultadoReforco.base;
  tropasBonusContinente = resultadoReforco.bonus;

  io.emit('mostrarMensagem', `🎮 Jogo iniciado! Turno de ${turno}. Reforços: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
  io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
  });
}



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Inicializar o jogo quando o servidor iniciar
  inicializarJogo();
});