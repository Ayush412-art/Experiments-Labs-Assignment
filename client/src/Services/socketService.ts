import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(serverUrl: string = 'http://localhost:8090'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('Connected to Socket.IO server');
          this.isConnected = true;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Disconnected from Socket.IO server:', reason);
          this.isConnected = false;
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('Reconnected to Socket.IO server after', attemptNumber, 'attempts');
          this.isConnected = true;
        });

      } catch (error) {
        console.error('Failed to initialize Socket.IO:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send message to AI tutor
  sendMessage(message: {
    text: string;
    userId?: string;
    goalId?: string;
    currentWeek?: string;
    messageType?: 'question' | 'theory' | 'practice' | 'example';
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('ai_tutor_message', {
        ...message,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      });
    } else {
      console.warn('Socket not connected. Cannot send message.');
    }
  }

  // Listen for AI responses
  onAIResponse(callback: (response: {
    id: string;
    text: string;
    type: 'text' | 'theory' | 'example' | 'practice';
    data?: any;
    timestamp: string;
  }) => void): void {
    if (this.socket) {
      this.socket.on('ai_tutor_response', callback);
    }
  }

  // Listen for typing indicators
  onTypingIndicator(callback: (isTyping: boolean) => void): void {
    if (this.socket) {
      this.socket.on('ai_typing', callback);
    }
  }

  // Listen for connection status
  onConnectionStatus(callback: (status: 'connected' | 'disconnected' | 'connecting') => void): void {
    if (this.socket) {
      this.socket.on('connect', () => callback('connected'));
      this.socket.on('disconnect', () => callback('disconnected'));
      this.socket.on('reconnect_attempt', () => callback('connecting'));
    }
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Generate session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('ai_tutor_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('ai_tutor_session_id', sessionId);
    }
    return sessionId;
  }

  // Send typing indicator
  sendTypingIndicator(isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('user_typing', {
        isTyping,
        sessionId: this.getSessionId()
      });
    }
  }

  // Request help for specific topic
  requestHelp(topic: string, helpType: 'theory' | 'practice' | 'example'): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('request_help', {
        topic,
        helpType,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
