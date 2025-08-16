// Login System
let playerLoggedIn = false;
let playerUsername = '';
let playerCountry = 'US'; // Default country
let currentLanguage = 'en'; // Default language (English)
// Mapeamento de nomes de cores para nomes de usuário reais
let playerColorToUsernameMap = {};

// Server Configuration is now handled in config.js

// Internationalization System (i18n)
const gameTranslations = {
  en: { // English (US)
    // Login Screen
    loginTitle: 'Enter your name to start',
    usernameLabel: 'Player Name',
    usernamePlaceholder: 'Type your name...',
    countryLabel: 'Select your country:',
    continueButton: 'CONTINUE',
    loginFooter: 'Connect and dominate the world!',
    discordJoin: 'Join our Discord server!',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: 'Select Mode',
    modeSelectionSubtitle: 'Choose how you want to play',
    skirmishMode: 'Skirmish',
    skirmishDescription: 'Quick game with random players from global lobby',
    dominiumMode: 'Dominium',
    dominiumDescription: 'Strategic mode with campaigns and progression',
    backToLogin: '← Back to Login',
    
    // Skirmish Mode
    skirmishTitle: 'Skirmish Mode',
    skirmishSubtitle: 'Fast and intense game with players from around the world',
    startMatch: 'Start Match',
    startMatchDescription: 'Join global lobby and wait for other players',
    rankingGeneral: 'General Ranking',
    rankingDescription: 'See the best players and their statistics',
    myStats: 'My Statistics',
    statsDescription: 'View your game history and achievements',
    tutorial: 'Tutorial',
    tutorialDescription: 'Learn the rules and strategies of the game',
    backToModes: '← Back to Modes',
    
    // Tutorial Screen
    tutorialTitle: '📚 Game Tutorial',
    tutorialSubtitle: 'Learn the basic rules and strategies to dominate the world!',
    
    // Tutorial Section 1: Game Objective
    tutorialSection1Title: '🎯 Game Objective',
    tutorialSection1Content: '<strong>Conquer territories and dominate continents to win!</strong>',
    tutorialSection1List1: '🎯 <strong>Main Objective:</strong> Complete your objectives to win the game. This can be dominating continents, eliminating players...',
    tutorialSection1List2: '🗺️ <strong>Map:</strong> World divided into territories and continents',
    tutorialSection1List3: '⚔️ <strong>Combat:</strong> Use your troops to attack enemy territories',
    tutorialSection1List4: '🏆 <strong>Victory:</strong> Be the last survivor or complete your secret objective',
    
    // Tutorial Section 2: Turn Phases
    tutorialSection2Title: '🔄 Turn Phases',
    tutorialSection2Content: '<strong>Each turn has 3 main phases:</strong>',
    tutorialSection2List1: '<strong>🎯 Troop Placement:</strong> Receive base troops + continent bonuses',
    tutorialSection2List2: '<strong>⚔️ Attacks:</strong> Conquer enemy territories',
    tutorialSection2List3: '<strong>🚚 Redeployment:</strong> Move troops between your territories',
    tutorialSection2Tip: '<em>Tip: Use the redeployment phase to strengthen your borders!</em>',
    
    // Tutorial Section 3: Territory Cards
    tutorialSection3Title: '🃏 Territory Cards',
    tutorialSection3Content: '<strong>Cards are essential for gaining extra troops:</strong>',
    tutorialSection3List1: '📊 <strong>Collection:</strong> Gain a card when conquering a territory',
    tutorialSection3List2: '🎯 <strong>Combination:</strong> Trade 3 cards of the same type or 3 different ones',
    tutorialSection3List3: '⚡ <strong>Bonus:</strong> Each combination gives you extra troops',
    tutorialSection3List4: '⚠️ <strong>Limit:</strong> Maximum of 5 cards in hand',
    tutorialSection3Tip: '<em>Strategy: Save cards for strategic moments!</em>',
    
    // Tutorial Section 4: Strategies
    tutorialSection4Title: '🧠 Basic Strategies',
    tutorialSection4Content: '<strong>Tips to improve your chances of victory:</strong>',
    tutorialSection4List1: '🏔️ <strong>Continents:</strong> Dominate continents to receive troop bonuses',
    tutorialSection4List2: '🛡️ <strong>Defense:</strong> Strengthen your borders with extra troops',
    tutorialSection4List3: '⚔️ <strong>Attack:</strong> Attack when you have numerical advantage (2:1 or better)',
    tutorialSection4List4: '🎯 <strong>Focus:</strong> Concentrate on one objective at a time',
    tutorialSection4List5: '🔄 <strong>Flexibility:</strong> Adapt your strategy as the game evolves',
    
    // Tutorial Section 5: Advanced Tips
    tutorialSection5Title: '🚀 Advanced Tips',
    tutorialSection5Content: '<strong>Techniques for experienced players:</strong>',
    tutorialSection5List1: '🎲 <strong>Probability:</strong> Understand attack success chances',
    tutorialSection5List2: '🕐 <strong>Timing:</strong> Attack at the right time, not just when possible',
    tutorialSection5List3: '🤝 <strong>Alliances:</strong> In games with more players, temporary alliances can be useful',
    tutorialSection5List4: '🗺️ <strong>Positioning:</strong> Control strategic territories (chokepoints)',
    tutorialSection5List5: '💎 <strong>Resources:</strong> Use cards and continent bonuses efficiently',
    
    // Tutorial Section 6: Ready to Play
    tutorialSection6Title: '🎮 Ready to Play!',
    tutorialSection6Content: '<strong>Congratulations! You are ready to conquer the world!</strong>',
    tutorialSection6List1: '✅ <strong>Basic Rules:</strong> Understood and ready to use',
    tutorialSection6List2: '🎯 <strong>Strategies:</strong> Known and ready to implement',
    tutorialSection6List3: '🃏 <strong>Cards:</strong> System understood and ready to use',
    tutorialSection6List4: '🧠 <strong>Tips:</strong> Applied to maximize your chances',
    tutorialSection6Tip: '<em>Remember: practice makes perfect! Start with games against CPUs to test your strategies.</em>',
    
    // Tutorial Navigation
    tutorialPrevious: '← Previous',
    tutorialNext: 'Next →',
    tutorialFinish: 'Finish',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← Back to Skirmish',
    tutorialStartGame: '🎮 Start Playing',
    
    // Lobby Screen
    lobbyTitle: '🎮 Global Lobby',
    lobbySubtitle: 'Waiting for players to connect...',
    lobbyTimerLabel: 'Time Remaining',
    lobbyPlayersTitle: 'Connected Players',
    lobbyStatusWaiting: 'Waiting for more players...',
    lobbyStatusAllConnected: 'All players connected! Starting game...',
    lobbyStatusCreating: 'Creating room and starting game...',
    lobbyStatusPlayers: '{connected}/{total} players connected. Waiting for more players...',
    lobbyFooter: 'Game will start automatically in 30 seconds or when all players connect',
    lobbyPlayerConnected: 'Connected',
    lobbyPlayerCPU: 'CPU',
    
    // Game HUD
    playerStatsFormat: 'Troops: {troops} | Reinforcement: {reinforcement}',
    gameInstructionsWaiting: 'Waiting for game to start...',
    btnObjective: 'Objective',
    btnCards: 'Cards',
    btnTurn: 'End Turn',
    
    // Info Popups
    infoClose: 'Close',
    infoOk: 'OK',
    infoWarning: 'Warning',
    infoMessage: 'Message',
    
    // Mode Info Popup
    modeInfoTitle: 'Notice',
    
    // Server Error Popup
    serverErrorTitle: '❌ Connection Error',
    serverErrorMessage: 'Error connecting to server. Please try again.',
    serverErrorRetry: 'Try Again',
    
    // Login Error Popup
    loginErrorTitle: '⚠️ Validation Error',
    loginErrorMessage: 'Error message',
    
    // Dominium Dev Popup
    dominiumDevTitle: '🏰 Dominium Mode',
    dominiumDevMessage: 'Dominium mode is under development! This mode will include strategic campaigns, player progression, achievements and rewards, and story mode. Come back soon!',
    dominiumDevOk: 'I Understand',
    
    // Victory Popup
    victoryTitle: '🏆 Victory',
    victoryMessage: 'Congratulations! You won!',
    victorySummaryTitle: '📊 Final Game Summary',
    victoryPlayersTitle: '👥 Player Results',
    victoryObjectivesTitle: '🎯 Player Objectives',
    victoryBackToMenu: '🏠 Back to Menu',
    
    // Game Statistics
    gameDuration: 'Duration:',
    totalAttacks: 'Total Attacks:',
    continentsInDispute: 'Continents in Dispute:',
    
    // Reinforcement Popup
    reinforceTitle: 'Reinforce Territory',
    reinforceClose: 'Close',
    
    // Transfer Popup
    transferTitle: 'Transfer Troops',
    transferClose: 'Close',
    
    // Cards Popup
    cardsTitle: 'Territory Cards',
    cardsClose: 'Close',
    
    // Objective Popup
    objectiveTitle: 'Game Objective',
    objectiveClose: 'Close',
    objectiveYourObjective: '🎯 Your Objective',
    objectiveLoading: 'Loading...',
    objectiveHint: '💡 Tip: Keep your objective in mind throughout the game!',
    objectiveOk: '✅ I Understand',
    
    // Cards Popup
    cardsTitle: 'Territory Cards',
    cardsClose: 'Close',
    cardsYourCards: '🎴 Your Territory Cards',
    cardsInstructions: 'Click on cards to select (maximum 3)',
    cardsExchange: '🔄 Exchange Cards',
    
    // Remanejamento Popup
    remanejamentoTitle: 'Move Troops',
    remanejamentoClose: 'Close',
    
    // Reinforcement Popup
    reinforceTitle: 'Reinforce Territory',
    reinforceClose: 'Close',
    reinforceTerritoryTroops: 'Troops: {troops}',
    reinforceQuantityLabel: 'Amount to add',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ Confirm',
    reinforceCancel: '❌ Cancel',
    
    // Transfer Popup
    transferTitle: 'Transfer Troops',
    transferClose: 'Close',
    transferOriginTroops: 'Troops: {troops}',
    transferDestinationTroops: 'Troops: {troops}',
    transferQuantityLabel: 'Amount to transfer',
    transferQuantity: '{current}/{max}',
    transferConfirm: '✅ Confirm',
    transferCancel: '❌ Cancel',
    
    // Remanejamento Popup
    remanejamentoTitle: 'MOVE TROOPS',
    remanejamentoClose: 'Close',
    remanejamentoOriginTroops: 'Troops: {troops}',
    remanejamentoDestinationTroops: 'Troops: {troops}',
    remanejamentoQuantityLabel: 'Amount to move',
    remanejamentoQuantity: '{current}/{max}',
    remanejamentoConfirm: '✅ Confirm',
    remanejamentoCancel: '❌ Cancel',
    
    // Ranking Popup
    rankingTitle: '🏆 General Ranking',
    rankingMessage: 'This feature will be implemented soon!',
    rankingFeatures: 'You will be able to see:',
    rankingFeature1: '🏅 Top players by victories',
    rankingFeature2: '📊 Game statistics',
    rankingFeature3: '🏆 Achievements and medals',
    rankingFeature4: '📈 Match history',
    rankingOk: 'I Understand',
    
    // Stats Popup
    statsTitle: '📊 My Statistics',
    statsMessage: 'This feature will be implemented soon!',
    statsFeatures: 'You will be able to see:',
    statsFeature1: '🎮 Total games played',
    statsFeature2: '📈 Win rate',
    statsFeature3: '🗺️ Territories conquered',
    statsFeature4: '🏅 Achievements unlocked',
    statsOk: 'I Understand',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ YOUR TURN HAS STARTED!',
    turnConfirmWarning: 'If you do not confirm, your turn will be passed automatically.<br/>After {remaining} forced passes, you will be disconnected.',
    turnConfirmTimerLabel: 'Time Remaining',
    turnConfirmButton: 'CONFIRM TURN',
    
    // Turn Start Popup
    turnStartTitle: 'YOUR TURN!',
    turnStartMessage: 'It\'s your turn to play! You are {player}!',
    turnStartButton: 'OK',
    
    // Chat and History
    chatTab: '💬 Chat',
    historyTab: '📜 History',
    chatEmpty: 'No messages yet. Be the first to chat!',
    historyEmpty: 'No actions recorded yet.',
    chatInputPlaceholder: 'Type your message...',
    chatSendButton: 'Send',
    
    // Turn Buttons
    endTurnButton: 'End Turn',
    endAttackButton: 'End Attack',
    
    // Player Cards and Game Summary
    finalResult: 'FINAL RESULT',
    winner: '🏆 WINNER',
    eliminated: '💀 ELIMINATED',
    cpu: '🤖 CPU',
    inactive: '❌ INACTIVE',
    active: '⚔️ ACTIVE',
    victoryType: 'Victory Type',
    totalElimination: 'Total Elimination',
    objectiveComplete: 'Objective Complete',
    duration: 'Duration',
    totalAttacks: 'Total Attacks',
    actionsSummary: 'ACTIONS SUMMARY',
    noImportantActions: 'No important actions recorded',
    
    // Bonus Text
    bonus: 'Bonus',
    
    // Player Colors
    blue: 'Blue',
    red: 'Red',
    green: 'Green',
    yellow: 'Yellow',
    black: 'Black',
    purple: 'Purple',
    
    // Game Objectives
    eliminateAllPlayers: 'Eliminate all other players',
    conquerContinents: 'Conquer {count} complete continents',
    conquerTerritories: 'Conquer {count} territories',
    conquerSpecificContinents: 'Conquer {continent1} and {continent2}',
    conquerAnyContinents: 'Conquer {continent1}, {continent2} and any other',
    eliminateAllAdversaries: 'Eliminate all adversaries',
    noObjectives: 'No objectives recorded',
    
    // Player Cards Modal
    territories: 'Territories:',
    troops: 'Troops:',
    cards: 'Cards:',
    status: 'Status:',
    human: 'Human',
    won: 'Won',
    lost: 'Lost',
    active: 'Active',
    inactive: 'Inactive',
    currentTurn: 'CURRENT TURN',
    
    // Game Interface
    troops: 'Troops',
    reinforcement: 'Reinforcement',
    objective: 'Objective',
    cards: 'Cards',
    endAttack: 'End Attack',
    chat: 'Chat',
    selectTerritory: 'Select a territory to reinforce troops',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: 'Waiting for game to start...',
    gameInstructionsVictory: '🎉 Congratulations! You won!',
    gameInstructionsDefeat: '💀 You lost the game!',
    gameInstructionsRemanejamento: '🔄 Select territories to move troops',
    gameInstructionsPlaceBonus: '🎯 Place {bonus} bonus troops in continent {continent}',
    gameInstructionsReinforce: '🎯 Select a territory to reinforce troops',
    gameInstructionsAttack: '⚔️ Select one of your territories and an enemy to attack',
    gameInstructionsGameOver: '🎉 Game finished!',
    gameInstructionsWaitingPlayer: '⏳ Waiting for {player}...',
    gameInstructionsCPUPlaying: '🤖 {player} is playing...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Game Messages
    playerEliminated: 'Player {name} was eliminated!',
    turnPassed: 'Now it\'s {name}\'s turn',
    gameOver: 'Game over! No more active players.',
    territoryConquered: '{attacker} conquered {territory}',
    troopsMoved: '{player} moved {amount} troops from {origin} to {destination}',
    
    // Victory/Defeat
    victory: 'Victory!',
    defeat: 'Defeat!',
    victoryByElimination: 'Victory by elimination!',
    victoryByObjective: 'Victory by objective!',
    
    // Buttons
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    
    // Status
    available: 'Available',
    unavailable: 'Unavailable',
    comingSoon: 'Coming Soon',
    workInProgress: 'Em Desenvolvimento'
  },
  pt: { // Portuguese (Brazil)
    // Login Screen
    loginTitle: 'Entre com seu nome para começar',
    usernameLabel: 'Nome do Jogador',
    usernamePlaceholder: 'Digite seu nome...',
    countryLabel: 'Selecione seu país:',
    continueButton: 'CONTINUAR',
    loginFooter: 'Conecte-se e domine o mundo!',
    discordJoin: 'Entre no nosso servidor Discord!',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: 'Selecionar Modo',
    modeSelectionSubtitle: 'Escolha como você quer jogar',
    skirmishMode: 'Skirmish',
    skirmishDescription: 'Jogo rápido com jogadores aleatórios do lobby global',
    dominiumMode: 'Dominium',
    dominiumDescription: 'Modo estratégico com campanhas e progressão',
    backToLogin: '← Voltar ao Login',
    
    // Skirmish Mode
    skirmishTitle: 'Modo Skirmish',
    skirmishSubtitle: 'Jogo rápido e intenso com jogadores do mundo todo',
    startMatch: 'Iniciar Partida',
    startMatchDescription: 'Entre no lobby global e aguarde outros jogadores',
    rankingGeneral: 'Ranking Geral',
    rankingDescription: 'Veja os melhores jogadores e suas estatísticas',
    myStats: 'Minhas Estatísticas',
    statsDescription: 'Visualize seu histórico de jogos e conquistas',
    tutorial: 'Tutorial',
    tutorialDescription: 'Aprenda as regras e estratégias do jogo',
    backToModes: '← Voltar aos Modos',
    
    // Tutorial Screen
    tutorialTitle: '📚 Tutorial do Jogo',
    tutorialSubtitle: 'Aprenda as regras básicas e estratégias para dominar o mundo!',
    
    // Tutorial Section 1: Objetivo do Jogo
    tutorialSection1Title: '🎯 Objetivo do Jogo',
    tutorialSection1Content: '<strong>Conquiste territórios e domine continentes para vencer!</strong>',
    tutorialSection1List1: '🎯 <strong>Objetivo Principal:</strong> Completar seus objetivos para vencer o jogo. Podem ser dominar continentes, eliminar jogadores...',
    tutorialSection1List2: '🗺️ <strong>Mapa:</strong> Mundo dividido em territórios e continentes',
    tutorialSection1List3: '⚔️ <strong>Combate:</strong> Use suas tropas para atacar territórios inimigos',
    tutorialSection1List4: '🏆 <strong>Vitória:</strong> Seja o último sobrevivente ou complete seu objetivo secreto',
    
    // Tutorial Section 2: Fases do Turno
    tutorialSection2Title: '🔄 Fases do Turno',
    tutorialSection2Content: '<strong>Cada turno tem 3 fases principais:</strong>',
    tutorialSection2List1: '<strong>🎯 Colocação de Tropas:</strong> Receba tropas base + bônus de continentes',
    tutorialSection2List2: '<strong>⚔️ Ataques:</strong> Conquiste territórios inimigos',
    tutorialSection2List3: '<strong>🚚 Remanejamento:</strong> Mova tropas entre seus territórios',
    tutorialSection2Tip: '<em>Dica: Use a fase de remanejamento para fortalecer suas fronteiras!</em>',
    
    // Tutorial Section 3: Cartas Território
    tutorialSection3Title: '🃏 Cartas Território',
    tutorialSection3Content: '<strong>As cartas são essenciais para ganhar tropas extras:</strong>',
    tutorialSection3List1: '📊 <strong>Coleta:</strong> Ganhe uma carta ao conquistar um território',
    tutorialSection3List2: '🎯 <strong>Combinação:</strong> Troque 3 cartas do mesmo tipo ou 3 diferentes',
    tutorialSection3List3: '⚡ <strong>Bônus:</strong> Cada combinação te dá tropas extras',
    tutorialSection3List4: '⚠️ <strong>Limite:</strong> Máximo de 5 cartas na mão',
    tutorialSection3Tip: '<em>Estratégia: Guarde cartas para momentos estratégicos!</em>',
    
    // Tutorial Section 4: Estratégias
    tutorialSection4Title: '🧠 Estratégias Básicas',
    tutorialSection4Content: '<strong>Dicas para melhorar suas chances de vitória:</strong>',
    tutorialSection4List1: '🏔️ <strong>Continentes:</strong> Domine continentes para receber bônus de tropas',
    tutorialSection4List2: '🛡️ <strong>Defesa:</strong> Fortaleça suas fronteiras com tropas extras',
    tutorialSection4List3: '⚔️ <strong>Ataque:</strong> Ataque quando tiver vantagem numérica (2:1 ou melhor)',
    tutorialSection4List4: '🎯 <strong>Foco:</strong> Concentre-se em um objetivo por vez',
    tutorialSection4List5: '🔄 <strong>Flexibilidade:</strong> Adapte sua estratégia conforme o jogo evolui',
    
    // Tutorial Section 5: Dicas Avançadas
    tutorialSection5Title: '🚀 Dicas Avançadas',
    tutorialSection5Content: '<strong>Técnicas para jogadores experientes:</strong>',
    tutorialSection5List1: '🎲 <strong>Probabilidade:</strong> Entenda as chances de sucesso nos ataques',
    tutorialSection5List2: '🕐 <strong>Timing:</strong> Ataque no momento certo, não apenas quando possível',
    tutorialSection5List3: '🤝 <strong>Alianças:</strong> Em jogos com mais jogadores, alianças temporárias podem ser úteis',
    tutorialSection5List4: '🗺️ <strong>Posicionamento:</strong> Controle territórios estratégicos (pontos de estrangulamento)',
    tutorialSection5List5: '💎 <strong>Recursos:</strong> Use cartas e bônus de continente de forma eficiente',
    
    // Tutorial Section 6: Pronto para Jogar
    tutorialSection6Title: '🎮 Pronto para Jogar!',
    tutorialSection6Content: '<strong>Parabéns! Você está pronto para conquistar o mundo!</strong>',
    tutorialSection6List1: '✅ <strong>Regras Básicas:</strong> Entendidas e prontas para uso',
    tutorialSection6List2: '🎯 <strong>Estratégias:</strong> Conhecidas e prontas para implementar',
    tutorialSection6List3: '🃏 <strong>Cartas:</strong> Sistema compreendido e pronto para uso',
    tutorialSection6List4: '🧠 <strong>Dicas:</strong> Aplicadas para maximizar suas chances',
    tutorialSection6Tip: '<em>Lembre-se: a prática leva à perfeição! Comece com partidas contra CPUs para testar suas estratégias.</em>',
    
    // Tutorial Navigation
    tutorialPrevious: '← Anterior',
    tutorialNext: 'Próximo →',
    tutorialFinish: 'Finalizar',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← Voltar ao Skirmish',
    tutorialStartGame: '🎮 Começar a Jogar',
    
    // Lobby Screen
    lobbyTitle: '🎮 Lobby Global',
    lobbySubtitle: 'Aguardando jogadores se conectarem...',
    lobbyTimerLabel: 'Tempo Restante',
    lobbyPlayersTitle: 'Jogadores Conectados',
    lobbyStatusWaiting: 'Aguardando mais jogadores...',
    lobbyStatusAllConnected: 'Todos os jogadores conectados! Iniciando jogo...',
    lobbyStatusCreating: 'Criando sala e iniciando jogo...',
    lobbyStatusPlayers: '{connected}/{total} jogadores conectados. Aguardando mais jogadores...',
    lobbyFooter: 'O jogo iniciará automaticamente em 30 segundos ou quando todos os jogadores se conectarem',
    lobbyPlayerConnected: 'Conectado',
    lobbyPlayerCPU: 'CPU',
    
    // Game HUD
    playerStatsFormat: 'Tropas: {troops} | Reforço: {reinforcement}',
    gameInstructionsWaiting: 'Aguardando início do jogo...',
    btnObjective: 'Objetivo',
    btnCards: 'Cartas',
    btnTurn: 'Encerrar',
    
    // Info Popups
    infoClose: 'Fechar',
    infoOk: 'OK',
    infoWarning: 'Aviso',
    infoMessage: 'Mensagem',
    
    // Mode Info Popup
    modeInfoTitle: 'Aviso',
    
    // Server Error Popup
    serverErrorTitle: '❌ Erro de Conexão',
    serverErrorMessage: 'Erro ao conectar com o servidor. Tente novamente.',
    serverErrorRetry: 'Tentar Novamente',
    
    // Login Error Popup
    loginErrorTitle: '⚠️ Erro de Validação',
    loginErrorMessage: 'Mensagem de erro',
    
    // Dominium Dev Popup
    dominiumDevTitle: '🏰 Modo Dominium',
    dominiumDevMessage: 'Modo Dominium está em desenvolvimento! Este modo incluirá campanhas estratégicas, progressão de jogador, conquistas e recompensas, e modo história. Volte em breve!',
    dominiumDevOk: 'Entendi',
    
    // Victory Popup
    victoryTitle: '🏆 Vitória',
    victoryMessage: 'Parabéns! Você venceu!',
    victorySummaryTitle: '📊 Resumo Final do Jogo',
    victoryPlayersTitle: '👥 Resultado dos Jogadores',
    victoryObjectivesTitle: '🎯 Objetivos dos Jogadores',
    victoryBackToMenu: '🏠 Voltar ao Menu',
    
    // Game Statistics
    gameDuration: 'Duração:',
    totalAttacks: 'Total de Ataques:',
    continentsInDispute: 'Continentes em Disputa:',
    
    // Reinforcement Popup
    reinforceTitle: 'Reforçar Território',
    reinforceClose: 'Fechar',
    
    // Transfer Popup
    transferTitle: 'Transferir Tropas',
    transferClose: 'Fechar',
    
    // Cards Popup
    cardsTitle: 'Cartas de Território',
    cardsClose: 'Fechar',
    
    // Objective Popup
    objectiveTitle: 'Objetivo do Jogo',
    objectiveClose: 'Fechar',
    objectiveYourObjective: '🎯 Seu Objetivo',
    objectiveLoading: 'Carregando...',
    objectiveHint: '💡 Dica: Mantenha seu objetivo em mente durante toda a partida!',
    objectiveOk: '✅ Entendi',
    
    // Cards Popup
    cardsTitle: 'Cartas de Território',
    cardsClose: 'Fechar',
    cardsYourCards: '🎴 Suas Cartas Território',
    cardsInstructions: 'Clique nas cartas para selecionar (máximo 3)',
    cardsExchange: '🔄 Trocar Cartas',
    
    // Remanejamento Popup
    remanejamentoTitle: 'Mover Tropas',
    remanejamentoClose: 'Fechar',
    
    // Reinforcement Popup
    reinforceTitle: 'Reforçar Território',
    reinforceClose: 'Fechar',
    reinforceTerritoryTroops: 'Tropas: {troops}',
    reinforceQuantityLabel: 'Quantidade a adicionar',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ Confirmar',
    reinforceCancel: '❌ Cancelar',
    
    // Transfer Popup
    transferTitle: 'Transferir Tropas',
    transferClose: 'Fechar',
    transferOriginTroops: 'Tropas: {troops}',
    transferDestinationTroops: 'Tropas: {troops}',
    transferQuantityLabel: 'Quantidade para transferir',
    transferQuantity: '{current}/{max}',
    transferConfirm: '✅ Confirmar',
    transferCancel: '❌ Cancelar',
    
    // Remanejamento Popup
    remanejamentoTitle: 'MOVER TROPAS',
    remanejamentoClose: 'Fechar',
    remanejamentoOriginTroops: 'Tropas: {troops}',
    remanejamentoDestinationTroops: 'Tropas: {troops}',
    remanejamentoQuantityLabel: 'Quantidade para mover',
    remanejamentoQuantity: '{current}/{max}',
    remanejamentoConfirm: '✅ Confirmar',
    remanejamentoCancel: '❌ Cancelar',
    
    // Ranking Popup
    rankingTitle: '🏆 Ranking Geral',
    rankingMessage: 'Esta funcionalidade será implementada em breve!',
    rankingFeatures: 'Você poderá ver:',
    rankingFeature1: '🏅 Top jogadores por vitórias',
    rankingFeature2: '📊 Estatísticas de jogos',
    rankingFeature3: '🏆 Conquistas e medalhas',
    rankingFeature4: '📈 Histórico de partidas',
    rankingOk: 'Entendi',
    
    // Stats Popup
    statsTitle: '📊 Minhas Estatísticas',
    statsMessage: 'Esta funcionalidade será implementada em breve!',
    statsFeatures: 'Você poderá ver:',
    statsFeature1: '🎮 Total de partidas jogadas',
    statsFeature2: '📈 Taxa de vitória',
    statsFeature3: '🗺️ Territórios conquistados',
    statsFeature4: '🏅 Conquistas desbloqueadas',
    statsOk: 'Entendi',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ SEU TURNO COMEÇOU!',
    turnConfirmWarning: 'Se não confirmar, seu turno será passado automaticamente.<br/>Após {remaining} passagens forçadas, você será desconectado.',
    turnConfirmTimerLabel: 'Tempo Restante',
    turnConfirmButton: 'CONFIRMAR TURNO',
    
    // Turn Start Popup
    turnStartTitle: 'SEU TURNO!',
    turnStartMessage: 'É a sua vez de jogar! Você é o {player}!',
    turnStartButton: 'OK',
    
    // Chat and History
    chatTab: '💬 Chat',
    historyTab: '📜 Histórico',
    chatEmpty: 'Nenhuma mensagem ainda. Seja o primeiro a conversar!',
    historyEmpty: 'Nenhuma ação registrada ainda.',
    chatInputPlaceholder: 'Digite sua mensagem...',
    chatSendButton: 'Enviar',
    
    // Turn Buttons
    endTurnButton: 'Encerrar Turno',
    endAttackButton: 'Encerrar Ataque',
    
    // Player Cards and Game Summary
    finalResult: 'RESULTADO FINAL',
    winner: '🏆 VENCEDOR',
    eliminated: '💀 ELIMINADO',
    cpu: '🤖 CPU',
    inactive: '❌ INATIVO',
    active: '⚔️ ATIVO',
    victoryType: 'Tipo de Vitória',
    totalElimination: 'Eliminação Total',
    objectiveComplete: 'Objetivo Completo',
    duration: 'Duração',
    totalAttacks: 'Total de Ataques',
    actionsSummary: 'RESUMO DAS AÇÕES PRINCIPAIS',
    noImportantActions: 'Nenhuma ação importante registrada',
    
    // Bonus Text
    bonus: 'Bônus',
    
    // Player Colors
    blue: 'Azul',
    red: 'Vermelho',
    green: 'Verde',
    yellow: 'Amarelo',
    black: 'Preto',
    purple: 'Roxo',
    
    // Game Objectives
    eliminateAllPlayers: 'Eliminar todos os outros jogadores',
    conquerContinents: 'Conquistar {count} continentes completos',
    conquerTerritories: 'Conquistar {count} territórios',
    conquerSpecificContinents: 'Conquistar {continent1} e {continent2}',
    conquerAnyContinents: 'Conquistar {continent1}, {continent2} e qualquer outro',
    eliminateAllAdversaries: 'Eliminar todos os adversários',
    noObjectives: 'Nenhum objetivo registrado',
    
    // Player Cards Modal
    territories: 'Territórios:',
    troops: 'Tropas:',
    cards: 'Cartas:',
    status: 'Status:',
    human: 'Humano',
    won: 'Venceu',
    lost: 'Perdeu',
    active: 'Ativo',
    inactive: 'Inativo',
    currentTurn: 'TURNO ATUAL',
    
    // Game Interface
    troops: 'Tropas',
    reinforcement: 'Reforço',
    objective: 'Objetivo',
    cards: 'Cartas',
    endAttack: 'Encerrar Ataque',
    chat: 'Chat',
    selectTerritory: 'Selecione um território para reforçar tropas',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: 'Aguardando início do jogo...',
    gameInstructionsVictory: '🎉 Parabéns! Você venceu!',
    gameInstructionsDefeat: '💀 Você perdeu o jogo!',
    gameInstructionsRemanejamento: '🔄 Selecione territórios para mover tropas',
    gameInstructionsPlaceBonus: '🎯 Coloque {bonus} tropas bônus no continente {continent}',
    gameInstructionsReinforce: '🎯 Selecione um território para reforçar tropas',
    gameInstructionsAttack: '⚔️ Selecione um território seu e um inimigo para atacar',
    gameInstructionsGameOver: '🎉 Jogo finalizado!',
    gameInstructionsWaitingPlayer: '⏳ Aguardando {player}...',
    gameInstructionsCPUPlaying: '🤖 {player} está jogando...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Game Messages
    playerEliminated: 'Jogador {name} foi eliminado!',
    turnPassed: 'Agora é a vez do jogador {name}',
    gameOver: 'Jogo acabou! Não há mais jogadores ativos.',
    territoryConquered: '{attacker} conquistou {territory}',
    troopsMoved: '{player} moveu {amount} tropas de {origin} para {destination}',
    
    // Victory/Defeat
    victory: 'Vitória!',
    defeat: 'Derrota!',
    victoryByElimination: 'Vitória por eliminação!',
    victoryByObjective: 'Vitória por objetivo!',
    
    // Buttons
    ok: 'OK',
    cancel: 'Cancelar',
    close: 'Fechar',
    confirm: 'Confirmar',
    back: 'Voltar',
    
    // Status
    available: 'Disponível',
    unavailable: 'Indisponível',
    comingSoon: 'Em Breve',
    workInProgress: 'Em Desenvolvimento'
  },
  ru: { // Russian
    // Login Screen
    loginTitle: 'Введите ваше имя, чтобы начать',
    usernameLabel: 'Имя игрока',
    usernamePlaceholder: 'Введите ваше имя...',
    countryLabel: 'Выберите вашу страну:',
    continueButton: 'ПРОДОЛЖИТЬ',
    loginFooter: 'Подключитесь и доминируйте в мире!',
    discordJoin: 'Присоединяйтесь к нашему серверу Discord!',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: 'Выбрать режим',
    modeSelectionSubtitle: 'Выберите, как вы хотите играть',
    skirmishMode: 'Схватка',
    skirmishDescription: 'Быстрая игра со случайными игроками из глобального лобби',
    dominiumMode: 'Доминиум',
    dominiumDescription: 'Стратегический режим с кампаниями и прогрессией',
    backToLogin: '← Вернуться к входу',
    
    // Skirmish Mode
    skirmishTitle: 'Режим схватки',
    skirmishSubtitle: 'Быстрая и интенсивная игра с игроками со всего мира',
    startMatch: 'Начать матч',
    startMatchDescription: 'Присоединитесь к глобальному лобби и ждите других игроков',
    rankingGeneral: 'Общий рейтинг',
    rankingDescription: 'Посмотрите лучших игроков и их статистику',
    myStats: 'Моя статистика',
    statsDescription: 'Просмотрите историю игр и достижения',
    tutorial: 'Учебник',
    tutorialDescription: 'Изучите правила и стратегии игры',
    backToModes: '← Вернуться к режимам',
    
    // Tutorial Screen
    tutorialTitle: '📚 Учебник игры',
    tutorialSubtitle: 'Изучите основные правила и стратегии для доминирования в мире!',
    
    // Tutorial Section 1: Цель игры
    tutorialSection1Title: '🎯 Цель игры',
    tutorialSection1Content: '<strong>Завоевывайте территории и доминируйте континенты, чтобы победить!</strong>',
    tutorialSection1List1: '🎯 <strong>Главная цель:</strong> Выполните свои цели, чтобы победить в игре. Это может быть доминирование континентов, устранение игроков...',
    tutorialSection1List2: '🗺️ <strong>Карта:</strong> Мир разделен на территории и континенты',
    tutorialSection1List3: '⚔️ <strong>Бой:</strong> Используйте свои войска для атаки вражеских территорий',
    tutorialSection1List4: '🏆 <strong>Победа:</strong> Будьте последним выжившим или выполните свою секретную цель',
    
    // Tutorial Section 2: Фазы хода
    tutorialSection2Title: '🔄 Фазы хода',
    tutorialSection2Content: '<strong>Каждый ход имеет 3 основные фазы:</strong>',
    tutorialSection2List1: '<strong>🎯 Размещение войск:</strong> Получите базовые войска + бонусы континентов',
    tutorialSection2List2: '<strong>⚔️ Атаки:</strong> Завоевывайте вражеские территории',
    tutorialSection2List3: '<strong>🚚 Передислокация:</strong> Перемещайте войска между вашими территориями',
    tutorialSection2Tip: '<em>Совет: Используйте фазу передислокации для укрепления границ!</em>',
    
    // Tutorial Section 3: Карты территории
    tutorialSection3Title: '🃏 Карты территории',
    tutorialSection3Content: '<strong>Карты необходимы для получения дополнительных войск:</strong>',
    tutorialSection3List1: '📊 <strong>Сбор:</strong> Получите карту при завоевании территории',
    tutorialSection3List2: '🎯 <strong>Комбинация:</strong> Обменяйте 3 карты одного типа или 3 разные',
    tutorialSection3List3: '⚡ <strong>Бонус:</strong> Каждая комбинация дает вам дополнительные войска',
    tutorialSection3List4: '⚠️ <strong>Лимит:</strong> Максимум 5 карт в руке',
    tutorialSection3Tip: '<em>Стратегия: Сохраняйте карты для стратегических моментов!</em>',
    
    // Tutorial Section 4: Стратегии
    tutorialSection4Title: '🧠 Основные стратегии',
    tutorialSection4Content: '<strong>Советы для улучшения шансов на победу:</strong>',
    tutorialSection4List1: '🏔️ <strong>Континенты:</strong> Доминируйте континентами для получения бонусов войск',
    tutorialSection4List2: '🛡️ <strong>Оборона:</strong> Укрепляйте границы дополнительными войсками',
    tutorialSection4List3: '⚔️ <strong>Атака:</strong> Атакуйте при численном преимуществе (2:1 или лучше)',
    tutorialSection4List4: '🎯 <strong>Фокус:</strong> Концентрируйтесь на одной цели за раз',
    tutorialSection4List5: '🔄 <strong>Гибкость:</strong> Адаптируйте стратегию по мере развития игры',
    
    // Tutorial Section 5: Продвинутые советы
    tutorialSection5Title: '🚀 Продвинутые советы',
    tutorialSection5Content: '<strong>Техники для опытных игроков:</strong>',
    tutorialSection5List1: '🎲 <strong>Вероятность:</strong> Понимайте шансы успеха атак',
    tutorialSection5List2: '🕐 <strong>Время:</strong> Атакуйте в нужное время, а не только когда возможно',
    tutorialSection5List3: '🤝 <strong>Альянсы:</strong> В играх с большим количеством игроков временные альянсы могут быть полезны',
    tutorialSection5List4: '🗺️ <strong>Позиционирование:</strong> Контролируйте стратегические территории (узкие места)',
    tutorialSection5List5: '💎 <strong>Ресурсы:</strong> Эффективно используйте карты и бонусы континентов',
    
    // Tutorial Section 6: Готов к игре
    tutorialSection6Title: '🎮 Готов к игре!',
    tutorialSection6Content: '<strong>Поздравляем! Вы готовы завоевать мир!</strong>',
    tutorialSection6List1: '✅ <strong>Основные правила:</strong> Поняты и готовы к использованию',
    tutorialSection6List2: '🎯 <strong>Стратегии:</strong> Известны и готовы к реализации',
    tutorialSection6List3: '🃏 <strong>Карты:</strong> Система понята и готова к использованию',
    tutorialSection6List4: '🧠 <strong>Советы:</strong> Применены для максимизации шансов',
    tutorialSection6Tip: '<em>Помните: практика ведет к совершенству! Начните с игр против ИИ для тестирования стратегий.</em>',
    
    // Tutorial Navigation
    tutorialPrevious: '← Назад',
    tutorialNext: 'Далее →',
    tutorialFinish: 'Завершить',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← Вернуться к схватке',
    tutorialStartGame: '🎮 Начать играть',
    
    // Lobby Screen
    lobbyTitle: '🎮 Глобальное лобби',
    lobbySubtitle: 'Ожидание подключения игроков...',
    lobbyTimerLabel: 'Оставшееся время',
    lobbyPlayersTitle: 'Подключенные игроки',
    lobbyStatusWaiting: 'Ожидание других игроков...',
    lobbyStatusAllConnected: 'Все игроки подключены! Начинаем игру...',
    lobbyStatusCreating: 'Создание комнаты и запуск игры...',
    lobbyStatusPlayers: '{connected}/{total} игроков подключено. Ожидание других игроков...',
    lobbyFooter: 'Игра начнется автоматически через 30 секунд или когда все игроки подключатся',
    lobbyPlayerConnected: 'Подключен',
    lobbyPlayerCPU: 'ИИ',
    
    // Game HUD
    playerStatsFormat: 'Войска: {troops} | Подкрепление: {reinforcement}',
    gameInstructionsWaiting: 'Ожидание начала игры...',
    btnObjective: 'Цель',
    btnCards: 'Карты',
    btnTurn: 'Завершить ход',
    
    // Info Popups
    infoClose: 'Закрыть',
    infoOk: 'OK',
    infoWarning: 'Предупреждение',
    infoMessage: 'Сообщение',
    
    // Server Error Popup
    serverErrorTitle: '❌ Ошибка подключения',
    serverErrorMessage: 'Ошибка подключения к серверу. Попробуйте снова.',
    serverErrorRetry: 'Попробовать снова',
    
    // Victory Popup
    victoryTitle: '🏆 Победа',
    victoryMessage: 'Поздравляем! Вы победили!',
    victorySummaryTitle: '📊 Итоги игры',
    victoryPlayersTitle: '👥 Результаты игроков',
    victoryObjectivesTitle: '🎯 Цели игроков',
    victoryBackToMenu: '🏠 Вернуться в меню',
    
    // Game Statistics
    gameDuration: 'Длительность:',
    totalAttacks: 'Всего атак:',
    continentsInDispute: 'Континенты в споре:',
    
    // Ranking Popup
    rankingTitle: '🏆 Общий рейтинг',
    rankingMessage: 'Эта функция будет реализована в ближайшее время!',
    rankingFeatures: 'Вы сможете увидеть:',
    rankingFeature1: '🏅 Лучшие игроки по победам',
    rankingFeature2: '📊 Статистика игр',
    rankingFeature3: '🏆 Достижения и медали',
    rankingFeature4: '📈 История матчей',
    rankingOk: 'Понятно',
    
    // Stats Popup
    statsTitle: '📊 Моя статистика',
    statsMessage: 'Эта функция будет реализована в ближайшее время!',
    statsFeatures: 'Вы сможете увидеть:',
    statsFeature1: '🎮 Всего сыгранных игр',
    statsFeature2: '📈 Процент побед',
    statsFeature3: '🗺️ Завоеванные территории',
    statsFeature4: '🏅 Разблокированные достижения',
    statsOk: 'Понятно',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ ВАШ ХОД НАЧАЛСЯ!',
    turnConfirmWarning: 'Если вы не подтвердите, ваш ход будет пропущен автоматически.<br/>После {remaining} принудительных пропусков вы будете отключены.',
    turnConfirmTimerLabel: 'Оставшееся время',
    turnConfirmButton: 'ПОДТВЕРДИТЬ ХОД',
    
    // Turn Start Popup
    turnStartTitle: 'ВАШ ХОД!',
    turnStartMessage: 'Ваша очередь играть! Вы {player}!',
    turnStartButton: 'OK',
    
    // Chat and History
    chatTab: '💬 Чат',
    historyTab: '📜 История',
    chatEmpty: 'Пока нет сообщений. Будьте первым, кто начнет общение!',
    historyEmpty: 'Пока нет зарегистрированных действий.',
    chatInputPlaceholder: 'Введите ваше сообщение...',
    chatSendButton: 'Отправить',
    
    // Turn Buttons
    endTurnButton: 'Завершить ход',
    endAttackButton: 'Завершить атаку',
    
    // Player Cards and Game Summary
    finalResult: 'ФИНАЛЬНЫЙ РЕЗУЛЬТАТ',
    winner: '🏆 ПОБЕДИТЕЛЬ',
    eliminated: '💀 УСТРАНЕН',
    cpu: '🤖 ИИ',
    inactive: '❌ НЕАКТИВЕН',
    active: '⚔️ АКТИВЕН',
    victoryType: 'Тип победы',
    totalElimination: 'Полное устранение',
    objectiveComplete: 'Цель выполнена',
    duration: 'Длительность',
    totalAttacks: 'Всего атак',
    actionsSummary: 'СВОДКА ОСНОВНЫХ ДЕЙСТВИЙ',
    noImportantActions: 'Важные действия не зарегистрированы',
    
    // Player Cards Modal
    territories: 'Территории:',
    troops: 'Войска:',
    cards: 'Карты:',
    status: 'Статус:',
    human: 'Человек',
    won: 'Победил',
    lost: 'Проиграл',
    active: 'Активен',
    inactive: 'Неактивен',
    currentTurn: 'ТЕКУЩИЙ ХОД',
    
    // Objective Popup
    objectiveTitle: 'Цель игры',
    objectiveClose: 'Закрыть',
    objectiveYourObjective: '🎯 Ваша цель',
    objectiveLoading: 'Загрузка...',
    objectiveHint: '💡 Совет: Помните о своей цели на протяжении всей игры!',
    objectiveOk: '✅ Понятно',
    
    // Cards Popup
    cardsTitle: 'Карты территорий',
    cardsClose: 'Закрыть',
    cardsYourCards: '🎴 Ваши карты территорий',
    cardsInstructions: 'Нажмите на карты для выбора (максимум 3)',
    cardsExchange: '🔄 Обменять карты',
    
    // Game Interface
    troops: 'Войска',
    reinforcement: 'Подкрепление',
    
    // Bonus Text
    bonus: 'Бонус',
    
    // Player Colors
    blue: 'Синий',
    red: 'Красный',
    green: 'Зелёный',
    yellow: 'Жёлтый',
    black: 'Чёрный',
    purple: 'Фиолетовый',
    
    // Game Objectives
    eliminateAllPlayers: 'Устранить всех других игроков',
    conquerContinents: 'Завоевать {count} полных континентов',
    conquerTerritories: 'Завоевать {count} территорий',
    conquerSpecificContinents: 'Завоевать {continent1} и {continent2}',
    conquerAnyContinents: 'Завоевать {continent1}, {continent2} и любой другой',
    eliminateAllAdversaries: 'Устранить всех противников',
    noObjectives: 'Цели не зарегистрированы',
    
    // Reinforcement Popup
    reinforceTitle: 'Усилить территорию',
    reinforceClose: 'Закрыть',
    reinforceTerritoryTroops: 'Войска: {troops}',
    reinforceQuantityLabel: 'Количество для добавления',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ Подтвердить',
    reinforceCancel: '❌ Отмена',
    objective: 'Цель',
    cards: 'Карты',
    endAttack: 'Завершить атаку',
    chat: 'Чат',
    selectTerritory: 'Выберите территорию для усиления войск',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: 'Ожидание начала игры...',
    gameInstructionsVictory: '🎉 Поздравляем! Вы победили!',
    gameInstructionsDefeat: '💀 Вы проиграли игру!',
    gameInstructionsRemanejamento: '🔄 Выберите территории для перемещения войск',
    gameInstructionsPlaceBonus: '🎯 Разместите {bonus} бонусных войск на континенте {continent}',
    gameInstructionsReinforce: '🎯 Выберите территорию для усиления войск',
    gameInstructionsAttack: '⚔️ Выберите одну из ваших территорий и врага для атаки',
    gameInstructionsGameOver: '🎉 Игра завершена!',
    gameInstructionsWaitingPlayer: '⏳ Ожидание {player}...',
    gameInstructionsCPUPlaying: '🤖 {player} играет...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Game Messages
    playerEliminated: 'Игрок {name} был устранен!',
    turnPassed: 'Теперь ход игрока {name}',
    gameOver: 'Игра окончена! Нет больше активных игроков.',
    territoryConquered: '{attacker} завоевал {territory}',
    troopsMoved: '{player} переместил {amount} войск с {origin} на {destination}',
    
    // Victory/Defeat
    victory: 'Победа!',
    defeat: 'Поражение!',
    victoryByElimination: 'Победа путем устранения!',
    victoryByObjective: 'Победа по цели!',
    
    // Buttons
    ok: 'ОК',
    cancel: 'Отмена',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    back: 'Назад',
    
    // Status
    available: 'Доступно',
    unavailable: 'Недоступно',
    comingSoon: 'Скоро',
    workInProgress: 'В разработке'
  },
  zh: { // Chinese
    // Login Screen
    loginTitle: '输入您的姓名开始游戏',
    usernameLabel: '玩家姓名',
    usernamePlaceholder: '输入您的姓名...',
    countryLabel: '选择您的国家:',
    continueButton: '继续',
    loginFooter: '连接并统治世界！',
    discordJoin: '加入我们的Discord服务器！',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: '选择模式',
    modeSelectionSubtitle: '选择您想要游戏的方式',
    skirmishMode: '遭遇战',
    skirmishDescription: '与全球大厅的随机玩家进行快速游戏',
    dominiumMode: '统治模式',
    dominiumDescription: '具有战役和进度的战略模式',
    backToLogin: '← 返回登录',
    
    // Skirmish Mode
    skirmishTitle: '遭遇战模式',
    skirmishSubtitle: '与来自世界各地的玩家进行快速激烈的游戏',
    startMatch: '开始比赛',
    startMatchDescription: '加入全球大厅并等待其他玩家',
    rankingGeneral: '总排名',
    rankingDescription: '查看最佳玩家及其统计数据',
    myStats: '我的统计',
    statsDescription: '查看您的游戏历史和成就',
    tutorial: '教程',
    tutorialDescription: '学习游戏规则和策略',
    backToModes: '← 返回模式',
    
    // Tutorial Screen
    tutorialTitle: '📚 游戏教程',
    tutorialSubtitle: '学习基本规则和策略来统治世界！',
    
    // Tutorial Section 1: 游戏目标
    tutorialSection1Title: '🎯 游戏目标',
    tutorialSection1Content: '<strong>征服领土并统治大陆来获胜！</strong>',
    tutorialSection1List1: '🎯 <strong>主要目标:</strong> 完成您的目标来赢得游戏。这可以是统治大陆、淘汰玩家...',
    tutorialSection1List2: '🗺️ <strong>地图:</strong> 世界分为领土和大陆',
    tutorialSection1List3: '⚔️ <strong>战斗:</strong> 使用您的部队攻击敌方领土',
    tutorialSection1List4: '🏆 <strong>胜利:</strong> 成为最后的幸存者或完成您的秘密目标',
    
    // Tutorial Section 2: 回合阶段
    tutorialSection2Title: '🔄 回合阶段',
    tutorialSection2Content: '<strong>每个回合有3个主要阶段:</strong>',
    tutorialSection2List1: '<strong>🎯 部队部署:</strong> 获得基础部队 + 大陆奖励',
    tutorialSection2List2: '<strong>⚔️ 攻击:</strong> 征服敌方领土',
    tutorialSection2List3: '<strong>🚚 重新部署:</strong> 在您的领土之间移动部队',
    tutorialSection2Tip: '<em>提示: 使用重新部署阶段来加强您的边界！</em>',
    
    // Tutorial Section 3: 领土卡牌
    tutorialSection3Title: '🃏 领土卡牌',
    tutorialSection3Content: '<strong>卡牌对于获得额外部队至关重要:</strong>',
    tutorialSection3List1: '📊 <strong>收集:</strong> 征服领土时获得一张卡牌',
    tutorialSection3List2: '🎯 <strong>组合:</strong> 交易3张相同类型或3张不同的卡牌',
    tutorialSection3List3: '⚡ <strong>奖励:</strong> 每个组合给您额外部队',
    tutorialSection3List4: '⚠️ <strong>限制:</strong> 手牌最多5张',
    tutorialSection3Tip: '<em>策略: 保存卡牌用于战略时刻！</em>',
    
    // Tutorial Section 4: 策略
    tutorialSection4Title: '🧠 基本策略',
    tutorialSection4Content: '<strong>提高获胜机会的提示:</strong>',
    tutorialSection4List1: '🏔️ <strong>大陆:</strong> 统治大陆来获得部队奖励',
    tutorialSection4List2: '🛡️ <strong>防御:</strong> 用额外部队加强您的边界',
    tutorialSection4List3: '⚔️ <strong>攻击:</strong> 在数量优势时攻击（2:1或更好）',
    tutorialSection4List4: '🎯 <strong>专注:</strong> 一次专注于一个目标',
    tutorialSection4List5: '🔄 <strong>灵活性:</strong> 随着游戏发展调整您的策略',
    
    // Tutorial Section 5: 高级提示
    tutorialSection5Title: '🚀 高级提示',
    tutorialSection5Content: '<strong>经验玩家的技巧:</strong>',
    tutorialSection5List1: '🎲 <strong>概率:</strong> 了解攻击成功的机会',
    tutorialSection5List2: '🕐 <strong>时机:</strong> 在正确时间攻击，而不仅仅是可能时',
    tutorialSection5List3: '🤝 <strong>联盟:</strong> 在更多玩家的游戏中，临时联盟可能有用',
    tutorialSection5List4: '🗺️ <strong>定位:</strong> 控制战略领土（瓶颈点）',
    tutorialSection5List5: '💎 <strong>资源:</strong> 高效使用卡牌和大陆奖励',
    
    // Tutorial Section 6: 准备游戏
    tutorialSection6Title: '🎮 准备游戏！',
    tutorialSection6Content: '<strong>恭喜！您准备征服世界！</strong>',
    tutorialSection6List1: '✅ <strong>基本规则:</strong> 已理解并准备使用',
    tutorialSection6List2: '🎯 <strong>策略:</strong> 已知并准备实施',
    tutorialSection6List3: '🃏 <strong>卡牌:</strong> 系统已理解并准备使用',
    tutorialSection6List4: '🧠 <strong>提示:</strong> 已应用以最大化您的机会',
    tutorialSection6Tip: '<em>记住: 熟能生巧！从与CPU的游戏开始来测试您的策略。</em>',
    
    // Tutorial Navigation
    tutorialPrevious: '← 上一个',
    tutorialNext: '下一个 →',
    tutorialFinish: '完成',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← 返回遭遇战',
    tutorialStartGame: '🎮 开始游戏',
    
    // Lobby Screen
    lobbyTitle: '🎮 全球大厅',
    lobbySubtitle: '等待玩家连接...',
    lobbyTimerLabel: '剩余时间',
    lobbyPlayersTitle: '已连接玩家',
    lobbyStatusWaiting: '等待更多玩家...',
    lobbyStatusAllConnected: '所有玩家已连接！开始游戏...',
    lobbyStatusCreating: '创建房间并开始游戏...',
    lobbyStatusPlayers: '{connected}/{total} 玩家已连接。等待更多玩家...',
    lobbyFooter: '游戏将在30秒后自动开始或当所有玩家连接时开始',
    lobbyPlayerConnected: '已连接',
    lobbyPlayerCPU: 'CPU',
    
    // Game HUD
    playerStatsFormat: '部队: {troops} | 增援: {reinforcement}',
    gameInstructionsWaiting: '等待游戏开始...',
    btnObjective: '目标',
    btnCards: '卡牌',
    btnTurn: '结束回合',
    
    // Info Popups
    infoClose: '关闭',
    infoOk: '确定',
    infoWarning: '警告',
    infoMessage: '消息',
    
    // Server Error Popup
    serverErrorTitle: '❌ 连接错误',
    serverErrorMessage: '连接服务器时出错。请重试。',
    serverErrorRetry: '重试',
    
    // Victory Popup
    victoryTitle: '🏆 胜利',
    victoryMessage: '恭喜！你赢了！',
    victorySummaryTitle: '📊 游戏最终总结',
    victoryPlayersTitle: '👥 玩家结果',
    victoryObjectivesTitle: '🎯 玩家目标',
    victoryBackToMenu: '🏠 返回菜单',
    
    // Game Statistics
    gameDuration: '持续时间:',
    totalAttacks: '总攻击次数:',
    continentsInDispute: '争夺中的大陆:',
    
    // Ranking Popup
    rankingTitle: '🏆 总排行榜',
    rankingMessage: '此功能即将推出！',
    rankingFeatures: '您将能够看到:',
    rankingFeature1: '🏅 按胜利排名的顶级玩家',
    rankingFeature2: '📊 游戏统计',
    rankingFeature3: '🏆 成就和奖牌',
    rankingFeature4: '📈 比赛历史',
    rankingOk: '我明白了',
    
    // Stats Popup
    statsTitle: '📊 我的统计',
    statsMessage: '此功能即将推出！',
    statsFeatures: '您将能够看到:',
    statsFeature1: '🎮 总游戏场数',
    statsFeature2: '📈 胜率',
    statsFeature3: '🗺️ 征服的领土',
    statsFeature4: '🏅 解锁的成就',
    statsOk: '我明白了',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ 你的回合开始了！',
    turnConfirmWarning: '如果你不确认，你的回合将自动跳过。<br/>在{remaining}次强制跳过后，你将被断开连接。',
    turnConfirmTimerLabel: '剩余时间',
    turnConfirmButton: '确认回合',
    
    // Turn Start Popup
    turnStartTitle: '你的回合！',
    turnStartMessage: '轮到你玩了！你是{player}！',
    turnStartButton: '确定',
    
    // Chat and History
    chatTab: '💬 聊天',
    historyTab: '📜 历史',
    chatEmpty: '还没有消息。成为第一个聊天的人！',
    historyEmpty: '还没有记录的操作。',
    chatInputPlaceholder: '输入您的消息...',
    chatSendButton: '发送',
    
    // Turn Buttons
    endTurnButton: '结束回合',
    endAttackButton: '结束攻击',
    
    // Player Cards and Game Summary
    finalResult: '最终结果',
    winner: '🏆 胜利者',
    eliminated: '💀 已淘汰',
    cpu: '🤖 CPU',
    inactive: '❌ 非活跃',
    active: '⚔️ 活跃',
    victoryType: '胜利类型',
    totalElimination: '完全淘汰',
    objectiveComplete: '目标完成',
    duration: '持续时间',
    totalAttacks: '总攻击次数',
    actionsSummary: '主要行动摘要',
    noImportantActions: '没有记录重要行动',
    
    // Player Cards Modal
    territories: '领土:',
    troops: '军队:',
    cards: '卡牌:',
    status: '状态:',
    human: '人类',
    won: '获胜',
    lost: '失败',
    active: '活跃',
    inactive: '非活跃',
    currentTurn: '当前回合',
    
    // Objective Popup
    objectiveTitle: '游戏目标',
    objectiveClose: '关闭',
    objectiveYourObjective: '🎯 你的目标',
    objectiveLoading: '加载中...',
    objectiveHint: '💡 提示：在整个游戏过程中记住你的目标！',
    objectiveOk: '✅ 我明白了',
    
    // Cards Popup
    cardsTitle: '领土卡牌',
    cardsClose: '关闭',
    cardsYourCards: '🎴 你的领土卡牌',
    cardsInstructions: '点击卡牌进行选择（最多3张）',
    cardsExchange: '🔄 交换卡牌',
    
    // Game Interface
    troops: '部队',
    reinforcement: '增援',
    
    // Bonus Text
    bonus: '奖励',
    
    // Player Colors
    blue: '蓝色',
    red: '红色',
    green: '绿色',
    yellow: '黄色',
    black: '黑色',
    purple: '紫色',
    
    // Game Objectives
    eliminateAllPlayers: '淘汰所有其他玩家',
    conquerContinents: '征服{count}个完整大陆',
    conquerTerritories: '征服{count}个领土',
    conquerSpecificContinents: '征服{continent1}和{continent2}',
    conquerAnyContinents: '征服{continent1}、{continent2}和任何其他',
    eliminateAllAdversaries: '淘汰所有对手',
    noObjectives: '没有记录的目标',
    
    // Reinforcement Popup
    reinforceTitle: '增援领土',
    reinforceClose: '关闭',
    reinforceTerritoryTroops: '部队: {troops}',
    reinforceQuantityLabel: '要添加的数量',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ 确认',
    reinforceCancel: '❌ 取消',
    objective: '目标',
    cards: '卡牌',
    endAttack: '结束攻击',
    chat: '聊天',
    selectTerritory: '选择要增援部队的领土',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: '等待游戏开始...',
    gameInstructionsVictory: '🎉 恭喜！你赢了！',
    gameInstructionsDefeat: '💀 你输了游戏！',
    gameInstructionsRemanejamento: '🔄 选择领土来移动部队',
    gameInstructionsPlaceBonus: '🎯 在大陆{continent}放置{bonus}个奖励部队',
    gameInstructionsReinforce: '🎯 选择一个领土来增援部队',
    gameInstructionsAttack: '⚔️ 选择你的一个领土和一个敌人来攻击',
    gameInstructionsGameOver: '🎉 游戏结束！',
    gameInstructionsWaitingPlayer: '⏳ 等待{player}...',
    gameInstructionsCPUPlaying: '🤖 {player}正在游戏中...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Game Messages
    playerEliminated: '玩家 {name} 被淘汰！',
    turnPassed: '现在是玩家 {name} 的回合',
    gameOver: '游戏结束！没有更多活跃玩家。',
    territoryConquered: '{attacker} 征服了 {territory}',
    troopsMoved: '{player} 将 {amount} 支部队从 {origin} 移动到 {destination}',
    
    // Victory/Defeat
    victory: '胜利！',
    defeat: '失败！',
    victoryByElimination: '通过淘汰获胜！',
    victoryByObjective: '通过目标获胜！',
    
    // Buttons
    ok: '确定',
    cancel: '取消',
    close: '关闭',
    confirm: '确认',
    back: '返回',
    
    // Status
    available: '可用',
    unavailable: '不可用',
    comingSoon: '即将推出',
    workInProgress: '开发中'
  },
  hi: { // Hindi (India)
    // Login Screen
    loginTitle: 'शुरू करने के लिए अपना नाम दर्ज करें',
    usernameLabel: 'खिलाड़ी का नाम',
    usernamePlaceholder: 'अपना नाम टाइप करें...',
    countryLabel: 'अपना देश चुनें:',
    continueButton: 'जारी रखें',
    loginFooter: 'कनेक्ट करें और दुनिया पर राज करें!',
    discordJoin: 'हमारे Discord सर्वर में शामिल हों!',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: 'मोड चुनें',
    modeSelectionSubtitle: 'चुनें कि आप कैसे खेलना चाहते हैं',
    skirmishMode: 'झड़प',
    skirmishDescription: 'वैश्विक लॉबी से यादृच्छिक खिलाड़ियों के साथ त्वरित खेल',
    dominiumMode: 'डोमिनियम',
    dominiumDescription: 'अभियानों और प्रगति के साथ रणनीतिक मोड',
    backToLogin: '← लॉगिन पर वापस जाएं',
    
    // Skirmish Mode
    skirmishTitle: 'झड़प मोड',
    skirmishSubtitle: 'दुनिया भर के खिलाड़ियों के साथ त्वरित और तीव्र खेल',
    startMatch: 'मैच शुरू करें',
    startMatchDescription: 'वैश्विक लॉबी में शामिल हों और अन्य खिलाड़ियों की प्रतीक्षा करें',
    rankingGeneral: 'सामान्य रैंकिंग',
    rankingDescription: 'सर्वश्रेष्ठ खिलाड़ियों और उनके आंकड़े देखें',
    myStats: 'मेरे आंकड़े',
    statsDescription: 'अपने खेल इतिहास और उपलब्धियों को देखें',
    tutorial: 'ट्यूटोरियल',
    tutorialDescription: 'खेल के नियम और रणनीतियां सीखें',
    backToModes: '← मोड पर वापस जाएं',
    
    // Tutorial Screen
    tutorialTitle: '📚 गेम ट्यूटोरियल',
    tutorialSubtitle: 'दुनिया पर राज करने के लिए बुनियादी नियम और रणनीतियां सीखें!',
    
    // Tutorial Section 1: Game Objective
    tutorialSection1Title: '🎯 गेम का उद्देश्य',
    tutorialSection1Content: '<strong>क्षेत्रों को जीतें और महाद्वीपों पर राज करें!</strong>',
    tutorialSection1List1: '🎯 <strong>मुख्य उद्देश्य:</strong> गेम जीतने के लिए अपने उद्देश्यों को पूरा करें',
    tutorialSection1List2: '🗺️ <strong>मानचित्र:</strong> दुनिया क्षेत्रों और महाद्वीपों में विभाजित',
    tutorialSection1List3: '⚔️ <strong>युद्ध:</strong> दुश्मन क्षेत्रों पर हमला करने के लिए अपनी सेना का उपयोग करें',
    tutorialSection1List4: '🏆 <strong>विजय:</strong> अंतिम जीवित रहें या अपना गुप्त उद्देश्य पूरा करें',
    
    // Tutorial Navigation
    tutorialPrevious: '← पिछला',
    tutorialNext: 'अगला →',
    tutorialFinish: 'समाप्त करें',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← स्किरमिश पर वापस जाएं',
    tutorialStartGame: '🎮 खेलना शुरू करें',
    
    // Lobby Screen
    lobbyTitle: '🎮 वैश्विक लॉबी',
    lobbySubtitle: 'खिलाड़ियों के कनेक्ट होने की प्रतीक्षा...',
    lobbyTimerLabel: 'शेष समय',
    lobbyPlayersTitle: 'कनेक्टेड खिलाड़ी',
    lobbyStatusWaiting: 'अधिक खिलाड़ियों की प्रतीक्षा...',
    lobbyStatusAllConnected: 'सभी खिलाड़ी कनेक्टेड! गेम शुरू हो रहा है...',
    lobbyStatusCreating: 'रूम बना रहा है और गेम शुरू हो रहा है...',
    lobbyStatusPlayers: '{connected}/{total} खिलाड़ी कनेक्टेड। अधिक खिलाड़ियों की प्रतीक्षा...',
    lobbyFooter: 'गेम 30 सेकंड में या सभी खिलाड़ियों के कनेक्ट होने पर स्वचालित रूप से शुरू होगा',
    lobbyPlayerConnected: 'कनेक्टेड',
    lobbyPlayerCPU: 'CPU',
    
    // Game HUD
    playerStatsFormat: 'सैनिक: {troops} | सुदृढीकरण: {reinforcement}',
    gameInstructionsWaiting: 'गेम शुरू होने की प्रतीक्षा...',
    btnObjective: 'उद्देश्य',
    btnCards: 'कार्ड',
    btnTurn: 'टर्न समाप्त करें',
    
    // Info Popups
    infoClose: 'बंद करें',
    infoOk: 'ठीक है',
    infoWarning: 'चेतावनी',
    infoMessage: 'संदेश',
    
    // Victory Popup
    victoryTitle: '🏆 विजय',
    victoryMessage: 'बधाई हो! आप जीत गए!',
    victorySummaryTitle: '📊 गेम का अंतिम सारांश',
    victoryPlayersTitle: '👥 खिलाड़ियों के परिणाम',
    victoryObjectivesTitle: '🎯 खिलाड़ियों के उद्देश्य',
    victoryBackToMenu: '🏠 मेनू पर वापस जाएं',
    
    // Ranking Popup
    rankingTitle: '🏆 सामान्य रैंकिंग',
    rankingMessage: 'यह सुविधा जल्द ही लागू की जाएगी!',
    rankingFeatures: 'आप देख सकेंगे:',
    rankingFeature1: '🏅 जीत के अनुसार शीर्ष खिलाड़ी',
    rankingFeature2: '📊 गेम आंकड़े',
    rankingFeature3: '🏆 उपलब्धियां और पदक',
    rankingFeature4: '📈 मैच इतिहास',
    rankingOk: 'मैं समझ गया',
    
    // Stats Popup
    statsTitle: '📊 मेरे आंकड़े',
    statsMessage: 'यह सुविधा जल्द ही लागू की जाएगी!',
    
    // Objective Popup
    objectiveTitle: 'गेम का उद्देश्य',
    objectiveClose: 'बंद करें',
    objectiveYourObjective: '🎯 आपका उद्देश्य',
    objectiveLoading: 'लोड हो रहा है...',
    objectiveHint: '💡 टिप: पूरे गेम में अपना उद्देश्य याद रखें!',
    objectiveOk: '✅ मैं समझ गया',
    
    // Cards Popup
    cardsTitle: 'क्षेत्र कार्ड',
    cardsClose: 'बंद करें',
    cardsYourCards: '🎴 आपके क्षेत्र कार्ड',
    cardsInstructions: 'कार्ड चुनने के लिए क्लिक करें (अधिकतम 3)',
    cardsExchange: '🔄 कार्ड बदलें',
    statsFeatures: 'आप देख सकेंगे:',
    statsFeature1: '🎮 कुल खेले गए गेम',
    statsFeature2: '📈 जीत की दर',
    statsFeature3: '🗺️ जीते गए क्षेत्र',
    statsFeature4: '🏅 अनलॉक की गई उपलब्धियां',
    statsOk: 'मैं समझ गया',
    
    // Game Interface
    troops: 'सैनिक',
    reinforcement: 'सुदृढीकरण',
    
    // Bonus Text
    bonus: 'बोनस',
    
    // Player Colors
    blue: 'नीला',
    red: 'लाल',
    green: 'हरा',
    yellow: 'पीला',
    black: 'काला',
    purple: 'बैंगनी',
    
    // Game Objectives
    eliminateAllPlayers: 'सभी अन्य खिलाड़ियों को हटाएं',
    conquerContinents: '{count} पूर्ण महाद्वीपों पर विजय प्राप्त करें',
    conquerTerritories: '{count} क्षेत्रों पर विजय प्राप्त करें',
    conquerSpecificContinents: '{continent1} और {continent2} पर विजय प्राप्त करें',
    conquerAnyContinents: '{continent1}, {continent2} और कोई अन्य पर विजय प्राप्त करें',
    eliminateAllAdversaries: 'सभी प्रतिद्वंद्वियों को हटाएं',
    noObjectives: 'कोई उद्देश्य दर्ज नहीं किया गया',
    
    // Reinforcement Popup
    reinforceTitle: 'क्षेत्र को मजबूत करें',
    reinforceClose: 'बंद करें',
    reinforceTerritoryTroops: 'सैनिक: {troops}',
    reinforceQuantityLabel: 'जोड़ने की मात्रा',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ पुष्टि करें',
    reinforceCancel: '❌ रद्द करें',
    objective: 'उद्देश्य',
    cards: 'कार्ड',
    endAttack: 'हमला समाप्त करें',
    chat: 'चैट',
    selectTerritory: 'सैनिकों को मजबूत करने के लिए एक क्षेत्र चुनें',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: 'गेम शुरू होने की प्रतीक्षा...',
    gameInstructionsVictory: '🎉 बधाई हो! आप जीत गए!',
    gameInstructionsDefeat: '💀 आप गेम हार गए!',
    gameInstructionsRemanejamento: '🔄 ट्रूप्स को स्थानांतरित करने के लिए क्षेत्र चुनें',
    gameInstructionsPlaceBonus: '🎯 महाद्वीप {continent} में {bonus} बोनस ट्रूप्स रखें',
    gameInstructionsReinforce: '🎯 ट्रूप्स को मजबूत करने के लिए एक क्षेत्र चुनें',
    gameInstructionsAttack: '⚔️ हमला करने के लिए अपना एक क्षेत्र और एक दुश्मन चुनें',
    gameInstructionsGameOver: '🎉 गेम समाप्त!',
    gameInstructionsWaitingPlayer: '⏳ {player} की प्रतीक्षा...',
    gameInstructionsCPUPlaying: '🤖 {player} खेल रहा है...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Game Messages
    playerEliminated: 'खिलाड़ी {name} को हटा दिया गया!',
    turnPassed: 'अब खिलाड़ी {name} की बारी है',
    gameOver: 'खेल समाप्त! कोई और सक्रिय खिलाड़ी नहीं है।',
    territoryConquered: '{attacker} ने {territory} को जीत लिया',
    troopsMoved: '{player} ने {amount} सैनिकों को {origin} से {destination} तक स्थानांतरित किया',
    
    // Victory/Defeat
    victory: 'विजय!',
    defeat: 'हार!',
    victoryByElimination: 'हटाने से विजय!',
    victoryByObjective: 'उद्देश्य से विजय!',
    
    // Buttons
    ok: 'ठीक है',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    confirm: 'पुष्टि करें',
    back: 'वापस',
    
    // Status
    available: 'उपलब्ध',
    unavailable: 'अनुपलब्ध',
    comingSoon: 'जल्द आ रहा है',
    workInProgress: 'विकास में',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ आपकी बारी शुरू हो गई है!',
    turnConfirmWarning: 'यदि आप पुष्टि नहीं करते हैं, तो आपकी बारी स्वचालित रूप से पास हो जाएगी।<br/>{remaining} जबरन पास के बाद, आपको डिस्कनेक्ट कर दिया जाएगा।',
    turnConfirmTimerLabel: 'शेष समय',
    turnConfirmButton: 'बारी की पुष्टि करें',
    
    // Turn Start Popup
    turnStartTitle: 'आपकी बारी!',
    turnStartMessage: 'खेलने की आपकी बारी है! आप {player} हैं!',
    turnStartButton: 'ठीक है',
    
    // Chat and History
    chatTab: '💬 चैट',
    historyTab: '📜 इतिहास',
    chatEmpty: 'अभी तक कोई संदेश नहीं। पहले बातचीत शुरू करने वाले बनें!',
    historyEmpty: 'अभी तक कोई कार्रवाई दर्ज नहीं हुई।',
    chatInputPlaceholder: 'अपना संदेश टाइप करें...',
    chatSendButton: 'भेजें',
    
    // Turn Buttons
    endTurnButton: 'टर्न समाप्त करें',
    endAttackButton: 'हमला समाप्त करें',
    
    // Player Cards and Game Summary
    finalResult: 'अंतिम परिणाम',
    winner: '🏆 विजेता',
    eliminated: '💀 हटाया गया',
    cpu: '🤖 CPU',
    inactive: '❌ निष्क्रिय',
    active: '⚔️ सक्रिय',
    victoryType: 'विजय का प्रकार',
    totalElimination: 'कुल उन्मूलन',
    objectiveComplete: 'उद्देश्य पूरा',
    duration: 'अवधि',
    totalAttacks: 'कुल हमले',
    actionsSummary: 'मुख्य कार्यों का सारांश',
    noImportantActions: 'कोई महत्वपूर्ण कार्य दर्ज नहीं किया गया',
    
    // Player Cards Modal
    territories: 'क्षेत्र:',
    troops: 'सैनिक:',
    cards: 'कार्ड:',
    status: 'स्थिति:',
    human: 'मानव',
    won: 'जीता',
    lost: 'हारा',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    currentTurn: 'वर्तमान टर्न'
  },
  
  de: { // German
    // Login Screen
    loginTitle: 'Geben Sie Ihren Namen ein, um zu beginnen',
    usernameLabel: 'Spielername',
    usernamePlaceholder: 'Geben Sie Ihren Namen ein...',
    countryLabel: 'Wählen Sie Ihr Land:',
    continueButton: 'WEITER',
    loginFooter: 'Verbinden Sie sich und dominieren Sie die Welt!',
    discordJoin: 'Treten Sie unserem Discord-Server bei!',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: 'Modus auswählen',
    modeSelectionSubtitle: 'Wählen Sie, wie Sie spielen möchten',
    skirmishMode: 'Gefecht',
    skirmishDescription: 'Schnelles Spiel mit zufälligen Spielern aus der globalen Lobby',
    dominiumMode: 'Dominium',
    dominiumDescription: 'Strategischer Modus mit Kampagnen und Fortschritt',
    backToLogin: '← Zurück zum Login',
    
    // Skirmish Mode
    skirmishTitle: 'Gefechtsmodus',
    skirmishSubtitle: 'Schnelles und intensives Spiel mit Spielern aus der ganzen Welt',
    startMatch: 'Spiel starten',
    startMatchDescription: 'Treten Sie der globalen Lobby bei und warten Sie auf andere Spieler',
    rankingGeneral: 'Allgemeine Rangliste',
    rankingDescription: 'Sehen Sie die besten Spieler und ihre Statistiken',
    myStats: 'Meine Statistiken',
    statsDescription: 'Sehen Sie Ihren Spielverlauf und Ihre Erfolge',
    tutorial: 'Tutorial',
    tutorialDescription: 'Lernen Sie die Regeln und Strategien des Spiels',
    backToModes: '← Zurück zu den Modi',
    
    // Tutorial Screen
    tutorialTitle: '📚 Spiel-Tutorial',
    tutorialSubtitle: 'Lernen Sie die grundlegenden Regeln und Strategien, um die Welt zu dominieren!',
    
    // Tutorial Navigation
    tutorialPrevious: '← Zurück',
    tutorialNext: 'Weiter →',
    tutorialFinish: 'Beenden',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← Zurück zum Gefecht',
    tutorialStartGame: '🎮 Spielen beginnen',
    
    // Lobby Screen
    lobbyTitle: '🎮 Globales Lobby',
    lobbySubtitle: 'Warten auf Spielerverbindungen...',
    lobbyTimerLabel: 'Verbleibende Zeit',
    lobbyPlayersTitle: 'Verbundene Spieler',
    lobbyStatusWaiting: 'Warten auf weitere Spieler...',
    lobbyStatusAllConnected: 'Alle Spieler verbunden! Spiel startet...',
    lobbyStatusCreating: 'Raum wird erstellt und Spiel startet...',
    lobbyStatusPlayers: '{connected}/{total} Spieler verbunden. Warten auf weitere Spieler...',
    lobbyFooter: 'Das Spiel startet automatisch in 30 Sekunden oder wenn alle Spieler verbunden sind',
    lobbyPlayerConnected: 'Verbunden',
    lobbyPlayerCPU: 'KI',
    
    // Game HUD
    playerStatsFormat: 'Truppen: {troops} | Verstärkung: {reinforcement}',
    gameInstructionsWaiting: 'Warten auf Spielstart...',
    btnObjective: 'Ziel',
    btnCards: 'Karten',
    btnTurn: 'Zug beenden',
    
    // Info Popups
    infoClose: 'Schließen',
    infoOk: 'OK',
    infoWarning: 'Warnung',
    infoMessage: 'Nachricht',
    
    // Victory Popup
    victoryTitle: '🏆 Sieg',
    victoryMessage: 'Glückwunsch! Du hast gewonnen!',
    victorySummaryTitle: '📊 Spielzusammenfassung',
    victoryPlayersTitle: '👥 Spielergebnisse',
    victoryObjectivesTitle: '🎯 Spielerziele',
    victoryBackToMenu: '🏠 Zum Menü zurück',
    
    // Ranking Popup
    rankingTitle: '🏆 Allgemeine Rangliste',
    rankingMessage: 'Diese Funktion wird bald implementiert!',
    rankingFeatures: 'Sie werden sehen können:',
    rankingFeature1: '🏅 Top-Spieler nach Siegen',
    rankingFeature2: '📊 Spielstatistiken',
    rankingFeature3: '🏆 Erfolge und Medaillen',
    rankingFeature4: '📈 Spielverlauf',
    rankingOk: 'Ich verstehe',
    
    // Stats Popup
    statsTitle: '📊 Meine Statistiken',
    statsMessage: 'Diese Funktion wird bald implementiert!',
    statsFeatures: 'Sie werden sehen können:',
    statsFeature1: '🎮 Gespielte Spiele insgesamt',
    statsFeature2: '📈 Gewinnrate',
    statsFeature3: '🗺️ Eroberte Gebiete',
    statsFeature4: '🏅 Freigeschaltete Erfolge',
    statsOk: 'Ich verstehe',
    
    // Objective Popup
    objectiveTitle: 'Spielziel',
    objectiveClose: 'Schließen',
    objectiveYourObjective: '🎯 Ihr Ziel',
    objectiveLoading: 'Laden...',
    objectiveHint: '💡 Tipp: Denken Sie während des gesamten Spiels an Ihr Ziel!',
    objectiveOk: '✅ Ich verstehe',
    
    // Cards Popup
    cardsTitle: 'Territoriumskarten',
    cardsClose: 'Schließen',
    cardsYourCards: '🎴 Ihre Territoriumskarten',
    cardsInstructions: 'Klicken Sie auf Karten zur Auswahl (Maximum 3)',
    cardsExchange: '🔄 Karten tauschen',
    
    // Game Interface
    troops: 'Truppen',
    reinforcement: 'Verstärkung',
    
    // Bonus Text
    bonus: 'Bonus',
    
    // Player Colors
    blue: 'Blau',
    red: 'Rot',
    green: 'Grün',
    yellow: 'Gelb',
    black: 'Schwarz',
    purple: 'Lila',
    
    // Game Objectives
    eliminateAllPlayers: 'Alle anderen Spieler eliminieren',
    conquerContinents: '{count} vollständige Kontinente erobern',
    conquerTerritories: '{count} Gebiete erobern',
    conquerSpecificContinents: '{continent1} und {continent2} erobern',
    conquerAnyContinents: '{continent1}, {continent2} und jeden anderen erobern',
    eliminateAllAdversaries: 'Alle Gegner eliminieren',
    noObjectives: 'Keine Ziele aufgezeichnet',
    
    // Reinforcement Popup
    reinforceTitle: 'Gebiet verstärken',
    reinforceClose: 'Schließen',
    reinforceTerritoryTroops: 'Truppen: {troops}',
    reinforceQuantityLabel: 'Menge hinzufügen',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ Bestätigen',
    reinforceCancel: '❌ Abbrechen',
    objective: 'Ziel',
    cards: 'Karten',
    endAttack: 'Angriff beenden',
    chat: 'Chat',
    selectTerritory: 'Wählen Sie ein Territorium aus, um Truppen zu verstärken',
    
    // Game Messages
    playerEliminated: 'Spieler {name} wurde eliminiert!',
    turnPassed: 'Jetzt ist Spieler {name} an der Reihe',
    gameOver: 'Spiel vorbei! Es gibt keine aktiven Spieler mehr.',
    territoryConquered: '{attacker} hat {territory} erobert',
    troopsMoved: '{player} hat {amount} Truppen von {origin} nach {destination} bewegt',
    
    // Victory/Defeat
    victory: 'Sieg!',
    defeat: 'Niederlage!',
    victoryByElimination: 'Sieg durch Eliminierung!',
    victoryByObjective: 'Sieg durch Ziel!',
    
    // Buttons
    ok: 'OK',
    cancel: 'Abbrechen',
    close: 'Schließen',
    confirm: 'Bestätigen',
    back: 'Zurück',
    
    // Status
    available: 'Verfügbar',
    unavailable: 'Nicht verfügbar',
    comingSoon: 'Demnächst',
    workInProgress: 'In Entwicklung',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: 'Warten auf Spielstart...',
    gameInstructionsVictory: '🎉 Glückwunsch! Du hast gewonnen!',
    gameInstructionsDefeat: '💀 Du hast das Spiel verloren!',
    gameInstructionsRemanejamento: '🔄 Wählen Sie Gebiete aus, um Truppen zu bewegen',
    gameInstructionsPlaceBonus: '🎯 Platzieren Sie {bonus} Bonus-Truppen auf dem Kontinent {continent}',
    gameInstructionsReinforce: '🎯 Wählen Sie ein Gebiet aus, um Truppen zu verstärken',
    gameInstructionsAttack: '⚔️ Wählen Sie eines Ihrer Gebiete und einen Feind zum Angriff',
    gameInstructionsGameOver: '🎉 Spiel beendet!',
    gameInstructionsWaitingPlayer: '⏳ Warten auf {player}...',
    gameInstructionsCPUPlaying: '🤖 {player} spielt...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ IHR ZUG HAT BEGONNEN!',
    turnConfirmWarning: 'Wenn Sie nicht bestätigen, wird Ihr Zug automatisch übersprungen.<br/>Nach {remaining} erzwungenen Überspringungen werden Sie getrennt.',
    turnConfirmTimerLabel: 'Verbleibende Zeit',
    turnConfirmButton: 'ZUG BESTÄTIGEN',
    
    // Turn Start Popup
    turnStartTitle: 'IHR ZUG!',
    turnStartMessage: 'Es ist Ihre Runde zu spielen! Sie sind {player}!',
    turnStartButton: 'OK',
    
    // Chat and History
    chatTab: '💬 Chat',
    historyTab: '📜 Verlauf',
    chatEmpty: 'Noch keine Nachrichten. Seien Sie der Erste, der chattet!',
    historyEmpty: 'Noch keine Aktionen aufgezeichnet.',
    chatInputPlaceholder: 'Geben Sie Ihre Nachricht ein...',
    chatSendButton: 'Senden',
    
    // Turn Buttons
    endTurnButton: 'Zug beenden',
    endAttackButton: 'Angriff beenden',
    
    // Player Cards and Game Summary
    finalResult: 'ENDERGEBNIS',
    winner: '🏆 GEWINNER',
    eliminated: '💀 ELIMINIERT',
    cpu: '🤖 KI',
    inactive: '❌ INAKTIV',
    active: '⚔️ AKTIV',
    victoryType: 'Siegtyp',
    totalElimination: 'Vollständige Eliminierung',
    objectiveComplete: 'Ziel erreicht',
    duration: 'Dauer',
    totalAttacks: 'Gesamte Angriffe',
    actionsSummary: 'ZUSAMMENFASSUNG DER HAUPTAKTIONEN',
    noImportantActions: 'Keine wichtigen Aktionen aufgezeichnet',
    
    // Player Cards Modal
    territories: 'Territorien:',
    troops: 'Truppen:',
    cards: 'Karten:',
    status: 'Status:',
    human: 'Mensch',
    won: 'Gewonnen',
    lost: 'Verloren',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    currentTurn: 'AKTUELLER ZUG'
  },
  ja: { // Japanese
    // Login Screen
    loginTitle: '開始するには名前を入力してください',
    usernameLabel: 'プレイヤー名',
    usernamePlaceholder: '名前を入力してください...',
    countryLabel: '国を選択してください:',
    continueButton: '続行',
    loginFooter: '接続して世界を支配しましょう！',
    discordJoin: '私たちのDiscordサーバーに参加しましょう！',
    discordButton: 'Discord',
    
    // Mode Selection
    modeSelectionTitle: 'モード選択',
    modeSelectionSubtitle: 'プレイ方法を選択してください',
    skirmishMode: 'スカーミッシュ',
    skirmishDescription: 'グローバルロビーからランダムプレイヤーとのクイックゲーム',
    dominiumMode: 'ドミニウム',
    dominiumDescription: 'キャンペーンと進行を伴う戦略モード',
    backToLogin: '← ログインに戻る',
    
    // Skirmish Mode
    skirmishTitle: 'スカーミッシュモード',
    skirmishSubtitle: '世界中のプレイヤーとの高速で激しいゲーム',
    startMatch: 'マッチ開始',
    startMatchDescription: 'グローバルロビーに参加して他のプレイヤーを待つ',
    rankingGeneral: '総合ランキング',
    rankingDescription: '最高のプレイヤーとその統計を見る',
    myStats: 'マイ統計',
    statsDescription: 'ゲーム履歴と実績を表示',
    tutorial: 'チュートリアル',
    tutorialDescription: 'ゲームのルールと戦略を学ぶ',
    backToModes: '← モードに戻る',
    
    // Tutorial Screen
    tutorialTitle: '📚 ゲームチュートリアル',
    tutorialSubtitle: '世界を支配するための基本的なルールと戦略を学びましょう！',
    
    // Tutorial Navigation
    tutorialPrevious: '← 前へ',
    tutorialNext: '次へ →',
    tutorialFinish: '完了',
    
    // Tutorial Actions
    tutorialBackToSkirmish: '← スカーミッシュに戻る',
    tutorialStartGame: '🎮 プレイ開始',
    
    // Lobby Screen
    lobbyTitle: '🎮 グローバルロビー',
    lobbySubtitle: 'プレイヤーの接続を待機中...',
    lobbyTimerLabel: '残り時間',
    lobbyPlayersTitle: '接続済みプレイヤー',
    lobbyStatusWaiting: '他のプレイヤーを待機中...',
    lobbyStatusAllConnected: '全プレイヤー接続済み！ゲーム開始...',
    lobbyStatusPlayers: '{connected}/{total} プレイヤー接続済み。他のプレイヤーを待機中...',
    lobbyFooter: 'ゲームは30秒後に自動開始、または全プレイヤー接続時に開始',
    lobbyPlayerConnected: '接続済み',
    lobbyPlayerCPU: 'CPU',
    
    // Game HUD
    playerStatsFormat: '部隊: {troops} | 増援: {reinforcement}',
    gameInstructionsWaiting: 'ゲーム開始を待機中...',
    btnObjective: '目標',
    btnCards: 'カード',
    btnTurn: 'ターン終了',
    
    // Info Popups
    infoClose: '閉じる',
    infoOk: 'OK',
    infoWarning: '警告',
    infoMessage: 'メッセージ',
    
    // Victory Popup
    victoryTitle: '🏆 勝利',
    victoryMessage: 'おめでとう！あなたの勝ちです！',
    victorySummaryTitle: '📊 ゲーム最終サマリー',
    victoryPlayersTitle: '👥 プレイヤー結果',
    victoryObjectivesTitle: '🎯 プレイヤー目標',
    victoryBackToMenu: '🏠 メニューに戻る',
    
    // Ranking Popup
    rankingTitle: '🏆 総合ランキング',
    rankingMessage: 'この機能は近日実装予定です！',
    rankingFeatures: '以下の内容が表示されます:',
    rankingFeature1: '🏅 勝利数によるトッププレイヤー',
    rankingFeature2: '📊 ゲーム統計',
    rankingFeature3: '🏆 実績とメダル',
    rankingFeature4: '📈 マッチ履歴',
    rankingOk: '理解しました',
    
    // Stats Popup
    statsTitle: '📊 マイ統計',
    statsMessage: 'この機能は近日実装予定です！',
    statsFeatures: '以下の内容が表示されます:',
    statsFeature1: '🎮 総プレイゲーム数',
    statsFeature2: '📈 勝率',
    statsFeature3: '🗺️ 征服した領土',
    statsFeature4: '🏅 アンロックした実績',
    statsOk: '理解しました',
    
    // Objective Popup
    objectiveTitle: 'ゲーム目標',
    objectiveClose: '閉じる',
    objectiveYourObjective: '🎯 あなたの目標',
    objectiveLoading: '読み込み中...',
    objectiveHint: '💡 ヒント：ゲーム全体を通して目標を覚えておきましょう！',
    objectiveOk: '✅ 理解しました',
    
    // Cards Popup
    cardsTitle: '領土カード',
    cardsClose: '閉じる',
    cardsYourCards: '🎴 あなたの領土カード',
    cardsInstructions: 'カードをクリックして選択（最大3枚）',
    cardsExchange: '🔄 カード交換',
    
    // Game Interface
    troops: '部隊',
    reinforcement: '増援',
    
    // Bonus Text
    bonus: 'ボーナス',
    
    // Player Colors
    blue: '青',
    red: '赤',
    green: '緑',
    yellow: '黄',
    black: '黒',
    purple: '紫',
    
    // Game Objectives
    eliminateAllPlayers: '他のすべてのプレイヤーを排除する',
    conquerContinents: '{count}個の完全な大陸を征服する',
    conquerTerritories: '{count}個の領土を征服する',
    conquerSpecificContinents: '{continent1}と{continent2}を征服する',
    conquerAnyContinents: '{continent1}、{continent2}とその他のいずれかを征服する',
    eliminateAllAdversaries: 'すべての敵を排除する',
    noObjectives: '記録された目標はありません',
    
    // Reinforcement Popup
    reinforceTitle: '領土を強化',
    reinforceClose: '閉じる',
    reinforceTerritoryTroops: '部隊: {troops}',
    reinforceQuantityLabel: '追加する数量',
    reinforceQuantity: '{current}/{max}',
    reinforceConfirm: '✅ 確認',
    reinforceCancel: '❌ キャンセル',
    objective: '目標',
    cards: 'カード',
    endAttack: '攻撃終了',
    chat: 'チャット',
    selectTerritory: '部隊を強化する領土を選択してください',
    
    // Game Messages
    playerEliminated: 'プレイヤー {name} が排除されました！',
    turnPassed: '今度はプレイヤー {name} の番です',
    gameOver: 'ゲーム終了！アクティブなプレイヤーはもういません。',
    territoryConquered: '{attacker} が {territory} を征服しました',
    troopsMoved: '{player} が {amount} 部隊を {origin} から {destination} に移動しました',
    
    // Victory/Defeat
    victory: '勝利！',
    defeat: '敗北！',
    victoryByElimination: '排除による勝利！',
    victoryByObjective: '目標による勝利！',
    
    // Buttons
    ok: 'OK',
    cancel: 'キャンセル',
    close: '閉じる',
    confirm: '確認',
    back: '戻る',
    
    // Status
    available: '利用可能',
    unavailable: '利用不可',
    comingSoon: '近日公開',
    workInProgress: '開発中',
    
    // Game Instructions (HUD)
    gameInstructionsWaiting: 'ゲーム開始を待機中...',
    gameInstructionsVictory: '🎉 おめでとう！あなたの勝ちです！',
    gameInstructionsDefeat: '💀 ゲームに負けました！',
    gameInstructionsRemanejamento: '🔄 部隊を移動するために領土を選択してください',
    gameInstructionsPlaceBonus: '🎯 大陸{continent}に{bonus}個のボーナス部隊を配置してください',
    gameInstructionsReinforce: '🎯 部隊を強化するために領土を選択してください',
    gameInstructionsAttack: '⚔️ 攻撃するためにあなたの領土の1つと敵を選択してください',
    gameInstructionsGameOver: '🎉 ゲーム終了！',
    gameInstructionsWaitingPlayer: '⏳ {player}を待機中...',
    gameInstructionsTurnIndicator: '🔄',
    gameInstructionsMyTurn: '⚔️',
    gameInstructionsNotMyTurn: '⏳',
    
    // Turn Confirmation Overlay
    turnConfirmTitle: '⚔️ あなたのターンが始まりました！',
    turnConfirmWarning: '確認しない場合、あなたのターンは自動的にスキップされます。<br/>{remaining}回の強制スキップ後、切断されます。',
    turnConfirmTimerLabel: '残り時間',
    turnConfirmButton: 'ターンを確認',
    
    // Turn Start Popup
    turnStartTitle: 'あなたのターン！',
    turnStartMessage: 'プレイする番です！あなたは{player}です！',
    turnStartButton: 'OK',
    
    // Chat and History
    chatTab: '💬 チャット',
    historyTab: '📜 履歴',
    chatEmpty: 'まだメッセージがありません。最初にチャットを始めましょう！',
    historyEmpty: 'まだ記録されたアクションがありません。',
    chatInputPlaceholder: 'メッセージを入力してください...',
    chatSendButton: '送信',
    
    // Turn Buttons
    endTurnButton: 'ターン終了',
    endAttackButton: '攻撃終了',
    
    // Player Cards and Game Summary
    finalResult: '最終結果',
    winner: '🏆 勝利者',
    eliminated: '💀 排除済み',
    cpu: '🤖 CPU',
    inactive: '❌ 非アクティブ',
    active: '⚔️ アクティブ',
    victoryType: '勝利タイプ',
    totalElimination: '完全排除',
    objectiveComplete: '目標完了',
    duration: '期間',
    totalAttacks: '総攻撃数',
    actionsSummary: '主要アクション要約',
    noImportantActions: '重要なアクションは記録されていません',
    
    // Player Cards Modal
    territories: '領土:',
    troops: '軍隊:',
    cards: 'カード:',
    status: 'ステータス:',
    human: '人間',
    won: '勝利',
    lost: '敗北',
    active: 'アクティブ',
    inactive: '非アクティブ',
    currentTurn: '現在のターン'
  }
};

