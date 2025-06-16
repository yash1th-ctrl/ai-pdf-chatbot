import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get("pdfUrl");

  try {
    console.log("PDF Loader: Attempting to fetch PDF from:", pdfUrl);

    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(pdfUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.blob();
    console.log("PDF Loader: Successfully fetched PDF, size:", data.size);

    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = "";
    docs.forEach(doc => {
      pdfTextContent = pdfTextContent + doc.pageContent + " ";
    });

    console.log("PDF Loader: Extracted text length:", pdfTextContent.length);

    if (pdfTextContent.trim().length === 0) {
      console.error("PDF Loader: No text content extracted from PDF");
      return NextResponse.json({
        error: "No text content could be extracted from the PDF",
        result: []
      }, { status: 400 });
    }

    // Split the text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const output = await splitter.createDocuments([pdfTextContent]);

    // Store the chunks in list
    let splitterList = [];
    output.forEach((doc) => {
      if (doc.pageContent.trim().length > 0) {
        splitterList.push(doc.pageContent);
      }
    });

    console.log("PDF Loader: Created", splitterList.length, "chunks");
    console.log("PDF Loader: Sample chunk:", splitterList[0]?.substring(0, 100) + "...");

    if (splitterList.length === 0) {
      console.error("PDF Loader: No valid chunks created");
      return NextResponse.json({
        error: "No valid text chunks could be created from the PDF",
        result: []
      }, { status: 400 });
    }

    return NextResponse.json({
      result: splitterList,
      metadata: {
        totalChunks: splitterList.length,
        originalTextLength: pdfTextContent.length,
        averageChunkSize: Math.round(splitterList.reduce((sum, chunk) => sum + chunk.length, 0) / splitterList.length)
      }
    });

  } catch (error) {
    console.error("PDF Loader Error:", error);
    return NextResponse.json({
      error: "Failed to process PDF",
      details: error.message
    }, { status: 500 });
  }
}
