// Login System
let playerLoggedIn = false;
let playerUsername = '';

// Room Selection System
let currentRoomId = null;
let roomSelectionScreen = null;

// Turn Timer System
let turnTimer = null;
let turnTimeLeft = 90; // 1:30 in seconds
let turnTimerInterval = null;
let isPlayerTurn = false;
let isClockTickingPlaying = false;
let timerJustExpired = false; // Prevent timer from restarting immediately after expiration

// Turn Confirmation Popup System
let turnConfirmationPopup = null;
let turnConfirmationTimeout = null;
let turnConfirmationTimeLeft = 30; // 30 seconds to confirm turn
let turnConfirmationInterval = null;
let forcedTurnCount = 0; // Count of forced turns for this player
let maxForcedTurns = 2; // Maximum allowed forced turns before disconnect
let lastTurnForPlayer = null; // Track the last turn that was this player's turn
let lastProcessedTurn = null; // Track the last turn that was processed for popup

// Debug function to log forced turn count
function logForcedTurnCount() {
  console.log('🔍 DEBUG: forcedTurnCount =', forcedTurnCount, 'maxForcedTurns =', maxForcedTurns);
}

// Initialize login system
document.addEventListener('DOMContentLoaded', function() {
  initializeLoginSystem();
});

function initializeLoginSystem() {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Allow Enter key to submit
  if (usernameInput) {
    usernameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
  }
}

// Global Turn Timer Functions
function startTurnTimer() {
  if (turnTimerInterval) {
    clearInterval(turnTimerInterval);
  }
  
  turnTimeLeft = 90; // Reset to 1:30
  isPlayerTurn = true;
  timerJustExpired = false; // Reset the expiration flag
  
  // Update global timer display
  updateGlobalTimerDisplay();
  
  turnTimerInterval = setInterval(() => {
    turnTimeLeft--;
    updateGlobalTimerDisplay();
    
    if (turnTimeLeft <= 0) {
      endTurnByTimeout();
    }
  }, 1000);
}

function stopTurnTimer() {
  if (turnTimerInterval) {
    clearInterval(turnTimerInterval);
    turnTimerInterval = null;
  }
  
  isPlayerTurn = false;
  isClockTickingPlaying = false; // Reset clock ticking flag
  turnTimeLeft = 0; // Reset time to 0
  
  // Hide global timer when not active
  const globalTimer = document.getElementById('global-turn-timer');
  if (globalTimer) {
    globalTimer.style.display = 'none';
  }
  
  // Update display to hide timer
  updateGlobalTimerDisplay();
}

function updateGlobalTimerDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  const globalTimer = document.getElementById('global-turn-timer');
  if (!timerDisplay) return;
  
  // Hide timer if time has expired
  if (turnTimeLeft <= 0) {
    if (globalTimer) {
      globalTimer.style.display = 'none';
    }
    return;
  }
  
  const minutes = Math.floor(turnTimeLeft / 60);
  const seconds = turnTimeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  timerDisplay.textContent = timeString;
  
  // Update visual state based on time remaining
  timerDisplay.className = 'timer-display';
  if (turnTimeLeft <= 30) {
    timerDisplay.classList.add('danger');
  } else if (turnTimeLeft <= 60) {
    timerDisplay.classList.add('warning');
  }
  
  // Handle clock ticking sound for last 10 seconds
  if (turnTimeLeft <= 10 && turnTimeLeft > 0) {
    if (!isClockTickingPlaying) {
      tocarSomClockTicking();
      isClockTickingPlaying = true;
    }
  } else {
    isClockTickingPlaying = false;
  }
}

// Legacy function for compatibility
function updateTimerDisplay() {
  updateGlobalTimerDisplay();
}

// Turn Confirmation Popup Functions
function showTurnConfirmationPopup(scene) {
  console.log('🚀 showTurnConfirmationPopup called');
  console.log('🚀 Scene:', scene);
  console.log('🚀 Current forcedTurnCount:', forcedTurnCount);
  console.log('🚀 Current isPlayerTurn:', isPlayerTurn);
  console.log('🚀 Current turnConfirmationPopup:', turnConfirmationPopup);
  
  if (!scene || !scene.add) {
    console.log('❌ Invalid scene in showTurnConfirmationPopup');
    return;
  }
  
  // Hide any existing popup
  hideTurnConfirmationPopup();
  
  // Reset confirmation time
  turnConfirmationTimeLeft = 30;
  
  // Get screen dimensions
  const largura = scene.scale.width;
  const altura = scene.scale.height;
  
  // Create popup container
  turnConfirmationPopup = scene.add.container(largura/2, altura/2);
  turnConfirmationPopup.setDepth(25);
  
  // Background overlay
  const overlay = scene.add.rectangle(0, 0, largura, altura, 0x000000, 0.7);
  overlay.setDepth(0);
  turnConfirmationPopup.add(overlay);
  
  // Main popup background - smaller and more compact
  const background = scene.add.rectangle(0, 0, 450, 280, 0x1a1a1a, 0.95);
  background.setStrokeStyle(2, 0x0077cc);
  background.setDepth(1);
  turnConfirmationPopup.add(background);
  
  // Header - smaller
  const headerBg = scene.add.rectangle(0, -110, 450, 50, 0x0077cc, 0.9);
  headerBg.setDepth(2);
  turnConfirmationPopup.add(headerBg);
  
  // Turn icon - smaller
  const turnIcon = scene.add.text(-180, -110, '⚔️', {
    fontSize: '20px',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(3);
  turnConfirmationPopup.add(turnIcon);
  
  // Title - smaller and better positioned
  const title = scene.add.text(-150, -110, 'SEU TURNO COMEÇOU!', {
    fontSize: '16px',
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0, 0.5).setDepth(3);
  turnConfirmationPopup.add(title);
  
  // Decorative line
  const linhaDecorativa = scene.add.rectangle(0, -85, 400, 1, 0x444444, 0.8);
  linhaDecorativa.setDepth(2);
  turnConfirmationPopup.add(linhaDecorativa);
  
  // Content container
  const contentContainer = scene.add.container(0, -20);
  contentContainer.setDepth(3);
  turnConfirmationPopup.add(contentContainer);
  
  // Warning icon - smaller
  const warningIcon = scene.add.text(0, -30, '⚠️', {
    fontSize: '28px',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(3);
  contentContainer.add(warningIcon);
  
  // Warning message - more compact
  const warningText = scene.add.text(0, 10, `Se não confirmar, seu turno será passado automaticamente.\n\nApós ${maxForcedTurns - forcedTurnCount} passagens forçadas, você será desconectado.`, {
    fontSize: '13px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: { width: 380 },
    stroke: '#000000',
    strokeThickness: 1,
    lineSpacing: 5
  }).setOrigin(0.5).setDepth(3);
  contentContainer.add(warningText);
  
  // Timer container
  const timerContainer = scene.add.container(0, 70);
  timerContainer.setDepth(3);
  turnConfirmationPopup.add(timerContainer);
  
  // Timer label - above the timer box
  const timerLabel = scene.add.text(0, -20, 'Tempo Restante', {
    fontSize: '11px',
    fill: '#cccccc',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(3);
  timerContainer.add(timerLabel);
  
  // Timer background - smaller
  const timerBg = scene.add.rectangle(0, 5, 120, 35, 0x2a2a2a, 0.9);
  timerBg.setStrokeStyle(1, 0x0077cc);
  timerContainer.add(timerBg);
  
  // Timer display - smaller
  const timerText = scene.add.text(0, 5, `${turnConfirmationTimeLeft}s`, {
    fontSize: '14px',
    fill: '#ffff00',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(3);
  timerContainer.add(timerText);
  
  // Button container
  const buttonContainer = scene.add.container(0, 130);
  buttonContainer.setDepth(3);
  turnConfirmationPopup.add(buttonContainer);
  
  // Confirm button - smaller
  const confirmButton = scene.add.text(0, 0, 'CONFIRMAR TURNO', {
    fontSize: '16px',
    fill: '#ffffff',
    backgroundColor: '#33cc33',
    padding: { x: 20, y: 10 },
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(3);
  
  // Button hover effect
  confirmButton.on('pointerover', () => {
    confirmButton.setBackgroundColor('#44dd44');
  });
  
  confirmButton.on('pointerout', () => {
    confirmButton.setBackgroundColor('#33cc33');
  });
  
  confirmButton.on('pointerdown', () => {
    tocarSomClick();
    confirmTurn();
  });
  
  buttonContainer.add(confirmButton);
  
  // Start countdown
  startTurnConfirmationCountdown(scene, timerText);
  
  // Animation
  turnConfirmationPopup.setScale(0.8);
  scene.tweens.add({
    targets: turnConfirmationPopup,
    scaleX: 1,
    scaleY: 1,
    duration: 300,
    ease: 'Back.easeOut'
  });
}

function startTurnConfirmationCountdown(scene, timerText) {
  console.log('⏰ startTurnConfirmationCountdown called');
  console.log('⏰ Initial turnConfirmationTimeLeft:', turnConfirmationTimeLeft);
  console.log('⏰ Timer text element:', timerText);
  console.log('⏰ Current forcedTurnCount:', forcedTurnCount);
  
  turnConfirmationInterval = setInterval(() => {
    turnConfirmationTimeLeft--;
    console.log('⏰ Countdown tick - time left:', turnConfirmationTimeLeft);
    
    if (timerText) {
      timerText.setText(`${turnConfirmationTimeLeft}s`);
      
      // Change color based on time remaining
      if (turnConfirmationTimeLeft <= 10) {
        timerText.setColor('#ff3333');
      } else if (turnConfirmationTimeLeft <= 20) {
        timerText.setColor('#ffaa00');
      }
    }
    
    if (turnConfirmationTimeLeft <= 0) {
      console.log('⏰ Turn confirmation timeout - forcing turn pass');
      console.log('⏰ Current forcedTurnCount before forceTurnPass:', forcedTurnCount);
      forceTurnPass();
    }
  }, 1000);
}

function hideTurnConfirmationPopup() {
  console.log('🚫 hideTurnConfirmationPopup called');
  console.log('🚫 turnConfirmationInterval:', turnConfirmationInterval);
  console.log('🚫 turnConfirmationPopup:', turnConfirmationPopup);
  
  if (turnConfirmationInterval) {
    console.log('🚫 Clearing turnConfirmationInterval');
    clearInterval(turnConfirmationInterval);
    turnConfirmationInterval = null;
  }
  
  if (turnConfirmationPopup) {
    console.log('🚫 Destroying turnConfirmationPopup');
    turnConfirmationPopup.destroy();
    turnConfirmationPopup = null;
  }
}

function confirmTurn() {
  console.log('✅ confirmTurn called');
  console.log('✅ Current forcedTurnCount before reset:', forcedTurnCount);
  
  forcedTurnCount = 0; // Reset forced turn count on successful confirmation
  lastTurnForPlayer = null; // Reset turn tracker on successful confirmation
  lastProcessedTurn = null; // Reset processed turn tracker on successful confirmation
  console.log('✅ forcedTurnCount reset to 0');
  console.log('✅ lastTurnForPlayer reset to null');
  console.log('✅ lastProcessedTurn reset to null');
  
  hideTurnConfirmationPopup();
  
  // Limpar todas as animações de salto ao confirmar o turno
  limparTodasAnimacoesSalto();
  
  // Start the normal turn timer
  const gameState = getGameState();
  console.log('✅ Game state in confirmTurn:', gameState);
  if (gameState && gameState.meuNome === gameState.turno) {
    console.log('✅ Starting normal turn timer');
    startTurnTimer();
  } else {
    console.log('❌ Cannot start timer - not my turn or no game state');
  }
}

function forceTurnPass() {
  const gameState = getGameState();
  if (!gameState) {
    console.log('❌ No game state found in forceTurnPass');
    return;
  }
  
  console.log('🚀 forceTurnPass called for player:', gameState.meuNome);
  console.log('🚀 Current turn:', gameState.turno);
  console.log('🚀 Is my turn:', gameState.meuNome === gameState.turno);
  console.log('🚀 Current forcedTurnCount before increment:', forcedTurnCount);
  
  forcedTurnCount++;
  console.log(`⚠️ Turn forced to pass (${forcedTurnCount}/${maxForcedTurns})`);
  logForcedTurnCount();
  
  hideTurnConfirmationPopup();
  
  // Limpar todas as animações de salto ao forçar passagem do turno
  limparTodasAnimacoesSalto();
  
  // Check if we should disconnect the player
  if (forcedTurnCount >= maxForcedTurns) {
    // Disconnect player after max forced turns
    console.log('🚫 Player exceeded max forced turns - disconnecting');
    console.log('🚫 forcedTurnCount:', forcedTurnCount, 'maxForcedTurns:', maxForcedTurns);
    mostrarMensagem('❌ Você foi desconectado por inatividade!');
    
    // Emit disconnect event immediately
    console.log('📤 Emitting playerInactive event');
    emitWithRoom('playerInactive', { playerName: gameState.meuNome });
    
    // Force disconnect after a short delay
    setTimeout(() => {
      console.log('🔄 Reloading page due to inactivity');
      window.location.reload();
    }, 2000);
    
    return; // Exit early to prevent further turn passing
  }
  
  // If not disconnecting, force turn to pass
  console.log('📤 Forcing turn to pass due to inactivity');
  emitWithRoom('passarTurno');
  
  // Also emit forceTurnChange as backup
  setTimeout(() => {
    console.log('🔄 Backup: Emitting forceTurnChange');
    emitWithRoom('forceTurnChange');
  }, 500);
  
  // Show warning message
  mostrarMensagem(`⚠️ Turno passado automaticamente! (${forcedTurnCount}/${maxForcedTurns})`);
  
  // Reset the turn confirmation flag to prevent immediate popup
  isPlayerTurn = false;
  lastTurnForPlayer = null; // Reset turn tracker when turn is forced to pass
  lastProcessedTurn = null; // Reset processed turn tracker when turn is forced to pass
}

function endTurnByTimeout() {
  const gameState = getGameState();
  if (!gameState) return;
  
  console.log('⏰ Turno encerrado por timeout! Timer just expired flag set to true');
  timerJustExpired = true; // Set flag to prevent immediate restart
  stopTurnTimer();
  
  // Limpar todas as animações de salto ao encerrar turno por timeout
  limparTodasAnimacoesSalto();
  
  // Automatically end turn - force it regardless of game state
  if (getSocket() && gameState.meuNome === gameState.turno) {
    console.log('📤 Emitting passarTurno due to timeout - forcing turn change');
    emitWithRoom('passarTurno');
    
    // Also emit a force turn change event as backup
    setTimeout(() => {
      console.log('🔄 Backup: Emitting forceTurnChange due to timeout');
      emitWithRoom('forceTurnChange');
    }, 1000);
  }
}

function handleLogin() {
  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();
  
  if (username.length < 2) {
    alert('Por favor, digite um nome com pelo menos 2 caracteres.');
    return;
  }
  
  if (username.length > 20) {
    alert('Por favor, digite um nome com no máximo 20 caracteres.');
    return;
  }
  
  // Store username and mark as logged in
  playerUsername = username;
  playerLoggedIn = true;
  
  // Hide login screen and show mode selection screen
  const loginScreen = document.getElementById('login-screen');
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  
  if (loginScreen) {
    loginScreen.style.display = 'none';
    console.log('✅ Tela de login ocultada');
  }
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'flex';
    console.log('✅ Tela de seleção de modos exibida');
  } else {
    console.log('❌ Tela de seleção de modos não encontrada!');
  }
  
  // Initialize mode selection system
  initializeModeSelection();
}

function initializeModeSelection() {
  console.log('🔧 Inicializando sistema de seleção de modos...');
  
  // Add event listeners for mode selection
  const skirmishMode = document.getElementById('mode-skirmish');
  const dominiumMode = document.getElementById('mode-dominium');
  const backButton = document.getElementById('back-to-login');
  
  if (skirmishMode) {
    skirmishMode.addEventListener('click', () => {
      console.log('🎮 Modo Skirmish selecionado');
      selectSkirmishMode();
    });
  }
  
  if (dominiumMode) {
    dominiumMode.addEventListener('click', () => {
      console.log('🏰 Modo Dominium selecionado (desabilitado)');
      showDominiumUnavailable();
    });
  }
  
  if (backButton) {
    backButton.addEventListener('click', () => {
      console.log('← Voltando ao login');
      backToLogin();
    });
  }
}

function selectSkirmishMode() {
  // Hide mode selection screen and show lobby screen
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  const lobbyScreen = document.getElementById('lobby-screen');
  
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'none';
    console.log('✅ Tela de seleção de modos ocultada');
  }
  if (lobbyScreen) {
    lobbyScreen.style.display = 'flex';
    console.log('✅ Lobby global exibido');
  } else {
    console.log('❌ Tela de lobby não encontrada!');
  }
  
  // Initialize lobby system
  initializeLobby();
}

function showDominiumUnavailable() {
  alert('🏰 Modo Dominium está em desenvolvimento!\n\nEste modo incluirá:\n• Campanhas estratégicas\n• Progressão de jogador\n• Conquistas e recompensas\n• Modo história\n\nVolte em breve!');
}

function backToLogin() {
  // Reset login state
  playerUsername = '';
  playerLoggedIn = false;
  
  // Show login screen and hide mode selection screen
  const loginScreen = document.getElementById('login-screen');
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  const usernameInput = document.getElementById('username');
  
  if (loginScreen) {
    loginScreen.style.display = 'flex';
    console.log('✅ Tela de login exibida');
  }
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'none';
    console.log('✅ Tela de seleção de modos ocultada');
  }
  if (usernameInput) {
    usernameInput.value = '';
    usernameInput.focus();
  }
}

function backToModeSelection() {
  console.log('🎯 Voltando para tela de seleção de modos');
  
  // Limpar estado do jogo
  const gameState = getGameState();
  if (gameState) {
    clearGameState(gameState.roomId);
  }
  
  // Parar timers
  stopTurnTimer();
  
  // Esconder tela de vitória
  esconderTelaVitoria();
  
  // Esconder jogo e mostrar seleção de modos
  const gameContainer = document.getElementById('game-container');
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  
  if (gameContainer) {
    gameContainer.style.display = 'none';
    console.log('✅ Container do jogo ocultado');
  }
  
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'flex';
    console.log('✅ Tela de seleção de modos exibida');
  }
  
  // Resetar estado de login (mantém o usuário logado)
  playerLoggedIn = true;
}

// Function to resize game elements based on screen size
function resizeGameElements(scene) {
  const gameState = getGameState();
  if (!gameState || !gameState.paises) return;

  // Calculate scale factor based on canvas size vs original size
  const canvas = scene.sys.game.canvas;
  const originalWidth = 1280;
  const originalHeight = 720;
  const scaleX = canvas.width / originalWidth;
  const scaleY = canvas.height / originalHeight;

  console.log(`🔧 Resizing elements: canvas ${canvas.width}x${canvas.height}, scale ${scaleX.toFixed(2)}x${scaleY.toFixed(2)}`);

  // Update map image
  const mapaImage = scene.children.list.find(child => child.texture && child.texture.key === 'mapa');
  if (mapaImage) {
    mapaImage.setDisplaySize(canvas.width, canvas.height);
    mapaImage.setPosition(0, 0);
  }

  // Mobile-specific adjustments for viewport height
  const isMobile = isMobileDevice();
  const isSmallMobile = isSmallMobileDevice();
  const isLandscape = isMobileLandscape();
  
  if (isMobile) {
    // Get the actual available height by checking the HUD position
    const hudTop = document.querySelector('.hud-top');
    if (hudTop) {
      const hudHeight = hudTop.offsetHeight;
      const hudBottom = hudTop.offsetTop + hudHeight;
      const availableHeight = window.innerHeight - hudBottom;
      
      // Update canvas style to use actual available height
      const canvasElement = document.querySelector('canvas');
      if (canvasElement) {
        canvasElement.style.height = `${availableHeight}px`;
        canvasElement.style.top = `${hudBottom}px`;
        canvasElement.style.position = 'absolute';
        canvasElement.style.left = '0';
        canvasElement.style.right = '0';
        canvasElement.style.bottom = '0';
        canvasElement.style.width = '100%';
        canvasElement.style.objectFit = 'fill';
        
        // Additional mobile optimizations
        if (isSmallMobile) {
          canvasElement.style.touchAction = 'none';
          canvasElement.style.userSelect = 'none';
        }
        
        if (isLandscape) {
          // Landscape-specific adjustments
          canvasElement.style.height = `${Math.max(availableHeight, window.innerHeight * 0.8)}px`;
        }
      }
    }
  }

  // Update territories
  gameState.paises.forEach(pais => {
    if (pais.polygon) {
      // Scale polygon position
      const originalX = pais.polygon.getData('originalX') || pais.polygon.x;
      const originalY = pais.polygon.getData('originalY') || pais.polygon.y;
      
      // Store original positions if not already stored
      if (!pais.polygon.getData('originalX')) {
        pais.polygon.setData('originalX', pais.polygon.x);
        pais.polygon.setData('originalY', pais.polygon.y);
      }

      pais.polygon.setPosition(originalX * scaleX, originalY * scaleY);
      pais.polygon.setScale(scaleX, scaleY);
    }

    // Update text position
    if (pais.text) {
      const originalX = pais.text.getData('originalX') || pais.text.x;
      const originalY = pais.text.getData('originalY') || pais.text.y;
      
      if (!pais.text.getData('originalX')) {
        pais.text.setData('originalX', pais.text.x);
        pais.text.setData('originalY', pais.text.y);
      }

      pais.text.setPosition(originalX * scaleX, originalY * scaleY);
      pais.text.setScale(Math.min(scaleX, scaleY)); // Keep text readable
    }

    // Update troop circle position
    if (pais.troopCircle) {
      const originalX = pais.troopCircle.getData('originalX') || pais.troopCircle.x;
      const originalY = pais.troopCircle.getData('originalY') || pais.troopCircle.y;
      
      if (!pais.troopCircle.getData('originalX')) {
        pais.troopCircle.setData('originalX', pais.troopCircle.x);
        pais.troopCircle.setData('originalY', pais.troopCircle.y);
      }

      pais.troopCircle.setPosition(originalX * scaleX, originalY * scaleY);
      pais.troopCircle.setScale(Math.min(scaleX, scaleY));
    }

    // Update troop text position
    if (pais.troopText) {
      const originalX = pais.troopText.getData('originalX') || pais.troopText.x;
      const originalY = pais.troopText.getData('originalY') || pais.troopText.y;
      
      if (!pais.troopText.getData('originalX')) {
        pais.troopText.setData('originalX', pais.troopText.x);
        pais.troopText.setData('originalY', pais.troopText.y);
      }

      pais.troopText.setPosition(originalX * scaleX, originalY * scaleY);
      pais.troopText.setScale(Math.min(scaleX, scaleY));
    }
  });

  // Update modals if they are open
  if (modalObjetivoAberto || modalCartasTerritorioAberto) {
    // Find and update overlay and container
    const overlay = scene.children.list.find(child => child.type === 'Rectangle' && child.depth === 20);
    const container = scene.children.list.find(child => child.type === 'Container' && child.depth === 21);
    
    if (overlay) {
      overlay.setPosition(canvas.width / 2, canvas.height / 2);
      overlay.setDisplaySize(canvas.width, canvas.height);
    }
    
    if (container) {
      container.setPosition(canvas.width / 2, canvas.height / 2);
    }
  }

  // Update turn indication if open
  if (window.indicacaoInicioTurno && window.indicacaoInicioTurno.container) {
    window.indicacaoInicioTurno.container.setPosition(canvas.width / 2, canvas.height / 2);
  }



  // Update continent indicator lines
  atualizarLinhasContinentes(scene, scaleX, scaleY);
}

function initializeGame() {
  console.log('🔧 DEBUG: initializeGame() iniciada');
  console.log('🔧 DEBUG: currentRoomId:', currentRoomId);
  console.log('🔧 DEBUG: playerUsername:', playerUsername);
  
  // Use existing socket from lobby
  const socket = getSocket();
  
  if (!socket) {
    console.error('❌ Socket não encontrado!');
    return;
  }
  console.log('🔧 DEBUG: Socket encontrado:', socket.connected);
  
  // Configure event listeners BEFORE creating Phaser
  console.log('🔧 DEBUG: Configurando event listeners...');
  
  // Chat message listener
  socket.on('chatMessage', (dados) => {
    addChatMessage(dados.player, dados.message, new Date(dados.timestamp));
    
    // Play sound if message is from another player and chat is not open
    const gameState = getGameState();
    if (gameState && dados.player !== (playerUsername || gameState.meuNome) && !gameState.historyPopupVisible) {
      tocarSomHuh();
    }
  });
  
  // Game state update listener
  socket.on('estadoAtualizado', (estado) => {
    console.log('🔄 Estado atualizado recebido!');
    console.log('🔧 DEBUG: Estado recebido:', {
      turno: estado.turno,
      meuNome: estado.meuNome,
      paisesCount: estado.paises ? estado.paises.length : 'undefined',
      jogadoresCount: estado.jogadores ? estado.jogadores.length : 'undefined',
      tropasReforco: estado.tropasReforco,
      vitoria: estado.vitoria,
      derrota: estado.derrota
    });
    console.log('🎯 CurrentScene:', currentScene);
    console.log('🗺️ Países recebidos:', estado.paises ? estado.paises.length : 'undefined');
    console.log('🎮 Turno atual:', estado.turno);
    console.log('👤 Meu nome:', estado.meuNome);
    console.log('📊 Estado completo:', estado);
    
    const gameState = getGameState();
    if (!gameState) {
      console.error('❌ Game state não disponível para atualizar estado');
      return;
    }
    
    gameState.jogadores = estado.jogadores;
    const previousTurn = gameState.turno; // Store previous turn
    gameState.turno = estado.turno;
    
          // Reset timer expiration flag when turn changes
      if (previousTurn !== gameState.turno) {
        console.log('🔄 TURN CHANGE DETECTED!');
        console.log('🔄 Previous turn:', previousTurn);
        console.log('🔄 New turn:', gameState.turno);
        console.log('🔄 My name:', gameState.meuNome);
        console.log('🔄 Is my turn?', gameState.meuNome === gameState.turno);
        console.log('🔄 Current forcedTurnCount before logic:', forcedTurnCount);
        
        timerJustExpired = false;
        console.log('🔄 Timer flag reset');
        
        // Stop any existing timer when turn changes
        if (isPlayerTurn) {
          console.log('🔄 Stopping existing timer');
          stopTurnTimer();
        }
        
        // Hide turn confirmation popup when turn changes
        console.log('🔄 Hiding turn confirmation popup');
        hideTurnConfirmationPopup();
        
        // Show turn start indication if it's the player's turn
        if (gameState.meuNome === gameState.turno && currentScene) {
          console.log('🎯 Showing turn start indication for player:', gameState.meuNome);
          mostrarIndicacaoInicioTurno(gameState.meuNome, currentScene);
        }
        
        // Only reset forced turn count when turn changes to a different player
        if (gameState.meuNome !== gameState.turno) {
          console.log('🔄 Turn changed to different player - resetting forced turn count from', forcedTurnCount, 'to 0');
          forcedTurnCount = 0;
          lastTurnForPlayer = null; // Reset turn tracker when turn changes to different player
          lastProcessedTurn = null; // Reset processed turn tracker when turn changes to different player
          logForcedTurnCount();
        } else {
          // Keep the forced turn count when it's still the same player's turn
          console.log('🔄 Same player turn - keeping forced turn count:', forcedTurnCount);
          logForcedTurnCount();
        }
      } else {
        console.log('🔄 No turn change - same turn:', gameState.turno);
        console.log('🔄 Current forcedTurnCount:', forcedTurnCount);
      }
    
    gameState.tropasReforco = estado.tropasReforco;
    gameState.tropasBonusContinente = estado.tropasBonusContinente || {};
    gameState.vitoria = estado.vitoria;
    gameState.derrota = estado.derrota;
    gameState.meuNome = estado.meuNome;
    gameState.continentes = estado.continentes || {};
    gameState.continentePrioritario = estado.continentePrioritario || null;
    gameState.faseRemanejamento = estado.faseRemanejamento || false;
    gameState.cartasTerritorio = estado.cartasTerritorio || {};

    if (currentScene && estado.paises) {
      console.log('✅ Chamando atualizarPaises...');
      atualizarPaises(estado.paises, currentScene);
      
      // Verificar conquista de continente após atualizar os países
      if (gameState.ultimaConquista) {
        console.log('🔍 Verificando conquista de continente após atualização do estado...');
        verificarConquistaContinente(
          gameState.ultimaConquista.territorio, 
          gameState.ultimaConquista.jogador, 
          gameState.ultimaConquista.scene
        );
        // Limpar dados da última conquista após verificar
        delete gameState.ultimaConquista;
      }
      
      // Só atualizar HUD se a scene estiver pronta
      atualizarHUD();
      atualizarTextoBotaoTurno();
    } else {
      console.log('⏳ Aguardando Phaser scene estar pronta...');
      console.log('currentScene:', currentScene);
      console.log('estado.paises:', estado.paises);
      
      // Armazenar o estado para processar quando a scene estiver pronta
      pendingGameState = estado;
      console.log('💾 Estado armazenado para processamento posterior');
    }

    const jogadorLocal = gameState.jogadores.find(j => j.nome === gameState.meuNome);


  });
  
  // Other game event listeners
  socket.on('mostrarMensagem', (texto) => {
    mostrarMensagem(texto);
  });

  socket.on('adicionarAoHistorico', (mensagem) => {
    const gameState = getGameState();
    if (!gameState) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const historyEntry = {
      timestamp: timestamp,
      message: mensagem
    };
    
    gameState.actionHistory.push(historyEntry);
    
    // Keep only the last N entries
    if (gameState.actionHistory.length > gameState.actionHistoryMaxSize) {
      gameState.actionHistory.shift();
    }
    
    // Update history display if popup is visible
    if (gameState.historyPopupVisible) {
      updateHistoryDisplay();
    }
  });

  socket.on('mostrarEfeitoAtaque', (dados) => {
    mostrarEfeitoAtaque(dados.origem, dados.destino, currentScene, dados.sucesso);
  });

  socket.on('mostrarEfeitoReforco', (dados) => {
    mostrarEfeitoReforco(dados.territorio, dados.jogador, currentScene);
  });

  socket.on('mostrarEfeitoExplosaoTropas', (dados) => {
    mostrarEfeitoExplosaoTropas(dados.territorio, currentScene);
  });

  socket.on('mostrarEfeitoExplosaoConquista', (dados) => {
    mostrarEfeitoExplosaoConquista(dados.territorio, dados.jogador, currentScene);
  });

  socket.on('vitoria', (nomeJogador, resumoJogo) => {
    console.log('🏆 Evento vitoria recebido para jogador:', nomeJogador);
    console.log('📊 Resumo do jogo:', resumoJogo);
    
    // Mostrar tela de vitória moderna
    if (currentScene) {
      mostrarTelaVitoria(nomeJogador, resumoJogo, currentScene);
    } else {
      console.log('❌ Scene não disponível para mostrar tela de vitória');
      mostrarMensagem(`Jogador ${nomeJogador} venceu!`);
    }
  });

  socket.on('derrota', () => {
    mostrarMensagem(`Você perdeu!`);
  });

  socket.on('tocarSomTiro', () => {
    tocarSomTiro();
  });

  socket.on('tocarSomMovimento', () => {
    tocarSomMovimento();
  });

  socket.on('tocarSomTakeCard', () => {
    tocarSomTakeCard();
  });

  socket.on('territorioConquistado', (dados) => {
    console.log('🎯 EVENTO territorioConquistado RECEBIDO!');
    console.log('📋 Dados recebidos:', dados);
    console.log('🎮 Current scene:', currentScene);
    
    const gameState = getGameState();
    if (!gameState) {
      console.log('❌ Game state não disponível');
      return;
    }
    
    console.log('✅ Game state obtido, armazenando dados para verificação posterior...');
    
    // Armazenar dados da conquista para verificar depois que o estado for atualizado
    gameState.ultimaConquista = {
      territorio: dados.territorioConquistado,
      jogador: dados.jogadorAtacante,
      scene: currentScene
    };
    
    // Só mostrar a interface para o jogador atacante se há tropas adicionais
    if (dados.jogadorAtacante === gameState.meuNome && dados.tropasAdicionais > 0) {
      // Verificar se já existe uma interface aberta
      if (interfaceTransferenciaConquista) {
        console.log('🔧 DEBUG: Interface de transferência já está aberta, ignorando');
        return;
      }
      
      dadosConquista = dados;
      console.log('DEBUG: dadosConquista definido como', dadosConquista);
      mostrarInterfaceTransferenciaConquista(dados, currentScene);
    }
  });

  socket.on('mostrarObjetivo', (objetivo) => {
    mostrarObjetivo(objetivo, currentScene);
  });

  socket.on('mostrarCartasTerritorio', (cartas) => {
    // Não abrir se já estiver aberto
    if (modalCartasTerritorioAberto) return;
    mostrarCartasTerritorio(cartas, currentScene);
  });

  socket.on('forcarTrocaCartas', (dados) => {
    const gameState = getGameState();
    if (!gameState) return;
    
    // Só mostrar para o jogador específico
    const jogador = gameState.jogadores.find(j => j.socketId === socket.id);
    if (jogador && jogador.nome === dados.jogador) {
      mostrarCartasTerritorio(dados.cartas, currentScene, true);
    }
  });

  socket.on('resultadoTrocaCartas', (resultado) => {
    console.log('🔧 resultadoTrocaCartas recebido:', resultado);
    
    if (resultado.sucesso) {
      console.log('✅ Troca de cartas bem-sucedida');
      mostrarMensagem(resultado.mensagem);
      // Fechar modal e continuar o turno
      modalCartasTerritorioAberto = false;
      // Destruir elementos do modal se existirem
      if (currentScene) {
        const overlay = currentScene.children.list.find(child => child.type === 'Rectangle' && child.depth === 20);
        const container = currentScene.children.list.find(child => child.type === 'Container' && child.depth === 21);
        if (overlay) overlay.destroy();
        if (container) container.destroy();
      }
    } else {
      console.log('❌ Troca de cartas falhou:', resultado.mensagem);
      mostrarMensagem(`❌ ${resultado.mensagem}`);
    }
  });

  socket.on('iniciarFaseRemanejamento', () => {
    mostrarMensagem('🔄 Fase de remanejamento iniciada. Clique em um território para mover tropas.');
  });

  socket.on('resultadoVerificacaoMovimento', (resultado) => {
    console.log('🔧 DEBUG: resultadoVerificacaoMovimento recebido:', resultado);
    
    const gameState = getGameState();
    if (!gameState) return;
    
    if (resultado.podeMover) {
      console.log('🔧 DEBUG: Movimento aprovado, mostrando interface de remanejamento');
      // Encontrar os territórios selecionados
      const territorioOrigem = gameState.paises.find(p => p.nome === gameState.selecionado.nome);
      const territorioDestino = gameState.paises.find(p => p.nome === resultado.territorioDestino);
      
      console.log('🔧 DEBUG: Território origem encontrado:', territorioOrigem ? territorioOrigem.nome : 'não encontrado');
      console.log('🔧 DEBUG: Território destino encontrado:', territorioDestino ? territorioDestino.nome : 'não encontrado');
      
      if (territorioOrigem && territorioDestino) {
        // Verificar se já existe uma interface aberta
        if (interfaceRemanejamento) {
          console.log('🔧 DEBUG: Interface de remanejamento já está aberta, ignorando');
          return;
        }
        
        mostrarInterfaceRemanejamento(territorioOrigem, territorioDestino, currentScene, resultado.quantidadeMaxima);
      } else {
        console.log('🔧 DEBUG: Erro - territórios não encontrados no gameState');
      }
    } else {
      console.log('🔧 DEBUG: Movimento negado:', resultado.motivo);
      mostrarMensagem(`❌ ${resultado.motivo}`);
      limparSelecao();
    }
  });
  
  console.log('🔧 DEBUG: Event listeners configurados');
  
  // Create Phaser game only after login
  const config = {
    type: Phaser.AUTO,
    width: 1280, // resolução base
    height: 720,
    backgroundColor: '#1a1a1a',
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%'
    },
    scene: {
      preload,
      create
    }
  };
  
  // Initialize Phaser game
  console.log('🎮 Criando instância do Phaser...');
  const game = new Phaser.Game(config);
  window.game = game; // Make game globally available
  console.log('✅ Phaser criado com sucesso!');
  
  // Add resize listener for responsive scaling
  window.addEventListener('resize', () => {
    const canvas = document.querySelector('canvas');
    if (canvas && window.game && window.game.scene.scenes[0]) {
      const scene = window.game.scene.scenes[0];
      resizeGameElements(scene);
      updateAllResponsiveElements();
    }
  });

  // Add orientation change listener for mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && window.game && window.game.scene.scenes[0]) {
        const scene = window.game.scene.scenes[0];
        resizeGameElements(scene);
        forceMobileCanvasPosition();
        updateAllResponsiveElements();
        console.log('📱 Game elements adjusted for orientation change');
      }
    }, 100);
  });

  // Add viewport height change listener for mobile (address bar show/hide)
  let lastViewportHeight = window.innerHeight;
  window.addEventListener('resize', () => {
    const isMobile = isMobileDevice();
    if (isMobile && Math.abs(window.innerHeight - lastViewportHeight) > 50) {
      // Significant height change detected (likely address bar show/hide)
      setTimeout(() => {
        const canvas = document.querySelector('canvas');
        if (canvas && window.game && window.game.scene.scenes[0]) {
          const scene = window.game.scene.scenes[0];
          resizeGameElements(scene);
          forceMobileCanvasPosition();
          updateAllResponsiveElements();
          console.log('📱 Game elements adjusted for viewport height change');
        }
      }, 100);
      lastViewportHeight = window.innerHeight;
    }
  });
  
  console.log('🔧 DEBUG: initializeGame() concluída');
  
  // Force mobile positioning after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.innerWidth <= 768) {
        setTimeout(forceMobileCanvasPosition, 200);
      }
    });
  } else {
    if (window.innerWidth <= 768) {
      setTimeout(forceMobileCanvasPosition, 200);
    }
  }
}

