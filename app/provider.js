"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const Provider = ({ children }) => {
  // Initialize Convex client
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  console.log("Convex URL in Provider:", convexUrl); // Debug log

  let convex = null;
  if (convexUrl && convexUrl !== "disabled") {
    try {
      convex = new ConvexReactClient(convexUrl);
      console.log("Convex client created successfully"); // Debug log
    } catch (error) {
      console.error("Failed to create Convex client:", error);
    }
  }

  // Render content with conditional providers
  const renderContent = (content) => (
    <div className="bg-background text-foreground">
      {content}
    </div>
  );

  let content = children;

  // Always wrap with Convex provider - create a dummy client if needed
  if (convex) {
    console.log("Wrapping with ConvexProvider"); // Debug log
    content = (
      <ConvexProvider client={convex}>
        {content}
      </ConvexProvider>
    );
  } else {
    console.log("Creating fallback ConvexProvider"); // Debug log
    // Create a fallback ConvexProvider to prevent hook errors
    try {
      const fallbackClient = new ConvexReactClient("https://fallback.convex.cloud");
      content = (
        <ConvexProvider client={fallbackClient}>
          {content}
        </ConvexProvider>
      );
    } catch (error) {
      console.log("Could not create fallback ConvexProvider:", error);
    }
  }

  return renderContent(content);
};

export default Provider;
