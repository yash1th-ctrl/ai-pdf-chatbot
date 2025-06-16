"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const Provider = ({ children }) => {
  // Initialize Convex client with proper error handling
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Always create a Convex client to prevent hook errors
  let convex = null;

  try {
    if (convexUrl && convexUrl !== "disabled" && convexUrl.startsWith("https://")) {
      convex = new ConvexReactClient(convexUrl);
      console.log("✅ Convex client created successfully with URL:", convexUrl.substring(0, 30) + "...");
    } else {
      // Create a mock client for development/fallback
      console.warn("⚠️ Convex URL not configured properly, using fallback");
      // Use the production URL as fallback to prevent errors
      convex = new ConvexReactClient("https://tough-meadowlark-481.convex.cloud");
    }
  } catch (error) {
    console.error("❌ Failed to create Convex client:", error);
    // Create a minimal fallback client
    try {
      convex = new ConvexReactClient("https://tough-meadowlark-481.convex.cloud");
    } catch (fallbackError) {
      console.error("❌ Failed to create fallback Convex client:", fallbackError);
    }
  }

  // Always wrap with ConvexProvider to prevent hook errors
  return (
    <div className="bg-background text-foreground">
      {convex ? (
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      ) : (
        <div className="p-4 text-center">
          <p className="text-red-500">Convex configuration error. Please check your environment variables.</p>
          {children}
        </div>
      )}
    </div>
  );
};

export default Provider;
