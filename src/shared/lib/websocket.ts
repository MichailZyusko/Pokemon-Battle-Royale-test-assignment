import { WebSocketMessage } from '../types/pokemon';
import { getUserId } from './utils';

type WebSocketEventHandler = (message: WebSocketMessage) => void;

// Enhanced WebSocket message for real-time communication
type RealTimeMessage = {
  type: 'vote' | 'stats' | 'new_battle' | 'join_battle' | 'heartbeat';
  payload: unknown;
  battleId?: string;
  userId: string;
  timestamp: number;
};

class RealTimeWebSocketService {
  private ws: WebSocket | null = null;

  private handlers: Set<WebSocketEventHandler> = new Set();

  private isConnected = false;

  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  private reconnectInterval: NodeJS.Timeout | null = null;

  private heartbeatInterval: NodeJS.Timeout | null = null;

  private currentBattleId: string | null = null;

  private userId: string = '';

  private readonly WS_URL = process.env.REACT_APP_WS_URL || '';

  private readonly RECONNECT_DELAY = 3000;

  private readonly HEARTBEAT_INTERVAL = 30000;

  constructor() {
    this.initializeUserId();
  }

  private async initializeUserId(): Promise<void> {
    this.userId = await getUserId();
  }

  async connect(): Promise<void> {
    // Ensure userId is initialized before connecting
    if (!this.userId) {
      await this.initializeUserId();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.WS_URL);

        this.ws.onopen = () => {
          console.log('🌍 Connected to real-time voting server at', this.WS_URL);
          this.isConnected = true;
          this.notifyConnectionListeners(true);
          this.startHeartbeat();
          this.clearReconnectInterval();
          resolve();
        };

        this.ws.onclose = () => {
          console.log('Disconnected from voting server');
          this.isConnected = false;
          this.notifyConnectionListeners(false);
          this.stopHeartbeat();
          this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          this.notifyConnectionListeners(false);
          reject(new Error('Failed to connect to voting server'));
        };

        this.ws.onmessage = (event) => {
          console.log('🚀 ~ event:', event);

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
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleIncomingMessage(realTimeMessage: RealTimeMessage): void {
    console.log('📥 Received message:', realTimeMessage.type, 'from user:', `${realTimeMessage.userId?.substring(0, 10)}...`);

    // Only process messages for our current battle or general messages
    if (realTimeMessage.battleId && realTimeMessage.battleId !== this.currentBattleId) {
      console.log('🚫 Ignoring message for different battle:', realTimeMessage.battleId);
      return;
    }

    // Don't process our own messages (they're already handled locally)
    if (realTimeMessage.userId === this.userId) {
      console.log('🔄 Ignoring own message echo');
      return;
    }

    console.log('✅ Processing external vote from another user!');

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
          type: 'heartbeat',
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
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.RECONNECT_DELAY);
    }
  }

  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  disconnect(): void {
    this.clearReconnectInterval();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.notifyConnectionListeners(false);
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
    console.log('🏟️ Joining battle room:', battleId);

    // Announce joining this battle
    if (this.isConnected && this.ws) {
      const joinMessage: RealTimeMessage = {
        type: 'join_battle',
        payload: { battleId },
        battleId,
        userId: this.userId,
        timestamp: Date.now(),
      };
      this.ws.send(JSON.stringify(joinMessage));
      console.log('📢 Announced joining battle:', battleId);
    }
  }

  send(message: WebSocketMessage): void {
    console.log('🚀 ~ message:', message);

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
    console.log('🚀 ~ realTimeMessage:', realTimeMessage);

    try {
      this.ws.send(JSON.stringify(realTimeMessage));
      console.log('📤 Sent message:', message.type, 'for battle:', this.currentBattleId);

      // Removed echo functionality to prevent double-counting
      // Local state updates are handled directly in the vote function
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getUserId(): string {
    return this.userId;
  }
}

// Singleton instance
export const webSocketService = new RealTimeWebSocketService();
