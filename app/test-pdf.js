// Simple test script to verify PDF processing
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function testPDFProcessing() {
  try {
    console.log("Testing PDF processing...");
    
    // This would be replaced with actual PDF file path
    const pdfPath = "./sample.pdf";
    
    console.log("Loading PDF from:", pdfPath);
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    
    console.log("PDF loaded successfully!");
    console.log("Number of pages:", docs.length);
    
    if (docs.length > 0) {
      console.log("First page content preview:", docs[0].pageContent.substring(0, 200) + "...");
    }
    
    // Split documents
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log("Documents split into", splitDocs.length, "chunks");
    
    return {
      success: true,
      pages: docs.length,
      chunks: splitDocs.length,
      preview: docs[0]?.pageContent.substring(0, 200)
    };
    
  } catch (error) {
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use in other files
export { testPDFProcessing };

// If running directly
if (typeof window === 'undefined') {
  testPDFProcessing().then(result => {
    console.log("Test result:", result);
  });
}
