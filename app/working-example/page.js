"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { chatSession } from "@/config/AIModel";
import { ArrowRight, Upload, FileText, MessageSquare, CheckCircle } from "lucide-react";

export default function WorkingExamplePage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfContent, setPdfContent] = useState("");

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    toast("Processing PDF and generating AI summary...");

    try {
      // Process the PDF using direct file upload
      console.log("Processing PDF file:", selectedFile.name);

      // Create FormData to send the file directly
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Process PDF content using our new API
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.success || !result.result || result.result.length === 0) {
        throw new Error("No text content could be extracted from the PDF");
      }

      // Use the full content from the API response
      const fullContent = result.fullContent;
      console.log("Extracted PDF content length:", fullContent.length);

      // Generate AI summary using our API
      console.log("Generating AI summary...");

      const summaryResponse = await fetch('/api/test-pdf-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: fullContent,
          filename: selectedFile.name
        })
      });

      const summaryResult = await summaryResponse.json();

      if (summaryResult.error) {
        throw new Error(summaryResult.error);
      }

      // Set the AI-generated summary as the PDF content
      setPdfContent(`📄 **AI Summary of ${selectedFile.name}**

${summaryResult.summary}

---
📊 **Processing Details:**
- Original Content Length: ${fullContent.length} characters
- Processed Chunks: ${result.result.length}
- File Size: ${result.metadata.fileSize} bytes
- Processing Time: ${summaryResult.timestamp}
`);

      setIsProcessed(true);
      toast("PDF processed and AI summary generated successfully!");

    } catch (error) {
      console.error("PDF processing error:", error);
      let errorMessage = "Error processing PDF. ";

      if (error.message.includes("No text content")) {
        errorMessage += "The PDF appears to be empty or contains only images.";
      } else if (error.message.includes("Failed to process")) {
        errorMessage += "There was an error reading the PDF file.";
      } else {
        errorMessage += "Please try again with a different PDF file.";
      }

      toast(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast("Please enter a question first.");
      return;
    }

    if (!isProcessed) {
      toast("Please upload and process a PDF first.");
      return;
    }

    setIsLoading(true);
    toast("AI is analyzing your question...");

    try {
      const PROMPT = `Based on the following PDF content: "${pdfContent}"

Please answer this question: "${question}"

Provide a clear, accurate answer based on the content provided. If the question cannot be answered from the given content, please say so and provide a helpful general response.`;

      const AiModelResult = await chatSession.sendMessage(PROMPT);
      const aiResponse = AiModelResult.response.text();

      setResponse(aiResponse);
      toast("Response generated successfully!");
    } catch (error) {
      console.error("AI generation error:", error);
      toast("Error generating response. Please try again.");
      setResponse("Sorry, I couldn't generate a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181C14] text-[#ECDFCC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-[#ECDFCC]">
            📄 AI PDF Reader - Working Example
          </h1>
          <p className="text-base sm:text-lg text-[#ECDFCC]/80 max-w-3xl mx-auto">
            Upload a PDF, process it, and ask AI questions about its content!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1: Upload PDF */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-lg sm:text-xl font-semibold">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                Step 1: Upload PDF
              </h3>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#697565] rounded-lg p-4 sm:p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-[#ECDFCC]/50" />
                  <p className="text-sm sm:text-base text-[#ECDFCC]/70">
                    {file ? file.name : "Click to upload PDF"}
                  </p>
                </label>
              </div>
              
              {isProcessing && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ECDFCC] mx-auto"></div>
                  <p className="mt-2 text-[#ECDFCC]/70">Processing PDF...</p>
                </div>
              )}
              
              {isProcessed && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>PDF processed successfully!</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Ask Questions */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-lg sm:text-xl font-semibold">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Step 2: Ask Questions
              </h3>
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Ask a question about your PDF..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-[#181C14] border-[#697565] text-[#ECDFCC] placeholder:text-[#ECDFCC]/50"
                rows={4}
                disabled={!isProcessed}
              />
              
              <Button
                onClick={handleAskQuestion}
                disabled={isLoading || !isProcessed}
                className="w-full bg-[#697565] hover:bg-[#ECDFCC] hover:text-[#181C14] text-[#ECDFCC]"
              >
                {isLoading ? "Thinking..." : "Ask AI"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {!isProcessed && (
                <p className="text-sm text-[#ECDFCC]/50 text-center">
                  Upload a PDF first to ask questions
                </p>
              )}
            </div>
          </div>

          {/* Step 3: View Response */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-lg sm:text-xl font-semibold">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Step 3: AI Response
              </h3>
            </div>
            <div>
              <div className="bg-[#181C14] p-4 rounded-lg min-h-[200px] border border-[#697565]">
                {response ? (
                  <div className="text-[#ECDFCC] whitespace-pre-wrap">
                    {response}
                  </div>
                ) : (
                  <div className="text-[#ECDFCC]/50 italic">
                    AI response will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Content Preview */}
        {isProcessed && (
          <div className="mt-6 bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-[#ECDFCC] text-xl font-semibold">Processed PDF Content Preview</h3>
            </div>
            <div>
              <div className="bg-[#181C14] p-4 rounded-lg border border-[#697565] max-h-60 overflow-y-auto">
                <pre className="text-sm text-[#ECDFCC]/80 whitespace-pre-wrap">
                  {pdfContent}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-[#ECDFCC] text-xl font-semibold">How It Works</h3>
          </div>
          <div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-[#ECDFCC]/80">
              <div>
                <h4 className="font-semibold text-[#ECDFCC] mb-2">1. Upload</h4>
                <p>Upload your PDF file. The system will extract and process the text content.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#ECDFCC] mb-2">2. Ask</h4>
                <p>Type any question about the PDF content. The AI will analyze your question.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#ECDFCC] mb-2">3. Get Answers</h4>
                <p>Receive intelligent, context-aware answers based on your PDF content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