function initializeLobby() {
  console.log('🎮 Inicializando lobby global...');
  
  // Show lobby screen
  const lobbyScreen = document.getElementById('lobby-screen');
  if (lobbyScreen) lobbyScreen.style.display = 'flex';
  
  // Connect to socket if not already connected
  const socket = getSocket() || io();
  window.socket = socket;
  
  // Check if socket is already connected
  if (socket.connected) {
    console.log('Socket já conectado, iniciando lobby global...');
    
    // Emit player joined global lobby event
    socket.emit('playerJoinedGlobalLobby', { 
      username: playerUsername
    });
    
    // Start lobby timer
    startLobbyTimer();
  } else {
    // Wait for socket connection before starting lobby
    socket.on('connect', () => {
      console.log('Socket conectado, iniciando lobby global...');
      
      // Emit player joined global lobby event
      socket.emit('playerJoinedGlobalLobby', { 
        username: playerUsername
      });
      
      // Start lobby timer
      startLobbyTimer();
    });
  }
  
  // Handle connection errors
  socket.on('connect_error', (error) => {
    console.error('Erro ao conectar com o servidor:', error);
    alert('Erro ao conectar com o servidor. Tente novamente.');
  });
  
  // Lobby events
  socket.on('globalLobbyUpdate', (data) => {
    updateLobbyDisplay(data);
  });
  
  socket.on('gameStarting', (data) => {
    console.log('🎮 Recebido evento gameStarting do servidor!');
    if (data && data.roomId) {
      currentRoomId = data.roomId; // Set the room ID assigned by server
      startGame();
    } else {
      console.log('⚠️ Evento gameStarting recebido sem roomId, ignorando...');
    }
  });
  
  // Chat message listener (for lobby chat if needed)
  socket.on('chatMessage', (dados) => {
    // Could implement lobby chat here if needed
  });
}

function startLobbyTimer() {
  console.log('⏰ Timer do lobby será controlado pelo servidor');
  // Timer is now controlled by server via lobbyUpdate events
  // We just need to wait for the first lobbyUpdate to sync the timer
}

function updateLobbyTimerDisplay() {
  const timerDisplay = document.getElementById('lobby-timer-display');
  const timerElement = document.getElementById('lobby-timer');
  
  if (!timerDisplay) {
    console.error('❌ Elemento lobby-timer-display não encontrado!');
    return;
  }
  
  const minutes = Math.floor(lobbyTimeLeft / 60);
  const seconds = lobbyTimeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  timerDisplay.textContent = timeString;
  
  // Update visual state based on time remaining
  if (timerElement) {
    timerElement.className = 'lobby-timer';
    if (lobbyTimeLeft <= 10) {
      timerElement.classList.add('danger');
    } else if (lobbyTimeLeft <= 30) {
      timerElement.classList.add('warning');
    }
  }
}

function updateLobbyDisplay(data) {
  // Sync timer with server
  if (data.timeLeft !== undefined) {
    lobbyTimeLeft = data.timeLeft;
    updateLobbyTimerDisplay();
  }
  
  const playersList = document.getElementById('lobby-players-list');
  const statusText = document.getElementById('lobby-status-text');
  
  if (!playersList || !statusText) return;
  
  // Update players list
  playersList.innerHTML = '';
  data.players.forEach(player => {
    const playerElement = document.createElement('div');
    playerElement.className = 'lobby-player';
    
    const avatar = document.createElement('div');
    avatar.className = 'lobby-player-avatar';
    avatar.textContent = '👤';
    
    const name = document.createElement('div');
    name.className = 'lobby-player-name';
    name.textContent = player.username;
    
    const status = document.createElement('div');
    status.className = 'lobby-player-status';
    status.textContent = 'Conectado';
    status.classList.add('connected');
    
    playerElement.appendChild(avatar);
    playerElement.appendChild(name);
    playerElement.appendChild(status);
    playersList.appendChild(playerElement);
  });
  
  // Add placeholder players for remaining slots
  const remainingSlots = data.totalPlayers - data.players.length;
  for (let i = 0; i < remainingSlots; i++) {
    const playerElement = document.createElement('div');
    playerElement.className = 'lobby-player';
    
    const avatar = document.createElement('div');
    avatar.className = 'lobby-player-avatar';
    avatar.textContent = '🤖';
    
    const name = document.createElement('div');
    name.className = 'lobby-player-name';
    name.textContent = `CPU ${i + 1}`;
    
    const status = document.createElement('div');
    status.className = 'lobby-player-status';
    status.textContent = 'CPU';
    status.classList.add('cpu');
    
    playerElement.appendChild(avatar);
    playerElement.appendChild(name);
    playerElement.appendChild(status);
    playersList.appendChild(playerElement);
  }
  
  // Update status text
  const connectedPlayers = data.players.length;
  const totalPlayers = data.totalPlayers;
  
  if (data.timeLeft <= 0) {
    statusText.textContent = 'Criando sala e iniciando jogo...';
  } else if (connectedPlayers === totalPlayers) {
    statusText.textContent = 'Todos os jogadores conectados! Iniciando jogo...';
  } else {
    statusText.textContent = `${connectedPlayers}/${totalPlayers} jogadores conectados. Aguardando mais jogadores...`;
  }
}

function startGame() {
  console.log('🔧 DEBUG: startGame() iniciada no cliente');
  console.log('🎮 Iniciando jogo...');
  console.log('🔧 DEBUG: currentRoomId:', currentRoomId);
  console.log('🔧 DEBUG: gameStarted antes:', gameStarted);
  
  gameStarted = true;
  console.log('🔧 DEBUG: gameStarted após:', gameStarted);
  
  // Clear lobby timer
  if (lobbyTimerInterval) {
    clearInterval(lobbyTimerInterval);
    lobbyTimerInterval = null;
    console.log('🔧 DEBUG: Timer do lobby limpo');
  }
  
  // Hide lobby and show game
  const lobbyScreen = document.getElementById('lobby-screen');
  const gameContainer = document.getElementById('game-container');
  
  console.log('🔧 DEBUG: lobbyScreen encontrado:', !!lobbyScreen);
  console.log('🔧 DEBUG: gameContainer encontrado:', !!gameContainer);
  
  if (lobbyScreen) {
    lobbyScreen.style.display = 'none';
    console.log('🔧 DEBUG: Lobby ocultado');
  }
  if (gameContainer) {
    gameContainer.style.display = 'block';
    console.log('🔧 DEBUG: Game container exibido');
  }
  
  // Initialize the game
  console.log('🔧 DEBUG: Chamando initializeGame()');
  initializeGame();
  console.log('🔧 DEBUG: startGame() concluída');
}



// Lobby variables
let lobbyTimeLeft = 30; // 30 seconds
let lobbyTimerInterval = null;
let lobbyPlayers = [];
let gameStarted = false;

// Game state management for multi-room support
let gameStates = new Map(); // Map to store game states for each room

// Store pending game state updates until scene is ready
let pendingGameState = null;

// Helper function to get current room's game state
function getGameState() {
  if (!currentRoomId) {
    console.error('currentRoomId não disponível para obter game state');
    return null;
  }
  
  if (!gameStates.has(currentRoomId)) {
    // Initialize game state for this room
    gameStates.set(currentRoomId, {
      paises: [],
      jogadores: [],
      turno: null,
      tropasReforco: 0,
      tropasBonusContinente: {}, // Track bonus troops by continent
      selecionado: null,
      meuNome: null,
      continentes: {},
      continentePrioritario: null, // Continente com prioridade para reforço
      faseRemanejamento: false, // Controla se está na fase de remanejamento
      cartasTerritorio: {}, // Cartas território do jogador
      actionHistory: [], // Array to store action history
      actionHistoryMaxSize: 50, // Maximum number of history entries to keep
      historyPopupVisible: false, // Track if history popup is visible
      chatMessages: [], // Array to store chat messages
      chatMessagesMaxSize: 100, // Maximum number of chat messages to keep
      currentTab: 'chat', // Track current active tab
      unreadMessages: 0, // Track unread messages
      vitoria: false,
      derrota: false,
      // Variáveis para interface de reforço (específicas por sala)
      tropasParaColocar: 0,
      territorioSelecionadoParaReforco: null
    });
  }
  
  return gameStates.get(currentRoomId);
}

// Helper function to clear game state when leaving a room
function clearGameState(roomId) {
  if (gameStates.has(roomId)) {
    gameStates.delete(roomId);
    console.log(`🧹 Game state cleared for room: ${roomId}`);
  }
}

// Process pending game state when scene is ready
function processarEstadoPendente() {
  if (!pendingGameState || !currentScene) {
    console.log('❌ Nenhum estado pendente ou scene não pronta');
    return;
  }
  
  console.log('🔄 Processando estado pendente com scene pronta...');
  
  const gameState = getGameState();
  if (!gameState) {
    console.error('❌ Game state não disponível para processar estado pendente');
    return;
  }
  
  // Atualizar game state com os dados pendentes
  gameState.jogadores = pendingGameState.jogadores;
  gameState.turno = pendingGameState.turno;
  gameState.tropasReforco = pendingGameState.tropasReforco;
  gameState.tropasBonusContinente = pendingGameState.tropasBonusContinente || {};
  gameState.vitoria = pendingGameState.vitoria;
  gameState.derrota = pendingGameState.derrota;
  gameState.meuNome = pendingGameState.meuNome;
  gameState.continentes = pendingGameState.continentes || {};
  gameState.continentePrioritario = pendingGameState.continentePrioritario || null;
  gameState.faseRemanejamento = pendingGameState.faseRemanejamento || false;
  gameState.cartasTerritorio = pendingGameState.cartasTerritorio || {};
  
  // Processar países
  if (pendingGameState.paises) {
    console.log('✅ Processando países pendentes...');
    atualizarPaises(pendingGameState.paises, currentScene);
  }
  
  // Atualizar HUD
  atualizarHUD();
  atualizarTextoBotaoTurno();
  
  // Verificar condições de jogo
  const jogadorLocal = gameState.jogadores.find(j => j.nome === gameState.meuNome);
  
  if (jogadorLocal && !jogadorLocal.ativo) {
    perdeuJogo(`Você perdeu!`, this);
    return;
  } else {
    desbloquearJogo();
  }
  

  
  // Verificar se é o primeiro turno do jogador e mostrar indicação
  if (gameState.meuNome === gameState.turno && currentScene) {
    console.log('🎯 Primeiro turno detectado - mostrando indicação de início de turno para:', gameState.meuNome);
    // Usar setTimeout para garantir que a scene esteja totalmente pronta
    setTimeout(() => {
      mostrarIndicacaoInicioTurno(gameState.meuNome, currentScene);
    }, 500);
  }
  
  // Limpar estado pendente
  pendingGameState = null;
  console.log('✅ Estado pendente processado com sucesso!');
}

// Get socket from global scope
function getSocket() {
  return window.socket;
}

// Helper function to emit events with room ID
function emitWithRoom(event, data = {}) {
  const socket = getSocket();
  console.log(`📤 emitWithRoom called for event: ${event}`);
  console.log(`📤 Socket available:`, !!socket);
  console.log(`📤 currentRoomId:`, currentRoomId);
  console.log(`📤 Data:`, data);
  
  if (socket && currentRoomId) {
    // Handle different data types
    if (typeof data === 'string') {
      // If data is a string (like country name), send it directly
      console.log(`📤 Emitting string data: ${data}`);
      socket.emit(event, data);
    } else if (Array.isArray(data)) {
      // If data is an array, send it directly (don't add roomId to arrays)
      console.log(`📤 Emitting array data:`, data);
      socket.emit(event, data);
    } else {
      // If data is an object, spread it and add roomId
      const eventData = { ...data, roomId: currentRoomId };
      console.log(`📤 Emitting object data:`, eventData);
      socket.emit(event, eventData);
    }
  } else {
    console.error('❌ Socket ou roomId não disponível para emitir evento:', event);
  }
}

// Cores dos jogadores
const coresDosDonos = {
  Azul: 0x3366ff,
  Vermelho: 0xff3333,
  Amarelo: 0xffcc00,
  Verde: 0x33cc33,
  Roxo: 0x9933cc,
  Preto: 0x222222
};



let botaoTurno;
let currentScene = null; // Global reference to current Phaser scene




// Variáveis para sons
let somTiro;
let somMovimento;
let somClick;
let somHuh;

// Variáveis para interface de reforço
let interfaceReforco = null;

// Variáveis para interface de transferência após conquista
let interfaceTransferenciaConquista = null;

// Variáveis para interface de remanejamento
let interfaceRemanejamento = null;
let tropasParaTransferir = 0;
let dadosConquista = null;
let botaoObjetivo = null;
let modalObjetivoAberto = false;
let botaoCartasTerritorio = null;
let modalCartasTerritorioAberto = false;

function preload() {
  console.log('📦 Preload iniciado...');
  
  // Load map image with error handling
  this.load.image('mapa', 'assets/mapa.png');
  this.load.on('loaderror', (file) => {
    console.error('❌ Erro ao carregar arquivo:', file.src);
  });
  this.load.on('complete', () => {
    console.log('✅ Todos os arquivos carregados com sucesso!');
  });
  
  this.load.audio('shotsfired', 'assets/shotsfired.mp3');
  this.load.audio('armymoving', 'assets/armymoving.mp3');
  this.load.audio('clicksound', 'assets/clicksound.mp3');
  this.load.audio('huh', 'assets/huh.mp3');
  this.load.audio('takecard', 'assets/takecard.mp3');
  this.load.audio('clockticking', 'assets/clockticking.mp3');
  console.log('✅ Preload concluído!');
}

