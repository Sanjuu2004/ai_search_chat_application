import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveDocument = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get file metadata from storage
    const fileMetadata = await ctx.db.system.get(args.storageId);
    if (!fileMetadata) {
      throw new Error("File not found");
    }

    // For now, we'll use placeholder content since we can't actually parse PDFs
    const placeholderContent = `This is a placeholder for the content of ${args.title}. 
    In a real implementation, you would use a PDF parsing library to extract the actual text content.
    
    The file has been successfully uploaded and stored with ID: ${args.storageId}
    File size: ${fileMetadata.size} bytes
    Content type: ${fileMetadata.contentType || 'application/pdf'}`;

    return await ctx.db.insert("documents", {
      title: args.title,
      url: args.url,
      content: placeholderContent,
      metadata: {
        pageCount: 25, // Placeholder
        fileSize: fileMetadata.size,
        uploadedAt: Date.now(),
      },
      storageId: args.storageId,
    });
  },
});

export const getDocuments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db.query("documents").collect();
  },
});

export const getDocumentUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
