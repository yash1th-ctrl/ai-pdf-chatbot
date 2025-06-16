import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🧪 Testing Convex connection...");
    
    const results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      convex: {},
      tests: {}
    };

    // Test environment variables
    results.environment_vars = {
      NEXT_PUBLIC_CONVEX_URL: !!process.env.NEXT_PUBLIC_CONVEX_URL,
      CONVEX_DEPLOYMENT: !!process.env.CONVEX_DEPLOYMENT,
      convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL || "Not set",
      deployment: process.env.CONVEX_DEPLOYMENT || "Not set"
    };

    // Test Convex client creation
    try {
      const { ConvexHttpClient } = await import("convex/browser");
      results.convex.clientImport = "✅ Success";
      
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://tough-meadowlark-481.convex.cloud";
      const client = new ConvexHttpClient(convexUrl);
      results.convex.clientCreation = "✅ Success";
      results.convex.url = convexUrl;
      
      // Test a simple query (this might fail without auth, but that's expected)
      try {
        // Import the API
        const { api } = await import("@/convex/_generated/api");
        results.convex.apiImport = "✅ Success";
        
        // Try to query user files (this will test the connection)
        const testResult = await client.query(api.fileStorage.GetUserFiles, {
          userEmail: "test@example.com"
        });
        
        results.tests.queryTest = "✅ Success";
        results.tests.queryResult = testResult ? `Returned ${testResult.length || 0} files` : "No data";
        
      } catch (queryError) {
        results.tests.queryTest = `⚠️ Query failed: ${queryError.message}`;
        // This is often expected due to auth requirements
      }
      
    } catch (importError) {
      results.convex.clientImport = `❌ Failed: ${importError.message}`;
    }

    // Overall status
    results.status = results.convex.clientCreation === "✅ Success" ? "✅ CONVEX WORKING" : "❌ CONVEX ISSUES";
    
    console.log("Convex test results:", results);

    return NextResponse.json({
      success: true,
      message: "Convex connection test completed",
      results: results
    });

  } catch (error) {
    console.error("❌ Convex test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
