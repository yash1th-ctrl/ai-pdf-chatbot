"use client";
import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TestConvex() {
  const [testResult, setTestResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Test Convex queries
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: "test@example.com",
  });

  const searchAI = useAction(api.myActions.search);

  let convexStatus = "Not configured";
  let convexAvailable = false;

  if (convexUrl && convexUrl !== "disabled" && convexUrl.startsWith("https://")) {
    convexStatus = "Configured and available";
    convexAvailable = true;
    convexStatus = "Fully functional";
  } else if (convexUrl === "disabled") {
    convexStatus = "Disabled";
  } else if (!convexUrl) {
    convexStatus = "URL not set";
  } else {
    convexStatus = "Invalid URL format";
  }

  const testAISearch = async () => {
    setIsLoading(true);
    try {
      const result = await searchAI({
        query: "test query",
        fileId: "test-file-id"
      });
      setTestResult("AI Search Result: " + result);
    } catch (error) {
      setTestResult("AI Search Error: " + error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Convex Configuration Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Environment Variables</h2>
          <p><strong>NEXT_PUBLIC_CONVEX_URL:</strong> {convexUrl || "Not set"}</p>
        </div>
        
        <div className={`p-4 border rounded-lg ${convexAvailable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h2 className="font-semibold">Convex Status</h2>
          <p><strong>Status:</strong> {convexStatus}</p>
          <p><strong>Available:</strong> {convexAvailable ? "✅ Yes" : "❌ No"}</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Database Query Test</h2>
          <p><strong>File List Query:</strong> {fileList ? `Found ${fileList.length} files` : "No data or loading..."}</p>
          <p><strong>File List Data:</strong> {JSON.stringify(fileList)}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">AI Search Test</h2>
          <button
            onClick={testAISearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Testing..." : "Test AI Search"}
          </button>
          {testResult && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <pre className="text-sm">{testResult}</pre>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Upload Service Status</h2>
          <p>
            {convexAvailable
              ? "✅ Upload service should work"
              : "❌ Upload service will show error message"
            }
          </p>
        </div>
        
        <div className="mt-6">
          <a 
            href="/dashboard" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
