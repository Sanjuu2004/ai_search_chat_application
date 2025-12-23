import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    lastMessageAt: v.number(),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    citations: v.optional(v.array(v.object({
      id: v.string(),
      title: v.string(),
      url: v.string(),
      snippet: v.string(),
      pageNumber: v.optional(v.number()),
    }))),
    toolSteps: v.optional(v.array(v.object({
      step: v.string(),
      status: v.union(v.literal("running"), v.literal("completed")),
      timestamp: v.number(),
    }))),
  }).index("by_conversation", ["conversationId"]),

  documents: defineTable({
    title: v.string(),
    url: v.string(),
    content: v.string(),
    metadata: v.object({
      pageCount: v.number(),
      fileSize: v.number(),
      uploadedAt: v.number(),
    }),
    storageId: v.id("_storage"),
  }),

  streamingSessions: defineTable({
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("error")),
    currentContent: v.string(),
    toolSteps: v.array(v.object({
      step: v.string(),
      status: v.union(v.literal("running"), v.literal("completed")),
      timestamp: v.number(),
    })),
  }).index("by_conversation", ["conversationId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
