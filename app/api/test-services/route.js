import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    services: {},
    overall: "unknown"
  };

  try {
    // Test 1: Environment Variables
    console.log("Testing environment variables...");
    results.services.environment = {
      status: "checking",
      details: {}
    };

    const requiredEnvVars = {
      NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
    };

    let envStatus = "success";
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      const isPresent = !!value;
      results.services.environment.details[key] = {
        present: isPresent,
        value: isPresent ? `${value.substring(0, 10)}...` : "missing"
      };
      if (!isPresent) envStatus = "error";
    }
    results.services.environment.status = envStatus;

    // Test 2: Google Gemini AI API
    console.log("Testing Google Gemini AI API...");
    results.services.gemini = {
      status: "checking",
      model: "gemini-1.5-flash",
      details: {}
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      results.services.gemini.status = "error";
      results.services.gemini.details.error = "API key not found";
    } else {
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const testPrompt = "Hello! Please respond with exactly: 'Gemini API is working correctly.'";
        
        console.log("Sending test prompt to Gemini...");
        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();

        results.services.gemini.status = "success";
        results.services.gemini.details = {
          prompt: testPrompt,
          response: text,
          responseLength: text.length,
          containsExpectedText: text.includes("Gemini API is working")
        };

        console.log("Gemini API test successful:", text);
      } catch (error) {
        console.error("Gemini API test failed:", error);
        results.services.gemini.status = "error";
        results.services.gemini.details = {
          error: error.message,
          errorType: error.constructor.name
        };
      }
    }

    // Test 3: Convex Connection
    console.log("Testing Convex connection...");
    results.services.convex = {
      status: "checking",
      details: {}
    };

    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      results.services.convex.status = "error";
      results.services.convex.details.error = "Convex URL not found";
    } else {
      try {
        // Test if Convex URL is reachable
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
        const testUrl = `${convexUrl}/api/ping`;
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        results.services.convex.status = response.ok ? "success" : "warning";
        results.services.convex.details = {
          url: convexUrl,
          responseStatus: response.status,
          responseOk: response.ok
        };
      } catch (error) {
        results.services.convex.status = "warning";
        results.services.convex.details = {
          error: error.message,
          note: "Convex might still work for database operations"
        };
      }
    }

    // Test 4: PDF Processing Capability
    console.log("Testing PDF processing capability...");
    results.services.pdfProcessing = {
      status: "checking",
      details: {}
    };

    try {
      // Test if required packages are available
      const { RecursiveCharacterTextSplitter } = await import("langchain/text_splitter");

      // Test PDF processing by checking if we can create a text splitter
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const testText = "This is a test document for PDF processing. It contains multiple sentences to test text splitting functionality.";
      const chunks = await splitter.createDocuments([testText]);

      results.services.pdfProcessing.status = "success";
      results.services.pdfProcessing.details = {
        textSplitterAvailable: !!RecursiveCharacterTextSplitter,
        testTextLength: testText.length,
        chunksCreated: chunks.length,
        note: "PDF text processing libraries working correctly"
      };
    } catch (error) {
      results.services.pdfProcessing.status = "error";
      results.services.pdfProcessing.details = {
        error: error.message,
        note: "PDF processing libraries not available"
      };
    }

    // Test 5: Vector Embeddings
    console.log("Testing vector embeddings...");
    results.services.embeddings = {
      status: "checking",
      details: {}
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      results.services.embeddings.status = "error";
      results.services.embeddings.details.error = "Google API key required for embeddings";
    } else {
      try {
        const { GoogleGenerativeAIEmbeddings } = await import("@langchain/google-genai");
        const { TaskType } = await import("@google/generative-ai");

        const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Test embedding",
        });

        // Test embedding generation
        const testText = "This is a test document for embedding generation.";
        const embedding = await embeddings.embedQuery(testText);

        results.services.embeddings.status = "success";
        results.services.embeddings.details = {
          model: "text-embedding-004",
          testText: testText,
          embeddingLength: embedding.length,
          embeddingDimensions: embedding.length,
          sampleValues: embedding.slice(0, 5)
        };

        console.log("Embeddings test successful, dimensions:", embedding.length);
      } catch (error) {
        console.error("Embeddings test failed:", error);
        results.services.embeddings.status = "error";
        results.services.embeddings.details = {
          error: error.message,
          errorType: error.constructor.name
        };
      }
    }

    // Determine overall status
    const statuses = Object.values(results.services).map(service => service.status);
    if (statuses.every(status => status === "success")) {
      results.overall = "success";
    } else if (statuses.some(status => status === "error")) {
      results.overall = "error";
    } else {
      results.overall = "warning";
    }

    console.log("Service testing completed. Overall status:", results.overall);

    return NextResponse.json({
      success: true,
      message: "Service testing completed",
      results: results
    });

  } catch (error) {
    console.error("Service testing failed:", error);
    
    results.overall = "error";
    results.error = {
      message: error.message,
      type: error.constructor.name
    };

    return NextResponse.json({
      success: false,
      message: "Service testing failed",
      results: results,
      error: error.message
    }, { status: 500 });
  }
}
