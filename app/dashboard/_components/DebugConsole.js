import React, { useState, useEffect } from 'react';

const DebugConsole = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Capture console.log messages
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-49), { // Keep last 50 logs
        type: 'log',
        timestamp,
        message,
        id: Date.now() + Math.random()
      }]);
      
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-49), {
        type: 'error',
        timestamp,
        message,
        id: Date.now() + Math.random()
      }]);
      
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-49), {
        type: 'warn',
        timestamp,
        message,
        id: Date.now() + Math.random()
      }]);
      
      originalWarn.apply(console, args);
    };

    // Cleanup
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      default: return '📝';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
        >
          🐛 Debug Console ({logs.length})
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-80 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-600">
        <h3 className="text-white font-medium">🐛 Debug Console</h3>
        <div className="flex gap-2">
          <button
            onClick={clearLogs}
            className="text-gray-400 hover:text-white text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="h-64 overflow-y-auto p-2 text-xs font-mono">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            No logs yet. Interact with the app to see debug information.
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="mb-1 p-1 rounded">
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs">{log.timestamp}</span>
                <span className={getLogColor(log.type)}>
                  {getLogIcon(log.type)}
                </span>
                <div className={`${getLogColor(log.type)} flex-1 break-words`}>
                  {log.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-2 border-t border-gray-600 text-xs text-gray-400">
        {logs.length} logs • Real-time debugging
      </div>
    </div>
  );
};

export default DebugConsole;