// Language mapping based on country selection
const countryToLanguage = {
  'US': 'en', // United States -> English
  'BR': 'pt', // Brazil -> Portuguese
  'RU': 'ru', // Russia -> Russian
  'CN': 'zh', // China -> Chinese
  'IN': 'hi', // India -> Hindi
  'DE': 'de', // Germany -> German
  'JP': 'ja'  // Japan -> Japanese
};

// Translation functions
function getText(key, params = {}) {
  const lang = currentLanguage || 'en';
  const translations = gameTranslations[lang] || gameTranslations['en'];
  let text = translations[key] || key;
  
  // Replace parameters in the text
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
}

function updateLanguage(newLanguage) {
  if (currentLanguage === newLanguage) return;
  
  
  currentLanguage = newLanguage;
  
  // Update all UI elements
  updateAllUITexts();
}

function updateAllUITexts() {
  
  
  // Login Screen
  updateLoginScreenTexts();
  
  // Mode Selection Screen
  updateModeSelectionTexts();
  
  // Skirmish Mode Screen
  updateSkirmishModeTexts();
  
  // Tutorial Screen (if available)
  updateTutorialTexts();
  
  // Lobby Screen (if available)
  updateLobbyTexts();
  
  // Info Popups (always available)
  updateInfoPopupsTexts();
  
  // Victory Popup (if available)
  updateVictoryPopupTexts();
  
  // Game Popups (if available)
  updateGamePopupsTexts();
  
  // Ranking and Stats Popups (always available)
  updateRankingAndStatsPopupsTexts();
  
  // Turn Overlay (if available)
  updateTurnOverlayTexts();
  
  // Chat and History (if available)
  updateChatAndHistoryTexts();
  
  // Player Cards and Game Summary (if available)
  updatePlayerCardsAndSummaryTexts();
  
  // Player Colors (if available)
  updatePlayerColorsTexts();
  
  // Game Objectives (if available)
  updateGameObjectivesTexts();
  
  // Game Interface (if available)
  updateGameInterfaceTexts();
  
  
}

