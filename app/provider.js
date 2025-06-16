"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const Provider = ({ children }) => {
  // Initialize Convex client with proper error handling
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Always create a Convex client to prevent hook errors
  let convex = null;

  try {
    // Use the production Convex URL directly for consistency
    const productionConvexUrl = "https://tough-meadowlark-481.convex.cloud";

    // Always use production URL to ensure consistency
    convex = new ConvexReactClient(productionConvexUrl);
    console.log("✅ Convex client created with production URL:", productionConvexUrl);

    // Log the environment URL for debugging
    if (convexUrl) {
      console.log("📝 Environment CONVEX_URL:", convexUrl.substring(0, 30) + "...");
    } else {
      console.log("⚠️ No NEXT_PUBLIC_CONVEX_URL found in environment");
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
