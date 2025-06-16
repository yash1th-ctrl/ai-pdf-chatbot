"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import UploadPdf from "./_components/UploadPdf";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useUser();
  const [deletingFileId, setDeletingFileId] = useState(null);

  // Always call Convex hooks at the top level
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexAvailable = convexUrl && convexUrl !== "disabled" && convexUrl.startsWith("https://");

  // Get user email with fallback
  const userEmail = user?.primaryEmailAddress?.emailAddress || "test@example.com";

  // Always call the useQuery hook - it will handle errors gracefully if ConvexProvider is not available
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: userEmail,
  });

  // Delete mutation
  const deleteFile = useMutation(api.fileStorage.DeleteFile);

  // Provide fallback data when Convex query returns undefined/null
  const displayFileList = fileList || [];

  // Debug logging
  console.log("Dashboard - User:", user?.primaryEmailAddress?.emailAddress);
  console.log("Dashboard - FileList:", fileList);
  console.log("Dashboard - ConvexAvailable:", convexAvailable);

  // Handle file deletion
  const handleDeleteFile = async (fileId, fileName, event) => {
    event.preventDefault(); // Prevent navigation to workspace
    event.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingFileId(fileId);

    try {
      const result = await deleteFile({
        fileId: fileId,
        userEmail: userEmail,
      });

      toast.success(`"${fileName}" deleted successfully`);
      console.log("Delete result:", result);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete "${fileName}": ${error.message}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.h2
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="font-medium text-2xl sm:text-3xl mt-20 sm:mt-24 lg:mt-28 text-center lg:text-left">WorkSpace</motion.h2>
        <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-5 mt-6 sm:mt-8 lg:mt-10">
          <UploadPdf />
          {displayFileList?.length > 0
            ? displayFileList.map((file) => (
                <div key={file.fileId} className="relative group">
                  <Link href={"/workspace/" + file.fileId}>
                    <div className="flex p-2 sm:p-3 shadow-md rounded-md flex-col items-center justify-center border hover:cursor-pointer hover:scale-105 transition-all min-h-[100px] sm:min-h-[120px]">
                      <Image src="/pdf.png" width={50} height={50} className="sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px]" alt="pdf" />
                      <h2 className="mt-1 sm:mt-2 font-normal md:font-medium text-xs sm:text-sm text-center line-clamp-2 break-words">
                        {file.fileName}
                      </h2>
                    </div>
                  </Link>
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteFile(file.fileId, file.fileName, e)}
                    disabled={deletingFileId === file.fileId}
                    className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                    title={`Delete ${file.fileName}`}
                  >
                    {deletingFileId === file.fileId ? "..." : "×"}
                  </button>
                </div>
              ))
            : [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="bg-slate-700 rounded-md h-[100px] sm:h-[120px] w-full animate-pulse"
                ></div>
              ))}
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
