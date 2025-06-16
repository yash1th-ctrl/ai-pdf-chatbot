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
      version: "1.0.0"
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
