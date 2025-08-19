import {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { webSocketService } from '../lib/websocket';
import { WebSocketMessage } from '../types/pokemon';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const handlersRef = useRef<Set<(message: WebSocketMessage) => void>>(new Set());

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        await webSocketService.connect();
        if (mounted) {
          setIsConnected(true);
          setConnectionError(null);
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : 'Connection failed';
          setConnectionError(errorMessage);
          setIsConnected(false);
        }
      }
    };

    const unsubscribeConnection = webSocketService.onConnectionChange((connected) => {
      if (mounted) {
        setIsConnected(connected);
        if (!connected) {
          setConnectionError('Connection lost');
        }
      }
    });

    connect();

    return () => {
      mounted = false;
      unsubscribeConnection();
      webSocketService.disconnect();
    };
  }, []);

  const subscribe = useCallback((handler: (message: WebSocketMessage) => void) => {
    handlersRef.current.add(handler);
    const unsubscribe = webSocketService.subscribe(handler);

    return () => {
      handlersRef.current.delete(handler);
      unsubscribe();
    };
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (!isConnected) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }

    try {
      webSocketService.send(message);
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Send failed';
      setConnectionError(errorMessage);
    }
  }, [isConnected]);

  const reconnect = useCallback(async () => {
    setConnectionError(null);
    try {
      await webSocketService.connect();
      setIsConnected(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Reconnection failed';
      setConnectionError(errorMessage);
    }
  }, []);

  const setBattleId = useCallback((battleId: string) => {
    webSocketService.setBattleId(battleId);
  }, []);

  return {
    isConnected,
    connectionError,
    subscribe,
    send,
    reconnect,
    setBattleId,
  };
};