// Update specific screen texts
function updateLoginScreenTexts() {
  // Update login header
  const loginHeader = document.querySelector('.login-header p');
  if (loginHeader) {
    loginHeader.textContent = getText('loginTitle');
  }
  
  // Update username label
  const usernameLabel = document.querySelector('.input-group label[for="username"]');
  if (usernameLabel) {
    usernameLabel.textContent = getText('usernameLabel');
  }
  
  // Update username placeholder
  const usernameInput = document.getElementById('username');
  if (usernameInput) {
    usernameInput.placeholder = getText('usernamePlaceholder');
  }
  
  // Update country label
  const countryLabel = document.querySelector('.flag-selector-container label');
  if (countryLabel) {
    countryLabel.textContent = getText('countryLabel');
  }
  
  // Update continue button
  const continueButton = document.querySelector('.login-button span:last-child');
  if (continueButton) {
    continueButton.textContent = getText('continueButton');
  }
  
  // Update login footer
  const loginFooter = document.querySelector('.login-footer p');
  if (loginFooter) {
    loginFooter.textContent = getText('loginFooter');
  }
  
  // Update Discord link title
  const discordLink = document.getElementById('discord-link');
  if (discordLink) {
    discordLink.setAttribute('title', getText('discordJoin'));
  }
  
  // Update Discord button text
  const discordButtonText = document.getElementById('discord-button-text');
  if (discordButtonText) {
    discordButtonText.textContent = getText('discordButton');
  }
}

function updateModeSelectionTexts() {
  // Update mode selection header
  const modeHeader = document.querySelector('.mode-selection-header h1');
  if (modeHeader) {
    modeHeader.textContent = getText('modeSelectionTitle');
  }
  
  const modeSubtitle = document.querySelector('.mode-selection-header p');
  if (modeSubtitle) {
    modeSubtitle.textContent = getText('modeSelectionSubtitle');
  }
  
  // Update skirmish mode
  const skirmishTitle = document.querySelector('#mode-skirmish .mode-content h3');
  if (skirmishTitle) {
    skirmishTitle.textContent = getText('skirmishMode');
  }
  
  const skirmishDesc = document.querySelector('#mode-skirmish .mode-content p');
  if (skirmishDesc) {
    skirmishDesc.textContent = getText('skirmishDescription');
  }
  
  // Update dominium mode
  const dominiumTitle = document.querySelector('#mode-dominium .mode-content h3');
  if (dominiumTitle) {
    dominiumTitle.textContent = getText('dominiumMode');
  }
  
  const dominiumDesc = document.querySelector('#mode-dominium .mode-content p');
  if (dominiumDesc) {
    dominiumDesc.textContent = getText('dominiumDescription');
  }
  
  // Update back button
  const backButton = document.getElementById('back-to-login');
  if (backButton) {
    backButton.textContent = getText('backToLogin');
  }
  
  // Update status texts
  const skirmishStatus = document.querySelector('#mode-skirmish .mode-status');
  if (skirmishStatus) {
    skirmishStatus.textContent = getText('available');
  }
  
  const dominiumStatus = document.querySelector('#mode-dominium .mode-status');
  if (dominiumStatus) {
    dominiumStatus.textContent = getText('workInProgress');
  }
}

function updateSkirmishModeTexts() {
  // Update skirmish header
  const skirmishHeader = document.querySelector('.skirmish-mode-header h1');
  if (skirmishHeader) {
    skirmishHeader.textContent = getText('skirmishTitle');
  }
  
  const skirmishSubtitle = document.querySelector('.skirmish-mode-header p');
  if (skirmishSubtitle) {
    skirmishSubtitle.textContent = getText('skirmishSubtitle');
  }
  
  // Update start match
  const startMatchTitle = document.querySelector('#skirmish-start-match .skirmish-option-content h3');
  if (startMatchTitle) {
    startMatchTitle.textContent = getText('startMatch');
  }
  
  const startMatchDesc = document.querySelector('#skirmish-start-match .skirmish-option-content p');
  if (startMatchDesc) {
    startMatchDesc.textContent = getText('startMatchDescription');
  }
  
  // Update ranking
  const rankingTitle = document.querySelector('#skirmish-ranking .skirmish-option-content h3');
  if (rankingTitle) {
    rankingTitle.textContent = getText('rankingGeneral');
  }
  
  const rankingDesc = document.querySelector('#skirmish-ranking .skirmish-option-content p');
  if (rankingDesc) {
    rankingDesc.textContent = getText('rankingDescription');
  }
  
  // Update stats
  const statsTitle = document.querySelector('#skirmish-stats .skirmish-option-content h3');
  if (statsTitle) {
    statsTitle.textContent = getText('myStats');
  }
  
  const statsDesc = document.querySelector('#skirmish-stats .skirmish-option-content p');
  if (statsDesc) {
    statsDesc.textContent = getText('statsDescription');
  }
  
  // Update tutorial
  const tutorialTitle = document.querySelector('#skirmish-tutorial .skirmish-option-content h3');
  if (tutorialTitle) {
    tutorialTitle.textContent = getText('tutorial');
  }
  
  const tutorialDesc = document.querySelector('#skirmish-tutorial .skirmish-option-content p');
  if (tutorialDesc) {
    tutorialDesc.textContent = getText('tutorialDescription');
  }
  
  // Update back button
  const backToModes = document.getElementById('back-to-mode-selection');
  if (backToModes) {
    backToModes.textContent = getText('backToModes');
  }
  
  // Update status texts
  const startMatchStatus = document.querySelector('#skirmish-start-match .skirmish-option-status');
  if (startMatchStatus) {
    startMatchStatus.textContent = getText('available');
  }
  
  const rankingStatus = document.querySelector('#skirmish-ranking .skirmish-option-status');
  if (rankingStatus) {
    rankingStatus.textContent = getText('comingSoon');
  }
  
  const statsStatus = document.querySelector('#skirmish-stats .skirmish-option-status');
  if (statsStatus) {
    statsStatus.textContent = getText('comingSoon');
  }
  
  const tutorialStatus = document.querySelector('#skirmish-tutorial .skirmish-option-status');
  if (tutorialStatus) {
    tutorialStatus.textContent = getText('available');
  }
}
function updateTutorialTexts() {
  // Update tutorial header
  const tutorialHeader = document.querySelector('.tutorial-header h1');
  if (tutorialHeader) {
    tutorialHeader.textContent = getText('tutorialTitle');
  }
  
  const tutorialSubtitle = document.querySelector('.tutorial-header p');
  if (tutorialSubtitle) {
    tutorialSubtitle.textContent = getText('tutorialSubtitle');
  }
  
  // Update tutorial section 1
  const section1Title = document.querySelector('#tutorial-section-1 .tutorial-section-header h2');
  if (section1Title) {
    section1Title.textContent = getText('tutorialSection1Title');
  }
  
  const section1Content = document.querySelector('#tutorial-section-1 .tutorial-text p:first-child');
  if (section1Content) {
    section1Content.innerHTML = getText('tutorialSection1Content');
  }
  
  const section1List = document.querySelector('#tutorial-section-1 .tutorial-text ul');
  if (section1List) {
    section1List.innerHTML = `
      <li>${getText('tutorialSection1List1')}</li>
      <li>${getText('tutorialSection1List2')}</li>
      <li>${getText('tutorialSection1List3')}</li>
      <li>${getText('tutorialSection1List4')}</li>
    `;
  }
  
  // Update tutorial section 2
  const section2Title = document.querySelector('#tutorial-section-2 .tutorial-section-header h2');
  if (section2Title) {
    section2Title.textContent = getText('tutorialSection2Title');
  }
  
  const section2Content = document.querySelector('#tutorial-section-2 .tutorial-text p:first-child');
  if (section2Content) {
    section2Content.innerHTML = getText('tutorialSection2Content');
  }
  
  const section2List = document.querySelector('#tutorial-section-2 .tutorial-text ol');
  if (section2List) {
    section2List.innerHTML = `
      <li>${getText('tutorialSection2List1')}</li>
      <li>${getText('tutorialSection2List2')}</li>
      <li>${getText('tutorialSection2List3')}</li>
    `;
  }
  
  const section2Tip = document.querySelector('#tutorial-section-2 .tutorial-text p:last-child');
  if (section2Tip) {
    section2Tip.innerHTML = getText('tutorialSection2Tip');
  }
  
  // Update tutorial section 3
  const section3Title = document.querySelector('#tutorial-section-3 .tutorial-section-header h2');
  if (section3Title) {
    section3Title.textContent = getText('tutorialSection3Title');
  }
  
  const section3Content = document.querySelector('#tutorial-section-3 .tutorial-text p:first-child');
  if (section3Content) {
    section3Content.innerHTML = getText('tutorialSection3Content');
  }
  
  const section3List = document.querySelector('#tutorial-section-3 .tutorial-text ul');
  if (section3List) {
    section3List.innerHTML = `
      <li>${getText('tutorialSection3List1')}</li>
      <li>${getText('tutorialSection3List2')}</li>
      <li>${getText('tutorialSection3List3')}</li>
      <li>${getText('tutorialSection3List4')}</li>
    `;
  }
  
  const section3Tip = document.querySelector('#tutorial-section-3 .tutorial-text p:last-child');
  if (section3Tip) {
    section3Tip.innerHTML = getText('tutorialSection3Tip');
  }
  
  // Update tutorial section 4
  const section4Title = document.querySelector('#tutorial-section-4 .tutorial-section-header h2');
  if (section4Title) {
    section4Title.textContent = getText('tutorialSection4Title');
  }
  
  const section4Content = document.querySelector('#tutorial-section-4 .tutorial-text p:first-child');
  if (section4Content) {
    section4Content.innerHTML = getText('tutorialSection4Content');
  }
  
  const section4List = document.querySelector('#tutorial-section-4 .tutorial-text ul');
  if (section4List) {
    section4List.innerHTML = `
      <li>${getText('tutorialSection4List1')}</li>
      <li>${getText('tutorialSection4List2')}</li>
      <li>${getText('tutorialSection4List3')}</li>
      <li>${getText('tutorialSection4List4')}</li>
      <li>${getText('tutorialSection4List5')}</li>
    `;
  }
  
  // Update tutorial section 5
  const section5Title = document.querySelector('#tutorial-section-5 .tutorial-section-header h2');
  if (section5Title) {
    section5Title.textContent = getText('tutorialSection5Title');
  }
  
  const section5Content = document.querySelector('#tutorial-section-5 .tutorial-text p:first-child');
  if (section5Content) {
    section5Content.innerHTML = getText('tutorialSection5Content');
  }
  
  const section5List = document.querySelector('#tutorial-section-5 .tutorial-text ul');
  if (section5List) {
    section5List.innerHTML = `
      <li>${getText('tutorialSection5List1')}</li>
      <li>${getText('tutorialSection5List2')}</li>
      <li>${getText('tutorialSection5List3')}</li>
      <li>${getText('tutorialSection5List4')}</li>
      <li>${getText('tutorialSection5List5')}</li>
    `;
  }
  
  // Update tutorial section 6
  const section6Title = document.querySelector('#tutorial-section-6 .tutorial-section-header h2');
  if (section6Title) {
    section6Title.textContent = getText('tutorialSection6Title');
  }
  
  const section6Content = document.querySelector('#tutorial-section-6 .tutorial-text p:first-child');
  if (section6Content) {
    section6Content.innerHTML = getText('tutorialSection6Content');
  }
  
  const section6List = document.querySelector('#tutorial-section-6 .tutorial-text ul');
  if (section6List) {
    section6List.innerHTML = `
      <li>${getText('tutorialSection6List1')}</li>
      <li>${getText('tutorialSection6List2')}</li>
      <li>${getText('tutorialSection6List3')}</li>
      <li>${getText('tutorialSection6List4')}</li>
    `;
  }
  
  const section6Tip = document.querySelector('#tutorial-section-6 .tutorial-text p:last-child');
  if (section6Tip) {
    section6Tip.innerHTML = getText('tutorialSection6Tip');
  }
  
  // Update navigation buttons
  const prevBtn = document.getElementById('tutorial-prev');
  if (prevBtn) {
    prevBtn.textContent = getText('tutorialPrevious');
  }
  
  const nextBtn = document.getElementById('tutorial-next');
  if (nextBtn) {
    nextBtn.textContent = getText('tutorialNext');
  }
  
  // Update action buttons
  const backBtn = document.getElementById('tutorial-back');
  if (backBtn) {
    backBtn.textContent = getText('tutorialBackToSkirmish');
  }
  
  const startGameBtn = document.getElementById('tutorial-start-game');
  if (startGameBtn) {
    startGameBtn.textContent = getText('tutorialStartGame');
  }
}

function updateLobbyTexts() {
  // Update lobby header
  const lobbyHeader = document.querySelector('.lobby-header h1');
  if (lobbyHeader) {
    lobbyHeader.textContent = getText('lobbyTitle');
  }
  
  const lobbySubtitle = document.querySelector('.lobby-header p');
  if (lobbySubtitle) {
    lobbySubtitle.textContent = getText('lobbySubtitle');
  }
  
  // Update lobby timer label
  const lobbyTimerLabel = document.querySelector('.lobby-timer-label');
  if (lobbyTimerLabel) {
    lobbyTimerLabel.textContent = getText('lobbyTimerLabel');
  }
  
  // Update lobby players title
  const lobbyPlayersTitle = document.querySelector('.lobby-players-title');
  if (lobbyPlayersTitle) {
    lobbyPlayersTitle.textContent = getText('lobbyPlayersTitle');
  }
  
  // Update lobby footer
  const lobbyFooter = document.querySelector('.lobby-footer p');
  if (lobbyFooter) {
    lobbyFooter.textContent = getText('lobbyFooter');
  }
  
  // Update game HUD elements
  updateGameHUDTexts();
}

function updateGameHUDTexts() {
  // Update player stats format (this will be used when updating stats)
  // The actual stats update happens in updateCSSHUD() function
  
  // Update game instructions
  const instructionText = document.getElementById('instruction-text');
  if (instructionText) {
    instructionText.textContent = getText('gameInstructionsWaiting');
  }
  
  // Update HUD buttons
  const btnObjective = document.getElementById('btn-objective');
  if (btnObjective) {
    const span = btnObjective.querySelector('span:last-child');
    if (span) {
      span.textContent = getText('btnObjective');
    }
  }
  
  const btnCards = document.getElementById('btn-cards');
  if (btnCards) {
    const span = btnCards.querySelector('span:last-child');
    if (span) {
      span.textContent = getText('btnCards');
    }
  }
  
  const btnTurn = document.getElementById('btn-turn');
  if (btnTurn) {
    const span = btnTurn.querySelector('span:last-child');
    if (span) {
      span.textContent = getText('btnTurn');
    }
  }
}

