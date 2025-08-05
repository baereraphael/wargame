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
let tropasBonusContinente = {}; // Track bonus troops by continent
let selecionado = null;
let meuNome = null;
let continentes = {};
let continentePrioritario = null; // Continente com prioridade para reforço
let faseRemanejamento = false; // Controla se está na fase de remanejamento
let hudVisivel = true; // Track HUD visibility
let cartasTerritorio = {}; // Cartas território do jogador

let hudTexto;
let mensagemTexto;
let mensagemTimeout;
let botaoTurno;

let vitoria = false;
let derrota = false;

let overlay;
let textoVitoriaGrande;
let botaoReiniciar;

// Variáveis para sons
let somTiro;
let somMovimento;
let somClick;
let somHuh;

// Variáveis para interface de reforço
let interfaceReforco = null;
let tropasParaColocar = 0;
let territorioSelecionadoParaReforco = null;

// Variáveis para interface de transferência após conquista
let interfaceTransferenciaConquista = null;
let tropasParaTransferir = 0;
let dadosConquista = null;
let botaoObjetivo = null;
let modalObjetivoAberto = false;
let botaoCartasTerritorio = null;
let modalCartasTerritorioAberto = false;

function preload() {
  this.load.image('mapa', 'assets/mapa.png');
  this.load.audio('shotsfired', 'assets/shotsfired.mp3');
  this.load.audio('armymoving', 'assets/armymoving.mp3');
  this.load.audio('clicksound', 'assets/clicksound.mp3');
  this.load.audio('huh', 'assets/huh.mp3');
}

