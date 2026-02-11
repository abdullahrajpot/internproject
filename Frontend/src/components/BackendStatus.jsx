import React, { useState, useEffect } from 'react';
import { FaCircle, FaExclamationTriangle, FaServer, FaPlay } from 'react-icons/fa';
import { checkBackendHealth } from '../utils/api';

const BackendStatus = () => {
  const [status, setStatus] = useState({ connected: null, message: '', details: '' });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkBackendHealth();
      setStatus({
        connected: result.success,
        message: result.message,
        details: result.details || ''
      });
    };

    checkStatus();
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status.connected === null) {
    return null; // Don't show anything while checking
  }

  if (status.connected) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm z-50">
        <FaCircle className="w-2 h-2 text-green-500" />
        Backend Connected
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm cursor-pointer hover:bg-red-200 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        <FaExclamationTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
        <div>
          <div className="font-medium flex items-center gap-2">
            <FaServer className="w-3 h-3" />
            Backend Offline
          </div>
          <div className="text-xs">Click for details</div>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-2 bg-white border border-red-300 rounded-lg shadow-lg p-4 max-w-sm">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <FaServer className="w-4 h-4" />
            Backend Server Issue
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            The backend server is not running. To start it:
          </p>
          <div className="bg-gray-100 p-2 rounded text-xs font-mono mb-3">
            <div>1. Open terminal in Backend folder</div>
            <div>2. Run: <span className="bg-blue-100 px-1 rounded">npm start</span></div>
            <div>3. Or: <span className="bg-blue-100 px-1 rounded">node app.js</span></div>
          </div>
          <div className="text-xs text-gray-600">
            <strong>Note:</strong> The app will use demo data until the backend is connected.
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;