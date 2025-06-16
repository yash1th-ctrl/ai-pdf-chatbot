import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export async function POST() {
  try {
    console.log("🗑️ Clearing all database data...");
    
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return NextResponse.json({
        success: false,
        error: "Convex URL not configured"
      }, { status: 500 });
    }

    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    // Clear all data
    const result = await client.mutation(api.admin.clearAllData, {});
    
    console.log("✅ Data clearing result:", result);

    return NextResponse.json({
      success: true,
      message: "All data cleared successfully",
      result: result
    });

  } catch (error) {
    console.error("❌ Error clearing data:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
