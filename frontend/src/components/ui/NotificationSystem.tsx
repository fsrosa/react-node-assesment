import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';
import { websocketService, type ConnectionEvent } from '../../services/websocket';

interface NotificationSystemProps {
  children: React.ReactNode;
}

export function NotificationSystem({ children }: NotificationSystemProps) {
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // Subscribe to connection events
    const unsubscribeConnection = websocketService.subscribeToConnection((event: ConnectionEvent) => {
      switch (event.type) {
        case 'CONNECT':
          setIsConnected(true);
          toast.success('Real-time connection established', {
            icon: '🔗',
            duration: 3000,
          });
          break;
        case 'DISCONNECT':
          setIsConnected(false);
          toast.error('Real-time connection lost', {
            icon: '❌',
            duration: 5000,
          });
          break;
        case 'ERROR':
          setIsConnected(false);
          toast.error(`Connection error: ${event.message}`, {
            icon: '⚠️',
            duration: 5000,
          });
          break;
      }
    });

    // Check initial connection status
    setIsConnected(websocketService.isConnected());

    return () => {
      unsubscribeConnection();
    };
  }, []);

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Real-time Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Real-time Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {children}
    </>
  );
} 