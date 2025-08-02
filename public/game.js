const config = {
  type: Phaser.AUTO,
  width: 1280, // resolução base
  height: 720,
  backgroundColor: '#1a1a1a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create
  }
};

const socket = io(); // conecta no servidor socket.io

const game = new Phaser.Game(config);

let paises = [];
let jogadores = [];
let turno = null;
let tropasReforco = 0;
let selecionado = null;
let meuNome = null;

let hudTexto;
let mensagemTexto;
let mensagemTimeout;
let botaoTurno;

let vitoria = false;
let derrota = false;

let overlay;
let textoVitoriaGrande;
let botaoReiniciar;

function preload() {
  this.load.image('mapa', 'assets/mapa.png');
}

function create() {
const largura = this.sys.game.config.width;
const altura = this.sys.game.config.height;

this.add.image(0, 0, 'mapa').setOrigin(0, 0).setDisplaySize(largura, altura);

  hudTexto = this.add.text(10, 10, '', {
    fontSize: '18px',
    fill: '#fff',
    backgroundColor: '#333',
    padding: { x: 10, y: 5 }
  });
  hudTexto.setDepth(5);

  mensagemTexto = this.add.text(10, 50, '', {
    fontSize: '16px',
    fill: '#fffa',
    backgroundColor: '#222',
    padding: { x: 10, y: 5 },
    wordWrap: { width: 780 }
  });
  mensagemTexto.setDepth(6);

  botaoTurno = this.add.text(650, 550, 'Encerrar Turno', {
    fontSize: '18px',
    fill: '#fff',
    backgroundColor: '#0077cc',
    padding: { x: 15, y: 10 },
    fontFamily: 'Arial',
  })
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => botaoTurno.setStyle({ backgroundColor: '#005fa3' }))
    .on('pointerout', () => botaoTurno.setStyle({ backgroundColor: '#0077cc' }))
    .on('pointerdown', () => {
      if (vitoria || derrota) return;
      socket.emit('passarTurno');
    });

  overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);
  overlay.setVisible(false);
  overlay.setDepth(10);

  textoVitoriaGrande = this.add.text(400, 300, '', {
    fontSize: '48px',
    fill: '#ffff00',
    fontStyle: 'bold',
    stroke: '#000',
    strokeThickness: 6,
    align: 'center',
    wordWrap: { width: 700 }
  }).setOrigin(0.5);
  textoVitoriaGrande.setVisible(false);
  textoVitoriaGrande.setDepth(11);

  botaoReiniciar = this.add.text(400, 450, 'Reiniciar Jogo', {
    fontSize: '28px',
    fill: '#fff',
    backgroundColor: '#1a1a1a',
    padding: { x: 20, y: 10 },
    fontFamily: 'Arial',
    align: 'center',
    stroke: '#000',
    strokeThickness: 4,
    borderRadius: 5
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoReiniciar.setVisible(false);
  botaoReiniciar.setDepth(12);
  botaoReiniciar.on('pointerover', () => botaoReiniciar.setStyle({ backgroundColor: '#005fa3' }));
  botaoReiniciar.on('pointerout', () => botaoReiniciar.setStyle({ backgroundColor: '#0077cc' }));
  botaoReiniciar.on('pointerdown', () => {
    if (vitoria || derrota) return;
    socket.emit('reiniciarJogo');
  });

  socket.on('estadoAtualizado', (estado) => {
    jogadores = estado.jogadores;
    turno = estado.turno;
    tropasReforco = estado.tropasReforco;
    vitoria = estado.vitoria;
    derrota = estado.derrota
    meuNome = estado.meuNome;

    atualizarPaises(estado.paises, this);
    atualizarHUD();

    const jogadorLocal = jogadores.find(j => j.nome === meuNome);

    if (!jogadorLocal.ativo) {
      perdeuJogo(`😞 Você perdeu!`);
      return;
    } else {
      desbloquearJogo();
    }

    if (vitoria) {
      bloquearJogo(`🏆 Jogador ${turno} venceu!`);
      return;
    } else {
      desbloquearJogo();
    }
  });

  socket.on('mostrarMensagem', (texto) => {
    mostrarMensagem(texto);
  });

  socket.on('vitoria', (nomeJogador) => {
    mostrarMensagem(`🏆 Jogador ${nomeJogador} venceu!`);
    bloquearJogo(`🏆 Jogador ${nomeJogador} venceu!`);
  });

  socket.on('derrota', () => {
    mostrarMensagem(`😞 Você perdeu!`);
    perdeuJogo(`😞 Você perdeu!`);
  });
}

function atualizarPaises(novosPaises, scene) {
  const dadosGeograficos = {
    "Brasil": {
      pontos: [411,437,411,476,414,504,426,528,455,519,456,500,477,469,465,453],
      textoX: 1140,
      textoY: 630
    },
    "Argentina": {
      pontos: [543,569, 553,585, 694,586, 685,576, 689,566, 696,585, 769,585, 778,576, 768,560, 560,560],
      textoX: 620,
      textoY: 575
    },
    "Estados Unidos": {
      pontos: [536,342, 537,366, 554,381, 583,375, 591,392, 638,380, 636,399, 650,424, 636,399, 640,381, 593,385, 604,383, 607,345, 595,333, 597,314, 597,332, 624,343, 650,336, 643,316, 612,320, 594,303, 564,309],
      textoX: 590,
      textoY: 360
    },
    "Canadá": {
      pontos: [1123,73, 1150,69, 1162,78, 1251,78, 1263,67, 1266,44, 1260,28, 1250,21, 1164,21, 1128,35],
      textoX: 1180,
      textoY: 55
    }
  };

  if (paises.length === 0) {
    paises = novosPaises.map(pais => {
      const obj = { ...pais };

      const geo = dadosGeograficos[pais.nome];
      if (!geo) {
        console.warn(`Dados geográficos ausentes para ${pais.nome}`);
        return obj;
      }

      obj.polygon = scene.add.polygon(0, 0, geo.pontos, 0xffffff, 0.1);
      obj.polygon.setOrigin(0, 0);
      obj.polygon.setInteractive({ useHandCursor: true });

      obj.text = scene.add.text(geo.textoX, geo.textoY, getTextoPais(pais), {
        fontSize: '14px',
        fill: '#fff',
        align: 'center',
        wordWrap: { width: 80 },
        backgroundColor: '#00000033',
        padding: { x: 4, y: 2 }
      });

      obj.polygon.on('pointerdown', () => {
        if (vitoria || derrota) return;
        if (tropasReforco > 0 && obj.dono === turno) {
          socket.emit('colocarReforco', obj.nome);
          return;
        }

        if (obj.dono !== turno && !selecionado) {
          mostrarMensagem("Você só pode selecionar territórios seus no começo da jogada.");
          return;
        }

        if (!selecionado) {
          selecionado = obj;
          obj.polygon.setFillStyle(0xffff00, 0.3);
          mostrarMensagem(`País selecionado: ${obj.nome}`);
        } else if (selecionado === obj) {
          obj.polygon.setFillStyle(0xffffff, 0.1);
          selecionado = null;
          mostrarMensagem('Seleção cancelada');
        } else {
          if (!selecionado.vizinhos.includes(obj.nome)) {
            mostrarMensagem(`${obj.nome} não é vizinho de ${selecionado.nome}.`);
            return;
          }
          if (obj.dono === selecionado.dono) {
            mostrarMensagem("Você não pode atacar um território seu.");
            return;
          }
          if (selecionado.tropas <= 1) {
            mostrarMensagem("Você precisa de mais de 1 tropa para atacar.");
            return;
          }
          socket.emit('atacar', { de: selecionado.nome, para: obj.nome });
          limparSelecao();
        }
      });

      return obj;
    });
  }


  for (let i = 0; i < paises.length; i++) {
    paises[i].dono = novosPaises[i].dono;
    paises[i].tropas = novosPaises[i].tropas;
    paises[i].vizinhos = novosPaises[i].vizinhos;
    paises[i].text.setText(getTextoPais(paises[i]));
    paises[i].circle.setFillStyle(0xffffff, 0.1);
  }
  selecionado = null;
}

function getTextoPais(pais) {
  return `${pais.nome}\n${pais.tropas} tropas\n(${pais.dono})`;
}

function atualizarHUD() {
  const tropas = paises
    .filter(p => p.dono === turno)
    .reduce((soma, p) => soma + p.tropas, 0);

  let jogadorHUD = `🧍 Você: ${meuNome || '?'}\n`;
  hudTexto.setText(`${jogadorHUD}🎮 Turno: ${turno}   🛡️ Tropas totais: ${tropas}   🆘 Reforço restante: ${tropasReforco}`);
}

function limparSelecao() {
  paises.forEach(p => p.circle.setFillStyle(0xffffff, 0.1));
  selecionado = null;
}

function mostrarMensagem(texto) {
  if (mensagemTimeout) clearTimeout(mensagemTimeout);
  mensagemTexto.setText(texto);
  mensagemTimeout = setTimeout(() => {
    mensagemTexto.setText('');
  }, 4000);
}

function bloquearJogo(mensagem) {
  botaoTurno.disableInteractive();
  botaoTurno.setStyle({ backgroundColor: '#555' });
  paises.forEach(pais => pais.circle.disableInteractive());
  overlay.setVisible(true);
  textoVitoriaGrande.setText(mensagem);
  textoVitoriaGrande.setVisible(true);
  botaoReiniciar.setVisible(true);
}

function perdeuJogo(mensagem) {
  botaoTurno.disableInteractive();
  botaoTurno.setStyle({ backgroundColor: '#555' });
  paises.forEach(pais => pais.circle.disableInteractive());
  overlay.setVisible(true);
  textoVitoriaGrande.setText(mensagem);
  textoVitoriaGrande.setVisible(true);
  botaoReiniciar.setVisible(false);
}

function desbloquearJogo() {
  botaoTurno.setInteractive({ useHandCursor: true });
  botaoTurno.setStyle({ backgroundColor: '#0077cc' });
  paises.forEach(pais => pais.circle.setInteractive({ useHandCursor: true }));
  overlay.setVisible(false);
  textoVitoriaGrande.setVisible(false);
  botaoReiniciar.setVisible(false);
}
