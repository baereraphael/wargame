// Game Server Configuration
// ================================

// Configuration for different environments
const SERVER_CONFIG = {
  // Local development
  local: {
    url: 'http://localhost:3000',
    name: 'Local Development'
  },
  
  // Railway production server
  railway: {
    url: 'web-production-f6a26.up.railway.app', // CHANGE THIS TO YOUR RAILWAY URL
    name: 'Railway Production'
  },
  
  // itch.io deployment
  itch: {
    url: 'web-production-f6a26.up.railway.app', // SAME AS RAILWAY
    name: 'itch.io Production'
  }
};

// Auto-detect environment and set server URL
function getServerUrl() {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('🌐 Environment: Local Development');
    return SERVER_CONFIG.local.url;
  }
  
  // itch.io (or any other hosting)
  if (hostname.includes('itch.io') || hostname.includes('itchgames.com')) {
    console.log('🌐 Environment: itch.io Production');
    return SERVER_CONFIG.itch.url;
  }
  
  // Default to Railway
  console.log('🌐 Environment: Railway Production');
  return SERVER_CONFIG.railway.url;
}

// Load Socket.io from CDN if not available locally
function loadSocketIO() {
  if (typeof io === 'undefined') {
    console.log('📡 Socket.io not found, loading from CDN...');
    
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
    script.onload = () => {
      console.log('✅ Socket.io loaded from CDN');
      // Trigger a custom event to notify that socket.io is ready
      window.dispatchEvent(new CustomEvent('socketioReady'));
    };
    script.onerror = () => {
      console.error('❌ Failed to load Socket.io from CDN');
    };
    
    document.head.appendChild(script);
  } else {
    console.log('✅ Socket.io already available');
    // Trigger the event immediately if socket.io is already loaded
    window.dispatchEvent(new CustomEvent('socketioReady'));
  }
}

// Export the server URL
const SERVER_URL = getServerUrl();

// Load Socket.io
loadSocketIO();

// Log configuration for debugging
console.log('🔧 Server Configuration:');
console.log(`  • Environment: ${window.location.hostname}`);
console.log(`  • Server URL: ${SERVER_URL}`);
console.log('  • To change server URL, edit config.js file');
