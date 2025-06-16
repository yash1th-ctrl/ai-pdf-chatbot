"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // For animations
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  // USER HOOK
  const { user } = useUser();

  // Always call Convex hooks at the top level
  const createUser = useMutation(api.user.createUser);

  const CheckUser = async () => {
    if (!createUser) {
      console.log("Convex not configured, skipping user creation");
      return;
    }

    try {
      const result = await createUser({
        userName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
      });
      console.log("User created/updated:", result);
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  useEffect(() => {
    if (user && createUser) {
      CheckUser();
    }
  }, [user, createUser, CheckUser]);



  return (
    <div className="overflow-hidden bg-gradient-to-b from-background via-secondary to-muted">
      <div className="flex justify-between items-center p-3 sm:p-5 bg-card text-foreground fixed w-full top-0 left-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold">AI PDF Chatbot</h2>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/demo">
            <Button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
              Demo
            </Button>
          </Link>

          <Link href="/pdf-demo">
            <Button className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all">
              PDF Summary
            </Button>
          </Link>

          <Link href="/working-example">
            <Button className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-all">
              Working Example
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="px-6 sm:px-8 py-2 sm:py-3 text-lg sm:text-xl bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
              Dashboard
            </Button>
          </Link>

          <UserButton />
        </div>

        {/* Mobile menu */}
        <div className="flex lg:hidden items-center gap-2">
          <Link href="/dashboard">
            <Button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-screen gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-center text-foreground leading-tight"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI PDF <span className="text-primary">CHATBOT</span>
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground text-center max-w-4xl leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Seamlessly upload and convert your PDF documents with the power of AI.
          Get started now to experience fast, intuitive, and accurate document
          processing.
        </motion.p>
        <Link href="/dashboard">
          <Button className="mt-3 sm:mt-5 px-6 sm:px-8 py-3 text-lg sm:text-xl bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all w-full sm:w-auto max-w-xs">
            GET STARTED
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center py-12 sm:py-16 lg:py-20 bg-secondary text-foreground px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-screen-xl w-full">
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">Fast Uploads</h3>
            <p className="text-sm sm:text-base leading-relaxed">
              Upload and start converting your PDFs in no time. AI-powered
              technology processes documents in seconds.
            </p>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">Easy Conversion</h3>
            <p className="text-sm sm:text-base leading-relaxed">
              Convert your PDFs to text or extract valuable data effortlessly.
              Our AI makes it easy to manage large files.
            </p>
          </div>
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4">Secure Processing</h3>
            <p className="text-sm sm:text-base leading-relaxed">
              Your documents are safe with us. We ensure encrypted file
              transfers and processing for your peace of mind.
            </p>
          </div>
        </div>
      </div>

      <div className="py-10 bg-muted text-foreground text-center">
        <p className="text-sm">
          © 2024 AI PDF Generator. All rights reserved.
        </p>
        <div className="mt-3">
          <Link
            href="/privacy"
            className="text-primary hover:underline mr-4"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
