const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const jogadores = [
  { nome: 'Azul', ativo: true, socketId: null, isCPU: false },
  { nome: 'Vermelho', ativo: true, socketId: null, isCPU: false },
  { nome: 'Verde', ativo: true, socketId: null, isCPU: false },
  { nome: 'Amarelo', ativo: true, socketId: null, isCPU: false },
  { nome: 'Preto', ativo: true, socketId: null, isCPU: false },
  { nome: 'Roxo', ativo: true, socketId: null, isCPU: false }
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

let tropasReforco = 0;
let tropasBonusContinente = {}; // Track bonus troops by continent
let faseRemanejamento = false; // Controla se está na fase de remanejamento

// Sistema de objetivos
let objetivos = {}; // { jogador: objetivo }

// Sistema de controle de movimentação de tropas durante remanejamento
let movimentosRemanejamento = {}; // { jogador: { origem: { destino: quantidade } } }

// Sistema de cartas território
let territoriosConquistadosNoTurno = {}; // { jogador: [territorios] }
let cartasTerritorio = {}; // { jogador: [cartas] }
const simbolosCartas = ['▲', '■', '●', '★']; // Triângulo, quadrado, círculo, coringa
let numeroTrocasRealizadas = 0; // Contador de trocas para bônus progressivo

// Mapeamento de territórios para símbolos de cartas
const mapeamentoTerritorioSimbolo = {
  // Thaloria (▲ - Triângulo)
  'Redwyn': '▲', 'Stormfen': '▲', 'Highmoor': '▲', 'Cragstone': '▲', 'Hollowspire': '▲', 'Westreach': '▲', 'Barrowfell': '▲',
  
  // Zarandis (■ - Quadrado)
  'Emberlyn': '■', 'Ravenspire': '■', 'Stonevale': '■', 'Duskwatch': '■', 'Stormhall': '■',
  
  // Elyndra (● - Círculo)
  'Frosthollow': '●', 'Eldoria': '●', 'Greymoor': '●', 'Thalengarde': '●', 'Duskmere': '●', 'Ironreach': '●', 'Frosthelm': '●', 'Blackmere': '●',
  
  // Kharune (★ - Coringa)
  'Zul\'Marak': '★', 'Emberwaste': '★', 'Sunjara': '★', 'Tharkuun': '★', 'Bareshi': '★', 'Oru\'Kai': '★',
  
  // Xanthera (▲ - Triângulo)
  'Kaer\'Tai': '▲', 'Shōrenji': '▲', 'Nihadara': '▲', 'Xin\'Qari': '▲', 'Vol\'Zareth': '▲', 'Omradan': '▲', 'Sa\'Torran': '▲', 'Qumaran': '▲', 'Tzun\'Rakai': '▲', 'Mei\'Zhara': '▲',
  
  // Mythara (■ - Quadrado)
  'Darakai': '■', 'Ish\'Tanor': '■', 'Winterholde': '■', 'Aetheris': '■', 'Dawnwatch': '■', 'Mistveil': '■'
};

// Tipos de objetivos
const tiposObjetivos = [
  'conquistar3Continentes',
  'eliminarJogador', 
  'dominar24Territorios',
  'dominar16TerritoriosCom2Tropas'
];

app.use(express.static('public')); // coloque seu index.html e assets na pasta public

io.on('connection', (socket) => {
  console.log('Novo jogador conectado');

   const jogadorDisponivel = jogadores.find(j => j.socketId === null);
  if (jogadorDisponivel) {
    jogadorDisponivel.socketId = socket.id;
    
    // Se o jogador era uma CPU, desativar
    if (jogadorDisponivel.isCPU) {
      jogadorDisponivel.isCPU = false;
      console.log(`🤖 CPU desativada para ${jogadorDisponivel.nome} (jogador conectou)`);
      io.emit('mostrarMensagem', `👤 ${jogadorDisponivel.nome} conectou-se e assumiu o controle!`);
      io.emit('adicionarAoHistorico', `👤 ${jogadorDisponivel.nome} conectou-se e assumiu o controle da CPU`);
    }
    
    console.log(`Jogador ${jogadorDisponivel.nome} atribuído ao socket ${socket.id}`);
  } else {
    console.log('Não há jogadores disponíveis para atribuir a este socket.');
  }

  // Dar tempo para outros jogadores se conectarem antes de ativar CPUs
  setTimeout(() => {
    ativarCPUs();
  }, 10000); // 10 segundos de delay

  // Envia estado inicial para o cliente
  socket.emit('estadoAtualizado', getEstado(socket.id));


  socket.on('transferirTropasConquista', (dados) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno || vitoria || derrota) return;

    const territorioAtacante = paises.find(p => p.nome === dados.territorioAtacante);
    const territorioConquistado = paises.find(p => p.nome === dados.territorioConquistado);
    
    if (!territorioAtacante || !territorioConquistado) return;
    if (territorioAtacante.dono !== turno || territorioConquistado.dono !== turno) return;
            if (dados.quantidade < 1 || dados.quantidade > 3) return; // Mínimo 1 (automática), máximo 3 (1 automática + 2 adicionais)
    if (territorioAtacante.tropas - (dados.quantidade - 1) < 1) return; // Garantir pelo menos 1 tropa no atacante (descontando a automática)

    // Transferir tropas (1 já foi automaticamente transferida)
    const tropasAdicionais = dados.quantidade - 1; // Descontar a tropa automática
    territorioAtacante.tropas -= tropasAdicionais;
    territorioConquistado.tropas += tropasAdicionais;

    const mensagem = tropasAdicionais > 0 
      ? `${turno} transferiu ${tropasAdicionais} tropas adicionais de ${dados.territorioAtacante} para ${dados.territorioConquistado} (1 automática + ${tropasAdicionais} opcionais)`
      : `${turno} manteve apenas a tropa automática em ${dados.territorioConquistado}`;
    io.emit('mostrarMensagem', mensagem);
    io.emit('tocarSomMovimento');

    io.sockets.sockets.forEach((s) => {
      s.emit('estadoAtualizado', getEstado(s.id));
    });
    
    // Verificar vitória após transferir tropas
    checarVitoria();
  });

  socket.on('colocarReforco', (nomePais) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno || vitoria || derrota) return;

    const pais = paises.find(p => p.nome === nomePais);
    if (!pais || pais.dono !== turno) return;

    // Verificar se há tropas de bônus de continente para colocar
    let podeColocar = false;
    let continenteBonus = null;
    let mensagemErro = null;
    
    // Ordenar continentes por bônus (maior para menor)
    const continentesOrdenados = Object.entries(tropasBonusContinente)
      .filter(([nome, quantidade]) => quantidade > 0)
      .sort((a, b) => {
        const bonusA = continentes[a[0]].bonus;
        const bonusB = continentes[b[0]].bonus;
        return bonusB - bonusA; // Ordem decrescente
      });
    
    // Verificar se o país pertence ao continente com maior prioridade
    if (continentesOrdenados.length > 0) {
      const [nomeContinente, quantidade] = continentesOrdenados[0];
      const continente = continentes[nomeContinente];
      
      if (continente.territorios.includes(nomePais)) {
        // Pode colocar tropa de bônus neste país
        tropasBonusContinente[nomeContinente] -= 1;
        continenteBonus = nomeContinente;
        podeColocar = true;
      } else {
        // País não pertence ao continente prioritário
        const outrosContinentes = continentesOrdenados.slice(1);
        const podeColocarEmOutro = outrosContinentes.some(([nome, qty]) => {
          const cont = continentes[nome];
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
      const totalTropasBonus = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
      
      if (totalTropasBonus > 0) {
        // Ainda há tropas de bônus para colocar, não pode colocar tropas base
        const [nomeContinente, quantidade] = continentesOrdenados[0];
        mensagemErro = `❌ Primeiro coloque todas as ${totalTropasBonus} tropas de bônus restantes! (${nomeContinente}: ${quantidade})`;
      } else if (tropasReforco > 0) {
        // Não há mais tropas de bônus, pode colocar tropas base
        podeColocar = true;
      } else {
        // Não há mais tropas para colocar
        mensagemErro = `❌ Não há mais tropas para colocar!`;
      }
    }

    if (mensagemErro) {
      io.emit('mostrarMensagem', mensagemErro);
      return;
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
      io.emit('tocarSomMovimento'); // Emitir evento para tocar som de movimento
      
      // Mostrar efeito visual de reforço
      io.emit('mostrarEfeitoReforco', {
        territorio: nomePais,
        jogador: turno,
        tipo: 'reforco'
      });

      io.sockets.sockets.forEach((s) => {
        s.emit('estadoAtualizado', getEstado(s.id));
      });
      
      // Verificar vitória após colocar reforço
      checarVitoria();
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
        defensorPais.tropas = 1; // Colocar 1 tropa no território conquistado
        atacantePais.tropas -= 1; // Remover 1 tropa do território atacante
        resultadoMensagem += `${para} foi conquistado por ${turno}!\n`;
        
        // Registrar território conquistado no turno atual
        if (!territoriosConquistadosNoTurno[turno]) {
          territoriosConquistadosNoTurno[turno] = [];
        }
        territoriosConquistadosNoTurno[turno].push(para);
        
        // Calcular tropas disponíveis para transferência (incluindo a tropa automática)
        const tropasAdicionais = Math.min(atacantePais.tropas - 1, 2); // Máximo 2 tropas adicionais, mínimo 1 no atacante
        const tropasDisponiveis = tropasAdicionais + 1; // Incluir a tropa automática no total
        
        // Se há tropas adicionais disponíveis, mostrar interface de escolha
        if (tropasAdicionais > 0) {
          // Emitir evento para mostrar interface de transferência de tropas
          io.emit('territorioConquistado', {
            territorioConquistado: para,
            territorioAtacante: de,
            tropasDisponiveis: tropasDisponiveis, // Total incluindo tropa automática
            tropasAdicionais: tropasAdicionais, // Apenas tropas adicionais (sem a automática)
            jogadorAtacante: turno
          });
        } else {
          // Apenas a tropa automática foi transferida, não há escolha a fazer
          resultadoMensagem += `Apenas a tropa automática foi transferida para ${para}.\n`;
        }
        
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
        
        // Verificar vitória após conquista
        checarVitoria();
    }

    io.emit('mostrarMensagem', resultadoMensagem.trim());
    io.emit('tocarSomTiro'); // Emitir evento para tocar som de tiro
    
    // Mostrar efeito visual de ataque
    const sucesso = defensorPais.tropas <= 0;
    io.emit('mostrarEfeitoAtaque', {
      origem: de,
      destino: para,
      sucesso: sucesso
    });
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

    // Se não está na fase de remanejamento, iniciar a fase de remanejamento
    if (!faseRemanejamento) {
      faseRemanejamento = true;
      io.emit('mostrarMensagem', `🔄 ${turno} está na fase de remanejamento. Clique em um território para mover tropas.`);
      io.emit('iniciarFaseRemanejamento');
      io.sockets.sockets.forEach((s) => {
        s.emit('estadoAtualizado', getEstado(s.id));
      });
      return;
    }

    // Se está na fase de remanejamento, passar para o próximo jogador
    faseRemanejamento = false;
    
    // Processar cartas do jogador atual (se for humano)
    processarCartasJogador(turno);
    
    // Limpar o controle de movimentos do jogador atual
    if (movimentosRemanejamento[turno]) {
      delete movimentosRemanejamento[turno];
    }
    
    // Ativar CPUs se necessário
    ativarCPUs();
    
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
    
    // Verificar se é turno de CPU
    verificarTurnoCPU();

  });

  socket.on('consultarObjetivo', () => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (!jogador) return;
    
    const objetivo = objetivos[jogador.nome];
    if (objetivo) {
      socket.emit('mostrarObjetivo', objetivo);
    }
  });

  socket.on('consultarCartasTerritorio', () => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (!jogador) return;
    
    const cartas = cartasTerritorio[jogador.nome] || [];
    socket.emit('mostrarCartasTerritorio', cartas);
  });

  socket.on('trocarCartasTerritorio', (cartasSelecionadas) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (!jogador || jogador.nome !== turno) {
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Não é sua vez!' });
      return;
    }

    const cartas = cartasTerritorio[jogador.nome] || [];
    
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

    // Remover as cartas trocadas
    cartasSelecionadas.forEach(territorio => {
      const index = cartas.findIndex(carta => carta.territorio === territorio);
      if (index > -1) {
        cartas.splice(index, 1);
      }
    });

    // Atualizar o deck do jogador
    cartasTerritorio[jogador.nome] = cartas;

    // Calcular bônus progressivo para troca de cartas
    numeroTrocasRealizadas++;
    const bonusTroca = 2 + (numeroTrocasRealizadas * 2); // 4, 6, 8, 10, ...

    // Determinar tipo de troca considerando coringas
    let tipoTroca;
    if (temCoringa) {
      const simbolosSemCoringa = simbolosSelecionados.filter(simbolo => simbolo !== '★');
      const simbolosUnicosSemCoringa = [...new Set(simbolosSemCoringa)];
      tipoTroca = simbolosUnicosSemCoringa.length === 1 ? 'mesmo símbolo' : 'símbolos diferentes';
    } else {
      tipoTroca = simbolosUnicos.length === 1 ? 'mesmo símbolo' : 'símbolos diferentes';
    }
    
    io.emit('mostrarMensagem', `🎴 ${jogador.nome} trocou 3 cartas de ${tipoTroca} (${cartasSelecionadas.join(', ')}) e recebeu ${bonusTroca} exércitos bônus!`);
    io.emit('tocarSomTakeCard');
    
    socket.emit('resultadoTrocaCartas', { sucesso: true, mensagem: `Cartas trocadas com sucesso! Você recebeu ${bonusTroca} exércitos bônus!` });
    
    // Se era uma troca obrigatória, continuar o turno
    const cartasRestantes = cartasTerritorio[jogador.nome] || [];
    if (cartasRestantes.length < 5) {
      // Continuar o turno normalmente com bônus adicional
      const resultadoReforco = calcularReforco(turno);
      tropasReforco = resultadoReforco.base + bonusTroca; // Adicionar bônus da troca
      tropasBonusContinente = resultadoReforco.bonus;

      io.emit('mostrarMensagem', `🎮 Turno de ${turno}. Reforços: ${resultadoReforco.base} base + ${bonusTroca} bônus da troca + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus de continentes`);
    }
    
    // Atualizar estado para todos os clientes
    io.sockets.sockets.forEach((s) => {
      s.emit('estadoAtualizado', getEstado(s.id));
    });
    
    // Verificar vitória após troca de cartas
    checarVitoria();
  });

  socket.on('verificarMovimentoRemanejamento', (dados) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno || vitoria || derrota || !faseRemanejamento) {
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Não é sua vez ou não está na fase de remanejamento' });
      return;
    }

    const territorioOrigem = paises.find(p => p.nome === dados.origem);
    const territorioDestino = paises.find(p => p.nome === dados.destino);
    
    if (!territorioOrigem || !territorioDestino) {
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não encontrados' });
      return;
    }
    
    if (territorioOrigem.dono !== turno || territorioDestino.dono !== turno) {
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não são seus' });
      return;
    }
    
    if (!territorioOrigem.vizinhos.includes(territorioDestino.nome)) {
      socket.emit('resultadoVerificacaoMovimento', { podeMover: false, quantidadeMaxima: 0, motivo: 'Territórios não são vizinhos' });
      return;
    }

    // Controle refinado de movimentos
    if (!movimentosRemanejamento[turno]) movimentosRemanejamento[turno] = {};
    if (!movimentosRemanejamento[turno][dados.origem]) movimentosRemanejamento[turno][dados.origem] = {};
    if (!movimentosRemanejamento[turno][dados.destino]) movimentosRemanejamento[turno][dados.destino] = {};

    // Quantas tropas já vieram de destino para origem neste turno?
    const tropasQueVieram = movimentosRemanejamento[turno][dados.destino][dados.origem] || 0;
    // Quantas tropas "originais" existem no origem?
    const tropasOriginais = territorioOrigem.tropas - tropasQueVieram;
    const quantidadeMaxima = Math.min(tropasOriginais, territorioOrigem.tropas - 1); // Deixar pelo menos 1 tropa

    if (quantidadeMaxima <= 0) {
      socket.emit('resultadoVerificacaoMovimento', { 
        podeMover: false, 
        quantidadeMaxima: 0, 
        motivo: `Não é possível mover tropas de ${dados.origem} para ${dados.destino} pois ${tropasQueVieram} tropas vieram de ${dados.destino} para ${dados.origem} neste turno.` 
      });
      return;
    }

    socket.emit('resultadoVerificacaoMovimento', { 
      podeMover: true, 
      quantidadeMaxima: quantidadeMaxima,
      destino: dados.destino,
      motivo: null
    });
  });

  socket.on('moverTropas', (dados) => {
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador.nome !== turno || vitoria || derrota || !faseRemanejamento) return;

    const territorioOrigem = paises.find(p => p.nome === dados.origem);
    const territorioDestino = paises.find(p => p.nome === dados.destino);
    
    if (!territorioOrigem || !territorioDestino) return;
    if (territorioOrigem.dono !== turno || territorioDestino.dono !== turno) return;
    if (dados.quantidade < 1 || dados.quantidade > territorioOrigem.tropas - 1) return; // Deixar pelo menos 1 tropa
    if (!territorioOrigem.vizinhos.includes(territorioDestino.nome)) return; // Deve ser vizinho

    // Controle refinado de movimentos
    if (!movimentosRemanejamento[turno]) movimentosRemanejamento[turno] = {};
    if (!movimentosRemanejamento[turno][dados.origem]) movimentosRemanejamento[turno][dados.origem] = {};
    if (!movimentosRemanejamento[turno][dados.destino]) movimentosRemanejamento[turno][dados.destino] = {};

    // Quantas tropas já vieram de destino para origem neste turno?
    const tropasQueVieram = movimentosRemanejamento[turno][dados.destino][dados.origem] || 0;
    // Quantas tropas "originais" existem no origem?
    const tropasOriginais = territorioOrigem.tropas - tropasQueVieram;
    if (dados.quantidade > tropasOriginais) {
      const mensagemErro = `Não é possível mover ${dados.quantidade} tropas de ${dados.origem} para ${dados.destino} pois ${tropasQueVieram} tropas vieram de ${dados.destino} para ${dados.origem} neste turno.`;
      socket.emit('mostrarMensagem', mensagemErro);
      return;
    }

    // Registrar o movimento
    movimentosRemanejamento[turno][dados.origem][dados.destino] = (movimentosRemanejamento[turno][dados.origem][dados.destino] || 0) + dados.quantidade;

    // Mover tropas
    territorioOrigem.tropas -= dados.quantidade;
    territorioDestino.tropas += dados.quantidade;

    const mensagem = `${turno} moveu ${dados.quantidade} tropas de ${dados.origem} para ${dados.destino}`;
    io.emit('mostrarMensagem', mensagem);
    io.emit('tocarSomMovimento');
    

    
    // Verificar vitória após mover tropas
    checarVitoria();

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
  faseRemanejamento = false;
    tropasReforco = 0;
    tropasBonusContinente = {}; // Resetar tropas de bônus
    objetivos = {}; // Resetar objetivos
    movimentosRemanejamento = {}; // Resetar controle de movimentos
    numeroTrocasRealizadas = 0; // Resetar contador de trocas
    cartasTerritorio = {}; // Resetar cartas território
    territoriosConquistadosNoTurno = {}; // Resetar territórios conquistados

    paises = [
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
        
        // Ativar CPU para o jogador desconectado
        ativarCPUs();
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

  // Calcular continente com prioridade para reforço
  const continentePrioritario = calcularContinentePrioritario();

  return {
    jogadores,
    turno,
    paises,
    tropasReforco,
    tropasBonusContinente,
    vitoria,
    derrota,
    meuNome,
    continentes: controleContinentes,
    objetivos,
    continentePrioritario,
    faseRemanejamento,
    cartasTerritorio
  };
}

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function calcularContinentePrioritario() {
  // Ordenar continentes por bônus (maior para menor)
  const continentesOrdenados = Object.entries(tropasBonusContinente)
    .filter(([nome, quantidade]) => quantidade > 0)
    .sort((a, b) => {
      const bonusA = continentes[a[0]].bonus;
      const bonusB = continentes[b[0]].bonus;
      return bonusB - bonusA; // Ordem decrescente
    });
  
  if (continentesOrdenados.length > 0) {
    const [nomeContinente, quantidade] = continentesOrdenados[0];
    return {
      nome: nomeContinente,
      quantidade: quantidade,
      bonus: continentes[nomeContinente].bonus
    };
  }
  
  return null; // Não há tropas de bônus pendentes
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

function gerarObjetivoAleatorio(jogador) {
  const tipo = tiposObjetivos[Math.floor(Math.random() * tiposObjetivos.length)];
  
  switch (tipo) {
    case 'conquistar3Continentes':
      const nomesContinentes = Object.keys(continentes);
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
      const jogadoresDisponiveis = jogadores.filter(j => j.nome !== jogador);
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

function verificarObjetivo(jogador) {
  const objetivo = objetivos[jogador];
  if (!objetivo) {
    console.log(`❌ Nenhum objetivo encontrado para ${jogador}`);
    return false;
  }
  
  console.log(`🎯 Verificando objetivo de ${jogador}: ${objetivo.tipo}`);
  
  switch (objetivo.tipo) {
    case 'conquistar3Continentes':
      const continentesConquistados = Object.values(continentes).filter(continente => {
        const territoriosDoContinente = continente.territorios;
        const territoriosConquistados = territoriosDoContinente.filter(territorio => {
          const pais = paises.find(p => p.nome === territorio);
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
      const jogadorAlvo = jogadores.find(j => j.nome === objetivo.jogadorAlvo);
      const eliminado = !jogadorAlvo || !jogadorAlvo.ativo;
      console.log(`🎯 Jogador alvo ${objetivo.jogadorAlvo} eliminado: ${eliminado}`);
      return eliminado;
      
    case 'dominar24Territorios':
      const territoriosDominados = paises.filter(p => p.dono === jogador).length;
      console.log(`🗺️ Territórios dominados por ${jogador}: ${territoriosDominados}/24`);
      return territoriosDominados >= 24;
      
    case 'dominar16TerritoriosCom2Tropas':
      const territoriosCom2Tropas = paises.filter(p => p.dono === jogador && p.tropas >= 2).length;
      console.log(`⚔️ Territórios com 2+ tropas de ${jogador}: ${territoriosCom2Tropas}/16`);
      return territoriosCom2Tropas >= 16;
  }
  
  console.log(`❌ Tipo de objetivo desconhecido: ${objetivo.tipo}`);
  return false;
}

function checarVitoria() {
  console.log('🔍 Verificando vitória...');
  
  // Verificar vitória por eliminação
  const ativos = jogadores.filter(j => j.ativo);
  if (ativos.length === 1) {
    console.log(`🏆 Vitória por eliminação: ${ativos[0].nome}`);
    vitoria = true;
    io.emit('vitoria', ativos[0].nome);
    return;
  }
  
  // Verificar vitória por objetivo
  for (const jogador of jogadores) {
    if (jogador.ativo) {
      console.log(`🔍 Verificando objetivo de ${jogador.nome}...`);
      const objetivo = objetivos[jogador.nome];
      console.log(`📋 Objetivo de ${jogador.nome}:`, objetivo);
      
      if (verificarObjetivo(jogador.nome)) {
        console.log(`🏆 Vitória por objetivo: ${jogador.nome}`);
        vitoria = true;
        io.emit('vitoria', jogador.nome);
        return;
      }
    }
  }
  
  console.log('❌ Nenhuma vitória encontrada');
}

// Inicializar o jogo
function inicializarJogo() {
  console.log(`🎮 Inicializando jogo...`);
  
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
    pais.tropas += 0; // Changed from 2 to 0 to start with 1 troop
  });

  // Gerar objetivos para cada jogador
  jogadores.forEach(jogador => {
    objetivos[jogador.nome] = gerarObjetivoAleatorio(jogador.nome);
    console.log(`🎯 Objetivo de ${jogador.nome}: ${objetivos[jogador.nome].descricao}`);
  });

  indiceTurno = 0;
  turno = jogadores[indiceTurno].nome;
  vitoria = false;
  derrota = false;
  
  // Limpar cartas território e territórios conquistados
  cartasTerritorio = {};
  territoriosConquistadosNoTurno = {};
  numeroTrocasRealizadas = 0; // Resetar contador de trocas
  
  console.log(`🎮 Jogo inicializado - turno: ${turno}, cartas: ${Object.keys(cartasTerritorio).length} jogadores com cartas`);
  
  const resultadoReforco = calcularReforco(turno);
  tropasReforco = resultadoReforco.base;
  tropasBonusContinente = resultadoReforco.bonus;

  io.emit('mostrarMensagem', `🎮 Jogo iniciado! Turno de ${turno}. Reforços: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
  io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
  });
}

// ===== SISTEMA DE CPU =====

// Função para ativar CPUs para jogadores sem conexão
function ativarCPUs() {
  let cpusAtivadas = 0;
  const jogadoresSemConexao = jogadores.filter(jogador => !jogador.socketId && !jogador.isCPU);
  
  console.log(`🤖 Verificando CPUs - jogadores sem conexão:`, jogadoresSemConexao.map(j => j.nome));
  
  // Só ativar CPUs se houver jogadores sem conexão
  if (jogadoresSemConexao.length > 0) {
    jogadoresSemConexao.forEach(jogador => {
      jogador.isCPU = true;
      cpusAtivadas++;
      console.log(`🤖 CPU ativada para ${jogador.nome} (sem conexão)`);
      io.emit('adicionarAoHistorico', `🤖 CPU ativada para ${jogador.nome}`);
    });
    
    if (cpusAtivadas > 0) {
      io.emit('mostrarMensagem', `🤖 ${cpusAtivadas} CPU(s) ativada(s) para completar a partida!`);
    }
  } else {
    console.log(`🤖 Nenhuma CPU precisa ser ativada`);
  }
  
  console.log(`🤖 Status final das CPUs:`, jogadores.map(j => `${j.nome}: CPU=${j.isCPU}, Ativo=${j.ativo}, Socket=${j.socketId ? 'Conectado' : 'Desconectado'}`));
  return cpusAtivadas;
}

// Função para executar turno da CPU
function executarTurnoCPU(jogadorCPU) {
  console.log(`🤖 CPU ${jogadorCPU.nome} executando turno...`);
  
  // Verificar se a CPU deve trocar cartas (inteligente)
  const cartasCPU = cartasTerritorio[jogadorCPU.nome] || [];
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
        // Remover as 3 cartas trocadas
        const cartasRestantes = cartasCPU.filter(carta => 
          !cartasParaTrocar.includes(carta.territorio)
        );
        cartasTerritorio[jogadorCPU.nome] = cartasRestantes;
        
        // Calcular bônus baseado no tipo de troca
        const bonusTroca = calcularBonusTrocaCartas(cartasParaTrocar);
        const territoriosDoJogador = paises.filter(p => p.dono === jogadorCPU.nome);
        
        // Distribuir tropas estrategicamente
        for (let i = 0; i < bonusTroca; i++) {
          if (territoriosDoJogador.length > 0) {
            const territorioEstrategico = selecionarTerritorioEstrategicoParaReforco(jogadorCPU, territoriosDoJogador);
            territorioEstrategico.tropas++;
            
            // Emitir efeito visual e som para todos os jogadores verem
            io.emit('mostrarEfeitoReforco', {
              territorio: territorioEstrategico.nome,
              jogador: jogadorCPU.nome
            });
            
            console.log(`🎯 CPU ${jogadorCPU.nome} reforçou ${territorioEstrategico.nome} com tropa de troca de cartas (${territorioEstrategico.tropas} tropas)`);
          }
        }
        
        io.emit('mostrarMensagem', `🤖 CPU ${jogadorCPU.nome} trocou 3 cartas território e recebeu ${bonusTroca} tropas extras!`);
        io.emit('adicionarAoHistorico', `🃏 CPU ${jogadorCPU.nome} trocou 3 cartas território (+${bonusTroca} tropas)`);
        io.emit('tocarSomTakeCard');
        
        // Continuar com o turno normal da CPU
        continuarTurnoCPU(jogadorCPU);
      }, 1000);
      
      return;
    }
  }
  
  // Delay para simular pensamento da CPU
  setTimeout(() => {
    if (vitoria || derrota) return;
    
    continuarTurnoCPU(jogadorCPU);
  }, 1500);
}

// Função auxiliar para continuar o turno da CPU após verificar cartas
function continuarTurnoCPU(jogadorCPU) {
  console.log(`🧠 CPU ${jogadorCPU.nome} analisando estratégia...`);
  io.emit('adicionarAoHistorico', `🧠 CPU ${jogadorCPU.nome} iniciando turno`);
  
  // 1. ESTRATÉGIA DE REFORÇOS INTELIGENTE
  const resultadoReforco = calcularReforco(jogadorCPU.nome);
  const tropasReforcoCPU = resultadoReforco.base;
  const tropasBonusCPU = resultadoReforco.bonus;
  
  // Analisar objetivo da CPU
  const objetivo = objetivos[jogadorCPU.nome];
  console.log(`🎯 CPU ${jogadorCPU.nome} tem objetivo: ${objetivo?.tipo}`);
  
    // Iniciar sequência de reforços
  executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, 0);
}

// Função para executar reforços sequencialmente
function executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, index) {
  if (vitoria || derrota) return;
  
  // Converter tropas de bônus em array para processamento sequencial
  const tropasBonusArray = [];
  Object.entries(tropasBonusCPU).forEach(([continente, quantidade]) => {
    for (let i = 0; i < quantidade; i++) {
      tropasBonusArray.push({ continente, tipo: 'bonus' });
    }
  });
  
  // Adicionar tropas base ao array
  for (let i = 0; i < tropasReforcoCPU; i++) {
    tropasBonusArray.push({ tipo: 'base' });
  }
  
  // Se ainda há reforços para processar
  if (index < tropasBonusArray.length) {
    const reforco = tropasBonusArray[index];
    
    if (reforco.tipo === 'bonus') {
      // Processar tropa de bônus
      const territoriosDoContinente = continentes[reforco.continente].territorios;
      const territoriosDoJogador = territoriosDoContinente.filter(territorio => {
        const pais = paises.find(p => p.nome === territorio);
        return pais && pais.dono === jogadorCPU.nome;
      });
      
      if (territoriosDoJogador.length > 0) {
        let territorioPrioritario;
        
        if (objetivo?.tipo === 'conquistar3Continentes') {
          territorioPrioritario = territoriosDoJogador.find(territorio => {
            const pais = paises.find(p => p.nome === territorio);
            return pais && (pais.nome === objetivo.continente1 || pais.nome === objetivo.continente2);
          });
        }
        
        if (!territorioPrioritario) {
          territorioPrioritario = territoriosDoJogador.reduce((min, territorio) => {
            const pais = paises.find(p => p.nome === territorio);
            const paisMin = paises.find(p => p.nome === min);
            return pais.tropas < paisMin.tropas ? territorio : min;
          });
        }
        
        const pais = paises.find(p => p.nome === territorioPrioritario);
        pais.tropas++;
        
        console.log(`🛡️ CPU ${jogadorCPU.nome} reforçou ${territorioPrioritario} (continente ${reforco.continente})`);
        io.emit('adicionarAoHistorico', `🛡️ CPU ${jogadorCPU.nome} reforçou ${territorioPrioritario} (continente ${reforco.continente})`);
        io.emit('tocarSomMovimento');
        
        // Mostrar efeito visual de reforço
        io.emit('mostrarEfeitoReforco', {
          territorio: territorioPrioritario,
          jogador: jogadorCPU.nome,
          tipo: 'reforco'
        });
        
        // Atualizar estado para todos os jogadores
        io.sockets.sockets.forEach((s) => {
          s.emit('estadoAtualizado', getEstado(s.id));
        });
      }
    } else {
      // Processar tropa base
      const territoriosDoJogador = paises.filter(p => p.dono === jogadorCPU.nome);
      if (territoriosDoJogador.length > 0) {
        let territorioPrioritario;
        
        if (objetivo?.tipo === 'dominar24Territorios' || objetivo?.tipo === 'dominar16TerritoriosCom2Tropas') {
          territorioPrioritario = territoriosDoJogador.reduce((min, atual) => 
            atual.tropas < min.tropas ? atual : min
          );
        } else if (objetivo?.tipo === 'conquistar3Continentes') {
          territorioPrioritario = territoriosDoJogador.find(territorio => {
            const vizinhos = territorio.vizinhos.filter(vizinho => {
              const paisVizinho = paises.find(p => p.nome === vizinho);
              return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
            });
            return vizinhos.length > 0;
          });
          
          if (!territorioPrioritario) {
            territorioPrioritario = territoriosDoJogador.reduce((min, atual) => 
              atual.tropas < min.tropas ? atual : min
            );
          }
        } else {
          territorioPrioritario = territoriosDoJogador.reduce((min, atual) => 
            atual.tropas < min.tropas ? atual : min
          );
        }
        
        territorioPrioritario.tropas++;
        
        console.log(`🛡️ CPU ${jogadorCPU.nome} reforçou ${territorioPrioritario.nome} (estratégico)`);
        io.emit('adicionarAoHistorico', `🛡️ CPU ${jogadorCPU.nome} reforçou ${territorioPrioritario.nome} (estratégico)`);
        io.emit('tocarSomMovimento');
        
        // Mostrar efeito visual de reforço
        io.emit('mostrarEfeitoReforco', {
          territorio: territorioPrioritario.nome,
          jogador: jogadorCPU.nome,
          tipo: 'reforco'
        });
        
        // Atualizar estado para todos os jogadores
        io.sockets.sockets.forEach((s) => {
          s.emit('estadoAtualizado', getEstado(s.id));
        });
      }
    }
    
    // Processar próximo reforço após delay
    setTimeout(() => {
      executarReforcosSequenciais(jogadorCPU, tropasBonusCPU, tropasReforcoCPU, objetivo, index + 1);
    }, 800); // 800ms entre cada reforço
    
  } else {
    // Todos os reforços foram processados, iniciar ataques
    setTimeout(() => {
      if (vitoria || derrota) return;
      executarAtaquesSequenciais(jogadorCPU, objetivo);
    }, 1000);
  }
}

// Função para executar ataques sequencialmente
function executarAtaquesSequenciais(jogadorCPU, objetivo) {
  if (vitoria || derrota) return;
  
  console.log(`⚔️ CPU ${jogadorCPU.nome} planejando ataques...`);
  io.emit('adicionarAoHistorico', `⚔️ CPU ${jogadorCPU.nome} planejando ataques...`);
  
  const territoriosDoJogador = paises.filter(p => p.dono === jogadorCPU.nome);
  const oportunidadesAtaque = [];
  
  // Analisar oportunidades de ataque
  territoriosDoJogador.forEach(territorio => {
    if (territorio.tropas > 1) {
      const vizinhosInimigos = territorio.vizinhos.filter(vizinho => {
        const paisVizinho = paises.find(p => p.nome === vizinho);
        return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
      });
      
      vizinhosInimigos.forEach(vizinho => {
        const paisVizinho = paises.find(p => p.nome === vizinho);
        const vantagemNumerica = territorio.tropas - paisVizinho.tropas;
        
        let pontuacao = 0;
        
        if (vantagemNumerica >= 2) pontuacao += 50;
        else if (vantagemNumerica >= 1) pontuacao += 30;
        else if (vantagemNumerica >= 0) pontuacao += 10;
        else pontuacao -= 50;
        
        if (objetivo?.tipo === 'conquistar3Continentes') {
          const continenteVizinho = Object.keys(continentes).find(cont => 
            continentes[cont].territorios.includes(vizinho)
          );
          if (continenteVizinho === objetivo.continente1 || continenteVizinho === objetivo.continente2) {
            pontuacao += 40;
          }
        }
        
        if (objetivo?.tipo === 'dominar24Territorios' || objetivo?.tipo === 'dominar16TerritoriosCom2Tropas') {
          pontuacao += 20;
        }
        
        const vizinhosDoVizinho = paisVizinho.vizinhos.filter(v => {
          const paisV = paises.find(p => p.nome === v);
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
  
  // Executar ataques sequencialmente
  executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, 0, objetivo);
}

// Função para executar um ataque individual
function executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index, objetivo) {
  if (vitoria || derrota) return;
  
  // Finalizar turno se não há mais oportunidades de ataque
  if (index >= oportunidadesAtaque.length) {
    // Finalizar turno da CPU
      if (vitoria || derrota) return;
      console.log(`🔄 CPU ${jogadorCPU.nome} finalizando turno...`);
      console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} no final do turno:`, territoriosConquistadosNoTurno[jogadorCPU.nome] || []);
      io.emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} finalizando turno`);
      
      // Processar cartas da CPU ANTES de passar o turno
      processarCartasJogador(jogadorCPU.nome);
      
      passarTurno(); // Reduzido de 1000ms para 300ms para finalização mais rápida
    return;
  }
  
  const oportunidade = oportunidadesAtaque[index];
  
  // Só atacar se tiver vantagem numérica clara
  if (oportunidade.vantagemNumerica >= 1) {
    console.log(`⚔️ CPU ${jogadorCPU.nome} atacando ${oportunidade.destino.nome} (vantagem: +${oportunidade.vantagemNumerica}, pontuação: ${oportunidade.pontuacao})`);
    io.emit('adicionarAoHistorico', `⚔️ CPU ${jogadorCPU.nome} atacando ${oportunidade.destino.nome} (vantagem: +${oportunidade.vantagemNumerica})`);
    
    // Verificar se ainda tem tropas suficientes para atacar
    if (oportunidade.origem.tropas <= 1) {
      console.log(`❌ CPU ${jogadorCPU.nome} não pode atacar ${oportunidade.destino.nome} - origem tem apenas ${oportunidade.origem.tropas} tropas`);
      io.emit('adicionarAoHistorico', `❌ CPU ${jogadorCPU.nome} não pode atacar ${oportunidade.destino.nome} (tropas insuficientes)`);
      
      // Processar próximo ataque
      setTimeout(() => {
        executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index + 1, objetivo);
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
        if (!territoriosConquistadosNoTurno[jogadorCPU.nome]) {
          territoriosConquistadosNoTurno[jogadorCPU.nome] = [];
        }
        territoriosConquistadosNoTurno[jogadorCPU.nome].push(oportunidade.destino.nome);
        console.log(`🏆 CPU ${jogadorCPU.nome} registrou território conquistado: ${oportunidade.destino.nome}`);
        console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} neste turno:`, territoriosConquistadosNoTurno[jogadorCPU.nome]);
        
        // Verificar se conquistou algum continente
        Object.values(continentes).forEach(continente => {
          const territoriosDoContinente = continente.territorios;
          const territoriosConquistados = territoriosDoContinente.filter(territorio => {
            const pais = paises.find(p => p.nome === territorio);
            return pais && pais.dono === jogadorCPU.nome;
          });
          
          if (territoriosConquistados.length === territoriosDoContinente.length) {
            resultadoMensagem += `🎉 ${jogadorCPU.nome} conquistou o continente ${continente.nome}! (+${continente.bonus} tropas por rodada)\n`;
          }
        });
        
        checarEliminacao();
        checarVitoria();
        
        io.emit('mostrarMensagem', `⚔️ CPU ${jogadorCPU.nome} conquistou ${oportunidade.destino.nome} de ${oportunidade.origem.nome}!`);
        io.emit('adicionarAoHistorico', `🏆 CPU ${jogadorCPU.nome} conquistou ${oportunidade.destino.nome} de ${oportunidade.origem.nome}!`);
        io.emit('tocarSomTiro');
        
        // Mostrar efeito visual de ataque bem-sucedido
        io.emit('mostrarEfeitoAtaque', {
          origem: oportunidade.origem.nome,
          destino: oportunidade.destino.nome,
          sucesso: true
        });
        
        io.sockets.sockets.forEach((s) => {
          s.emit('estadoAtualizado', getEstado(s.id));
        });
        // Recalcular oportunidades de ataque após conquista
        setTimeout(() => {
          recalcularOportunidadesAtaque(jogadorCPU, objetivo, index + 1);
        }, 800);
        return;
        
    } else {
        // Ataque falhou ou não conquistou
        console.log(`❌ CPU ${jogadorCPU.nome} falhou no ataque a ${oportunidade.destino.nome}`);
        io.emit('adicionarAoHistorico', `❌ CPU ${jogadorCPU.nome} falhou no ataque a ${oportunidade.destino.nome}`);
        io.emit('tocarSomTiro');
        
        // Mostrar efeito visual de ataque falhado
        io.emit('mostrarEfeitoAtaque', {
          origem: oportunidade.origem.nome,
          destino: oportunidade.destino.nome,
          sucesso: false
        });
    }
    
    // Atualizar estado para todos os jogadores
    io.sockets.sockets.forEach((s) => {
      s.emit('estadoAtualizado', getEstado(s.id));
    });
    
  } else {
    console.log(`🤔 CPU ${jogadorCPU.nome} desistiu de atacar ${oportunidade.destino.nome} (desvantagem numérica)`);
    io.emit('adicionarAoHistorico', `🤔 CPU ${jogadorCPU.nome} desistiu de atacar ${oportunidade.destino.nome} (desvantagem)`);
  }
  

  io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
  });
  // Processar próximo ataque após delay
  setTimeout(() => {
    executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, index + 1, objetivo);
  }, 800); // Reduzido de 1200ms para 800ms entre ataques
}