function updateInfoPopupsTexts() {
  // Update all info popup elements
  const infoCloseButtons = document.querySelectorAll('.info-close');
  const infoOkButtons = document.querySelectorAll('.info-ok');
  
  // Update close buttons
  infoCloseButtons.forEach(btn => {
    btn.setAttribute('aria-label', getText('infoClose'));
  });
  
  // Update OK buttons
  infoOkButtons.forEach(btn => {
    btn.textContent = getText('infoOk');
  });
  
  // Update specific popup titles and messages
  updateModeInfoPopupTexts();
  updateServerErrorPopupTexts();
  updateLoginErrorPopupTexts();
  updateDominiumDevPopupTexts();
}

function updateModeInfoPopupTexts() {
  const title = document.getElementById('mode-info-title');
  if (title) {
    title.textContent = getText('modeInfoTitle');
  }
}

function updateServerErrorPopupTexts() {
  const title = document.getElementById('server-error-title');
  const message = document.getElementById('server-error-message');
  const retryBtn = document.getElementById('server-error-ok');
  
  if (title) {
    title.textContent = getText('serverErrorTitle');
  }
  
  if (message) {
    message.textContent = getText('serverErrorMessage');
  }
  
  if (retryBtn) {
    retryBtn.textContent = getText('serverErrorRetry');
  }
}

function updateLoginErrorPopupTexts() {
  const title = document.getElementById('login-error-title');
  if (title) {
    title.textContent = getText('loginErrorTitle');
  }
}

function updateDominiumDevPopupTexts() {
  const title = document.getElementById('dominium-dev-title');
  const message = document.getElementById('dominium-dev-message');
  const okBtn = document.getElementById('dominium-dev-ok');
  
  if (title) {
    title.textContent = getText('dominiumDevTitle');
  }
  
  if (message) {
    message.textContent = getText('dominiumDevMessage');
  }
  
  if (okBtn) {
    okBtn.textContent = getText('dominiumDevOk');
  }
}

function updateVictoryPopupTexts() {
  const title = document.querySelector('.victory-header h3');
  const message = document.getElementById('victory-message');
  const summaryTitle = document.querySelector('.summary-title');
  const playersTitle = document.querySelector('.players-title');
  const objectivesTitle = document.querySelector('.objectives-title');
  const backToMenuBtn = document.getElementById('victory-menu');
  
  if (title) {
    title.textContent = getText('victoryTitle');
  }
  
  if (message) {
    message.textContent = getText('victoryMessage');
  }
  
  if (summaryTitle) {
    summaryTitle.textContent = getText('victorySummaryTitle');
  }
  
  if (playersTitle) {
    playersTitle.textContent = getText('victoryPlayersTitle');
  }
  
  if (objectivesTitle) {
    objectivesTitle.textContent = getText('victoryObjectivesTitle');
  }
  
  if (backToMenuBtn) {
    backToMenuBtn.textContent = getText('victoryBackToMenu');
  }
  
  // Update game statistics labels
  updateGameStatisticsTexts();
}

function updateGameStatisticsTexts() {
  const durationLabel = document.querySelector('.stat-item:nth-child(1) .stat-label');
  const attacksLabel = document.querySelector('.stat-item:nth-child(2) .stat-label');
  const continentsLabel = document.querySelector('.stat-item:nth-child(3) .stat-label');
  
  if (durationLabel) {
    durationLabel.textContent = getText('gameDuration');
  }
  
  if (attacksLabel) {
    attacksLabel.textContent = getText('totalAttacks');
  }
  
  if (continentsLabel) {
    continentsLabel.textContent = getText('continentsInDispute');
  }
}
function updateGamePopupsTexts() {
  // Update reinforcement popup
  const reinforceTitle = document.getElementById('reinforce-title');
  const reinforceClose = document.getElementById('reinforce-close');
  const reinforceTerritoryTroops = document.getElementById('reinforce-territory-troops');
  const reinforceQuantityLabel = document.querySelector('.reinforce-label');
  const reinforceQuantity = document.getElementById('reinforce-qty');
  const reinforceConfirm = document.getElementById('reinforce-confirm');
  const reinforceCancel = document.getElementById('reinforce-cancel');
  
  if (reinforceTitle) {
    reinforceTitle.textContent = getText('reinforceTitle');
  }
  
  if (reinforceClose) {
    reinforceClose.textContent = getText('reinforceClose');
  }
  
  if (reinforceQuantityLabel) {
    reinforceQuantityLabel.textContent = getText('reinforceQuantityLabel');
  }
  
  if (reinforceConfirm) {
    reinforceConfirm.textContent = getText('reinforceConfirm');
  }
  
  if (reinforceCancel) {
    reinforceCancel.textContent = getText('reinforceCancel');
  }
  
  // Update reinforcement territory troops if available
  if (reinforceTerritoryTroops) {
    const currentTroops = reinforceTerritoryTroops.textContent.match(/\d+/);
    if (currentTroops) {
      reinforceTerritoryTroops.textContent = getText('reinforceTerritoryTroops', { troops: currentTroops[0] });
    }
  }
  
  // Update transfer popup
  const transferTitle = document.querySelector('.transfer-header .transfer-title');
  const transferClose = document.getElementById('transfer-close');
  const transferQuantityLabel = document.querySelector('.transfer-label');
  const transferConfirm = document.getElementById('transfer-confirm');
  const transferCancel = document.getElementById('transfer-cancel');
  
  if (transferTitle) {
    transferTitle.textContent = getText('transferTitle');
  }
  
  if (transferClose) {
    transferClose.textContent = getText('transferClose');
  }
  
  if (transferQuantityLabel) {
    transferQuantityLabel.textContent = getText('transferQuantityLabel');
  }
  
  if (transferConfirm) {
    transferConfirm.textContent = getText('transferConfirm');
  }
  
  if (transferCancel) {
    transferCancel.textContent = getText('transferCancel');
  }
  
  // Update transfer troops if available
  const transferOriginTroops = document.getElementById('transfer-origem-tropas');
  const transferDestinationTroops = document.getElementById('transfer-destino-tropas');
  
  if (transferOriginTroops) {
    const currentTroops = transferOriginTroops.textContent.match(/\d+/);
    if (currentTroops) {
      transferOriginTroops.textContent = getText('transferOriginTroops', { troops: currentTroops[0] });
    }
  }
  
  if (transferDestinationTroops) {
    const currentTroops = transferDestinationTroops.textContent.match(/\d+/);
    if (currentTroops) {
      transferDestinationTroops.textContent = getText('transferDestinationTroops', { troops: currentTroops[0] });
    }
  }
  
  // Update cards popup
  const cardsTitle = document.querySelector('#cards-popup .cards-header h3');
  const cardsClose = document.getElementById('cards-close');
  const cardsInstructions = document.getElementById('cards-instructions');
  const cardsExchange = document.getElementById('cards-exchange');
  
  if (cardsTitle) {
    cardsTitle.textContent = getText('cardsYourCards');
  }
  
  if (cardsClose) {
    cardsClose.textContent = getText('cardsClose');
  }
  
  if (cardsInstructions) {
    cardsInstructions.textContent = getText('cardsInstructions');
  }
  
  if (cardsExchange) {
    cardsExchange.textContent = getText('cardsExchange');
  }
  
  // Update objective popup
  const objectiveTitle = document.querySelector('#objective-popup .objective-header h3');
  const objectiveClose = document.getElementById('objective-close');
  const objectiveDescription = document.getElementById('objective-description');
  const objectiveHint = document.querySelector('.objective-hint');
  const objectiveOk = document.getElementById('objective-ok');
  
  if (objectiveTitle) {
    objectiveTitle.textContent = getText('objectiveYourObjective');
  }
  
  if (objectiveClose) {
    objectiveClose.textContent = getText('objectiveClose');
  }
  
  if (objectiveHint) {
    objectiveHint.textContent = getText('objectiveHint');
  }
  
  if (objectiveOk) {
    objectiveOk.textContent = getText('objectiveOk');
  }
  
  // Update remanejamento popup
  const remanejamentoTitle = document.querySelector('#remanejamento-popup .remanejamento-header .remanejamento-title');
  const remanejamentoClose = document.getElementById('remanejamento-close');
  const remanejamentoQuantityLabel = document.querySelector('.remanejamento-label');
  const remanejamentoConfirm = document.getElementById('remanejamento-confirm');
  const remanejamentoCancel = document.getElementById('remanejamento-cancel');
  
  if (remanejamentoTitle) {
    remanejamentoTitle.textContent = getText('remanejamentoTitle');
  }
  
  if (remanejamentoClose) {
    remanejamentoClose.textContent = getText('remanejamentoClose');
  }
  
  if (remanejamentoQuantityLabel) {
    remanejamentoQuantityLabel.textContent = getText('remanejamentoQuantityLabel');
  }
  
  if (remanejamentoConfirm) {
    remanejamentoConfirm.textContent = getText('remanejamentoConfirm');
  }
  
  if (remanejamentoCancel) {
    remanejamentoCancel.textContent = getText('remanejamentoCancel');
  }
  
  // Update remanejamento troops if available
  const remanejamentoOriginTroops = document.getElementById('remanejamento-origem-tropas');
  const remanejamentoDestinationTroops = document.getElementById('remanejamento-destino-tropas');
  
  if (remanejamentoOriginTroops) {
    const currentTroops = remanejamentoOriginTroops.textContent.match(/\d+/);
    if (currentTroops) {
      remanejamentoOriginTroops.textContent = getText('remanejamentoOriginTroops', { troops: currentTroops[0] });
    }
  }
  
  if (remanejamentoDestinationTroops) {
    const currentTroops = remanejamentoDestinationTroops.textContent.match(/\d+/);
    if (currentTroops) {
      remanejamentoDestinationTroops.textContent = getText('remanejamentoDestinationTroops', { troops: currentTroops[0] });
    }
  }
}

function updateRankingAndStatsPopupsTexts() {
  // Update Ranking Popup
  const rankingTitle = document.querySelector('#ranking-popup h3');
  const rankingMessage = document.querySelector('#ranking-popup .ranking-message p:first-child');
  const rankingFeatures = document.querySelector('#ranking-popup .ranking-message p:nth-child(2)');
  const rankingFeature1 = document.querySelector('#ranking-popup .ranking-message li:nth-child(1)');
  const rankingFeature2 = document.querySelector('#ranking-popup .ranking-message li:nth-child(2)');
  const rankingFeature3 = document.querySelector('#ranking-popup .ranking-message li:nth-child(3)');
  const rankingFeature4 = document.querySelector('#ranking-popup .ranking-message li:nth-child(4)');
  const rankingOk = document.getElementById('ranking-ok');
  
  if (rankingTitle) {
    rankingTitle.textContent = getText('rankingTitle');
  }
  
  if (rankingMessage) {
    rankingMessage.textContent = getText('rankingMessage');
  }
  
  if (rankingFeatures) {
    rankingFeatures.textContent = getText('rankingFeatures');
  }
  
  if (rankingFeature1) {
    rankingFeature1.textContent = getText('rankingFeature1');
  }
  
  if (rankingFeature2) {
    rankingFeature2.textContent = getText('rankingFeature2');
  }
  
  if (rankingFeature3) {
    rankingFeature3.textContent = getText('rankingFeature3');
  }
  
  if (rankingFeature4) {
    rankingFeature4.textContent = getText('rankingFeature4');
  }
  
  if (rankingOk) {
    rankingOk.textContent = getText('rankingOk');
  }
  
  // Update Stats Popup
  const statsTitle = document.querySelector('#stats-popup h3');
  const statsMessage = document.querySelector('#stats-popup .stats-message p:first-child');
  const statsFeatures = document.querySelector('#stats-popup .stats-message p:nth-child(2)');
  const statsFeature1 = document.querySelector('#stats-popup .stats-message li:nth-child(1)');
  const statsFeature2 = document.querySelector('#stats-popup .stats-message li:nth-child(2)');
  const statsFeature3 = document.querySelector('#stats-popup .stats-message li:nth-child(3)');
  const statsFeature4 = document.querySelector('#stats-popup .stats-message li:nth-child(4)');
  const statsOk = document.getElementById('stats-ok');
  
  if (statsTitle) {
    statsTitle.textContent = getText('statsTitle');
  }
  
  if (statsMessage) {
    statsMessage.textContent = getText('statsMessage');
  }
  
  if (statsFeatures) {
    statsFeatures.textContent = getText('statsFeatures');
  }
  
  if (statsFeature1) {
    statsFeature1.textContent = getText('statsFeature1');
  }
  
  if (statsFeature2) {
    statsFeature2.textContent = getText('statsFeature2');
  }
  
  if (statsFeature3) {
    statsFeature3.textContent = getText('statsFeature3');
  }
  
  if (statsFeature4) {
    statsFeature4.textContent = getText('statsFeature4');
  }
  
  if (statsOk) {
    statsOk.textContent = getText('statsOk');
  }
}

function updateTurnOverlayTexts() {
  // This function will be called when the turn confirmation overlay is created
  // The texts are created dynamically in showTurnConfirmationPopup()
  // We need to update them when the language changes
  
  // Update turn confirmation overlay if it exists
  const turnConfirmTitle = document.querySelector('.turn-confirm-title');
  const turnConfirmWarning = document.querySelector('.turn-confirm-warning');
  const turnConfirmTimerLabel = document.querySelector('.turn-timer-label');
  const turnConfirmButton = document.getElementById('turn-confirm-btn');
  
  if (turnConfirmTitle) {
    turnConfirmTitle.textContent = getText('turnConfirmTitle');
  }
  
  if (turnConfirmWarning) {
    const remaining = maxForcedTurns - forcedTurnCount;
    turnConfirmWarning.innerHTML = getText('turnConfirmWarning', { remaining });
  }
  
  if (turnConfirmTimerLabel) {
    turnConfirmTimerLabel.textContent = getText('turnConfirmTimerLabel');
  }
  
  if (turnConfirmButton) {
    turnConfirmButton.textContent = getText('turnConfirmButton');
  }
}

function updateChatAndHistoryTexts() {
  // Update chat and history popup texts if available
  
  // Update chat tab
  const chatTab = document.getElementById('chat-tab');
  if (chatTab) {
    chatTab.textContent = getText('chatTab');
  }
  
  // Update history tab
  const historyTab = document.getElementById('history-tab');
  if (historyTab) {
    historyTab.textContent = getText('historyTab');
  }
  
  // Update chat empty message
  const chatEmpty = document.querySelector('.chat-empty');
  if (chatEmpty) {
    chatEmpty.textContent = getText('chatEmpty');
  }
  
  // Update history empty message
  const historyEmpty = document.querySelector('.history-empty');
  if (historyEmpty) {
    historyEmpty.textContent = getText('historyEmpty');
  }
  
  // Update chat input placeholder
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.placeholder = getText('chatInputPlaceholder');
  }
  
  // Update chat send button
  const chatSendBtn = document.getElementById('chat-send-btn');
  if (chatSendBtn) {
    chatSendBtn.textContent = getText('chatSendButton');
  }
  
  // Update HUD button text
  const historyButton = document.getElementById('btn-history');
  if (historyButton) {
    const span = historyButton.querySelector('span:last-child');
    if (span) {
      span.textContent = getText('chatTab').replace('💬 ', '');
    }
  }
  
  
}

function updatePlayerCardsAndSummaryTexts() {
  // Update player cards modal texts if available
  
  // Update player stats labels in the modal
  const territoryLabels = document.querySelectorAll('.stat-label');
  territoryLabels.forEach(label => {
    if (label.textContent.includes('Territórios:')) {
      label.textContent = getText('territories');
    } else if (label.textContent.includes('Tropas:')) {
      label.textContent = getText('troops');
    } else if (label.textContent.includes('Cartas:')) {
      label.textContent = getText('cards');
    } else if (label.textContent.includes('Status:')) {
      label.textContent = getText('status');
    }
  });
  
  // Update player stat labels in the victory screen
  const playerStatLabels = document.querySelectorAll('.player-stat-label');
  playerStatLabels.forEach(label => {
    if (label.textContent.includes('Territórios')) {
      label.textContent = `🗺️ ${getText('territories')}`;
    } else if (label.textContent.includes('Tropas')) {
      label.textContent = `⚔️ ${getText('troops')}`;
    }
  });
  
  // Update player stat values
  const playerStatValues = document.querySelectorAll('.player-stat-value');
  playerStatValues.forEach(value => {
    if (value.textContent === 'Humano') {
      value.textContent = getText('human');
    } else if (value.textContent === 'CPU') {
      value.textContent = getText('cpu');
    } else if (value.textContent === 'Venceu') {
      value.textContent = getText('won');
    } else if (value.textContent === 'Perdeu') {
      value.textContent = getText('lost');
    } else if (value.textContent === 'Ativo') {
      value.textContent = getText('active');
    } else if (value.textContent === 'Inativo') {
      value.textContent = getText('inactive');
    }
  });
  
  // Update turn badge
  const turnBadges = document.querySelectorAll('.turn-badge');
  turnBadges.forEach(badge => {
    if (badge.textContent === 'TURNO ATUAL') {
      badge.textContent = getText('currentTurn');
    }
  });
  
  
}

function updatePlayerColorsTexts() {
  // This function will update player color names when the language changes
  // Since player colors are used in various messages and displays,
  // we need to ensure they are properly translated
  
  // Note: The main translation happens in the getTranslatedPlayerColor function
  // This function serves as a placeholder for future enhancements
  
  
  
  // The actual translation happens dynamically when getTranslatedPlayerColor is called
  // This ensures that all player color references use the correct language
}

// Função para atualizar textos relacionados aos objetivos do jogo
function updateGameObjectivesTexts() {
  
  
  // Atualizar a lista de objetivos se estiver visível
  const objectivesList = document.getElementById('objectives-list');
  if (objectivesList && objectivesList.children.length > 0) {
    // Recarregar a lista de objetivos com o novo idioma
    const gameState = getGameState();
    if (gameState) {
      updatePlayerInfoPanel();
    }
  }
}

// Função para traduzir nomes de cores em mensagens
function translatePlayerColorsInMessage(texto) {
  if (!texto || typeof texto !== 'string') return texto;
  
  // Mapear nomes de cores em português para tradução
  const colorTranslationMap = {
    'Azul': 'blue',
    'Vermelho': 'red',
    'Verde': 'green',
    'Amarelo': 'yellow',
    'Preto': 'black',
    'Roxo': 'purple'
  };
  
  let textoTraduzido = texto;
  
  // Substituir nomes de cores por suas traduções
  for (const [colorName, translationKey] of Object.entries(colorTranslationMap)) {
    if (textoTraduzido.includes(colorName)) {
      textoTraduzido = textoTraduzido.replace(new RegExp(colorName, 'g'), getText(translationKey));
    }
  }
  
  return textoTraduzido;
}

function updateGameInterfaceTexts() {
  // This function will be called when the game interface is available
  // Update HUD texts when game interface is available
  updateGameHUDTexts();
  
  // Update turn button texts
  atualizarTextoBotaoTurno();
  
  
}

// Função auxiliar para obter o nome de usuário real a partir do nome da cor
function getRealUsername(colorName) {
  // Primeiro, tentar encontrar o jogador no gameState para obter o nomeReal
  const gameState = getGameState();
  if (gameState && gameState.jogadores) {
    const jogador = gameState.jogadores.find(j => j.nome === colorName);
    if (jogador && jogador.nomeReal) {
      return jogador.nomeReal;
    }
  }
  
  // Fallback para o mapeamento antigo
  const mappedName = playerColorToUsernameMap[colorName];
  if (mappedName) {
    return mappedName;
  }
  
  // Se não há mapeamento, traduzir o nome da cor
  return getTranslatedPlayerColor(colorName);
}

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
let turnConfirmationPopup = null; // legacy (Phaser) - kept for compatibility
let turnConfirmationTimeout = null;
let turnConfirmationTimeLeft = 30; // 30 seconds to confirm turn
let turnConfirmationInterval = null;
let turnConfirmOverlayEl = null; // HTML overlay root
let forcedTurnCount = 0; // Count of forced turns for this player
let maxForcedTurns = 2; // Maximum allowed forced turns before disconnect
let lastTurnForPlayer = null; // Track the last turn that was this player's turn
let lastProcessedTurn = null; // Track the last turn that was processed for popup

// Debug function to log forced turn count
function logForcedTurnCount() {
  
}

// Initialize login system
document.addEventListener('DOMContentLoaded', function() {
  
  
  // Aguardar um pouco para garantir que todos os elementos estejam prontos
  setTimeout(() => {
    initializeLoginSystem();
  }, 100);
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
  
  // Initialize flag selector
  initializeFlagSelector();
}

// Flag Selector System
function initializeFlagSelector() {
  
  
  // Define available countries with native names
  window.availableCountries = [
    { code: 'US', name: 'United States', nativeName: 'United States', flag: '🇺🇸' },
    { code: 'BR', name: 'Brazil', nativeName: 'Brasil', flag: '🇧🇷' },
    { code: 'RU', name: 'Russia', nativeName: 'Россия', flag: '🇷🇺' },
    { code: 'CN', name: 'China', nativeName: '中国', flag: '🇨🇳' },
    { code: 'IN', name: 'India', nativeName: 'भारत', flag: '🇮🇳' },
    { code: 'DE', name: 'Germany', nativeName: 'Deutschland', flag: '🇩🇪' },
    { code: 'JP', name: 'Japan', nativeName: '日本', flag: '🇯🇵' }
  ];
  
  
  
  // Set initial country (US)
  window.currentCountryIndex = 0;
  
  // Set initial language based on default country
  const defaultCountry = window.availableCountries[0];
  const defaultLanguage = countryToLanguage[defaultCountry.code];
  if (defaultLanguage && defaultLanguage !== currentLanguage) {
    
    updateLanguage(defaultLanguage);
  }
  
  // Get DOM elements
  const prevBtn = document.getElementById('flag-prev');
  const nextBtn = document.getElementById('flag-next');
  const flagEmoji = document.getElementById('current-flag');
  const flagName = document.getElementById('current-flag-name');
  const hiddenInput = document.getElementById('selected-country');

  
  if (prevBtn && nextBtn && flagEmoji && flagName && hiddenInput) {
    // Set initial values
    
    updateFlagDisplay();
    
    // Add event listeners
    prevBtn.addEventListener('click', () => {
      
      navigateFlag(-1);
    });
    
    nextBtn.addEventListener('click', () => {
      
      navigateFlag(1);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        
        navigateFlag(-1);
      } else if (e.key === 'ArrowRight') {
        
        navigateFlag(1);
      }
    });
    
    
    
    // Atualizar todos os textos da interface na inicialização
    updateAllUITexts();
  } else {
    
  }
}

function navigateFlag(direction) {
  
  
  if (!window.availableCountries || window.currentCountryIndex === undefined) {
    
    return;
  }
  
  // Calculate new index
  let newIndex = window.currentCountryIndex + direction;
  
  
  // Handle wrap-around
  if (newIndex < 0) {
    newIndex = window.availableCountries.length - 1;
    
  } else if (newIndex >= window.availableCountries.length) {
    newIndex = 0;
    
  }
  
  // Update current index
  window.currentCountryIndex = newIndex;
  
  
  // Update display
  updateFlagDisplay();
  
  // Update language based on new country
  const country = window.availableCountries[window.currentCountryIndex];
  const newLanguage = countryToLanguage[country.code];
  
  if (newLanguage && newLanguage !== currentLanguage) {
    
    updateLanguage(newLanguage);
    
    // Atualizar o display da bandeira novamente para mostrar o nome no idioma correto
    setTimeout(() => {
      updateFlagDisplay();
    }, 100);
  }
  
  // Log the change
  
}

function updateFlagDisplay() {
  
  
  if (!window.availableCountries || window.currentCountryIndex === undefined) {
    
    return;
  }
  
  const country = window.availableCountries[window.currentCountryIndex];
  
  
  const flagEmoji = document.getElementById('current-flag');
  const flagName = document.getElementById('current-flag-name');
  const hiddenInput = document.getElementById('selected-country');

  
  if (flagEmoji && flagName && hiddenInput) {
    // Determinar qual nome mostrar baseado no idioma atual
    let displayName = country.name; // Nome em inglês por padrão
    
    // Se o idioma atual corresponde ao país, mostrar o nome nativo
    const currentCountryLanguage = countryToLanguage[country.code];
    if (currentCountryLanguage === currentLanguage) {
      displayName = country.nativeName;
    }
    
    
    
    flagEmoji.textContent = country.flag;
    flagName.textContent = displayName;
    hiddenInput.value = country.code;
    
    // Add animation effect
    flagEmoji.style.transform = 'scale(1.1)';
    setTimeout(() => {
      flagEmoji.style.transform = 'scale(1)';
    }, 150);
    
    
  } else {
    
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

// Function to update client timer based on server data
function updateClientTimer(data) {
  const timerDisplay = document.getElementById('timer-display');
  const globalTimer = document.getElementById('global-turn-timer');
  
  if (!data.active || data.timeLeft <= 0) {
    // Hide timer when inactive or expired
    if (globalTimer) {
      globalTimer.style.display = 'none';
    }
    stopTurnTimer();
    return;
  }
  
  // Update local timer state
  turnTimeLeft = data.timeLeft;
  isPlayerTurn = false; // Server controls the timer now
  
  // Update display
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
  
  // Handle clock ticking sound for last 10 seconds (only for current player)
  const gameState = getGameState();
  const isMyTurn = gameState && gameState.meuNome === gameState.turno;
  
  if (turnTimeLeft <= 10 && turnTimeLeft > 0 && isMyTurn) {
    if (!isClockTickingPlaying) {
      tocarSomClockTicking();
      isClockTickingPlaying = true;
    }
  } else {
    isClockTickingPlaying = false;
  }
  
  // Show timer for all players
  if (globalTimer) {
    globalTimer.style.display = 'flex';
  }
}

// Legacy function for compatibility
function updateTimerDisplay() {
  updateGlobalTimerDisplay();
}

// Turn Confirmation Popup Functions
function showTurnConfirmationPopup(scene) {
  
  
  
  
  
  // Hide any existing popup
  hideTurnConfirmationPopup();

  // Reset confirmation time
  turnConfirmationTimeLeft = 30;

  // Build HTML overlay
  const overlay = document.getElementById('turn-confirm-overlay');
  if (!overlay) return;
  turnConfirmOverlayEl = overlay;
  
  const remaining = maxForcedTurns - forcedTurnCount;
  overlay.innerHTML = `
    <div class="turn-confirm-modal show" id="turn-confirm-modal">
      <div class="turn-confirm-header">
        <span>⚔️</span>
        <span class="turn-confirm-title">${getText('turnConfirmTitle')}</span>
      </div>
      <div class="turn-confirm-body">
        <div class="turn-confirm-warning">${getText('turnConfirmWarning', { remaining })}</div>
        <div class="turn-timer-label">${getText('turnConfirmTimerLabel')}</div>
        <div class="turn-timer-box" id="turn-timer-text">${turnConfirmationTimeLeft}s</div>
      </div>
      <div class="turn-confirm-actions">
        <button class="turn-confirm-btn" id="turn-confirm-btn">${getText('turnConfirmButton')}</button>
      </div>
    </div>
  `;
  overlay.style.display = 'flex';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '999999';
  // trigger animation
  requestAnimationFrame(() => {
    const modal = document.getElementById('turn-confirm-modal');
    if (modal) modal.classList.add('show');
  });

  // Wire button
  const btn = document.getElementById('turn-confirm-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      tocarSomClick();
      confirmTurn();
    });
  }

  // Start countdown (HTML)
  startTurnConfirmationCountdown(scene, null);
}

function startTurnConfirmationCountdown(scene, timerText) {
  
  
  
  
  
  turnConfirmationInterval = setInterval(() => {
    turnConfirmationTimeLeft--;
    
    
    // Update HTML timer if present
    const htmlTimer = document.getElementById('turn-timer-text');
    if (htmlTimer) htmlTimer.textContent = `${turnConfirmationTimeLeft}s`;
    
    if (turnConfirmationTimeLeft <= 0) {
      
      
      forceTurnPass();
    }
  }, 1000);
}

function hideTurnConfirmationPopup() {
  
  
  
  
  if (turnConfirmationInterval) {
    
    clearInterval(turnConfirmationInterval);
    turnConfirmationInterval = null;
  }
  
  // Hide HTML overlay if present
  if (turnConfirmOverlayEl) {
    turnConfirmOverlayEl.style.display = 'none';
    turnConfirmOverlayEl.innerHTML = '';
    turnConfirmOverlayEl = null;
  }

  // Keep legacy cleanup for safety
  if (turnConfirmationPopup) {
    try { turnConfirmationPopup.destroy(); } catch (e) {}
    turnConfirmationPopup = null;
  }
}

function confirmTurn() {
  
  
  
  forcedTurnCount = 0; // Reset forced turn count on successful confirmation
  lastTurnForPlayer = null; // Reset turn tracker on successful confirmation
  lastProcessedTurn = null; // Reset processed turn tracker on successful confirmation
  
  
  
  
  hideTurnConfirmationPopup();
  
  // Limpar todas as animações de salto ao confirmar o turno
  limparTodasAnimacoesSalto();
  
  // Timer is now controlled by server
  
}
function forceTurnPass() {
  const gameState = getGameState();
  if (!gameState) {
    
    return;
  }
  
  
  
  
  
  
  forcedTurnCount++;
  
  logForcedTurnCount();
  
  hideTurnConfirmationPopup();
  
  // Limpar todas as animações de salto ao forçar passagem do turno
  limparTodasAnimacoesSalto();
  
  // Check if we should disconnect the player
  if (forcedTurnCount >= maxForcedTurns) {
    // Disconnect player after max forced turns
    
    
    mostrarMensagem('❌ Você foi desconectado por inatividade!');
    
    // Emit disconnect event immediately
    
    emitWithRoom('playerInactive', { playerName: gameState.meuNome });
    
    // Force disconnect after a short delay
    setTimeout(() => {
      
      window.location.reload();
    }, 2000);
    
    return; // Exit early to prevent further turn passing
  }
  
  // If not disconnecting, force turn to pass
  
  emitWithRoom('passarTurno');
  
  // Also emit forceTurnChange as backup
  setTimeout(() => {
    
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
  
  
  timerJustExpired = true; // Set flag to prevent immediate restart
  stopTurnTimer();
  
  // Limpar todas as animações de salto ao encerrar turno por timeout
  limparTodasAnimacoesSalto();
  
  // Automatically end turn - force it regardless of game state
  if (getSocket() && gameState.meuNome === gameState.turno) {
    
    emitWithRoom('passarTurno');
    
    // Also emit a force turn change event as backup
    setTimeout(() => {
      
      emitWithRoom('forceTurnChange');
    }, 1000);
  }
}

function handleLogin() {
  const usernameInput = document.getElementById('username');
  const countryInput = document.getElementById('selected-country');
  const username = usernameInput.value.trim();
  const selectedCountry = countryInput ? countryInput.value : 'US';
  
  if (username.length < 2) {
    showLoginErrorModal('Por favor, digite um nome com pelo menos 2 caracteres.');
    return;
  }
  
  if (username.length > 20) {
    showLoginErrorModal('Por favor, digite um nome com no máximo 20 caracteres.');
    return;
  }
  
  // Store username, country and mark as logged in
  playerUsername = username;
  playerCountry = selectedCountry;
  playerLoggedIn = true;
  
  // Store selected language
  const selectedLanguage = countryToLanguage[selectedCountry] || 'en';
  currentLanguage = selectedLanguage;
  
  // Log the selected country and language
  const country = window.availableCountries ? window.availableCountries.find(c => c.code === selectedCountry) : null;
  if (country) {
    
  }
  
  // Limpar mapeamento anterior
  playerColorToUsernameMap = {};
  
  // Hide login screen and show mode selection screen
  const loginScreen = document.getElementById('login-screen');
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  
  if (loginScreen) {
    loginScreen.style.display = 'none';
    
  }
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'flex';
    
  } else {
    
  }
  
  // Initialize mode selection system
  initializeModeSelection();
  
  // Update HUD to reflect new player color
  updateCSSHUD();
}

function initializeModeSelection() {
  
  
  // Add event listeners for mode selection
  const skirmishMode = document.getElementById('mode-skirmish');
  const dominiumMode = document.getElementById('mode-dominium');
  const backButton = document.getElementById('back-to-login');
  
  if (skirmishMode) {
    skirmishMode.addEventListener('click', () => {
      
      selectSkirmishMode();
    });
  }
  
  if (dominiumMode) {
    dominiumMode.addEventListener('click', () => {
      
      showDominiumUnavailable();
    });
  }
  
  if (backButton) {
    backButton.addEventListener('click', () => {
      
      backToLogin();
    });
  }
}

// Info modal controls for Mode Selection alerts
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('mode-info-popup');
  const backdrop = document.getElementById('mode-info-backdrop');
  const closeBtn = document.getElementById('mode-info-close');
  const okBtn = document.getElementById('mode-info-ok');
  const hide = () => {
    if (popup) popup.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
  };
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (okBtn) okBtn.addEventListener('click', hide);
  if (backdrop) backdrop.addEventListener('click', hide);
});

function selectSkirmishMode() {
  // Hide mode selection screen and show skirmish mode screen
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  const skirmishModeScreen = document.getElementById('skirmish-mode-screen');
  
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'none';
    
  }
  if (skirmishModeScreen) {
    skirmishModeScreen.style.display = 'flex';
    
  } else {
    
  }
  
  // Initialize skirmish mode system
  initializeSkirmishMode();
}

function showDominiumUnavailable() {
  showDominiumDevModal();
}

// Initialize skirmish mode system
function initializeSkirmishMode() {
  
  
  // Add event listeners for skirmish options
  const startMatchBtn = document.getElementById('skirmish-start-match');
  const rankingBtn = document.getElementById('skirmish-ranking');
  const statsBtn = document.getElementById('skirmish-stats');
  const tutorialBtn = document.getElementById('skirmish-tutorial');
  const backButton = document.getElementById('back-to-mode-selection');
  
  if (startMatchBtn) {
    startMatchBtn.addEventListener('click', () => {
      
      startSkirmishMatch();
    });
  }
  
  if (rankingBtn) {
    // Desabilitar clique no botão de ranking (funcionalidade indisponível)
    rankingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      showRankingPopup();
    });
  }
  
  if (statsBtn) {
    // Desabilitar clique no botão de estatísticas (funcionalidade indisponível)
    statsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      showStatsPopup();
    });
  }
  
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      
      showSkirmishTutorial();
    });
  }
  
  if (backButton) {
    backButton.addEventListener('click', () => {
      
      backToModeSelectionFromSkirmish();
    });
  }
}

// Skirmish mode functions
function startSkirmishMatch() {
  // Hide skirmish mode screen and show lobby screen
  const skirmishModeScreen = document.getElementById('skirmish-mode-screen');
  const lobbyScreen = document.getElementById('lobby-screen');
  
  if (skirmishModeScreen) {
    skirmishModeScreen.style.display = 'none';
    
  }
  if (lobbyScreen) {
    lobbyScreen.style.display = 'flex';
    
  } else {
    
  }
  
  // Initialize lobby system
  initializeLobby();
}

function showSkirmishRanking() {
  // TODO: Implementar tela de ranking geral
  
  showRankingPopup();
}

function showSkirmishStats() {
  // TODO: Implementar tela de estatísticas pessoais
  
  showStatsPopup();
}

function showRankingPopup() {
  const rankingPopup = document.getElementById('ranking-popup');
  const rankingBackdrop = document.getElementById('ranking-backdrop');
  
  if (rankingPopup && rankingBackdrop) {
    rankingPopup.style.display = 'flex';
    rankingBackdrop.style.display = 'block';
    
    // Adicionar event listeners
    const closeBtn = document.getElementById('ranking-close');
    const okBtn = document.getElementById('ranking-ok');
    
    if (closeBtn) {
      closeBtn.onclick = hideRankingPopup;
    }
    
    if (okBtn) {
      okBtn.onclick = hideRankingPopup;
    }
    
    if (rankingBackdrop) {
      rankingBackdrop.onclick = hideRankingPopup;
    }
  }
}

function hideRankingPopup() {
  const rankingPopup = document.getElementById('ranking-popup');
  const rankingBackdrop = document.getElementById('ranking-backdrop');
  
  if (rankingPopup && rankingBackdrop) {
    rankingPopup.style.display = 'none';
    rankingBackdrop.style.display = 'none';
  }
}

function showStatsPopup() {
  const statsPopup = document.getElementById('stats-popup');
  const statsBackdrop = document.getElementById('stats-backdrop');
  
  if (statsPopup && statsBackdrop) {
    statsPopup.style.display = 'flex';
    statsBackdrop.style.display = 'block';
    
    // Adicionar event listeners
    const closeBtn = document.getElementById('stats-close');
    const okBtn = document.getElementById('stats-ok');
    
    if (closeBtn) {
      closeBtn.onclick = hideStatsPopup;
    }
    
    if (okBtn) {
      okBtn.onclick = hideStatsPopup;
    }
    
    if (statsBackdrop) {
      statsBackdrop.onclick = hideStatsPopup;
    }
  }
}

function hideStatsPopup() {
  const statsPopup = document.getElementById('stats-popup');
  const statsBackdrop = document.getElementById('stats-backdrop');
  
  if (statsPopup && statsBackdrop) {
    statsPopup.style.display = 'none';
    statsBackdrop.style.display = 'none';
  }
}