function create() {
  console.log('🎨 Create iniciado...');
  currentScene = this; // Set global reference to current scene
  console.log('🎯 CurrentScene definido:', currentScene);
  
  const largura = this.sys.game.config.width;
  const altura = this.sys.game.config.height;
  console.log('📐 Dimensões:', largura, 'x', altura);
  
  // Debug canvas information
  console.log('🎨 Game canvas:', this.sys.game.canvas);
  console.log('🎨 Game canvas width:', this.sys.game.canvas.width);
  console.log('🎨 Game canvas height:', this.sys.game.canvas.height);
  console.log('🎨 Game canvas style:', this.sys.game.canvas.style);
  
  // Check if canvas is in DOM
  const canvasInDOM = document.querySelector('canvas');
  console.log('🎨 Canvas in DOM:', canvasInDOM);
  if (canvasInDOM) {
    console.log('🎨 Canvas display style:', canvasInDOM.style.display);
    console.log('🎨 Canvas visibility:', canvasInDOM.style.visibility);
    console.log('🎨 Canvas opacity:', canvasInDOM.style.opacity);
    console.log('🎨 Canvas z-index:', canvasInDOM.style.zIndex);
    console.log('🎨 Canvas margin-top:', canvasInDOM.style.marginTop);
    console.log('🎨 Canvas margin-left:', canvasInDOM.style.marginLeft);
    console.log('🎨 Canvas position:', canvasInDOM.style.position);
    console.log('🎨 Canvas top:', canvasInDOM.style.top);
    console.log('🎨 Canvas left:', canvasInDOM.style.left);
  }

  // Add map image with full stretch to fill screen
  const mapaImage = this.add.image(0, 0, 'mapa')
    .setOrigin(0, 0)
    .setDisplaySize(this.sys.game.canvas.width, this.sys.game.canvas.height);
  console.log('🗺️ Imagem do mapa adicionada!');
  console.log('🗺️ Mapa image object:', mapaImage);
  console.log('🗺️ Mapa visible:', mapaImage.visible);
  console.log('🗺️ Mapa alpha:', mapaImage.alpha);
  console.log('🗺️ Mapa scale:', mapaImage.scale);
  
  // Force canvas positioning after a short delay
  setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.marginTop = '0px';
      canvas.style.marginLeft = '0px';
      canvas.style.position = 'absolute';
      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.transform = 'none';
      canvas.style.zIndex = '1';
      
      // Mobile-specific adjustments
      const isMobile = window.innerWidth <= 768;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isMobile || isIOS) {
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        console.log('📱 Mobile canvas adjustments applied');
      }
      
      console.log('🎨 Canvas positioning forced and centered!');
    }
  }, 100);

  // Criar sons
  somTiro = this.sound.add('shotsfired');
  somMovimento = this.sound.add('armymoving');
  somClick = this.sound.add('clicksound');
  somHuh = this.sound.add('huh');
  somTakeCard = this.sound.add('takecard');
  somClockTicking = this.sound.add('clockticking');

  // Adicionar indicadores de continentes (será chamado após os territórios serem carregados)

    // Initialize CSS HUD elements
  initializeCSSHUD();

  // Initialize action history system
  initializeActionHistory();

  // Initialize player info modal
  initializePlayerInfoModal();

  // Initialize CSS-based buttons
  botaoTurno = document.getElementById('btn-turn');
  botaoObjetivo = document.getElementById('btn-objective');
  botaoCartasTerritorio = document.getElementById('btn-cards');

  // Add event listeners for CSS buttons
  botaoTurno.addEventListener('click', () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    const gameState = getGameState();
    if (!gameState || gameState.vitoria || gameState.derrota) return;
    tocarSomClick();
    stopTurnTimer(); // Stop timer when manually ending turn
    emitWithRoom('passarTurno');
  });

  botaoObjetivo.addEventListener('click', () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    tocarSomClick();
    emitWithRoom('consultarObjetivo');
  });

  botaoCartasTerritorio.addEventListener('click', () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    const gameState = getGameState();
    
    // Verificar se está na fase de remanejamento
    if (gameState && gameState.faseRemanejamento) {
      console.log('❌ Tentativa de trocar cartas durante fase de remanejamento - bloqueado');
      return;
    }
    
    tocarSomClick();
    emitWithRoom('consultarCartasTerritorio');
  });

  // CSS HUD handles positioning automatically
  // No need for manual positioning anymore
  
  // Adicionar listener para redimensionamento da janela
  window.addEventListener('resize', () => {
    if (game && game.scene && game.scene.getScene('GameScene')) {
      const currentScene = game.scene.getScene('GameScene');
      resizeGameElements(currentScene);
    }
  });


   
       // DEBUG: Detectar cliques fora dos territórios
    this.input.on('pointerdown', (pointer) => {
      // Fechar indicação de início de turno automaticamente em qualquer interação
      fecharIndicacaoInicioTurnoAutomatico();
      
      const gameState = getGameState();
      if (!gameState) return;
      
      // Verificar se o clique foi em algum território
      const territorioClicado = gameState.paises.find(pais => {
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
      
      if (interfaceRemanejamento) {
        const localX = pointer.x - interfaceRemanejamento.x;
        const localY = pointer.y - interfaceRemanejamento.y;
        // Aumentar a área de detecção para incluir todos os botões
        if (localX >= -150 && localX <= 150 && localY >= -90 && localY <= 90) {
          cliqueEmInterface = true;
          console.log('DEBUG: Clique detectado dentro da interface de remanejamento');
        }
      }
      
      // Verificar se há modais abertos (objetivo ou cartas território)
      if (modalObjetivoAberto || modalCartasTerritorioAberto) {
        cliqueEmInterface = true;
        console.log('DEBUG: Clique detectado dentro de modal aberto');
      }
      
      // Se clicou em uma interface, não fazer nada mais
      if (cliqueEmInterface) {
        return;
      }
      
      // Remover a funcionalidade de esconder interfaces ao clicar fora
      // As interfaces agora só podem ser fechadas pelos seus próprios botões
    });

  // Event listeners are now configured in initializeGame() before Phaser creation

  // All event listeners are now configured in initializeGame() before Phaser creation
  
  console.log('✅ Create concluído! Jogo pronto para receber dados do servidor.');
  
  // Processar estado pendente se houver
  if (pendingGameState) {
    console.log('🔄 Processando estado pendente...');
    processarEstadoPendente();
  }

  // Initial resize to ensure proper scaling
  setTimeout(() => {
    resizeGameElements(this);
    
    // Force mobile canvas positioning
    if (window.innerWidth <= 768) {
      forceMobileCanvasPosition();
    }
  }, 100);
}



function atualizarPaises(novosPaises, scene) {
  console.log('🔧 DEBUG: atualizarPaises() iniciada');
  console.log('🗺️ atualizarPaises chamada com:', novosPaises.length, 'países');
  console.log('🎮 Scene:', scene);
  console.log('🔧 DEBUG: Primeiros 3 países:', novosPaises.slice(0, 3).map(p => ({
    nome: p.nome,
    dono: p.dono,
    tropas: p.tropas,
    x: p.x,
    y: p.y
  })));
  
  const gameState = getGameState();
  if (!gameState) {
    console.error('❌ Game state não disponível para atualizar países');
    return;
  }
  console.log('🔧 DEBUG: Game state obtido com sucesso');
  
  // Atualizar dados dos países
  const dadosGeograficos = {
  "Emberlyn": {
    pontos: [402,396,370,405,359,437,368,460,396,459,440,426,434,413,419,406],
    textoX: 402,
    textoY: 396
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

  console.log('📊 Verificando criação de territórios...');
  console.log('📊 paises.length:', gameState.paises.length);
  console.log('📊 novosPaises.length:', novosPaises.length);
  
  if (gameState.paises.length === 0) {
    console.log('✅ Criando territórios pela primeira vez...');
    gameState.paises = novosPaises.map(pais => {
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
    
         // Criar o polígono na posição (minX, minY + 40) com pontos relativos para alinhar com o mapa
     obj.polygon = scene.add.polygon(minX, minY, pontosRelativos, coresDosDonos[pais.dono] || 0xffffff, 0.7);
     obj.polygon.setOrigin(0, 0);
     obj.polygon.setStrokeStyle(4, 0x000000, 1); // Add black border for visibility
     obj.polygon.setInteractive({ 
       useHandCursor: true,
       hitArea: new Phaser.Geom.Polygon(pontosRelativos),
       hitAreaCallback: Phaser.Geom.Polygon.Contains
     });
     
     // Debug logs for first few territories
     if (gameState.paises.length < 5) {
       console.log(`🗺️ Território criado: ${pais.nome}`);
       console.log(`🗺️ Posição: (${minX}, ${minY})`);
       console.log(`🗺️ Cor: ${coresDosDonos[pais.dono] || 0xffffff}`);
       console.log(`🗺️ Pontos: ${pontosRelativos.length} pontos`);
       console.log(`🗺️ Polygon object:`, obj.polygon);
       console.log(`🗺️ Polygon visible:`, obj.polygon.visible);
       console.log(`🗺️ Polygon alpha:`, obj.polygon.alpha);
     }


    // Criar texto com apenas o nome do território (inicialmente invisível)
    obj.text = scene.add.text(centroX, centroY + 10, getTextoPais(pais), {
        fontSize: getResponsiveFontSize(14, 0.8, 0.6),
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 100 },
        backgroundColor: '#000000cc',
        padding: { x: 8, y: 6 },
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(10);
    
    // Inicialmente esconder o texto
    obj.text.setVisible(false);

    // Criar círculo com o número de tropas
    obj.troopCircle = scene.add.circle(centroX, centroY, getResponsiveSize(12, 0.8, 0.6), 0xffffff, 1);
    obj.troopCircle.setStrokeStyle(2, 0x000000, 1);
    obj.troopCircle.setDepth(3);
    
    // Criar texto do número de tropas dentro do círculo
    obj.troopText = scene.add.text(centroX, centroY, pais.tropas.toString(), {
        fontSize: getResponsiveFontSize(14, 0.8, 0.6),
        fill: '#000000',
        align: 'center',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(6);

             // Eventos de hover para mostrar/esconder o texto
             obj.polygon.on('pointerover', (pointer) => {
               obj.text.setVisible(true);
             });
             
             obj.polygon.on('pointerout', (pointer) => {
               obj.text.setVisible(false);
             });
             
             obj.polygon.on('pointerdown', (pointer) => {
         // Fechar indicação de início de turno automaticamente em qualquer interação
         fecharIndicacaoInicioTurnoAutomatico();
         
         // DEBUG: Mostrar coordenadas exatas do clique
         console.log(`DEBUG: Clicou em ${obj.nome} nas coordenadas (${pointer.x}, ${pointer.y})`);
         
         const gameState = getGameState();
         if (!gameState || gameState.vitoria || gameState.derrota) return;
         
         // Verificar se há tropas para colocar (base ou bônus)
         const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
         const temTropasParaColocar = gameState.tropasReforco > 0 || totalBonus > 0;
         
         if (temTropasParaColocar && obj.dono === gameState.turno && gameState.turno === gameState.meuNome) {
           // Verificar se está na fase de remanejamento (não pode colocar reforços)
           if (gameState.faseRemanejamento) {
             mostrarMensagem("❌ Não é possível colocar reforços durante a fase de remanejamento!");
             return;
           }
           
           // Verificar se há tropas de bônus que precisam ser colocadas
           if (totalBonus > 0) {
             // Verificar se este país pertence ao continente prioritário
             let podeReceberBonus = false;
             if (gameState.continentePrioritario) {
               const continente = gameState.continentes[gameState.continentePrioritario.nome];
               if (continente && continente.territorios.includes(obj.nome)) {
                 podeReceberBonus = true;
               }
             }
             
             if (!podeReceberBonus) {
               // Não pode colocar tropas de bônus neste país
               if (gameState.continentePrioritario) {
                 mostrarMensagem(`❌ Primeiro coloque todas as ${totalBonus} tropas de bônus restantes! (${gameState.continentePrioritario.nome}: ${gameState.continentePrioritario.quantidade})`);
               } else {
                 mostrarMensagem("❌ Este país não pertence a nenhum continente com tropas de bônus pendentes!");
               }
               return;
             }
             
             // Verificar se já existe uma interface aberta
             if (interfaceReforco) {
               console.log('🔧 DEBUG: Interface de reforço já está aberta, ignorando clique');
               return;
             }
             
             // Pode colocar tropa de bônus neste país
             mostrarInterfaceReforco(obj, pointer, scene);
             return;
           } else {
             // Verificar se já existe uma interface aberta
             if (interfaceReforco) {
               console.log('🔧 DEBUG: Interface de reforço já está aberta, ignorando clique');
               return;
             }
             
             // Não há tropas de bônus, pode colocar tropas base
             mostrarInterfaceReforco(obj, pointer, scene);
             return;
           }
         }

         // Verificar se está na fase de remanejamento
         if (gameState.faseRemanejamento && obj.dono === gameState.turno && gameState.turno === gameState.meuNome) {
           console.log('🔧 DEBUG: Clique em território durante fase de remanejamento');
           console.log('🔧 DEBUG: Território clicado:', obj.nome);
           console.log('🔧 DEBUG: Território selecionado:', gameState.selecionado ? gameState.selecionado.nome : 'nenhum');
           console.log('🔧 DEBUG: Vizinhos do selecionado:', gameState.selecionado ? gameState.selecionado.vizinhos : 'nenhum');
           console.log('🔧 DEBUG: Interface remanejamento ativa:', !!interfaceRemanejamento);
           
           if (!gameState.selecionado) {
             // Selecionar território de origem
             gameState.selecionado = obj;
             // Aplicar borda branca grossa e elevação no território de origem
             obj.polygon.setStrokeStyle(8, 0xffffff, 1);
             criarElevacaoTerritorio(obj.nome, scene);
             mostrarMensagem(`Território de origem selecionado: ${obj.nome}. Clique em um território vizinho para mover tropas.`);
             tocarSomHuh();
             console.log('🔧 DEBUG: Território de origem selecionado:', obj.nome);
           } else if (gameState.selecionado === obj) {
             // Deselecionar
             obj.polygon.setStrokeStyle(4, 0x000000, 1);
             removerElevacaoTerritorio(obj.nome, scene);
             gameState.selecionado = null;
             mostrarMensagem('Seleção cancelada');
             console.log('🔧 DEBUG: Seleção cancelada');
           } else if (gameState.selecionado.vizinhos.includes(obj.nome) && obj.dono === gameState.turno) {
             // Destacar território de destino com borda branca grossa e elevação
             obj.polygon.setStrokeStyle(8, 0xffffff, 1);
             criarElevacaoTerritorio(obj.nome, scene);
             console.log('🔧 DEBUG: Verificando movimento de', gameState.selecionado.nome, 'para', obj.nome);
             // Verificar se é possível mover tropas antes de mostrar a interface
             emitWithRoom('verificarMovimentoRemanejamento', {
               origem: gameState.selecionado.nome,
               destino: obj.nome
             });
           } else {
             console.log('🔧 DEBUG: Movimento inválido - não é vizinho ou não é seu território');
             mostrarMensagem('❌ Só pode mover tropas para territórios vizinhos que você controla!');
           }
           return;
         }

        if (obj.dono !== gameState.turno && !gameState.selecionado) {
          mostrarMensagem("Você só pode selecionar territórios seus no começo da jogada.");
          return;
        }

        if (!gameState.selecionado) {
          gameState.selecionado = obj;
          // Aplicar borda branca grossa para território selecionado
          obj.polygon.setStrokeStyle(8, 0xffffff, 1);
          // Elevar território selecionado
          criarElevacaoTerritorio(obj.nome, scene);
          mostrarMensagem(`País selecionado: ${obj.nome}`);
          tocarSomHuh(); // Tocar som quando selecionar território
        } else if (gameState.selecionado === obj) {
          // Remover borda branca e restaurar borda normal
          obj.polygon.setStrokeStyle(4, 0x000000, 1);
          // Baixar território
          removerElevacaoTerritorio(obj.nome, scene);
          gameState.selecionado = null;
          mostrarMensagem('Seleção cancelada');
        } else {
          // Verificar se está na fase de remanejamento (não pode atacar)
          if (gameState.faseRemanejamento) {
            mostrarMensagem("❌ Não é possível atacar durante a fase de remanejamento!");
            return;
          }
          
          if (!gameState.selecionado.vizinhos.includes(obj.nome)) {
            mostrarMensagem(`${obj.nome} não é vizinho de ${gameState.selecionado.nome}.`);
            return;
          }
          if (obj.dono === gameState.selecionado.dono) {
            mostrarMensagem("Você não pode atacar um território seu.");
            return;
          }
          if (gameState.selecionado.tropas <= 1) {
            mostrarMensagem("Você precisa de mais de 1 tropa para atacar.");
            return;
          }
          emitWithRoom('atacar', { de: gameState.selecionado.nome, para: obj.nome });
          limparSelecao();
        }
      });

      return obj;
    });
  }


  for (let i = 0; i < gameState.paises.length; i++) {

    gameState.paises[i].dono = novosPaises[i].dono;
    gameState.paises[i].tropas = novosPaises[i].tropas;
    gameState.paises[i].vizinhos = novosPaises[i].vizinhos;
    gameState.paises[i].text.setText(getTextoPais(gameState.paises[i]));
    
    // Atualizar círculo e texto das tropas
    if (gameState.paises[i].troopCircle && gameState.paises[i].troopText) {
      // Atualizar cor do círculo baseada no dono
      gameState.paises[i].troopCircle.setFillStyle(coresDosDonos[gameState.paises[i].dono] || 0xffffff, 1);
      gameState.paises[i].troopText.setText(gameState.paises[i].tropas.toString());
    }
    
    // Verificar se este país pertence ao continente prioritário
    let pertenceAoContinentePrioritario = false;
    const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    
    if (totalBonus > 0 && gameState.paises[i].dono === gameState.turno && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
      const continente = gameState.continentes[gameState.continentePrioritario.nome];
      if (continente && continente.territorios.includes(gameState.paises[i].nome)) {
        pertenceAoContinentePrioritario = true;
      }
    }
    
    // Verificar se a indicação de início de turno está ativa
    const indicacaoAtiva = window.indicacaoInicioTurno && window.indicacaoInicioTurno.container;
    const pertenceAoJogadorAtual = gameState.paises[i].dono === gameState.meuNome && gameState.meuNome === gameState.turno;
    
    // Aplicar cor e borda baseada na prioridade e indicação de turno
    if (indicacaoAtiva && pertenceAoJogadorAtual) {
      // Manter borda branca da indicação de início de turno
      gameState.paises[i].polygon.setFillStyle(coresDosDonos[gameState.paises[i].dono], 0.7);
      gameState.paises[i].polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca da indicação de turno
    } else if (pertenceAoContinentePrioritario) {
      gameState.paises[i].polygon.setFillStyle(coresDosDonos[gameState.paises[i].dono], 0.7);
      gameState.paises[i].polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca grossa para continente prioritário
      
      // Aplicar animação de salto se não estiver já animando
      if (!gameState.paises[i].polygon.timelineSalto) {
        console.log(`🎯 Aplicando animação de salto em ${gameState.paises[i].nome} (continente prioritário)`);
        gameState.paises[i].polygon.timelineSalto = criarAnimacaoSalto(gameState.paises[i].polygon, scene);
      }
      
      // Aplicar elevação se não estiver elevado
      if (!gameState.paises[i].elevado) {
        console.log(`🎯 Aplicando elevação em ${gameState.paises[i].nome} (continente prioritário)`);
        criarElevacaoTerritorio(gameState.paises[i].nome, scene);
      }
    } else {
      gameState.paises[i].polygon.setFillStyle(coresDosDonos[gameState.paises[i].dono], 0.7);
      gameState.paises[i].polygon.setStrokeStyle(4, 0x000000, 1); // Borda preta normal
      
      // Parar animação de salto se estiver animando
      if (gameState.paises[i].polygon.timelineSalto) {
        console.log(`🛑 Parando animação de salto em ${gameState.paises[i].nome} (não é mais prioritário)`);
        pararAnimacaoSalto(gameState.paises[i].polygon, scene);
      }
      
      // Remover elevação se estiver elevado
      if (gameState.paises[i].elevado) {
        console.log(`🛑 Removendo elevação de ${gameState.paises[i].nome} (não é mais prioritário)`);
        removerElevacaoTerritorio(gameState.paises[i].nome, scene);
      }
    }
  }
  gameState.selecionado = null;
  
  // Adicionar indicadores de continentes após os territórios serem carregados
  adicionarIndicadoresContinentes(scene);
  
  // Atualizar cards dos jogadores se estiverem visíveis
  const panel = document.getElementById('player-info-panel');
  if (panel && panel.classList.contains('open')) {
    updatePlayerInfoPanel();
  }
  
  console.log('🔧 DEBUG: atualizarPaises() concluída com sucesso');
  console.log(`🔧 DEBUG: ${gameState.paises.length} países atualizados no game state`);
}

function getTextoPais(pais) {
  return pais.nome;
}

function atualizarHUD() {
  // Update CSS HUD instead of Phaser text
  updateCSSHUD();
}

function atualizarTextoBotaoTurno() {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se o botão existe antes de tentar acessá-lo
  const botaoTurno = document.getElementById('btn-turn');
  if (!botaoTurno) {
    console.log('⏳ Botão turno ainda não criado, aguardando...');
    return;
  }
  
  console.log('🔧 DEBUG: Atualizando texto do botão turno');
  console.log('🔧 DEBUG: faseRemanejamento:', gameState.faseRemanejamento);
  console.log('🔧 DEBUG: meuNome:', gameState.meuNome);
  console.log('🔧 DEBUG: turno:', gameState.turno);
  
  if (gameState.faseRemanejamento && gameState.meuNome === gameState.turno) {
    botaoTurno.textContent = 'Encerrar Turno';
    console.log('🔧 DEBUG: Botão definido como "Encerrar Turno" (fase remanejamento)');
  } else if (gameState.meuNome === gameState.turno) {
    botaoTurno.textContent = 'Encerrar Ataque';
    console.log('🔧 DEBUG: Botão definido como "Encerrar Ataque" (fase ataque)');
  } else {
    botaoTurno.textContent = 'Encerrar Turno';
    console.log('🔧 DEBUG: Botão definido como "Encerrar Turno" (não é meu turno)');
  }
}

function limparSelecao() {
  console.log('🔧 DEBUG: limparSelecao chamada');
  const gameState = getGameState();
  if (!gameState) return;
  
  // Limpar todas as bordas especiais e restaurar as bordas normais
  gameState.paises.forEach(p => {
    // Verificar se este país pertence ao continente prioritário
    let pertenceAoContinentePrioritario = false;
    const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    
    if (totalBonus > 0 && p.dono === gameState.turno && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
      const continente = gameState.continentes[gameState.continentePrioritario.nome];
      if (continente && continente.territorios.includes(p.nome)) {
        pertenceAoContinentePrioritario = true;
      }
    }
    
    // Aplicar borda apropriada baseada na prioridade
    if (pertenceAoContinentePrioritario) {
      p.polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca grossa para continente prioritário
      
      // Aplicar animação de salto se não estiver já animando
      if (!p.polygon.timelineSalto) {
        const scene = p.polygon.scene;
        if (scene) {
          p.polygon.timelineSalto = criarAnimacaoSalto(p.polygon, scene);
        }
      }
      
      // Aplicar elevação se não estiver elevado
      if (!p.elevado) {
        const scene = p.polygon.scene;
        if (scene) {
          console.log(`🎯 Aplicando elevação em ${p.nome} (continente prioritário - limparSelecao)`);
          criarElevacaoTerritorio(p.nome, scene);
        }
      }
    } else {
      p.polygon.setStrokeStyle(4, 0x000000, 1); // Borda preta normal
      
      // Parar animação de salto se estiver animando
      if (p.polygon.timelineSalto) {
        const scene = p.polygon.scene;
        if (scene) {
          pararAnimacaoSalto(p.polygon, scene);
        }
      }
      
      // Remover elevação se estiver elevado
      if (p.elevado) {
        const scene = p.polygon.scene;
        if (scene) {
          console.log(`🛑 Removendo elevação de ${p.nome} (não é mais prioritário - limparSelecao)`);
          removerElevacaoTerritorio(p.nome, scene);
        }
      }
    }
  });
  
  // Limpar elevação do território selecionado se houver
  if (gameState.selecionado && gameState.selecionado.polygon && gameState.selecionado.polygon.scene) {
    removerElevacaoTerritorio(gameState.selecionado.nome, gameState.selecionado.polygon.scene);
  }
  
  // Limpar elevação de todos os territórios que possam ter sido elevados durante remanejamento
  gameState.paises.forEach(pais => {
    if (pais.polygon && pais.polygon.scene) {
      // Verificar se o território tem borda branca grossa (width 8) - indicando que foi elevado durante remanejamento
      const strokeStyle = pais.polygon.strokeStyle;
      if (strokeStyle && strokeStyle.color === 0xffffff && strokeStyle.width === 8) {
        // Verificar se este território pertence ao continente prioritário antes de restaurar borda
        let pertenceAoContinentePrioritario = false;
        const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
        
        if (totalBonus > 0 && pais.dono === gameState.turno && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
          const continente = gameState.continentes[gameState.continentePrioritario.nome];
          if (continente && continente.territorios.includes(pais.nome)) {
            pertenceAoContinentePrioritario = true;
          }
        }
        
        if (pertenceAoContinentePrioritario) {
          // Manter borda branca grossa para continente prioritário
          pais.polygon.setStrokeStyle(6, 0xffffff, 1);
          
          // Aplicar animação de salto se não estiver já animando
          if (!pais.polygon.timelineSalto) {
            pais.polygon.timelineSalto = criarAnimacaoSalto(pais.polygon, pais.polygon.scene);
          }
        } else {
          // Restaurar borda normal apenas se não for território prioritário
          pais.polygon.setStrokeStyle(4, 0x000000, 1);
        }
        
        // Remover elevação
        removerElevacaoTerritorio(pais.nome, pais.polygon.scene);
      }
    }
  });
  
  gameState.selecionado = null;
}

function mostrarMensagem(texto) {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Handle game restart
  if (texto.includes('Jogo reiniciado')) {
    stopTurnTimer(); // Stop any existing timer
  }
  
  // Filter messages to only include reinforcements, attacks, and action phases
  const shouldInclude = 
    // Reinforcements
    texto.includes('Reforços') || 
    texto.includes('tropas de bônus') || 
    texto.includes('trocou 3 cartas') ||
    texto.includes('exércitos bônus') ||
    // Attacks
    texto.includes('ataca') ||
    texto.includes('Ataque:') ||
    texto.includes('Defesa:') ||
    texto.includes('perdeu 1 tropa') ||
    texto.includes('foi conquistado') ||
    // Action phases
    texto.includes('fase de remanejamento') ||
    texto.includes('Turno de') ||
    texto.includes('Jogo iniciado') ||
    texto.includes('Jogo reiniciado') ||
    texto.includes('conquistou o continente');
    
  // Verificar se é uma conquista de continente para disparar efeito de onda
  if (texto.includes('conquistou o continente')) {
    console.log('🎉 Detectada conquista de continente!');
    
    // Extrair nome do continente da mensagem
    const match = texto.match(/conquistou o continente ([^!]+)/);
    if (match && match[1]) {
      const nomeContinente = match[1].trim();
      console.log('🌍 Nome do continente extraído:', nomeContinente);
      
      // Disparar efeito de onda após um pequeno delay
      setTimeout(() => {
        const currentScene = window.currentScene;
        if (currentScene) {
          criarEfeitoOndaContinente(nomeContinente, currentScene);
        } else {
          console.log('❌ Scene não disponível para efeito de onda');
        }
      }, 500); // Delay para sincronizar com a mensagem
    }
  }

  if (!shouldInclude) {
    return; // Skip this message
  }

  // Add message to history
  const timestamp = new Date().toLocaleTimeString();
  const historyEntry = {
    timestamp: timestamp,
    message: texto
  };
  
  gameState.actionHistory.push(historyEntry);
  
  // Keep only the last N entries
  if (gameState.actionHistory.length > gameState.actionHistoryMaxSize) {
    gameState.actionHistory.shift();
  }
  
  // Update history display if popup is visible
  if (gameState.historyPopupVisible) {
    updateHistoryDisplay();
  }
}

// Função para mostrar tela de vitória moderna e visualmente atraente
function mostrarTelaVitoria(nomeJogador, resumoJogo, scene) {
  console.log('🏆 Mostrando tela de vitória para:', nomeJogador);
  console.log('📊 Resumo do jogo:', resumoJogo);
  
  if (!scene || !scene.add) {
    console.error('❌ Scene não disponível para mostrar tela de vitória');
    return;
  }
  
  const gameState = getGameState();
  if (!gameState) {
    console.error('❌ Game state não disponível');
    return;
  }
  
  // Parar timers e limpar interfaces
  stopTurnTimer();
  hideTurnConfirmationPopup();
  esconderInterfaceReforco();
  esconderInterfaceTransferenciaConquista();
  esconderInterfaceRemanejamento();
  fecharTodasModais();
  
  const largura = scene.scale.width;
  const altura = scene.scale.height;
  
  // Criar overlay com blur effect
  const overlay = scene.add.rectangle(largura/2, altura/2, largura, altura, 0x000000, 0.8);
  overlay.setDepth(30);
  
  // Container principal com estilo moderno como o chat
  const containerVitoria = scene.add.container(largura/2, altura/2);
  containerVitoria.setDepth(31);
  
  // Background do container - estilo moderno como o chat (maior para acomodar os cards e resumo)
  const background = scene.add.rectangle(0, 0, 600, 800, 0x1a1a1a, 0.95);
  background.setStrokeStyle(3, 0x0077cc);
  background.setDepth(0);
  containerVitoria.add(background);
  
  // Header com estilo moderno como o chat
  const headerBg = scene.add.rectangle(0, -300, 600, 80, 0x0077cc, 0.9);
  headerBg.setDepth(1);
  containerVitoria.add(headerBg);
  
  // Ícone de vitória
  const victoryIcon = scene.add.text(-250, -300, '🏆', {
    fontSize: '40px',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  containerVitoria.add(victoryIcon);
  
  // Título principal
  const title = scene.add.text(-200, -300, 'VITÓRIA!', {
    fontSize: '28px',
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0, 0.5).setDepth(2);
  containerVitoria.add(title);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -260, 550, 2, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  containerVitoria.add(linhaDecorativa);
  
  // Container de conteúdo
  const contentContainer = scene.add.container(0, -150);
  contentContainer.setDepth(2);
  containerVitoria.add(contentContainer);
  
  // Verificar se é vitória do jogador atual
  const isPlayerVictory = nomeJogador === gameState.meuNome;
  
  // Mensagem principal
  const mainMessage = scene.add.text(0, -50, isPlayerVictory ? 'Parabéns! Você venceu!' : `${nomeJogador} venceu o jogo!`, {
    fontSize: '20px',
    fill: isPlayerVictory ? '#33cc33' : '#ffcc00',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(mainMessage);
  
  // Cards dos jogadores
  const playersTitle = scene.add.text(0, -30, 'RESULTADO FINAL', {
    fontSize: '18px',
    fill: '#0077cc',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(playersTitle);
  
  // Obter informações de todos os jogadores (incluindo CPUs eliminadas)
  const jogadores = gameState.jogadores || [];
  const paises = gameState.paises || [];
  
  // Obter todos os nomes de jogadores que já participaram do jogo
  const todosJogadores = new Set();
  
  // Adicionar jogadores atuais
  jogadores.forEach(jogador => todosJogadores.add(jogador.nome));
  
  // Adicionar jogadores que possuem territórios (incluindo CPUs eliminadas)
  paises.forEach(pais => {
    if (pais.dono) {
      todosJogadores.add(pais.dono);
    }
  });
  
  // Adicionar jogadores do histórico de ações (para pegar CPUs que foram eliminadas)
  if (gameState.actionHistory) {
    gameState.actionHistory.forEach(entry => {
      // Extrair nomes de jogadores das mensagens do histórico
      const playerMatches = entry.message.match(/([A-Za-z0-9]+)\s+(?:atacou|reforçou|moveu|conquistou|eliminou|foi eliminado|venceu|perdeu)/g);
      if (playerMatches) {
        playerMatches.forEach(match => {
          const playerName = match.split(' ')[0];
          todosJogadores.add(playerName);
        });
      }
      
      // Extrair nomes de jogadores que foram eliminados
      const eliminatedMatches = entry.message.match(/([A-Za-z0-9]+)\s+foi eliminado/g);
      if (eliminatedMatches) {
        eliminatedMatches.forEach(match => {
          const playerName = match.split(' ')[0];
          todosJogadores.add(playerName);
        });
      }
      
      // Extrair nomes de jogadores que eliminaram outros
      const eliminatorMatches = entry.message.match(/([A-Za-z0-9]+)\s+eliminou/g);
      if (eliminatorMatches) {
        eliminatorMatches.forEach(match => {
          const playerName = match.split(' ')[0];
          todosJogadores.add(playerName);
        });
      }
    });
  }
  
  // Converter para array e criar estatísticas completas
  const jogadoresStats = Array.from(todosJogadores).map(nomeJogador => {
    const territoriosJogador = paises.filter(pais => pais.dono === nomeJogador);
    const totalTropas = territoriosJogador.reduce((sum, pais) => sum + pais.tropas, 0);
    const totalTerritorios = territoriosJogador.length;
    
    // Verificar se o jogador ainda está ativo
    const jogadorAtivo = jogadores.find(j => j.nome === nomeJogador);
    const ativo = jogadorAtivo ? jogadorAtivo.ativo !== false : false;
    
    // Verificar se é CPU (não está na lista de jogadores ativos)
    const isCPU = !jogadores.find(j => j.nome === nomeJogador);
    
    return {
      nome: nomeJogador,
      ativo: ativo,
      totalTropas: totalTropas,
      totalTerritorios: totalTerritorios,
      vencedor: nomeJogador === nomeJogador,
      isCPU: isCPU,
      eliminado: !ativo && totalTerritorios === 0
    };
  });
  
  // Ordenar: vencedor primeiro, depois por total de territórios, depois por nome
  jogadoresStats.sort((a, b) => {
    if (a.vencedor && !b.vencedor) return -1;
    if (!a.vencedor && b.vencedor) return 1;
    if (a.totalTerritorios !== b.totalTerritorios) return b.totalTerritorios - a.totalTerritorios;
    return a.nome.localeCompare(b.nome);
  });
  
  // Criar cards dos jogadores
  const cardWidth = 120;
  const cardHeight = 140;
  const cardSpacing = 20;
  const totalWidth = (jogadoresStats.length * cardWidth) + ((jogadoresStats.length - 1) * cardSpacing);
  const startX = -totalWidth / 2 + cardWidth / 2;
  
  jogadoresStats.forEach((jogador, index) => {
    const cardX = startX + index * (cardWidth + cardSpacing);
    const cardY = 20;
    
    // Container do card
    const cardContainer = scene.add.container(cardX, cardY);
    cardContainer.setDepth(2);
    contentContainer.add(cardContainer);
    
    // Background do card
    const cardBg = scene.add.rectangle(0, 0, cardWidth, cardHeight, 0x2a2a2a, 0.9);
    cardBg.setStrokeStyle(2, jogador.vencedor ? 0x33cc33 : 0x444444);
    cardContainer.add(cardBg);
    
    // Header do card com cor do jogador
    const headerBg = scene.add.rectangle(0, -55, cardWidth, 30, coresDosDonos[jogador.nome] || 0x666666, 0.8);
    cardContainer.add(headerBg);
    
    // Nome do jogador
    const playerName = scene.add.text(0, -55, jogador.nome, {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(2);
    cardContainer.add(playerName);
    
    // Status (Vencedor/Perdedor/Eliminado/CPU)
    let statusText = '';
    let statusColor = '#ff3333';
    
    if (jogador.vencedor) {
      statusText = '🏆 VENCEDOR';
      statusColor = '#33cc33';
    } else if (jogador.eliminado) {
      statusText = '💀 ELIMINADO';
      statusColor = '#ff3333';
    } else if (jogador.isCPU) {
      statusText = '🤖 CPU';
      statusColor = '#ffaa00';
    } else if (!jogador.ativo) {
      statusText = '❌ INATIVO';
      statusColor = '#ff3333';
    } else {
      statusText = '⚔️ ATIVO';
      statusColor = '#33cc33';
    }
    
    const status = scene.add.text(0, -35, statusText, {
      fontSize: '10px',
      fill: statusColor,
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(2);
    cardContainer.add(status);
    
    // Tropas
    const troopsIcon = scene.add.text(-30, -10, '⚔️', {
      fontSize: '14px'
    }).setOrigin(0.5).setDepth(2);
    cardContainer.add(troopsIcon);
    
    const troopsText = scene.add.text(-15, -10, `${jogador.totalTropas}`, {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'left',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0, 0.5).setDepth(2);
    cardContainer.add(troopsText);
    
    // Territórios
    const territoriesIcon = scene.add.text(-30, 10, '🗺️', {
      fontSize: '14px'
    }).setOrigin(0.5).setDepth(2);
    cardContainer.add(territoriesIcon);
    
    const territoriesText = scene.add.text(-15, 10, `${jogador.totalTerritorios}`, {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'left',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0, 0.5).setDepth(2);
    cardContainer.add(territoriesText);
    
    // Objetivo (se disponível)
    if (resumoJogo && resumoJogo.objetivos && resumoJogo.objetivos[jogador.nome]) {
      const objectiveIcon = scene.add.text(-30, 30, '🎯', {
        fontSize: getResponsiveFontSize(14)
      }).setOrigin(0.5).setDepth(2);
      cardContainer.add(objectiveIcon);
      
      const objectiveText = scene.add.text(-15, 30, resumoJogo.objetivos[jogador.nome].substring(0, 8) + '...', {
        fontSize: getResponsiveFontSize(10),
        fill: '#cccccc',
        align: 'left',
        wordWrap: { width: getResponsiveSize(80) },
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0, 0.5).setDepth(2);
      cardContainer.add(objectiveText);
    }
    
    // Efeito especial para o vencedor
    if (jogador.vencedor) {
      // Borda dourada animada
      const goldenBorder = scene.add.rectangle(0, 0, cardWidth + 4, cardHeight + 4, 0xffd700, 0.8);
      goldenBorder.setStrokeStyle(3, 0xffd700);
      cardContainer.addAt(goldenBorder, 0);
      
      // Animação de brilho
      scene.tweens.add({
        targets: goldenBorder,
        alpha: 0.3,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    }
  });
  
  // Informações adicionais do resumo do jogo
  if (resumoJogo) {
    let yOffset = getResponsiveSize(100);
    
    // Tipo de vitória
    if (resumoJogo.tipoVitoria) {
      const victoryType = scene.add.text(0, yOffset, `Tipo de Vitória: ${resumoJogo.tipoVitoria === 'eliminacao' ? 'Eliminação Total' : 'Objetivo Completo'}`, {
        fontSize: getResponsiveFontSize(14),
        fill: '#cccccc',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setDepth(2);
      contentContainer.add(victoryType);
      yOffset += getResponsiveSize(25);
    }
    
    // Estatísticas do jogo
    if (resumoJogo.estatisticas) {
      // Duração do jogo
      if (resumoJogo.estatisticas.duracao) {
        const duration = scene.add.text(0, yOffset, `Duração: ${resumoJogo.estatisticas.duracao}`, {
          fontSize: getResponsiveFontSize(12),
          fill: '#888888',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 1
        }).setOrigin(0.5).setDepth(2);
        contentContainer.add(duration);
        yOffset += getResponsiveSize(20);
      }
      
      // Total de ataques
      if (resumoJogo.estatisticas.totalAtaques !== undefined) {
        const attacks = scene.add.text(0, yOffset, `Total de Ataques: ${resumoJogo.estatisticas.totalAtaques}`, {
          fontSize: getResponsiveFontSize(12),
          fill: '#888888',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 1
        }).setOrigin(0.5).setDepth(2);
        contentContainer.add(attacks);
        yOffset += getResponsiveSize(20);
      }
    }
  }
  
  // Adicionar seção de resumo das ações principais (incluindo CPUs)
  if (gameState.actionHistory && gameState.actionHistory.length > 0) {
    let yOffset = getResponsiveSize(180);
    
    // Título da seção de resumo
    const summaryTitle = scene.add.text(0, yOffset, 'RESUMO DAS AÇÕES PRINCIPAIS', {
      fontSize: getResponsiveFontSize(16),
      fill: '#0077cc',
      align: 'center',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(2);
    contentContainer.add(summaryTitle);
    yOffset += getResponsiveSize(25);
    
    // Filtrar ações importantes (ataques, conquistas, eliminações)
    const acoesImportantes = gameState.actionHistory.filter(entry => {
      const message = entry.message.toLowerCase();
      return message.includes('atacou') || 
             message.includes('conquistou') || 
             message.includes('eliminou') ||
             message.includes('venceu') ||
             message.includes('perdeu');
    });
    
    // Mostrar as últimas 5 ações importantes
    const ultimasAcoes = acoesImportantes.slice(-5);
    
    ultimasAcoes.forEach((acao, index) => {
      const actionText = scene.add.text(0, yOffset, acao.message, {
        fontSize: getResponsiveFontSize(11),
        fill: '#cccccc',
        align: 'center',
        wordWrap: { width: getResponsiveSize(500) },
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setDepth(2);
      contentContainer.add(actionText);
      yOffset += getResponsiveSize(18);
    });
    
    // Se não há ações importantes, mostrar mensagem
    if (ultimasAcoes.length === 0) {
      const noActionsText = scene.add.text(0, yOffset, 'Nenhuma ação importante registrada', {
        fontSize: getResponsiveFontSize(11),
        fill: '#888888',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setDepth(2);
      contentContainer.add(noActionsText);
      yOffset += getResponsiveSize(18);
    }
  }
  
  // Adicionar estatísticas gerais do jogo
  const totalJogadores = jogadoresStats.length;
  const jogadoresAtivos = jogadoresStats.filter(j => j.ativo).length;
  const cpus = jogadoresStats.filter(j => j.isCPU).length;
  const eliminados = jogadoresStats.filter(j => j.eliminado).length;
  
  let yOffset = getResponsiveSize(280);
  
  // Título das estatísticas
  const statsTitle = scene.add.text(0, yOffset, 'ESTATÍSTICAS GERAIS', {
    fontSize: getResponsiveFontSize(14),
    fill: '#0077cc',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(statsTitle);
  yOffset += getResponsiveSize(20);
  
  // Estatísticas
  const statsText = scene.add.text(0, yOffset, `Total de Jogadores: ${totalJogadores} | Ativos: ${jogadoresAtivos} | CPUs: ${cpus} | Eliminados: ${eliminados}`, {
    fontSize: getResponsiveFontSize(11),
    fill: '#cccccc',
    align: 'center',
    wordWrap: { width: getResponsiveSize(500) },
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(statsText);
  
  // Container de botões
  const buttonContainer = scene.add.container(0, getResponsiveSize(320));
  buttonContainer.setDepth(2);
  containerVitoria.add(buttonContainer);
  
  // Botão "Voltar ao Menu" - estilo verde moderno centralizado
  const menuButton = scene.add.text(0, 0, 'VOLTAR AO MENU', {
    fontSize: getResponsiveFontSize(16),
    fill: '#ffffff',
    backgroundColor: '#33cc33',
    padding: { x: getResponsivePadding(20), y: getResponsivePadding(12) },
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Efeito hover do botão
  menuButton.on('pointerover', () => {
    menuButton.setBackgroundColor('#28a745');
  });
  
  menuButton.on('pointerout', () => {
    menuButton.setBackgroundColor('#33cc33');
  });
  
  menuButton.on('pointerdown', () => {
    tocarSomClick();
    // Voltar ao menu de seleção de modos
    backToModeSelection();
  });
  
  buttonContainer.add(menuButton);
  
  // Animação de entrada
  containerVitoria.setScale(0.8);
  scene.tweens.add({
    targets: containerVitoria,
    scaleX: 1,
    scaleY: 1,
    duration: 400,
    ease: 'Back.easeOut'
  });
  
  // Animação do overlay
  overlay.setAlpha(0);
  scene.tweens.add({
    targets: overlay,
    alpha: 0.8,
    duration: 300,
    ease: 'Power2'
  });
  
  // Criar efeito de partículas douradas para celebrar a vitória
  if (isPlayerVictory) {
    setTimeout(() => {
      criarPartículasDouradas(largura/2, altura/2, scene);
    }, 500);
  }
  
  // Tocar som de vitória (se disponível)
  tocarSomTerritoryWin();
  
  // Armazenar referências para poder esconder depois
  window.overlay = overlay;
  window.containerVitoria = containerVitoria;
}

// Função para esconder tela de vitória
function esconderTelaVitoria() {
  if (window.overlay) {
    window.overlay.destroy();
    window.overlay = null;
  }
  
  if (window.containerVitoria) {
    window.containerVitoria.destroy();
    window.containerVitoria = null;
  }
}

// Função para tocar som de vitória
function tocarSomTerritoryWin() {
  try {
    const audio = new Audio('assets/territorywin.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Erro ao tocar som de vitória:', e));
  } catch (e) {
    console.log('Erro ao criar áudio de vitória:', e);
  }
}





function desbloquearJogo() {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se o botão existe antes de tentar acessá-lo
  const botaoTurno = document.getElementById('btn-turn');
  if (botaoTurno) {
    botaoTurno.disabled = false;
    botaoTurno.style.backgroundColor = '#0077cc';
    botaoTurno.style.cursor = 'pointer';
  }
  
  // Verificar se os países existem antes de tentar acessá-los
  if (gameState.paises && gameState.paises.length > 0) {
    gameState.paises.forEach(pais => {
      if (pais.polygon) {
        pais.polygon.setInteractive({ useHandCursor: true });
      }
    });
  }
  

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

function tocarSomTakeCard() {
  if (somTakeCard) {
    somTakeCard.play();
  }
}

function tocarSomClockTicking() {
  const som = game.sound.add('clockticking', { volume: 0.3 });
  som.play();
}

// Função para mostrar efeito visual de ataque
function mostrarEfeitoAtaque(origem, destino, scene, sucesso = true) {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    console.log('⏳ Scene não pronta para mostrar efeito de ataque');
    return;
  }
  
  // Encontrar os territórios no mapa
  const territorioOrigem = gameState.paises.find(p => p.nome === origem);
  const territorioDestino = gameState.paises.find(p => p.nome === destino);
  
  if (!territorioOrigem || !territorioDestino) {
    console.log('❌ Territórios não encontrados para efeito de ataque');
    return;
  }
  
  // Verificar se os territórios têm as propriedades necessárias
  if (!territorioOrigem.text || !territorioDestino.text) {
    console.log('❌ Territórios não têm propriedades text para efeito de ataque');
    return;
  }
  
  // Calcular posições centrais dos territórios
  const origemX = territorioOrigem.text.x;
  const origemY = territorioOrigem.text.y;
  const destinoX = territorioDestino.text.x;
  const destinoY = territorioDestino.text.y;
  
  // EFEITO DE ILUMINAÇÃO NA ORIGEM (flash de tiro)
  const flashOrigem = scene.add.circle(origemX, origemY, 15, 0xffff00);
  flashOrigem.setDepth(24);
  flashOrigem.setAlpha(0.8);
  
  // Animar o flash de origem
  scene.tweens.add({
    targets: flashOrigem,
    scaleX: 0.3,
    scaleY: 0.3,
    alpha: 0,
    duration: 150,
    onComplete: () => {
      flashOrigem.destroy();
    }
  });
  
  // Criar múltiplos projéteis para efeito de rajada
  const numProjeteis = 5; // 5 projéteis por ataque
  const projeteis = [];
  const brilhos = [];
  
  for (let i = 0; i < numProjeteis; i++) {
    // Pequena variação na posição inicial para simular rajada
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    
    // Projétil
    const projetil = scene.add.circle(origemX + offsetX, origemY + offsetY, 6, sucesso ? 0xff0000 : 0x666666);
    projetil.setDepth(25);
    projeteis.push(projetil);
    
    // Brilho do projétil
    const brilho = scene.add.circle(origemX + offsetX, origemY + offsetY, 10, 0xffff00);
    brilho.setDepth(24);
    brilho.setAlpha(0.6);
    brilhos.push(brilho);
  }
  
  // Calcular direção do ataque
  const deltaX = destinoX - origemX;
  const deltaY = destinoY - origemY;
  const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Duração ainda mais rápida
  const duracao = Math.max(150, distancia * 0.6); // Ainda mais rápido
  
  // Animar todos os projéteis e brilhos
  scene.tweens.add({
    targets: [...projeteis, ...brilhos],
    x: destinoX,
    y: destinoY,
    duration: duracao,
    ease: 'Linear',
    onComplete: () => {
      // Efeito de impacto muito mais dramático
      if (sucesso) {
        // Explosão de sucesso maior e mais chamativa
        const explosao = scene.add.circle(destinoX, destinoY, 20, 0xffaa00);
        explosao.setDepth(26);
        
        // Brilho da explosão
        const brilhoExplosao = scene.add.circle(destinoX, destinoY, 30, 0xffff00);
        brilhoExplosao.setDepth(25);
        brilhoExplosao.setAlpha(0.7);
        
        // Ondas de choque
        const onda1 = scene.add.circle(destinoX, destinoY, 10, 0xff6600);
        const onda2 = scene.add.circle(destinoX, destinoY, 15, 0xff4400);
        onda1.setDepth(24);
        onda2.setDepth(23);
        
        // Animar explosão
        scene.tweens.add({
          targets: explosao,
          scaleX: 3,
          scaleY: 3,
          alpha: 0,
          duration: 400,
          onComplete: () => {
            explosao.destroy();
          }
        });
        
        // Animar brilho
        scene.tweens.add({
          targets: brilhoExplosao,
          scaleX: 2.5,
          scaleY: 2.5,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            brilhoExplosao.destroy();
          }
        });
        
        // Animar ondas
        scene.tweens.add({
          targets: [onda1, onda2],
          scaleX: 4,
          scaleY: 4,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            onda1.destroy();
            onda2.destroy();
          }
        });
        
      } else {
        // Efeito de falha mais visível
        const falha = scene.add.circle(destinoX, destinoY, 15, 0x666666);
        falha.setDepth(26);
        
        // Brilho de falha
        const brilhoFalha = scene.add.circle(destinoX, destinoY, 25, 0x888888);
        brilhoFalha.setDepth(25);
        brilhoFalha.setAlpha(0.5);
        
        // Animar falha
        scene.tweens.add({
          targets: falha,
          scaleX: 2.5,
          scaleY: 2.5,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            falha.destroy();
          }
        });
        
        scene.tweens.add({
          targets: brilhoFalha,
          scaleX: 2,
          scaleY: 2,
          alpha: 0,
          duration: 250,
          onComplete: () => {
            brilhoFalha.destroy();
          }
        });
      }
      
      // Destruir todos os projéteis e brilhos
      projeteis.forEach(projetil => projetil.destroy());
      brilhos.forEach(brilho => brilho.destroy());
    }
  });
}

// Função para mostrar efeito visual de reforço
function mostrarEfeitoReforco(territorio, jogador, scene) {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    console.log('⏳ Scene não pronta para mostrar efeito de reforço');
    return;
  }
  
  // Encontrar o território no array de países
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais) {
    console.log('❌ Território não encontrado para efeito de reforço');
    return;
  }

  // Verificar se o território tem a propriedade text
  if (!pais.text) {
    console.log('❌ Território não tem propriedade text para efeito de reforço');
    return;
  }

  // Usar as mesmas coordenadas que o efeito de ataque (texto do território)
  const posX = pais.text.x;
  const posY = pais.text.y;

  // Criar efeito de pulsação no território
  const efeitoPulsacao = scene.add.circle(posX, posY, getResponsiveSize(30, 0.8, 0.6), 0x00ff00, 0.3);
  efeitoPulsacao.setDepth(15);

  // Animação de pulsação
  scene.tweens.add({
    targets: efeitoPulsacao,
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
    duration: 1000,
    ease: 'Power2',
    onComplete: () => {
      efeitoPulsacao.destroy();
    }
  });

  // Criar texto flutuante
  const textoReforco = scene.add.text(posX, posY - 50, `🛡️ +1`, {
    fontSize: getResponsiveFontSize(20, 0.8, 0.6),
    fill: '#00ff00',
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(16);

  // Animação do texto
  scene.tweens.add({
    targets: textoReforco,
    y: textoReforco.y - 30,
    alpha: 0,
    duration: 1500,
    ease: 'Power2',
    onComplete: () => {
      textoReforco.destroy();
    }
  });
}



// Funções para interface de reforço
function mostrarInterfaceReforco(territorio, pointer, scene) {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Esconder interface anterior se existir
  esconderInterfaceReforco();
  
  // Calcular tropas disponíveis
  const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  
  // Se há tropas de bônus pendentes, mostrar apenas as do continente prioritário
  let tropasDisponiveis;
  if (totalBonus > 0 && gameState.continentePrioritario) {
    // Mostrar apenas as tropas de bônus do continente prioritário
    tropasDisponiveis = gameState.continentePrioritario.quantidade;
  } else {
    // Não há tropas de bônus, mostrar tropas base
    tropasDisponiveis = gameState.tropasReforco;
  }
  
  // Inicializar com 1 tropa
  gameState.tropasParaColocar = 1;
  gameState.territorioSelecionadoParaReforco = territorio;
  
  // Aplicar efeito de elevação e borda branca no território selecionado
  territorio.polygon.setStrokeStyle(8, 0xffffff, 1);
  criarElevacaoTerritorio(territorio.nome, scene);
  
  // Criar container para a interface
  interfaceReforco = scene.add.container(pointer.x, pointer.y);
  interfaceReforco.setDepth(20);
  
  // Background principal com gradiente
  const background = scene.add.rectangle(0, 0, getResponsiveSize(350), getResponsiveSize(200), 0x1a1a1a, 0.95);
  background.setStrokeStyle(3, 0x33cc33);
  background.setDepth(0);
  interfaceReforco.add(background);
  
  // Header com gradiente
  const headerBg = scene.add.rectangle(0, -getResponsiveSize(80), getResponsiveSize(350), getResponsiveSize(40), 0x33cc33, 0.9);
  headerBg.setDepth(1);
  interfaceReforco.add(headerBg);
  
  // Ícone de reforço
  const reforcoIcon = scene.add.text(-getResponsiveSize(150), -getResponsiveSize(80), '🛡️', {
    fontSize: getResponsiveFontSize(20),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  interfaceReforco.add(reforcoIcon);
  
  // Título
  let tituloTexto = 'REFORÇAR TERRITÓRIO';
  if (totalBonus > 0 && gameState.continentePrioritario) {
    tituloTexto = `BÔNUS ${gameState.continentePrioritario.nome.toUpperCase()}`;
  }
  
  const titulo = scene.add.text(-getResponsiveSize(120), -getResponsiveSize(80), tituloTexto, {
    fontSize: getResponsiveFontSize(16),
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0, 0.5).setDepth(2);
  interfaceReforco.add(titulo);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -getResponsiveSize(60), getResponsiveSize(300), 2, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  interfaceReforco.add(linhaDecorativa);
  
  // Container para informações do território
  const territorioContainer = scene.add.container(0, -getResponsiveSize(30));
  territorioContainer.setDepth(2);
  interfaceReforco.add(territorioContainer);
  
  // Background do território
  const territorioBg = scene.add.rectangle(0, 0, getResponsiveSize(280), getResponsiveSize(35), 0x2a2a2a, 0.9);
  territorioBg.setStrokeStyle(2, 0x33cc33);
  territorioContainer.add(territorioBg);
  
  // Ícone do território
  const territorioIcon = scene.add.text(-getResponsiveSize(120), 0, '🗺️', {
    fontSize: getResponsiveFontSize(16)
  }).setOrigin(0.5).setDepth(2);
  territorioContainer.add(territorioIcon);
  
  // Nome do território
  const territorioText = scene.add.text(-getResponsiveSize(100), 0, territorio.nome, {
    fontSize: getResponsiveFontSize(14),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  territorioContainer.add(territorioText);
  
  // Tropas atuais
  const tropasAtuaisText = scene.add.text(getResponsiveSize(80), 0, `Tropas: ${territorio.tropas}`, {
    fontSize: getResponsiveFontSize(12),
    fill: '#cccccc',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  territorioContainer.add(tropasAtuaisText);
  
  // Container para controles de quantidade
  const controlesContainer = scene.add.container(0, getResponsiveSize(20));
  controlesContainer.setDepth(2);
  interfaceReforco.add(controlesContainer);
  
  // Background dos controles
  const controlesBg = scene.add.rectangle(0, 0, getResponsiveSize(280), getResponsiveSize(50), 0x2a2a2a, 0.9);
  controlesBg.setStrokeStyle(2, 0x444444);
  controlesContainer.add(controlesBg);
  
  // Título dos controles
  const controlesTitulo = scene.add.text(0, -getResponsiveSize(15), 'Quantidade a Adicionar', {
    fontSize: getResponsiveFontSize(12),
    fill: '#cccccc',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  controlesContainer.add(controlesTitulo);
  
  // Botão menos com decremento progressivo
  const botaoMenos = scene.add.text(-getResponsiveSize(70), getResponsiveSize(8), '-', {
    fontSize: getResponsiveFontSize(18),
    fill: '#ffffff',
    backgroundColor: '#ff3333',
    padding: { x: getResponsivePadding(8), y: getResponsivePadding(4) },
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Variáveis para controle do decremento progressivo
  window.decrementoInterval = null;
  let decrementoDelay = 150; // Delay inicial em ms
  let decrementoStep = 1; // Quantidade inicial a decrementar
  
  botaoMenos.on('pointerdown', (pointer) => {
    tocarSomClick();
    // Decremento imediato
    if (gameState.tropasParaColocar > 1) {
      gameState.tropasParaColocar--;
      atualizarTextoQuantidade();
    }
    
    // Iniciar decremento progressivo
    decrementoProgressivo();
  });
  
  botaoMenos.on('pointerup', () => {
    // Parar decremento progressivo
    pararDecrementoProgressivo();
  });
  
  botaoMenos.on('pointerout', () => {
    // Parar decremento progressivo quando o mouse sai do botão
    pararDecrementoProgressivo();
  });
  
  // Função para decremento progressivo
  function decrementoProgressivo() {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    if (window.decrementoInterval) return; // Já está rodando
    
    window.decrementoInterval = setInterval(() => {
      if (gameState.tropasParaColocar > 1) {
        // Calcular quantidade a decrementar baseada no tempo
        const tempoDecorrido = Date.now() - (window.decrementoInterval.startTime || Date.now());
        
        if (tempoDecorrido > 2000) { // Após 2 segundos
          decrementoStep = Math.min(10, Math.floor(tempoDecorrido / 1000)); // Máximo 10 por vez
        } else if (tempoDecorrido > 1000) { // Após 1 segundo
          decrementoStep = 5;
        } else if (tempoDecorrido > 500) { // Após 0.5 segundos
          decrementoStep = 2;
        }
        
        // Decrementar
        const decrementoReal = Math.min(decrementoStep, gameState.tropasParaColocar - 1);
        gameState.tropasParaColocar -= decrementoReal;
        atualizarTextoQuantidade();
        
        // Tocar som a cada 5 decrementos para feedback
        if (gameState.tropasParaColocar % 5 === 0) {
          tocarSomClick();
        }
      } else {
        pararDecrementoProgressivo();
      }
    }, decrementoDelay);
    
    window.decrementoInterval.startTime = Date.now();
  }
  
  // Função para parar decremento progressivo
  function pararDecrementoProgressivo() {
    if (window.decrementoInterval) {
      clearInterval(window.decrementoInterval);
      window.decrementoInterval = null;
      decrementoStep = 1; // Resetar para próximo uso
    }
  }
  controlesContainer.add(botaoMenos);
  
  // Texto da quantidade
  const textoQuantidade = scene.add.text(0, getResponsiveSize(8), `${gameState.tropasParaColocar}/${tropasDisponiveis}`, {
    fontSize: getResponsiveFontSize(18),
    fill: '#ffffff',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(2);
  controlesContainer.add(textoQuantidade);
  
  // Botão mais com incremento progressivo
  const botaoMais = scene.add.text(getResponsiveSize(70), getResponsiveSize(8), '+', {
    fontSize: getResponsiveFontSize(18),
    fill: '#ffffff',
    backgroundColor: '#33ff33',
    padding: { x: getResponsivePadding(8), y: getResponsivePadding(4) },
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Variáveis para controle do incremento progressivo
  window.incrementoInterval = null;
  let incrementoDelay = 150; // Delay inicial em ms
  let incrementoStep = 1; // Quantidade inicial a incrementar
  
  botaoMais.on('pointerdown', (pointer) => {
    tocarSomClick();
    // Incremento imediato
    if (gameState.tropasParaColocar < tropasDisponiveis) {
      gameState.tropasParaColocar++;
      atualizarTextoQuantidade();
    }
    
    // Iniciar incremento progressivo
    incrementoProgressivo();
  });
  
  botaoMais.on('pointerup', () => {
    // Parar incremento progressivo
    pararIncrementoProgressivo();
  });
  
  botaoMais.on('pointerout', () => {
    // Parar incremento progressivo quando o mouse sai do botão
    pararIncrementoProgressivo();
  });
  
  // Função para incremento progressivo
  function incrementoProgressivo() {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    if (window.incrementoInterval) return; // Já está rodando
    
    window.incrementoInterval = setInterval(() => {
      if (gameState.tropasParaColocar < tropasDisponiveis) {
        // Calcular quantidade a incrementar baseada no tempo
        const tempoDecorrido = Date.now() - (window.incrementoInterval.startTime || Date.now());
        
        if (tempoDecorrido > 2000) { // Após 2 segundos
          incrementoStep = Math.min(10, Math.floor(tempoDecorrido / 1000)); // Máximo 10 por vez
        } else if (tempoDecorrido > 1000) { // Após 1 segundo
          incrementoStep = 5;
        } else if (tempoDecorrido > 500) { // Após 0.5 segundos
          incrementoStep = 2;
        }
        
        // Incrementar
        const incrementoReal = Math.min(incrementoStep, tropasDisponiveis - gameState.tropasParaColocar);
        gameState.tropasParaColocar += incrementoReal;
        atualizarTextoQuantidade();
        
        // Tocar som a cada 5 incrementos para feedback
        if (gameState.tropasParaColocar % 5 === 0) {
          tocarSomClick();
        }
      } else {
        pararIncrementoProgressivo();
      }
    }, incrementoDelay);
    
    window.incrementoInterval.startTime = Date.now();
  }
  
  // Função para parar incremento progressivo
  function pararIncrementoProgressivo() {
    if (window.incrementoInterval) {
      clearInterval(window.incrementoInterval);
      window.incrementoInterval = null;
      incrementoStep = 1; // Resetar para próximo uso
    }
  }
  controlesContainer.add(botaoMais);
  
  // Container para botões de ação
  const botoesContainer = scene.add.container(0, 80);
  botoesContainer.setDepth(2);
  interfaceReforco.add(botoesContainer);
  
  // Detectar se é dispositivo móvel
  const isMobile = window.innerWidth <= 768;
  const buttonWidth = isMobile ? 140 : 120;
  const buttonHeight = isMobile ? 45 : 35;
  const buttonFontSize = isMobile ? '16px' : '12px';
  
  // Botão confirmar
  const botaoConfirmarBg = scene.add.rectangle(-70, 0, buttonWidth, buttonHeight, 0x33cc33, 0.9);
  botaoConfirmarBg.setStrokeStyle(2, 0x2a9e2a);
  botaoConfirmarBg.setInteractive({ useHandCursor: true });
  botoesContainer.add(botaoConfirmarBg);
  
  const botaoConfirmar = scene.add.text(-70, 0, '✅ CONFIRMAR', {
    fontSize: buttonFontSize,
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para confirmar reforço
  const confirmarAcao = () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    tocarSomClick();
    confirmarReforco();
  };
  
  botaoConfirmarBg.on('pointerdown', confirmarAcao);
  botaoConfirmar.on('pointerdown', confirmarAcao);
  botoesContainer.add(botaoConfirmar);
  
  // Botão cancelar
  const botaoCancelarBg = scene.add.rectangle(70, 0, buttonWidth, buttonHeight, 0x666666, 0.9);
  botaoCancelarBg.setStrokeStyle(2, 0x444444);
  botaoCancelarBg.setInteractive({ useHandCursor: true });
  botoesContainer.add(botaoCancelarBg);
  
  const botaoCancelar = scene.add.text(70, 0, '❌ CANCELAR', {
    fontSize: buttonFontSize,
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para cancelar reforço
  const cancelarAcao = () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    tocarSomClick();
    esconderInterfaceReforco();
  };
  
  botaoCancelarBg.on('pointerdown', cancelarAcao);
  botaoCancelar.on('pointerdown', cancelarAcao);
  botoesContainer.add(botaoCancelar);
  
  // Função para atualizar o texto da quantidade
  function atualizarTextoQuantidade() {
    textoQuantidade.setText(`${gameState.tropasParaColocar}/${tropasDisponiveis}`);
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
  
  // Tornar a interface arrastável
  tornarInterfaceArrastavel(interfaceReforco, scene);
}

function esconderInterfaceReforco() {
  if (interfaceReforco) {
    // Limpar intervalos de incremento/decremento se existirem
    if (window.incrementoInterval) {
      clearInterval(window.incrementoInterval);
      window.incrementoInterval = null;
    }
    if (window.decrementoInterval) {
      clearInterval(window.decrementoInterval);
      window.decrementoInterval = null;
    }
    
    interfaceReforco.destroy();
    interfaceReforco = null;
  }
  const gameState = getGameState();
  if (gameState) {
    // Verificar se o território selecionado pertence ao continente prioritário
    if (gameState.territorioSelecionadoParaReforco) {
      const territorio = gameState.territorioSelecionadoParaReforco;
      let pertenceAoContinentePrioritario = false;
      const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
      
      if (totalBonus > 0 && territorio.dono === gameState.turno && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
        const continente = gameState.continentes[gameState.continentePrioritario.nome];
        if (continente && continente.territorios.includes(territorio.nome)) {
          pertenceAoContinentePrioritario = true;
        }
      }
      
      if (pertenceAoContinentePrioritario) {
        // Manter borda branca grossa para território prioritário
        territorio.polygon.setStrokeStyle(6, 0xffffff, 1);
        // Não remover elevação - ela será gerenciada pela função restaurarAnimacoesTerritoriosBonus
        console.log(`🎯 Mantendo borda branca e elevação em ${territorio.nome} (território prioritário)`);
      } else {
        // Remover efeito de elevação e borda branca apenas se não for território prioritário
        territorio.polygon.setStrokeStyle(4, 0x000000, 1);
        // Obter a scene do polígono do território
        const scene = territorio.polygon.scene;
        if (scene) {
          removerElevacaoTerritorio(territorio.nome, scene);
          console.log(`🎯 Removendo borda e elevação de ${territorio.nome} (não prioritário)`);
        }
      }
    }
    gameState.tropasParaColocar = 0;
    gameState.territorioSelecionadoParaReforco = null;
  }
}

function confirmarReforco() {
  const gameState = getGameState();
  if (!gameState) return;
  
  if (gameState.territorioSelecionadoParaReforco && gameState.tropasParaColocar > 0) {
    console.log(`🔧 Enviando ${gameState.tropasParaColocar} reforços para ${gameState.territorioSelecionadoParaReforco.nome}`);
    
    // Enviar múltiplas vezes para colocar as tropas
    for (let i = 0; i < gameState.tropasParaColocar; i++) {
      emitWithRoom('colocarReforco', gameState.territorioSelecionadoParaReforco.nome);
    }
    esconderInterfaceReforco();
    
    // Verificar se ainda há tropas bônus para colocar após este reforço
    const tropasRestantes = gameState.tropasReforco + Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    if (tropasRestantes <= 0) {
      // Se não há mais tropas para colocar, parar todas as animações de salto
      limparTodasAnimacoesSalto();
    } else {
      // Se ainda há tropas bônus, restaurar animações para territórios bônus
      restaurarAnimacoesTerritoriosBonus();
    }
  } else {
    console.log('❌ Não foi possível confirmar reforço - dados inválidos');
  }
}

// Funções para interface de transferência após conquista
function mostrarInterfaceTransferenciaConquista(dados, scene) {
  // Verificar se a scene é válida
  if (!scene || !scene.add) {
    console.error('❌ Scene inválida em mostrarInterfaceTransferenciaConquista:', scene);
    return;
  }
  
  // Esconder interface anterior se existir
  esconderInterfaceTransferenciaConquista(true);
  
  // Inicializar com 1 tropa (automática)
  tropasParaTransferir = 1;
  
  // Criar container para a interface
  interfaceTransferenciaConquista = scene.add.container(400, 300);
  interfaceTransferenciaConquista.setDepth(20);
  
  // Background principal com gradiente
  const background = scene.add.rectangle(0, 0, 400, 250, 0x1a1a1a, 0.95);
  background.setStrokeStyle(3, 0xcc6633);
  background.setDepth(0);
  interfaceTransferenciaConquista.add(background);
  
  // Header com gradiente
  const headerBg = scene.add.rectangle(0, -100, 400, 50, 0xcc6633, 0.9);
  headerBg.setDepth(1);
  interfaceTransferenciaConquista.add(headerBg);
  
  // Ícone de conquista
  const conquistaIcon = scene.add.text(-170, -100, '⚔️', {
    fontSize: getResponsiveFontSize(24),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  interfaceTransferenciaConquista.add(conquistaIcon);
  
  // Título
  const titulo = scene.add.text(-140, -100, 'TRANSFERIR TROPAS', {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0, 0.5).setDepth(2);
  interfaceTransferenciaConquista.add(titulo);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -75, 350, 2, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  interfaceTransferenciaConquista.add(linhaDecorativa);
  
  // Container para territórios
  const territoriosContainer = scene.add.container(0, -30);
  territoriosContainer.setDepth(2);
  interfaceTransferenciaConquista.add(territoriosContainer);
  
  // Território atacante
  const atacanteBg = scene.add.rectangle(-100, 0, 180, 40, 0x2a2a2a, 0.9);
  atacanteBg.setStrokeStyle(2, 0xcc6633);
  territoriosContainer.add(atacanteBg);
  
  const atacanteIcon = scene.add.text(-170, 0, '⚔️', {
    fontSize: getResponsiveFontSize(18)
  }).setOrigin(0.5).setDepth(2);
  territoriosContainer.add(atacanteIcon);
  
  const atacanteText = scene.add.text(-130, 0, dados.territorioAtacante, {
    fontSize: getResponsiveFontSize(14),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  territoriosContainer.add(atacanteText);
  
  // Seta de direção
  const seta = scene.add.text(0, 0, '➡️', {
    fontSize: getResponsiveFontSize(20)
  }).setOrigin(0.5).setDepth(2);
  territoriosContainer.add(seta);
  
  // Território conquistado
  const conquistadoBg = scene.add.rectangle(100, 0, 180, 40, 0x2a2a2a, 0.9);
  conquistadoBg.setStrokeStyle(2, 0xcc6633);
  territoriosContainer.add(conquistadoBg);
  
  const conquistadoIcon = scene.add.text(30, 0, '🏆', {
    fontSize: getResponsiveFontSize(18)
  }).setOrigin(0.5).setDepth(2);
  territoriosContainer.add(conquistadoIcon);
  
  const conquistadoText = scene.add.text(70, 0, dados.territorioConquistado, {
    fontSize: getResponsiveFontSize(14),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  territoriosContainer.add(conquistadoText);
  
  // Container para controles de quantidade
  const controlesContainer = scene.add.container(0, 30);
  controlesContainer.setDepth(2);
  interfaceTransferenciaConquista.add(controlesContainer);
  
  // Background dos controles
  const controlesBg = scene.add.rectangle(0, 0, 300, 60, 0x2a2a2a, 0.9);
  controlesBg.setStrokeStyle(2, 0x444444);
  controlesContainer.add(controlesBg);
  
  // Título dos controles
  const controlesTitulo = scene.add.text(0, -20, 'Quantidade de Tropas', {
    fontSize: getResponsiveFontSize(14),
    fill: '#cccccc',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  controlesContainer.add(controlesTitulo);
  
  // Botão menos
  const botaoMenos = scene.add.text(-80, 10, '-', {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    backgroundColor: '#ff3333',
    padding: { x: getResponsivePadding(10), y: getResponsivePadding(5) },
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Variáveis para incremento progressivo
  let incrementoStep = 1;
  let incrementoDelay = 100;
  
  // Função para decremento progressivo
  function decrementoProgressivoTransferencia() {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    if (window.decrementoIntervalTransferencia) return; // Já está rodando
    
    window.decrementoIntervalTransferencia = setInterval(() => {
      if (tropasParaTransferir > 1) { // Mínimo 1 (tropa automática)
        // Calcular quantidade a decrementar baseada no tempo
        const tempoDecorrido = Date.now() - (window.decrementoIntervalTransferencia.startTime || Date.now());
        
        if (tempoDecorrido > 2000) { // Após 2 segundos
          incrementoStep = Math.min(10, Math.floor(tempoDecorrido / 1000)); // Máximo 10 por vez
        } else if (tempoDecorrido > 1000) { // Após 1 segundo
          incrementoStep = 5;
        } else if (tempoDecorrido > 500) { // Após 0.5 segundos
          incrementoStep = 2;
        }
        
        // Decrementar
        const decrementoReal = Math.min(incrementoStep, tropasParaTransferir - 1);
        tropasParaTransferir -= decrementoReal;
        atualizarTextoQuantidadeTransferencia();
        
        // Tocar som a cada 5 decrementos para feedback
        if (tropasParaTransferir % 5 === 0) {
          tocarSomClick();
        }
      } else {
        pararDecrementoProgressivoTransferencia();
      }
    }, incrementoDelay);
    
    window.decrementoIntervalTransferencia.startTime = Date.now();
  }
  
  // Função para parar decremento progressivo
  function pararDecrementoProgressivoTransferencia() {
    if (window.decrementoIntervalTransferencia) {
      clearInterval(window.decrementoIntervalTransferencia);
      window.decrementoIntervalTransferencia = null;
      incrementoStep = 1; // Resetar para próximo uso
    }
  }
  
  botaoMenos.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaTransferir > 1) { // Mínimo 1 (tropa automática)
      tropasParaTransferir--;
      atualizarTextoQuantidadeTransferencia();
    }
  });
  
  botaoMenos.on('pointerdown', decrementoProgressivoTransferencia);
  botaoMenos.on('pointerup', pararDecrementoProgressivoTransferencia);
  botaoMenos.on('pointerout', pararDecrementoProgressivoTransferencia);
  
  controlesContainer.add(botaoMenos);
  
  // Texto da quantidade
  const textoQuantidade = scene.add.text(0, 10, `${tropasParaTransferir}/${dados.tropasDisponiveis}`, {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(2);
  controlesContainer.add(textoQuantidade);
  
  // Botão mais
  const botaoMais = scene.add.text(80, 10, '+', {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    backgroundColor: '#33ff33',
    padding: { x: getResponsivePadding(10), y: getResponsivePadding(5) },
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para incremento progressivo
  function incrementoProgressivoTransferencia() {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    if (window.incrementoIntervalTransferencia) return; // Já está rodando
    
    window.incrementoIntervalTransferencia = setInterval(() => {
      if (tropasParaTransferir < dados.tropasDisponiveis) {
        // Calcular quantidade a incrementar baseada no tempo
        const tempoDecorrido = Date.now() - (window.incrementoIntervalTransferencia.startTime || Date.now());
        
        if (tempoDecorrido > 2000) { // Após 2 segundos
          incrementoStep = Math.min(10, Math.floor(tempoDecorrido / 1000)); // Máximo 10 por vez
        } else if (tempoDecorrido > 1000) { // Após 1 segundo
          incrementoStep = 5;
        } else if (tempoDecorrido > 500) { // Após 0.5 segundos
          incrementoStep = 2;
        }
        
        // Incrementar
        const incrementoReal = Math.min(incrementoStep, dados.tropasDisponiveis - tropasParaTransferir);
        tropasParaTransferir += incrementoReal;
        atualizarTextoQuantidadeTransferencia();
        
        // Tocar som a cada 5 incrementos para feedback
        if (tropasParaTransferir % 5 === 0) {
          tocarSomClick();
        }
      } else {
        pararIncrementoProgressivoTransferencia();
      }
    }, incrementoDelay);
    
    window.incrementoIntervalTransferencia.startTime = Date.now();
  }
  
  // Função para parar incremento progressivo
  function pararIncrementoProgressivoTransferencia() {
    if (window.incrementoIntervalTransferencia) {
      clearInterval(window.incrementoIntervalTransferencia);
      window.incrementoIntervalTransferencia = null;
      incrementoStep = 1; // Resetar para próximo uso
    }
  }
  
  botaoMais.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaTransferir < dados.tropasDisponiveis) {
      tropasParaTransferir++;
      atualizarTextoQuantidadeTransferencia();
    }
  });
  
  botaoMais.on('pointerdown', incrementoProgressivoTransferencia);
  botaoMais.on('pointerup', pararIncrementoProgressivoTransferencia);
  botaoMais.on('pointerout', pararIncrementoProgressivoTransferencia);
  
  controlesContainer.add(botaoMais);
  
  // Container para botões de ação
  const botoesContainer = scene.add.container(0, getResponsiveSize(100));
  botoesContainer.setDepth(2);
  interfaceTransferenciaConquista.add(botoesContainer);
  
  // Detectar se é dispositivo móvel
  const isMobile = window.innerWidth <= 768;
  const buttonWidth = isMobile ? getResponsiveSize(160) : getResponsiveSize(140);
  const buttonHeight = isMobile ? getResponsiveSize(50) : getResponsiveSize(40);
  const buttonFontSize = isMobile ? getResponsiveFontSize(18) : getResponsiveFontSize(14);
  
  // Botão confirmar
  const botaoConfirmarBg = scene.add.rectangle(0, 0, buttonWidth, buttonHeight, 0xcc6633, 0.9);
  botaoConfirmarBg.setStrokeStyle(2, 0xa55229);
  botaoConfirmarBg.setInteractive({ useHandCursor: true });
  botoesContainer.add(botaoConfirmarBg);
  
  const botaoConfirmar = scene.add.text(0, 0, '✅ CONFIRMAR', {
    fontSize: buttonFontSize,
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para confirmar transferência
  const confirmarTransferenciaAcao = () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    tocarSomClick();
    setTimeout(() => {
      confirmarTransferenciaConquista();
    }, 10);
  };
  
  botaoConfirmarBg.on('pointerdown', confirmarTransferenciaAcao);
  botaoConfirmar.on('pointerdown', confirmarTransferenciaAcao);
  botoesContainer.add(botaoConfirmar);
  

  
  // Função para atualizar o texto da quantidade
  function atualizarTextoQuantidadeTransferencia() {
    textoQuantidade.setText(`${tropasParaTransferir}/${dados.tropasDisponiveis}`);
  }
  
  // Tornar a interface arrastável
  tornarInterfaceArrastavel(interfaceTransferenciaConquista, scene);
}

function esconderInterfaceTransferenciaConquista(manterDados = false) {
  console.log('DEBUG: esconderInterfaceTransferenciaConquista chamada, manterDados =', manterDados);
  
  // Limpar intervalos de incremento/decremento se existirem
  if (window.incrementoIntervalTransferencia) {
    clearInterval(window.incrementoIntervalTransferencia);
    window.incrementoIntervalTransferencia = null;
  }
  if (window.decrementoIntervalTransferencia) {
    clearInterval(window.decrementoIntervalTransferencia);
    window.decrementoIntervalTransferencia = null;
  }
  
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

function esconderInterfaceRemanejamento() {
  console.log('DEBUG: esconderInterfaceRemanejamento chamada');
  
  if (interfaceRemanejamento) {
    interfaceRemanejamento.destroy();
    interfaceRemanejamento = null;
    console.log('DEBUG: Interface de remanejamento destruída');
  }
  
  // Limpar intervalos de incremento/decremento se existirem
  if (window.incrementoIntervalRemanejamento) {
    clearInterval(window.incrementoIntervalRemanejamento);
    window.incrementoIntervalRemanejamento = null;
  }
  if (window.decrementoIntervalRemanejamento) {
    clearInterval(window.decrementoIntervalRemanejamento);
    window.decrementoIntervalRemanejamento = null;
  }
}

function confirmarTransferenciaConquista() {
  console.log('DEBUG: confirmarTransferenciaConquista chamada');
  console.log('DEBUG: dadosConquista =', dadosConquista);
  console.log('DEBUG: tropasParaTransferir =', tropasParaTransferir);
  
  if (dadosConquista && tropasParaTransferir >= 0) {
    console.log('DEBUG: Enviando transferirTropasConquista para o servidor');
    emitWithRoom('transferirTropasConquista', {
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
  console.log('🔧 DEBUG: mostrarInterfaceRemanejamento chamada');
  console.log('🔧 DEBUG: Origem:', origem ? origem.nome : 'não definido');
  console.log('🔧 DEBUG: Destino:', destino ? destino.nome : 'não definido');
  console.log('🔧 DEBUG: Scene:', scene ? 'válida' : 'inválida');
  console.log('🔧 DEBUG: Quantidade máxima:', quantidadeMaxima);
  
  // Verificar se a scene é válida
  if (!scene || !scene.add) {
    console.error('❌ Scene inválida em mostrarInterfaceRemanejamento:', scene);
    return;
  }
  
  // Inicializar com 1 tropa
  let tropasParaMover = 1;
  const maxTropas = quantidadeMaxima || (origem.tropas - 1); // Usar quantidade máxima fornecida ou calcular
  
  // Criar container para a interface
  interfaceRemanejamento = scene.add.container(400, 300);
  interfaceRemanejamento.setDepth(20);
  
  // Background principal com gradiente
  const background = scene.add.rectangle(0, 0, 400, 250, 0x1a1a1a, 0.95);
  background.setStrokeStyle(3, 0x0077cc);
  background.setDepth(0);
  interfaceRemanejamento.add(background);
  
  // Header com gradiente
  const headerBg = scene.add.rectangle(0, -100, 400, 50, 0x0077cc, 0.9);
  headerBg.setDepth(1);
  interfaceRemanejamento.add(headerBg);
  
  // Ícone de movimento
  const movimentoIcon = scene.add.text(-170, -100, '🔄', {
    fontSize: getResponsiveFontSize(24),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  interfaceRemanejamento.add(movimentoIcon);
  
  // Título
  const titulo = scene.add.text(-140, -100, 'MOVER TROPAS', {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0, 0.5).setDepth(2);
  interfaceRemanejamento.add(titulo);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -75, 350, 2, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  interfaceRemanejamento.add(linhaDecorativa);
  
  // Container para territórios
  const territoriosContainer = scene.add.container(0, -30);
  territoriosContainer.setDepth(2);
  interfaceRemanejamento.add(territoriosContainer);
  
  // Território de origem
  const origemBg = scene.add.rectangle(-100, 0, 180, 40, 0x2a2a2a, 0.9);
  origemBg.setStrokeStyle(2, 0x0077cc);
  territoriosContainer.add(origemBg);
  
  const origemIcon = scene.add.text(-170, 0, '📤', {
    fontSize: getResponsiveFontSize(18)
  }).setOrigin(0.5).setDepth(2);
  territoriosContainer.add(origemIcon);
  
  const origemText = scene.add.text(-130, 0, origem.nome, {
    fontSize: getResponsiveFontSize(14),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  territoriosContainer.add(origemText);
  
  // Seta de direção
  const seta = scene.add.text(0, 0, '➡️', {
    fontSize: getResponsiveFontSize(20)
  }).setOrigin(0.5).setDepth(2);
  territoriosContainer.add(seta);
  
  // Território de destino
  const destinoBg = scene.add.rectangle(100, 0, 180, 40, 0x2a2a2a, 0.9);
  destinoBg.setStrokeStyle(2, 0x0077cc);
  territoriosContainer.add(destinoBg);
  
  const destinoIcon = scene.add.text(30, 0, '📥', {
    fontSize: getResponsiveFontSize(18)
  }).setOrigin(0.5).setDepth(2);
  territoriosContainer.add(destinoIcon);
  
  const destinoText = scene.add.text(70, 0, destino.nome, {
    fontSize: getResponsiveFontSize(14),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  territoriosContainer.add(destinoText);
  
  // Container para controles de quantidade
  const controlesContainer = scene.add.container(0, 30);
  controlesContainer.setDepth(2);
  interfaceRemanejamento.add(controlesContainer);
  
  // Background dos controles
  const controlesBg = scene.add.rectangle(0, 0, 300, 60, 0x2a2a2a, 0.9);
  controlesBg.setStrokeStyle(2, 0x444444);
  controlesContainer.add(controlesBg);
  
  // Título dos controles
  const controlesTitulo = scene.add.text(0, -20, 'Quantidade de Tropas', {
    fontSize: getResponsiveFontSize(14),
    fill: '#cccccc',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  controlesContainer.add(controlesTitulo);
  
  // Botão menos
  const botaoMenos = scene.add.text(-80, 10, '-', {
    fontSize: getResponsiveFontSize(28),
    fill: '#ffffff',
    backgroundColor: '#ff3333',
    padding: { x: getResponsivePadding(15), y: getResponsivePadding(8) },
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Variáveis para incremento progressivo
  let incrementoStep = 1;
  let incrementoDelay = 100;
  
  // Função para decremento progressivo
  function decrementoProgressivoRemanejamento() {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    if (window.decrementoIntervalRemanejamento) return; // Já está rodando
    
    window.decrementoIntervalRemanejamento = setInterval(() => {
      if (tropasParaMover > 1) {
        // Calcular quantidade a decrementar baseada no tempo
        const tempoDecorrido = Date.now() - (window.decrementoIntervalRemanejamento.startTime || Date.now());
        
        if (tempoDecorrido > 2000) { // Após 2 segundos
          incrementoStep = Math.min(10, Math.floor(tempoDecorrido / 1000)); // Máximo 10 por vez
        } else if (tempoDecorrido > 1000) { // Após 1 segundo
          incrementoStep = 5;
        } else if (tempoDecorrido > 500) { // Após 0.5 segundos
          incrementoStep = 2;
        }
        
        // Decrementar
        const decrementoReal = Math.min(incrementoStep, tropasParaMover - 1);
        tropasParaMover -= decrementoReal;
        atualizarTextoQuantidadeRemanejamento();
        
        // Tocar som a cada 5 decrementos para feedback
        if (tropasParaMover % 5 === 0) {
          tocarSomClick();
        }
      } else {
        pararDecrementoProgressivoRemanejamento();
      }
    }, incrementoDelay);
    
    window.decrementoIntervalRemanejamento.startTime = Date.now();
  }
  
  // Função para parar decremento progressivo
  function pararDecrementoProgressivoRemanejamento() {
    if (window.decrementoIntervalRemanejamento) {
      clearInterval(window.decrementoIntervalRemanejamento);
      window.decrementoIntervalRemanejamento = null;
      incrementoStep = 1; // Resetar para próximo uso
    }
  }
  
  botaoMenos.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaMover > 1) {
      tropasParaMover--;
      atualizarTextoQuantidadeRemanejamento();
    }
  });
  
  botaoMenos.on('pointerdown', decrementoProgressivoRemanejamento);
  botaoMenos.on('pointerup', pararDecrementoProgressivoRemanejamento);
  botaoMenos.on('pointerout', pararDecrementoProgressivoRemanejamento);
  
  controlesContainer.add(botaoMenos);
  
  // Texto da quantidade
  const textoQuantidade = scene.add.text(0, 10, `${tropasParaMover}/${maxTropas}`, {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(2);
  controlesContainer.add(textoQuantidade);
  
  // Botão mais
  const botaoMais = scene.add.text(80, 10, '+', {
    fontSize: getResponsiveFontSize(20),
    fill: '#ffffff',
    backgroundColor: '#33ff33',
    padding: { x: getResponsivePadding(10), y: getResponsivePadding(5) },
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para incremento progressivo
  function incrementoProgressivoRemanejamento() {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    if (window.incrementoIntervalRemanejamento) return; // Já está rodando
    
    window.incrementoIntervalRemanejamento = setInterval(() => {
      if (tropasParaMover < maxTropas) {
        // Calcular quantidade a incrementar baseada no tempo
        const tempoDecorrido = Date.now() - (window.incrementoIntervalRemanejamento.startTime || Date.now());
        
        if (tempoDecorrido > 2000) { // Após 2 segundos
          incrementoStep = Math.min(10, Math.floor(tempoDecorrido / 1000)); // Máximo 10 por vez
        } else if (tempoDecorrido > 1000) { // Após 1 segundo
          incrementoStep = 5;
        } else if (tempoDecorrido > 500) { // Após 0.5 segundos
          incrementoStep = 2;
        }
        
        // Incrementar
        const incrementoReal = Math.min(incrementoStep, maxTropas - tropasParaMover);
        tropasParaMover += incrementoReal;
        atualizarTextoQuantidadeRemanejamento();
        
        // Tocar som a cada 5 incrementos para feedback
        if (tropasParaMover % 5 === 0) {
          tocarSomClick();
        }
      } else {
        pararIncrementoProgressivoRemanejamento();
      }
    }, incrementoDelay);
    
    window.incrementoIntervalRemanejamento.startTime = Date.now();
  }
  
  // Função para parar incremento progressivo
  function pararIncrementoProgressivoRemanejamento() {
    if (window.incrementoIntervalRemanejamento) {
      clearInterval(window.incrementoIntervalRemanejamento);
      window.incrementoIntervalRemanejamento = null;
      incrementoStep = 1; // Resetar para próximo uso
    }
  }
  
  botaoMais.on('pointerdown', (pointer) => {
    tocarSomClick();
    if (tropasParaMover < maxTropas) {
      tropasParaMover++;
      atualizarTextoQuantidadeRemanejamento();
    }
  });
  
  botaoMais.on('pointerdown', incrementoProgressivoRemanejamento);
  botaoMais.on('pointerup', pararIncrementoProgressivoRemanejamento);
  botaoMais.on('pointerout', pararIncrementoProgressivoRemanejamento);
  
  controlesContainer.add(botaoMais);
  
  // Container para botões de ação
  const botoesContainer = scene.add.container(0, getResponsiveSize(100));
  botoesContainer.setDepth(2);
  interfaceRemanejamento.add(botoesContainer);
  
  // Detectar se é dispositivo móvel
  const isMobile = window.innerWidth <= 768;
  const buttonWidth = isMobile ? getResponsiveSize(160) : getResponsiveSize(140);
  const buttonHeight = isMobile ? getResponsiveSize(50) : getResponsiveSize(40);
  const buttonFontSize = isMobile ? getResponsiveFontSize(18) : getResponsiveFontSize(14);
  
  // Botão confirmar
  const botaoConfirmarBg = scene.add.rectangle(-80, 0, buttonWidth, buttonHeight, 0x0077cc, 0.9);
  botaoConfirmarBg.setStrokeStyle(2, 0x005fa3);
  botaoConfirmarBg.setInteractive({ useHandCursor: true });
  botoesContainer.add(botaoConfirmarBg);
  
  const botaoConfirmar = scene.add.text(-80, 0, '✅ CONFIRMAR', {
    fontSize: buttonFontSize,
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para confirmar remanejamento
  const confirmarRemanejamentoAcao = () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    tocarSomClick();
    console.log('🔧 DEBUG: Confirmando movimento de remanejamento');
    
    // Limpar intervalos de incremento/decremento se existirem
    if (window.incrementoIntervalRemanejamento) {
      clearInterval(window.incrementoIntervalRemanejamento);
      window.incrementoIntervalRemanejamento = null;
    }
    if (window.decrementoIntervalRemanejamento) {
      clearInterval(window.decrementoIntervalRemanejamento);
      window.decrementoIntervalRemanejamento = null;
    }
    
    emitWithRoom('moverTropas', {
      origem: origem.nome,
      destino: destino.nome,
      quantidade: tropasParaMover
    });
    limparSelecao();
    interfaceRemanejamento.destroy();
    interfaceRemanejamento = null;
    console.log('🔧 DEBUG: Interface de remanejamento destruída e variável resetada');
  };
  
  botaoConfirmarBg.on('pointerdown', confirmarRemanejamentoAcao);
  botaoConfirmar.on('pointerdown', confirmarRemanejamentoAcao);
  botoesContainer.add(botaoConfirmar);
  
  // Botão cancelar
  const botaoCancelarBg = scene.add.rectangle(80, 0, buttonWidth, buttonHeight, 0x666666, 0.9);
  botaoCancelarBg.setStrokeStyle(2, 0x444444);
  botaoCancelarBg.setInteractive({ useHandCursor: true });
  botoesContainer.add(botaoCancelarBg);
  
  const botaoCancelar = scene.add.text(80, 0, '❌ CANCELAR', {
    fontSize: buttonFontSize,
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  // Função para cancelar remanejamento
  const cancelarRemanejamentoAcao = () => {
    // Fechar indicação de início de turno automaticamente
    fecharIndicacaoInicioTurnoAutomatico();
    
    tocarSomClick();
    console.log('🔧 DEBUG: Cancelando movimento de remanejamento');
    
    // Limpar intervalos de incremento/decremento se existirem
    if (window.incrementoIntervalRemanejamento) {
      clearInterval(window.incrementoIntervalRemanejamento);
      window.incrementoIntervalRemanejamento = null;
    }
    if (window.decrementoIntervalRemanejamento) {
      clearInterval(window.decrementoIntervalRemanejamento);
      window.decrementoIntervalRemanejamento = null;
    }
    
    limparSelecao();
    interfaceRemanejamento.destroy();
    interfaceRemanejamento = null;
    console.log('🔧 DEBUG: Interface de remanejamento destruída e variável resetada');
  };
  
  botaoCancelarBg.on('pointerdown', cancelarRemanejamentoAcao);
  botaoCancelar.on('pointerdown', cancelarRemanejamentoAcao);
  botoesContainer.add(botaoCancelar);
  
  // Função para atualizar o texto da quantidade
  function atualizarTextoQuantidadeRemanejamento() {
    textoQuantidade.setText(`${tropasParaMover}/${maxTropas}`);
  }
  
  // Tornar a interface arrastável
  tornarInterfaceArrastavel(interfaceRemanejamento, scene);
}

function mostrarObjetivo(objetivo, scene) {
  // Verificar se a scene é válida
  if (!scene || !scene.add) {
    console.error('❌ Scene inválida em mostrarObjetivo:', scene);
    return;
  }
  
  // Fechar outras modais primeiro
  fecharTodasModais();
  
  modalObjetivoAberto = true; // Marca que o modal está aberto
  
  // Obter dimensões reais do canvas
  const canvas = scene.sys.game.canvas;
  const largura = canvas.width;
  const altura = canvas.height;
  
  // Criar overlay com blur effect
  const overlay = scene.add.rectangle(largura/2, altura/2, largura, altura, 0x000000, 0.7);
  overlay.setDepth(20);
  
  // Container principal com estilo moderno como o chat
  const container = scene.add.container(largura/2, altura/2);
  container.setDepth(21);
  
  // Background do container - estilo moderno como o chat
  const background = scene.add.rectangle(0, 0, getResponsiveSize(600, 0.9, 0.8), getResponsiveSize(400, 0.9, 0.8), 0x000000, 0.95);
  background.setStrokeStyle(2, 0x444444);
  background.setDepth(0);
  container.add(background);
  
  // Header com estilo moderno como o chat
  const headerBg = scene.add.rectangle(0, -170, getResponsiveSize(600, 0.9, 0.8), getResponsiveSize(50, 0.9, 0.8), 0x000000, 0.95);
  headerBg.setStrokeStyle(1, 0x444444);
  headerBg.setDepth(1);
  container.add(headerBg);
  
  // Ícone do objetivo
  const objetivoIcon = scene.add.text(-250, -170, '🎯', {
    fontSize: getResponsiveFontSize(24, 0.8, 0.6),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  container.add(objetivoIcon);
  
  // Título principal
  const titulo = scene.add.text(-210, -170, 'SEU OBJETIVO', {
    fontSize: getResponsiveFontSize(20, 0.8, 0.6),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  container.add(titulo);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -145, 550, 1, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  container.add(linhaDecorativa);
  
  // Container para o conteúdo principal
  const contentContainer = scene.add.container(0, -30);
  contentContainer.setDepth(2);
  container.add(contentContainer);
  
  // Ícone de objetivo específico baseado no tipo
  let objetivoIcone = '🎯';
  if (objetivo.descricao.includes('eliminar')) {
    objetivoIcone = '⚔️';
  } else if (objetivo.descricao.includes('conquistar')) {
    objetivoIcone = '🏆';
  } else if (objetivo.descricao.includes('territórios')) {
    objetivoIcone = '🗺️';
  } else if (objetivo.descricao.includes('continentes')) {
    objetivoIcone = '🌍';
  }
  
  const iconeObjetivo = scene.add.text(0, -60, objetivoIcone, {
    fontSize: getResponsiveFontSize(36, 0.8, 0.6),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(iconeObjetivo);
  
  // Descrição do objetivo com melhor formatação
  const descricao = scene.add.text(0, -10, objetivo.descricao, {
    fontSize: getResponsiveFontSize(18, 0.8, 0.6),
    fill: '#ffffff',
    align: 'center',
    wordWrap: { width: getResponsiveSize(500, 0.8, 0.6) },
    lineSpacing: 6
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(descricao);
  
  // Dica de jogo
  const dica = scene.add.text(0, 50, '💡 Dica: Mantenha seu objetivo em mente durante toda a partida!', {
    fontSize: getResponsiveFontSize(14, 0.8, 0.6),
    fill: '#cccccc',
    align: 'center',
    wordWrap: { width: getResponsiveSize(450, 0.8, 0.6) },
    fontStyle: 'italic'
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(dica);
  
  // Botão de fechar com estilo azul moderno como o chat
  const botaoFecharBg = scene.add.rectangle(0, 140, 150, 40, 0x0077cc, 0.95);
  botaoFecharBg.setStrokeStyle(1, 0x0077cc);
  botaoFecharBg.setDepth(1);
  container.add(botaoFecharBg);
  
  const botaoFechar = scene.add.text(0, 140, '✅ Entendi', {
    fontSize: getResponsiveFontSize(16, 0.8, 0.6),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });
  container.add(botaoFechar);
  
  // Efeitos hover no botão - estilo azul moderno
  botaoFechar.on('pointerover', () => {
    botaoFecharBg.setFillStyle(0x005fa3, 0.95);
    botaoFecharBg.setStrokeStyle(1, 0x005fa3);
  });
  
  botaoFechar.on('pointerout', () => {
    botaoFecharBg.setFillStyle(0x0077cc, 0.95);
    botaoFecharBg.setStrokeStyle(1, 0x0077cc);
  });
  
  botaoFechar.on('pointerdown', () => {
    tocarSomClick();
    fecharTodasModais();
  });
  
  // Animação de entrada
  container.setScale(0.8);
  scene.tweens.add({
    targets: container,
    scaleX: 1,
    scaleY: 1,
    duration: 300,
    ease: 'Back.easeOut'
  });
  
  // Animação do overlay
  overlay.setAlpha(0);
  scene.tweens.add({
    targets: overlay,
    alpha: 1,
    duration: 200,
    ease: 'Power2'
  });
  
  // Tornar a modal arrastável
  tornarInterfaceArrastavel(container, scene);
}

function mostrarCartasTerritorio(cartas, scene, forcarTroca = false) {
  // Verificar se a scene é válida
  if (!scene || !scene.add) {
    console.error('❌ Scene inválida em mostrarCartasTerritorio:', scene);
    return;
  }
  
  // Fechar outras modais primeiro
  fecharTodasModais();
  
  modalCartasTerritorioAberto = true; // Marca que o modal está aberto
  
  // Obter dimensões reais do canvas
  const canvas = scene.sys.game.canvas;
  const largura = canvas.width;
  const altura = canvas.height;
  
  // Criar overlay com blur effect
  const overlay = scene.add.rectangle(largura/2, altura/2, largura, altura, 0x000000, 0.7);
  overlay.setDepth(20);
  
  // Container principal com bordas arredondadas
  const container = scene.add.container(largura/2, altura/2);
  container.setDepth(21);
  
  // Background do container com gradiente
  const background = scene.add.rectangle(0, 0, 800, 600, 0x1a1a1a, 0.95);
  background.setStrokeStyle(3, 0x444444);
  background.setDepth(0);
  container.add(background);
  
  // Header com gradiente
  const headerBg = scene.add.rectangle(0, -250, 800, 60, forcarTroca ? 0xcc3333 : 0x9933cc, 0.9);
  headerBg.setDepth(1);
  container.add(headerBg);
  
  // Ícone das cartas
  const cartasIcon = scene.add.text(-350, -250, forcarTroca ? '⚠️' : '🎴', {
    fontSize: getResponsiveFontSize(32),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  container.add(cartasIcon);
  
  // Título principal
  const titulo = scene.add.text(-300, -250, forcarTroca ? 'TROCA OBRIGATÓRIA' : 'SUAS CARTAS TERRITÓRIO', {
    fontSize: getResponsiveFontSize(28),
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0, 0.5).setDepth(2);
  container.add(titulo);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -220, 750, 2, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  container.add(linhaDecorativa);
  
  // Container para o conteúdo principal
  const contentContainer = scene.add.container(0, -30);
  contentContainer.setDepth(2);
  container.add(contentContainer);
  
  if (cartas.length === 0) {
    // Mensagem quando não há cartas
    const iconeVazio = scene.add.text(0, -80, '📭', {
      fontSize: getResponsiveFontSize(48),
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);
    contentContainer.add(iconeVazio);
    
    const mensagem = scene.add.text(0, -20, 'Você ainda não possui cartas território.\nConquiste territórios de outros jogadores para ganhar cartas!', {
      fontSize: getResponsiveFontSize(18),
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: getResponsiveSize(600) },
      stroke: '#000000',
      strokeThickness: 2,
      lineSpacing: 8
    }).setOrigin(0.5).setDepth(2);
    contentContainer.add(mensagem);
    
    const dica = scene.add.text(0, 60, '💡 Dica: Conquiste territórios de outros jogadores para ganhar cartas território!', {
      fontSize: getResponsiveFontSize(16),
      fill: '#cccccc',
      align: 'center',
      wordWrap: { width: getResponsiveSize(550) },
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(2);
    contentContainer.add(dica);
  } else {
    // Mostrar as cartas
    const cartasTexto = scene.add.text(0, -140, `Você possui ${cartas.length} carta(s):`, {
      fontSize: getResponsiveFontSize(20),
      fill: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(2);
    contentContainer.add(cartasTexto);
    
    // Instruções
    const instrucoesText = scene.add.text(0, -100, 'Clique nas cartas para selecionar (máximo 3)', {
      fontSize: getResponsiveFontSize(16),
      fill: '#cccccc',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5).setDepth(2);
    contentContainer.add(instrucoesText);
    
    // Criar cartas clicáveis
    const cartasSelecionadas = [];
    const cartasClicaveis = [];
    
    cartas.forEach((carta, index) => {
      const x = (index - Math.floor(cartas.length / 2)) * 130;
      
      // Criar container para a carta
      const cartaContainer = scene.add.container(x, 0);
      cartaContainer.setDepth(2);
      contentContainer.add(cartaContainer);
      
      // Background da carta (formato de carta)
      const cartaBg = scene.add.rectangle(0, 0, 100, 140, 0x2a2a2a, 0.95);
      cartaBg.setStrokeStyle(2, 0x444444);
      cartaContainer.add(cartaBg);
      
      // Símbolo da carta (maior e centralizado)
      const simbolo = scene.add.text(0, -30, carta.simbolo, {
        fontSize: getResponsiveFontSize(36),
        fill: '#ffaa00',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      cartaContainer.add(simbolo);
      
      // Nome do território (menor, na parte inferior)
      const nomeTerritorio = scene.add.text(0, 20, carta.territorio, {
        fontSize: getResponsiveFontSize(10),
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: getResponsiveSize(90) },
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5);
      cartaContainer.add(nomeTerritorio);
      
      // Linha decorativa
      const linha = scene.add.rectangle(0, 0, 80, 1, 0x444444, 0.8);
      cartaContainer.add(linha);
      
      // Tornar toda a carta interativa
      cartaContainer.setInteractive(new Phaser.Geom.Rectangle(-50, -70, 100, 140), Phaser.Geom.Rectangle.Contains);
      cartaContainer.setData('carta', carta);
      
      cartaContainer.on('pointerdown', () => {
        tocarSomClick();
        if (cartasSelecionadas.includes(cartaContainer)) {
          // Deselecionar
          const index = cartasSelecionadas.indexOf(cartaContainer);
          cartasSelecionadas.splice(index, 1);
          cartaBg.setFillStyle(0x2a2a2a, 0.95);
          cartaBg.setStrokeStyle(2, 0x444444);
        } else if (cartasSelecionadas.length < 3) {
          // Selecionar
          cartasSelecionadas.push(cartaContainer);
          cartaBg.setFillStyle(0xffaa00, 0.3);
          cartaBg.setStrokeStyle(3, 0xffaa00);
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
      
      cartasClicaveis.push(cartaContainer);
    });
    

    
    // Botão de trocar com estilo moderno
    const botaoTrocarBg = scene.add.rectangle(0, 80, 250, 50, 0x0077cc, 0.9);
    botaoTrocarBg.setStrokeStyle(2, 0x005fa3);
    botaoTrocarBg.setDepth(1);
    container.add(botaoTrocarBg);
    
    const botaoTrocar = scene.add.text(0, 80, '🔄 Trocar Cartas', {
      fontSize: getResponsiveFontSize(18),
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });
    container.add(botaoTrocar);
    
    // Efeitos hover no botão de trocar
    botaoTrocar.on('pointerover', () => {
      botaoTrocarBg.setFillStyle(0x005fa3, 0.9);
      botaoTrocarBg.setStrokeStyle(2, 0x004a82);
    });
    
    botaoTrocar.on('pointerout', () => {
      botaoTrocarBg.setFillStyle(0x0077cc, 0.9);
      botaoTrocarBg.setStrokeStyle(2, 0x005fa3);
    });
    
    botaoTrocar.on('pointerdown', () => {
      tocarSomClick();
      console.log('🔧 Botão trocar cartas clicado - cartas selecionadas:', cartasSelecionadas.length);
      
      if (cartasSelecionadas.length === 3) {
        // Mapear os containers de carta de volta para os nomes dos territórios
        const territoriosSelecionados = cartasSelecionadas.map(cartaContainer => cartaContainer.getData('carta').territorio);
        console.log('🔧 Enviando troca de cartas:', territoriosSelecionados);
        console.log('🔧 Tipo dos dados:', Array.isArray(territoriosSelecionados) ? 'Array' : 'Outro tipo');
        emitWithRoom('trocarCartasTerritorio', territoriosSelecionados);
      } else {
        console.log('❌ Não há 3 cartas selecionadas para trocar');
      }
    });
  }
  
  // Botão de fechar com estilo moderno (só se não for troca obrigatória)
  if (!forcarTroca) {
    const botaoFecharBg = scene.add.rectangle(0, 160, 200, 50, 0x0077cc, 0.9);
    botaoFecharBg.setStrokeStyle(2, 0x005fa3);
    botaoFecharBg.setDepth(1);
    container.add(botaoFecharBg);
    
    const botaoFechar = scene.add.text(0, 160, '✅ Entendi', {
      fontSize: getResponsiveFontSize(18),
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(2).setInteractive({ useHandCursor: true });
    container.add(botaoFechar);
    
    // Efeitos hover no botão de fechar
    botaoFechar.on('pointerover', () => {
      botaoFecharBg.setFillStyle(0x005fa3, 0.9);
      botaoFecharBg.setStrokeStyle(2, 0x004a82);
    });
    
    botaoFechar.on('pointerout', () => {
      botaoFecharBg.setFillStyle(0x0077cc, 0.9);
      botaoFecharBg.setStrokeStyle(2, 0x005fa3);
    });
    
    botaoFechar.on('pointerdown', () => {
      tocarSomClick();
      fecharTodasModais();
    });
  }
  
  // Animação de entrada
  container.setScale(0.8);
  scene.tweens.add({
    targets: container,
    scaleX: 1,
    scaleY: 1,
    duration: 300,
    ease: 'Back.easeOut'
  });
  
  // Animação do overlay
  overlay.setAlpha(0);
  scene.tweens.add({
    targets: overlay,
    alpha: 1,
    duration: 200,
    ease: 'Power2'
  });
  
  // Tornar a modal arrastável
  tornarInterfaceArrastavel(container, scene);
}

// Variável global para controlar se os indicadores já foram criados
let indicadoresContinentesCriados = false;
let linhasContinentes = []; // Array para armazenar as linhas dos continentes

// Função utilitária para calcular tamanhos de fonte responsivos
function getResponsiveFontSize(baseSize, mobileMultiplier = 0.8, smallMobileMultiplier = 0.6) {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const isLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  
  if (isLandscape) {
    return Math.floor(baseSize * 0.7) + 'px';
  } else if (isSmallMobile) {
    return Math.floor(baseSize * smallMobileMultiplier) + 'px';
  } else if (isMobile) {
    return Math.floor(baseSize * mobileMultiplier) + 'px';
  } else {
    return baseSize + 'px';
  }
}

// Função utilitária para calcular tamanhos de elementos gráficos responsivos
function getResponsiveSize(baseSize, mobileMultiplier = 0.8, smallMobileMultiplier = 0.6) {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const isLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  
  if (isLandscape) {
    return Math.floor(baseSize * 0.7);
  } else if (isSmallMobile) {
    return Math.floor(baseSize * smallMobileMultiplier);
  } else if (isMobile) {
    return Math.floor(baseSize * mobileMultiplier);
  } else {
    return baseSize;
  }
}

// Nova função para calcular posições responsivas
function getResponsivePosition(baseX, baseY, mobileMultiplier = 0.8, smallMobileMultiplier = 0.6) {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const isLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  
  let multiplier = 1;
  if (isLandscape) {
    multiplier = 0.7;
  } else if (isSmallMobile) {
    multiplier = smallMobileMultiplier;
  } else if (isMobile) {
    multiplier = mobileMultiplier;
  }
  
  return {
    x: Math.floor(baseX * multiplier),
    y: Math.floor(baseY * multiplier)
  };
}

// Nova função para calcular padding responsivo
function getResponsivePadding(basePadding, mobileMultiplier = 0.8, smallMobileMultiplier = 0.6) {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const isLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  
  let multiplier = 1;
  if (isLandscape) {
    multiplier = 0.7;
  } else if (isSmallMobile) {
    multiplier = smallMobileMultiplier;
  } else if (isMobile) {
    multiplier = mobileMultiplier;
  }
  
  return Math.floor(basePadding * multiplier);
}

// Nova função para detectar dispositivo móvel
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Nova função para detectar dispositivo muito pequeno
function isSmallMobileDevice() {
  return window.innerWidth <= 480;
}

// Nova função para detectar orientação landscape em mobile
function isMobileLandscape() {
  return window.innerHeight <= 500 && window.innerWidth > window.innerHeight && isMobileDevice();
}

// Nova função para calcular tamanho de botões responsivos
function getResponsiveButtonSize(baseSize, mobileMultiplier = 0.8, smallMobileMultiplier = 0.6) {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const isLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  
  let multiplier = 1;
  if (isLandscape) {
    multiplier = 0.7;
  } else if (isSmallMobile) {
    multiplier = smallMobileMultiplier;
  } else if (isMobile) {
    multiplier = mobileMultiplier;
  }
  
  return Math.floor(baseSize * multiplier);
}

// Nova função para calcular espaçamento responsivo
function getResponsiveSpacing(baseSpacing, mobileMultiplier = 0.8, smallMobileMultiplier = 0.6) {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const isLandscape = window.innerHeight <= 500 && window.innerWidth > window.innerHeight;
  
  let multiplier = 1;
  if (isLandscape) {
    multiplier = 0.7;
  } else if (isSmallMobile) {
    multiplier = smallMobileMultiplier;
  } else if (isMobile) {
    multiplier = mobileMultiplier;
  }
  
  return Math.floor(baseSpacing * multiplier);
}

// Nova função para atualizar todos os elementos responsivos
function updateAllResponsiveElements() {
  console.log('🔄 Atualizando todos os elementos responsivos...');
  
  // Atualizar HUD CSS
  updateCSSHUD();
  
  // Atualizar posicionamento do canvas
  forceMobileCanvasPosition();
  
  // Atualizar elementos do jogo se a scene estiver disponível
  if (window.game && window.game.scene && window.game.scene.scenes[0]) {
    const scene = window.game.scene.scenes[0];
    
    // Atualizar linhas de continentes
    const canvas = scene.sys.game.canvas;
    const originalWidth = 1280;
    const originalHeight = 720;
    const scaleX = canvas.width / originalWidth;
    const scaleY = canvas.height / originalHeight;
    atualizarLinhasContinentes(scene, scaleX, scaleY);
    
    // Atualizar interfaces abertas
    if (interfaceReforco) {
      // Reposicionar interface de reforço se estiver aberta
      const gameState = getGameState();
      if (gameState && gameState.territorioSelecionadoParaReforco) {
        // Recalcular posição baseada no novo tamanho da tela
        const newX = Math.min(Math.max(canvas.width / 2, getResponsiveSize(200)), canvas.width - getResponsiveSize(200));
        const newY = Math.min(Math.max(canvas.height / 2, getResponsiveSize(150)), canvas.height - getResponsiveSize(150));
        interfaceReforco.setPosition(newX, newY);
      }
    }
    
    if (interfaceTransferenciaConquista) {
      // Reposicionar interface de transferência se estiver aberta
      const newX = Math.min(Math.max(canvas.width / 2, getResponsiveSize(200)), canvas.width - getResponsiveSize(200));
      const newY = Math.min(Math.max(canvas.height / 2, getResponsiveSize(150)), canvas.height - getResponsiveSize(150));
      interfaceTransferenciaConquista.setPosition(newX, newY);
    }
    
    if (interfaceRemanejamento) {
      // Reposicionar interface de remanejamento se estiver aberta
      const newX = Math.min(Math.max(canvas.width / 2, getResponsiveSize(200)), canvas.width - getResponsiveSize(200));
      const newY = Math.min(Math.max(canvas.height / 2, getResponsiveSize(150)), canvas.height - getResponsiveSize(150));
      interfaceRemanejamento.setPosition(newX, newY);
    }
  }
  
  // Atualizar popup de histórico se estiver aberto
  const historyPopup = document.querySelector('.history-popup');
  if (historyPopup && historyPopup.style.display !== 'none') {
    // O popup já é responsivo via CSS, mas podemos forçar um recálculo
    historyPopup.style.display = 'none';
    setTimeout(() => {
      historyPopup.style.display = 'block';
    }, 10);
  }
  
  console.log('✅ Elementos responsivos atualizados');
}

// Helper function to get player color class
function getPlayerColorClass(playerName) {
  const colorMap = {
    'Vermelho': 'vermelho',
    'Azul': 'azul', 
    'Verde': 'verde',
    'Amarelo': 'amarelo',
    'Preto': 'preto',
    'Roxo': 'roxo'
  };
  return colorMap[playerName] || 'vermelho';
}

// CSS HUD Functions
function initializeCSSHUD() {
  // Initialize HUD elements
  updateCSSHUD();
}

function updateCSSHUD() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const playerNameEl = document.getElementById('player-name');
  const playerStatsEl = document.getElementById('player-stats');
  const turnMarksEl = document.getElementById('turn-marks');
  const turnTextEl = document.getElementById('turn-text');
  const turnPointerEl = document.getElementById('turn-pointer');
  const continentStatusEl = document.getElementById('continent-status');

  // Update player info
  if (playerNameEl) {
    // Use logged in username first, then server-assigned name, then loading
    const displayName = playerUsername || gameState.meuNome || 'Carregando...';
    playerNameEl.textContent = displayName;
  }

  // Update player stats
  if (playerStatsEl) {
    const tropas = gameState.paises
      .filter(p => p.dono === gameState.meuNome)
      .reduce((soma, p) => soma + p.tropas, 0);
    const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    const totalReforcos = gameState.tropasReforco + totalBonus;
    playerStatsEl.textContent = `Tropas: ${tropas} | Reforço: ${totalReforcos}`;
  }

  // Update turn indicator
  if (turnMarksEl && turnTextEl && turnPointerEl) {
    // Clear existing marks
    turnMarksEl.innerHTML = '';
    
    // Count territories per player
    const playerTerritories = {};
    gameState.paises.forEach(pais => {
      if (pais.dono && pais.dono !== 'Neutro') {
        playerTerritories[pais.dono] = (playerTerritories[pais.dono] || 0) + 1;
      }
    });

    // Create marks for each player in clockwise order (Azul, Vermelho, Verde, Amarelo, Preto, Roxo)
    const playerOrder = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Preto', 'Roxo'];
    const players = playerOrder.filter(player => playerTerritories[player] > 0);
    const totalMarks = players.reduce((sum, player) => sum + playerTerritories[player], 0);
    
    if (totalMarks > 0) {
      let currentAngle = 0;
      let playerAngles = {}; // Store the angle for each player's center mark
      
      players.forEach(player => {
        const territoryCount = playerTerritories[player];
        const colorClass = getPlayerColorClass(player);
        
        // Calculate the center angle for this player's marks
        if (territoryCount === 1) {
          // For single mark, use the mark's angle directly
          playerAngles[player] = currentAngle;
          console.log(`🎯 ${player}: 1 tracinho, ângulo = ${currentAngle}°`);
        } else {
          // For multiple marks, calculate the center between first and last mark
          const firstMarkAngle = currentAngle;
          const lastMarkAngle = currentAngle + (360 / totalMarks * (territoryCount - 1));
          playerAngles[player] = (firstMarkAngle + lastMarkAngle) / 2;
          console.log(`🎯 ${player}: ${territoryCount} tracinhos, ângulo centro = ${playerAngles[player]}° (primeiro: ${firstMarkAngle}°, último: ${lastMarkAngle}°)`);
        }
        
        for (let i = 0; i < territoryCount; i++) {
          const mark = document.createElement('div');
          mark.className = `turn-mark ${colorClass}`;
          mark.style.transform = `rotate(${currentAngle}deg)`;
          turnMarksEl.appendChild(mark);
          currentAngle += (360 / totalMarks);
        }
      });

      // Update pointer to point to current player's center mark
      if (gameState.turno && playerAngles[gameState.turno] !== undefined) {
        turnPointerEl.style.display = 'block';
        turnPointerEl.className = `turn-pointer ${getPlayerColorClass(gameState.turno)}`;
        turnPointerEl.style.transform = `rotate(${playerAngles[gameState.turno]}deg)`;
        console.log(`👆 Ponteiro apontando para ${gameState.turno} no ângulo ${playerAngles[gameState.turno]}°`);
      } else {
        turnPointerEl.style.display = 'none';
        console.log(`❌ Ponteiro oculto - turno: ${gameState.turno}, ângulos:`, playerAngles);
      }
    } else {
      turnPointerEl.style.display = 'none';
    }

    // Update turn text
    if (gameState.faseRemanejamento && gameState.meuNome === gameState.turno) {
      turnTextEl.textContent = '🔄';
    } else if (gameState.meuNome === gameState.turno) {
      turnTextEl.textContent = '⚔️';
    } else {
      turnTextEl.textContent = '⏳';
    }

      // Update game instructions
  const instructionEl = document.getElementById('instruction-text');
  if (instructionEl) {
    let instruction = '';
    let shouldHighlight = false;
    
    // Verificar se é o turno do jogador
    if (gameState.meuNome === gameState.turno) {
      shouldHighlight = true;
      
      if (gameState.vitoria) {
        instruction = '🎉 Parabéns! Você venceu!';
      } else if (gameState.derrota) {
        instruction = '💀 Você perdeu o jogo!';
      } else if (gameState.faseRemanejamento) {
        instruction = '🔄 Selecione territórios para mover tropas';
      } else {
        // Fase de ataque
        const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
        const totalReforco = gameState.tropasReforco + totalBonus;
        
        if (totalReforco > 0) {
          // Verificar se há tropas bônus de continente prioritário
          if (totalBonus > 0 && gameState.continentePrioritario) {
            instruction = `🎯 Coloque ${totalBonus} tropas bônus no continente ${gameState.continentePrioritario.nome}`;
          } else {
            instruction = '🎯 Selecione um território para reforçar tropas';
          }
        } else {
          instruction = '⚔️ Selecione um território seu e um inimigo para atacar';
        }
      }
    } else {
      // Não é o turno do jogador
      if (gameState.vitoria) {
        instruction = '🎉 Jogo finalizado!';
      } else if (gameState.derrota) {
        instruction = '💀 Jogo finalizado!';
      } else {
        const currentPlayer = gameState.jogadores.find(j => j.nome === gameState.turno);
        const isHumanPlayer = currentPlayer && !currentPlayer.isCPU;
        
        if (isHumanPlayer) {
          instruction = `⏳ Aguardando ${gameState.turno}...`;
        } else {
          instruction = `🤖 ${gameState.turno} está jogando...`;
        }
      }
    }
    
    instructionEl.textContent = instruction;
    
    // Aplicar destaque quando necessário
    if (shouldHighlight && !gameState.vitoria && !gameState.derrota) {
      instructionEl.classList.add('highlight');
    } else {
      instructionEl.classList.remove('highlight');
    }
  }

  // Update global turn timer
  const globalTimerEl = document.getElementById('global-turn-timer');
  if (globalTimerEl) {
    // Show timer for all human players' turns (not CPU)
    const currentPlayer = gameState.jogadores.find(j => j.nome === gameState.turno);
    const isHumanPlayer = currentPlayer && !currentPlayer.isCPU;
    
    if (isHumanPlayer && !gameState.vitoria && !gameState.derrota) {
      // Show timer for all players to see
        globalTimerEl.style.display = 'flex';
        
        // Start turn timer when it's the player's turn and not already running
        if (gameState.meuNome === gameState.turno && !isPlayerTurn) {
          console.log('🎮 Starting turn timer for player:', gameState.meuNome);
          startTurnTimer();
        }
      } else {
        // Hide timer if it's CPU turn or game is over
        globalTimerEl.style.display = 'none';
        if (isPlayerTurn) {
          stopTurnTimer();
        }
      }
    }


  }



  // Update button states
  if (botaoTurno) {
    // Hide the turn button completely if it's not the player's turn
    if (gameState.meuNome !== gameState.turno || gameState.vitoria || gameState.derrota) {
      botaoTurno.style.display = 'none';
    } else {
      botaoTurno.style.display = 'flex';
      botaoTurno.disabled = false;
    }
  }
  if (botaoObjetivo) {
    botaoObjetivo.disabled = gameState.vitoria || gameState.derrota;
  }
  if (botaoCartasTerritorio) {
    // Bloquear cartas durante vitória/derrota ou durante fase de remanejamento
    const deveBloquear = gameState.vitoria || gameState.derrota || gameState.faseRemanejamento;
    botaoCartasTerritorio.disabled = deveBloquear;
    
    // Adicionar visual feedback quando bloqueado
    if (deveBloquear) {
      botaoCartasTerritorio.style.opacity = '0.5';
      botaoCartasTerritorio.style.cursor = 'not-allowed';
    } else {
      botaoCartasTerritorio.style.opacity = '1';
      botaoCartasTerritorio.style.cursor = 'pointer';
    }
  }
  
  // Atualizar cards dos jogadores se estiverem visíveis
  const panel = document.getElementById('player-info-panel');
  if (panel && panel.classList.contains('open')) {
    updatePlayerInfoPanel();
  }
}



function adicionarIndicadoresContinentes(scene) {
  // Evitar criar indicadores duplicados
  if (indicadoresContinentesCriados) return;
  
  // Definir posições para os indicadores de continentes (reposicionados para evitar sobreposição)
  const indicadoresContinentes = [
    {
      nome: 'Thaloria',
      bonus: 5,
      x: 120,
      y: 80,
      texto: 'Thaloria +5',
      territorioRepresentativo: 'Redwyn'
    },
    {
      nome: 'Zarandis',
      bonus: 3,
      x: 550,
      y: 550,
      texto: 'Zarandis +3',
      territorioRepresentativo: 'Ravenspire'
    },
    {
      nome: 'Elyndra',
      bonus: 5,
      x: 550,
      y: 70,
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
      fontSize: getResponsiveFontSize(14, 0.7, 0.5),
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      fontStyle: 'bold',
      backgroundColor: '#333333',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);
    
    textoIndicador.setDepth(3); // Colocar acima dos territórios mas abaixo da UI

    // Armazenar referência do texto para poder redimensionar depois
    linhasContinentes.push({
      texto: textoIndicador,
      indicadorX: indicador.x,
      indicadorY: indicador.y,
      nome: indicador.nome,
      tipo: 'texto'
    });

    // Adicionar linha conectando o território representativo ao indicador
    // Primeiro, precisamos encontrar as coordenadas do território representativo
    const gameState = getGameState();
    if (!gameState) return;
    
    const territorio = gameState.paises.find(p => p.nome === indicador.territorioRepresentativo);
    
    // DEBUG: Log para Zarandis
    if (indicador.nome === 'Zarandis') {
      console.log(`DEBUG: Zarandis - Procurando território: ${indicador.territorioRepresentativo}`);
      console.log(`DEBUG: Zarandis - Território encontrado:`, territorio);
      if (territorio) {
        console.log(`DEBUG: Zarandis - Coordenadas: X=${territorio.x}, Y=${territorio.y}`);
      }
    }
    
    if (territorio && territorio.x && territorio.y) {
      // Criar uma linha do território ao indicador
      const linha = scene.add.graphics();
      linha.lineStyle(2, 0xffffff, 0.7); // Linha branca semi-transparente
      linha.beginPath();
      linha.moveTo(territorio.x, territorio.y);
      linha.lineTo(indicador.x, indicador.y);
      linha.strokePath();
      linha.setDepth(2); // Colocar abaixo dos indicadores mas acima dos territórios
      
      // Armazenar referência da linha para poder redimensionar depois
      linhasContinentes.push({
        linha: linha,
        territorioX: territorio.x,
        territorioY: territorio.y,
        indicadorX: indicador.x,
        indicadorY: indicador.y,
        nome: indicador.nome,
        tipo: 'linha'
      });
    } else {
      console.warn(`Território representativo não encontrado para ${indicador.nome}: ${indicador.territorioRepresentativo}`);
    }
  });
  
  // Marcar que os indicadores foram criados
  indicadoresContinentesCriados = true;
}

// Função para forçar posicionamento correto do canvas no mobile
function forceMobileCanvasPosition() {
  const isMobile = isMobileDevice();
  const isSmallMobile = isSmallMobileDevice();
  const isLandscape = isMobileLandscape();
  
  if (!isMobile) return;

  const hudTop = document.querySelector('.hud-top');
  const canvasElement = document.querySelector('canvas');
  
  if (hudTop && canvasElement) {
    // Calcular posição exata do HUD
    const hudRect = hudTop.getBoundingClientRect();
    const hudBottom = hudRect.bottom;
    
    // Aplicar posicionamento correto
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = `${hudBottom}px`;
    canvasElement.style.left = '0';
    canvasElement.style.right = '0';
    canvasElement.style.bottom = '0';
    canvasElement.style.width = '100%';
    canvasElement.style.height = `calc(100vh - ${hudBottom}px)`;
    canvasElement.style.objectFit = 'fill';
    canvasElement.style.zIndex = '1';
    
    console.log('📱 Mobile canvas positioned at:', hudBottom, 'px from top');
  }
}

// Função para atualizar as linhas dos continentes com a nova escala
function atualizarLinhasContinentes(scene, scaleX, scaleY) {
  if (!linhasContinentes || linhasContinentes.length === 0) return;

  linhasContinentes.forEach(item => {
    if (item.tipo === 'texto') {
      // Atualizar posição e escala do texto
      if (item.texto && !item.texto.destroyed) {
        const novoIndicadorX = item.indicadorX * scaleX;
        const novoIndicadorY = item.indicadorY * scaleY;
        
        item.texto.setPosition(novoIndicadorX, novoIndicadorY);
        
        // Ajustar escala baseado no tamanho da tela
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        let escalaTexto;
        if (isSmallMobile) {
          escalaTexto = Math.min(scaleX, scaleY) * 0.6; // 60% da escala normal para mobile pequeno
        } else if (isMobile) {
          escalaTexto = Math.min(scaleX, scaleY) * 0.8; // 80% da escala normal para mobile
        } else {
          escalaTexto = Math.min(scaleX, scaleY); // Escala normal para desktop
        }
        
        item.texto.setScale(escalaTexto);
      }
    } else if (item.linha && !item.linha.destroyed) {
      // Calcular novas coordenadas escaladas
      const novoTerritorioX = item.territorioX * scaleX;
      const novoTerritorioY = item.territorioY * scaleY;
      const novoIndicadorX = item.indicadorX * scaleX;
      const novoIndicadorY = item.indicadorY * scaleY;

      // Limpar e redesenhar a linha
      item.linha.clear();
      item.linha.lineStyle(2, 0xffffff, 0.7);
      item.linha.beginPath();
      item.linha.moveTo(novoTerritorioX, novoTerritorioY);
      item.linha.lineTo(novoIndicadorX, novoIndicadorY);
      item.linha.strokePath();
    }
  });
}

// Função para fechar todas as modais
function fecharTodasModais() {
  // Fechar modal de objetivo
  if (modalObjetivoAberto) {
    modalObjetivoAberto = false;
    // Destruir elementos do modal se existirem
    const overlay = game.scene.scenes[0].children.list.find(child => child.type === 'Rectangle' && child.depth === 20);
    const container = game.scene.scenes[0].children.list.find(child => child.type === 'Container' && child.depth === 21);
    if (overlay) overlay.destroy();
    if (container) container.destroy();
  }
  
  // Fechar modal de cartas território
  if (modalCartasTerritorioAberto) {
    modalCartasTerritorioAberto = false;
    // Destruir elementos do modal se existirem
    const overlay = game.scene.scenes[0].children.list.find(child => child.type === 'Rectangle' && child.depth === 20);
    const container = game.scene.scenes[0].children.list.find(child => child.type === 'Container' && child.depth === 21);
    if (overlay) overlay.destroy();
    if (container) container.destroy();
  }
  
  // Fechar popup de histórico
  const gameState = getGameState();
  if (gameState && gameState.historyPopupVisible) {
    gameState.historyPopupVisible = false;
    const popup = document.getElementById('history-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  }
}

// Action History Functions
function initializeActionHistory() {
  // Create chat button in the HUD
  const historyButton = document.createElement('button');
  historyButton.className = 'hud-button btn-history';
  historyButton.id = 'btn-history';
  historyButton.innerHTML = '<span>💬</span><span>Chat</span>';
  
  // Add to action buttons container
  const actionButtons = document.querySelector('.action-buttons');
  if (actionButtons) {
    actionButtons.appendChild(historyButton);
  }
  
  // Add event listener
  historyButton.addEventListener('click', () => {
    tocarSomClick();
    toggleHistoryPopup();
  });
  
  // Create history popup
  createHistoryPopup();
}

function createHistoryPopup() {
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'history-popup';
  popup.className = 'history-popup';
  popup.style.display = 'none';
  
  // Create popup content with tabs
  popup.innerHTML = `
    <div class="history-header">
      <div class="history-tabs">
        <button class="history-tab active" id="chat-tab">💬 Chat</button>
        <button class="history-tab" id="history-tab">📜 Histórico</button>
      </div>
      <button class="history-close" id="history-close">✕</button>
    </div>
    
    <!-- Chat Content -->
    <div class="chat-content" id="chat-content">
      <div class="chat-messages" id="chat-messages">
        <div class="chat-empty">Nenhuma mensagem ainda. Seja o primeiro a conversar!</div>
      </div>
      <div class="chat-input-container" id="chat-input-container">
        <form class="chat-input-form" id="chat-form">
          <input type="text" class="chat-input" id="chat-input" placeholder="Digite sua mensagem..." maxlength="200">
          <button type="submit" class="chat-send-btn" id="chat-send-btn">Enviar</button>
        </form>
      </div>
    </div>
    
    <!-- History Content -->
    <div class="history-content" id="history-content">
      <div class="history-empty">Nenhuma ação registrada ainda.</div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(popup);
  
  // Add event listeners
  document.getElementById('history-close').addEventListener('click', () => {
    tocarSomClick();
    fecharTodasModais();
  });
  
  // Tab switching
  document.getElementById('chat-tab').addEventListener('click', () => {
    tocarSomClick();
    switchToChat();
  });
  
  document.getElementById('history-tab').addEventListener('click', () => {
    tocarSomClick();
    switchToHistory();
  });
  
  // Chat form submission
  document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    sendChatMessage();
  });
  
  // Debug: Check if chat elements are created
  console.log('🔍 Chat elements created:');
  console.log('🔍 Chat content:', document.getElementById('chat-content'));
  console.log('🔍 Chat input container:', document.getElementById('chat-input-container'));
  console.log('🔍 Chat form:', document.getElementById('chat-form'));
  console.log('🔍 Chat input:', document.getElementById('chat-input'));
}

function toggleHistoryPopup() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const popup = document.getElementById('history-popup');
  if (!popup) {
    console.log('❌ History popup not found!');
    return;
  }
  
  console.log('🔄 Toggling history popup, current state:', gameState.historyPopupVisible);
  
  if (!gameState.historyPopupVisible) {
    // Fechar outras modais primeiro
    fecharTodasModais();
    
    // Abrir popup
    gameState.historyPopupVisible = true;
    popup.style.display = 'block';
    
    console.log('✅ Popup opened, current tab:', gameState.currentTab);
    
    // Show current tab content
    if (gameState.currentTab === 'chat') {
      switchToChat();
    } else {
      switchToHistory();
    }
  } else {
    // Fechar popup
    gameState.historyPopupVisible = false;
    popup.style.display = 'none';
    console.log('✅ Popup closed');
  }
}

function switchToChat() {
  const gameState = getGameState();
  if (!gameState) return;
  
  gameState.currentTab = 'chat';
  
  console.log('🔄 Switching to chat...');
  
  // Update tab buttons
  document.getElementById('chat-tab').classList.add('active');
  document.getElementById('history-tab').classList.remove('active');
  
  // Show chat content, hide history content
  const chatContent = document.getElementById('chat-content');
  const historyContent = document.getElementById('history-content');
  
  console.log('🔍 Chat content element:', chatContent);
  console.log('🔍 History content element:', historyContent);
  
  chatContent.style.display = 'flex';
  historyContent.style.display = 'none';
  
  // Ensure input container is visible
  const inputContainer = document.getElementById('chat-input-container');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  
  console.log('🔍 Input container:', inputContainer);
  console.log('🔍 Chat form:', chatForm);
  console.log('🔍 Chat input:', chatInput);
  
  if (inputContainer) {
    inputContainer.style.display = 'block';
    console.log('✅ Input container display set to block');
  }
  
  if (chatForm) {
    chatForm.style.display = 'flex';
    console.log('✅ Chat form display set to flex');
  }
  
  if (chatInput) {
    chatInput.style.display = 'block';
    console.log('✅ Chat input display set to block');
    console.log('🔍 Chat input computed style:', window.getComputedStyle(chatInput));
    console.log('🔍 Chat input offsetTop:', chatInput.offsetTop);
    console.log('🔍 Chat input offsetLeft:', chatInput.offsetLeft);
    console.log('🔍 Chat input offsetWidth:', chatInput.offsetWidth);
    console.log('🔍 Chat input offsetHeight:', chatInput.offsetHeight);
    
    // Debug parent elements
    const inputContainer = chatInput.parentElement;
    const chatForm = inputContainer?.parentElement;
    const chatContent = chatForm?.parentElement;
    
    console.log('🔍 Input container computed style:', inputContainer ? window.getComputedStyle(inputContainer) : 'null');
    console.log('🔍 Chat form computed style:', chatForm ? window.getComputedStyle(chatForm) : 'null');
    console.log('🔍 Chat content computed style:', chatContent ? window.getComputedStyle(chatContent) : 'null');
    
    console.log('🔍 Input container offsetTop:', inputContainer?.offsetTop);
    console.log('🔍 Chat form offsetTop:', chatForm?.offsetTop);
    console.log('🔍 Chat content offsetTop:', chatContent?.offsetTop);
  }
  
  // Reset unread messages when opening chat
  gameState.unreadMessages = 0;
  updateHistoryButtonBadge();
  
  // Update chat display
  updateChatDisplay();
}

function switchToHistory() {
  const gameState = getGameState();
  if (!gameState) return;
  
  gameState.currentTab = 'history';
  
  // Update tab buttons
  document.getElementById('history-tab').classList.add('active');
  document.getElementById('chat-tab').classList.remove('active');
  
  // Show history content, hide chat content
  document.getElementById('history-content').style.display = 'flex';
  document.getElementById('chat-content').style.display = 'none';
  
  // Update history display
  updateHistoryDisplay();
}

function sendChatMessage() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  
  if (message.length === 0) return;
  
  // Send message to server
  emitWithRoom('chatMessage', {
    message: message,
    player: playerUsername || gameState.meuNome
  });
  
  // Clear input
  input.value = '';
}

function addChatMessage(player, message, timestamp = new Date()) {
  const gameState = getGameState();
  if (!gameState) return;
  
  const chatMessage = {
    player: player,
    message: message,
    timestamp: timestamp
  };
  
  gameState.chatMessages.push(chatMessage);
  
  // Keep only the last N messages
  if (gameState.chatMessages.length > gameState.chatMessagesMaxSize) {
    gameState.chatMessages.shift();
  }
  
  // Increment unread messages if from another player and chat not open
  if (player !== (playerUsername || gameState.meuNome) && !gameState.historyPopupVisible) {
    gameState.unreadMessages++;
    updateHistoryButtonBadge();
  }
  
  // Update display if chat is currently visible
  if (gameState.currentTab === 'chat') {
    updateChatDisplay();
  }
}

function updateChatDisplay() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;
  
  if (gameState.chatMessages.length === 0) {
    messagesContainer.innerHTML = '<div class="chat-empty">Nenhuma mensagem ainda. Seja o primeiro a conversar!</div>';
    return;
  }
  
  const messagesHTML = gameState.chatMessages.map(msg => {
    const isOwnMessage = msg.player === (playerUsername || gameState.meuNome);
    const timeStr = msg.timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `
      <div class="chat-message ${isOwnMessage ? 'own-message' : ''}">
        <div class="chat-message-content">
          <div class="chat-message-header">
            <span class="chat-player">${msg.player}</span>
            <span class="chat-time">${timeStr}</span>
          </div>
          <div class="chat-text">${msg.message}</div>
        </div>
      </div>
    `;
  }).join('');
  
  messagesContainer.innerHTML = messagesHTML;
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateHistoryButtonBadge() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const historyButton = document.getElementById('btn-history');
  if (!historyButton) return;
  
  // Remove existing badge
  const existingBadge = historyButton.querySelector('.message-badge');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  // Add badge if there are unread messages
  if (gameState.unreadMessages > 0) {
    const badge = document.createElement('span');
    badge.className = 'message-badge';
    badge.textContent = gameState.unreadMessages > 99 ? '99+' : gameState.unreadMessages.toString();
    historyButton.appendChild(badge);
  }
}

function updateHistoryDisplay() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const content = document.getElementById('history-content');
  if (!content) return;
  
  if (gameState.actionHistory.length === 0) {
    content.innerHTML = '<div class="history-empty">Nenhuma ação registrada ainda.</div>';
    return;
  }
  
  // Create history entries
  const historyHTML = gameState.actionHistory
    .slice()
    .reverse() // Show newest first
    .map(entry => `
      <div class="history-entry">
        <span class="history-timestamp">${entry.timestamp}</span>
        <span class="history-message">${entry.message}</span>
      </div>
    `)
    .join('');
  
  content.innerHTML = historyHTML;
}

// Player Info Panel Functions
function initializePlayerInfoModal() {
  const turnIndicator = document.getElementById('turn-indicator');
  const panel = document.getElementById('player-info-panel');

  if (turnIndicator) {
    turnIndicator.addEventListener('click', () => {
      tocarSomClick();
      togglePlayerInfoPanel();
    });
  }
}

function togglePlayerInfoPanel() {
  const panel = document.getElementById('player-info-panel');
  if (panel) {
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
    } else {
      panel.classList.add('open');
      updatePlayerInfoPanel();
    }
  }
}

function updatePlayerInfoPanel() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const panelBody = document.getElementById('panel-body');
  if (!panelBody || !gameState.jogadores) return;

  const playerCards = gameState.jogadores.map(jogador => {
    // Calcular estatísticas do jogador
    const territorios = gameState.paises.filter(p => p.dono === jogador.nome).length;
    const tropas = gameState.paises.filter(p => p.dono === jogador.nome).reduce((sum, p) => sum + p.tropas, 0);
    const cartas = gameState.cartasTerritorio[jogador.nome] ? gameState.cartasTerritorio[jogador.nome].length : 0;
    const isCurrentTurn = jogador.nome === gameState.turno;
    const isActive = jogador.ativo !== false;

    // Avatar baseado no nome do jogador
    const avatar = getPlayerAvatar(jogador.nome);
    const colorClass = getPlayerColorClass(jogador.nome);

    return `
      <div class="player-card ${isCurrentTurn ? 'current-turn' : ''} ${!isActive ? 'inactive' : ''}">
        <div class="player-header">
          <div class="player-avatar-modal" style="background: ${getPlayerColor(jogador.nome)};">
            ${avatar}
          </div>
          <div class="player-name-modal">${jogador.nome}</div>
          ${isCurrentTurn ? '<div class="turn-badge">TURNO ATUAL</div>' : ''}
        </div>
        <div class="player-stats-modal">
          <div class="stat-item">
            <span class="stat-label">Territórios:</span>
            <span class="stat-value">${territorios}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tropas:</span>
            <span class="stat-value">${tropas}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Cartas:</span>
            <span class="stat-value">${cartas}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Status:</span>
            <span class="stat-value">${isActive ? 'Ativo' : 'Inativo'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  panelBody.innerHTML = `
    <div class="player-grid">
      ${playerCards}
    </div>
  `;
}

function getPlayerAvatar(playerName) {
  // Gerar avatar baseado no nome do jogador
  const avatars = ['👤', '🎮', '⚔️', '🛡️', '👑', '🎯', '🏆', '⚡'];
  const index = playerName.length % avatars.length;
  return avatars[index];
}

function getPlayerColor(playerName) {
  const colorMap = {
    'Vermelho': '#ff4444',
    'Azul': '#4444ff', 
    'Verde': '#44ff44',
    'Amarelo': '#ffff44',
    'Preto': '#444444',
    'Roxo': '#ff44ff'
  };
  
  // Se o nome do jogador contém uma cor, usar essa cor
  for (const [colorName, colorValue] of Object.entries(colorMap)) {
    if (playerName.includes(colorName)) {
      return colorValue;
    }
  }
  
  // Caso contrário, gerar cor baseada no nome
  const colors = Object.values(colorMap);
  const index = playerName.length % colors.length;
  return colors[index];
}

// Função para tornar uma interface arrastável
function tornarInterfaceArrastavel(container, scene) {
  if (!container || !scene) return;
  
  // Adicionar interatividade ao container
  container.setInteractive(new Phaser.Geom.Rectangle(-175, -100, 350, 200), Phaser.Geom.Rectangle.Contains);
  
  // Variáveis para controlar o drag
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  
  // Evento de início do drag
  container.on('pointerdown', (pointer) => {
    isDragging = true;
    
    // Calcular offset do clique em relação ao centro da interface
    dragOffsetX = pointer.x - container.x;
    dragOffsetY = pointer.y - container.y;
    
    // Mudar cursor para indicar que está arrastando
    scene.input.setDefaultCursor('grabbing');
  });
  
  // Evento de movimento do mouse durante o drag
  container.on('pointermove', (pointer) => {
    if (isDragging) {
      // Posicionar a interface diretamente na posição do mouse menos o offset
      container.x = pointer.x - dragOffsetX;
      container.y = pointer.y - dragOffsetY;
    }
  });
  
  // Evento de fim do drag
  container.on('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      // Restaurar cursor padrão
      scene.input.setDefaultCursor('default');
    }
  });
  
  // Evento quando o mouse sai da interface - NÃO parar o drag
  container.on('pointerout', () => {
    // Não fazer nada - manter o drag ativo
  });
  
  // Adicionar listener global para capturar pointerup mesmo fora da interface
  const globalPointerUp = () => {
    if (isDragging) {
      isDragging = false;
      scene.input.setDefaultCursor('default');
    }
  };
  
  scene.input.on('pointerup', globalPointerUp);
  
  // Limpar o listener global quando a interface for destruída
  container.on('destroy', () => {
    scene.input.off('pointerup', globalPointerUp);
  });
}

// Função para criar animação de salto nos países
function criarAnimacaoSalto(polygon, scene) {
  console.log('🎯 Criando animação de salto para país:', polygon.name || 'desconhecido');
  
  // Verificar se já existe uma animação ativa
  if (polygon.timelineSalto) {
    console.log('⚠️ Animação já existe, parando antes de criar nova');
    pararAnimacaoSalto(polygon, scene);
  }
  
  // Salvar a posição original no próprio objeto polygon
  polygon.posicaoOriginal = { x: polygon.x, y: polygon.y };
  console.log('💾 Posição original salva:', polygon.posicaoOriginal);
  
  // Encontrar o círculo e texto das tropas associados a este polígono
  const gameState = getGameState();
  let troopCircle = null;
  let troopText = null;
  
  if (gameState) {
    const pais = gameState.paises.find(p => p.polygon === polygon);
    if (pais) {
      troopCircle = pais.troopCircle;
      troopText = pais.troopText;
      
      // Salvar posições originais dos elementos das tropas
      if (troopCircle) {
        troopCircle.posicaoOriginal = { x: troopCircle.x, y: troopCircle.y };
      }
      if (troopText) {
        troopText.posicaoOriginal = { x: troopText.x, y: troopText.y };
      }
    }
  }
  
  // Criar array de alvos para animar (polígono + círculo + texto)
  const targets = [polygon];
  if (troopCircle) targets.push(troopCircle);
  if (troopText) targets.push(troopText);
  
  // Criar animação de salto usando scene.tweens.add
  const tween = scene.tweens.add({
    targets: targets,
    y: polygon.posicaoOriginal.y - 10, // Subir 10 pixels
    duration: 300,
    ease: 'Power2',
    yoyo: true, // Volta à posição original
    repeat: -1, // Repetir infinitamente
    repeatDelay: 1700, // Delay entre repetições (2000ms total - 300ms animação)
    onComplete: function() {
      // Garantir que todos voltem à posição original
      polygon.setPosition(polygon.x, polygon.posicaoOriginal.y);
      if (troopCircle && troopCircle.posicaoOriginal) {
        troopCircle.setPosition(troopCircle.x, troopCircle.posicaoOriginal.y);
      }
      if (troopText && troopText.posicaoOriginal) {
        troopText.setPosition(troopText.x, troopText.posicaoOriginal.y);
      }
    }
  });
  
  console.log('✅ Animação de salto criada com sucesso (incluindo tropas)');
  return tween;
}

// Função para parar animação de salto
function pararAnimacaoSalto(polygon, scene) {
  if (polygon.timelineSalto) {
    console.log('🛑 Parando animação de salto para país:', polygon.name || 'desconhecido');
    
    polygon.timelineSalto.stop();
    polygon.timelineSalto.remove();
    polygon.timelineSalto = null;
    
    // Restaurar posição original do polígono usando os valores salvos
    if (polygon.posicaoOriginal) {
      console.log('🔄 Restaurando posição original do polígono:', polygon.posicaoOriginal);
      polygon.setPosition(polygon.posicaoOriginal.x, polygon.posicaoOriginal.y);
      // Limpar a referência da posição original
      delete polygon.posicaoOriginal;
    } else {
      console.log('⚠️ Posição original do polígono não encontrada, usando coordenadas do servidor');
      // Fallback: usar as coordenadas do servidor
      const gameState = getGameState();
      if (gameState) {
        const pais = gameState.paises.find(p => p.polygon === polygon);
        if (pais) {
          polygon.setPosition(pais.x, pais.y);
        }
      }
    }
    
    // Restaurar posições dos elementos das tropas
    const gameState = getGameState();
    if (gameState) {
      const pais = gameState.paises.find(p => p.polygon === polygon);
      if (pais) {
        // Restaurar círculo das tropas
        if (pais.troopCircle && pais.troopCircle.posicaoOriginal) {
          console.log('🔄 Restaurando posição do círculo das tropas');
          pais.troopCircle.setPosition(pais.troopCircle.posicaoOriginal.x, pais.troopCircle.posicaoOriginal.y);
          delete pais.troopCircle.posicaoOriginal;
        }
        
        // Restaurar texto das tropas
        if (pais.troopText && pais.troopText.posicaoOriginal) {
          console.log('🔄 Restaurando posição do texto das tropas');
          pais.troopText.setPosition(pais.troopText.posicaoOriginal.x, pais.troopText.posicaoOriginal.y);
          delete pais.troopText.posicaoOriginal;
        }
      }
    }
    
    console.log('✅ Animação de salto parada com sucesso (incluindo tropas)');
  }
}

// Função para limpar todas as animações de salto
function limparTodasAnimacoesSalto() {
  console.log('🧹 Limpando todas as animações de salto');
  
  const gameState = getGameState();
  if (!gameState) return;
  
  let animacoesParadas = 0;
  gameState.paises.forEach(p => {
    if (p.polygon.timelineSalto) {
      const scene = p.polygon.scene;
      if (scene) {
        pararAnimacaoSalto(p.polygon, scene);
        animacoesParadas++;
      }
    }
  });
  
  console.log(`✅ ${animacoesParadas} animações de salto paradas`);
  
  // Também limpar todas as elevações
  limparTodasElevacoes();
  
  // Verificar se ainda há tropas bônus antes de restaurar animações
  const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  const totalReforco = gameState.tropasReforco || 0;
  const tropasRestantes = totalReforco + totalBonus;
  
  console.log(`🎯 Tropas restantes após limpeza: ${tropasRestantes} (${totalReforco} reforço + ${totalBonus} bônus)`);
  
  // Só restaurar animações se ainda há tropas para colocar
  if (tropasRestantes > 0) {
    console.log('🎯 Restaurando animações pois ainda há tropas para colocar');
    restaurarAnimacoesTerritoriosBonus();
  } else {
    console.log('🎯 Não restaurando animações - não há mais tropas para colocar');
  }
}

// Função para restaurar animações de salto nos territórios bônus
function restaurarAnimacoesTerritoriosBonus() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  const totalReforco = gameState.tropasReforco || 0;
  const tropasRestantes = totalReforco + totalBonus;
  
  console.log(`🎯 restaurarAnimacoesTerritoriosBonus - tropas restantes: ${tropasRestantes} (${totalReforco} reforço + ${totalBonus} bônus)`);
  
  // Só restaurar se há tropas para colocar e é o turno do jogador
  if (tropasRestantes > 0 && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
    console.log('🎯 Restaurando animações de salto para territórios bônus');
    
    gameState.paises.forEach(pais => {
      if (pais.dono === gameState.turno && pais.polygon && pais.polygon.scene) {
        const continente = gameState.continentes[gameState.continentePrioritario.nome];
        if (continente && continente.territorios.includes(pais.nome)) {
          // Aplicar borda branca grossa
          pais.polygon.setStrokeStyle(6, 0xffffff, 1);
          
          // Aplicar animação de salto se não estiver já animando
          if (!pais.polygon.timelineSalto) {
            console.log(`🎯 Restaurando animação de salto em ${pais.nome}`);
            pais.polygon.timelineSalto = criarAnimacaoSalto(pais.polygon, pais.polygon.scene);
          }
          
          // Garantir que o território tenha elevação se necessário
          // Verificar se o território tem borda branca grossa mas não tem elevação
          const strokeStyle = pais.polygon.strokeStyle;
          if (strokeStyle && strokeStyle.color === 0xffffff && strokeStyle.width === 6) {
            // Verificar se não tem elevação aplicada usando a propriedade elevado
            if (!pais.elevado) {
              console.log(`🎯 Aplicando elevação em ${pais.nome} (território bônus)`);
              criarElevacaoTerritorio(pais.nome, pais.polygon.scene);
            }
          }
        }
      }
    });
  } else {
    console.log('🎯 Não restaurando animações - condições não atendidas');
    console.log(`🎯 tropasRestantes: ${tropasRestantes}, meuNome: ${gameState.meuNome}, turno: ${gameState.turno}, continentePrioritario: ${gameState.continentePrioritario ? 'sim' : 'não'}`);
  }
}

// Função para criar efeito de onda quando conquista um continente
function criarEfeitoOndaContinente(nomeContinente, scene) {
  console.log('🌊 Criando efeito de ola (football wave) para conquista do continente:', nomeContinente);
  
  const gameState = getGameState();
  if (!gameState || !gameState.continentes[nomeContinente]) {
    console.log('❌ Continente não encontrado para efeito de ola');
    return;
  }
  
  const continente = gameState.continentes[nomeContinente];
  const territoriosDoContinente = continente.territorios;
  
  // Encontrar todos os países do continente
  const paisesDoContinente = gameState.paises.filter(p => 
    territoriosDoContinente.includes(p.nome)
  );
  
  if (paisesDoContinente.length === 0) {
    console.log('❌ Nenhum país encontrado para o continente');
    return;
  }
  
  console.log('📍 Territórios do continente para ola:', paisesDoContinente.map(p => p.nome));
  
  // Criar efeito de "ola" sequencial (football wave)
  paisesDoContinente.forEach((pais, index) => {
    if (pais.polygon) {
      // Delay para criar o efeito sequencial
      setTimeout(() => {
        console.log(`🏈 Fazendo território ${pais.nome} pular (${index + 1}/${paisesDoContinente.length})`);
        
        // Salvar posição original se ainda não foi salva
        if (!pais.polygon.posicaoOriginal) {
          pais.polygon.posicaoOriginal = {
            y: pais.polygon.y
          };
        }
        
        // Salvar posições originais dos elementos relacionados
        if (pais.troopCircle && !pais.troopCircle.posicaoOriginal) {
          pais.troopCircle.posicaoOriginal = {
            y: pais.troopCircle.y
          };
        }
        
        if (pais.troopText && !pais.troopText.posicaoOriginal) {
          pais.troopText.posicaoOriginal = {
            y: pais.troopText.y
          };
        }
        
        // Criar animação de salto para o território
        const tweenTerritorio = scene.tweens.add({
          targets: pais.polygon,
          y: pais.polygon.y - 15,
          duration: 300,
          ease: 'Power2',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            // Restaurar posição original
            if (pais.polygon.posicaoOriginal) {
              pais.polygon.y = pais.polygon.posicaoOriginal.y;
            }
          }
        });
        
        // Criar animação de salto para o círculo de tropas
        if (pais.troopCircle) {
          scene.tweens.add({
            targets: pais.troopCircle,
            y: pais.troopCircle.y - 15,
            duration: 300,
            ease: 'Power2',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              // Restaurar posição original
              if (pais.troopCircle.posicaoOriginal) {
                pais.troopCircle.y = pais.troopCircle.posicaoOriginal.y;
              }
            }
          });
        }
        
        // Criar animação de salto para o texto de tropas
        if (pais.troopText) {
          scene.tweens.add({
            targets: pais.troopText,
            y: pais.troopText.y - 15,
            duration: 300,
            ease: 'Power2',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              // Restaurar posição original
              if (pais.troopText.posicaoOriginal) {
                pais.troopText.y = pais.troopText.posicaoOriginal.y;
              }
            }
          });
        }
        
      }, index * 200); // 200ms de delay entre cada território
    }
  });
  
  // Calcular centro do continente para partículas douradas
  const centroX = paisesDoContinente.reduce((sum, p) => sum + p.x, 0) / paisesDoContinente.length;
  const centroY = paisesDoContinente.reduce((sum, p) => sum + p.y, 0) / paisesDoContinente.length;
  
  // Criar partículas douradas no final da sequência
  setTimeout(() => {
    criarPartículasDouradas(centroX, centroY, scene);
  }, paisesDoContinente.length * 200 + 500);
  
  console.log('✅ Efeito de ola (football wave) criado com sucesso');
}

// Função para criar partículas douradas
function criarPartículasDouradas(x, y, scene) {
  console.log('✨ Criando partículas douradas em:', { x, y });
  
  // Criar múltiplas partículas douradas
  for (let i = 0; i < 12; i++) {
    const particula = scene.add.circle(x, y, 3, 0xffd700, 0.8);
    particula.setDepth(16);
    
    // Direção aleatória
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 100 + Math.random() * 50;
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;
    
    // Animação da partícula
    scene.tweens.add({
      targets: particula,
      x: targetX,
      y: targetY,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 1000 + Math.random() * 500,
      ease: 'Power2',
      onComplete: function() {
        particula.destroy();
      }
    });
  }
  
  console.log('✨ Partículas douradas criadas');
}

// Função para verificar se uma conquista completa um continente
function verificarConquistaContinente(territorioConquistado, jogadorAtacante, scene) {
  console.log('🔍 Verificando se a conquista de', territorioConquistado, 'completa algum continente para', jogadorAtacante);
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar cada continente
  Object.keys(gameState.continentes).forEach(nomeContinente => {
    const continente = gameState.continentes[nomeContinente];
    const territoriosDoContinente = continente.territorios;
    
    // Verificar se o território conquistado pertence a este continente
    if (territoriosDoContinente.includes(territorioConquistado)) {
      console.log('📍 Território', territorioConquistado, 'pertence ao continente', nomeContinente);
      
      // Verificar se o jogador agora controla todos os territórios do continente
      const territoriosConquistados = territoriosDoContinente.filter(territorio => {
        const pais = gameState.paises.find(p => p.nome === territorio);
        return pais && pais.dono === jogadorAtacante;
      });
      
      console.log('🎯 Territórios do continente', nomeContinente, ':', territoriosDoContinente);
      console.log('🎯 Territórios conquistados por', jogadorAtacante, ':', territoriosConquistados);
      
      // Se todos os territórios do continente estão conquistados
      if (territoriosConquistados.length === territoriosDoContinente.length) {
        console.log('🎉 CONTINENTE CONQUISTADO!', nomeContinente, 'por', jogadorAtacante);
        
        // Disparar efeito de onda imediatamente
        setTimeout(() => {
          criarEfeitoOndaContinente(nomeContinente, scene);
        }, 100); // Pequeno delay para garantir que o estado foi atualizado
      } else {
        console.log('⚠️ Continente', nomeContinente, 'ainda não foi completamente conquistado');
      }
    }
  });
}

// Função para mostrar efeito de explosão quando tropas são perdidas
function mostrarEfeitoExplosaoTropas(territorio, scene) {
  console.log('💥 Criando efeito de explosão para tropas perdidas em:', territorio);
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    console.log('⏳ Scene não pronta para mostrar efeito de explosão');
    return;
  }
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais || !pais.troopCircle) {
    console.log('❌ Território ou círculo de tropas não encontrado para efeito de explosão');
    return;
  }
  
  // Posição do círculo das tropas
  const x = pais.troopCircle.x;
  const y = pais.troopCircle.y;
  
  console.log('📍 Posição da explosão:', { x, y });
  
  // Criar partículas de explosão
  const numPartículas = 12;
  const partículas = [];
  
  for (let i = 0; i < numPartículas; i++) {
    // Calcular ângulo para distribuir partículas em círculo
    const ângulo = (i / numPartículas) * Math.PI * 2;
    const velocidade = 3 + Math.random() * 4; // Velocidade aleatória
    
    // Criar partícula
    const partícula = scene.add.circle(x, y, 3 + Math.random() * 3, 0xff6600);
    partícula.setDepth(30);
    partículas.push(partícula);
    
    // Calcular direção da partícula
    const deltaX = Math.cos(ângulo) * velocidade;
    const deltaY = Math.sin(ângulo) * velocidade;
    
    // Animar partícula
    scene.tweens.add({
      targets: partícula,
      x: x + deltaX * 20, // Distância final
      y: y + deltaY * 20,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 600 + Math.random() * 400, // Duração aleatória
      ease: 'Power2',
      onComplete: () => {
        partícula.destroy();
      }
    });
  }
  
  // Criar explosão central
  const explosaoCentral = scene.add.circle(x, y, 8, 0xffaa00);
  explosaoCentral.setDepth(31);
  
  // Brilho da explosão
  const brilhoExplosao = scene.add.circle(x, y, 15, 0xffff00);
  brilhoExplosao.setDepth(30);
  brilhoExplosao.setAlpha(0.8);
  
  // Animar explosão central
  scene.tweens.add({
    targets: explosaoCentral,
    scaleX: 2.5,
    scaleY: 2.5,
    alpha: 0,
    duration: 400,
    ease: 'Power2',
    onComplete: () => {
      explosaoCentral.destroy();
    }
  });
  
  // Animar brilho
  scene.tweens.add({
    targets: brilhoExplosao,
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
    duration: 300,
    ease: 'Power2',
    onComplete: () => {
      brilhoExplosao.destroy();
    }
  });
  
  // Criar ondas de choque
  const onda1 = scene.add.circle(x, y, 5, 0xff4400);
  const onda2 = scene.add.circle(x, y, 8, 0xff2200);
  onda1.setDepth(29);
  onda2.setDepth(28);
  
  // Animar ondas
  scene.tweens.add({
    targets: [onda1, onda2],
    scaleX: 3,
    scaleY: 3,
    alpha: 0,
    duration: 500,
    ease: 'Power2',
    onComplete: () => {
      onda1.destroy();
      onda2.destroy();
    }
  });
  

  
  console.log('✅ Efeito de explosão criado com sucesso');
}

// Função para mostrar efeito de explosão quando um território é conquistado
function mostrarEfeitoExplosaoConquista(territorio, jogador, scene) {
  console.log('👑 Criando efeito de explosão de conquista para:', territorio, 'por', jogador);
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    console.log('⏳ Scene não pronta para mostrar efeito de explosão de conquista');
    return;
  }
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais || !pais.troopCircle) {
    console.log('❌ Território ou círculo de tropas não encontrado para efeito de explosão de conquista');
    return;
  }
  
  // Posição do círculo das tropas
  const x = pais.troopCircle.x;
  const y = pais.troopCircle.y;
  
  console.log('📍 Posição da explosão de conquista:', { x, y });
  
  // Criar partículas douradas de conquista
  const numPartículas = 16;
  const partículas = [];
  
  for (let i = 0; i < numPartículas; i++) {
    // Calcular ângulo para distribuir partículas em círculo
    const ângulo = (i / numPartículas) * Math.PI * 2;
    const velocidade = 4 + Math.random() * 5; // Velocidade aleatória
    
    // Criar partícula dourada
    const partícula = scene.add.circle(x, y, 4 + Math.random() * 4, 0xffd700);
    partícula.setDepth(35);
    partículas.push(partícula);
    
    // Calcular direção da partícula
    const deltaX = Math.cos(ângulo) * velocidade;
    const deltaY = Math.sin(ângulo) * velocidade;
    
    // Animar partícula
    scene.tweens.add({
      targets: partícula,
      x: x + deltaX * 25, // Distância final maior
      y: y + deltaY * 25,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 800 + Math.random() * 600, // Duração aleatória maior
      ease: 'Power2',
      onComplete: () => {
        partícula.destroy();
      }
    });
  }
  
  // Criar explosão central dourada
  const explosaoCentral = scene.add.circle(x, y, 12, 0xffd700);
  explosaoCentral.setDepth(36);
  
  // Brilho da explosão dourada
  const brilhoExplosao = scene.add.circle(x, y, 20, 0xffff00);
  brilhoExplosao.setDepth(35);
  brilhoExplosao.setAlpha(0.9);
  
  // Animar explosão central
  scene.tweens.add({
    targets: explosaoCentral,
    scaleX: 3,
    scaleY: 3,
    alpha: 0,
    duration: 600,
    ease: 'Power2',
    onComplete: () => {
      explosaoCentral.destroy();
    }
  });
  
  // Animar brilho
  scene.tweens.add({
    targets: brilhoExplosao,
    scaleX: 2.5,
    scaleY: 2.5,
    alpha: 0,
    duration: 500,
    ease: 'Power2',
    onComplete: () => {
      brilhoExplosao.destroy();
    }
  });
  
  // Criar ondas de choque douradas
  const onda1 = scene.add.circle(x, y, 8, 0xffd700);
  const onda2 = scene.add.circle(x, y, 12, 0xffed4e);
  onda1.setDepth(34);
  onda2.setDepth(33);
  
  // Animar ondas
  scene.tweens.add({
    targets: [onda1, onda2],
    scaleX: 4,
    scaleY: 4,
    alpha: 0,
    duration: 700,
    ease: 'Power2',
    onComplete: () => {
      onda1.destroy();
      onda2.destroy();
    }
  });
  
  // Criar coroa que sobe (similar ao efeito de reforço)
  setTimeout(() => {
    const coroa = scene.add.text(x, y, '👑', {
      fontSize: '20px',
      color: '#FFD700'
    });
    coroa.setDepth(40);
    coroa.setOrigin(0.5);
    
    // Animar coroa subindo
    scene.tweens.add({
      targets: coroa,
      y: y - 60,
      alpha: 0,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        coroa.destroy();
      }
    });
  }, 200);
  
  console.log('✅ Efeito de explosão de conquista criado com sucesso');
}



// Função para elevar território selecionado (similar ao salto mas permanente)
function criarElevacaoTerritorio(territorio, scene) {
  console.log('⬆️ Criando elevação para território selecionado:', territorio);
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    console.log('⏳ Scene não pronta para mostrar elevação');
    return;
  }
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais) {
    console.log('❌ Território não encontrado para elevação');
    return;
  }
  
  // Elementos que vão ser elevados: polygon (elevação principal) e outros elementos (elevação reduzida)
  const elementos = [];
  const elementosReduzidos = [];
  
  if (pais.polygon) {
    elementos.push(pais.polygon);
  }
  
  if (pais.troopCircle) {
    elementosReduzidos.push(pais.troopCircle);
  }
  
  if (pais.troopText) {
    elementosReduzidos.push(pais.troopText);
  }
  
  if (pais.nomeText) {
    elementosReduzidos.push(pais.nomeText);
  }
  
  if (elementos.length === 0 && elementosReduzidos.length === 0) {
    console.log('❌ Nenhum elemento encontrado para elevação');
    return;
  }
  
  // Salvar posições originais se ainda não foram salvas
  elementos.forEach(elemento => {
    if (!elemento.posicaoOriginalElevacao) {
      elemento.posicaoOriginalElevacao = {
        y: elemento.y
      };
    }
  });
  
  elementosReduzidos.forEach(elemento => {
    if (!elemento.posicaoOriginalElevacao) {
      elemento.posicaoOriginalElevacao = {
        y: elemento.y
      };
    }
  });
  
  console.log('📍 Aplicando elevação em', elementos.length, 'elementos principais e', elementosReduzidos.length, 'elementos reduzidos');
  
  // Criar elevação suave e permanente para elementos principais (polygon)
  if (elementos.length > 0) {
    const elevacaoTween = scene.tweens.add({
      targets: elementos,
      y: '-=8', // Elevar 8 pixels
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        console.log('✅ Elevação principal concluída para território:', territorio);
      }
    });
  }
  
  // Criar elevação reduzida para outros elementos (troopCircle, troopText, nomeText)
  if (elementosReduzidos.length > 0) {
    const elevacaoReduzidaTween = scene.tweens.add({
      targets: elementosReduzidos,
      y: '-=5', // Elevar apenas 3 pixels (intensidade bem menor)
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        console.log('✅ Elevação reduzida concluída para território:', territorio);
      }
    });
  }
  
  // Marcar que o território está elevado
  pais.elevado = true;
}

// Função para baixar território (remover elevação)
function removerElevacaoTerritorio(territorio, scene) {
  console.log('⬇️ Removendo elevação do território:', territorio);
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais) {
    console.log('❌ Território não encontrado para remover elevação');
    return;
  }
  
  // Elementos que vão ser baixados: polygon (elevação principal) e outros elementos (elevação reduzida)
  const elementos = [];
  const elementosReduzidos = [];
  
  if (pais.polygon) {
    elementos.push(pais.polygon);
  }
  
  if (pais.troopCircle) {
    elementosReduzidos.push(pais.troopCircle);
  }
  
  if (pais.troopText) {
    elementosReduzidos.push(pais.troopText);
  }
  
  if (pais.nomeText) {
    elementosReduzidos.push(pais.nomeText);
  }
  
  if (elementos.length === 0 && elementosReduzidos.length === 0) {
    console.log('❌ Nenhum elemento encontrado para remover elevação');
    return;
  }
  
  console.log('📍 Removendo elevação de', elementos.length, 'elementos principais e', elementosReduzidos.length, 'elementos reduzidos');
  
  // Baixar elementos principais de volta à posição original
  if (elementos.length > 0) {
    const baixarTween = scene.tweens.add({
      targets: elementos,
      y: elementos[0].posicaoOriginalElevacao ? elementos[0].posicaoOriginalElevacao.y : elementos[0].y,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        // Restaurar posições originais
        elementos.forEach(elemento => {
          if (elemento.posicaoOriginalElevacao) {
            elemento.y = elemento.posicaoOriginalElevacao.y;
          }
        });
        console.log('✅ Elevação principal removida do território:', territorio);
      }
    });
  }
  
  // Baixar elementos reduzidos de volta à posição original
  if (elementosReduzidos.length > 0) {
    const baixarReduzidoTween = scene.tweens.add({
      targets: elementosReduzidos,
      y: elementosReduzidos[0].posicaoOriginalElevacao ? elementosReduzidos[0].posicaoOriginalElevacao.y : elementosReduzidos[0].y,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        // Restaurar posições originais
        elementosReduzidos.forEach(elemento => {
          if (elemento.posicaoOriginalElevacao) {
            elemento.y = elemento.posicaoOriginalElevacao.y;
          }
        });
        console.log('✅ Elevação reduzida removida do território:', territorio);
      }
    });
  }
  
  // Marcar que o território não está mais elevado
  pais.elevado = false;
}

// Função para limpar todas as elevações
function limparTodasElevacoes() {
  console.log('🧹 Limpando todas as elevações');
  
  const gameState = getGameState();
  if (!gameState) return;
  
  gameState.paises.forEach(pais => {
    if (pais.elevado && pais.polygon && pais.polygon.scene) {
      removerElevacaoTerritorio(pais.nome, pais.polygon.scene);
    }
  });
}

function mostrarIndicacaoInicioTurno(nomeJogador, scene) {
  console.log('🎯 Mostrando indicação de início de turno para:', nomeJogador);
  
  // Verificar se a scene é válida
  if (!scene || !scene.add) {
    console.error('❌ Scene inválida em mostrarIndicacaoInicioTurno:', scene);
    return;
  }
  
  // Obter dimensões reais do canvas
  const canvas = scene.sys.game.canvas;
  const largura = canvas.width;
  const altura = canvas.height;
  
  // Detectar se é dispositivo móvel
  const isMobile = isMobileDevice();
  const isSmallMobile = isSmallMobileDevice();
  const isLandscape = isMobileLandscape();
  
  // Calcular tamanhos responsivos
  const containerWidth = isSmallMobile ? getResponsiveSize(300) : isMobile ? getResponsiveSize(350) : getResponsiveSize(400);
  const containerHeight = isSmallMobile ? getResponsiveSize(80) : isMobile ? getResponsiveSize(100) : getResponsiveSize(120);
  const headerHeight = isSmallMobile ? getResponsiveSize(30) : isMobile ? getResponsiveSize(35) : getResponsiveSize(40);
  
  // Container principal - estilo similar ao chat
  const container = scene.add.container(largura/2, altura/2);
  container.setDepth(31);
  
  // Background do container - estilo preto como o chat
  const background = scene.add.rectangle(0, 0, containerWidth, containerHeight, 0x000000, 0.95);
  background.setStrokeStyle(2, 0x444444);
  background.setDepth(0);
  container.add(background);
  
  // Header com estilo similar ao chat
  const headerBg = scene.add.rectangle(0, -(containerHeight/2 - headerHeight/2), containerWidth, headerHeight, 0x000000, 0.95);
  headerBg.setStrokeStyle(1, 0x444444);
  headerBg.setDepth(1);
  container.add(headerBg);
  
  // Calcular posições responsivas
  const iconX = -(containerWidth/2 - getResponsiveSize(30));
  const titleX = -(containerWidth/2 - getResponsiveSize(60));
  const closeX = containerWidth/2 - getResponsiveSize(30);
  const headerY = -(containerHeight/2 - headerHeight/2);
  
  // Ícone de turno
  const turnoIcon = scene.add.text(iconX, headerY, '🎯', {
    fontSize: getResponsiveFontSize(isSmallMobile ? 16 : isMobile ? 18 : 20),
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  container.add(turnoIcon);
  
  // Título
  const titulo = scene.add.text(titleX, headerY, 'SEU TURNO!', {
    fontSize: getResponsiveFontSize(isSmallMobile ? 14 : isMobile ? 16 : 18),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0, 0.5).setDepth(2);
  container.add(titulo);
  
  // Linha decorativa
  const linhaDecorativa = scene.add.rectangle(0, -(containerHeight/2 - headerHeight - 5), containerWidth - 20, 1, 0x444444, 0.8);
  linhaDecorativa.setDepth(1);
  container.add(linhaDecorativa);
  
  // Mensagem principal
  const mensagem = scene.add.text(0, 5, `É a vez de ${nomeJogador} jogar!`, {
    fontSize: getResponsiveFontSize(isSmallMobile ? 12 : isMobile ? 14 : 16),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setDepth(2);
  container.add(mensagem);
  
  // Botão de fechar
  const botaoFechar = scene.add.text(closeX, headerY, '✕', {
    fontSize: getResponsiveFontSize(isSmallMobile ? 14 : isMobile ? 16 : 18),
    fill: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
  
  botaoFechar.on('pointerdown', () => {
    tocarSomClick();
    fecharIndicacaoInicioTurno();
  });
  
  container.add(botaoFechar);
  
  // Destacar territórios do jogador
  const gameState = getGameState();
  if (gameState && gameState.paises) {
    gameState.paises.forEach(pais => {
      if (pais.dono === nomeJogador && pais.polygon) {
        // Aplicar borda branca e elevação
        pais.polygon.setStrokeStyle(6, 0xffffff, 1);
        criarElevacaoTerritorio(pais.nome, scene);
      }
    });
  }
  
  // Auto-fechar após 5 segundos
  setTimeout(() => {
    fecharIndicacaoInicioTurno();
  }, 5000);
  
  // Tocar som de notificação
  tocarSomHuh();
  
  // Armazenar referência para poder fechar depois
  window.indicacaoInicioTurno = {
    container: container,
    scene: scene
  };
}

function fecharIndicacaoInicioTurno() {
  if (window.indicacaoInicioTurno) {
    // Remover interface
    if (window.indicacaoInicioTurno.container) {
      window.indicacaoInicioTurno.container.destroy();
    }
    
    // Remover destaque dos territórios
    const gameState = getGameState();
    if (gameState && gameState.paises) {
      gameState.paises.forEach(pais => {
        if (pais.polygon && pais.polygon.scene) {
          // Verificar se o território pertence ao continente prioritário
          let pertenceAoContinentePrioritario = false;
          const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
          
          if (totalBonus > 0 && pais.dono === gameState.turno && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
            const continente = gameState.continentes[gameState.continentePrioritario.nome];
            if (continente && continente.territorios.includes(pais.nome)) {
              pertenceAoContinentePrioritario = true;
            }
          }
          
          if (pertenceAoContinentePrioritario) {
            // Manter borda branca grossa para continente prioritário
            pais.polygon.setStrokeStyle(6, 0xffffff, 1);
            
            // Aplicar animação de salto se não estiver já animando
            if (!pais.polygon.timelineSalto) {
              console.log(`🎯 Restaurando animação de salto em ${pais.nome} após fechar indicação de turno`);
              pais.polygon.timelineSalto = criarAnimacaoSalto(pais.polygon, pais.polygon.scene);
            }
          } else {
            // Restaurar borda normal para territórios não prioritários
            pais.polygon.setStrokeStyle(4, 0x000000, 1);
          }
          
          // Remover elevação
          removerElevacaoTerritorio(pais.nome, pais.polygon.scene);
        }
      });
    }
    
    window.indicacaoInicioTurno = null;
    
    // Restaurar animações de salto para territórios bônus após fechar indicação
    restaurarAnimacoesTerritoriosBonus();
  }
}

// Função para fechar indicação de início de turno automaticamente em qualquer interação
function fecharIndicacaoInicioTurnoAutomatico() {
  if (window.indicacaoInicioTurno && window.indicacaoInicioTurno.container) {
    console.log('🚫 Fechando indicação de início de turno automaticamente devido a interação');
    fecharIndicacaoInicioTurno();
  }
}
