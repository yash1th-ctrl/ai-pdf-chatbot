"use client";
import React, { useEffect } from "react";
import WorkSpaceHeader from "../_components/WorkSpaceHeader";
import PdfViewer from "../_components/PdfViewer";
import TextEditor from "../_components/TextEditor";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const WorkSpace = () => {
  const { fileId } = useParams();

  // Always call Convex hooks at the top level
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
    fileId: fileId,
  });

  // Provide fallback data when query returns undefined/null
  const displayFileInfo = fileInfo || { fileName: "Document", fileUrl: "" };

  // Debug logging
  console.log("Workspace - FileId:", fileId);
  console.log("Workspace - FileInfo:", fileInfo);
  return (
    <div>
      <WorkSpaceHeader fileName={displayFileInfo?.fileName} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <TextEditor fileId={fileId} />
        </div>
        <div>
          <PdfViewer fileUrl={displayFileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
