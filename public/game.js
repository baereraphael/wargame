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

  botaoTurno = this.add.text(0, 0, 'Encerrar Turno', {
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

  posicionarBotao(this);

  // Atualiza posição quando o tamanho da tela muda
  this.scale.on('resize', () => {
    posicionarBotao(this);
  });


function posicionarBotao(scene) {
  const largura = scene.scale.width;
  const altura = scene.scale.height;
  botaoTurno.setPosition(
    largura - botaoTurno.width - 20,
    altura - botaoTurno.height - 20
  );
}

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
const coresDosDonos = {
  Azul: 0x3366ff,
  Vermelho: 0xff3333,
  Amarelo: 0xffcc00,
  Verde: 0x33cc33,
  Roxo: 0x9933cc,
  Preto: 0x222222
};
const dadosGeograficos = {
  "Emberlyn": {
    pontos: [402,396,370,405,359,437,368,460,396,459,440,426,434,413,419,406],
    textoX: 190,
    textoY: 170
  },
  "Ravenspire": {
    pontos: [463,450,494,454,521,466,526,474,509,482,497,487,490,509,486,528,466,538,451,546,444,562,430,573,420,593,402,579,408,502,397,458,436,427,453,430,461,439],
    textoX: 260,
    textoY: 160
  },
  "Stonevale": {
    pontos: [356,404,348,411,341,414,330,414,320,414,304,427,293,442,292,456,367,459,359,437,370,407,361,406],
    textoX: 100,
    textoY: 170
  },
  "Duskwatch": {
    pontos: [293,454,395,458,401,468,402,482,404,489,409,498,409,509,407,526,405,545,404,563,403,573,322,582,326,569,328,559,332,546,330,535,332,523,326,518,315,514,308,509,299,495,288,488,279,479,279,468,292,460],
    textoX: 125,
    textoY: 295
  },
  "Stormhall": {
    pontos: [325,581,323,600,332,615,330,626,334,635,343,652,356,665,383,671,386,662,369,656,367,640,378,627,377,613,397,602,408,599,401,572],
    textoX: 180,
    textoY: 305
  },
    "Redwyn": {
    pontos: [111,194,194,141,176,136,162,131,149,133,139,127,129,121,118,119,110,119,114,132,106,138,96,147,93,156,83,161,75,168,67,176,73,181,72,198,77,207],
    textoX: 180,
    textoY: 305
  },
    "Stormfen": {
    pontos: [111,194,194,141,206,132,207,122,207,114,219,115,233,116,248,119,265,125,273,132,274,142,283,151,302,151,307,162],
    textoX: 180,
    textoY: 305
  },
    "Highmoor": {
    pontos: [305,165,252,223,345,279,358,279,373,279,384,279,378,268,373,257,364,253,366,236,370,223,386,215,380,203,370,198,360,189,349,182,336,168,322,163],
    textoX: 180,
    textoY: 305
  },
    "Cragstone": {
    pontos: [127,264,252,223,306,163,111,194,109,218,110,228,102,237,108,246],
    textoX: 180,
    textoY: 305
  },
    "Hollowspire": {
    pontos: [253,222,160,340,152,335,145,328,133,324,128,311,128,301,125,295,134,287,129,279,128,266],
    textoX: 180,
    textoY: 305
  },
    "Westreach": {
    pontos: [160,340,192,303,224,258,253,225,284,243,302,255,345,281,341,300,331,309,316,330,315,348,322,363,328,372,351,373,364,374,366,382,354,382,342,382,332,380,316,378,307,371,305,356,297,349,288,340,275,338,262,339],
    textoX: 180,
    textoY: 305
  },
    "Barrowfell": {
    pontos: [161,343,167,359,176,370,192,378,195,391,213,406,231,405,247,415,261,421,276,428,281,434,292,442,302,428,289,425,282,417,275,406,273,393,255,393,247,392,239,385,241,373,250,357,265,339,160,340],
    textoX: 180,
    textoY: 305
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

      const pontos = geo.pontos;
      let somaX = 0;
      let somaY = 0;
      for (let i = 0; i < pontos.length; i += 2) {
        somaX += pontos[i];
        somaY += pontos[i + 1];
      }
      const centroX = somaX / (pontos.length / 2);
      const centroY = somaY / (pontos.length / 2);

  // Encontrar minX e minY
let minX = Infinity;
let minY = Infinity;
for (let i = 0; i < pontos.length; i += 2) {
  if (pontos[i] < minX) minX = pontos[i];
  if (pontos[i + 1] < minY) minY = pontos[i + 1];
}

// Ajustar pontos relativos ao canto superior esquerdo (minX, minY)
const pontosRelativos = [];
for (let i = 0; i < pontos.length; i += 2) {
  pontosRelativos.push(pontos[i] - minX);
  pontosRelativos.push(pontos[i + 1] - minY);
}

// Criar o polígono na posição (minX, minY)
obj.polygon = scene.add.polygon(minX, minY, pontosRelativos, 0xffffff, 0.1);
obj.polygon.setOrigin(0, 0); // origem no canto superior esquerdo
      obj.polygon.setInteractive({ useHandCursor: true });

    obj.text = scene.add.text(centroX, centroY, getTextoPais(pais), {
        fontSize: '14px',
        fill: '#fff',
        align: 'center',
        wordWrap: { width: 80 },
        backgroundColor: '#00000033',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

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
          obj.polygon.setFillStyle(coresDosDonos[obj.dono], 1); // usa alpha baixo se quiser estilo antigo
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
const coresDosDonos = {
  Azul: 0x3366ff,
  Vermelho: 0xff3333,
  Amarelo: 0xffcc00,
  Verde: 0x33cc33,
  Roxo: 0x9933cc,
  Preto: 0x222222
};

    paises[i].dono = novosPaises[i].dono;
    paises[i].tropas = novosPaises[i].tropas;
    paises[i].vizinhos = novosPaises[i].vizinhos;
    paises[i].text.setText(getTextoPais(paises[i]));
    paises[i].polygon.setFillStyle(coresDosDonos[paises[i].dono] , 0.7);
    paises[i].polygon.setStrokeStyle(4, 0x000000, 1);
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
  paises.forEach(p => p.polygon.setFillStyle(0xffffff, 0.1));
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
  paises.forEach(pais => pais.polygon.disableInteractive());
  overlay.setVisible(true);
  textoVitoriaGrande.setText(mensagem);
  textoVitoriaGrande.setVisible(true);
  botaoReiniciar.setVisible(true);
}

function perdeuJogo(mensagem) {
  botaoTurno.disableInteractive();
  botaoTurno.setStyle({ backgroundColor: '#555' });
  paises.forEach(pais => pais.polygon.disableInteractive());
  overlay.setVisible(true);
  textoVitoriaGrande.setText(mensagem);
  textoVitoriaGrande.setVisible(true);
  botaoReiniciar.setVisible(false);
}

function desbloquearJogo() {
  botaoTurno.setInteractive({ useHandCursor: true });
  botaoTurno.setStyle({ backgroundColor: '#0077cc' });
  paises.forEach(pais => pais.polygon.setInteractive({ useHandCursor: true }));
  overlay.setVisible(false);
  textoVitoriaGrande.setVisible(false);
  botaoReiniciar.setVisible(false);
}
