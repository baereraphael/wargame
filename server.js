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

let paises = [
  { nome: 'Emberlyn', x: 190, y: 170, dono: 'Azul', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
  { nome: 'Ravenspire', x: 260, y: 160, dono: 'Vermelho', tropas: 5, vizinhos: ['Emberlyn','Duskwatch', 'Stormhall'] },
  { nome: 'Stonevale', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: ['Valdoria', 'Cindervale'] },
  { nome: 'Duskwatch', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Emberlyn', 'Stormhall'] },
  { nome: 'Stormhall', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne'] },
  { nome: 'Redwyn', x: 190, y: 170, dono: 'Preto', tropas: 5, vizinhos: ['Stonevale', 'Ravenspire', 'Duskwatch'] },
  { nome: 'Stormfen', x: 260, y: 160, dono: 'Roxo', tropas: 5, vizinhos: ['Valdoria', 'Ashbourne'] },
  { nome: 'Highmoor', x: 100, y: 170, dono: 'Amarelo', tropas: 5, vizinhos: ['Valdoria', 'Cindervale'] },
  { nome: 'Cragstone', x: 125, y: 295, dono: 'Verde', tropas: 5, vizinhos: ['Northgard', 'Ironcliff'] },
  { nome: 'Hollowspire', x: 180, y: 305, dono: 'Preto', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne'] },
  { nome: 'Westreach', x: 125, y: 295, dono: 'Roxo', tropas: 5, vizinhos: ['Northgard', 'Ironcliff'] },
  { nome: 'Barrowfell', x: 180, y: 305, dono: 'Azul', tropas: 5, vizinhos: ['Cindervale', 'Ashbourne'] }
];

let tropasReforco = calcularReforco(turno);

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
    if (tropasReforco <= 0) return;

    const pais = paises.find(p => p.nome === nomePais);
    if (!pais || pais.dono !== turno) return;

    pais.tropas += 1;
    tropasReforco -= 1;
    io.emit('mostrarMensagem', `${turno} colocou 1 tropa em ${nomePais}. Reforços restantes: ${tropasReforco}`);

        io.sockets.sockets.forEach((s) => {
    s.emit('estadoAtualizado', getEstado(s.id));
    });

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
    tropasReforco = calcularReforco(turno);
    io.emit('mostrarMensagem', `Agora é a vez do jogador ${turno}`);
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

    paises = [
      { nome: 'País A', x: 200, y: 200, dono: 'Azul', tropas: 5, vizinhos: ['País B'] },
      { nome: 'País B', x: 400, y: 300, dono: 'Vermelho', tropas: 4, vizinhos: ['País A', 'País C'] },
      { nome: 'País C', x: 600, y: 200, dono: 'Verde', tropas: 3, vizinhos: ['País B'] }
    ];

    tropasReforco = calcularReforco(turno);
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
  });
});

function getEstado(socketId = null) {
  let meuNome = null;
  if (socketId) {
    const jogador = jogadores.find(j => j.socketId === socketId);
    if (jogador) meuNome = jogador.nome;
  }

  return {
    jogadores,
    turno,
    paises,
    tropasReforco,
    vitoria,
    derrota,
    meuNome
  };
}

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function calcularReforco(turnoAtual) {
  const territorios = paises.filter(p => p.dono === turnoAtual).length;
  return Math.max(3, Math.floor(territorios / 2));
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
        tropasReforco = calcularReforco(turno);
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});