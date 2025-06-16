import localFont from "next/font/local";
import "./globals.css";
import { Outfit } from "next/font/google";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "AI PDF Chatbot - Upload & Chat with PDFs using AI",
  description: "AI-powered PDF chatbot that lets you upload documents and ask questions using Google Gemini AI. Get instant answers from your PDF content.",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <ErrorBoundary>
            <Provider>{children}</Provider>
            <Toaster />
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
