import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const SystemStatus = () => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  
  // Test Convex connection
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: userEmail,
  });

  const getStatusIcon = (condition) => {
    return condition ? "✅" : "❌";
  };

  const getStatusColor = (condition) => {
    return condition ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-3 text-white">System Status</h3>
      
      <div className="space-y-2 text-sm">
        {/* Authentication Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">User Authentication:</span>
          <span className={getStatusColor(!!user)}>
            {getStatusIcon(!!user)} {user ? "Authenticated" : "Not Authenticated"}
          </span>
        </div>

        {/* User Email */}
        {user && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300">User Email:</span>
            <span className="text-blue-400">{userEmail}</span>
          </div>
        )}

        {/* Convex Connection */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Convex Database:</span>
          <span className={getStatusColor(fileList !== undefined)}>
            {getStatusIcon(fileList !== undefined)} {fileList !== undefined ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Environment Variables */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Convex URL:</span>
          <span className={getStatusColor(!!process.env.NEXT_PUBLIC_CONVEX_URL)}>
            {getStatusIcon(!!process.env.NEXT_PUBLIC_CONVEX_URL)} {process.env.NEXT_PUBLIC_CONVEX_URL ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Google AI API:</span>
          <span className={getStatusColor(!!process.env.NEXT_PUBLIC_GOOGLE_API_KEY)}>
            {getStatusIcon(!!process.env.NEXT_PUBLIC_GOOGLE_API_KEY)} {process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Clerk Auth:</span>
          <span className={getStatusColor(!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)}>
            {getStatusIcon(!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)} {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Configured" : "Missing"}
          </span>
        </div>

        {/* File Count */}
        {fileList && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300">PDF Files:</span>
            <span className="text-yellow-400">{fileList.length} files</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-gray-600">
        <h4 className="text-sm font-medium text-white mb-2">Quick Actions:</h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button 
            onClick={() => console.log("System Status:", { user, fileList, env: process.env })}
            className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            Debug Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
