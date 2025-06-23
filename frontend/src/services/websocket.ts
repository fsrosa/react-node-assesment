import { io, Socket } from 'socket.io-client';

export interface DataChangeEvent {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'USER' | 'TASK';
  data: any;
  timestamp: Date;
}

export interface ConnectionEvent {
  type: 'CONNECT' | 'DISCONNECT' | 'ERROR';
  message?: string;
  timestamp: Date;
}

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(event: DataChangeEvent) => void>> = new Map();
  private connectionListeners: Set<(event: ConnectionEvent) => void> = new Set();

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.notifyConnectionListeners({
        type: 'CONNECT',
        message: 'Connected to real-time server',
        timestamp: new Date(),
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.notifyConnectionListeners({
        type: 'DISCONNECT',
        message: 'Disconnected from real-time server',
        timestamp: new Date(),
      });
    });

    this.socket.on('dataChange', (event: DataChangeEvent) => {
      console.log('Received data change event:', event);
      this.notifyListeners(event);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      this.notifyConnectionListeners({
        type: 'ERROR',
        message: `Connection error: ${error.message}`,
        timestamp: new Date(),
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(eventType: string, callback: (event: DataChangeEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  subscribeToConnection(callback: (event: ConnectionEvent) => void) {
    this.connectionListeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  private notifyListeners(event: DataChangeEvent) {
    // Notify specific entity listeners
    const entityListeners = this.listeners.get(event.entity);
    if (entityListeners) {
      entityListeners.forEach(callback => callback(event));
    }

    // Notify general listeners
    const generalListeners = this.listeners.get('*');
    if (generalListeners) {
      generalListeners.forEach(callback => callback(event));
    }
  }

  private notifyConnectionListeners(event: ConnectionEvent) {
    this.connectionListeners.forEach(listener => listener(event));
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService(); 