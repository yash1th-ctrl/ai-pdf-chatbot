import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function POST(request) {
  try {
    console.log("PDF Processor: Starting file processing...");

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({
        error: "No file provided"
      }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({
        error: "Only PDF files are supported"
      }, { status: 400 });
    }

    console.log("PDF Processor: Processing file:", file.name, "Size:", file.size);

    // Convert file to blob for processing
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    console.log("PDF Processor: Created blob, loading with WebPDFLoader...");

    // Load PDF using WebPDFLoader
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();

    console.log("PDF Processor: Loaded", docs.length, "pages");

    // Extract text content
    let pdfTextContent = "";
    docs.forEach(doc => {
      pdfTextContent = pdfTextContent + doc.pageContent + " ";
    });

    console.log("PDF Processor: Extracted text length:", pdfTextContent.length);

    if (pdfTextContent.trim().length === 0) {
      console.error("PDF Processor: No text content extracted from PDF");
      return NextResponse.json({
        error: "No text content could be extracted from the PDF. The PDF might be image-based or empty.",
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

    console.log("PDF Processor: Created", splitterList.length, "chunks");

    if (splitterList.length === 0) {
      console.error("PDF Processor: No valid chunks created");
      return NextResponse.json({
        error: "No valid text chunks could be created from the PDF",
        result: []
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result: splitterList,
      fullContent: pdfTextContent,
      metadata: {
        filename: file.name,
        fileSize: file.size,
        totalChunks: splitterList.length,
        originalTextLength: pdfTextContent.length,
        averageChunkSize: Math.round(splitterList.reduce((sum, chunk) => sum + chunk.length, 0) / splitterList.length)
      }
    });

  } catch (error) {
    console.error("PDF Processor Error:", error);
    return NextResponse.json({
      error: "Failed to process PDF",
      details: error.message
    }, { status: 500 });
  }
}