function showSkirmishTutorial() {
  
  
  // Esconder tela de skirmish
  const skirmishModeScreen = document.getElementById('skirmish-mode-screen');
  if (skirmishModeScreen) {
    skirmishModeScreen.style.display = 'none';
  }
  
  // Mostrar tela de tutorial
  const tutorialScreen = document.getElementById('tutorial-screen');
  if (tutorialScreen) {
    tutorialScreen.style.display = 'flex';
    
    // Inicializar tutorial
    initializeTutorial();
  }
}
function initializeTutorial() {
  let currentSection = 1;
  const totalSections = 6;
  
  // Atualizar textos para o idioma atual
  updateTutorialTexts();
  
  // Função para mostrar seção específica
  function showSection(sectionNumber) {
    // Esconder todas as seções
    for (let i = 1; i <= totalSections; i++) {
      const section = document.getElementById(`tutorial-section-${i}`);
      if (section) {
        section.style.display = 'none';
      }
    }
    
    // Mostrar seção atual
    const currentSectionEl = document.getElementById(`tutorial-section-${sectionNumber}`);
    if (currentSectionEl) {
      currentSectionEl.style.display = 'block';
    }
    
    // Atualizar navegação
    updateNavigation();
  }
  
  // Função para atualizar navegação
  function updateNavigation() {
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');
    const dots = document.querySelectorAll('.tutorial-dot');
    
    // Atualizar botões
    if (prevBtn) {
      prevBtn.disabled = currentSection === 1;
    }
    
    if (nextBtn) {
      if (currentSection === totalSections) {
        nextBtn.textContent = getText('tutorialFinish');
      } else {
        nextBtn.textContent = getText('tutorialNext');
      }
    }
    
    // Atualizar dots
    dots.forEach((dot, index) => {
      if (index + 1 === currentSection) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Função para ir para próxima seção
  function nextSection() {
    if (currentSection < totalSections) {
      currentSection++;
      showSection(currentSection);
    } else {
      // Finalizar tutorial
      finishTutorial();
    }
  }
  
  // Função para ir para seção anterior
  function prevSection() {
    if (currentSection > 1) {
      currentSection--;
      showSection(currentSection);
    }
  }
  
  // Função para ir para seção específica (clique nos dots)
  function goToSection(sectionNumber) {
    currentSection = sectionNumber;
    showSection(currentSection);
  }
  
  // Função para finalizar tutorial
  function finishTutorial() {
    
    
    // Esconder tela de tutorial
    const tutorialScreen = document.getElementById('tutorial-screen');
    if (tutorialScreen) {
      tutorialScreen.style.display = 'none';
    }
    
    // Voltar para tela de skirmish
    const skirmishModeScreen = document.getElementById('skirmish-mode-screen');
    if (skirmishModeScreen) {
      skirmishModeScreen.style.display = 'flex';
    }
  }
  
  // Função para voltar ao skirmish
  function backToSkirmish() {
    
    
    // Esconder tela de tutorial
    const tutorialScreen = document.getElementById('tutorial-screen');
    if (tutorialScreen) {
      tutorialScreen.style.display = 'none';
    }
    
    // Voltar para tela de skirmish
    const skirmishModeScreen = document.getElementById('skirmish-mode-screen');
    if (skirmishModeScreen) {
      skirmishModeScreen.style.display = 'flex';
    }
  }
  
  // Função para começar a jogar
  function startGame() {
    
    
    // Esconder tela de tutorial
    const tutorialScreen = document.getElementById('tutorial-screen');
    if (tutorialScreen) {
      tutorialScreen.style.display = 'none';
    }
    
    // Iniciar partida skirmish
    startSkirmishMatch();
  }
  
  // Adicionar event listeners
  const prevBtn = document.getElementById('tutorial-prev');
  const nextBtn = document.getElementById('tutorial-next');
  const backBtn = document.getElementById('tutorial-back');
  const startGameBtn = document.getElementById('tutorial-start-game');
  const dots = document.querySelectorAll('.tutorial-dot');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSection);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSection);
  }
  
  if (backBtn) {
    backBtn.addEventListener('click', backToSkirmish);
  }
  
  if (startGameBtn) {
    startGameBtn.addEventListener('click', startGame);
  }
  
  // Adicionar event listeners para os dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSection(index + 1));
  });
  
  // Mostrar primeira seção
  showSection(1);
}

function backToModeSelectionFromSkirmish() {
  // Hide skirmish mode screen and show mode selection screen
  const skirmishModeScreen = document.getElementById('skirmish-mode-screen');
  const modeSelectionScreen = document.getElementById('mode-selection-screen');
  
  if (skirmishModeScreen) {
    skirmishModeScreen.style.display = 'none';
    
  }
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'flex';
    
  }
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
    
  }
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'none';
    
  }
  if (usernameInput) {
    usernameInput.value = '';
    usernameInput.focus();
  }
  
  // Reset player avatar color to default
  const playerAvatarEl = document.querySelector('.player-avatar');
  if (playerAvatarEl) {
    playerAvatarEl.style.background = '#4444ff'; // Default blue color
  }
  
  // Limpar mapeamento de nomes de cores para nomes de usuário
  playerColorToUsernameMap = {};
  
}

function backToModeSelection() {
  
  
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
    
  }
  
  if (modeSelectionScreen) {
    modeSelectionScreen.style.display = 'flex';
    
  }
  
  // Resetar estado de login (mantém o usuário logado)
  playerLoggedIn = true;
}

// Function to resize game elements based on screen size
function resizeGameElements(scene) {
  const gameState = getGameState();
  if (!gameState || !gameState.paises) return;

  // Get current canvas dimensions
  const canvas = scene.sys.game.canvas;
  if (!canvas) return;
  
  // Calculate scale factor based on canvas size vs original size
  const originalWidth = 1280;
  const originalHeight = 720;
  const scaleX = canvas.width / originalWidth;
  const scaleY = canvas.height / originalHeight;
  
  // Use consistent scaling to maintain aspect ratio
  const uniformScale = Math.min(scaleX, scaleY);

  

  // Update map image to fill entire canvas
  const mapaImage = scene.children.list.find(child => child.texture && child.texture.key === 'mapa');
  if (mapaImage) {
    // Scale to fill entire canvas area
    mapaImage.setDisplaySize(canvas.width, canvas.height);
    mapaImage.setPosition(0, 0);
    mapaImage.setOrigin(0, 0);
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

  // Update territories to fill entire screen
  gameState.paises.forEach(pais => {
    if (pais.polygon) {
      // Scale polygon position to fill screen
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
      pais.text.setScale(Math.min(scaleX, scaleY) * 0.8); // Keep text readable
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
      pais.troopText.setScale(Math.min(scaleX, scaleY) * 0.9);
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
  
  // Update HTML troops positions
  resizeHTMLTroops();
  
  // Update HTML continent positions
  resizeHTMLContinents();

  // Update HTML connections (lines between territories)
  updateAllConnectionsDebounced();
}

function setupRemanejamentoEventListeners() {
  // Event listeners para fechar interface
  const remanejamentoClose = document.getElementById('remanejamento-close');
  const remanejamentoBackdrop = document.getElementById('remanejamento-backdrop');
  const remanejamentoCancel = document.getElementById('remanejamento-cancel');
  
  if (remanejamentoClose) {
    remanejamentoClose.addEventListener('click', () => {
      tocarSomClick();
      esconderInterfaceRemanejamento();
    });
  }
  
  // Backdrop do remanejamento removido - não deve fechar ao clicar fora
  // if (remanejamentoBackdrop) {
  //   remanejamentoBackdrop.addEventListener('click', () => {
  //     esconderInterfaceRemanejamento();
  //   });
  // }
  
  if (remanejamentoCancel) {
    remanejamentoCancel.addEventListener('click', () => {
      tocarSomClick();
      esconderInterfaceRemanejamento();
    });
  }
  
  // Event listeners para controles de quantidade
  const remanejamentoMinus = document.getElementById('remanejamento-minus');
  const remanejamentoPlus = document.getElementById('remanejamento-plus');
  const remanejamentoConfirm = document.getElementById('remanejamento-confirm');
  
  if (remanejamentoMinus) {
    remanejamentoMinus.addEventListener('click', () => {
      tocarSomClick();
      if (dadosRemanejamento && tropasParaMover > 1) {
        tropasParaMover -= 1;
        atualizarQuantidadeRemanejamento();
      }
    });
  }
  
  if (remanejamentoPlus) {
    remanejamentoPlus.addEventListener('click', () => {
      tocarSomClick();
      if (dadosRemanejamento && tropasParaMover < dadosRemanejamento.maxTropas) {
        tropasParaMover += 1;
        atualizarQuantidadeRemanejamento();
      }
    });
  }
  
  if (remanejamentoConfirm) {
    remanejamentoConfirm.addEventListener('click', () => {
      tocarSomClick();
      confirmarRemanejamento();
    });
  }
  
  
}

function atualizarQuantidadeRemanejamento() {
  const qtyEl = document.getElementById('remanejamento-qty');
  if (qtyEl && dadosRemanejamento) {
    qtyEl.textContent = `${tropasParaMover}/${dadosRemanejamento.maxTropas}`;
  }
}

function confirmarRemanejamento() {
  if (!dadosRemanejamento) {
    
    return;
  }
  
  const quantidade = Math.min(Math.max(tropasParaMover, 1), dadosRemanejamento.maxTropas);
  if (quantidade > 0) {
    
    emitWithRoom('moverTropas', { 
      origem: dadosRemanejamento.origem.nome, 
      destino: dadosRemanejamento.destino.nome, 
      quantidade: quantidade 
    });
    esconderInterfaceRemanejamento();
  } else {
    
  }
}
// Função para verificar se alguma interface HTML está aberta
function isAnyHTMLInterfaceOpen() {
  // Verificar interfaces por elemento e estilo de display
  const interfaces = [
    { name: 'Remanejamento', element: document.getElementById('remanejamento-popup') },
    { name: 'Reforço', element: document.getElementById('reinforce-popup') },
    { name: 'Transferência', element: document.getElementById('transfer-popup') },
    { name: 'Vitória', element: document.getElementById('victory-popup') },
    { name: 'Cartas', element: document.querySelector('.cards-popup[style*="flex"]') },
    { name: 'Objetivo', element: document.querySelector('.objective-popup[style*="flex"]') },
    { name: 'Início de Turno', element: document.getElementById('turn-start-overlay') }
  ];
  
  for (const interface of interfaces) {
    if (interface.element) {
      const isVisible = interface.element.style.display === 'flex' || 
                       interface.element.style.display === 'block' ||
                       (interface.element.style.display === '' && 
                        window.getComputedStyle(interface.element).display !== 'none');
      
      if (isVisible) {
        return interface.name;
      }
    }
  }
  
  // Verificar também por variáveis de estado
  if (interfaceRemanejamentoAberta) return 'Remanejamento (estado)';
  if (modalTransferenciaAberta) return 'Transferência (estado)';
  if (modalObjetivoAberto) return 'Objetivo (estado)';
  if (modalCartasTerritorioAberto) return 'Cartas (estado)';
  if (window.indicacaoInicioTurno) return 'Início de Turno (estado)';
  
  return null; // Nenhuma interface aberta
}

// Sistema de Tropas HTML - Substitui círculos Phaser por elementos HTML responsivos
let htmlTroopsEnabled = true;
let troopsOverlay = null;
let connectionsOverlay = null;
let htmlConnectionsEnabled = true;
let phaserConnectionLinesEnabled = false;

// Sistema de Continentes HTML - Substitui textos Phaser por elementos HTML responsivos
let htmlContinentsEnabled = true;
let continentsOverlay = null;

function initializeHTMLTroopSystem() {
  troopsOverlay = document.getElementById('troops-overlay');
  if (!troopsOverlay) {
    
    return;
  }
  
}

// === SISTEMA DE CONEXÕES HTML (LINHAS ENTRE TERRITÓRIOS) ===
function initializeHTMLConnectionsSystem() {
  connectionsOverlay = document.getElementById('connections-overlay');
  if (!connectionsOverlay) {
    
    return;
  }
  
  renderAllConnections();
}

function getTroopIndicatorCenter(territorioNome) {
  const el = document.getElementById(`troop-${territorioNome}`);
  if (!el) return null;
  // Usar exatamente o que foi aplicado no estilo (mesmo sistema dos overlays)
  const left = parseFloat(el.style.left || '0');
  const top = parseFloat(el.style.top || '0');
  const width = el.offsetWidth || parseFloat(getComputedStyle(el).width) || 12;
  const height = el.offsetHeight || parseFloat(getComputedStyle(el).height) || 12;
  return { x: left + width / 2, y: top + height / 2 };
}

function clearAllConnections() {
  if (!connectionsOverlay) return;
  connectionsOverlay.innerHTML = '';
}

function createConnectionLine(id, x1, y1, x2, y2) {
  if (!connectionsOverlay) return null;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI; // degrees
  const line = document.createElement('div');
  line.className = 'connection-line';
  line.id = `conn-${id}`;
  line.style.width = `${length}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${angle}deg)`;
  connectionsOverlay.appendChild(line);
  return line;
}

// Lista única de conexões (entre continentes e outras especiais)
const htmlConnections = [
  { origem: 'Blackmere', destino: 'Nihadara' },
  { origem: 'Duskmere', destino: 'Shōrenji' },
  { origem: 'Blackmere', destino: 'Shōrenji' },
  { origem: "Kaer'Tai", destino: 'Duskmere' },
  { origem: 'Highmoor', destino: 'Frosthollow' },
  { origem: 'Eldoria', destino: 'Frosthollow' },
  { origem: 'Thalengarde', destino: "Zul'Marak" },
  { origem: 'Duskmere', destino: "Zul'Marak" },
  { origem: 'Stormfen', destino: 'Frosthollow' },
  { origem: "Ravenspire", destino: "Zul'Marak" },
  { origem: "Winterholde", destino: "Aetheris" },
  { origem: "Winterholde", destino: "Ish'Tanor" },
  { origem: "Tzun'Rakai", destino: "Qumaran" },
  { origem: "Tzun'Rakai", destino: "Omradan" },
  { origem: "Oru'Kai", destino: "Bareshi" },
  { origem: "Oru'Kai", destino: "Sunjara" },
  { origem: "Ish'Tanor", destino: 'Aetheris' },
  { origem: 'Aetheris', destino: 'Dawnwatch' },
  { origem: 'Dawnwatch', destino: 'Mistveil' },
  { origem: 'Aetheris', destino: 'Mistveil' },
  { origem: 'Darakai', destino: 'Mistveil' }
];

function renderAllConnections() {
  if (!htmlConnectionsEnabled || !connectionsOverlay) return;
  clearAllConnections();
  htmlConnections.forEach(({ origem, destino }) => {
    const p1 = getTroopIndicatorCenter(origem);
    const p2 = getTroopIndicatorCenter(destino);
    if (!p1 || !p2) return;
    createConnectionLine(`${origem}__${destino}`, p1.x, p1.y, p2.x, p2.y);
  });
}

function updateAllConnectionsDebounced() {
  // Aguarda um frame para garantir reposicionamento dos indicadores
  requestAnimationFrame(() => renderAllConnections());
}

function createHTMLTroopIndicator(territorio) {
  if (!troopsOverlay || !htmlTroopsEnabled) return null;
  
  const indicator = document.createElement('div');
  indicator.className = 'troop-indicator';
  indicator.id = `troop-${territorio.nome}`;
  
  // Aplicar cor do jogador
  const playerColor = getPlayerColorClass(territorio.dono);
  if (playerColor) {
    indicator.classList.add(playerColor);
  }
  
  // Definir quantidade de tropas
  indicator.textContent = territorio.tropas.toString();
  // Inserir no DOM antes de calcular o tamanho para centralizar corretamente
  troopsOverlay.appendChild(indicator);

  // Posicionar baseado nas coordenadas do Phaser (após estar no DOM para obter dimensões)
  updateHTMLTroopPosition(indicator, territorio);
  return indicator;
}
function updateHTMLTroopPosition(indicator, territorio) {
  if (!indicator || !territorio.troopCircle) return;
  
  // Obter coordenadas do círculo Phaser
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  const canvasRect = canvas.getBoundingClientRect();
  const game = window.game;
  if (!game || !game.canvas) return;
  
  // Converter coordenadas do Phaser para CSS
  const scaleX = canvasRect.width / game.canvas.width;
  const scaleY = canvasRect.height / game.canvas.height;
  
  const phaserX = territorio.troopCircle.x;
  const phaserY = territorio.troopCircle.y;
  
  // Calcular posição CSS (relative to canvas)
  const cssX = phaserX * scaleX;
  const cssY = phaserY * scaleY;
  
  // Aplicar offset do canvas (HUD offset) e ajuste vertical
  const canvasOffsetTop = parseFloat(canvas.style.top) || 0;
  
  // Adicionar offset vertical para baixar os indicadores (ajustável por tamanho de tela)
  const isMobile = window.innerHeight <= 500;
  const isSmallMobile = window.innerWidth <= 480;
  const verticalOffset = isSmallMobile ? globalTroopOffset.smallMobile : 
                        (isMobile ? globalTroopOffset.mobile : globalTroopOffset.desktop);
  // Centralizar o indicador no ponto alvo
  const width = indicator.offsetWidth || parseFloat(getComputedStyle(indicator).width) || 12;
  const height = indicator.offsetHeight || parseFloat(getComputedStyle(indicator).height) || 12;
  indicator.style.left = `${cssX - width / 2}px`;
  indicator.style.top = `${cssY + canvasOffsetTop + verticalOffset - height / 2}px`;
}

function updateHTMLTroopIndicator(territorio) {
  const indicator = document.getElementById(`troop-${territorio.nome}`);
  if (!indicator) {
    // Criar indicador se não existir
    createHTMLTroopIndicator(territorio);
    updateAllConnectionsDebounced();
    return;
  }
  
  // Atualizar quantidade
  indicator.textContent = territorio.tropas.toString();
  
  // Atualizar cor do jogador
  indicator.className = 'troop-indicator';
  const playerColor = getPlayerColorClass(territorio.dono);
  if (playerColor) {
    indicator.classList.add(playerColor);
  }
  
  // Atualizar posição
  updateHTMLTroopPosition(indicator, territorio);
  updateAllConnectionsDebounced();
}

function removeHTMLTroopIndicator(territorioNome) {
  const indicator = document.getElementById(`troop-${territorioNome}`);
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

function updateAllHTMLTroops() {
  if (!htmlTroopsEnabled || !troopsOverlay) return;
  
  const gameState = getGameState();
  if (!gameState || !gameState.paises) return;
  
  gameState.paises.forEach(territorio => {
    updateHTMLTroopIndicator(territorio);
  });
  updateAllConnectionsDebounced();
}

function hidePhaserrTroops() {
  const gameState = getGameState();
  if (!gameState || !gameState.paises) return;
  
  gameState.paises.forEach(territorio => {
    if (territorio.troopCircle) {
      territorio.troopCircle.setVisible(false);
    }
    if (territorio.troopText) {
      territorio.troopText.setVisible(false);
    }
  });
}

function showPhaserTroops() {
  const gameState = getGameState();
  if (!gameState || !gameState.paises) return;
  
  gameState.paises.forEach(territorio => {
    if (territorio.troopCircle) {
      territorio.troopCircle.setVisible(true);
    }
    if (territorio.troopText) {
      territorio.troopText.setVisible(true);
    }
  });
}

function clearAllHTMLTroops() {
  if (troopsOverlay) {
    troopsOverlay.innerHTML = '';
  }
}

// Função para alternar entre tropas HTML e Phaser (para debug)
function toggleHTMLTroops() {
  htmlTroopsEnabled = !htmlTroopsEnabled;
  
  if (htmlTroopsEnabled) {
    
    hidePhaserrTroops();
    updateAllHTMLTroops();
  } else {
    
    clearAllHTMLTroops();
    showPhaserTroops();
  }
  
  return htmlTroopsEnabled;
}

// Variável global para ajuste dinâmico do offset das tropas
let globalTroopOffset = { desktop: 50, mobile: 20, smallMobile: 20 };

// Função para ajustar o offset vertical das tropas (debug)
function adjustTroopOffset(desktop = 15, mobile = 12, smallMobile = 8) {
  globalTroopOffset = { desktop, mobile, smallMobile };
  
  
  if (htmlTroopsEnabled) {
    updateAllHTMLTroops();
    showDebugMessage(`Offset ajustado: Desktop=${desktop}, Mobile=${mobile}, Small=${smallMobile}`);
  }
  
  return globalTroopOffset;
}

// Função para redimensionar tropas HTML quando a tela muda
function resizeHTMLTroops() {
  if (htmlTroopsEnabled) {
    // Aguardar um frame para garantir que o canvas foi redimensionado
    requestAnimationFrame(() => {
      updateAllHTMLTroops();
    });
  }
}

// === SISTEMA DE CONTINENTES HTML ===

// Dados dos continentes com posições calculadas baseadas nos territórios
const continentPositions = {
  'Thaloria': { x: 21, y: 19 },      // Região noroeste - centro dos territórios Redwyn, Stormfen, etc.
  'Zarandis': { x: 35, y: 57 },      // Região central-oeste - centro dos territórios Stonevale, Emberlyn, etc.
  'Elyndra': { x: 55, y: 18 },       // Região norte-central - centro dos territórios Frosthelm, Eldoria, etc.
  'Kharune': { x: 45, y: 69 },       // Região central-leste - centro dos territórios Zul'Marak, Emberwaste, etc.
  'Xanthera': { x: 85, y: 19 },      // Região leste - centro dos territórios Nihadara, Shōrenji, etc.
  'Mythara': { x: 95, y: 70 }        // Região sudeste - centro dos territórios Mistveil, Dawnwatch, etc.
};

const continentData = {
  'Thaloria': { name: 'Thaloria', bonus: 5, territories: ['Redwyn', 'Stormfen', 'Cragstone', 'Hollowspire', 'Westreach', 'Barrowfell', 'Highmoor', 'Frosthollow'] },
  'Zarandis': { name: 'Zarandis', bonus: 3, territories: ['Stonevale', 'Emberlyn', 'Duskwatch', 'Ravenspire', 'Stormhall'] },
  'Elyndra': { name: 'Elyndra', bonus: 5, territories: ['Frosthelm', 'Eldoria', 'Ironreach', 'Greymoor', 'Blackmere', 'Duskmere', 'Thalengarde'] },
  'Kharune': { name: 'Kharune', bonus: 4, territories: ['Zul\'Marak', 'Emberwaste', 'Sunjara', 'Tharkuun', 'Bareshi', 'Oru\'Kai'] },
  'Xanthera': { name: 'Xanthera', bonus: 7, territories: ['Nihadara', 'Shōrenji', 'Kaer\'Tai', 'Xin\'Qari', 'Vol\'Zareth', 'Sa\'Torran', 'Omradan', 'Mei\'Zhara', 'Qumaran', 'Darakai', 'Ish\'Tanor', 'Tzun\'Rakai'] },
  'Mythara': { name: 'Mythara', bonus: 2, territories: ['Mistveil', 'Dawnwatch', 'Aetheris', 'Winterholde'] }
};

function initializeHTMLContinentSystem() {
  continentsOverlay = document.getElementById('continents-overlay');
  if (!continentsOverlay) {
    
    return;
  }
  
  
  // Criar labels dos continentes
  createAllContinentLabels();
}

function createContinentLabel(continentName, continentInfo) {
  if (!continentsOverlay || !htmlContinentsEnabled) return null;
  
  const position = continentPositions[continentName];
  if (!position) {
    
    return null;
  }
  
  const label = document.createElement('div');
  label.className = 'continent-label';
  label.id = `continent-${continentName}`;
  
  // Estrutura HTML do label
  label.innerHTML = `
    <span class="continent-name">${continentInfo.name}<span class="continent-bonus">+${continentInfo.bonus}</span></span>
  `;
  
  // Posicionar o label
  updateContinentLabelPosition(label, position);
  
  continentsOverlay.appendChild(label);

  // Hover interactions to highlight territories of the continent
  label.addEventListener('mouseenter', () => highlightContinentTerritories(continentName));
  label.addEventListener('mouseleave', () => unhighlightContinentTerritories(continentName));
  // Touch support (mobile): highlight on touchstart and remove on touchend/cancel
  label.addEventListener('touchstart', () => highlightContinentTerritories(continentName), { passive: true });
  ['touchend','touchcancel'].forEach(evt =>
    label.addEventListener(evt, () => unhighlightContinentTerritories(continentName), { passive: true })
  );
  return label;
}

function updateContinentLabelPosition(label, position) {
  if (!label) return;
  
  // Obter canvas para calcular escala
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  const canvasRect = canvas.getBoundingClientRect();
  const game = window.game;
  if (!game || !game.canvas) return;
  
  // Converter coordenadas do jogo para CSS
  const scaleX = canvasRect.width / game.canvas.width;
  const scaleY = canvasRect.height / game.canvas.height;
  
  const cssX = position.x * scaleX;
  const cssY = position.y * scaleY;
  
  // Aplicar offset do canvas (HUD offset)
  const canvasOffsetTop = parseFloat(canvas.style.top) || 0;
  
  label.style.left = `${cssX}%`;
  label.style.top = `${cssY + canvasOffsetTop}%`;
}

function createAllContinentLabels() {
  if (!htmlContinentsEnabled || !continentsOverlay) return;
  
  // Limpar labels existentes
  continentsOverlay.innerHTML = '';
  
  // Criar label para cada continente
  Object.entries(continentData).forEach(([continentName, continentInfo]) => {
    createContinentLabel(continentName, continentInfo);
  });
  
  
}

function updateContinentLabel(continentName) {
  const label = document.getElementById(`continent-${continentName}`);
  if (!label) return;
  
  const gameState = getGameState();
  if (!gameState) return;
  
  const continentInfo = continentData[continentName];
  if (!continentInfo) return;
  
  // Não aplicar classes que alterem fundo (sem controlled/priority)
  label.className = 'continent-label';
  label.style.background = '';
  
  // Determinar quem controla o continente (se houver)
  const controllingPlayer = getControllingPlayer(continentName, gameState);
  const nameEl = label.querySelector('.continent-name');
  const bonusEl = label.querySelector('.continent-bonus');
  if (nameEl) {
    if (controllingPlayer) {
      const colorHex = getPlayerColor(controllingPlayer);
      nameEl.style.color = colorHex || '#ffffff';
    } else {
      nameEl.style.color = '#ffffff';
    }
    // Garantir que nenhum fundo é aplicado
    nameEl.style.background = 'transparent';
    nameEl.style.textShadow = '';
  }
  if (bonusEl) {
    bonusEl.style.color = '#ffffff';
    bonusEl.style.background = 'transparent';
  }
  
  // Atualizar posição (caso tenha mudado com redimensionamento)
  const position = continentPositions[continentName];
  if (position) {
    updateContinentLabelPosition(label, position);
  }
}

function isContinentControlledByPlayer(continentName, playerName, gameState) {
  const continentInfo = continentData[continentName];
  if (!continentInfo || !gameState.paises) return false;
  
  const territoriesControlled = continentInfo.territories.filter(territoryName => {
    const territory = gameState.paises.find(p => p.nome === territoryName);
    return territory && territory.dono === playerName;
  });
  
  return territoriesControlled.length === continentInfo.territories.length;
}

// Retorna o nome do jogador que controla totalmente o continente, ou null
function getControllingPlayer(continentName, gameState) {
  const continentInfo = continentData[continentName];
  if (!continentInfo || !gameState || !Array.isArray(gameState.paises)) return null;
  
  let owner = null;
  for (const territoryName of continentInfo.territories) {
    const territory = gameState.paises.find(p => p.nome === territoryName);
    if (!territory || !territory.dono) {
      return null;
    }
    if (owner == null) {
      owner = territory.dono;
    } else if (owner !== territory.dono) {
      return null;
    }
  }
  return owner;
}
function updateAllContinentLabels() {
  if (!htmlContinentsEnabled || !continentsOverlay) return;
  
  Object.keys(continentData).forEach(continentName => {
    updateContinentLabel(continentName);
  });
}

// === Highlight continent territories on hover ===
let currentHoveredContinent = null;
const hoveredTerritoryState = new Map(); // nome -> { prevStroke: {width,color,alpha}, elevatedApplied: boolean }

function highlightContinentTerritories(continentName) {
  const gameState = getGameState();
  if (!gameState) return;
  if (!continentData[continentName]) return;

  // If hovering a different continent, remove previous highlight first
  if (currentHoveredContinent && currentHoveredContinent !== continentName) {
    unhighlightContinentTerritories(currentHoveredContinent);
  }

  currentHoveredContinent = continentName;
  hoveredTerritoryState.clear();

  const scene = (window.game && window.game.scene && window.game.scene.scenes[0]) || null;

  continentData[continentName].territories.forEach(territoryName => {
    const territory = gameState.paises.find(p => p.nome === territoryName);
    if (!territory || !territory.polygon) return;

    const polygon = territory.polygon;
    const prev = polygon.strokeStyle
      ? { width: polygon.strokeStyle.width, color: polygon.strokeStyle.color, alpha: polygon.strokeStyle.alpha }
      : { width: 4, color: 0x000000, alpha: 1 };

    // Verificar se o território é prioritário (tem tropas de bônus para colocar)
    const isPrioritario = gameState.continentePrioritario && 
                         gameState.continentePrioritario.nome === continentName &&
                         gameState.meuNome === gameState.turno &&
                         Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0) > 0;

    // Só aplicar efeitos de hover se não for prioritário
    if (!isPrioritario) {
      // Apply white border highlight
      polygon.setStrokeStyle(6, 0xffffff, 1);

      // Apply elevation only if not already elevated
      let elevatedApplied = false;
      if (!territory.elevado && scene) {
        criarElevacaoTerritorio(territory.nome, scene);
        elevatedApplied = true;
      }

      hoveredTerritoryState.set(territory.nome, { prevStroke: prev, elevatedApplied });
    } else {
      // Para territórios prioritários, apenas salvar o estado atual sem aplicar efeitos
      hoveredTerritoryState.set(territory.nome, { 
        prevStroke: prev, 
        elevatedApplied: false,
        isPrioritario: true 
      });
    }
  });
}

function unhighlightContinentTerritories(continentName) {
  if (!currentHoveredContinent || currentHoveredContinent !== continentName) return;
  const gameState = getGameState();
  if (!gameState) return;
  const scene = (window.game && window.game.scene && window.game.scene.scenes[0]) || null;

  hoveredTerritoryState.forEach((state, territoryName) => {
    const territory = gameState.paises.find(p => p.nome === territoryName);
    if (!territory || !territory.polygon) return;

    const polygon = territory.polygon;
    const { prevStroke, elevatedApplied, isPrioritario } = state;

    // Se o território é prioritário, não restaurar o estado anterior
    if (isPrioritario) {
      
      return;
    }

    // Restore previous border
    polygon.setStrokeStyle(prevStroke.width, prevStroke.color, prevStroke.alpha);

    // Remove only the elevation we applied
    if (elevatedApplied && scene) {
      removerElevacaoTerritorio(territory.nome, scene);
    }
  });

  hoveredTerritoryState.clear();
  currentHoveredContinent = null;
}

function resizeHTMLContinents() {
  if (htmlContinentsEnabled) {
    // Aguardar um frame para garantir que o canvas foi redimensionado
    requestAnimationFrame(() => {
      updateAllContinentLabels();
    });
  }
}

function clearAllContinentLabels() {
  if (continentsOverlay) {
    continentsOverlay.innerHTML = '';
  }
}

// Função para alternar entre continentes HTML e Phaser (para debug)
function toggleHTMLContinents() {
  htmlContinentsEnabled = !htmlContinentsEnabled;
  
  if (htmlContinentsEnabled) {
    
    createAllContinentLabels();
    updateAllContinentLabels();
  } else {
    
    clearAllContinentLabels();
  }
  
  return htmlContinentsEnabled;
}
// Função para configurar proteção touch em mobile
function setupMobileTouchProtection() {
  // Função para bloquear eventos touch quando interfaces estão abertas
  function blockTouchEvent(event) {
    const interfaceAberta = isAnyHTMLInterfaceOpen();
    if (interfaceAberta) {
      
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }
  
  // Aguardar até o game estar pronto para adicionar listeners ao canvas
  function addCanvasListeners() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Adicionar listeners para todos os tipos de eventos touch
      ['touchstart', 'touchend', 'touchmove', 'touchcancel'].forEach(eventType => {
        canvas.addEventListener(eventType, blockTouchEvent, { 
          capture: true, // Capturar no capturing phase
          passive: false // Permitir preventDefault
        });
      });
      
      // Adicionar listeners para eventos de mouse (fallback para alguns devices)
      ['mousedown', 'mouseup', 'mousemove', 'click'].forEach(eventType => {
        canvas.addEventListener(eventType, blockTouchEvent, { 
          capture: true,
          passive: false
        });
      });
      
      
    } else {
      // Se canvas não estiver pronto, tentar novamente em 100ms
      setTimeout(addCanvasListeners, 100);
    }
  }
  
  // Iniciar a configuração
  addCanvasListeners();
}

function setupDebugMode() {
  let debugModeEnabled = false;
  let debugIndicator = null;
  
  // Event listener para teclas de debug
  document.addEventListener('keydown', (event) => {
    // Ignorar se estiver digitando em um input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Verificar se uma modal está aberta (para não interferir)
    const modalsAbertas = document.querySelector('.victory-popup[style*="flex"]') ||
                         document.querySelector('.remanejamento-popup[style*="flex"]') ||
                         document.querySelector('.reinforce-popup[style*="flex"]') ||
                         document.querySelector('.transfer-popup[style*="flex"]');
    
    switch(event.key.toLowerCase()) {
      case 'v':
        // Debug: Mostrar tela de vitória
        if (!modalsAbertas) {
          event.preventDefault();
          showDebugVictoryScreen();
        }
        break;
        
      case 'd':
        // Toggle debug mode
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          debugModeEnabled = !debugModeEnabled;
          toggleDebugIndicator(debugModeEnabled);
          showDebugMessage(debugModeEnabled ? '🛠️ Modo Debug ATIVADO' : '🛠️ Modo Debug DESATIVADO');
          if (debugModeEnabled) {
            showDebugCommands();
          }
        }
        break;
        
              case 'escape':
        // Fechar qualquer modal aberta
        if (modalsAbertas) {
          event.preventDefault();
          fecharTodasModais();
          hideVictoryModal();
        }
        break;
        
      case 't':
        // Debug: Testar interfaces modais
        if (!modalsAbertas) {
          event.preventDefault();
          testModalInterfaces();
        }
        break;
        
      case 'c':
        // Debug: Simular combate com 3 dados de defesa
        if (!modalsAbertas) {
          event.preventDefault();
          simulateCombatTest();
        }
        break;
        
      case 'm':
        // Debug: Testar proteção mobile touch
        if (!modalsAbertas) {
          event.preventDefault();
          testMobileTouchProtection();
        }
        break;
        
      case 'h':
        // Debug: Alternar tropas HTML/Phaser
        if (!modalsAbertas) {
          event.preventDefault();
          const enabled = toggleHTMLTroops();
          showDebugMessage(`Tropas ${enabled ? 'HTML' : 'Phaser'} ativadas`);
        }
        break;
        
      case 'n':
        // Debug: Alternar continentes HTML/Phaser
        if (!modalsAbertas) {
          event.preventDefault();
          const enabled = toggleHTMLContinents();
          showDebugMessage(`Continentes ${enabled ? 'HTML' : 'Phaser'} ativados`);
        }
        break;
        
      case 'arrowup':
        // Debug: Subir tropas (diminuir offset)
        if (!modalsAbertas && htmlTroopsEnabled) {
          event.preventDefault();
          const newOffset = {
            desktop: Math.max(0, globalTroopOffset.desktop - 5),
            mobile: Math.max(0, globalTroopOffset.mobile - 3),
            smallMobile: Math.max(0, globalTroopOffset.smallMobile - 2)
          };
          adjustTroopOffset(newOffset.desktop, newOffset.mobile, newOffset.smallMobile);
        }
        break;
        
      case 'arrowdown':
        // Debug: Baixar tropas (aumentar offset)
        if (!modalsAbertas && htmlTroopsEnabled) {
          event.preventDefault();
          const newOffset = {
            desktop: globalTroopOffset.desktop + 5,
            mobile: globalTroopOffset.mobile + 3,
            smallMobile: globalTroopOffset.smallMobile + 2
          };
          adjustTroopOffset(newOffset.desktop, newOffset.mobile, newOffset.smallMobile);
        }
        break;
    }
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
}

function showDebugCommands() {
  const commands = [
    '🛠️ COMANDOS DE DEBUG DISPONÍVEIS:',
    '  • V - Mostrar tela de vitória',
    '  • T - Testar interfaces modais',
    '  • C - Simular combate (3 dados defesa)',
    '  • M - Testar proteção mobile touch',
    '  • H - Alternar tropas HTML/Phaser',
    '  • N - Alternar continentes HTML/Phaser',
    '  • ↑ - Subir posição das tropas',
    '  • ↓ - Baixar posição das tropas',
    '  • ESC - Fechar modais',
    '  • Ctrl+D - Toggle debug mode',
    '',
    '📝 FUNÇÕES DE DEBUG:',
    '  • testVictoryScreen() - Teste da tela de vitória',
    '  • showDebugVictoryScreen() - Vitória com dados variados',
    '  • testModalInterfaces() - Testar proteção modal',
    '  • testMobileTouchProtection() - Testar proteção mobile',
    '  • toggleHTMLTroops() - Alternar sistema de tropas',
    '  • toggleHTMLContinents() - Alternar sistema de continentes',
    '  • updateAllHTMLTroops() - Atualizar posições tropas',
    '  • updateAllContinentLabels() - Atualizar labels continentes',
    '  • adjustTroopOffset(desktop, mobile, small) - Ajustar posição tropas',
    '  • simulateCombatTest() - Simular combates',
    '  • isAnyHTMLInterfaceOpen() - Verificar interfaces abertas'
  ];
}

function showDebugMessage(message) {
  // Criar uma notificação temporária na tela
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 119, 204, 0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 1px solid #0077cc;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(300px)';
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function toggleDebugIndicator(enabled) {
  const existingIndicator = document.getElementById('debug-indicator');
  
  if (enabled && !existingIndicator) {
    // Criar indicador visual
    const indicator = document.createElement('div');
    indicator.id = 'debug-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(255, 69, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 1px solid #ff4500;
      backdrop-filter: blur(5px);
      animation: debugPulse 2s infinite;
    `;
    
    indicator.innerHTML = `
      🛠️ DEBUG MODE<br>
      <span style="font-size: 10px; opacity: 0.8;">V = Victory | T = Test Modals</span>
    `;
    
    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes debugPulse {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(indicator);
    
  } else if (!enabled && existingIndicator) {
    // Remover indicador
    existingIndicator.remove();
  }
}

function showDebugVictoryScreen() {
  
  
  // Gerar dados aleatórios para cada teste
  const jogadoresExemplo = [
    'Jogador1', 'CPU Fácil', 'CPU Médio', 'CPU Difícil', 'CPU Expert'
  ];
  
  const tiposVitoria = ['eliminacao', 'objetivo'];
  const objetivosExemplo = [
    getText('eliminateAllAdversaries'),
    getText('conquerTerritories', { count: 18 }),
    getText('conquerSpecificContinents', { continent1: 'América do Sul', continent2: 'Europa' }),
    getText('conquerSpecificContinents', { continent1: 'América do Norte', continent2: 'África' }),
    getText('conquerSpecificContinents', { continent1: 'Ásia', continent2: 'Oceania' }),
    getText('conquerContinents', { count: 3 })
  ];
  
  // Escolher vencedor aleatório
  const vencedor = jogadoresExemplo[Math.floor(Math.random() * jogadoresExemplo.length)];
  const tipoVitoria = tiposVitoria[Math.floor(Math.random() * tiposVitoria.length)];
  
  // Dados simulados variados
  const dadosSimulados = {
    nomeVencedor: vencedor,
    resumoJogo: {
      tipoVitoria: tipoVitoria,
      estatisticas: {
        duracao: `${Math.floor(Math.random() * 45) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        totalAtaques: Math.floor(Math.random() * 100) + 20,
        continentesConquistados: Math.floor(Math.random() * 6) + 1
      }
    },
    gameState: {
      meuNome: 'Jogador1',
      vencedor: vencedor,
      jogadores: jogadoresExemplo.slice(0, Math.floor(Math.random() * 4) + 2).map(nome => ({ nome })),
      paises: generateRandomTerritories(jogadoresExemplo, vencedor),
      objetivos: {}
    }
  };
  
  // Gerar objetivos aleatórios
  dadosSimulados.gameState.jogadores.forEach((jogador, index) => {
    dadosSimulados.gameState.objetivos[jogador.nome] = objetivosExemplo[index % objetivosExemplo.length];
  });
  
  // Simular gameState global temporariamente
  const originalGetGameState = window.getGameState;
  window.getGameState = () => dadosSimulados.gameState;
  
  // Mostrar tela de vitória
  showVictoryModal(dadosSimulados.nomeVencedor, dadosSimulados.resumoJogo);
  
  // Restaurar função original após 30 segundos
  setTimeout(() => {
    window.getGameState = originalGetGameState;
  }, 30000);
  
  showDebugMessage(`🏆 Vitória de ${vencedor} (${tipoVitoria})`);
  
}
function generateRandomTerritories(jogadores, vencedor) {
  const territorios = [
    'Brasil', 'Argentina', 'Peru', 'Uruguai', 'Venezuela', 'Colombia',
    'Mexico', 'Estados Unidos', 'Canada', 'Groelandia', 'Islandia',
    'Reino Unido', 'Suecia', 'Alemanha', 'França', 'Espanha', 'Polônia',
    'Turquia', 'Egito', 'Sudan', 'Nigeria', 'Congo', 'Africa do Sul',
    'Madagascar', 'India', 'China', 'Japão', 'Mongólia', 'Sibéria',
    'Aral', 'Oriente Médio', 'Afeganistão', 'Irkutsk', 'Vladivostok',
    'Kamchatka', 'Ucrânia', 'Omsk', 'Tchita', 'Sumatra', 'Bornéu',
    'Nova Guiné', 'Austrália', 'Áustria'
  ];
  
  const paises = [];
  const jogadoresAtivos = jogadores.filter(j => Math.random() > 0.3 || j === vencedor); // Alguns podem estar eliminados
  
  territorios.forEach((nome, index) => {
    // Dar mais territórios para o vencedor
    let dono;
    if (Math.random() < 0.4 && jogadoresAtivos.includes(vencedor)) {
      dono = vencedor;
    } else {
      dono = jogadoresAtivos[Math.floor(Math.random() * jogadoresAtivos.length)];
    }
    
    paises.push({
      nome: nome,
      dono: dono,
      tropas: Math.floor(Math.random() * 15) + 1
    });
  });
  
  return paises;
}

function testModalInterfaces() {
  
  showDebugMessage('🧪 Testando interfaces modais');
  
  const interfaces = [
    {
      name: 'Remanejamento',
      show: () => {
        const dadosSimulados = {
          origem: { nome: 'Brasil', tropas: 10 },
          destino: { nome: 'Argentina', tropas: 5 }
        };
        mostrarInterfaceRemanejamento(dadosSimulados.origem, dadosSimulados.destino, null);
      },
      hide: () => esconderInterfaceRemanejamento()
    },
    {
      name: 'Reforço',
      show: () => {
        const popup = document.getElementById('reinforce-popup');
        const backdrop = document.getElementById('reinforce-backdrop');
        if (popup && backdrop) {
          document.getElementById('reinforce-title').textContent = getText('reinforceTitle');
          document.getElementById('reinforce-territory-name').textContent = 'Brasil';
          document.getElementById('reinforce-territory-troops').textContent = getText('reinforceTerritoryTroops', { troops: 10 });
          document.getElementById('reinforce-qty').textContent = '1/5';
          popup.style.display = 'flex';
          backdrop.style.display = 'block';
        }
      },
      hide: () => hideReinforceModal()
    },
    {
      name: 'Transferência',
      show: () => {
        const dadosSimulados = {
          territorioAtacante: 'Brasil',
          territorioConquistado: 'Argentina',
          tropasOrigem: 10,
          tropasDestino: 1,
          tropasAdicionais: 5
        };
        showTransferModal(dadosSimulados);
      },
      hide: () => hideTransferModal()
    }
  ];
  
  let currentIndex = 0;
  
  function showNext() {
    if (currentIndex >= interfaces.length) {
      
      showDebugMessage('✅ Teste concluído');
      return;
    }
    
    const current = interfaces[currentIndex];
    
    
    // Mostrar interface
    current.show();
    
    // Verificar se foi detectada
    setTimeout(() => {
      const interfaceAberta = isAnyHTMLInterfaceOpen();
      if (interfaceAberta) {
        
        showDebugMessage(`✅ ${current.name} protegida`);
      } else {
        
        showDebugMessage(`❌ ${current.name} desprotegida`);
      }
      
      // Fechar interface após 2 segundos
      setTimeout(() => {
        current.hide();
        currentIndex++;
        
        // Próxima interface após 1 segundo
        setTimeout(showNext, 1000);
      }, 2000);
    }, 500);
  }
  
  // Iniciar teste
  showNext();
}
// Variable to track if game is already initialized
let gameInitialized = false;

// Function to reset game initialization state
function resetGameInitialization() {
  gameInitialized = false;
  gameStarted = false;
  currentScene = null;
  
}

function initializeGame() {
  
  
  
  
  // Prevent multiple initializations
  if (gameInitialized) {
    
    return;
  }
  
  gameInitialized = true;
  
  // Use existing socket from lobby
  const socket = getSocket();
  
  if (!socket) {
    
    return;
  }
  
  
  // Configure event listeners BEFORE creating Phaser
  
  
  // Chat message listener
  socket.on('chatMessage', (dados) => {
    addChatMessage(dados.player, dados.message, new Date(dados.timestamp));
    
    // Play sound if message is from another player and chat is not open
    const gameState = getGameState();
    if (gameState && dados.player !== (playerUsername || gameState.meuNome) && !gameState.historyPopupVisible) {
      tocarSomHuh();
    }
  });
  
  // Turn timer update listener
  socket.on('turnTimerUpdate', (data) => {
    
    updateClientTimer(data);
  });
  
  // Game state update listener
  socket.on('estadoAtualizado', (estado) => {
    
    const gameState = getGameState();
    if (!gameState) {
      
      return;
    }
    
    gameState.jogadores = estado.jogadores;
    const previousTurn = gameState.turno; // Store previous turn
    gameState.turno = estado.turno;
    
          // Reset timer expiration flag when turn changes
      if (previousTurn !== gameState.turno) {
        
        
        
        
        
        
        
        timerJustExpired = false;
        
        
        // Stop any existing timer when turn changes
        if (isPlayerTurn) {
          
          stopTurnTimer();
        }
        
        // Hide turn confirmation popup when turn changes
        
        hideTurnConfirmationPopup();
        
        // Show turn start indication if it's the player's turn
        if (gameState.meuNome === gameState.turno && currentScene) {
          
          mostrarIndicacaoInicioTurno(gameState.meuNome, currentScene);
        }
        
        // Limpar seleção quando o turno muda
        limparSelecao();
        
        // Only reset forced turn count when turn changes to a different player
        if (gameState.meuNome !== gameState.turno) {
          
          // Fechar indicação de início de turno se estiver aberta
          if (window.indicacaoInicioTurno) {
            fecharIndicacaoInicioTurno();
          }
          
          forcedTurnCount = 0;
          lastTurnForPlayer = null; // Reset turn tracker when turn changes to different player
          lastProcessedTurn = null; // Reset processed turn tracker when turn changes to different player
          logForcedTurnCount();
        } else {
          // Keep the forced turn count when it's still the same player's turn
          
          logForcedTurnCount();
        }
      } else {
        
        
      }
    
    gameState.tropasReforco = estado.tropasReforco;
    gameState.tropasBonusContinente = estado.tropasBonusContinente || {};
    gameState.vitoria = estado.vitoria;
    gameState.derrota = estado.derrota;
    gameState.meuNome = estado.meuNome;
    
    // Mapear o nome da cor para o nome de usuário real
    if (gameState.meuNome && playerUsername) {
      playerColorToUsernameMap[gameState.meuNome] = playerUsername;
      
    }
    
    gameState.continentes = estado.continentes || {};
    gameState.continentePrioritario = estado.continentePrioritario || null;
    gameState.faseRemanejamento = estado.faseRemanejamento || false;
    gameState.cartasTerritorio = estado.cartasTerritorio || {};

    if (currentScene && estado.paises) {
      
      atualizarPaises(estado.paises, currentScene);
      
      // Verificar conquista de continente após atualizar os países
      if (gameState.ultimaConquista) {
        
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
      
      
      
      
      // Armazenar o estado para processar quando a scene estiver pronta
      pendingGameState = estado;
      
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
    
    // Traduzir nomes de cores na mensagem antes de adicionar ao histórico
    const mensagemTraduzida = translatePlayerColorsInMessage(mensagem);
    
    const timestamp = new Date().toLocaleTimeString();
    const historyEntry = {
      timestamp: timestamp,
      message: mensagemTraduzida
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
    mostrarEfeitoReforco(dados.territorio, dados.jogador, currentScene, dados.quantidade);
  });

  socket.on('mostrarEfeitoExplosaoTropas', (dados) => {
    mostrarEfeitoExplosaoTropas(dados.territorio, currentScene);
  });

  socket.on('mostrarEfeitoExplosaoConquista', (dados) => {
    mostrarEfeitoExplosaoConquista(dados.territorio, dados.jogador, currentScene);
  });

  socket.on('vitoria', (nomeJogador, resumoJogo) => {
    
    
    try {
      showVictoryModal(nomeJogador, resumoJogo);
    } catch (e) {
      
              mostrarMensagem(`${getTranslatedPlayerColor(nomeJogador)} ${getText('victoryByElimination')}`);
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
    
    
    
    
    const gameState = getGameState();
    if (!gameState) {
      
      return;
    }
    
    
    
    // Armazenar dados da conquista para verificar depois que o estado for atualizado
    gameState.ultimaConquista = {
      territorio: dados.territorioConquistado,
      jogador: dados.jogadorAtacante,
      scene: currentScene
    };
    
    // Só mostrar a interface para o jogador atacante se há tropas adicionais
    if (dados.jogadorAtacante === gameState.meuNome && dados.tropasAdicionais > 0) {
      // Verificar se já existe uma interface aberta
      if (modalTransferenciaAberta) {
        
        return;
      }
      
      dadosConquista = dados;
      
      showTransferModal(dados);
    }
  });

  socket.on('mostrarObjetivo', (objetivo) => {
    // Exibir via modal HTML
    try {
      if (window.showObjectiveModal) {
        window.showObjectiveModal(objetivo);
      } else {
        
      }
    } catch (e) {
      
    }
  });

  socket.on('objetivoAtualizado', (novoObjetivo) => {
    
    
    // Atualizar o estado do jogo com o novo objetivo
    const gameState = getGameState();
    if (gameState && gameState.objetivos) {
      const jogador = gameState.jogadores.find(j => j.socketId === socket.id);
      if (jogador) {
        gameState.objetivos[jogador.nome] = novoObjetivo;
        
        
        // Mostrar notificação visual
        mostrarMensagem(`🎯 Seu objetivo foi alterado: ${novoObjetivo.descricao}`);
        
        // Se o modal de objetivo estiver aberto, atualizá-lo
        if (modalObjetivoAberto) {
          // Fechar o modal atual
          hideObjectiveModal();
          // Aguardar um pouco e reabrir com o novo objetivo
          setTimeout(() => {
            if (window.showObjectiveModal) {
              window.showObjectiveModal(novoObjetivo);
            }
          }, 500);
        }
      }
    }
  });

  socket.on('mostrarCartasTerritorio', (cartas) => {
    if (modalCartasTerritorioAberto) return;
    try {
      showCardsModal(cartas, false);
    } catch (e) {
      
    }
  });

  socket.on('forcarTrocaCartas', (dados) => {
    const gameState = getGameState();
    if (!gameState) return;
    
    // Só mostrar para o jogador específico
    const jogador = gameState.jogadores.find(j => j.socketId === socket.id);
    if (jogador && jogador.nome === dados.jogador) {
      try {
        showCardsModal(dados.cartas, true);
      } catch (e) {
        
      }
    }
  });

  socket.on('resultadoTrocaCartas', (resultado) => {
    
    
    if (resultado.sucesso) {
      
      mostrarMensagem(resultado.mensagem);
      // Fechar modal HTML e continuar o turno
      hideCardsModal();
    } else {
      
      mostrarMensagem(`❌ ${resultado.mensagem}`);
    }
  });

  socket.on('iniciarFaseRemanejamento', () => {
    mostrarMensagem('🔄 Fase de remanejamento iniciada. Clique em um território para mover tropas.');
  });

  socket.on('resultadoVerificacaoMovimento', (resultado) => {
    
    
    const gameState = getGameState();
    if (!gameState) return;
    
    if (resultado.podeMover) {
      
      // Encontrar os territórios selecionados
      const territorioOrigem = gameState.paises.find(p => p.nome === gameState.selecionado.nome);
      const territorioDestino = gameState.paises.find(p => p.nome === resultado.territorioDestino);
      
      
      
      
      if (territorioOrigem && territorioDestino) {
        // Verificar se já existe uma interface aberta
        if (interfaceRemanejamentoAberta) {
          
          return;
        }
        
        mostrarInterfaceRemanejamento(territorioOrigem, territorioDestino, currentScene, resultado.quantidadeMaxima);
      } else {
        
      }
    } else {
      
      mostrarMensagem(`❌ ${resultado.motivo}`);
      limparSelecao();
    }
  });
  
  
  // Create Phaser game only after login
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#1a1a1a',
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
      expandParent: false,
      fullscreenTarget: 'game-container'
    },
    scene: {
      preload,
      create
    }
  };
  
  // Initialize Phaser game
  
  
  // Destroy existing game instance if it exists
  if (window.game) {
    
    window.game.destroy(true);
    window.game = null;
    // Reset scene reference
    currentScene = null;
  }
  
  const game = new Phaser.Game(config);
  window.game = game; // Make game globally available
  
  
  // Improved resize system with debouncing and proper scaling
  let resizeTimeout;
  let lastViewportHeight = window.innerHeight;
  let lastViewportWidth = window.innerWidth;
  
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.game && window.game.scene.scenes[0]) {
        const scene = window.game.scene.scenes[0];
        
        // Update Phaser game scale
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Resize the game canvas properly
        window.game.scale.setGameSize(newWidth, newHeight);
        
        // Update all game elements
        resizeGameElements(scene);
        
        // Update responsive elements
        if (typeof updateAllResponsiveElements === 'function') {
          updateAllResponsiveElements();
        }
        
        // Update connections
        if (typeof updateAllConnectionsDebounced === 'function') {
          updateAllConnectionsDebounced();
        }
        
        // Force mobile positioning if needed
        if (window.innerWidth <= 768 && typeof forceMobileCanvasPosition === 'function') {
          forceMobileCanvasPosition();
        }
        
        // Update viewport tracking
        lastViewportHeight = newHeight;
        lastViewportWidth = newWidth;
      }
    }, 100);
  }

  // Single unified resize listener
  window.addEventListener('resize', handleResize);

  // Orientation change listener for mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      handleResize();
    }, 200); // Longer delay for orientation changes
  });
  
  // Configurar event listeners da interface de remanejamento HTML
  setupRemanejamentoEventListeners();
  
  // Setup mobile touch protection
  setupMobileTouchProtection();
  
  // Inicializar sistema de tropas HTML
  initializeHTMLTroopSystem();
  
  // Inicializar sistema de continentes HTML
  initializeHTMLContinentSystem();
  
  // Inicializar sistema de conexões HTML
  initializeHTMLConnectionsSystem();
  
  // Configurar modo debug
  setupDebugMode();
  
  
  
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
  
  
  // Show lobby screen
  const lobbyScreen = document.getElementById('lobby-screen');
  if (lobbyScreen) lobbyScreen.style.display = 'flex';
  
  // Update texts for current language
  updateLobbyTexts();
  
  // Wait for socket.io to be ready before connecting
  function initializeSocket() {
    // Connect to socket if not already connected
    const socket = getSocket() || io(SERVER_URL);
    window.socket = socket;
    
    // Check if socket is already connected
    if (socket.connected) {
      
      
      // Emit player joined global lobby event
      socket.emit('playerJoinedGlobalLobby', { 
        username: playerUsername,
        language: currentLanguage
      });
      
      // Start lobby timer
      startLobbyTimer();
    } else {
      // Wait for socket connection before starting lobby
      socket.on('connect', () => {
        
        
        // Emit player joined global lobby event
        socket.emit('playerJoinedGlobalLobby', { 
          username: playerUsername,
          language: currentLanguage
        });
        
        // Start lobby timer
        startLobbyTimer();
      });
    }
    
    // Handle connection errors
    socket.on('connect_error', (error) => {
      
      showServerErrorModal();
    });
    
    // Lobby events
    socket.on('globalLobbyUpdate', (data) => {
      updateLobbyDisplay(data);
    });
    
    socket.on('gameStarting', (data) => {
      
      if (data && data.roomId) {
        currentRoomId = data.roomId; // Set the room ID assigned by server
        startGame();
      } else {
        
      }
    });
    
    // Chat message listener (for lobby chat if needed)
    socket.on('chatMessage', (dados) => {
      // Could implement lobby chat here if needed
    });
  }
  
  // Initialize socket when socket.io is ready
  if (typeof io !== 'undefined') {
    initializeSocket();
  } else {
    // Wait for socket.io to be loaded
    window.addEventListener('socketioReady', initializeSocket);
  }
  

}

