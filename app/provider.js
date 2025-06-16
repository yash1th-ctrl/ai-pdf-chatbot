"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const Provider = ({ children }) => {
  // Initialize Convex client with proper error handling
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Always create a Convex client to prevent hook errors
  let convex = null;

  try {
    // Always use the production Convex URL for consistency
    const productionConvexUrl = "https://tough-meadowlark-481.convex.cloud";

    if (convexUrl && convexUrl !== "disabled" && convexUrl.startsWith("https://")) {
      convex = new ConvexReactClient(convexUrl);
      console.log("✅ Convex client created successfully with URL:", convexUrl.substring(0, 30) + "...");
    } else {
      // Use production URL as fallback
      console.warn("⚠️ Convex URL not configured, using production fallback");
      convex = new ConvexReactClient(productionConvexUrl);
      console.log("✅ Convex fallback client created with production URL");
    }
  } catch (error) {
    console.error("❌ Failed to create Convex client:", error);
    // Create a minimal fallback client with production URL
    try {
      convex = new ConvexReactClient("https://tough-meadowlark-481.convex.cloud");
      console.log("✅ Convex emergency fallback client created");
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