function create() {
const largura = this.sys.game.config.width;
const altura = this.sys.game.config.height;

this.add.image(0, 0, 'mapa').setOrigin(0, 0).setDisplaySize(largura, altura);

  // Criar sons
  somTiro = this.sound.add('shotsfired');
  somMovimento = this.sound.add('armymoving');
  somClick = this.sound.add('clicksound');
  somHuh = this.sound.add('huh');

  // Adicionar indicadores de continentes (será chamado após os territórios serem carregados)

  hudTexto = this.add.text(10, 10, '', {
    fontSize: '18px',
    fill: '#fff',
    backgroundColor: '#333',
    padding: { x: 10, y: 5 }
  });
  hudTexto.setDepth(5);

  // HUD toggle button
  const hudToggleButton = this.add.text(10, 200, '👁️ Ocultar HUD', {
    fontSize: '16px',
    fill: '#fff',
    backgroundColor: '#555',
    padding: { x: 8, y: 4 }
  })
  .setInteractive({ useHandCursor: true })
  .on('pointerdown', () => {
    tocarSomClick();
    hudVisivel = !hudVisivel;
    hudTexto.setVisible(hudVisivel);
    hudToggleButton.setText(hudVisivel ? '👁️ Ocultar HUD' : '👁️ Mostrar HUD');
  });
  hudToggleButton.setDepth(5);

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
      tocarSomClick();
      socket.emit('passarTurno');
    });

  // Botão de objetivo
  botaoObjetivo = this.add.text(0, 0, '🎯 Objetivo', {
    fontSize: '16px',
    fill: '#fff',
    backgroundColor: '#9933cc',
    padding: { x: 10, y: 5 },
    fontFamily: 'Arial',
  })
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => botaoObjetivo.setStyle({ backgroundColor: '#7a2a9e' }))
    .on('pointerout', () => botaoObjetivo.setStyle({ backgroundColor: '#9933cc' }))
    .on('pointerdown', () => {
      if (modalObjetivoAberto) return; // Previne múltiplos modais
      tocarSomClick();
      socket.emit('consultarObjetivo');
    });

  // Botão de cartas território
  botaoCartasTerritorio = this.add.text(0, 0, '🎴 Cartas Território', {
    fontSize: '16px',
    fill: '#fff',
    backgroundColor: '#cc6633',
    padding: { x: 10, y: 5 },
    fontFamily: 'Arial',
  })
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => botaoCartasTerritorio.setStyle({ backgroundColor: '#a55229' }))
    .on('pointerout', () => botaoCartasTerritorio.setStyle({ backgroundColor: '#cc6633' }))
    .on('pointerdown', () => {
      if (modalCartasTerritorioAberto) return; // Previne múltiplos modais
      tocarSomClick();
      socket.emit('consultarCartasTerritorio');
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
  botaoObjetivo.setPosition(
    largura - botaoObjetivo.width - 20,
    altura - botaoTurno.height - botaoObjetivo.height - 30
  );
  botaoCartasTerritorio.setPosition(
    largura - botaoCartasTerritorio.width - 20,
    altura - botaoTurno.height - botaoObjetivo.height - botaoCartasTerritorio.height - 40
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
    tocarSomClick();
    socket.emit('reiniciarJogo');
  });
   
       // DEBUG: Detectar cliques fora dos territórios
    this.input.on('pointerdown', (pointer) => {
      // Verificar se o clique foi em algum território
      const territorioClicado = paises.find(pais => {
        if (pais.polygon && pais.polygon.getBounds()) {
          return pais.polygon.getBounds().contains(pointer.x, pointer.y);
        }
        return false;
      });
      
      if (!territorioClicado) {
        console.log(`DEBUG: Clique fora de territórios em (${pointer.x}, ${pointer.y})`);
      }
      
      // Verificar se o clique foi em algum elemento interativo das interfaces
      let cliqueEmInterface = false;
      
      if (interfaceReforco) {
        const localX = pointer.x - interfaceReforco.x;
        const localY = pointer.y - interfaceReforco.y;
        if (localX >= -100 && localX <= 100 && localY >= -60 && localY <= 60) {
          cliqueEmInterface = true;
        }
      }
      
      if (interfaceTransferenciaConquista) {
        const localX = pointer.x - interfaceTransferenciaConquista.x;
        const localY = pointer.y - interfaceTransferenciaConquista.y;
        // Aumentar a área de detecção para incluir todos os botões
        if (localX >= -150 && localX <= 150 && localY >= -90 && localY <= 90) {
          cliqueEmInterface = true;
          console.log('DEBUG: Clique detectado dentro da interface de transferência');
        }
      }
      
      // Se clicou em uma interface, não fazer nada mais
      if (cliqueEmInterface) {
        return;
      }
      
      // Remover a funcionalidade de esconder interfaces ao clicar fora
      // As interfaces agora só podem ser fechadas pelos seus próprios botões
    });

  socket.on('estadoAtualizado', (estado) => {
    jogadores = estado.jogadores;
    turno = estado.turno;
    tropasReforco = estado.tropasReforco;
    tropasBonusContinente = estado.tropasBonusContinente || {};
    vitoria = estado.vitoria;
    derrota = estado.derrota
    meuNome = estado.meuNome;
    continentes = estado.continentes || {};
    continentePrioritario = estado.continentePrioritario || null;
    faseRemanejamento = estado.faseRemanejamento || false;
    cartasTerritorio = estado.cartasTerritorio || {};

    atualizarPaises(estado.paises, this);
    atualizarHUD();
    atualizarTextoBotaoTurno();

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

  socket.on('tocarSomTiro', () => {
    tocarSomTiro();
  });

  socket.on('tocarSomMovimento', () => {
    tocarSomMovimento();
  });

  socket.on('territorioConquistado', (dados) => {
    console.log('DEBUG: Recebido territorioConquistado, dados =', dados);
    // Só mostrar a interface para o jogador atacante
    if (dados.jogadorAtacante === meuNome) {
      dadosConquista = dados;
      console.log('DEBUG: dadosConquista definido como', dadosConquista);
      mostrarInterfaceTransferenciaConquista(dados, this);
    }
  });

  socket.on('mostrarObjetivo', (objetivo) => {
    mostrarObjetivo(objetivo, this);
  });

  socket.on('mostrarCartasTerritorio', (cartas) => {
    // Não abrir se já estiver aberto
    if (modalCartasTerritorioAberto) return;
    mostrarCartasTerritorio(cartas, this);
  });

  socket.on('forcarTrocaCartas', (dados) => {
    // Só mostrar para o jogador específico
    const jogador = jogadores.find(j => j.socketId === socket.id);
    if (jogador && jogador.nome === dados.jogador) {
      mostrarCartasTerritorio(dados.cartas, this, true);
    }
  });

  socket.on('resultadoTrocaCartas', (resultado) => {
    if (resultado.sucesso) {
      mostrarMensagem(resultado.mensagem);
      // Fechar modal e continuar o turno
      modalCartasTerritorioAberto = false;
      // Destruir elementos do modal se existirem
      const overlay = this.children.list.find(child => child.type === 'Rectangle' && child.depth === 20);
      const container = this.children.list.find(child => child.type === 'Container' && child.depth === 21);
      if (overlay) overlay.destroy();
      if (container) container.destroy();
    } else {
      mostrarMensagem(`❌ ${resultado.mensagem}`);
    }
  });

  socket.on('iniciarFaseRemanejamento', () => {
    mostrarMensagem('🔄 Fase de remanejamento iniciada. Clique em um território para mover tropas.');
  });

  socket.on('resultadoVerificacaoMovimento', (resultado) => {
    if (resultado.podeMover) {
      // Encontrar os territórios selecionados
      const territorioOrigem = paises.find(p => p.nome === selecionado.nome);
      // Encontrar o território de destino que foi clicado
      const territorioDestino = paises.find(p => p.nome === resultado.destino);
      
      if (territorioOrigem && territorioDestino) {
        mostrarInterfaceRemanejamento(territorioOrigem, territorioDestino, this, resultado.quantidadeMaxima);
      }
    } else {
      mostrarMensagem(`❌ ${resultado.motivo}`);
      limparSelecao();
    }
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
    textoX: 680,
    textoY: 350
  },
  "Ravenspire": {
    pontos: [463,450,494,454,521,466,526,474,509,482,497,487,490,509,486,528,466,538,451,546,444,562,430,573,420,593,402,579,408,502,397,458,436,427,453,430,461,439],
    textoX: 463,
    textoY: 450
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
    textoX: 463,
    textoY: 450
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
  },
  "Zul'Marak": {
    pontos: [527,367,537,354,549,345,563,336,574,337,583,324,582,311,596,312,606,315,618,317,631,312,640,321,650,323,660,303,663,317,663,325,662,334,662,341,661,349,661,362,658,385,656,394,621,436,601,438,589,440,582,441,573,441,566,444,555,442,551,428,541,424,530,421,527,415,523,392,530,380],
    textoX: 540,
    textoY: 380
  },
  "Emberwaste": {
    pontos: [663,354,658,306,680,315,688,315,695,312,703,313,712,313,715,319,727,317,733,310,738,301,748,297,759,297,764,306,768,314,771,320,774,329,779,337,782,343,775,350,775,351,774,353,763,360,747,369,734,374,712,389,696,403,681,417,664,433,648,451,637,467,631,468,626,459,634,449,625,444,615,440,625,431,629,424,637,417,645,408,655,398,654,402],
    textoX: 680,
    textoY: 350
  },
  "Sunjara": {
    pontos: [783,341,792,347,800,358,806,365,805,378,799,380,792,383,789,390,801,397,811,396,825,400,819,408,810,414,807,420,803,436,789,443,781,449,767,457,759,460,753,470,742,467,732,463,722,462,714,459,698,454,686,449,677,444,670,440,664,428,703,398,731,373,757,363,773,353],
    textoX: 800,
    textoY: 400
  },
  "Tharkuun": {
    pontos: [625,466,638,457,646,453,653,443,665,433,672,442,686,450,696,454,707,459,707,469,704,478,700,486,698,493,695,503,693,515,690,529,689,537,685,549,684,560,681,570,680,576,677,584,670,582,664,573,658,560,653,555,648,540,639,532,632,514,639,506,645,495,637,479],
    textoX: 650,
    textoY: 500
  },
  "Bareshi": {
    pontos: [706,456,726,461,742,465,754,471,758,485,763,498,760,511,750,517,741,526,738,537,738,548,725,554,717,566,708,576,692,581,679,585,683,561,688,536,695,506,698,489,706,474],
    textoX: 720,
    textoY: 520
  },
     "Oru'Kai": {
     pontos: [809,494,810,508,804,517,802,530,794,541,777,547,775,535,780,523,781,512,793,506,801,501],
     textoX: 800,
     textoY: 510
   },
   "Frosthollow": {
     pontos: [310,112,328,106,344,109,356,102,367,90,382,87,395,81,409,72,426,67,444,61,460,72,478,73,492,76,509,77,522,81,515,89,503,101,489,105,482,114,477,124,466,128,456,130,449,139,451,146,442,150,435,155,433,163,429,170,422,179,422,188,419,197,412,199,403,191,395,177,384,174,373,171,367,163,359,164,348,161,338,150,341,135,327,124,316,119],
     textoX: 400,
     textoY: 130
   },
   "Eldoria": {
     pontos: [508,130,517,139,525,147,529,161,533,173,531,183,524,194,520,206,516,215,511,222,505,231,499,241,490,232,481,227,473,241,467,248,461,249,450,249,441,241,437,224,436,212,447,211,463,199,459,185,470,176,479,172,483,161,491,157,492,140],
     textoX: 500,
     textoY: 180
   },
   "Greymoor": {
     pontos: [525,193,534,200,540,211,548,221,554,230,556,242,550,253,541,256,529,262,521,263,515,265,508,269,502,270,493,271,496,259,494,253,500,239,508,226,515,216,520,200,496,259],
     textoX: 520,
     textoY: 230
   },
   "Thalengarde": {
     pontos: [487,262,483,278,486,298,481,310,475,315,466,328,461,337,470,349,483,344,488,330,497,323,510,323,512,309,521,300,527,289,532,280,541,277,550,277,549,288,563,287,564,276,577,274,591,267,581,253,570,249,558,250,547,250,539,258,527,262,515,266,503,267,494,268],
     textoX: 530,
     textoY: 290
   },
   "Duskmere": {
     pontos: [555,246,555,231,559,217,569,207,584,203,598,200,613,199,624,198,642,198,654,198,669,198,681,198,693,198,705,198,715,201,711,209,703,217,698,226,693,234,685,238,679,244,673,252,669,264,661,268,652,268,643,268,634,268,625,270,632,278,637,283,646,287,636,294,627,293,618,292,611,288,604,287,596,286,600,275,603,267,598,257,591,249,585,253,570,250],
     textoX: 650,
     textoY: 240
   },
   "Ironreach": {
     pontos: [533,163,544,157,560,153,576,147,589,147,604,151,608,161,610,175,610,182,610,191,608,198,594,200,581,203,569,206,564,211,557,231,549,220,540,212,535,202,525,186,526,196],
     textoX: 570,
     textoY: 180
   },
   "Frosthelm": {
     pontos: [630,113,618,120,611,124,602,132,596,140,589,146,574,148,563,150,551,154,539,156,533,160,524,147,516,138,511,130,511,114,530,105,548,97,563,91,577,91,591,86,606,80,624,77,637,76,653,72,661,72,663,84,678,85,685,89,680,96,667,104,656,107,642,112],
     textoX: 630,
     textoY: 100
   },
   "Blackmere": {
     pontos: [592,145,600,137,609,124,622,116,632,112,630,123,634,131,638,137,629,141,627,156,637,162,646,166,654,171,667,171,684,166,695,173,707,175,714,179,720,191,721,200,713,201,706,198,691,197,676,198,662,198,650,197,636,196,625,196,616,198,608,197,610,180,611,166,603,153],
     textoX: 650,
     textoY: 150
   },
   "Kaer'Tai": {
     pontos: [711,237,723,242,736,244,753,249,765,251,786,253,800,257,812,261,828,272,834,280,837,290,842,303,845,313,845,320,845,332,846,346,845,359,846,370,836,370,826,371,818,374,810,378,809,366,795,354,790,346,780,340,777,330,771,320,765,307,763,296,776,295,777,287,766,284,748,278,739,275,732,280,725,290,715,293,703,293,695,294,687,284,687,271,684,260,690,250,702,246,710,246],
     textoX: 760,
     textoY: 290
   },
   "Shōrenji": {
     pontos: [823,269,836,252,845,242,851,229,857,218,857,206,850,197,836,192,823,191,808,188,797,186,782,185,768,185,758,185,747,185,747,197,740,206,730,214,728,225,723,231,715,233,723,241,739,244,754,246,773,248,790,252,803,255,811,260],
     textoX: 800,
     textoY: 220
   },
   "Nihadara": {
     pontos: [715,135,729,136,739,141,748,142,764,132,774,127,797,134,812,128,826,121,833,126,838,134,845,141,851,150,853,161,854,174,853,183,852,192,841,192,826,189,810,185,800,184,782,184,764,183,750,183,740,176,733,161,721,156,714,144],
     textoX: 780,
     textoY: 160
   },
   "Xin'Qari": {
     pontos: [826,117,834,102,844,107,851,115,859,117,870,116,879,112,889,108,900,102,907,111,913,120,918,130,922,140,926,150,928,164,928,173,927,186,922,199,918,209,906,215,897,218,886,220,876,220,866,220,859,219,858,206,854,193,857,174,853,158,847,141,836,129],
     textoX: 880,
     textoY: 150
   },
   "Vol'Zareth": {
     pontos: [1048,124,1052,142,1049,155,1047,172,1042,182,1036,194,1030,208,1023,214,1007,215,995,212,980,209,965,206,951,205,938,201,925,198,928,183,928,167,927,147,919,132,913,119,904,106,905,93,921,94,934,89,948,84,962,77,973,87,986,89,1001,90,1015,94,1026,102,1035,113],
     textoX: 980,
     textoY: 150
   },
   "Omradan": {
     pontos: [1050,124,1051,139,1051,154,1049,168,1044,181,1039,190,1035,200,1031,208,1027,217,1030,230,1038,238,1050,243,1059,245,1073,249,1083,249,1093,251,1095,261,1098,270,1110,261,1122,260,1124,251,1130,239,1137,232,1134,218,1117,222,1103,218,1094,216,1101,208,1113,199,1120,189,1135,184,1152,184,1166,192,1175,189,1182,185,1195,181,1208,182,1223,180,1233,175,1225,164,1208,157,1190,146,1178,132,1160,123,1144,131,1127,127,1105,131,1089,136,1079,138,1073,124,1074,115,1061,116],
     textoX: 1100,
     textoY: 200
   },
   "Sa'Torran": {
     pontos: [897,218,899,226,903,235,913,248,922,253,934,258,947,263,960,266,979,269,1001,274,1019,275,1039,275,1048,266,1055,261,1060,246,1044,241,1030,233,1027,211,1017,214,1003,214,990,210,973,207,940,198,925,194,917,210],
     textoX: 970,
     textoY: 250
   },
   "Qumaran": {
     pontos: [1060,247,1054,260,1038,272,1021,277,1006,277,991,290,964,311,886,297,861,218,826,264,847,314,842,344,908,352,964,349,981,354,997,359,1008,363,1020,372,1033,373,1043,374,1055,369,1064,363,1057,351,1066,341,1075,332,1066,323,1069,303,1077,290,1089,278,1098,272,1092,254,1077,250],
     textoX: 1000,
     textoY: 320
   },
   "Tzun'Rakai": {
     pontos: [1122,274,1120,288,1113,296,1108,304,1100,311,1097,322,1110,320,1120,312,1127,302,1134,292,1128,279],
     textoX: 1120,
     textoY: 290
   },
   "Mei'Zhara": {
     pontos: [866,220,879,218,892,219,900,234,910,245,922,252,937,261,954,262,971,268,988,269,1002,276,992,285,981,295,966,306,950,306,930,303,911,298,889,296,881,279,876,261,871,245,864,232],
     textoX: 940,
     textoY: 280
   },
   "Darakai": {
     pontos: [961,352,962,365,962,379,966,388,970,402,973,418,975,427,983,442,987,461,999,472,1005,482,1005,491,997,491,984,484,976,475,970,460,963,449,967,432,963,416,961,405,955,393,946,383,937,378,928,384,923,394,919,406,914,418,913,433,909,441,898,436,889,423,877,408,871,397,863,384,852,375,842,372,847,357,846,344,859,346,883,350,903,353,922,352,942,349],
     textoX: 950,
     textoY: 400
   },
   "Ish'Tanor": {
     pontos: [963,349,976,350,991,355,1005,361,1016,365,1032,371,1048,371,1043,379,1025,378,1015,380,1008,389,1014,400,1025,404,1025,413,1020,422,1010,426,1001,423,988,413,989,425,994,434,999,440,1034,448,1044,442,1053,442,1058,448,1061,456,1060,465,1053,474,1047,482,1034,484,1024,479,1015,468,1013,459,1027,457,1034,454,999,451,985,451,980,434,973,417,973,401,964,385,963,366],
     textoX: 1000,
     textoY: 400
   },
   "Winterholde": {
     pontos: [1020,491,1033,494,1045,494,1053,494,1048,501,1040,501,1031,502,1024,501,1011,496],
     textoX: 1030,
     textoY: 495
   },
   "Aetheris": {
     pontos: [1094,458,1083,454,1076,454,1070,458,1067,470,1063,480,1069,492,1079,485,1089,487,1088,472,1080,466,1095,463],
     textoX: 1080,
     textoY: 470
   },
   "Dawnwatch": {
     pontos: [1113,475,1128,472,1144,472,1156,471,1165,479,1174,485,1184,491,1196,505,1182,505,1171,497,1162,496,1153,496,1144,488,1134,485,1123,482],
     textoX: 1150,
     textoY: 485
   },
   "Mistveil": {
     pontos: [1078,511,1069,517,1060,524,1050,531,1039,537,1025,544,1020,554,1022,567,1019,580,1011,588,1010,597,1022,597,1034,593,1048,590,1063,585,1077,582,1089,581,1099,587,1114,591,1114,605,1122,609,1139,614,1153,610,1165,599,1173,597,1179,585,1188,581,1189,567,1184,555,1175,543,1164,529,1162,513,1154,504,1152,514,1148,524,1138,531,1127,528,1119,518,1123,509,1110,504,1099,504,1097,512,1094,519,1086,514],
     textoX: 1100,
     textoY: 550
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

        // Encontrar minX e minY para posicionar o polígono
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
    
         // Criar o polígono na posição (minX, minY) com pontos relativos
     obj.polygon = scene.add.polygon(minX, minY, pontosRelativos, 0xffffff, 0.1);
     obj.polygon.setOrigin(0, 0);
     obj.polygon.setInteractive({ 
       useHandCursor: true,
       hitArea: new Phaser.Geom.Polygon(pontosRelativos),
       hitAreaCallback: Phaser.Geom.Polygon.Contains
     });


    obj.text = scene.add.text(centroX, centroY, getTextoPais(pais), {
        fontSize: '14px',
        fill: '#fff',
        align: 'center',
        wordWrap: { width: 80 },
        backgroundColor: '#00000033',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

             obj.polygon.on('pointerdown', (pointer) => {
         // DEBUG: Mostrar coordenadas exatas do clique
         console.log(`DEBUG: Clicou em ${obj.nome} nas coordenadas (${pointer.x}, ${pointer.y})`);
         
         if (vitoria || derrota) return;
         
         // Verificar se há tropas para colocar (base ou bônus)
         const totalBonus = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
         const temTropasParaColocar = tropasReforco > 0 || totalBonus > 0;
         
         if (temTropasParaColocar && obj.dono === turno && turno === meuNome) {
           // Verificar se há tropas de bônus que precisam ser colocadas
           if (totalBonus > 0) {
             // Verificar se este país pertence ao continente prioritário
             let podeReceberBonus = false;
             if (continentePrioritario) {
               const continente = continentes[continentePrioritario.nome];
               if (continente && continente.territorios.includes(obj.nome)) {
                 podeReceberBonus = true;
               }
             }
             
             if (!podeReceberBonus) {
               // Não pode colocar tropas de bônus neste país
               if (continentePrioritario) {
                 mostrarMensagem(`❌ Primeiro coloque todas as ${totalBonus} tropas de bônus restantes! (${continentePrioritario.nome}: ${continentePrioritario.quantidade})`);
               } else {
                 mostrarMensagem("❌ Este país não pertence a nenhum continente com tropas de bônus pendentes!");
               }
               return;
             }
             
             // Pode colocar tropa de bônus neste país
             mostrarInterfaceReforco(obj, pointer, scene);
             return;
           } else {
             // Não há tropas de bônus, pode colocar tropas base
             mostrarInterfaceReforco(obj, pointer, scene);
             return;
           }
         }

         // Verificar se está na fase de remanejamento
         if (faseRemanejamento && obj.dono === turno && turno === meuNome) {
           if (!selecionado) {
             // Selecionar território de origem
             selecionado = obj;
             // Aplicar borda branca grossa apenas no território de origem
             obj.polygon.setStrokeStyle(8, 0xffffff, 1);
             mostrarMensagem(`Território de origem selecionado: ${obj.nome}. Clique em um território vizinho para mover tropas.`);
             tocarSomHuh();
           } else if (selecionado === obj) {
             // Deselecionar
             obj.polygon.setStrokeStyle(4, 0x000000, 1);
             selecionado = null;
             mostrarMensagem('Seleção cancelada');
           } else if (selecionado.vizinhos.includes(obj.nome) && obj.dono === turno) {
             // Destacar território de destino com borda branca grossa
             obj.polygon.setStrokeStyle(8, 0xffffff, 1);
             // Verificar se é possível mover tropas antes de mostrar a interface
             socket.emit('verificarMovimentoRemanejamento', {
               origem: selecionado.nome,
               destino: obj.nome
             });
           } else {
             mostrarMensagem('❌ Só pode mover tropas para territórios vizinhos que você controla!');
           }
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
          tocarSomHuh(); // Tocar som quando selecionar território
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
    
    // Verificar se este país pertence ao continente prioritário
    let pertenceAoContinentePrioritario = false;
    const totalBonus = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    
    if (totalBonus > 0 && paises[i].dono === turno && continentePrioritario) {
      const continente = continentes[continentePrioritario.nome];
      if (continente && continente.territorios.includes(paises[i].nome)) {
        pertenceAoContinentePrioritario = true;
      }
    }
    
    // Aplicar cor e borda baseada na prioridade
    if (pertenceAoContinentePrioritario) {
      paises[i].polygon.setFillStyle(coresDosDonos[paises[i].dono], 0.7);
      paises[i].polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca grossa para continente prioritário
    } else {
      paises[i].polygon.setFillStyle(coresDosDonos[paises[i].dono], 0.7);
      paises[i].polygon.setStrokeStyle(4, 0x000000, 1); // Borda preta normal
    }
  }
  selecionado = null;
  
  // Adicionar indicadores de continentes após os territórios serem carregados
  adicionarIndicadoresContinentes(scene);
}

function getTextoPais(pais) {
  return `${pais.nome}\n${pais.tropas}`;
}

function atualizarHUD() {
  const tropas = paises
    .filter(p => p.dono === turno)
    .reduce((soma, p) => soma + p.tropas, 0);

  let jogadorHUD = `🧍 Você: ${meuNome || '?'}\n`;
  let continentesHUD = '';
  let bonusHUD = '';
  let prioridadeHUD = '';
  
  // Adicionar informação dos continentes
  if (Object.keys(continentes).length > 0) {
    continentesHUD = '\n🌍 Continentes:\n';
    Object.values(continentes).forEach(continente => {
      const controle = continente.controle[meuNome];
      if (controle) {
        const status = controle.controla ? '✅' : `${controle.conquistados}/${controle.total}`;
        continentesHUD += `${continente.nome} (${continente.bonus}): ${status}\n`;
      }
    });
  }

  // Adicionar informação das tropas de bônus
  const totalBonus = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  if (totalBonus > 0) {
    bonusHUD = '\n🎁 Tropas de Bônus:\n';
    Object.entries(tropasBonusContinente).forEach(([continente, quantidade]) => {
      if (quantidade > 0) {
        bonusHUD += `${continente}: ${quantidade}\n`;
      }
    });
  }
  
  // Adicionar informação de prioridade para reforço
  if (continentePrioritario && meuNome === turno) {
    prioridadeHUD = `\n⚠️ Prioridade: Coloque ${continentePrioritario.quantidade} tropas de ${continentePrioritario.nome} primeiro!`;
  }
  
  // Adicionar informação da fase de remanejamento
  if (faseRemanejamento && meuNome === turno) {
    prioridadeHUD = `\n🔄 Fase de remanejamento: Clique em um território para mover tropas!`;
  }
  
  const totalReforcos = tropasReforco + totalBonus;
  hudTexto.setText(`${jogadorHUD}🎮 Turno: ${turno}   🛡️ Tropas totais: ${tropas}   🆘 Reforço restante: ${totalReforcos} (${tropasReforco} base + ${totalBonus} bônus)${continentesHUD}${bonusHUD}${prioridadeHUD}`);
}

function atualizarTextoBotaoTurno() {
  if (faseRemanejamento && meuNome === turno) {
    botaoTurno.setText('Encerrar Turno');
  } else if (meuNome === turno) {
    botaoTurno.setText('Encerrar Ataque');
  } else {
    botaoTurno.setText('Encerrar Turno');
  }
}

function limparSelecao() {
  // Limpar todas as bordas especiais e restaurar as bordas normais
  paises.forEach(p => {
    // Verificar se este país pertence ao continente prioritário
    let pertenceAoContinentePrioritario = false;
    const totalBonus = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    
    if (totalBonus > 0 && p.dono === turno && continentePrioritario) {
      const continente = continentes[continentePrioritario.nome];
      if (continente && continente.territorios.includes(p.nome)) {
        pertenceAoContinentePrioritario = true;
      }
    }
    
    // Aplicar borda apropriada baseada na prioridade
    if (pertenceAoContinentePrioritario) {
      p.polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca grossa para continente prioritário
    } else {
      p.polygon.setStrokeStyle(4, 0x000000, 1); // Borda preta normal
    }
  });
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

// Funções para tocar sons
function tocarSomTiro() {
  if (somTiro) {
    somTiro.play();
  }
}

function tocarSomMovimento() {
  if (somMovimento) {
    somMovimento.play();
  }
}

function tocarSomClick() {
  if (somClick) {
    somClick.play();
  }
}

function tocarSomHuh() {
  if (somHuh) {
    somHuh.play();
  }
}

// Funções para interface de reforço
function mostrarInterfaceReforco(territorio, pointer, scene) {
  // Esconder interface anterior se existir
  esconderInterfaceReforco();
  
  // Calcular tropas disponíveis
  const totalBonus = Object.values(tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  
  // Se há tropas de bônus pendentes, mostrar apenas as do continente prioritário
  let tropasDisponiveis;
  if (totalBonus > 0 && continentePrioritario) {
    // Mostrar apenas as tropas de bônus do continente prioritário
    tropasDisponiveis = continentePrioritario.quantidade;
  } else {
    // Não há tropas de bônus, mostrar tropas base
    tropasDisponiveis = tropasReforco;
  }
  
  // Inicializar com 1 tropa
  tropasParaColocar = 1;
  territorioSelecionadoParaReforco = territorio;
  
  // Criar container para a interface
  interfaceReforco = scene.add.container(pointer.x, pointer.y);
  interfaceReforco.setDepth(20);
  
  // Background da interface
  const background = scene.add.rectangle(0, 0, 200, 120, 0x000000, 0.9);
  background.setStrokeStyle(2, 0xffffff);
  interfaceReforco.add(background);
  
  // Título
  let tituloTexto = `Reforçar ${territorio.nome}`;
  if (totalBonus > 0 && continentePrioritario) {
    tituloTexto = `Colocar tropas de bônus (${continentePrioritario.nome}) em ${territorio.nome}`;
  }
  
  const titulo = scene.add.text(0, -40, tituloTexto, {
    fontSize: '14px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceReforco.add(titulo);
  
  // Botão menos
  const botaoMenos = scene.add.text(-60, 0, '-', {
    fontSize: '24px',
    fill: '#fff',
    backgroundColor: '#ff3333',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoMenos.on('pointerdown', (pointer) => {
    if (tropasParaColocar > 1) {
      tropasParaColocar--;
      atualizarTextoQuantidade();
    }
  });
  interfaceReforco.add(botaoMenos);
  
  // Texto da quantidade
  const textoQuantidade = scene.add.text(0, 0, `${tropasParaColocar}/${tropasDisponiveis}`, {
    fontSize: '16px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceReforco.add(textoQuantidade);
  
  // Botão mais
  const botaoMais = scene.add.text(60, 0, '+', {
    fontSize: '24px',
    fill: '#fff',
    backgroundColor: '#33ff33',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoMais.on('pointerdown', (pointer) => {
    if (tropasParaColocar < tropasDisponiveis) {
      tropasParaColocar++;
      atualizarTextoQuantidade();
    }
  });
  interfaceReforco.add(botaoMais);
  
  // Botão confirmar
  const botaoConfirmar = scene.add.text(0, 40, '✅ Confirmar', {
    fontSize: '14px',
    fill: '#fff',
    backgroundColor: '#0077cc',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoConfirmar.on('pointerdown', (pointer) => {
    tocarSomClick();
    confirmarReforco();
  });
  interfaceReforco.add(botaoConfirmar);
  
  // Botão cancelar
  const botaoCancelar = scene.add.text(0, 60, '❌ Cancelar', {
    fontSize: '12px',
    fill: '#fff',
    backgroundColor: '#666',
    padding: { x: 8, y: 3 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoCancelar.on('pointerdown', (pointer) => {
    tocarSomClick();
    esconderInterfaceReforco();
  });
  interfaceReforco.add(botaoCancelar);
  
  // Função para atualizar o texto da quantidade
  function atualizarTextoQuantidade() {
    textoQuantidade.setText(`${tropasParaColocar}/${tropasDisponiveis}`);
  }
  
  // Posicionar interface para não sair da tela
  const largura = scene.scale.width;
  const altura = scene.scale.height;
  if (pointer.x + 100 > largura) {
    interfaceReforco.x = largura - 100;
  }
  if (pointer.y + 60 > altura) {
    interfaceReforco.y = altura - 60;
  }
}

function esconderInterfaceReforco() {
  if (interfaceReforco) {
    interfaceReforco.destroy();
    interfaceReforco = null;
  }
  tropasParaColocar = 0;
  territorioSelecionadoParaReforco = null;
}

function confirmarReforco() {
  if (territorioSelecionadoParaReforco && tropasParaColocar > 0) {
    // Enviar múltiplas vezes para colocar as tropas
    for (let i = 0; i < tropasParaColocar; i++) {
      socket.emit('colocarReforco', territorioSelecionadoParaReforco.nome);
    }
    esconderInterfaceReforco();
  }
}

// Funções para interface de transferência após conquista
function mostrarInterfaceTransferenciaConquista(dados, scene) {
  // Esconder interface anterior se existir
  esconderInterfaceTransferenciaConquista(true);
  
  // Inicializar com 1 tropa (automática)
  tropasParaTransferir = 1;
  
  // Criar container para a interface
  interfaceTransferenciaConquista = scene.add.container(400, 300);
  interfaceTransferenciaConquista.setDepth(20);
  
  // Background da interface
  const background = scene.add.rectangle(0, 0, 300, 180, 0x000000, 0.9);
  background.setStrokeStyle(2, 0xffffff);
  interfaceTransferenciaConquista.add(background);
  
  // Título
  const titulo = scene.add.text(0, -60, `Transferir tropas após conquista`, {
    fontSize: '16px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceTransferenciaConquista.add(titulo);
  
  // Descrição
  const descricao = scene.add.text(0, -35, `De ${dados.territorioAtacante} para ${dados.territorioConquistado}`, {
    fontSize: '14px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceTransferenciaConquista.add(descricao);
  
  // Botão menos
  const botaoMenos = scene.add.text(-80, 0, '-', {
    fontSize: '24px',
    fill: '#fff',
    backgroundColor: '#ff3333',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoMenos.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaTransferir > 1) { // Mínimo 1 (tropa automática)
      tropasParaTransferir--;
      atualizarTextoQuantidadeTransferencia();
    }
  });
  interfaceTransferenciaConquista.add(botaoMenos);
  
  // Texto da quantidade
  const textoQuantidade = scene.add.text(0, 0, `${tropasParaTransferir}/${dados.tropasDisponiveis}`, {
    fontSize: '18px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceTransferenciaConquista.add(textoQuantidade);
  
  // Botão mais
  const botaoMais = scene.add.text(80, 0, '+', {
    fontSize: '24px',
    fill: '#fff',
    backgroundColor: '#33ff33',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoMais.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaTransferir < dados.tropasDisponiveis) {
      tropasParaTransferir++;
      atualizarTextoQuantidadeTransferencia();
    }
  });
  interfaceTransferenciaConquista.add(botaoMais);
  
  // Botão confirmar
  const botaoConfirmar = scene.add.text(0, 40, '✅ Confirmar', {
    fontSize: '14px',
    fill: '#fff',
    backgroundColor: '#0077cc',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoConfirmar.on('pointerdown', (pointer) => {
    tocarSomClick();
    setTimeout(() => {
      confirmarTransferenciaConquista();
    }, 10);
  });
  interfaceTransferenciaConquista.add(botaoConfirmar);
  
  // Botão pular (manter apenas a tropa automática)
  const botaoPular = scene.add.text(0, 70, '⏭️ Manter automática', {
    fontSize: '12px',
    fill: '#fff',
    backgroundColor: '#666',
    padding: { x: 8, y: 3 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoPular.on('pointerdown', (pointer) => {
    tocarSomClick();
    tropasParaTransferir = 1; // Manter apenas a tropa automática
    setTimeout(() => {
      confirmarTransferenciaConquista();
    }, 10);
  });
  interfaceTransferenciaConquista.add(botaoPular);
  
  // Função para atualizar o texto da quantidade
  function atualizarTextoQuantidadeTransferencia() {
    textoQuantidade.setText(`${tropasParaTransferir}/${dados.tropasDisponiveis}`);
  }
}

function esconderInterfaceTransferenciaConquista(manterDados = false) {
  console.log('DEBUG: esconderInterfaceTransferenciaConquista chamada, manterDados =', manterDados);
  if (interfaceTransferenciaConquista) {
    interfaceTransferenciaConquista.destroy();
    interfaceTransferenciaConquista = null;
    console.log('DEBUG: interfaceTransferenciaConquista destruída');
  }
  tropasParaTransferir = 0;
  if (!manterDados) {
    dadosConquista = null;
    console.log('DEBUG: tropasParaTransferir e dadosConquista resetados');
  } else {
    console.log('DEBUG: tropasParaTransferir resetado, dadosConquista mantido');
  }
}

function confirmarTransferenciaConquista() {
  console.log('DEBUG: confirmarTransferenciaConquista chamada');
  console.log('DEBUG: dadosConquista =', dadosConquista);
  console.log('DEBUG: tropasParaTransferir =', tropasParaTransferir);
  
  if (dadosConquista && tropasParaTransferir >= 0) {
    console.log('DEBUG: Enviando transferirTropasConquista para o servidor');
    socket.emit('transferirTropasConquista', {
      territorioAtacante: dadosConquista.territorioAtacante,
      territorioConquistado: dadosConquista.territorioConquistado,
      quantidade: tropasParaTransferir
    });
    esconderInterfaceTransferenciaConquista(false);
  } else {
    console.log('DEBUG: Condição não atendida - dadosConquista:', dadosConquista, 'tropasParaTransferir:', tropasParaTransferir);
  }
}

function mostrarInterfaceRemanejamento(origem, destino, scene, quantidadeMaxima = null) {
  // Inicializar com 1 tropa
  let tropasParaMover = 1;
  const maxTropas = quantidadeMaxima || (origem.tropas - 1); // Usar quantidade máxima fornecida ou calcular
  
  // Criar container para a interface
  const interfaceRemanejamento = scene.add.container(400, 300);
  interfaceRemanejamento.setDepth(20);
  
  // Background da interface
  const background = scene.add.rectangle(0, 0, 300, 180, 0x000000, 0.9);
  background.setStrokeStyle(2, 0xffffff);
  interfaceRemanejamento.add(background);
  
  // Título
  const titulo = scene.add.text(0, -60, `Mover tropas`, {
    fontSize: '16px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceRemanejamento.add(titulo);
  
  // Descrição
  const descricao = scene.add.text(0, -35, `De ${origem.nome} para ${destino.nome}`, {
    fontSize: '14px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceRemanejamento.add(descricao);
  
  // Botão menos
  const botaoMenos = scene.add.text(-80, 0, '-', {
    fontSize: '24px',
    fill: '#fff',
    backgroundColor: '#ff3333',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoMenos.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaMover > 1) {
      tropasParaMover--;
      atualizarTextoQuantidadeRemanejamento();
    }
  });
  interfaceRemanejamento.add(botaoMenos);
  
  // Texto da quantidade
  const textoQuantidade = scene.add.text(0, 0, `${tropasParaMover}/${maxTropas}`, {
    fontSize: '18px',
    fill: '#fff',
    align: 'center'
  }).setOrigin(0.5);
  interfaceRemanejamento.add(textoQuantidade);
  
  // Botão mais
  const botaoMais = scene.add.text(80, 0, '+', {
    fontSize: '24px',
    fill: '#fff',
    backgroundColor: '#33ff33',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoMais.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaMover < maxTropas) {
      tropasParaMover++;
      atualizarTextoQuantidadeRemanejamento();
    }
  });
  interfaceRemanejamento.add(botaoMais);
  
  // Botão confirmar
  const botaoConfirmar = scene.add.text(0, 40, '✅ Confirmar', {
    fontSize: '14px',
    fill: '#fff',
    backgroundColor: '#0077cc',
    padding: { x: 10, y: 5 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoConfirmar.on('pointerdown', (pointer) => {
    tocarSomClick();
    socket.emit('moverTropas', {
      origem: origem.nome,
      destino: destino.nome,
      quantidade: tropasParaMover
    });
    limparSelecao();
    interfaceRemanejamento.destroy();
  });
  interfaceRemanejamento.add(botaoConfirmar);
  
  // Botão cancelar
  const botaoCancelar = scene.add.text(0, 70, '❌ Cancelar', {
    fontSize: '12px',
    fill: '#fff',
    backgroundColor: '#666',
    padding: { x: 8, y: 3 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoCancelar.on('pointerdown', (pointer) => {
    tocarSomClick();
    limparSelecao();
    interfaceRemanejamento.destroy();
  });
  interfaceRemanejamento.add(botaoCancelar);
  
  // Função para atualizar o texto da quantidade
  function atualizarTextoQuantidadeRemanejamento() {
    textoQuantidade.setText(`${tropasParaMover}/${maxTropas}`);
  }
}

function mostrarObjetivo(objetivo, scene) {
  modalObjetivoAberto = true; // Marca que o modal está aberto
  
  // Criar overlay para mostrar o objetivo
  const overlay = scene.add.rectangle(400, 300, 800, 400, 0x000000, 0.8);
  overlay.setDepth(20);
  
  // Container para o conteúdo
  const container = scene.add.container(400, 300);
  container.setDepth(21);
  
  // Título
  const titulo = scene.add.text(0, -150, '🎯 SEU OBJETIVO', {
    fontSize: '24px',
    fill: '#ffff00',
    fontStyle: 'bold',
    stroke: '#000',
    strokeThickness: 4
  }).setOrigin(0.5);
  container.add(titulo);
  
  // Descrição do objetivo
  const descricao = scene.add.text(0, -100, objetivo.descricao, {
    fontSize: '18px',
    fill: '#fff',
    align: 'center',
    wordWrap: { width: 600 },
    stroke: '#000',
    strokeThickness: 2
  }).setOrigin(0.5);
  container.add(descricao);
  
  // Botão de fechar
  const botaoFechar = scene.add.text(0, 100, '✅ Entendi', {
    fontSize: '16px',
    fill: '#fff',
    backgroundColor: '#0077cc',
    padding: { x: 15, y: 8 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  botaoFechar.on('pointerdown', () => {
    tocarSomClick();
    modalObjetivoAberto = false; // Marca que o modal foi fechado
    overlay.destroy();
    container.destroy();
  });
  container.add(botaoFechar);
}

function mostrarCartasTerritorio(cartas, scene, forcarTroca = false) {
  modalCartasTerritorioAberto = true; // Marca que o modal está aberto
  
  // Criar overlay para mostrar as cartas
  const overlay = scene.add.rectangle(400, 300, 800, 500, 0x000000, 0.8);
  overlay.setDepth(20);
  
  // Container para o conteúdo
  const container = scene.add.container(400, 300);
  container.setDepth(21);
  
  // Título
  const titulo = scene.add.text(0, -180, forcarTroca ? '⚠️ TROCA OBRIGATÓRIA DE CARTAS' : '🎴 SUAS CARTAS TERRITÓRIO', {
    fontSize: '24px',
    fill: forcarTroca ? '#ff4444' : '#ffaa00',
    fontStyle: 'bold',
    stroke: '#000',
    strokeThickness: 4
  }).setOrigin(0.5);
  container.add(titulo);
  
  if (cartas.length === 0) {
    // Mensagem quando não há cartas
    const mensagem = scene.add.text(0, -50, 'Você ainda não possui cartas território.\nConquiste territórios de outros jogadores para ganhar cartas!', {
      fontSize: '16px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 600 },
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);
    container.add(mensagem);
  } else {
    // Mostrar as cartas
    const cartasTexto = scene.add.text(0, -130, `Você possui ${cartas.length} carta(s):`, {
      fontSize: '18px',
      fill: '#fff',
      align: 'center',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);
    container.add(cartasTexto);
    
    // Instruções
    const instrucoesText = scene.add.text(0, -20, 'Clique nas cartas para selecionar (máximo 3)', {
      fontSize: '14px',
      fill: '#ccc',
      align: 'center',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5);
    container.add(instrucoesText);
    
    // Criar cartas clicáveis
    const cartasSelecionadas = [];
    const cartasClicaveis = [];
    
    cartas.forEach((carta, index) => {
      const x = (index - Math.floor(cartas.length / 2)) * 80;
      const cartaText = scene.add.text(x, -80, carta, {
        fontSize: '40px',
        fill: '#ffaa00',
        stroke: '#000',
        strokeThickness: 3,
        backgroundColor: '#333'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      cartaText.on('pointerdown', () => {
        tocarSomClick();
        if (cartasSelecionadas.includes(cartaText)) {
          // Deselecionar
          const index = cartasSelecionadas.indexOf(cartaText);
          cartasSelecionadas.splice(index, 1);
          cartaText.setStyle({ backgroundColor: '#333' });
        } else if (cartasSelecionadas.length < 3) {
          // Selecionar
          cartasSelecionadas.push(cartaText);
          cartaText.setStyle({ backgroundColor: '#ffaa00' });
        }
        
        // Atualizar texto de instruções
        if (cartasSelecionadas.length === 0) {
          instrucoesText.setText('Clique nas cartas para selecionar (máximo 3)');
        } else if (cartasSelecionadas.length < 3) {
          instrucoesText.setText(`Selecionadas: ${cartasSelecionadas.length}/3 - Clique em mais cartas ou trocar`);
        } else {
          instrucoesText.setText(`Selecionadas: ${cartasSelecionadas.length}/3 - Clique em trocar ou deselecionar`);
        }
      });
      
      cartasClicaveis.push(cartaText);
      container.add(cartaText);
    });
    
    // Legenda dos símbolos
    const legenda = scene.add.text(0, 20, '▲ = Triângulo  ■ = Quadrado  ● = Círculo  ★ = Coringa', {
      fontSize: '14px',
      fill: '#ccc',
      align: 'center',
      stroke: '#000',
      strokeThickness: 1
    }).setOrigin(0.5);
    container.add(legenda);
    
    // Botão de trocar (só aparece se há cartas selecionadas)
    const botaoTrocar = scene.add.text(0, 80, '🔄 Trocar Cartas', {
      fontSize: '16px',
      fill: '#fff',
      backgroundColor: '#0077cc',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    botaoTrocar.on('pointerdown', () => {
      tocarSomClick();
      if (cartasSelecionadas.length === 3) {
        // Mapear os objetos cartaText de volta para os símbolos
        const simbolosSelecionados = cartasSelecionadas.map(cartaText => cartaText.text);
        socket.emit('trocarCartasTerritorio', simbolosSelecionados);
      }
    });
    container.add(botaoTrocar);
  }
  
  // Botão de fechar (só se não for troca obrigatória)
  if (!forcarTroca) {
    const botaoFechar = scene.add.text(0, 120, '✅ Entendi', {
      fontSize: '16px',
      fill: '#fff',
      backgroundColor: '#0077cc',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    botaoFechar.on('pointerdown', () => {
      tocarSomClick();
      modalCartasTerritorioAberto = false;
      overlay.destroy();
      container.destroy();
    });
    container.add(botaoFechar);
  }
}

// Variável global para controlar se os indicadores já foram criados
let indicadoresContinentesCriados = false;

function adicionarIndicadoresContinentes(scene) {
  // Evitar criar indicadores duplicados
  if (indicadoresContinentesCriados) return;
  
  // Definir posições para os indicadores de continentes (reposicionados para evitar sobreposição)
  const indicadoresContinentes = [
    {
      nome: 'Thaloria',
      bonus: 5,
      x: 120,
      y: 60,
      texto: 'Thaloria +5',
      territorioRepresentativo: 'Redwyn'
    },
    {
      nome: 'Zarandis',
      bonus: 3,
      x: 100,
      y: 500,
      texto: 'Zarandis +3',
      territorioRepresentativo: 'Emberlyn'
    },
    {
      nome: 'Elyndra',
      bonus: 5,
      x: 400,
      y: 50,
      texto: 'Elyndra +5',
      territorioRepresentativo: 'Frosthelm'
    },
    {
      nome: 'Kharune',
      bonus: 4,
      x: 480,
      y: 380,
      texto: 'Kharune +4',
      territorioRepresentativo: 'Zul\'Marak'
    },
    {
      nome: 'Xanthera',
      bonus: 7,
      x: 850,
      y: 70,
      texto: 'Xanthera +7',
      territorioRepresentativo: 'Nihadara'
    },
    {
      nome: 'Mythara',
      bonus: 2,
      x: 950,
      y: 530,
      texto: 'Mythara +2',
      territorioRepresentativo: 'Mistveil'
    }
  ];

  // Criar indicadores para cada continente
  indicadoresContinentes.forEach(indicador => {
    const textoIndicador = scene.add.text(indicador.x, indicador.y, indicador.texto, {
      fontSize: '14px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
      backgroundColor: '#333333',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    textoIndicador.setDepth(3); // Colocar acima dos territórios mas abaixo da UI

    // Adicionar linha conectando o território representativo ao indicador
    // Primeiro, precisamos encontrar as coordenadas do território representativo
    const territorio = paises.find(p => p.nome === indicador.territorioRepresentativo);
    if (territorio && territorio.x && territorio.y) {
      // Criar uma linha do território ao indicador
      const linha = scene.add.graphics();
      linha.lineStyle(2, 0xffffff, 0.7); // Linha branca semi-transparente
      linha.beginPath();
      linha.moveTo(territorio.x, territorio.y);
      linha.lineTo(indicador.x, indicador.y);
      linha.strokePath();
      linha.setDepth(2); // Colocar abaixo dos indicadores mas acima dos territórios
    } else {
      console.warn(`Território representativo não encontrado para ${indicador.nome}: ${indicador.territorioRepresentativo}`);
    }
  });
  
  // Marcar que os indicadores foram criados
  indicadoresContinentesCriados = true;
}
