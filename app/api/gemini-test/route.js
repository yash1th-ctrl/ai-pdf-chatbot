import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { query, content } = await request.json();
    
    console.log("🧪 Testing Gemini AI with actual PDF content...");
    console.log("Query:", query);
    console.log("Content preview:", content.substring(0, 200) + "...");

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "Google AI API key not configured"
      }, { status: 500 });
    }

    // Create the same prompt structure used in your app
    const PROMPT = `You are an AI assistant specialized in analyzing PDF documents. You have been provided with relevant content from a PDF document.

**PDF Content:**
${content}

**User Question:** ${query}

**Instructions:**
1. Analyze the provided PDF content carefully
2. Answer the user's question based ONLY on the information available in the PDF content
3. If the PDF content doesn't contain enough information to answer the question, clearly state this
4. Provide a comprehensive, well-structured answer in HTML format
5. Use appropriate HTML tags like <h3>, <p>, <ul>, <li>, <strong>, <em> for formatting
6. Be accurate, concise, and helpful
7. If providing a summary, include key points and important details
8. If extracting information, organize it clearly

**Response Format:** Provide your answer in clean HTML format without code blocks or markdown.`;

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("📤 Sending prompt to Gemini AI...");
    const result = await model.generateContent(PROMPT);
    const response = await result.response;
    const text = response.text();

    console.log("📥 AI Response received");
    console.log("Response length:", text.length);

    // Analyze response quality
    const analysis = {
      hasGabrielMarquez: text.toLowerCase().includes("gabriel") || text.toLowerCase().includes("marquez"),
      hasSellMyDreams: text.toLowerCase().includes("sell my dreams") || text.toLowerCase().includes("dreams"),
      hasHavana: text.toLowerCase().includes("havana"),
      hasShortStory: text.toLowerCase().includes("short story") || text.toLowerCase().includes("story"),
      hasMagicalRealism: text.toLowerCase().includes("magical realism") || text.toLowerCase().includes("realism"),
      hasFrauFrieda: text.toLowerCase().includes("frau frieda") || text.toLowerCase().includes("frieda"),
      hasVienna: text.toLowerCase().includes("vienna"),
      hasNeruda: text.toLowerCase().includes("neruda") || text.toLowerCase().includes("pablo"),
    };

    const accuracyScore = Object.values(analysis).filter(Boolean).length;
    const totalChecks = Object.keys(analysis).length;

    console.log("🔍 Response Analysis:");
    console.log("Accuracy Score:", `${accuracyScore}/${totalChecks}`);
    console.log("Analysis details:", analysis);

    let qualityAssessment;
    if (accuracyScore >= 6) {
      qualityAssessment = "EXCELLENT - AI is accurately responding to your PDF content!";
    } else if (accuracyScore >= 4) {
      qualityAssessment = "GOOD - AI is mostly responding to your PDF content";
    } else if (accuracyScore >= 2) {
      qualityAssessment = "FAIR - AI is partially responding to your PDF content";
    } else {
      qualityAssessment = "POOR - AI may not be accessing your PDF content correctly";
    }

    return NextResponse.json({
      success: true,
      query: query,
      response: text,
      analysis: {
        accuracyScore: `${accuracyScore}/${totalChecks}`,
        qualityAssessment: qualityAssessment,
        details: analysis,
        responseLength: text.length
      }
    });

  } catch (error) {
    console.error("❌ Error testing Gemini AI:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
