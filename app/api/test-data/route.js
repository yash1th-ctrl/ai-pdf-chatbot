import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("Creating test data...");
    
    // Sample PDF content for testing
    const sampleContent = [
      "This is a sample PDF document about artificial intelligence and machine learning.",
      "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data.",
      "Deep learning uses neural networks with multiple layers to process complex patterns in data.",
      "Natural language processing enables computers to understand and generate human language.",
      "Computer vision allows machines to interpret and understand visual information from images and videos.",
      "The future of AI includes applications in healthcare, autonomous vehicles, and smart cities."
    ];
    
    const fileId = "0777782ea-e0ef-492e-9ee5-213fa3e69413";
    const userEmail = "test@example.com";
    
    // This would normally be done through Convex mutations
    // For now, return the sample data that the AI can use
    
    const response = {
      success: true,
      message: "Test data created successfully",
      fileId: fileId,
      content: sampleContent,
      fileInfo: {
        fileId: fileId,
        fileName: "Sample AI Document.pdf",
        fileUrl: "https://example.com/sample.pdf",
        createBy: userEmail
      }
    };
    
    console.log("Test data response:", response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Error creating test data:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(req) {
  // Return sample content for AI testing
  const sampleContent = [
    "This is a sample PDF document about artificial intelligence and machine learning.",
    "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data.",
    "Deep learning uses neural networks with multiple layers to process complex patterns in data.",
    "Natural language processing enables computers to understand and generate human language.",
    "Computer vision allows machines to interpret and understand visual information from images and videos.",
    "The future of AI includes applications in healthcare, autonomous vehicles, and smart cities."
  ];
  
  return NextResponse.json({ 
    result: sampleContent,
    message: "Sample content for AI testing" 
  });
}
