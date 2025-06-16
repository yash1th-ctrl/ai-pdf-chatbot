"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { chatSession } from "@/config/AIModel";
import { ArrowRight, FileText, MessageSquare } from "lucide-react";

export default function DemoPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const samplePDFContent = `
    This is a sample PDF content about Artificial Intelligence and Machine Learning.
    
    Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans. Some of the activities computers with artificial intelligence are designed for include:
    
    - Speech recognition
    - Learning
    - Planning
    - Problem solving
    
    Machine Learning is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it to learn for themselves.
    
    Types of Machine Learning:
    1. Supervised Learning
    2. Unsupervised Learning
    3. Reinforcement Learning
    
    Applications of AI include:
    - Healthcare: Diagnosis and treatment recommendations
    - Finance: Fraud detection and algorithmic trading
    - Transportation: Autonomous vehicles
    - Entertainment: Recommendation systems
  `;

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast("Please enter a question first.");
      return;
    }

    setIsLoading(true);
    toast("AI is thinking...");

    try {
      const PROMPT = `Based on the following PDF content: "${samplePDFContent}"

Please answer this question: "${question}"

Provide a clear, accurate answer based only on the content provided above. Format your response in a readable way.`;

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

  const sampleQuestions = [
    "What is Artificial Intelligence?",
    "What are the types of Machine Learning?",
    "What are some applications of AI?",
    "What is the difference between AI and Machine Learning?"
  ];

  return (
    <div className="min-h-screen bg-[#181C14] text-[#ECDFCC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-[#ECDFCC]">
            🤖 AI PDF Reader Demo
          </h1>
          <p className="text-base sm:text-lg text-[#ECDFCC]/80 max-w-3xl mx-auto">
            Ask questions about the sample PDF content and get AI-powered answers!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Question Input Section */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-xl font-semibold">
                <MessageSquare className="w-5 h-5" />
                Ask a Question
              </h3>
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your question about the PDF content..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-[#181C14] border-[#697565] text-[#ECDFCC] placeholder:text-[#ECDFCC]/50"
                rows={4}
              />
              
              <Button
                onClick={handleAskQuestion}
                disabled={isLoading}
                className="w-full bg-[#697565] hover:bg-[#ECDFCC] hover:text-[#181C14] text-[#ECDFCC]"
              >
                {isLoading ? "Thinking..." : "Ask AI"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="space-y-2">
                <p className="text-sm text-[#ECDFCC]/70">Try these sample questions:</p>
                {sampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(q)}
                    className="block w-full text-left text-sm p-2 rounded bg-[#181C14] hover:bg-[#697565] text-[#ECDFCC]/80 hover:text-[#ECDFCC] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-xl font-semibold">
                <FileText className="w-5 h-5" />
                AI Response
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
                    Ask a question to see the AI response here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sample PDF Content Preview */}
        <div className="mt-6 bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-[#ECDFCC] text-xl font-semibold">Sample PDF Content</h3>
          </div>
          <div>
            <div className="bg-[#181C14] p-4 rounded-lg border border-[#697565] max-h-60 overflow-y-auto">
              <pre className="text-sm text-[#ECDFCC]/80 whitespace-pre-wrap">
                {samplePDFContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
