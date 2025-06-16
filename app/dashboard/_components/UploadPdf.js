"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import uuid4 from "uuid4";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const UploadPdf = ({ isMaxFile }) => {
  const [useFile, setUseFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState();
  const [debounce, setDebounce] = useState();
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // Always call Convex hooks - they will handle errors if ConvexProvider is not available
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexAvailable = convexUrl && convexUrl !== "disabled" && convexUrl.startsWith("https://");

  // Always call hooks at the top level - this is required by React
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocumnet = useAction(api.myActions.ingest);

  const onFileEvent = (e) => {
    setUseFile(e.target.files[0]);
  };

  const getFileNameHandler = (e) => {
    setFileName(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(fileName);
    }, 700);
    return () => clearTimeout(timer);
  }, [fileName]);

  const onUplaod = async () => {
    if (!useFile) {
      toast({ title: "Please select a file", type: "error" });
      return;
    }
    if (useFile.size > 5 * 1024 * 1024) {
      toast({ title: "File size exceeds the 5MB limit", type: "error" });
      return;
    }

    // Check if Convex is available
    if (!convexAvailable) {
      toast({
        title: "Upload service not configured",
        description: "Convex is not properly configured. Please check your environment variables.",
        type: "error"
      });
      return;
    }

    try {
      setLoading(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": useFile?.type },
        body: useFile,
      });
      const { storageId } = await result.json();
      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId });
      await addFileEntry({
        fileId: fileId,
        storage: storageId,
        fileName: fileName ?? "unTitled file",
        fileUrl: fileUrl,
        createBy: user?.primaryEmailAddress?.emailAddress,
      });
      toast({ title: "File uploaded successfully", type: "success" });

      // API call to fetch PDF process data
      console.log("Processing PDF:", fileUrl);
      const response = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data.result || response.data.result.length === 0) {
        throw new Error("No text content could be extracted from the PDF");
      }

      console.log("PDF processed successfully, creating embeddings...");
      const embadedresult = await embeddDocumnet({
        splitText: response.data.result,
        fileId: fileId,
      });

      console.log("Embeddings created successfully:", embadedresult);
      toast({ title: "PDF processed and ready for chat!", type: "success" });

      // Refresh the page to update the file list and counter
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Upload failed. ";

      if (error.message.includes("No text content")) {
        errorMessage += "The PDF appears to be empty or contains only images. Please try a different PDF.";
      } else if (error.message.includes("Failed to create embeddings")) {
        errorMessage += "There was an error processing the PDF content. Please try again.";
      } else {
        errorMessage += "Please try again or contact support if the issue persists.";
      }

      toast({ title: errorMessage, type: "error" });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {" "}
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            disabled={isMaxFile}
            className="w-full bg-[#ECDFCC] text-black hover:text-white"
          >
            + Upload PDF File
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#181C14] text-[#ECDFCC]">
          <DialogHeader>
            <DialogTitle className="mb-3" >Upload PDF File</DialogTitle>
            <DialogDescription asChild>
              <div>
                <h2>Select a file to Upload</h2>
                <div className="flex mt-1 p-4 rounded-md border">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => onFileEvent(e)}
                  />
                </div>
                <div className="mt-2">
                  <label>
                    <span className="text-red-600">* </span>File Name
                  </label>
                  <Input
                    placeholder="Enter the File Name..."
                    onChange={getFileNameHandler}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="text-[#181C14] bg-[#ECDFCC]"
            >
              Close
            </Button>
            <Button onClick={onUplaod} disabled={loading} className="hover:bg-[#ECDFCC] hover:text-[#181C14]">
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
        <Toaster position="bottom-right" />
      </Dialog>
    </>
  );
};

export default UploadPdf;
