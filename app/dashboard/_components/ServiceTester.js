import React, { useState } from 'react';

const ServiceTester = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runTests = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      console.log("Starting service tests...");
      const response = await fetch('/api/test-services');
      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.results);
        console.log("Service tests completed:", data.results);
      } else {
        setError(data.message || "Test failed");
      }
    } catch (err) {
      console.error("Test execution failed:", err);
      setError(`Test execution failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'checking': return '🔄';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'checking': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const renderServiceDetails = (serviceName, serviceData) => {
    return (
      <div key={serviceName} className="mb-4 p-4 bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-medium text-white capitalize">
            {serviceName.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <span className={`flex items-center ${getStatusColor(serviceData.status)}`}>
            {getStatusIcon(serviceData.status)} {serviceData.status}
          </span>
        </div>
        
        {serviceData.details && (
          <div className="text-sm text-gray-300 space-y-1">
            {Object.entries(serviceData.details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}:</span>
                <span className="text-gray-200 max-w-xs truncate">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">🧪 Service API Tester</h3>
        <button
          onClick={runTests}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium ${
            isLoading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? '🔄 Testing...' : '🚀 Run Tests'}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Testing all services...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">❌ Test Failed</h4>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {testResults && (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border-2 ${
            testResults.overall === 'success' 
              ? 'bg-green-900 border-green-500' 
              : testResults.overall === 'error'
              ? 'bg-red-900 border-red-500'
              : 'bg-yellow-900 border-yellow-500'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Overall Status</h4>
              <span className={`text-xl ${getStatusColor(testResults.overall)}`}>
                {getStatusIcon(testResults.overall)} {testResults.overall.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Tested at: {new Date(testResults.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Individual Services */}
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-white mb-3">Service Details:</h4>
            {Object.entries(testResults.services).map(([serviceName, serviceData]) =>
              renderServiceDetails(serviceName, serviceData)
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-white mb-3">Quick Actions:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => console.log("Full Test Results:", testResults)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
              >
                📋 Log Full Results
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(testResults, null, 2))}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500"
              >
                📄 Copy Results
              </button>
              <button
                onClick={runTests}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500"
              >
                🔄 Re-run Tests
              </button>
            </div>
          </div>

          {/* Recommendations */}
          {testResults.overall !== 'success' && (
            <div className="bg-blue-900 border border-blue-500 text-blue-200 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Recommendations</h4>
              <ul className="text-sm space-y-1">
                {testResults.services.environment?.status === 'error' && (
                  <li>• Check your environment variables in .env.local file</li>
                )}
                {testResults.services.gemini?.status === 'error' && (
                  <li>• Verify your Google AI API key is valid and has quota remaining</li>
                )}
                {testResults.services.convex?.status === 'error' && (
                  <li>• Check your Convex deployment and URL configuration</li>
                )}
                {testResults.services.embeddings?.status === 'error' && (
                  <li>• Ensure Google AI API key has access to embedding models</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {!testResults && !isLoading && !error && (
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4">🔬 Test your API services to ensure everything is working correctly.</p>
          <p className="text-sm">This will test Gemini AI, Convex, embeddings, and more.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceTester;
