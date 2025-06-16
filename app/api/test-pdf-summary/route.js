import { NextResponse } from "next/server";
import { chatSession } from "@/config/AIModel";

export async function POST(request) {
  try {
    const { content, filename } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // Generate AI summary of the content
    const SUMMARY_PROMPT = `Please provide a comprehensive summary of the following document content. Include:

1. **Document Type**: What kind of document this appears to be
2. **Main Topics**: Key themes and subjects covered
3. **Key Information**: Important details, facts, or data points
4. **Structure**: How the content is organized
5. **Purpose**: The apparent purpose or goal of the document

Document Content:
"${content}"

Please provide a well-structured, informative summary that captures the essence of this document.`;

    console.log("Generating AI summary for:", filename);
    const aiResult = await chatSession.sendMessage(SUMMARY_PROMPT);
    const aiSummary = aiResult.response.text();
    
    return NextResponse.json({
      summary: aiSummary,
      filename: filename,
      contentLength: content.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json({
      error: "Failed to generate summary",
      details: error.message
    }, { status: 500 });
  }
}
