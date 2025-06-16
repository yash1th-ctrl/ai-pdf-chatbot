"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/config/AIModel";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

export default function PDFDemoPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");

  // Sample PDF content (like a resume)
  const samplePDFContent = `
    YASHWANTH REDDY KONA
    Software Developer | Full Stack Engineer
    Email: yashwanth.kona@email.com | Phone: +1-234-567-8900
    LinkedIn: linkedin.com/in/yashwanth-kona | GitHub: github.com/yashwanth-kona
    
    PROFESSIONAL SUMMARY
    Experienced Full Stack Developer with 3+ years of expertise in building scalable web applications using modern technologies. Proficient in React, Node.js, Python, and cloud platforms. Strong background in AI/ML integration and database management.
    
    TECHNICAL SKILLS
    • Programming Languages: JavaScript, Python, Java, TypeScript, C++
    • Frontend: React.js, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
    • Backend: Node.js, Express.js, Django, Flask, REST APIs
    • Databases: MongoDB, PostgreSQL, MySQL, Redis
    • Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git
    • AI/ML: TensorFlow, PyTorch, OpenAI API, LangChain
    
    PROFESSIONAL EXPERIENCE
    
    Senior Software Developer | TechCorp Solutions (2022 - Present)
    • Developed and maintained 5+ full-stack web applications serving 10,000+ users
    • Implemented AI-powered features using OpenAI and Google AI APIs
    • Optimized database queries resulting in 40% performance improvement
    • Led a team of 3 junior developers on multiple projects
    • Built responsive UIs with React and modern CSS frameworks
    
    Full Stack Developer | InnovateTech (2021 - 2022)
    • Created RESTful APIs and microservices using Node.js and Express
    • Integrated third-party payment systems and authentication services
    • Developed real-time chat applications using WebSocket technology
    • Collaborated with cross-functional teams in Agile environment
    
    PROJECTS
    
    AI PDF Chatbot (2024)
    • Built a full-stack application for PDF document analysis and Q&A
    • Technologies: Next.js, Convex, Google Gemini AI, LangChain
    • Features: PDF upload, text extraction, vector search, AI responses
    
    E-commerce Platform (2023)
    • Developed complete e-commerce solution with payment integration
    • Technologies: React, Node.js, MongoDB, Stripe API
    • Implemented inventory management and order tracking systems
    
    EDUCATION
    Bachelor of Technology in Computer Science
    Indian Institute of Technology (IIT) | 2017 - 2021
    CGPA: 8.5/10
    
    CERTIFICATIONS
    • AWS Certified Solutions Architect
    • Google Cloud Professional Developer
    • MongoDB Certified Developer
    
    ACHIEVEMENTS
    • Winner of National Hackathon 2023 for AI Innovation
    • Published 2 research papers on Machine Learning applications
    • Contributed to 10+ open-source projects on GitHub
  `;

  const generateSummary = async () => {
    setIsGenerating(true);
    toast("AI is analyzing the PDF content...");

    try {
      const response = await fetch('/api/test-pdf-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: samplePDFContent,
          filename: "Yashwanth-Reddy-Kona-Resume.pdf"
        })
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setSummary(result.summary);
      toast("AI summary generated successfully!");

    } catch (error) {
      console.error("Summary generation error:", error);
      toast("Error generating summary. Please try again.");
      setSummary("Sorry, I couldn't generate a summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181C14] text-[#ECDFCC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-[#ECDFCC]">
            📄 AI PDF Summary Demo
          </h1>
          <p className="text-base sm:text-lg text-[#ECDFCC]/80 max-w-3xl mx-auto">
            See how AI analyzes and summarizes PDF content in real-time!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Sample PDF Content */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-lg sm:text-xl font-semibold">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Sample PDF Content
              </h3>
              <p className="text-xs sm:text-sm text-[#ECDFCC]/70 mt-2">
                This is the content that would be extracted from a PDF resume
              </p>
            </div>
            <div className="bg-[#181C14] p-3 sm:p-4 rounded-lg border border-[#697565] max-h-64 sm:max-h-96 overflow-y-auto">
              <pre className="text-xs sm:text-sm text-[#ECDFCC]/80 whitespace-pre-wrap">
                {samplePDFContent}
              </pre>
            </div>
            <div className="mt-4">
              <Button
                onClick={generateSummary}
                disabled={isGenerating}
                className="w-full bg-[#697565] hover:bg-[#ECDFCC] hover:text-[#181C14] text-[#ECDFCC] text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating AI Summary...
                  </>
                ) : (
                  <>
                    Generate AI Summary
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-[#ECDFCC] text-xl font-semibold">
                <Sparkles className="w-5 h-5" />
                AI Generated Summary
              </h3>
              <p className="text-sm text-[#ECDFCC]/70 mt-2">
                AI analysis and summary of the PDF content
              </p>
            </div>
            <div className="bg-[#181C14] p-4 rounded-lg border border-[#697565] min-h-96 max-h-96 overflow-y-auto">
              {summary ? (
                <div className="text-[#ECDFCC] whitespace-pre-wrap text-sm">
                  {summary}
                </div>
              ) : (
                <div className="text-[#ECDFCC]/50 italic text-center flex items-center justify-center h-full">
                  Click "Generate AI Summary" to see the AI analysis...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#3C3D37] border border-[#697565] rounded-lg p-6">
          <h3 className="text-[#ECDFCC] text-xl font-semibold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-[#ECDFCC]/80">
            <div>
              <h4 className="font-semibold text-[#ECDFCC] mb-2">1. Content Extraction</h4>
              <p>The system extracts text content from uploaded PDF files using advanced parsing techniques.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#ECDFCC] mb-2">2. AI Analysis</h4>
              <p>Google's Gemini AI analyzes the content to understand structure, topics, and key information.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#ECDFCC] mb-2">3. Smart Summary</h4>
              <p>The AI generates a comprehensive summary highlighting the most important aspects of the document.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
