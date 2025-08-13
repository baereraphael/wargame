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
    url: 'https://web-production-f6a26.up.railway.app', // CHANGE THIS TO YOUR RAILWAY URL
    name: 'Railway Production'
  },
  
  // itch.io deployment
  itch: {
    url: 'https://web-production-f6a26.up.railway.app', // SAME AS RAILWAY
    name: 'itch.io Production'
  }
};

// Auto-detect environment and set server URL
function getServerUrl() {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    
    return SERVER_CONFIG.local.url;
  }
  
  // itch.io (or any other hosting)
  if (hostname.includes('itch.io') || hostname.includes('itchgames.com')) {
    
    return SERVER_CONFIG.itch.url;
  }
  
  // Default to Railway
  
  return SERVER_CONFIG.railway.url;
}

// Load Socket.io from CDN if not available locally
function loadSocketIO() {
  if (typeof io === 'undefined') {
    
    
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
    script.onload = () => {
      
      // Trigger a custom event to notify that socket.io is ready
      window.dispatchEvent(new CustomEvent('socketioReady'));
    };
    script.onerror = () => {
      
    };
    
    document.head.appendChild(script);
  } else {
    
    // Trigger the event immediately if socket.io is already loaded
    window.dispatchEvent(new CustomEvent('socketioReady'));
  }
}

// Export the server URL
const SERVER_URL = getServerUrl();

// Load Socket.io
loadSocketIO();

// Log configuration for debugging