// Função para recalcular oportunidades de ataque após uma conquista
function recalcularOportunidadesAtaque(jogadorCPU, objetivo, index) {
  if (vitoria || derrota) return;
  
  console.log(`🔄 CPU ${jogadorCPU.nome} recalculando oportunidades após conquista...`);
  
  const territoriosDoJogador = paises.filter(p => p.dono === jogadorCPU.nome);
  const oportunidadesAtaque = [];
  
  // Analisar oportunidades de ataque (mesma lógica da função original)
  territoriosDoJogador.forEach(territorio => {
    if (territorio.tropas > 1) {
      const vizinhosInimigos = territorio.vizinhos.filter(vizinho => {
        const paisVizinho = paises.find(p => p.nome === vizinho);
        return paisVizinho && paisVizinho.dono !== jogadorCPU.nome;
      });
      
      vizinhosInimigos.forEach(vizinho => {
        const paisVizinho = paises.find(p => p.nome === vizinho);
        const vantagemNumerica = territorio.tropas - paisVizinho.tropas;
        
        let pontuacao = 0;
        
        if (vantagemNumerica >= 2) pontuacao += 50;
        else if (vantagemNumerica >= 1) pontuacao += 30;
        else if (vantagemNumerica >= 0) pontuacao += 10;
        else pontuacao -= 50;
        
        if (objetivo?.tipo === 'conquistar3Continentes') {
          const continenteVizinho = Object.keys(continentes).find(cont => 
            continentes[cont].territorios.includes(vizinho)
          );
          if (continenteVizinho === objetivo.continente1 || continenteVizinho === objetivo.continente2) {
            pontuacao += 40;
          }
        }
        
        if (objetivo?.tipo === 'dominar24Territorios' || objetivo?.tipo === 'dominar16TerritoriosCom2Tropas') {
          pontuacao += 20;
        }
        
        const vizinhosDoVizinho = paisVizinho.vizinhos.filter(v => {
          const paisV = paises.find(p => p.nome === v);
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
    executarAtaqueIndividual(jogadorCPU, oportunidadesAtaque, 0, objetivo);
  } else {
    // Finalizar turno se não há mais oportunidades
    console.log(`🔄 CPU ${jogadorCPU.nome} finalizando turno após recalcular oportunidades...`);
    console.log(`📋 Territórios conquistados por ${jogadorCPU.nome} no final do turno:`, territoriosConquistadosNoTurno[jogadorCPU.nome] || []);
    io.emit('adicionarAoHistorico', `🔄 CPU ${jogadorCPU.nome} finalizando turno`);
    
    // Processar cartas da CPU ANTES de passar o turno
    processarCartasJogador(jogadorCPU.nome);
    
    passarTurno();
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
function calcularBonusTrocaCartas(cartasParaTrocar) {
  // Simular o cálculo de bônus baseado no tipo de troca
  // Na implementação real, isso seria baseado no número de trocas já realizadas
  numeroTrocasRealizadas++;
  const bonus = 2 + (numeroTrocasRealizadas * 2); // 4, 6, 8, 10, ...
  console.log(`💰 Calculando bônus de troca: troca #${numeroTrocasRealizadas} = ${bonus} tropas`);
  return bonus;
}

// Função para selecionar território estratégico para reforço
function selecionarTerritorioEstrategicoParaReforco(jogadorCPU, territoriosDoJogador) {
  const objetivo = objetivos[jogadorCPU.nome];
  console.log(`🎯 Selecionando território estratégico para CPU ${jogadorCPU.nome} - objetivo: ${objetivo?.tipo}`);
  
  // Priorizar territórios baseado no objetivo
  if (objetivo?.tipo === 'conquistar3Continentes') {
    // Reforçar territórios em continentes alvo
    const territorioPrioritario = territoriosDoJogador.find(territorio => {
      const continente = Object.keys(continentes).find(cont => 
        continentes[cont].territorios.includes(territorio.nome)
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
function processarCartasJogador(nomeJogador) {
  console.log(`🎴 Processando cartas para ${nomeJogador} - territórios conquistados:`, territoriosConquistadosNoTurno[nomeJogador] || []);
  
  if (territoriosConquistadosNoTurno[nomeJogador] && territoriosConquistadosNoTurno[nomeJogador].length > 0) {
    console.log(`🎴 ${nomeJogador} conquistou ${territoriosConquistadosNoTurno[nomeJogador].length} territórios neste turno`);
    
    // Inicializar cartas do jogador se não existir
    if (!cartasTerritorio[nomeJogador]) {
      cartasTerritorio[nomeJogador] = [];
    }
    
    // Verificar se o jogador já tem 5 cartas (máximo permitido)
    if (cartasTerritorio[nomeJogador].length >= 5) {
      io.emit('mostrarMensagem', `⚠️ ${nomeJogador} não pode receber mais cartas território (máximo 5)!`);
      console.log(`⚠️ ${nomeJogador} já tem ${cartasTerritorio[nomeJogador].length} cartas (máximo 5)`);
    } else {
      // Escolher um território aleatório dos conquistados para gerar a carta
      const territoriosConquistados = territoriosConquistadosNoTurno[nomeJogador];
      const territorioAleatorio = territoriosConquistados[Math.floor(Math.random() * territoriosConquistados.length)];
      const simbolo = mapeamentoTerritorioSimbolo[territorioAleatorio] || simbolosCartas[Math.floor(Math.random() * simbolosCartas.length)];
      
      // Criar carta com nome do território e símbolo
      const carta = {
        territorio: territorioAleatorio,
        simbolo: simbolo
      };
      
      cartasTerritorio[nomeJogador].push(carta);
      
      console.log(`🎴 ${nomeJogador} ganhou carta: ${territorioAleatorio} (${simbolo}) - Total: ${cartasTerritorio[nomeJogador].length} cartas`);
      io.emit('mostrarMensagem', `🎴 ${nomeJogador} ganhou uma carta território de ${territorioAleatorio} (${simbolo}) por conquistar territórios neste turno!`);
    }
  } else {
    console.log(`🎴 ${nomeJogador} não conquistou territórios neste turno`);
  }
  
  // Limpar territórios conquistados do jogador
  console.log(`🧹 Limpando territórios conquistados de ${nomeJogador}:`, territoriosConquistadosNoTurno[nomeJogador] || []);
  territoriosConquistadosNoTurno[nomeJogador] = [];
}

// Função para verificar se é turno de CPU
function verificarTurnoCPU() {
  const jogadorAtual = jogadores[indiceTurno];
  console.log(`🤖 Verificando turno de CPU: ${jogadorAtual.nome} - é CPU? ${jogadorAtual.isCPU}, ativo? ${jogadorAtual.ativo}`);
  
  if (jogadorAtual.isCPU && jogadorAtual.ativo) {
    console.log(`🤖 Iniciando turno da CPU ${jogadorAtual.nome}`);
    executarTurnoCPU(jogadorAtual);
  } else {
    console.log(`👤 Turno de jogador humano: ${jogadorAtual.nome}`);
  }
}

// Função para passar turno (modificada para incluir CPU)
function passarTurno() {
  indiceTurno = (indiceTurno + 1) % jogadores.length;
  
  // Pular jogadores eliminados
  while (!jogadores[indiceTurno].ativo) {
    indiceTurno = (indiceTurno + 1) % jogadores.length;
  }
  
  turno = jogadores[indiceTurno].nome;
  
  // Verificar se o jogador tem 5 ou mais cartas território e forçar troca ANTES de dar reforços
  const cartasJogador = cartasTerritorio[turno] || [];
  console.log(`🔄 Passando turno para ${turno} - cartas: ${cartasJogador.length}`);
  
  if (cartasJogador.length >= 5) {
    const jogadorAtual = jogadores.find(j => j.nome === turno);
    console.log(`⚠️ ${turno} tem ${cartasJogador.length} cartas - é CPU? ${jogadorAtual.isCPU}`);
    
    if (jogadorAtual.isCPU) {
      // CPU troca cartas automaticamente
      console.log(`🤖 CPU ${turno} forçada a trocar ${cartasJogador.length} cartas...`);
      const cartasParaTrocar = selecionarCartasInteligentesParaTroca(cartasJogador);
      
      if (cartasParaTrocar.length === 3) {
        // Remover as 3 cartas trocadas
        const cartasRestantes = cartasJogador.filter(carta => 
          !cartasParaTrocar.includes(carta.territorio)
        );
        cartasTerritorio[turno] = cartasRestantes;
        
        // Calcular bônus
        const bonusTroca = calcularBonusTrocaCartas(cartasParaTrocar);
        const territoriosDoJogador = paises.filter(p => p.dono === turno);
        
        // Distribuir tropas estrategicamente
        for (let i = 0; i < bonusTroca; i++) {
          if (territoriosDoJogador.length > 0) {
            const territorioEstrategico = selecionarTerritorioEstrategicoParaReforco(jogadorAtual, territoriosDoJogador);
            territorioEstrategico.tropas++;
            
            // Emitir efeito visual e som para todos os jogadores verem
            io.emit('mostrarEfeitoReforco', {
              territorio: territorioEstrategico.nome,
              jogador: turno
            });
            
            console.log(`🎯 CPU ${turno} reforçou ${territorioEstrategico.nome} com tropa de troca obrigatória (${territorioEstrategico.tropas} tropas)`);
          }
        }
        
        console.log(`✅ CPU ${turno} trocou cartas obrigatoriamente e recebeu ${bonusTroca} tropas`);
        io.emit('mostrarMensagem', `🤖 CPU ${turno} trocou 3 cartas território obrigatoriamente e recebeu ${bonusTroca} tropas extras!`);
        io.emit('adicionarAoHistorico', `🃏 CPU ${turno} trocou 3 cartas território obrigatoriamente (+${bonusTroca} tropas)`);
        io.emit('tocarSomTakeCard');
        
        // Continuar com o turno
        io.sockets.sockets.forEach((s) => {
          s.emit('estadoAtualizado', getEstado(s.id));
        });
      } else {
        console.log(`❌ CPU ${turno} não conseguiu selecionar 3 cartas para trocar`);
      }
    } else {
      // Jogador humano
      console.log(`👤 Jogador humano ${turno} precisa trocar cartas`);
      io.emit('mostrarMensagem', `⚠️ ${turno} tem ${cartasJogador.length} cartas território! É obrigatório trocar cartas antes de continuar.`);
      io.emit('forcarTrocaCartas', { jogador: turno, cartas: cartasJogador });
      return; // Não avança o turno até trocar as cartas
    }
  } else {
    console.log(`✅ ${turno} tem ${cartasJogador.length} cartas (não precisa trocar)`);
  }
  
  const resultadoReforco = calcularReforco(turno);
  tropasReforco = resultadoReforco.base;
  tropasBonusContinente = resultadoReforco.bonus;
  
  io.emit('mostrarMensagem', `🔄 Turno de ${turno}. Reforços: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
  
  io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
  });
  
  // Verificar se é turno de CPU
  verificarTurnoCPU();
}



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Inicializar o jogo quando o servidor iniciar
  inicializarJogo();
});