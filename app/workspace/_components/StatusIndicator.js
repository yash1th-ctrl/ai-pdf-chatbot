import React from 'react';

const StatusIndicator = ({ fileInfo, isProcessing }) => {
  const getStatus = () => {
    if (!fileInfo) {
      return {
        icon: "⏳",
        text: "Loading...",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50"
      };
    }

    if (isProcessing) {
      return {
        icon: "🤖",
        text: "AI is analyzing your PDF and generating response...",
        color: "text-blue-500",
        bgColor: "bg-blue-50"
      };
    }

    return {
      icon: "✅",
      text: "Ready • Ask questions about your PDF",
      color: "text-green-500",
      bgColor: "bg-green-50"
    };
  };

  const status = getStatus();

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${status.bgColor} mb-4`}>
      <span className="text-lg">{status.icon}</span>
      <span className={`text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
      {fileInfo && (
        <div className="flex flex-col">
          <span className="text-xs text-gray-600 font-medium">
            {fileInfo.fileName}
          </span>
          {fileInfo._creationTime && (
            <span className="text-xs text-gray-500">
              Uploaded: {new Date(fileInfo._creationTime).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
