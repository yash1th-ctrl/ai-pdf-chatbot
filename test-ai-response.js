// Test script to verify AI responses with actual PDF content
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAIResponse() {
  console.log("🧪 Testing AI Response with Your PDF Content...");
  
  // Your actual PDF content (first chunk)
  const pdfContent = `1/I SELL MY DREAMS
Short stories
INTRODUCTION
A short story is a prose narrative of limited length.
It organises the action and thoughts of its
characters into the pattern of a plot. The plot
form may be comic, tragic, romantic or satiric.
The central incident is selected to manifest, as
much as possible, the protagonist's life and
character, and the details contribute to the
development of the plot.

Gabriel Garcia Marquez was brought up by his
grandparents in Northern Columbia because his
parents were poor and struggling. A novelist, short-
story writer and journalist, he is widely considered
the greatest living Latin American master of narrative.
Marquez won the Nobel Prize in Literature in 1982.
His two masterpieces are One Hundred Years in
Solitude (1967, tr. 1970) and Love in The Time of
Cholera (1985, tr. 1988). His themes are violence,
solitude and the overwhelming human need for love.
This story reflects, like most of his works, a high
point in Latin American magical realism; it is rich
and lucid, mixing reality with fantasy.

One morning at nine o'clock, while we were having breakfast
on the terrace of the Havana Riviera Hotel under a bright
sun, a huge wave picked up several cars that were driving
down the avenue along the seawall or parked on the
pavement, and embedded one of them in the side of the
hotel. It was like an explosion of dynamite that sowed panic
on all twenty floors of the building and turned the great
entrance window to dust.`;

  // Test the AI prompt that your system uses
  const PROMPT = `You are an AI assistant specialized in analyzing PDF documents. You have been provided with relevant content from a PDF document.

**PDF Content:**
${pdfContent}

**User Question:** Summarize this document

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

  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("📤 Sending prompt to Gemini AI...");
    const result = await model.generateContent(PROMPT);
    const response = await result.response;
    const text = response.text();

    console.log("📥 AI Response received:");
    console.log("=" * 50);
    console.log(text);
    console.log("=" * 50);

    // Analyze response quality
    console.log("\n🔍 Response Analysis:");
    
    const hasGabrielMarquez = text.includes("Gabriel") || text.includes("Marquez");
    const hasSellMyDreams = text.includes("Sell My Dreams") || text.includes("Dreams");
    const hasHavana = text.includes("Havana");
    const hasShortStory = text.includes("short story") || text.includes("story");
    const hasMagicalRealism = text.includes("magical realism") || text.includes("realism");
    
    console.log(`✅ Mentions Gabriel Garcia Marquez: ${hasGabrielMarquez}`);
    console.log(`✅ Mentions "I Sell My Dreams": ${hasSellMyDreams}`);
    console.log(`✅ Mentions Havana: ${hasHavana}`);
    console.log(`✅ Mentions short story: ${hasShortStory}`);
    console.log(`✅ Mentions magical realism: ${hasMagicalRealism}`);
    
    const accuracyScore = [hasGabrielMarquez, hasSellMyDreams, hasHavana, hasShortStory, hasMagicalRealism].filter(Boolean).length;
    console.log(`\n🎯 Accuracy Score: ${accuracyScore}/5`);
    
    if (accuracyScore >= 4) {
      console.log("🎉 EXCELLENT! AI is accurately responding to your PDF content!");
    } else if (accuracyScore >= 2) {
      console.log("⚠️ GOOD: AI is partially responding to your PDF content");
    } else {
      console.log("❌ POOR: AI may not be accessing your PDF content correctly");
    }

  } catch (error) {
    console.error("❌ Error testing AI response:", error.message);
  }
}

// Run the test
testAIResponse();
