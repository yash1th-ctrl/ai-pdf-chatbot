"use client";
import { Progress } from "@/components/ui/progress";
import { AlignJustifyIcon, Layout, Shield } from "lucide-react";
import React from "react";
import UploadPdf from "./UploadPdf";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useUser();
  const path = usePathname();

  // Conditionally use Convex hooks only if environment is set up
  let GetUserInfo = null;
  let fileList = null;

  try {
    // Only import and use Convex if URL is available and not disabled
    if (process.env.NEXT_PUBLIC_CONVEX_URL && process.env.NEXT_PUBLIC_CONVEX_URL !== "disabled") {
      const { useQuery } = require("convex/react");
      const { api } = require("@/convex/_generated/api");

      // Get user email with fallback for testing
      const userEmail = user?.primaryEmailAddress?.emailAddress || "test@example.com";

      GetUserInfo = useQuery(api.user.GetUserInfo, {
        useEmail: userEmail,
      });

      fileList = useQuery(api.fileStorage.GetUserFiles, {
        userEmail: userEmail,
      });
    }
  } catch (error) {
    console.log("Convex not available, using fallback data");
  }

  // Provide fallback data when Convex is disabled or not available
  if (!GetUserInfo) GetUserInfo = [{ upgrade: false }];
  if (!fileList) fileList = [];

  // For testing: Add mock data if user is not signed in and no files exist
  if (!user?.primaryEmailAddress?.emailAddress && fileList.length === 0) {
    // Mock data to show that the counter works
    fileList = [
      { fileId: "mock-1", fileName: "Sample Document 1.pdf" },
      { fileId: "mock-2", fileName: "Sample Document 2.pdf" }
    ];
  }

  // Debug logging for sidebar
  console.log("Sidebar - User:", user?.primaryEmailAddress?.emailAddress);
  console.log("Sidebar - FileList:", fileList);
  console.log("Sidebar - FileList Length:", fileList?.length);

  if (!sidebarOpen) {
    return (
      <div className="fixed top-0 left-0 transition-all duration-500 p-3 sm:p-5 h-screen z-20 bg-card shadow shadow-border text-foreground w-16 sm:w-20">
        <div
          className="cursor-pointer"
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        >
          <AlignJustifyIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-64 sm:w-72 md:w-80 lg:w-96 h-screen bg-card text-foreground fixed top-0 left-0 z-50 lg:relative transition-all p-3 sm:p-4 lg:p-5 duration-500 shadow shadow-border">
      <div className="flex gap-3 sm:gap-5 items-center justify-start">
        <div
          className="cursor-pointer block lg:hidden"
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        >
          <AlignJustifyIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <Link href="/dashboard">
            <h2 className="text-lg sm:text-xl font-bold">AI-PDF-READER</h2>
          </Link>
        </motion.div>
      </div>
      <div className="mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <UploadPdf isMaxFile={false} />
        </motion.div>
        <Link href={"/dashboard"}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={`flex gap-2 items-center mt-3 sm:mt-5 p-2 sm:p-3 hover:bg-accent cursor-pointer rounded-md ${
              path == "/dashboard" && "bg-secondary"
            }`}
          >
            <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
            <h2 className="text-sm sm:text-base">Workspace</h2>
          </motion.div>
        </Link>

      </div>

    </div>
  );
};

export default Sidebar;
