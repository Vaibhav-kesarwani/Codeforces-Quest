import React, { useEffect } from 'react';
import { AlertCircle, WifiOff, Clock, Server, XCircle } from 'lucide-react';

interface ErrorNotificationProps {
  message: string;
  type?: 'network' | 'timeout' | 'server' | 'rate-limit' | 'error';
  onRetry?: () => void;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  type = 'error',
  onRetry,
  onClose,
  autoClose = false,
  duration = 5000
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff className="w-5 h-5" />;
      case 'timeout':
        return <Clock className="w-5 h-5" />;
      case 'server':
      case 'rate-limit':
        return <Server className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'network':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200';
      case 'timeout':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'rate-limit':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200';
      case 'server':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 shadow-lg ${getColor()} animate-in slide-in-from-top-5 duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-all hover:scale-105 active:scale-95 bg-white dark:bg-gray-800 border border-current opacity-80 hover:opacity-100"
            >
              Retry
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
              aria-label="Close"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage component
const ErrorNotificationDemo = () => {
  const [notifications, setNotifications] = React.useState([
    { id: 1, message: 'No internet connection. Please check your network.', type: 'network' as const },
    { id: 2, message: 'Request timed out. The server is taking too long.', type: 'timeout' as const },
    { id: 3, message: 'Rate limit exceeded. Please wait or upgrade your plan.', type: 'rate-limit' as const },
    { id: 4, message: 'Server error (500). Please try again later.', type: 'server' as const },
    { id: 5, message: 'Something went wrong. Please try again.', type: 'error' as const },
  ]);

  const handleRetry = (id: number) => {
    console.log(`Retrying notification ${id}`);
  };

  const handleClose = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Error Notification Component
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive error handling with retry functionality
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map(notification => (
            <ErrorNotification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onRetry={() => handleRetry(notification.id)}
              onClose={() => handleClose(notification.id)}
            />
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              All notifications cleared! ✨
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorNotificationDemo;