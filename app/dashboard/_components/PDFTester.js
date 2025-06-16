import React, { useState } from 'react';

const PDFTester = () => {
  const [testResults, setTestResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFile = async (file) => {
    setIsAnalyzing(true);
    const results = {
      fileName: file.name,
      fileSize: file.size,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
      fileType: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
      tests: {}
    };

    // Test 1: File size check
    results.tests.sizeCheck = {
      status: file.size <= 5 * 1024 * 1024 ? 'success' : 'error',
      message: file.size <= 5 * 1024 * 1024 
        ? `✅ File size (${results.fileSizeMB} MB) is within 5MB limit`
        : `❌ File size (${results.fileSizeMB} MB) exceeds 5MB limit`
    };

    // Test 2: File type check
    results.tests.typeCheck = {
      status: file.type === 'application/pdf' ? 'success' : 'warning',
      message: file.type === 'application/pdf'
        ? '✅ Valid PDF file type detected'
        : `⚠️ File type: ${file.type} (expected: application/pdf)`
    };

    // Test 3: PDF header check
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = String.fromCharCode(...uint8Array.slice(0, 4));
      
      results.tests.headerCheck = {
        status: header === '%PDF' ? 'success' : 'error',
        message: header === '%PDF'
          ? '✅ Valid PDF header detected'
          : `❌ Invalid PDF header: ${header}`
      };

      // Test 4: Basic content check
      const firstKB = String.fromCharCode(...uint8Array.slice(0, 1024));
      const hasContent = firstKB.length > 100;
      
      results.tests.contentCheck = {
        status: hasContent ? 'success' : 'warning',
        message: hasContent
          ? '✅ PDF appears to have content'
          : '⚠️ PDF may be empty or very small'
      };

      // Test 5: Encryption check (basic)
      const isEncrypted = firstKB.includes('/Encrypt');
      results.tests.encryptionCheck = {
        status: !isEncrypted ? 'success' : 'error',
        message: !isEncrypted
          ? '✅ PDF appears to be unencrypted'
          : '❌ PDF may be password protected'
      };

    } catch (error) {
      results.tests.headerCheck = {
        status: 'error',
        message: `❌ Error reading file: ${error.message}`
      };
    }

    setTestResults(results);
    setIsAnalyzing(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      analyzeFile(file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getOverallStatus = () => {
    if (!testResults) return null;
    
    const statuses = Object.values(testResults.tests).map(test => test.status);
    if (statuses.every(status => status === 'success')) return 'success';
    if (statuses.some(status => status === 'error')) return 'error';
    return 'warning';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">📄 PDF File Tester</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select your PDF file to test:
        </label>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Choose the PDF file you want to test: C:\Users\Yashwanth Peralta\OneDrive\Desktop\samp.pdf
        </p>
      </div>

      {isAnalyzing && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400">Analyzing PDF file...</p>
        </div>
      )}

      {testResults && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-white mb-2">📋 File Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">File Name:</div>
              <div className="text-gray-200">{testResults.fileName}</div>
              <div className="text-gray-400">File Size:</div>
              <div className="text-gray-200">{testResults.fileSizeMB} MB</div>
              <div className="text-gray-400">File Type:</div>
              <div className="text-gray-200">{testResults.fileType}</div>
              <div className="text-gray-400">Last Modified:</div>
              <div className="text-gray-200">{testResults.lastModified}</div>
            </div>
          </div>

          {/* Overall Status */}
          <div className={`p-4 rounded-lg border-2 ${
            getOverallStatus() === 'success' 
              ? 'bg-green-900 border-green-500' 
              : getOverallStatus() === 'error'
              ? 'bg-red-900 border-red-500'
              : 'bg-yellow-900 border-yellow-500'
          }`}>
            <h4 className="text-lg font-medium text-white mb-2">
              🎯 Overall Status: {getOverallStatus()?.toUpperCase()}
            </h4>
            <p className="text-sm text-gray-300">
              {getOverallStatus() === 'success' 
                ? '✅ Your PDF is ready for upload to the chatbot!'
                : getOverallStatus() === 'error'
                ? '❌ Issues detected that may prevent successful upload'
                : '⚠️ Minor issues detected, but upload may still work'
              }
            </p>
          </div>

          {/* Test Results */}
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-white mb-3">🧪 Test Results:</h4>
            {Object.entries(testResults.tests).map(([testName, test]) => (
              <div key={testName} className="bg-gray-700 p-3 rounded-lg">
                <div className={`text-sm ${getStatusColor(test.status)}`}>
                  {test.message}
                </div>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-900 border border-blue-500 text-blue-200 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🚀 Next Steps:</h4>
            {getOverallStatus() === 'success' ? (
              <div className="text-sm space-y-1">
                <p>✅ Your PDF passed all tests! You can now:</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Click "Upload PDF File" button above</li>
                  <li>Select your tested PDF file</li>
                  <li>Enter a descriptive filename</li>
                  <li>Click "Upload" and wait for processing</li>
                  <li>Test the AI chat with questions about your PDF content</li>
                </ol>
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <p>⚠️ Please address the issues above before uploading:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {testResults.tests.sizeCheck?.status === 'error' && (
                    <li>Reduce file size to under 5MB</li>
                  )}
                  {testResults.tests.headerCheck?.status === 'error' && (
                    <li>Ensure the file is a valid PDF</li>
                  )}
                  {testResults.tests.encryptionCheck?.status === 'error' && (
                    <li>Remove password protection from the PDF</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedFile && (
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4">📁 Select your PDF file to run comprehensive tests</p>
          <p className="text-sm">This will verify your file is ready for upload to the AI chatbot</p>
        </div>
      )}
    </div>
  );
};

export default PDFTester;
