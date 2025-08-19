import { WebSocketEventType, WebSocketMessage } from '../types/pokemon';
import { getUserId } from './utils';

type WebSocketEventHandler = (message: WebSocketMessage) => void;

type RealTimeMessage = {
  type: WebSocketEventType;
  payload: unknown;
  battleId?: string;
  userId: string;
  timestamp: number;
};

class RealTimeWebSocketService {
  private ws?: WebSocket;

  private handlers: Set<WebSocketEventHandler> = new Set();

  private isConnected = false;

  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  private reconnectInterval?: NodeJS.Timeout;

  private heartbeatInterval?: NodeJS.Timeout;

  private currentBattleId: string | null = null;

  private userId: string = '';

  private readonly WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';

  private readonly HEARTBEAT_INTERVAL = 30_000;

  async connect(): Promise<void> {
    if (!this.userId) {
      this.userId = await getUserId();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.WS_URL);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.notifyConnectionListeners(true);
          this.startHeartbeat();
          this.clearReconnectInterval();
          resolve();
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.notifyConnectionListeners(false);
          this.clearReconnectInterval();
          this.stopHeartbeat();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);

          this.isConnected = false;
          this.notifyConnectionListeners(false);

          reject(new Error('Failed to connect to voting server'));
        };

        this.ws.onmessage = (event) => {
          try {
            const realTimeMessage: RealTimeMessage = JSON.parse(event.data);
            this.handleIncomingMessage(realTimeMessage);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        // Connection timeout
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Connection timeout'));
          }
        }, 10_000);
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleIncomingMessage(realTimeMessage: RealTimeMessage): void {
    // Only process messages for our current battle
    if (realTimeMessage.battleId && realTimeMessage.battleId !== this.currentBattleId) {
      return;
    }

    // Don't process our own messages (they're already handled locally)
    if (realTimeMessage.userId === this.userId) {
      return;
    }

    // Convert to our internal message format
    const message: WebSocketMessage = {
      type: realTimeMessage.type as WebSocketMessage['type'],
      payload: realTimeMessage.payload,
    };

    this.handlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.ws) {
        const heartbeat: RealTimeMessage = {
          type: WebSocketEventType.HEARTBEAT,
          payload: {},
          userId: this.userId,
          timestamp: Date.now(),
        };

        this.ws.send(JSON.stringify(heartbeat));
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = undefined;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  subscribe(handler: WebSocketEventHandler): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);

    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => listener(connected));
  }

  setBattleId(battleId: string): void {
    this.currentBattleId = battleId;
  }

  send(message: WebSocketMessage): void {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket not connected');
      return;
    }

    const realTimeMessage: RealTimeMessage = {
      type: message.type,
      payload: message.payload,
      battleId: this.currentBattleId || undefined,
      userId: this.userId,
      timestamp: Date.now(),
    };

    try {
      this.ws.send(JSON.stringify(realTimeMessage));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }
}

export const webSocketService = new RealTimeWebSocketService();
