import React, { useState, useEffect } from 'react';
import { FirebaseConnectionManager } from '../utils/firebaseUtils';

interface ConnectionStatusProps {
  className?: string;
}

export const FirebaseConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState(() => 
    FirebaseConnectionManager.getConnectionStatus()
  );
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check connection status every 5 seconds
    const interval = setInterval(() => {
      setConnectionStatus(FirebaseConnectionManager.getConnectionStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      const success = await FirebaseConnectionManager.forceOnline();
      if (success) {
        setConnectionStatus(FirebaseConnectionManager.getConnectionStatus());
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const statusColor = connectionStatus.isOnline ? 'text-green-600' : 'text-red-600';
  const statusText = connectionStatus.isOnline ? 'Connected' : 'Offline';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${connectionStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className={`text-sm font-medium ${statusColor}`}>
        Firebase: {statusText}
      </span>
      
      {connectionStatus.retryCount > 0 && (
        <span className="text-xs text-gray-500">
          (Retry {connectionStatus.retryCount})
        </span>
      )}
      
      {!connectionStatus.isOnline && (
        <button
          onClick={handleRetryConnection}
          disabled={isRetrying}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRetrying ? 'Retrying...' : 'Retry'}
        </button>
      )}
    </div>
  );
};

export default FirebaseConnectionStatus;