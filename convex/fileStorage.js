import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// logic to store file
export const AddFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storage: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    createBy: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFile", {
      fileId: args.fileId,
      storage: args.storage,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      createBy: args.createBy,
    });
    return "Inserted New File";
  },
});

// this will give image url
export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const GetFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("pdfFile")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    return result[0];
  },
});

export const GetUserFiles = query({
  args: {
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args?.userEmail) {
      return;
    }
    const result = await ctx.db
      .query("pdfFile")
      .filter((q) => q.eq(q.field("createBy"), args?.userEmail))
      .collect();
    return result;
  },
});

// Delete a PDF file and all associated data
export const DeleteFile = mutation({
  args: {
    fileId: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Starting file deletion for fileId:", args.fileId);

      // 1. Get the file record to verify ownership and get storage ID
      const fileRecord = await ctx.db
        .query("pdfFile")
        .filter((q) => q.eq(q.field("fileId"), args.fileId))
        .filter((q) => q.eq(q.field("createBy"), args.userEmail))
        .first();

      if (!fileRecord) {
        throw new Error("File not found or you don't have permission to delete it");
      }

      console.log("Found file record:", fileRecord);

      // 2. Delete associated notes
      const notes = await ctx.db
        .query("notes")
        .filter((q) => q.eq(q.field("fileId"), args.fileId))
        .collect();

      for (const note of notes) {
        await ctx.db.delete(note._id);
      }
      console.log("Deleted", notes.length, "notes");

      // 3. Delete vector embeddings/documents
      const documents = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("metadata.fileId"), args.fileId))
        .collect();

      for (const doc of documents) {
        await ctx.db.delete(doc._id);
      }
      console.log("Deleted", documents.length, "document embeddings");

      // 4. Delete the file from storage
      if (fileRecord.storage) {
        try {
          await ctx.storage.delete(fileRecord.storage);
          console.log("Deleted file from storage:", fileRecord.storage);
        } catch (storageError) {
          console.log("Storage deletion failed (file may not exist):", storageError);
        }
      }

      // 5. Delete the file record from database
      await ctx.db.delete(fileRecord._id);
      console.log("Deleted file record from database");

      return {
        success: true,
        message: "File and all associated data deleted successfully",
        deletedItems: {
          fileRecord: 1,
          notes: notes.length,
          documents: documents.length,
          storage: fileRecord.storage ? 1 : 0
        }
      };

    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },
});