function startLobbyTimer() {
  
  // Timer is now controlled by server via lobbyUpdate events
  // We just need to wait for the first lobbyUpdate to sync the timer
}

function updateLobbyTimerDisplay() {
  const timerDisplay = document.getElementById('lobby-timer-display');
  const timerElement = document.getElementById('lobby-timer');
  
  if (!timerDisplay) {
    
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
    status.textContent = getText('lobbyPlayerConnected');
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
    name.textContent = `${getText('lobbyPlayerCPU')} ${i + 1}`;
    
    const status = document.createElement('div');
    status.className = 'lobby-player-status';
    status.textContent = getText('lobbyPlayerCPU');
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
    statusText.textContent = getText('lobbyStatusCreating');
  } else if (connectedPlayers === totalPlayers) {
    statusText.textContent = getText('lobbyStatusAllConnected');
  } else {
    statusText.textContent = getText('lobbyStatusPlayers', { 
      connected: connectedPlayers, 
      total: totalPlayers 
    });
  }
}

function startGame() {
  
  
  
  
  
  // Prevent multiple game initializations
  if (gameStarted && window.game && currentScene) {
    
    return;
  }
  
  // If game was started but Phaser is not working, allow restart
  if (gameStarted && (!window.game || !currentScene)) {
    
    resetGameInitialization();
  }
  
  gameStarted = true;
  
  
  // Clear lobby timer
  if (lobbyTimerInterval) {
    clearInterval(lobbyTimerInterval);
    lobbyTimerInterval = null;
    
  }
  
  // Hide lobby and show game
  const lobbyScreen = document.getElementById('lobby-screen');
  const gameContainer = document.getElementById('game-container');
  
  
  
  
  // Update game HUD texts for current language
  updateGameHUDTexts();
  
  if (lobbyScreen) {
    lobbyScreen.style.display = 'none';
    
  }
  if (gameContainer) {
    gameContainer.style.display = 'block';
    
  }
  
  // Initialize the game
  
  initializeGame();
  
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
    
  }
  
  // Reset player avatar color to default when clearing game state
  const playerAvatarEl = document.querySelector('.player-avatar');
  if (playerAvatarEl) {
    playerAvatarEl.style.background = '#4444ff'; // Default blue color
  }
  
  // Limpar mapeamento de nomes de cores para nomes de usuário
  playerColorToUsernameMap = {};
  
}

