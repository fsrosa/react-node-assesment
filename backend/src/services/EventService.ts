import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface DataChangeEvent {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'USER' | 'TASK';
  data: any;
  timestamp: Date;
}

class EventService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    console.log('EventService initialized with Socket.IO');
  }

  broadcastDataChange(event: DataChangeEvent) {
    if (!this.io) {
      console.warn('EventService not initialized');
      return;
    }

    this.io.emit('dataChange', event);
    console.log(`Broadcasting ${event.type} event for ${event.entity}:`, event.data);
  }

  broadcastUserChange(type: 'CREATE' | 'UPDATE' | 'DELETE', user: any) {
    this.broadcastDataChange({
      type,
      entity: 'USER',
      data: user,
      timestamp: new Date()
    });
  }

  broadcastTaskChange(type: 'CREATE' | 'UPDATE' | 'DELETE', task: any) {
    this.broadcastDataChange({
      type,
      entity: 'TASK',
      data: task,
      timestamp: new Date()
    });
  }

  getIO() {
    return this.io;
  }
}

export const eventService = new EventService(); 