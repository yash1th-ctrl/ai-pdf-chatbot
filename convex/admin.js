import { mutation, query } from "./_generated/server";

// Clear all data for fresh start
export const clearAllData = mutation({
  handler: async (ctx) => {
    try {
      // Clear all files
      const files = await ctx.db.query("pdfFiles").collect();
      for (const file of files) {
        await ctx.db.delete(file._id);
      }

      // Clear all notes
      const notes = await ctx.db.query("notes").collect();
      for (const note of notes) {
        await ctx.db.delete(note._id);
      }

      // Clear all users
      const users = await ctx.db.query("users").collect();
      for (const user of users) {
        await ctx.db.delete(user._id);
      }

      // Clear all documents (vector embeddings)
      const documents = await ctx.db.query("documents").collect();
      for (const doc of documents) {
        await ctx.db.delete(doc._id);
      }

      return { success: true, message: "All data cleared successfully" };
    } catch (error) {
      console.error("Error clearing data:", error);
      return { success: false, error: error.message };
    }
  },
});

// Get database statistics
export const getDatabaseStats = query({
  handler: async (ctx) => {
    const files = await ctx.db.query("pdfFiles").collect();
    const notes = await ctx.db.query("notes").collect();
    const users = await ctx.db.query("users").collect();
    const documents = await ctx.db.query("documents").collect();

    return {
      files: files.length,
      notes: notes.length,
      users: users.length,
      documents: documents.length,
      totalRecords: files.length + notes.length + users.length + documents.length
    };
  },
});
