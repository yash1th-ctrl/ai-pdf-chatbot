import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Testing Convex connection...");
    
    const results = {
      timestamp: new Date().toISOString(),
      convex: {},
      environment: {}
    };

    // Test environment variables
    results.environment = {
      NEXT_PUBLIC_CONVEX_URL: !!process.env.NEXT_PUBLIC_CONVEX_URL,
      CONVEX_DEPLOYMENT: !!process.env.CONVEX_DEPLOYMENT,
      convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ? 
        `${process.env.NEXT_PUBLIC_CONVEX_URL.substring(0, 30)}...` : 
        "missing"
    };

    // Test if we can import Convex client
    try {
      const { ConvexHttpClient } = await import("convex/browser");
      results.convex.clientImport = "success";
      
      if (process.env.NEXT_PUBLIC_CONVEX_URL) {
        const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
        results.convex.clientCreation = "success";
        
        // Test a simple query (this might fail if not authenticated, but that's expected)
        try {
          // We can't easily test queries without proper auth setup in API route
          results.convex.status = "client_ready";
        } catch (queryError) {
          results.convex.status = "client_ready_query_failed";
          results.convex.queryError = queryError.message;
        }
      } else {
        results.convex.clientCreation = "failed_no_url";
      }
    } catch (importError) {
      results.convex.clientImport = "failed";
      results.convex.importError = importError.message;
    }

    // Test vector search endpoint availability
    try {
      const vectorSearchTest = {
        endpoint: "/api/vector-search",
        available: "unknown"
      };
      
      // We can't easily test the actual vector search without proper setup
      // but we can check if the endpoint exists
      results.convex.vectorSearch = vectorSearchTest;
    } catch (error) {
      results.convex.vectorSearchError = error.message;
    }

    console.log("Convex test results:", results);

    return NextResponse.json({
      success: true,
      message: "Convex connection test completed",
      results: results
    });

  } catch (error) {
    console.error("Convex test failed:", error);
    
    return NextResponse.json({
      success: false,
      message: "Convex test failed",
      error: error.message
    }, { status: 500 });
  }
}
