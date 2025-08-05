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
  { nome: 'Emberlyn', x: 402, y: 396, dono: 'Azul', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
  { nome: 'Ravenspire', x: 450, y: 500, dono: 'Vermelho', tropas: 5, vizinhos: ['Emberlyn','Duskwatch', 'Stormhall','Zul\'Marak'] },
  { nome: 'Stonevale', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: ['Emberlyn', 'Duskwatch',`Barrowfell`] },
  { nome: 'Duskwatch', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Emberlyn', 'Stormhall'] },
  { nome: 'Stormhall', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne','Duskwatch'] },
  { nome: 'Redwyn', x: 220, y: 140, dono: 'Preto', tropas: 5, vizinhos: ['Stormfen', 'Cragstone', 'Omradan'] },
  { nome: 'Stormfen', x: 300, y: 180, dono: 'Roxo', tropas: 5, vizinhos: ['Redwyn', 'Cragstone',`Frosthollow`] },
  { nome: 'Highmoor', x: 80, y: 200, dono: 'Amarelo', tropas: 5, vizinhos: [`Frosthollow`, 'Cragstone','Westreach'] },
  { nome: 'Cragstone', x: 150, y: 320, dono: 'Verde', tropas: 5, vizinhos: ['Stormfen', 'Highmoor','Hollowspire'] },
  { nome: 'Hollowspire', x: 200, y: 340, dono: 'Preto', tropas: 5, vizinhos: ['Cragstone', 'Westreach'] },
  { nome: 'Westreach', x: 160, y: 350, dono: 'Roxo', tropas: 5, vizinhos: ['Hollowspire', 'Barrowfell','Highmoor'] },
  { nome: 'Barrowfell', x: 140, y: 280, dono: 'Azul', tropas: 5, vizinhos: ['Hollowspire', 'Westreach','Stonevale'] },
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
    console.log(`Jogador ${jogadorDisponivel.nome} atribuído ao socket ${socket.id}`);
  } else {
    console.log('Não há jogadores disponíveis para atribuir a este socket.');
  }

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
    }

    io.emit('mostrarMensagem', resultadoMensagem.trim());
    io.emit('tocarSomTiro'); // Emitir evento para tocar som de tiro
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
    
    // Verificar se o jogador conquistou territórios neste turno e conceder carta
    if (territoriosConquistadosNoTurno[turno] && territoriosConquistadosNoTurno[turno].length > 0) {
      // Inicializar cartas do jogador se não existir
      if (!cartasTerritorio[turno]) {
        cartasTerritorio[turno] = [];
      }
      
      // Escolher símbolo aleatório para a carta
      const simboloAleatorio = simbolosCartas[Math.floor(Math.random() * simbolosCartas.length)];
      cartasTerritorio[turno].push(simboloAleatorio);
      
      io.emit('mostrarMensagem', `🎴 ${turno} ganhou uma carta território (${simboloAleatorio}) por conquistar territórios neste turno!`);
    }
    
    // Limpar territórios conquistados do turno atual
    territoriosConquistadosNoTurno[turno] = [];
    
    // Limpar o controle de movimentos do jogador atual
    if (movimentosRemanejamento[turno]) {
      delete movimentosRemanejamento[turno];
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
    
    // Verificar se o jogador tem 5 cartas território e forçar troca
    const cartasJogador = cartasTerritorio[turno] || [];
    if (cartasJogador.length >= 5) {
      io.emit('mostrarMensagem', `⚠️ ${turno} tem ${cartasJogador.length} cartas território! É obrigatório trocar cartas antes de continuar.`);
      io.emit('forcarTrocaCartas', { jogador: turno, cartas: cartasJogador });
      return; // Não avança o turno até trocar as cartas
    }
    
    const resultadoReforco = calcularReforco(turno);
    tropasReforco = resultadoReforco.base;
    tropasBonusContinente = resultadoReforco.bonus;

    io.emit('mostrarMensagem', `🎮 Turno de ${turno}. Reforços: ${tropasReforco} base + ${Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0)} bônus`);
    io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
    });

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
    const cartasValidas = cartasSelecionadas.every(carta => cartas.includes(carta));
    if (!cartasValidas) {
      socket.emit('resultadoTrocaCartas', { sucesso: false, mensagem: 'Cartas inválidas selecionadas!' });
      return;
    }

    // Verificar regras de troca: 3 iguais ou 3 diferentes (incluindo coringa)
    const simbolosUnicos = [...new Set(cartasSelecionadas)];
    const temCoringa = cartasSelecionadas.includes('★');
    
    let podeTrocar = false;
    
    if (temCoringa) {
      // Se tem coringa, verificar se as outras cartas são válidas
      const cartasSemCoringa = cartasSelecionadas.filter(carta => carta !== '★');
      const simbolosSemCoringa = [...new Set(cartasSemCoringa)];
      
      if (cartasSemCoringa.length === 2) {
        // 2 cartas + 1 coringa: pode ser 2 iguais ou 2 diferentes
        podeTrocar = simbolosSemCoringa.length === 1 || simbolosSemCoringa.length === 2;
      } else if (cartasSemCoringa.length === 1) {
        // 1 carta + 2 coringas: sempre válido
        podeTrocar = true;
      } else if (cartasSemCoringa.length === 0) {
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
    cartasSelecionadas.forEach(carta => {
      const index = cartas.indexOf(carta);
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
      const cartasSemCoringa = cartasSelecionadas.filter(carta => carta !== '★');
      const simbolosSemCoringa = [...new Set(cartasSemCoringa)];
      tipoTroca = simbolosSemCoringa.length === 1 ? 'mesmo símbolo' : 'símbolos diferentes';
    } else {
      tipoTroca = simbolosUnicos.length === 1 ? 'mesmo símbolo' : 'símbolos diferentes';
    }
    
    io.emit('mostrarMensagem', `🎴 ${jogador.nome} trocou 3 cartas de ${tipoTroca} (${cartasSelecionadas.join(', ')}) e recebeu ${bonusTroca} exércitos bônus!`);
    
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
  if (!objetivo) return false;
  
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
      
      return temContinente1 && temContinente2 && temTerceiroContinente;
      
    case 'eliminarJogador':
      const jogadorAlvo = jogadores.find(j => j.nome === objetivo.jogadorAlvo);
      return !jogadorAlvo || !jogadorAlvo.ativo;
      
    case 'dominar24Territorios':
      const territoriosDominados = paises.filter(p => p.dono === jogador).length;
      return territoriosDominados >= 24;
      
    case 'dominar16TerritoriosCom2Tropas':
      const territoriosCom2Tropas = paises.filter(p => p.dono === jogador && p.tropas >= 2).length;
      return territoriosCom2Tropas >= 16;
  }
  
  return false;
}

function checarVitoria() {
  // Verificar vitória por eliminação
  const ativos = jogadores.filter(j => j.ativo);
  if (ativos.length === 1) {
    vitoria = true;
    io.emit('vitoria', ativos[0].nome);
    return;
  }
  
  // Verificar vitória por objetivo
  for (const jogador of jogadores) {
    if (jogador.ativo && verificarObjetivo(jogador.nome)) {
      vitoria = true;
      io.emit('vitoria', jogador.nome);
      return;
    }
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
    pais.tropas += 0; // Changed from 2 to 0 to start with 1 troop
  });

  // Gerar objetivos para cada jogador
  jogadores.forEach(jogador => {
    objetivos[jogador.nome] = gerarObjetivoAleatorio(jogador.nome);
  });

  indiceTurno = 0;
  turno = jogadores[indiceTurno].nome;
  vitoria = false;
  derrota = false;
  
  // Limpar cartas território e territórios conquistados
  cartasTerritorio = {};
  territoriosConquistadosNoTurno = {};
  numeroTrocasRealizadas = 0; // Resetar contador de trocas
  
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