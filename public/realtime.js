import { state, updatePresence, setTyping } from './state.js';

export class RealtimeClient {
  constructor({ onMessage, onConnect, onDisconnect }) {
    this.socket = null;
    this.onMessage = onMessage;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.retryDelay = 1000;
    this.token = localStorage.getItem('linkchat_token');
  }

  connect() {
    if (!this.token) {
      return;
    }
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${location.host}/ws?token=${encodeURIComponent(this.token)}`;

    this.socket = new WebSocket(url);
    this.socket.addEventListener('open', () => {
      state.connection.status = 'connected';
      this.onConnect?.();
      this.socket.send(JSON.stringify({ type: 'AUTHENTICATE', token: this.token }));
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.onMessage?.(data);
    });

    this.socket.addEventListener('close', () => {
      state.connection.status = 'reconnecting';
      this.onDisconnect?.();
      this.retryDelay = Math.min(this.retryDelay * 2, 30000);
      setTimeout(() => this.connect(), this.retryDelay);
    });

    this.socket.addEventListener('error', () => {
      state.connection.status = 'error';
    });
  }

  send(type, payload = {}) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify({ type, ...payload }));
  }

  sendTypingStatus(isTyping) {
    this.send(isTyping ? 'TYPING_START' : 'TYPING_STOP', { conversationId: state.activeConversationId });
    setTyping(state.user?.id || 'me', isTyping);
  }

  updatePresence(status = 'online') {
    this.send('PRESENCE_UPDATE', { status });
    updatePresence(state.user?.id || 'me', { status, lastActive: new Date().toISOString() });
  }
}
