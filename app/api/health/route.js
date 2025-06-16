import { NextResponse } from "next/server";

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      services: {
        nextjs: "✅ Running",
        convex: process.env.NEXT_PUBLIC_CONVEX_URL ? "✅ Configured" : "❌ Not configured",
        clerk: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Configured" : "❌ Not configured",
        gemini: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? "✅ Configured" : "❌ Not configured"
      },
      urls: {
        convex: process.env.NEXT_PUBLIC_CONVEX_URL || "Not set",
        clerk_key: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Set" : "Not set"
      },
      version: "1.0.1",
      deployment: "render"
    };

    // Test Convex connection
    try {
      if (process.env.NEXT_PUBLIC_CONVEX_URL) {
        const { ConvexHttpClient } = await import("convex/browser");
        const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
        health.services.convex = "✅ Connected";
      }
    } catch (convexError) {
      health.services.convex = `❌ Connection failed: ${convexError.message}`;
    }

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
