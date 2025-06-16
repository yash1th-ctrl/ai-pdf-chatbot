import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Ingest action called with:", {
        fileId: args.fileId,
        textChunks: args.splitText?.length || 0
      });

      if (!args.splitText || args.splitText.length === 0) {
        throw new Error("No text chunks provided for embedding");
      }

      console.log("Creating embeddings for", args.splitText.length, "text chunks");

      await ConvexVectorStore.fromTexts(
        args.splitText,
        { fileId: args.fileId },
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyCiaa5W0328n9DecOiAnf_QgLDGeMpWQYU",
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );

      console.log("Successfully created embeddings for fileId:", args.fileId);
      return { success: true, chunksProcessed: args.splitText.length };
    } catch (error) {
      console.error("Ingest error:", error);
      throw new Error(`Failed to create embeddings: ${error.message}`);
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Search action called with:", { query: args.query, fileId: args.fileId });

      const apiKey = "AIzaSyCiaa5W0328n9DecOiAnf_QgLDGeMpWQYU";
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: apiKey,
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );

      // First, let's search for any documents with this fileId
      console.log("Searching for documents with fileId:", args.fileId);

      // Search with a broader scope first
      const allResults = await vectorStore.similaritySearch(args.query, 5);
      console.log("All search results:", allResults.length);

      // Filter by fileId
      const resultOne = allResults.filter((q) => q.metadata.fileId === args.fileId);
      console.log("Filtered results for fileId:", resultOne.length);

      if (resultOne.length === 0) {
        // Check if there are any documents for this fileId at all
        const allDocuments = await ctx.db.query("documents").collect();
        const documentsForFile = allDocuments.filter(doc => doc.metadata?.fileId === args.fileId);

        console.log("Total documents in database:", allDocuments.length);
        console.log("Documents for this fileId:", documentsForFile.length);

        if (documentsForFile.length === 0) {
          throw new Error(`No documents found for fileId: ${args.fileId}. The PDF may not have been processed yet or there was an error during embedding.`);
        } else {
          throw new Error(`Found ${documentsForFile.length} documents for fileId ${args.fileId}, but similarity search returned no results. This might be a vector search issue.`);
        }
      }

      console.log("Returning search results:", resultOne.length);
      return JSON.stringify(resultOne);
    } catch (error) {
      console.error("Search error:", error);
      throw new Error(`Search failed: ${error.message}`);
    }
  },
});