// Process pending game state when scene is ready
function processarEstadoPendente() {
  if (!pendingGameState || !currentScene) {
    
    return;
  }
  
  
  
  const gameState = getGameState();
  if (!gameState) {
    
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
  
  // Mapear o nome da cor para o nome de usuário real
  if (gameState.meuNome && playerUsername) {
    playerColorToUsernameMap[gameState.meuNome] = playerUsername;
    
  }
  
  gameState.continentes = pendingGameState.continentes || {};
  gameState.continentePrioritario = pendingGameState.continentePrioritario || null;
  gameState.faseRemanejamento = pendingGameState.faseRemanejamento || false;
  gameState.cartasTerritorio = pendingGameState.cartasTerritorio || {};
  
  // Processar países
  if (pendingGameState.paises) {
    
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
    
    // Usar setTimeout para garantir que a scene esteja totalmente pronta
    setTimeout(() => {
      mostrarIndicacaoInicioTurno(gameState.meuNome, currentScene);
    }, 500);
  }
  
  // Limpar estado pendente
  pendingGameState = null;
  
}

// Get socket from global scope
function getSocket() {
  return window.socket;
}
// Helper function to emit events with room ID
function emitWithRoom(event, data = {}) {
  const socket = getSocket();
  
  
  
  
  
  if (socket && currentRoomId) {
    // Handle different data types
    if (typeof data === 'string') {
      // If data is a string (like country name), send it directly
      
      socket.emit(event, data);
    } else if (Array.isArray(data)) {
      // If data is an array, send it directly (don't add roomId to arrays)
      
      socket.emit(event, data);
    } else {
      // If data is an object, spread it and add roomId
      const eventData = { ...data, roomId: currentRoomId };
      
      socket.emit(event, eventData);
    }
  } else {
    
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

// Variáveis para interface de remanejamento (HTML)
let interfaceRemanejamentoAberta = false;
let tropasParaMover = 1;
let dadosRemanejamento = null;
let tropasParaTransferir = 0;
let dadosConquista = null;
let botaoObjetivo = null;
let modalObjetivoAberto = false;
let botaoCartasTerritorio = null;
let modalCartasTerritorioAberto = false;
let modalTransferenciaAberta = false;
// HTML modals state
let cardsModalForced = false;
let cardsSelected = [];
let cardsCurrentList = [];

function preload() {
  
  
  // Load map image with error handling
  this.load.image('mapa', 'assets/mapa.png');
  this.load.on('loaderror', (file) => {
    
  });
  this.load.on('complete', () => {
    
  });
  
  this.load.audio('shotsfired', 'assets/shotsfired.mp3');
  this.load.audio('armymoving', 'assets/armymoving.mp3');
  this.load.audio('clicksound', 'assets/clicksound.mp3');
  this.load.audio('huh', 'assets/huh.mp3');
  this.load.audio('takecard', 'assets/takecard.mp3');
  this.load.audio('clockticking', 'assets/clockticking.mp3');
  
}
function create() {
  
  
  // Check if scene is already initialized
  if (currentScene) {
    
  }
  
  currentScene = this; // Set global reference to current scene
  
  
  const largura = this.sys.game.config.width;
  const altura = this.sys.game.config.height;
  
  
  // Debug canvas information
  
  
  
  
  
  // Check if canvas is in DOM
  const canvasInDOM = document.querySelector('canvas');
  
  if (canvasInDOM) {
    
    
    
    
    
    
    
    
    
  }

  // Add map image with full stretch to fill screen
  const mapaImage = this.add.image(0, 0, 'mapa')
    .setOrigin(0, 0)
    .setDisplaySize(this.sys.game.canvas.width, this.sys.game.canvas.height);
  
  
  
  
  
  
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
        
      }
      
      
    }
  }, 100);

  // Criar sons
  somTiro = this.sound.add('shotsfired');
  somMovimento = this.sound.add('armymoving');
  somClick = this.sound.add('clicksound');
  somHuh = this.sound.add('huh');
  somTakeCard = this.sound.add('takecard');
  somClockTicking = this.sound.add('clockticking');

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

  // Objective modal buttons
  const objectiveCloseBtn = document.getElementById('objective-close');
  const objectiveOkBtn = document.getElementById('objective-ok');
  const objectiveBackdrop = document.getElementById('objective-backdrop');
  if (objectiveCloseBtn) objectiveCloseBtn.addEventListener('click', () => hideObjectiveModal());
  if (objectiveOkBtn) objectiveOkBtn.addEventListener('click', () => hideObjectiveModal());
  if (objectiveBackdrop) objectiveBackdrop.addEventListener('click', () => hideObjectiveModal());

  // Wire up cards exchange button dynamically (will submit when enabled)
  const cardsExchangeBtnInit = document.getElementById('cards-exchange');
  if (cardsExchangeBtnInit) {
    cardsExchangeBtnInit.addEventListener('click', () => {
      if (cardsModalForced) {
        // Em troca obrigatória, exigir exatamente 3
        if (cardsSelected.length === 3) {
          emitWithRoom('trocarCartasTerritorio', cardsSelected.slice());
          hideCardsModal();
        }
      } else {
        if (cardsSelected.length === 3) {
          emitWithRoom('trocarCartasTerritorio', cardsSelected.slice());
          hideCardsModal();
        }
      }
    });
  }

  // Cards modal buttons
  const cardsCloseBtn = document.getElementById('cards-close');
  const cardsBackdrop = document.getElementById('cards-backdrop');
  const cardsExchangeBtn = document.getElementById('cards-exchange');
  if (cardsCloseBtn) cardsCloseBtn.addEventListener('click', () => {
    if (cardsModalForced) return; // Não fechar quando for obrigatório
    hideCardsModal();
  });
  if (cardsBackdrop) cardsBackdrop.addEventListener('click', () => {
    if (cardsModalForced) return; // Não fechar quando for obrigatório
    hideCardsModal();
  });

  // Victory modal buttons
  const victoryCloseBtn = document.getElementById('victory-close');
  const victoryBackdrop = document.getElementById('victory-backdrop');
  const victoryMenuBtn = document.getElementById('victory-menu');
  if (victoryCloseBtn) victoryCloseBtn.addEventListener('click', () => hideVictoryModal());
  if (victoryBackdrop) victoryBackdrop.addEventListener('click', () => hideVictoryModal());
  if (victoryMenuBtn) victoryMenuBtn.addEventListener('click', () => {
    tocarSomClick();
    hideVictoryModal();
    backToModeSelection();
  });

  // Reinforce modal buttons
  const reinforceBackdrop = document.getElementById('reinforce-backdrop');
  const reinforceClose = document.getElementById('reinforce-close');
  const reinforceMinus = document.getElementById('reinforce-minus');
  const reinforcePlus = document.getElementById('reinforce-plus');
  const reinforceConfirm = document.getElementById('reinforce-confirm');
  const reinforceCancel = document.getElementById('reinforce-cancel');
  // Backdrop do reforço removido - não deve fechar ao clicar fora
  // if (reinforceBackdrop) reinforceBackdrop.addEventListener('click', hideReinforceModal);
  if (reinforceClose) reinforceClose.addEventListener('click', esconderInterfaceReforco);

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
      
      // Verificar se alguma interface HTML está aberta (modal)
      const interfaceHTMLAberta = isAnyHTMLInterfaceOpen();
      if (interfaceHTMLAberta) {
        
        // Impedir propagação do evento para outros handlers
        if (pointer && pointer.event && typeof pointer.event.stopPropagation === 'function') {
          try { pointer.event.stopPropagation(); } catch (_) {}
        }
        return; // Bloquear completamente a interação
      }
      
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
      
      // Interface de transferência agora é HTML/CSS, não precisa de detecção de clique Phaser
      
      // Interface de remanejamento agora é HTML/CSS, não precisa de detecção de clique Phaser
      
      // Verificar se há modais abertos (objetivo ou cartas território)
      if (modalObjetivoAberto || modalCartasTerritorioAberto) {
        const scene = currentScene;
        if (scene && scene.children && scene.children.list) {
          const modalContainer = scene.children.list.find(child => child.type === 'Container' && child.depth === 21);
          if (modalContainer && typeof modalContainer.getBounds === 'function') {
            const bounds = modalContainer.getBounds();
            const isOutside = pointer.x < bounds.left || pointer.x > bounds.right || pointer.y < bounds.top || pointer.y > bounds.bottom;
            if (isOutside) {
              
              fecharTodasModais();
            } else {
              
            }
          }
        }
        // Em qualquer caso, impedir interação com o mapa
        cliqueEmInterface = true;
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
  
  
  
  // Processar estado pendente se houver
  if (pendingGameState) {
    
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
  
  // Disponibilizar os polígonos globalmente para previews HTML
  try { window.territoryPolygons = window.territoryPolygons || {}; } catch(_) {}
  
  const gameState = getGameState();
  if (!gameState) {
    
    return;
  }
  
  
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
     pontos: [1060,247,1054,260,1038,272,1021,277,1006,277,991,290,964,311,886,297,861,218,826,264,847,314,842,344,908,352,964,349,981,354,997,363,1008,363,1020,372,1033,373,1043,374,1055,369,1064,363,1057,351,1066,341,1075,332,1066,323,1069,303,1077,290,1089,278,1098,272,1092,254,1077,250],
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

  // Expor polígonos dos territórios para componentes HTML (ex.: preview nas cartas)
  try { window.territoryPolygons = dadosGeograficos; } catch (_) {}

  
  
  
  
  if (gameState.paises.length === 0) {
    
    
    // Ensure scene is ready before creating territories
    if (!scene || !scene.add) {
      
      return;
    }
    
    gameState.paises = novosPaises.map(pais => {
      const obj = { ...pais };

      const geo = dadosGeograficos[pais.nome];
      if (!geo) {
        
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
     
     // Ensure polygon was created successfully
     if (!obj.polygon) {
       
       return obj;
     }
     
     obj.polygon.setOrigin(0, 0);
     obj.polygon.setStrokeStyle(4, 0x000000, 1); // Add black border for visibility
     obj.polygon.setInteractive({ 
       useHandCursor: true,
       hitArea: new Phaser.Geom.Polygon(pontosRelativos),
       hitAreaCallback: Phaser.Geom.Polygon.Contains
     });
     
     // Debug logs for first few territories
     if (gameState.paises.length < 5) {
       
       
       
       
       
       
       
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
      
    // Ocultar tropas Phaser se o sistema HTML estiver ativo
    if (htmlTroopsEnabled) {
      obj.troopCircle.setVisible(false);
      obj.troopText.setVisible(false);
    }
             // Eventos de hover para mostrar/esconder o texto
             obj.polygon.on('pointerover', (pointer) => {
               obj.text.setVisible(true);
             });
             
             obj.polygon.on('pointerout', (pointer) => {
               obj.text.setVisible(false);
             });
             
             obj.polygon.on('pointerdown', (pointer, localX, localY, event) => {
         // Bloquear interação com o mapa caso qualquer interface HTML esteja aberta
         const interfaceAberta = isAnyHTMLInterfaceOpen();
         if (interfaceAberta) {
           
           if (event && typeof event.stopPropagation === 'function') {
             try { event.stopPropagation(); } catch (_) {}
           } else if (pointer && pointer.event && typeof pointer.event.stopPropagation === 'function') {
             try { pointer.event.stopPropagation(); } catch (_) {}
           }
           return;
         }
         // Fechar indicação de início de turno automaticamente em qualquer interação
         fecharIndicacaoInicioTurnoAutomatico();
         
         // DEBUG: Mostrar coordenadas exatas do clique
         
         
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
                 mostrarMensagem(`❌ Primeiro coloque todas as ${totalBonus} tropas de ${getText('bonus').toLowerCase()} restantes! (${gameState.continentePrioritario.nome}: ${gameState.continentePrioritario.quantidade})`);
               } else {
                 mostrarMensagem("❌ Este país não pertence a nenhum continente com tropas de bônus pendentes!");
               }
               return;
             }
             
             // Verificar se já existe uma interface aberta
             if (interfaceReforco) {
               
               return;
             }
             
             // Pode colocar tropa de bônus neste país
             mostrarInterfaceReforco(obj, pointer, scene);
             return;
           } else {
             // Verificar se já existe uma interface aberta
             if (interfaceReforco) {
               
               return;
             }
             
             // Não há tropas de bônus, pode colocar tropas base
             mostrarInterfaceReforco(obj, pointer, scene);
             return;
           }
         }

         // Verificar se está na fase de remanejamento
         if (gameState.faseRemanejamento && obj.dono === gameState.turno && gameState.turno === gameState.meuNome) {
           
           
           
           
           
           
           if (!gameState.selecionado) {
             // Selecionar território de origem
             gameState.selecionado = obj;
             // Aplicar borda branca grossa e elevação no território de origem
             obj.polygon.setStrokeStyle(8, 0xffffff, 1);
             criarElevacaoTerritorio(obj.nome, scene);
             mostrarMensagem(`Território de origem selecionado: ${obj.nome}. Clique em um território vizinho para mover tropas.`);
             tocarSomHuh();
             
           } else if (gameState.selecionado === obj) {
             // Deselecionar
             obj.polygon.setStrokeStyle(4, 0x000000, 1);
             removerElevacaoTerritorio(obj.nome, scene);
             gameState.selecionado = null;
             mostrarMensagem('Seleção cancelada');
             
           } else if (gameState.selecionado.vizinhos.includes(obj.nome) && obj.dono === gameState.turno) {
             // Destacar território de destino com borda branca grossa e elevação
             obj.polygon.setStrokeStyle(8, 0xffffff, 1);
             criarElevacaoTerritorio(obj.nome, scene);
             
             // Verificar se é possível mover tropas antes de mostrar a interface
             emitWithRoom('verificarMovimentoRemanejamento', {
               origem: gameState.selecionado.nome,
               destino: obj.nome
             });
           } else {
             
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
          // Bloquear ataques enquanto a interface de transferência pós-conquista estiver aberta
          if (modalTransferenciaAberta) {
            mostrarMensagem('⚠️ Confirme ou cancele a transferência antes de atacar novamente.');
            return;
          }

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
    // Ensure we have both old and new country data
    if (!gameState.paises[i] || !novosPaises[i]) {
      
      continue;
    }

    gameState.paises[i].dono = novosPaises[i].dono;
    gameState.paises[i].tropas = novosPaises[i].tropas;
    gameState.paises[i].vizinhos = novosPaises[i].vizinhos;
    
    // Ensure text object exists before updating
    if (gameState.paises[i].text && gameState.paises[i].text.setText) {
      gameState.paises[i].text.setText(getTextoPais(gameState.paises[i]));
    }
    
    // Atualizar círculo e texto das tropas
    if (gameState.paises[i].troopCircle && gameState.paises[i].troopText) {
      // Atualizar cor do círculo baseada no dono
      gameState.paises[i].troopCircle.setFillStyle(coresDosDonos[gameState.paises[i].dono] || 0xffffff, 1);
      gameState.paises[i].troopText.setText(gameState.paises[i].tropas.toString());
    }
    
    // Atualizar tropas HTML se estiver habilitado
    if (htmlTroopsEnabled) {
      updateHTMLTroopIndicator(gameState.paises[i]);
    }
    
    // Atualizar continentes HTML se estiver habilitado
    if (htmlContinentsEnabled && i === gameState.paises.length - 1) {
      // Atualizar apenas uma vez no final do loop
      updateAllContinentLabels();
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
      if (gameState.paises[i].polygon && gameState.paises[i].polygon.setFillStyle) {
        gameState.paises[i].polygon.setFillStyle(coresDosDonos[gameState.paises[i].dono], 0.7);
        gameState.paises[i].polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca da indicação de turno
      }
    } else if (pertenceAoContinentePrioritario) {
      if (gameState.paises[i].polygon && gameState.paises[i].polygon.setFillStyle) {
        gameState.paises[i].polygon.setFillStyle(coresDosDonos[gameState.paises[i].dono], 0.7);
        gameState.paises[i].polygon.setStrokeStyle(6, 0xffffff, 1); // Borda branca grossa para continente prioritário
      }
      
      // Aplicar animação de salto se não estiver já animando
      if (!gameState.paises[i].polygon.timelineSalto) {
        
        gameState.paises[i].polygon.timelineSalto = criarAnimacaoSalto(gameState.paises[i].polygon, scene);
      }
      
      // Aplicar elevação se não estiver elevado
      if (!gameState.paises[i].elevado) {
        
        criarElevacaoTerritorio(gameState.paises[i].nome, scene);
      }
    } else {
      if (gameState.paises[i].polygon && gameState.paises[i].polygon.setFillStyle) {
        gameState.paises[i].polygon.setFillStyle(coresDosDonos[gameState.paises[i].dono], 0.7);
        gameState.paises[i].polygon.setStrokeStyle(4, 0x000000, 1); // Borda preta normal
      }
      
      // Parar animação de salto se estiver animando
      if (gameState.paises[i].polygon.timelineSalto) {
        
        pararAnimacaoSalto(gameState.paises[i].polygon, scene);
      }
      
      // Remover elevação se estiver elevado
      if (gameState.paises[i].elevado) {
        
        removerElevacaoTerritorio(gameState.paises[i].nome, scene);
      }
    }
  }
  gameState.selecionado = null;
  
  // Adicionar indicadores de continentes após os territórios serem carregados
  
  // Desenhar linhas tracejadas usando o mesmo sistema de posicionamento dos textos (Phaser)
  const dadosGeograficosLinha = {
    "Highmoor": {
      pontos: [305,165,252,223,345,279,358,279,373,279,384,279,378,268,373,257,364,253,366,236,370,223,386,215,380,203,370,198,360,189,349,182,336,168,322,163]
    },
    "Stormfen": {
      pontos: [111,194,194,141,206,132,207,122,207,114,219,115,233,116,248,119,265,125,273,132,274,142,283,151,302,151,307,162]
    },
    "Blackmere": {
      pontos: [592,145,600,137,609,124,622,116,632,112,630,123,634,131,638,137,629,141,627,156,637,162,646,166,654,171,667,171,684,166,695,173,707,175,714,179,720,191,721,200,713,201,706,198,691,197,676,198,662,198,650,197,636,196,625,196,616,198,608,197,610,180,611,166,603,153]
    },
    "Duskmere": {
      pontos: [555,246,555,231,559,217,569,207,584,203,598,200,613,199,624,198,642,198,654,198,669,198,681,198,693,198,705,198,715,201,711,209,703,217,698,226,693,234,685,238,679,244,673,252,669,264,661,268,652,268,643,268,634,268,625,270,632,278,637,283,646,287,636,294,627,293,618,292,611,288,604,287,596,286,600,275,603,267,598,257,591,249,585,253,570,250]
    },
    "Nihadara": {
      pontos: [715,135,729,136,739,141,748,142,764,132,774,127,797,134,812,128,826,121,833,126,838,134,845,141,851,150,853,161,854,174,853,183,852,192,841,192,826,189,810,185,800,184,782,184,764,183,750,183,740,176,733,161,721,156,714,144]
    },
    "Shōrenji": {
      pontos: [823,269,836,252,845,242,851,229,857,218,857,206,850,197,836,192,823,191,808,188,797,186,782,185,768,185,758,185,747,185,747,197,740,206,730,214,728,225,723,231,715,233,723,241,739,244,754,246,773,248,790,252,803,255,811,260]
    },
    "Kaer'Tai": {
      pontos: [711,237,723,242,736,244,753,249,765,251,786,253,800,257,812,261,828,272,834,280,837,290,842,303,845,313,845,320,845,332,846,346,845,359,846,370,836,370,826,371,818,374,810,378,809,366,795,354,790,346,780,340,777,330,771,320,765,307,763,296,776,295,777,287,766,284,748,278,739,275,732,280,725,290,715,293,703,293,695,294,687,284,687,271,684,260,690,250,702,246,710,246]
    },
    "Zul'Marak": {
      pontos: [527,367,537,354,549,345,563,336,574,337,583,324,582,311,596,312,606,315,618,317,631,312,640,321,650,323,660,303,663,317,663,325,662,334,662,341,661,349,661,362,658,385,656,394,621,436,601,438,589,440,582,441,573,441,566,444,555,442,551,428,541,424,530,421,527,415,523,392,530,380]
    },
    "Ravenspire": {
      pontos: [463,450,494,454,521,466,526,474,509,482,497,487,490,509,486,528,466,538,451,546,444,562,430,573,420,593,402,579,408,502,397,458,436,427,453,430,461,439]
    },
    "Aetheris": {
      pontos: [1094,458,1083,454,1076,454,1070,458,1067,470,1063,480,1069,492,1079,485,1089,487,1088,472,1080,466,1095,463]
    },
    "Dawnwatch": {
      pontos: [1113,475,1128,472,1144,472,1156,471,1165,479,1174,485,1184,491,1196,505,1182,505,1171,497,1162,496,1153,496,1144,488,1134,485,1123,482]
    },
    "Mistveil": {
      pontos: [1078,511,1069,517,1060,524,1050,531,1039,537,1025,544,1020,554,1022,567,1019,580,1011,588,1010,597,1022,597,1034,593,1048,590,1063,585,1077,582,1089,581,1099,587,1114,591,1114,605,1122,609,1139,614,1153,610,1165,599,1173,597,1179,585,1188,581,1189,567,1184,555,1175,543,1164,529,1162,513,1154,504,1152,514,1148,524,1138,531,1127,528,1119,518,1123,509,1110,504,1099,504,1097,512,1094,519,1086,514]
    },
    "Ish'Tanor": {
      pontos: [963,349,976,350,991,355,1005,361,1016,365,1032,371,1048,371,1043,379,1025,378,1015,380,1008,389,1014,400,1025,404,1025,413,1020,422,1010,426,1001,423,988,413,989,425,994,434,999,440,1034,448,1044,442,1053,442,1058,448,1061,456,1060,465,1053,474,1047,482,1034,484,1024,479,1015,468,1013,459,1027,457,1034,454,999,451,985,451,980,434,973,417,973,401,964,385,963,366]
    },
    "Darakai": {
      pontos: [961,352,962,365,962,379,966,388,970,402,973,418,975,427,983,442,987,461,999,472,1005,482,1005,491,997,491,984,484,976,475,970,460,963,449,967,432,963,416,961,405,955,393,946,383,937,378,928,384,923,394,919,406,914,418,913,433,909,441,898,436,889,423,877,408,871,397,863,384,852,375,842,372,847,357,846,344,859,346,883,350,903,353,922,352,942,349]
    },
    "Frosthollow": {
      pontos: [310,112,328,106,344,109,356,102,367,90,382,87,395,81,409,72,426,67,444,61,460,72,478,73,492,76,509,77,522,81,515,89,503,101,489,105,482,114,477,124,466,128,456,130,449,139,451,146,442,150,435,155,433,163,429,170,422,179,422,188,419,197,412,199,403,191,395,177,384,174,373,171,367,163,359,164,348,161,338,150,341,135,327,124,316,119]
    }
  };
  
  // Calcular centro dos territórios usando o mesmo método dos textos
  const calcularCentro = (pontos) => {
    let somaX = 0;
    let somaY = 0;
    for (let i = 0; i < pontos.length; i += 2) {
      somaX += pontos[i];
      somaY += pontos[i + 1];
    }
    const centroX = somaX / (pontos.length / 2);
    const centroY = somaY / (pontos.length / 2);
    return { centroX, centroY };
  };
  
  // Array com todas as conexões específicas entre territórios (apenas territórios que existem)
  const conexoes = [
    { origem: "Blackmere", destino: "Nihadara" },
    { origem: "Duskmere", destino: "Shōrenji" },
    { origem: "Kaer'Tai", destino: "Duskmere" },
    { origem: "Highmoor", destino: "Frosthollow" },
    { origem: "Stormfen", destino: "Frosthollow" },
    { origem: "Ravenspire", destino: "Zul'Marak" },
    { origem: "Ish'Tanor", destino: "Aetheris" },
    { origem: "Aetheris", destino: "Dawnwatch" },
    { origem: "Dawnwatch", destino: "Mistveil" },
    { origem: "Aetheris", destino: "Mistveil" },
    { origem: "Darakai", destino: "Mistveil" }
  ];
  
  // Desenhar linhas tracejadas entre centros (apenas se modo Phaser estiver habilitado)
  if (phaserConnectionLinesEnabled) {
    conexoes.forEach(conexao => {
      const origemGeo = dadosGeograficosLinha[conexao.origem];
      const destinoGeo = dadosGeograficosLinha[conexao.destino];
      
      if (origemGeo && destinoGeo) {
        const origemCentro = calcularCentro(origemGeo.pontos);
        const destinoCentro = calcularCentro(destinoGeo.pontos);
        
        
        
        
        
        desenharLinhaTracejada(scene, origemCentro.centroX, origemCentro.centroY, destinoCentro.centroX, destinoCentro.centroY);
      } else {
        
      }
    });
  } else {
    // Se usando HTML, garantir renderização das conexões após atualizar países
    updateAllConnectionsDebounced();
  }
  
  // Atualizar cards dos jogadores se estiverem visíveis
  const panel = document.getElementById('player-info-panel');
  if (panel && panel.classList.contains('open')) {
    updatePlayerInfoPanel();
  }
  
  
  
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
    
    return;
  }
  
  
  
  
  
  
  if (gameState.faseRemanejamento && gameState.meuNome === gameState.turno) {
    botaoTurno.textContent = getText('endTurnButton');
    
  } else if (gameState.meuNome === gameState.turno) {
    botaoTurno.textContent = getText('endAttackButton');
    
  } else {
    botaoTurno.textContent = getText('endTurnButton');
    
  }
}
function limparSelecao() {
  
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
  
  // Traduzir nomes de cores nas mensagens
  texto = translatePlayerColorsInMessage(texto);
  
  // Handle game restart
  if (texto.includes('Jogo reiniciado')) {
    stopTurnTimer(); // Stop any existing timer
  }
  
  // Verificar se é uma conquista de continente para disparar efeito de onda
  if (texto.includes('conquistou o continente')) {
    
    
    // Extrair nome do continente da mensagem
    const match = texto.match(/conquistou o continente ([^!]+)/);
    if (match && match[1]) {
      const nomeContinente = match[1].trim();
      
      
      // Disparar efeito de onda após um pequeno delay
      setTimeout(() => {
        const currentScene = window.currentScene;
        if (currentScene) {
          criarEfeitoOndaContinente(nomeContinente, currentScene);
        } else {
          
        }
      }, 500); // Delay para sincronizar com a mensagem
    }
  }

  // SEMPRE incluir a mensagem no histórico (removido o filtro)
  // Todas as mensagens do servidor agora são traduzidas e incluídas

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
  
  
  
  if (!scene || !scene.add) {
    
    return;
  }
  
  const gameState = getGameState();
  if (!gameState) {
    
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
  const mainMessage = scene.add.text(0, -50, isPlayerVictory ? getText('gameInstructionsVictory') : `${getTranslatedPlayerColor(nomeJogador)} ${getText('victoryByElimination')}`, {
    fontSize: '20px',
    fill: isPlayerVictory ? '#33cc33' : '#ffcc00',
    align: 'center',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 1
  }).setOrigin(0.5).setDepth(2);
  contentContainer.add(mainMessage);
  
  // Cards dos jogadores
  const playersTitle = scene.add.text(0, -30, getText('finalResult'), {
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
      statusText = getText('winner');
      statusColor = '#33cc33';
    } else if (jogador.eliminado) {
      statusText = getText('eliminated');
      statusColor = '#ff3333';
    } else if (jogador.isCPU) {
      statusText = getText('cpu');
      statusColor = '#ffaa00';
    } else if (!jogador.ativo) {
      statusText = getText('inactive');
      statusColor = '#ff3333';
    } else {
      statusText = getText('active');
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
      const victoryType = scene.add.text(0, yOffset, `${getText('victoryType')}: ${resumoJogo.tipoVitoria === 'eliminacao' ? getText('totalElimination') : getText('objectiveComplete')}`, {
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
        const duration = scene.add.text(0, yOffset, `${getText('duration')}: ${resumoJogo.estatisticas.duracao}`, {
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
        const attacks = scene.add.text(0, yOffset, `${getText('totalAttacks')}: ${resumoJogo.estatisticas.totalAtaques}`, {
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
    const summaryTitle = scene.add.text(0, yOffset, getText('actionsSummary'), {
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
      const noActionsText = scene.add.text(0, yOffset, getText('noImportantActions'), {
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
  // Fechar versão Phaser (legado) se existir
  if (window.overlay) { try { window.overlay.destroy(); } catch(_){} window.overlay = null; }
  if (window.containerVitoria) { try { window.containerVitoria.destroy(); } catch(_){} window.containerVitoria = null; }
  // Fechar modal HTML
  const vp = document.getElementById('victory-popup');
  const vb = document.getElementById('victory-backdrop');
  if (vp) vp.style.display = 'none';
  if (vb) vb.style.display = 'none';
}

// Função para tocar som de vitória
function tocarSomTerritoryWin() {
  try {
    const audio = new Audio('assets/territorywin.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => {
      console.error('Erro ao tocar som de vitória:', e);
    });
  } catch (e) {
    console.error('Erro ao tocar som de vitória:', e);
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
    
    return;
  }
  
  // Encontrar os territórios no mapa
  const territorioOrigem = gameState.paises.find(p => p.nome === origem);
  const territorioDestino = gameState.paises.find(p => p.nome === destino);
  
  if (!territorioOrigem || !territorioDestino) {
    
    return;
  }
  
  // Verificar se os territórios têm as propriedades necessárias
  if (!territorioOrigem.text || !territorioDestino.text) {
    
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
function mostrarEfeitoReforco(territorio, jogador, scene, quantidade = 1) {
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    
    return;
  }
  
  // Encontrar o território no array de países
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais) {
    
    return;
  }

  // Verificar se o território tem a propriedade text
  if (!pais.text) {
    
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

  // Criar texto flutuante com a quantidade correta
  const textoReforco = scene.add.text(posX, posY - 50, `🛡️ +${quantidade}`, {
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
  
  // Aplicar efeito visual no território (mantém borda e elevação)
  territorio.polygon.setStrokeStyle(8, 0xffffff, 1);
  criarElevacaoTerritorio(territorio.nome, scene);

  // Preencher modal HTML
  const popup = document.getElementById('reinforce-popup');
  const backdrop = document.getElementById('reinforce-backdrop');
  if (!popup) return;
  document.getElementById('reinforce-title').textContent = (totalBonus > 0 && gameState.continentePrioritario)
    ? `${getText('bonus')} ${gameState.continentePrioritario.nome}` : getText('reinforceTitle');
  document.getElementById('reinforce-territory-name').textContent = territorio.nome;
  document.getElementById('reinforce-territory-troops').textContent = getText('reinforceTerritoryTroops', { troops: territorio.tropas });
  const qtyEl = document.getElementById('reinforce-qty');
  const minusBtn = document.getElementById('reinforce-minus');
  const plusBtn = document.getElementById('reinforce-plus');
  const confirmBtn = document.getElementById('reinforce-confirm');
  const cancelBtn = document.getElementById('reinforce-cancel');

  // Atualizador de quantidade
  function updateQty() {
    qtyEl.textContent = `${gameState.tropasParaColocar}/${tropasDisponiveis}`;
  }
  updateQty();

  // Handlers
  let incInterval = null;
  let decInterval = null;
  function startInc() {
    if (incInterval) return;
    incInterval = setInterval(() => {
      if (gameState.tropasParaColocar < tropasDisponiveis) {
        gameState.tropasParaColocar = Math.min(tropasDisponiveis, gameState.tropasParaColocar + 1);
        updateQty();
      }
    }, 120);
  }
  function stopInc() { if (incInterval) { clearInterval(incInterval); incInterval = null; } }
  function startDec() {
    if (decInterval) return;
    decInterval = setInterval(() => {
      if (gameState.tropasParaColocar > 1) {
        gameState.tropasParaColocar = Math.max(1, gameState.tropasParaColocar - 1);
        updateQty();
      }
    }, 120);
  }
  function stopDec() { if (decInterval) { clearInterval(decInterval); decInterval = null; } }

  if (minusBtn) {
    minusBtn.onmousedown = () => { tocarSomClick(); if (gameState.tropasParaColocar > 1) { gameState.tropasParaColocar--; updateQty(); } startDec(); };
    minusBtn.onmouseup = minusBtn.onmouseleave = () => stopDec();
  }
  if (plusBtn) {
    plusBtn.onmousedown = () => { tocarSomClick(); if (gameState.tropasParaColocar < tropasDisponiveis) { gameState.tropasParaColocar++; updateQty(); } startInc(); };
    plusBtn.onmouseup = plusBtn.onmouseleave = () => stopInc();
  }
  if (confirmBtn) confirmBtn.onclick = () => { tocarSomClick(); confirmarReforco(); };
  if (cancelBtn) cancelBtn.onclick = () => { tocarSomClick(); esconderInterfaceReforco(); };

  // Exibir modal
  popup.style.display = 'flex';
  if (backdrop) backdrop.style.display = 'block';
}

function esconderInterfaceReforco() {
  // Fechar modal HTML
  hideReinforceModal();
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
        
      } else {
        // Remover efeito de elevação e borda branca apenas se não for território prioritário
        territorio.polygon.setStrokeStyle(4, 0x000000, 1);
        // Obter a scene do polígono do território
        const scene = territorio.polygon.scene;
        if (scene) {
          removerElevacaoTerritorio(territorio.nome, scene);
          
        }
      }
    }
    gameState.tropasParaColocar = 0;
    gameState.territorioSelecionadoParaReforco = null;
  }
}

function hideReinforceModal() {
  const popup = document.getElementById('reinforce-popup');
  const backdrop = document.getElementById('reinforce-backdrop');
  if (popup) popup.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
}

function confirmarReforco() {
  const gameState = getGameState();
  if (!gameState) return;
  
  if (gameState.territorioSelecionadoParaReforco && gameState.tropasParaColocar > 0) {
    
    
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
    
  }
}

// Funções para interface de transferência após conquista
function mostrarInterfaceTransferenciaConquista(dados, scene) {
  // Esta função foi migrada para HTML/CSS
  // Agora usa showTransferModal() em vez desta implementação Phaser
  showTransferModal(dados);
}

function esconderInterfaceTransferenciaConquista(manterDados = false) {
  
  
  // Limpar intervalos de incremento/decremento se existirem
  if (window.incrementoIntervalTransferencia) {
    clearInterval(window.incrementoIntervalTransferencia);
    window.incrementoIntervalTransferencia = null;
  }
  if (window.decrementoIntervalTransferencia) {
    clearInterval(window.decrementoIntervalTransferencia);
    window.decrementoIntervalTransferencia = null;
  }
  
  // Esconder o modal HTML
  hideTransferModal();
  
  tropasParaTransferir = 0;
  if (!manterDados) {
    dadosConquista = null;
    
  } else {
    
  }
}

function esconderInterfaceRemanejamento() {
  
  
  const popup = document.getElementById('remanejamento-popup');
  const backdrop = document.getElementById('remanejamento-backdrop');
  
  if (popup) {
    popup.style.display = 'none';
  }
  if (backdrop) {
    backdrop.style.display = 'none';
  }
  
  interfaceRemanejamentoAberta = false;
  dadosRemanejamento = null;
  tropasParaMover = 1;
  
  // Limpar seleção de territórios e remover destaque
  const gameState = getGameState();
  if (gameState && gameState.selecionado) {
    // Remover borda branca e restaurar borda normal
    if (gameState.selecionado.polygon) {
      gameState.selecionado.polygon.setStrokeStyle(4, 0x000000, 1);
    }
    // Remover elevação do território de origem
    if (gameState.selecionado.polygon && gameState.selecionado.polygon.scene) {
      removerElevacaoTerritorio(gameState.selecionado.nome, gameState.selecionado.polygon.scene);
    }
    // Limpar seleção
    gameState.selecionado = null;
  }
  
  // Limpar qualquer outro território que possa estar destacado
  if (gameState && gameState.paises) {
    gameState.paises.forEach(pais => {
      if (pais.elevado && pais.polygon && pais.polygon.scene) {
        // Verificar se tem borda branca (indicando que foi selecionado durante remanejamento)
        if (pais.polygon.strokeStyle && pais.polygon.strokeStyle.color === 0xffffff && pais.polygon.strokeStyle.width === 8) {
          // Restaurar borda normal
          pais.polygon.setStrokeStyle(4, 0x000000, 1);
          // Remover elevação
          removerElevacaoTerritorio(pais.nome, pais.polygon.scene);
        }
      }
    });
  }
  
  // Garantir que todos os territórios voltem ao estado normal
  if (gameState && gameState.paises) {
    gameState.paises.forEach(pais => {
      if (pais.polygon && pais.polygon.scene) {
        // Se ainda tem borda branca grossa, restaurar para borda normal
        if (pais.polygon.strokeStyle && pais.polygon.strokeStyle.color === 0xffffff && pais.polygon.strokeStyle.width === 8) {
          pais.polygon.setStrokeStyle(4, 0x000000, 1);
        }
        // Se ainda está elevado, remover elevação
        if (pais.elevado) {
          removerElevacaoTerritorio(pais.nome, pais.polygon.scene);
        }
      }
    });
  }
}

function confirmarTransferenciaConquista() {
  
  
  
  
  if (dadosConquista && tropasParaTransferir >= 0) {
    
    const totalTropas = 1 + tropasParaTransferir; // 1 obrigatória + opcionais
    emitWithRoom('transferirTropasConquista', {
      territorioAtacante: dadosConquista.territorioAtacante,
      territorioConquistado: dadosConquista.territorioConquistado,
      quantidade: totalTropas
    });
    esconderInterfaceTransferenciaConquista(false);
  } else {
    
  }
}

function mostrarInterfaceRemanejamento(origem, destino, scene, quantidadeMaxima = null) {
  
  
  
  
  
  // Verificar se a interface já está aberta
  if (interfaceRemanejamentoAberta) {
    
    return;
  }
  
  // Calcular quantidade máxima
  const maxTropas = quantidadeMaxima || (origem.tropas - 1);
  
  // Armazenar dados para uso posterior
  dadosRemanejamento = {
    origem: origem,
    destino: destino,
    maxTropas: Math.max(0, maxTropas)
  };
  
  // Inicializar quantidade
  tropasParaMover = 1;
  
  // Obter elementos HTML
  const popup = document.getElementById('remanejamento-popup');
  const backdrop = document.getElementById('remanejamento-backdrop');
  const origemEl = document.getElementById('remanejamento-origem');
  const destinoEl = document.getElementById('remanejamento-destino');
  const origemTropasEl = document.getElementById('remanejamento-origem-tropas');
  const destinoTropasEl = document.getElementById('remanejamento-destino-tropas');
  const qtyEl = document.getElementById('remanejamento-qty');
  
  // Preencher dados da interface
  if (origemEl) origemEl.textContent = origem.nome;
  if (destinoEl) destinoEl.textContent = destino.nome;
  if (origemTropasEl) origemTropasEl.textContent = getText('remanejamentoOriginTroops', { troops: origem.tropas });
  if (destinoTropasEl) destinoTropasEl.textContent = getText('remanejamentoDestinationTroops', { troops: destino.tropas });
  if (qtyEl) qtyEl.textContent = `${tropasParaMover}/${dadosRemanejamento.maxTropas}`;
  
  // Mostrar interface
  if (backdrop) backdrop.style.display = 'block';
  if (popup) popup.style.display = 'flex';
  
  interfaceRemanejamentoAberta = true;
  
  
}
function mostrarCartasTerritorio(cartas, scene, forcarTroca = false) {
  // Verificar se a scene é válida
  if (!scene || !scene.add) {
    
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
      
      
      if (cartasSelecionadas.length === 3) {
        // Mapear os containers de carta de volta para os nomes dos territórios
        const territoriosSelecionados = cartasSelecionadas.map(cartaContainer => cartaContainer.getData('carta').territorio);
        
        
        emitWithRoom('trocarCartasTerritorio', territoriosSelecionados);
      } else {
        
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

// Cards Modal (HTML) Functions - global
function showCardsModal(cartas, forcarTroca = false) {
  fecharTodasModais();
  const popup = document.getElementById('cards-popup');
  const backdrop = document.getElementById('cards-backdrop');
  const grid = document.getElementById('cards-grid');
  const instructions = document.getElementById('cards-instructions');
  const exchangeBtn = document.getElementById('cards-exchange');
  const titleEl = document.querySelector('#cards-popup .cards-header h3');
  if (!popup || !backdrop || !grid || !instructions || !exchangeBtn || !titleEl) return;

  cardsModalForced = !!forcarTroca;
  cardsSelected = [];
  cardsCurrentList = Array.isArray(cartas) ? cartas : [];
  exchangeBtn.disabled = true;
  
  // Update title based on whether exchange is forced
  if (forcarTroca) {
    titleEl.textContent = '⚠️ TROCA OBRIGATÓRIA - ' + getText('cardsYourCards');
  } else {
    titleEl.textContent = getText('cardsYourCards');
  }

  // Render grid
  grid.innerHTML = '';
  if (cardsCurrentList.length === 0) {
    instructions.textContent = 'Você ainda não possui cartas território.';
  } else if (forcarTroca) {
    instructions.textContent = '⚠️ TROCA OBRIGATÓRIA: Você tem 5+ cartas na mão. Selecione 3 cartas para trocar antes de continuar jogando.';
    exchangeBtn.textContent = '🔄 TROCAR CARTAS (OBRIGATÓRIO)';
  } else {
    instructions.textContent = getText('cardsInstructions');
    exchangeBtn.textContent = getText('cardsExchange');
  }

  cardsCurrentList.forEach((carta) => {
    const item = document.createElement('div');
    item.className = 'card-item';
    item.dataset.territorio = carta.territorio;

    // Header com símbolo
    const header = document.createElement('div');
    header.className = 'card-header';
    const symbol = document.createElement('div');
    symbol.className = 'card-symbol';
    symbol.textContent = carta.simbolo || '🃏';
    header.appendChild(symbol);

    // Figura (preview do território)
    const figure = document.createElement('div');
    figure.className = 'card-figure';
    const svg = createTerritorySVG(carta.territorio, 120, 80);
    if (svg) figure.appendChild(svg);

    // Rodapé com nome
    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = carta.territorio;

    item.appendChild(header);
    item.appendChild(figure);
    item.appendChild(name);
    item.addEventListener('click', () => toggleCardSelection(item));

    grid.appendChild(item);
  });

  popup.style.display = 'flex';
  backdrop.style.display = 'block';
  modalCartasTerritorioAberto = true;
  
  // Update texts for current language
  updateGamePopupsTexts();
}

// Cria um SVG com o polígono do território, ajustando para caber no tamanho desejado
function createTerritorySVG(territorioNome, targetWidth = 120, targetHeight = 80) {
  try {
    const polygons = (window && window.territoryPolygons) ? window.territoryPolygons : null;
    if (!polygons || !polygons[territorioNome] || !Array.isArray(polygons[territorioNome].pontos)) {
      return null;
    }
    const pts = polygons[territorioNome].pontos;
    if (pts.length < 6) return null;

    // Calcular bounds originais
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < pts.length; i += 2) {
      const x = pts[i];
      const y = pts[i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);

    // Calcular escala e offsets para centralizar na viewBox desejada
    const scale = Math.min(targetWidth / width, targetHeight / height) * 0.9; // margem
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const offsetX = (targetWidth - scaledWidth) / 2;
    const offsetY = (targetHeight - scaledHeight) / 2;

    // Construir string de pontos já escalados/normalizados
    const mapped = [];
    for (let i = 0; i < pts.length; i += 2) {
      const x = ((pts[i] - minX) * scale) + offsetX;
      const y = ((pts[i + 1] - minY) * scale) + offsetY;
      mapped.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(targetWidth));
    svg.setAttribute('height', String(targetHeight));
    svg.setAttribute('viewBox', `0 0 ${targetWidth} ${targetHeight}`);

    // Fundo sutil
    const bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('x', '0');
    bg.setAttribute('y', '0');
    bg.setAttribute('width', String(targetWidth));
    bg.setAttribute('height', String(targetHeight));
    bg.setAttribute('rx', '6');
    bg.setAttribute('ry', '6');
    bg.setAttribute('fill', 'rgba(255,255,255,0.03)');
    svg.appendChild(bg);

    // Polígono do território
    const poly = document.createElementNS(svgNS, 'polygon');
    poly.setAttribute('points', mapped.join(' '));
    poly.setAttribute('fill', 'rgba(0, 119, 204, 0.5)');
    poly.setAttribute('stroke', '#00aaff');
    poly.setAttribute('stroke-width', '2');
    svg.appendChild(poly);

    // Borda decorativa
    const border = document.createElementNS(svgNS, 'rect');
    border.setAttribute('x', '0.5');
    border.setAttribute('y', '0.5');
    border.setAttribute('width', String(targetWidth - 1));
    border.setAttribute('height', String(targetHeight - 1));
    border.setAttribute('rx', '6');
    border.setAttribute('ry', '6');
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', 'rgba(255,255,255,0.06)');
    border.setAttribute('stroke-width', '1');
    svg.appendChild(border);

    return svg;
  } catch (_) {
    return null;
  }
}

function hideCardsModal() {
  const popup = document.getElementById('cards-popup');
  const backdrop = document.getElementById('cards-backdrop');
  if (popup) popup.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
  modalCartasTerritorioAberto = false;
  cardsModalForced = false;
  cardsSelected = [];
  cardsCurrentList = [];
}

function toggleCardSelection(itemEl) {
  const territorio = itemEl.dataset.territorio;
  const idx = cardsSelected.indexOf(territorio);
  if (idx >= 0) {
    cardsSelected.splice(idx, 1);
    itemEl.classList.remove('selected');
  } else {
    if (cardsSelected.length >= 3) return;
    cardsSelected.push(territorio);
    itemEl.classList.add('selected');
  }
  updateCardsInstructionsAndButton();
}

function updateCardsInstructionsAndButton() {
  const instructions = document.getElementById('cards-instructions');
  const exchangeBtn = document.getElementById('cards-exchange');
  if (!instructions || !exchangeBtn) return;
  
  const count = cardsSelected.length;
  
  if (cardsModalForced) {
    // Troca obrigatória - mostrar instruções específicas
    if (count === 0) {
      instructions.textContent = '⚠️ TROCA OBRIGATÓRIA: Selecione 3 cartas para trocar antes de continuar jogando.';
    } else if (count < 3) {
      instructions.textContent = `⚠️ TROCA OBRIGATÓRIA: Selecionadas: ${count}/3 - Selecione mais ${3-count} carta(s)`;
    } else {
      instructions.textContent = '✅ TROCA OBRIGATÓRIA: 3/3 selecionadas - Clique em Trocar Cartas para continuar';
    }
    exchangeBtn.textContent = '🔄 TROCAR CARTAS (OBRIGATÓRIO)';
  } else {
    // Troca opcional - instruções normais
    if (count === 0) {
      instructions.textContent = 'Clique nas cartas para selecionar (máximo 3)';
    } else if (count < 3) {
      instructions.textContent = `Selecionadas: ${count}/3`;
    } else {
      instructions.textContent = 'Selecionadas: 3/3 - Clique em Trocar Cartas';
    }
    exchangeBtn.textContent = '🔄 Trocar Cartas';
  }
  
  exchangeBtn.disabled = count !== 3;
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
    updateAllConnectionsDebounced();
    
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
    
    // Interface de transferência agora é HTML/CSS, não precisa de reposicionamento Phaser
    
    // Interface de remanejamento agora é HTML/CSS, não precisa de reposicionamento Phaser
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
    
    // Update game instructions for current language
    const instructionText = document.getElementById('instruction-text');
    if (instructionText && !gameState.turno) {
      instructionText.textContent = getText('gameInstructionsWaiting');
    }
    
    // Update player avatar color
    const playerAvatarEl = document.querySelector('.player-avatar');
    if (playerAvatarEl && displayName !== 'Carregando...') {
      // Use gameState.meuNome (cor atribuída pelo servidor) instead of displayName
      if (gameState.meuNome) {
        const playerColor = getPlayerColor(gameState.meuNome);
        
        playerAvatarEl.style.background = playerColor;
      } else {
        
        playerAvatarEl.style.background = '#4444ff'; // Default blue
      }
    }
    
    // Update HUD buttons for current language
    updateGameHUDTexts();
  }

  // Update player stats
  if (playerStatsEl) {
    const tropas = gameState.paises
      .filter(p => p.dono === gameState.meuNome)
      .reduce((soma, p) => soma + p.tropas, 0);
    const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
    const totalReforcos = gameState.tropasReforco + totalBonus;
    playerStatsEl.textContent = getText('playerStatsFormat', { 
      troops: tropas, 
      reinforcement: totalReforcos 
    });
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

    // Create marks for each player in the actual game order (from gameState.jogadores)
    const playerOrder = gameState.jogadores.map(j => j.nome);
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
          
        } else {
          // For multiple marks, calculate the center between first and last mark
          const firstMarkAngle = currentAngle;
          const lastMarkAngle = currentAngle + (360 / totalMarks * (territoryCount - 1));
          playerAngles[player] = (firstMarkAngle + lastMarkAngle) / 2;
          
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
        
      } else {
        turnPointerEl.style.display = 'none';
        
      }
    } else {
      turnPointerEl.style.display = 'none';
    }

    // Update turn text
    if (gameState.faseRemanejamento && gameState.meuNome === gameState.turno) {
      turnTextEl.textContent = getText('gameInstructionsTurnIndicator');
    } else     if (gameState.meuNome === gameState.turno) {
      turnTextEl.textContent = getText('gameInstructionsMyTurn');
    } else {
      turnTextEl.textContent = getText('gameInstructionsNotMyTurn');
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
        instruction = getText('gameInstructionsVictory');
      } else if (gameState.derrota) {
        instruction = getText('gameInstructionsDefeat');
      } else if (gameState.faseRemanejamento) {
        instruction = getText('gameInstructionsRemanejamento');
      } else {
        // Fase de ataque
        const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
        const totalReforco = gameState.tropasReforco + totalBonus;
        
        if (totalReforco > 0) {
          // Verificar se há tropas bônus de continente prioritário
          if (totalBonus > 0 && gameState.continentePrioritario) {
            instruction = getText('gameInstructionsPlaceBonus', { 
              bonus: totalBonus, 
              continent: gameState.continentePrioritario.nome 
            });
          } else {
            instruction = getText('gameInstructionsReinforce');
          }
        } else {
          instruction = getText('gameInstructionsAttack');
        }
      }
    } else {
      // Não é o turno do jogador
      if (gameState.vitoria) {
        instruction = getText('gameInstructionsGameOver');
      } else if (gameState.derrota) {
        instruction = getText('gameInstructionsGameOver');
      } else {
        const currentPlayer = gameState.jogadores.find(j => j.nome === gameState.turno);
        const isHumanPlayer = currentPlayer && !currentPlayer.isCPU;
        
        if (isHumanPlayer) {
          instruction = getText('gameInstructionsWaitingPlayer', { player: getTranslatedPlayerColor(gameState.turno) });
        } else {
          instruction = getText('gameInstructionsCPUPlaying', { player: getTranslatedPlayerColor(gameState.turno) });
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
        
        // Timer is now controlled by server
        // Local timer start removed - server sends turnTimerUpdate events
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
      
      
      if (territorio) {
        
      }
    }
    
    if (territorio && territorio.x && territorio.y) {
      // Criar uma linha do território ao indicador
      const linha = scene.add.graphics();
      linha.lineStyle(1, 0xffffff, 0.3); // Linha branca mais discreta: espessura 1, opacidade 0.3
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
      item.linha.lineStyle(1, 0xffffff, 0.3); // Reduzido: espessura 1, opacidade 0.3
      item.linha.beginPath();
      item.linha.moveTo(novoTerritorioX, novoTerritorioY);
      item.linha.lineTo(novoIndicadorX, novoIndicadorY);
      item.linha.strokePath();
    }
  });
}

// Objective Modal (HTML) - Global functions
function showObjectiveModal(objetivo) {
  try {
    fecharTodasModais();
  } catch (_) {}
  const popup = document.getElementById('objective-popup');
  const backdrop = document.getElementById('objective-backdrop');
  const iconEl = document.getElementById('objective-icon');
  const descEl = document.getElementById('objective-description');
  if (!popup || !iconEl || !descEl) {
    
    return;
  }
  let icone = '🎯';
  const desc = objetivo && objetivo.descricao ? String(objetivo.descricao) : getText('objectiveLoading');
  const lower = desc.toLowerCase();
  if (lower.includes('eliminar')) icone = '⚔️';
  else if (lower.includes('conquistar')) icone = '🏆';
  else if (lower.includes('territ')) icone = '🗺️';
  else if (lower.includes('continente')) icone = '🌍';
  iconEl.textContent = icone;
  
  // Traduzir nomes de cores na descrição do objetivo
  const descTraduzida = translatePlayerColorsInMessage(desc);
  descEl.textContent = descTraduzida;
  
  popup.style.display = 'flex';
  if (backdrop) backdrop.style.display = 'block';
  modalObjetivoAberto = true;
  
  // Update texts for current language
  updateGamePopupsTexts();
}

function hideObjectiveModal() {
  const popup = document.getElementById('objective-popup');
  const backdrop = document.getElementById('objective-backdrop');
  if (popup) popup.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
  modalObjetivoAberto = false;
}

// Função para fechar todas as modais
function fecharTodasModais() {
  // Fechar modal de objetivo
  if (modalObjetivoAberto) {
    hideObjectiveModal();
  }
  
  // Fechar modal de cartas território
  if (modalCartasTerritorioAberto) {
    hideCardsModal();
  }
  
  // Fechar modal de transferência
  if (modalTransferenciaAberta) {
    hideTransferModal();
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

// Objective Modal (HTML) Functions - global
function showObjectiveModal(objetivo) {
  try { fecharTodasModais(); } catch (_) {}
  const popup = document.getElementById('objective-popup');
  const backdrop = document.getElementById('objective-backdrop');
  const iconEl = document.getElementById('objective-icon');
  const descEl = document.getElementById('objective-description');
  if (!popup || !iconEl || !descEl) return;
  let icone = '🎯';
  const desc = objetivo && objetivo.descricao ? String(objetivo.descricao) : getText('objectiveLoading');
  const lower = desc.toLowerCase();
  if (lower.includes('eliminar')) icone = '⚔️';
  else if (lower.includes('conquistar')) icone = '🏆';
  else if (lower.includes('territ')) icone = '🗺️';
  else if (lower.includes('continente')) icone = '🌍';
  iconEl.textContent = icone;
  
  // Traduzir nomes de cores na descrição do objetivo
  const descTraduzida = translatePlayerColorsInMessage(desc);
  descEl.textContent = descTraduzida;
  
  popup.style.display = 'flex';
  if (backdrop) backdrop.style.display = 'block';
  modalObjetivoAberto = true;
}

// Victory Modal (HTML) Functions - global
function showVictoryModal(nomeJogador, resumoJogo) {
  try { fecharTodasModais(); } catch(_) {}
  
  const popup = document.getElementById('victory-popup');
  const backdrop = document.getElementById('victory-backdrop');
  const msg = document.getElementById('victory-message');
  const subtitle = document.getElementById('victory-subtitle');
  
  if (!popup || !msg || !subtitle) return;
  
  const gameState = getGameState();
  const isPlayerVictory = gameState && nomeJogador === gameState.meuNome;
  
  // Mensagem principal
        msg.textContent = isPlayerVictory ? getText('gameInstructionsVictory') : `${getTranslatedPlayerColor(nomeJogador)} ${getText('victoryByElimination')}`;
  subtitle.textContent = resumoJogo && resumoJogo.tipoVitoria
    ? `Tipo de Vitória: ${resumoJogo.tipoVitoria === 'eliminacao' ? 'Eliminação Total' : 'Objetivo Completo'}`
    : '';

  // Definir o vencedor no gameState para que fillObjectivesList funcione corretamente
  if (gameState) {
    gameState.vencedor = nomeJogador;
  }
  
  // Preencher cards dos jogadores
  fillPlayersGrid(nomeJogador, gameState);
  
  // Preencher objetivos dos jogadores (preferindo os do resumo de jogo)
  fillObjectivesList(gameState, resumoJogo);
  
  // Mostrar popup
  popup.style.display = 'flex';
  if (backdrop) backdrop.style.display = 'block';
  
  // Som de vitória
  try { tocarSomTerritoryWin(); } catch(_) {}
}



function fillPlayersGrid(nomeVencedor, gameState) {
  const playersGrid = document.getElementById('players-grid');
  if (!playersGrid || !gameState) return;
  
  playersGrid.innerHTML = '';
  
  // Obter dados dos jogadores
  const jogadores = gameState.jogadores || [];
  const paises = gameState.paises || [];
  
  // Mapear territórios por jogador
  const territoriosPorJogador = {};
  const tropasPorJogador = {};
  
  paises.forEach(pais => {
    if (pais.dono) {
      if (!territoriosPorJogador[pais.dono]) {
        territoriosPorJogador[pais.dono] = 0;
        tropasPorJogador[pais.dono] = 0;
      }
      territoriosPorJogador[pais.dono]++;
      tropasPorJogador[pais.dono] += pais.tropas || 0;
    }
  });
  
  // Cores dos jogadores
  const coresJogadores = {
    'CPU Fácil': '#ff6b6b',
    'CPU Médio': '#4ecdc4', 
    'CPU Difícil': '#45b7d1',
    'CPU Expert': '#f9ca24'
  };
  
  // Criar cards para todos os jogadores (incluindo eliminados)
  const todosJogadores = new Set();
  jogadores.forEach(j => todosJogadores.add(j.nome));
  Object.keys(territoriosPorJogador).forEach(nome => todosJogadores.add(nome));
  
  Array.from(todosJogadores).forEach((nomeJogador, index) => {
    const isWinner = nomeJogador === nomeVencedor;
    const isEliminated = !territoriosPorJogador[nomeJogador] || territoriosPorJogador[nomeJogador] === 0;
    // Identificar CPU: usar flag do estado se existir, senão fallback pelo nome
    const jogadorObj = jogadores.find(j => j.nome === nomeJogador);
    const isCPUFlag = jogadorObj && typeof jogadorObj.isCPU === 'boolean' ? jogadorObj.isCPU : null;
    const isHuman = isCPUFlag != null ? !isCPUFlag : !nomeJogador.startsWith('CPU');
    
    const territorios = territoriosPorJogador[nomeJogador] || 0;
    const tropas = tropasPorJogador[nomeJogador] || 0;
    
    // Cor do jogador
    let corJogador = coresJogadores[nomeJogador];
    if (!corJogador) {
      if (isHuman) {
        corJogador = '#4a90e2'; // Azul para humanos
      } else {
        const cores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a55eea', '#26de81'];
        corJogador = cores[index % cores.length];
      }
    }
    
    const card = document.createElement('div');
    card.className = `player-card ${isWinner ? 'winner' : ''} ${isEliminated ? 'eliminated' : ''}`;
    
    card.innerHTML = `
      <div class="player-info">
        <div class="player-avatar" style="background: ${corJogador}">
          ${isHuman ? '👤' : '🤖'}
        </div>
        <div class="player-details">
          <div class="player-name">${getRealUsername(nomeJogador)}</div>
          <div class="player-status">
            ${isWinner ? 'VENCEDOR' : isEliminated ? 'Eliminado' : 'Ativo'}
          </div>
        </div>
        ${isWinner ? '<div class="player-crown">👑</div>' : ''}
      </div>
      <div class="player-stats">
        <div class="player-stat">
          <span class="player-stat-label">🗺️ ${getText('territories')}</span>
          <span class="player-stat-value">${territorios}</span>
        </div>
        <div class="player-stat">
          <span class="player-stat-label">⚔️ ${getText('troops')}</span>
          <span class="player-stat-value">${tropas}</span>
        </div>
        <div class="player-stat">
          <span class="player-stat-label">🎯 Tipo</span>
          <span class="player-stat-value">${isHuman ? getText('human') : getText('cpu')}</span>
        </div>
        <div class="player-stat">
          <span class="player-stat-label">🏆 Status</span>
          <span class="player-stat-value">${isWinner ? getText('won') : isEliminated ? getText('lost') : getText('active')}</span>
        </div>
      </div>
    `;
    
    playersGrid.appendChild(card);
  });
}

function fillObjectivesList(gameState, resumoJogo = null) {
  const objectivesList = document.getElementById('objectives-list');
  if (!objectivesList || !gameState) return;
  
  objectivesList.innerHTML = '';
  
  const jogadores = gameState.jogadores || [];
  // Preferir objetivos vindos do resumo do jogo (servidor)
  const objetivos = (resumoJogo && resumoJogo.objetivos) ? resumoJogo.objetivos : (gameState.objetivos || {});
  
  // Definir objetivos padrão se não existirem
  const objetivosPadrao = {
    'eliminacao': getText('eliminateAllPlayers'),
    'continentes': getText('conquerContinents', { count: 2 }),
    'territorios': getText('conquerTerritories', { count: 24 })
  };
  
  jogadores.forEach(jogador => {
    // Suportar formatos: string ou objeto { descricao }
    const objValor = objetivos[jogador.nome];
    const objetivoJogador = objValor
      ? (typeof objValor === 'string' ? objValor : (objValor.descricao || objetivosPadrao.eliminacao))
      : (objetivosPadrao.eliminacao || getText('eliminateAllAdversaries'));
    
    // Verificar se o objetivo foi completado (simplificado)
    const isCompleted = gameState.vencedor === jogador.nome;
    
    const objectiveItem = document.createElement('div');
    objectiveItem.className = `objective-item ${isCompleted ? 'completed' : ''}`;
    
    objectiveItem.innerHTML = `
      <div class="objective-player">${getRealUsername(jogador.nome)}</div>
      <div class="objective-description">${objetivoJogador}</div>
      <div class="objective-status">${isCompleted ? '✅' : '❌'}</div>
    `;
    
    objectivesList.appendChild(objectiveItem);
  });
  
  // Se não há jogadores, mostrar mensagem
  if (jogadores.length === 0) {
    objectivesList.innerHTML = `<div style="color: #ccc; text-align: center; padding: 20px;">${getText('noObjectives')}</div>`;
  }
}

function hideVictoryModal() {
  const popup = document.getElementById('victory-popup');
  const backdrop = document.getElementById('victory-backdrop');
  if (popup) popup.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
}
// Função de teste para demonstrar a nova tela de vitória
function testVictoryScreen() {
  
  
  // Dados simulados para teste
  const dadosSimulados = {
    nomeVencedor: 'Jogador1',
    resumoJogo: {
      tipoVitoria: 'eliminacao',
      estatisticas: {
        duracao: '25:43',
        totalAtaques: 47,
        continentesConquistados: 3
      }
    },
    gameState: {
      meuNome: 'Jogador1',
      vencedor: 'Jogador1',
      jogadores: [
        { nome: 'Jogador1' },
        { nome: 'CPU Fácil' },
        { nome: 'CPU Médio' },
        { nome: 'CPU Difícil' }
      ],
      paises: [
        // Jogador1 - Vencedor
        { nome: 'Brasil', dono: 'Jogador1', tropas: 8 },
        { nome: 'Argentina', dono: 'Jogador1', tropas: 5 },
        { nome: 'Peru', dono: 'Jogador1', tropas: 12 },
        { nome: 'Uruguai', dono: 'Jogador1', tropas: 3 },
        { nome: 'Venezuela', dono: 'Jogador1', tropas: 7 },
        { nome: 'Colombia', dono: 'Jogador1', tropas: 4 },
        { nome: 'Mexico', dono: 'Jogador1', tropas: 6 },
        { nome: 'Estados Unidos', dono: 'Jogador1', tropas: 9 },
        { nome: 'Canada', dono: 'Jogador1', tropas: 5 },
        { nome: 'Groelandia', dono: 'Jogador1', tropas: 2 },
        { nome: 'Islandia', dono: 'Jogador1', tropas: 3 },
        { nome: 'Reino Unido', dono: 'Jogador1', tropas: 4 },
        { nome: 'Suecia', dono: 'Jogador1', tropas: 6 },
        { nome: 'Alemanha', dono: 'Jogador1', tropas: 8 },
        { nome: 'França', dono: 'Jogador1', tropas: 5 },
        { nome: 'Espanha', dono: 'Jogador1', tropas: 3 },
        { nome: 'Polônia', dono: 'Jogador1', tropas: 4 },
        { nome: 'Turquia', dono: 'Jogador1', tropas: 7 },
        { nome: 'Egito', dono: 'Jogador1', tropas: 6 },
        { nome: 'Sudan', dono: 'Jogador1', tropas: 2 },
        { nome: 'Nigeria', dono: 'Jogador1', tropas: 5 },
        { nome: 'Congo', dono: 'Jogador1', tropas: 3 },
        { nome: 'Africa do Sul', dono: 'Jogador1', tropas: 4 },
        { nome: 'Madagascar', dono: 'Jogador1', tropas: 2 },
        
        // CPU Fácil - Eliminado
        
        // CPU Médio - Eliminado
        
        // CPU Difícil - Eliminado
      ],
      objetivos: {
        'Jogador1': getText('eliminateAllAdversaries'),
        'CPU Fácil': getText('conquerTerritories', { count: 18 }),
        'CPU Médio': getText('conquerSpecificContinents', { continent1: 'América do Sul', continent2: 'Europa' }),
        'CPU Difícil': getText('conquerSpecificContinents', { continent1: 'América do Norte', continent2: 'África' })
      }
    }
  };
  
  // Simular gameState global
  const originalGetGameState = window.getGameState;
  window.getGameState = () => dadosSimulados.gameState;
  
  // Chamar a função de vitória
  showVictoryModal(dadosSimulados.nomeVencedor, dadosSimulados.resumoJogo);
  
  // Restaurar função original após 10 segundos
  setTimeout(() => {
    window.getGameState = originalGetGameState;
    
  }, 10000);
  
  
  
}

function showTransferModal(dados) {
  
  esconderInterfaceTransferenciaConquista(true);
  dadosConquista = dados;
  tropasParaTransferir = 0; // Começa com 0 tropas opcionais (1 obrigatória sempre)
  
  const popup = document.getElementById('transfer-popup');
  const backdrop = document.getElementById('transfer-backdrop');
  if (!popup) {
    
    return;
  }
  
  const origemEl = document.getElementById('transfer-origem');
  const destinoEl = document.getElementById('transfer-destino');
  const origemTroopsEl = document.getElementById('transfer-origem-tropas');
  const destinoTroopsEl = document.getElementById('transfer-destino-tropas');
  const qtyEl = document.getElementById('transfer-qty');
  const minusBtn = document.getElementById('transfer-minus');
  const plusBtn = document.getElementById('transfer-plus');
  const confirmBtn = document.getElementById('transfer-confirm');
  const cancelBtn = document.getElementById('transfer-cancel');
  const closeBtn = document.getElementById('transfer-close');
  
  // Calcular o máximo de tropas disponíveis para transferência
  // O servidor agora envia tropasAdicionais como apenas as tropas opcionais
  const maxDisponivel = dados.tropasAdicionais || 0;
  
  
  
  if (origemEl) origemEl.textContent = dados.territorioAtacante;
  if (destinoEl) destinoEl.textContent = dados.territorioConquistado;
  if (origemTroopsEl) origemTroopsEl.textContent = getText('transferOriginTroops', { troops: dados.tropasOrigem ?? '-' });
  if (destinoTroopsEl) destinoTroopsEl.textContent = getText('transferDestinationTroops', { troops: dados.tropasDestino ?? '-' });
  
  function updateQty() { 
    if (qtyEl) {
      const totalTropas = 1 + tropasParaTransferir; // 1 obrigatória + opcionais
      const maxTotal = 1 + maxDisponivel; // 1 obrigatória + máximo de opcionais
      qtyEl.textContent = `${totalTropas}/${maxTotal}`;
    }
  }
  updateQty();
  
  if (minusBtn) minusBtn.onclick = () => { 
    if (tropasParaTransferir > 0) { // Mínimo é 0 opcionais (1 obrigatória sempre)
      tropasParaTransferir--; 
      updateQty(); 
    } 
  };
  
  if (plusBtn) plusBtn.onclick = () => { 
    if (tropasParaTransferir < maxDisponivel) { 
      tropasParaTransferir++; 
      updateQty(); 
    } 
  };
  
  if (confirmBtn) confirmBtn.onclick = () => { 
    tocarSomClick(); 
    confirmarTransferenciaConquista(); 
    esconderInterfaceTransferenciaConquista(false); 
  };
  
  const cancelar = () => { 
    tocarSomClick(); 
    esconderInterfaceTransferenciaConquista(false); 
  };
  
  if (cancelBtn) cancelBtn.onclick = cancelar;
  if (closeBtn) closeBtn.onclick = cancelar;
  // Backdrop da transferência removido - não deve fechar ao clicar fora
  // if (backdrop) backdrop.onclick = cancelar;
  
  popup.style.display = 'flex';
  if (backdrop) backdrop.style.display = 'block';
  modalTransferenciaAberta = true;
}

function hideTransferModal() {
  const popup = document.getElementById('transfer-popup');
  const backdrop = document.getElementById('transfer-backdrop');
  if (popup) popup.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
  modalTransferenciaAberta = false;
}

function hideObjectiveModal() {
  const popup = document.getElementById('objective-popup');
  const backdrop = document.getElementById('objective-backdrop');
  if (popup) popup.style.display = 'none';
  if (backdrop) backdrop.style.display = 'none';
  modalObjetivoAberto = false;
}

// Action History Functions
function initializeActionHistory() {
  // Check if button already exists to prevent duplication
  const existingButton = document.getElementById('btn-history');
  if (existingButton) {
    
    return;
  }
  
  // Create chat button in the HUD
  const historyButton = document.createElement('button');
  historyButton.className = 'hud-button btn-history';
  historyButton.id = 'btn-history';
  historyButton.innerHTML = `<span>💬</span><span>${getText('chatTab').replace('💬 ', '')}</span>`;
  
  // Add to action buttons container
  const actionButtons = document.querySelector('.action-buttons');
  if (actionButtons) {
    actionButtons.appendChild(historyButton);
  }

  // (removido) Objective Modal (HTML) Functions - agora globais
  
  // Add event listener
  historyButton.addEventListener('click', () => {
    tocarSomClick();
    toggleHistoryPopup();
  });
  
  // Create history popup
  createHistoryPopup();
}

function createHistoryPopup() {
  // Check if popup already exists to prevent duplication
  const existingPopup = document.getElementById('history-popup');
  if (existingPopup) {
    
    return;
  }
  
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'history-popup';
  popup.className = 'history-popup';
  popup.style.display = 'none';
  
  // Create popup content with tabs
  popup.innerHTML = `
    <div class="history-header">
      <div class="history-tabs">
        <button class="history-tab active" id="chat-tab">${getText('chatTab')}</button>
        <button class="history-tab" id="history-tab">${getText('historyTab')}</button>
      </div>
      <button class="history-close" id="history-close">✕</button>
    </div>
    
    <!-- Chat Content -->
    <div class="chat-content" id="chat-content">
      <div class="chat-messages" id="chat-messages">
        <div class="chat-empty">${getText('chatEmpty')}</div>
      </div>
      <div class="chat-input-container" id="chat-input-container">
        <form class="chat-input-form" id="chat-form">
          <input type="text" class="chat-input" id="chat-input" placeholder="${getText('chatInputPlaceholder')}" maxlength="200">
          <button type="submit" class="chat-send-btn" id="chat-send-btn">${getText('chatSendButton')}</button>
        </form>
      </div>
    </div>
    
    <!-- History Content -->
    <div class="history-content" id="history-content">
      <div class="history-empty">${getText('historyEmpty')}</div>
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
  
  
  
  
  
}

function toggleHistoryPopup() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const popup = document.getElementById('history-popup');
  if (!popup) {
    
    return;
  }
  
  
  
  if (!gameState.historyPopupVisible) {
    // Fechar outras modais primeiro
    fecharTodasModais();
    
    // Abrir popup
    gameState.historyPopupVisible = true;
    popup.style.display = 'block';
    
    
    
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
    
  }
}

function switchToChat() {
  const gameState = getGameState();
  if (!gameState) return;
  
  gameState.currentTab = 'chat';
  
  
  
  // Update tab buttons
  document.getElementById('chat-tab').classList.add('active');
  document.getElementById('history-tab').classList.remove('active');
  
  // Show chat content, hide history content
  const chatContent = document.getElementById('chat-content');
  const historyContent = document.getElementById('history-content');
  
  
  
  
  chatContent.style.display = 'flex';
  historyContent.style.display = 'none';
  
  // Ensure input container is visible
  const inputContainer = document.getElementById('chat-input-container');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  
  
  
  
  
  if (inputContainer) {
    inputContainer.style.display = 'block';
    
  }
  
  if (chatForm) {
    chatForm.style.display = 'flex';
    
  }
  
  if (chatInput) {
    chatInput.style.display = 'block';
    
    
    
    
    
    
    
    // Debug parent elements
    const inputContainer = chatInput.parentElement;
    const chatForm = inputContainer?.parentElement;
    const chatContent = chatForm?.parentElement;
    
    
    
    
    
    
    
    
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
  
  // Traduzir nomes de cores no jogador e na mensagem
  const playerTraduzido = getTranslatedPlayerColor(player);
  const messageTraduzida = translatePlayerColorsInMessage(message);
  
  const chatMessage = {
    player: playerTraduzido,
    message: messageTraduzida,
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
    messagesContainer.innerHTML = `<div class="chat-empty">${getText('chatEmpty')}</div>`;
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
    content.innerHTML = `<div class="history-empty">${getText('historyEmpty')}</div>`;
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
          <div class="player-name-modal">${getRealUsername(jogador.nome)}</div>
          ${isCurrentTurn ? `<div class="turn-badge">${getText('currentTurn')}</div>` : ''}
        </div>
        <div class="player-stats-modal">
          <div class="stat-item">
            <span class="stat-label">${getText('territories')}</span>
            <span class="stat-value">${territorios}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">${getText('troops')}</span>
            <span class="stat-value">${tropas}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">${getText('cards')}</span>
            <span class="stat-value">${cartas}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">${getText('status')}</span>
            <span class="stat-value">${isActive ? getText('active') : getText('inactive')}</span>
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

function getTranslatedPlayerColor(playerName) {
  // Mapear nomes de cores para chaves de tradução
  const colorTranslationMap = {
    'Azul': 'blue',
    'Vermelho': 'red',
    'Verde': 'green',
    'Amarelo': 'yellow',
    'Preto': 'black',
    'Roxo': 'purple'
  };
  
  // Se o nome do jogador contém uma cor, retornar a tradução
  for (const [colorName, translationKey] of Object.entries(colorTranslationMap)) {
    if (playerName.includes(colorName)) {
      return getText(translationKey);
    }
  }
  
  // Caso contrário, retornar o nome original
  return playerName;
}

// Funções para mostrar modais de erro e informação
function showServerErrorModal() {
  const popup = document.getElementById('server-error-popup');
  const backdrop = document.getElementById('server-error-backdrop');
  const closeBtn = document.getElementById('server-error-close');
  const okBtn = document.getElementById('server-error-ok');
  
  if (!popup || !backdrop) {
    // Fallback para alert caso a UI não esteja carregada
    alert('Erro ao conectar com o servidor. Tente novamente.');
    return;
  }
  
  const hide = () => {
    popup.style.display = 'none';
    backdrop.style.display = 'none';
  };
  
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (okBtn) okBtn.addEventListener('click', hide);
  if (backdrop) backdrop.addEventListener('click', hide);
  
  popup.style.display = 'block';
  backdrop.style.display = 'block';
}

function showLoginErrorModal(message) {
  const popup = document.getElementById('login-error-popup');
  const backdrop = document.getElementById('login-error-backdrop');
  const closeBtn = document.getElementById('login-error-close');
  const okBtn = document.getElementById('login-error-ok');
  const messageEl = document.getElementById('login-error-message');
  
  if (!popup || !backdrop || !messageEl) {
    // Fallback para alert caso a UI não esteja carregada
    alert(message);
    return;
  }
  
  messageEl.textContent = message;
  
  const hide = () => {
    popup.style.display = 'none';
    backdrop.style.display = 'none';
  };
  
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (okBtn) okBtn.addEventListener('click', hide);
  if (backdrop) backdrop.addEventListener('click', hide);
  
  popup.style.display = 'block';
  backdrop.style.display = 'block';
}

function showDominiumDevModal() {
  const popup = document.getElementById('dominium-dev-popup');
  const backdrop = document.getElementById('dominium-dev-backdrop');
  const closeBtn = document.getElementById('dominium-dev-close');
  const okBtn = document.getElementById('dominium-dev-ok');
  
  if (!popup || !backdrop) {
    // Fallback para alert caso a UI não esteja carregada
    alert('🏰 Modo Dominium está em desenvolvimento!\n\nEste modo incluirá:\n• Campanhas estratégicas\n• Progressão de jogador\n• Conquistas e recompensas\n• Modo história\n\nVolte em breve!');
    return;
  }
  
  const hide = () => {
    popup.style.display = 'none';
    backdrop.style.display = 'none';
  };
  
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (okBtn) okBtn.addEventListener('click', hide);
  if (backdrop) backdrop.addEventListener('click', hide);
  
  popup.style.display = 'block';
  backdrop.style.display = 'block';
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
  
  
  // Verificar se já existe uma animação ativa
  if (polygon.timelineSalto) {
    
    pararAnimacaoSalto(polygon, scene);
  }
  
  // Salvar a posição original no próprio objeto polygon
  polygon.posicaoOriginal = { x: polygon.x, y: polygon.y };
  
  
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
  
  
  return tween;
}

// Função para parar animação de salto
function pararAnimacaoSalto(polygon, scene) {
  if (polygon.timelineSalto) {
    
    
    polygon.timelineSalto.stop();
    polygon.timelineSalto.remove();
    polygon.timelineSalto = null;
    
    // Restaurar posição original do polígono usando os valores salvos
    if (polygon.posicaoOriginal) {
      
      polygon.setPosition(polygon.posicaoOriginal.x, polygon.posicaoOriginal.y);
      // Limpar a referência da posição original
      delete polygon.posicaoOriginal;
    } else {
      
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
          
          pais.troopCircle.setPosition(pais.troopCircle.posicaoOriginal.x, pais.troopCircle.posicaoOriginal.y);
          delete pais.troopCircle.posicaoOriginal;
        }
        
        // Restaurar texto das tropas
        if (pais.troopText && pais.troopText.posicaoOriginal) {
          
          pais.troopText.setPosition(pais.troopText.posicaoOriginal.x, pais.troopText.posicaoOriginal.y);
          delete pais.troopText.posicaoOriginal;
        }
      }
    }
    
    
  }
}

// Função para limpar todas as animações de salto
function limparTodasAnimacoesSalto() {
  
  
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
  
  
  
  // Também limpar todas as elevações
  limparTodasElevacoes();
  
  // Verificar se ainda há tropas bônus antes de restaurar animações
  const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  const totalReforco = gameState.tropasReforco || 0;
  const tropasRestantes = totalReforco + totalBonus;
  
  
  
  // Só restaurar animações se ainda há tropas para colocar
  if (tropasRestantes > 0) {
    
    restaurarAnimacoesTerritoriosBonus();
  } else {
    
  }
}
// Função para restaurar animações de salto nos territórios bônus
function restaurarAnimacoesTerritoriosBonus() {
  const gameState = getGameState();
  if (!gameState) return;
  
  const totalBonus = Object.values(gameState.tropasBonusContinente).reduce((sum, qty) => sum + qty, 0);
  const totalReforco = gameState.tropasReforco || 0;
  const tropasRestantes = totalReforco + totalBonus;
  
  
  
  // Só restaurar se há tropas para colocar e é o turno do jogador
  if (tropasRestantes > 0 && gameState.meuNome === gameState.turno && gameState.continentePrioritario) {
    
    
    gameState.paises.forEach(pais => {
      if (pais.dono === gameState.turno && pais.polygon && pais.polygon.scene) {
        const continente = gameState.continentes[gameState.continentePrioritario.nome];
        if (continente && continente.territorios.includes(pais.nome)) {
          // Aplicar borda branca grossa
          pais.polygon.setStrokeStyle(6, 0xffffff, 1);
          
          // Aplicar animação de salto se não estiver já animando
          if (!pais.polygon.timelineSalto) {
            
            pais.polygon.timelineSalto = criarAnimacaoSalto(pais.polygon, pais.polygon.scene);
          }
          
          // Garantir que o território tenha elevação se necessário
          // Verificar se o território tem borda branca grossa mas não tem elevação
          const strokeStyle = pais.polygon.strokeStyle;
          if (strokeStyle && strokeStyle.color === 0xffffff && strokeStyle.width === 6) {
            // Verificar se não tem elevação aplicada usando a propriedade elevado
            if (!pais.elevado) {
              
              criarElevacaoTerritorio(pais.nome, pais.polygon.scene);
            }
          }
        }
      }
    });
  } else {
    
    
  }
}

// Função para criar efeito de onda quando conquista um continente
function criarEfeitoOndaContinente(nomeContinente, scene) {
  
  
  const gameState = getGameState();
  if (!gameState || !gameState.continentes[nomeContinente]) {
    
    return;
  }
  
  const continente = gameState.continentes[nomeContinente];
  const territoriosDoContinente = continente.territorios;
  
  // Encontrar todos os países do continente
  const paisesDoContinente = gameState.paises.filter(p => 
    territoriosDoContinente.includes(p.nome)
  );
  
  if (paisesDoContinente.length === 0) {
    
    return;
  }
  
  
  
  // Criar efeito de "ola" sequencial (football wave)
  paisesDoContinente.forEach((pais, index) => {
    if (pais.polygon) {
      // Delay para criar o efeito sequencial
      setTimeout(() => {
        
        
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
  
  
}

// Função para criar partículas douradas
function criarPartículasDouradas(x, y, scene) {
  
  
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
  
  
}

// Função para verificar se uma conquista completa um continente
function verificarConquistaContinente(territorioConquistado, jogadorAtacante, scene) {
  
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar cada continente
  Object.keys(gameState.continentes).forEach(nomeContinente => {
    const continente = gameState.continentes[nomeContinente];
    const territoriosDoContinente = continente.territorios;
    
    // Verificar se o território conquistado pertence a este continente
    if (territoriosDoContinente.includes(territorioConquistado)) {
      
      
      // Verificar se o jogador agora controla todos os territórios do continente
      const territoriosConquistados = territoriosDoContinente.filter(territorio => {
        const pais = gameState.paises.find(p => p.nome === territorio);
        return pais && pais.dono === jogadorAtacante;
      });
      
      
      
      
      // Se todos os territórios do continente estão conquistados
      if (territoriosConquistados.length === territoriosDoContinente.length) {
        
        
        // Disparar efeito de onda imediatamente
        setTimeout(() => {
          criarEfeitoOndaContinente(nomeContinente, scene);
        }, 100); // Pequeno delay para garantir que o estado foi atualizado
      } else {
        
      }
    }
  });
}

// Função para mostrar efeito de explosão quando tropas são perdidas
function mostrarEfeitoExplosaoTropas(territorio, scene) {
  
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    
    return;
  }
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais || !pais.troopCircle) {
    
    return;
  }
  
  // Posição do círculo das tropas
  const x = pais.troopCircle.x;
  const y = pais.troopCircle.y;
  
  
  
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
  

  
  
}
// Função para mostrar efeito de explosão quando um território é conquistado
function mostrarEfeitoExplosaoConquista(territorio, jogador, scene) {
  
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    
    return;
  }
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais || !pais.troopCircle) {
    
    return;
  }
  
  // Posição do círculo das tropas
  const x = pais.troopCircle.x;
  const y = pais.troopCircle.y;
  
  
  
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
  
  
}
// Função para elevar território selecionado (similar ao salto mas permanente)
function criarElevacaoTerritorio(territorio, scene) {
  
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Verificar se a scene está pronta
  if (!scene || !scene.add || !scene.add.circle) {
    
    return;
  }
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais) {
    
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
  
  
  
  // Criar elevação suave e permanente para elementos principais (polygon)
  if (elementos.length > 0) {
    const elevacaoTween = scene.tweens.add({
      targets: elementos,
      y: '-=8', // Elevar 8 pixels
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        
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
        
      }
    });
  }
  
  // Marcar que o território está elevado
  pais.elevado = true;
}

// Função para baixar território (remover elevação)
function removerElevacaoTerritorio(territorio, scene) {
  
  
  const gameState = getGameState();
  if (!gameState) return;
  
  // Encontrar o território no mapa
  const pais = gameState.paises.find(p => p.nome === territorio);
  if (!pais) {
    
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
    
    return;
  }
  
  
  
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
        
      }
    });
  }
  
  // Marcar que o território não está mais elevado
  pais.elevado = false;
}

// Função para limpar todas as elevações
function limparTodasElevacoes() {
  
  
  const gameState = getGameState();
  if (!gameState) return;
  
  gameState.paises.forEach(pais => {
    if (pais.elevado && pais.polygon && pais.polygon.scene) {
      removerElevacaoTerritorio(pais.nome, pais.polygon.scene);
    }
  });
}

function mostrarIndicacaoInicioTurno(nomeJogador, scene) {
  
  const overlay = document.getElementById('turn-start-overlay');
  if (!overlay) return;
  
  overlay.style.display = 'flex';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '999999';
  overlay.innerHTML = `
    <div class=\"turn-confirm-modal show\" style=\"max-width:480px;\">\n      <div class=\"turn-confirm-header\"><span>🎯</span><span class=\"turn-confirm-title\">${getText('turnStartTitle')}</span></div>\n      <div class=\"turn-confirm-body\">\n        <div class=\"turn-confirm-warning\">${getText('turnStartMessage', { player: getTranslatedPlayerColor(nomeJogador) })}</div>\n      </div>\n      <div class=\"turn-confirm-actions\">\n        <button class=\"turn-confirm-btn\" id=\"turn-start-close\">${getText('turnStartButton')}</button>\n      </div>\n    </div>`;

  const btn = document.getElementById('turn-start-close');
  if (btn) btn.onclick = () => { tocarSomClick(); fecharIndicacaoInicioTurno(); };

  // Adicionar evento de clique no overlay para fechar ao clicar fora
  overlay.addEventListener('click', (e) => {
    // Só fechar se clicar no overlay (não no modal)
    if (e.target === overlay) {
      fecharIndicacaoInicioTurno();
    }
  });

  // Destacar territórios do jogador (mesmo comportamento anterior)
  const gameState = getGameState();
  if (scene && gameState && gameState.paises) {
    gameState.paises.forEach(pais => {
      if (pais.dono === nomeJogador && pais.polygon) {
        pais.polygon.setStrokeStyle(6, 0xffffff, 1);
        criarElevacaoTerritorio(pais.nome, scene);
      }
    });
  }

  setTimeout(() => fecharIndicacaoInicioTurno(), 5000);
  tocarSomHuh();

  // For compatibility with code that expects a Phaser container
  const containerAPI = { destroy: () => { overlay.style.display = 'none'; overlay.innerHTML = ''; }, setPosition: () => {} };
  window.indicacaoInicioTurno = { container: containerAPI, scene };
}

function fecharIndicacaoInicioTurno() {
  if (window.indicacaoInicioTurno) {
    // Remover interface (HTML)
    const overlay = document.getElementById('turn-start-overlay');
    if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; }
    
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
    
    fecharIndicacaoInicioTurno();
  }
}

// Função para desenhar linha tracejada entre dois pontos
function desenharLinhaTracejada(scene, x1, y1, x2, y2) {
  
  
  // Verificar se a cena é válida
  if (!scene || !scene.add) {
    
    return;
  }
  
  // Configurações da linha tracejada
  const dashLength = 8; // Comprimento de cada traço
  const gapLength = 4;  // Comprimento do espaço entre traços
  const lineWidth = 2;  // Espessura da linha (reduzida de 3 para 2)
  const lineColor = 0xffffff; // Cor branca
  const lineAlpha = 0.4; // Transparência (reduzida de 0.8 para 0.4)
  
  // Calcular a distância total entre os pontos
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Verificar se a distância é válida
  if (distance <= 0) {
    
    return;
  }
  
  // Calcular o número de segmentos necessários
  const segmentLength = dashLength + gapLength;
  const numSegments = Math.ceil(distance / segmentLength);
  
  // Calcular o vetor unitário na direção da linha
  const unitX = dx / distance;
  const unitY = dy / distance;
  
  
  
  // Criar os segmentos tracejados
  for (let i = 0; i < numSegments; i++) {
    const startDistance = i * segmentLength;
    const endDistance = Math.min(startDistance + dashLength, distance);
    
    // Calcular as coordenadas de início e fim do segmento
    const segmentStartX = x1 + unitX * startDistance;
    const segmentStartY = y1 + unitY * startDistance;
    const segmentEndX = x1 + unitX * endDistance;
    const segmentEndY = y1 + unitY * endDistance;
    
    // Criar o segmento da linha
    const line = scene.add.line(
      0, 0, // x, y (não importa para line)
      segmentStartX, segmentStartY, // x1, y1
      segmentEndX, segmentEndY,     // x2, y2
      lineColor, lineAlpha
    );
    
    // Configurar a espessura da linha
    line.setLineWidth(lineWidth);
    
    // Definir a profundidade para ficar acima do mapa mas abaixo dos territórios
    line.setDepth(5);
    
    
  }
  
  
}