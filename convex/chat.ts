import { mutation, query, action, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const createConversation = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("conversations", {
      userId,
      title: args.title,
      lastMessageAt: Date.now(),
    });
  },
});

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }

    // Insert user message
    const userMessageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
    });

    // Create assistant message placeholder
    const assistantMessageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "assistant",
      content: "",
    });

    // Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    // Start streaming session
    const sessionId = await ctx.db.insert("streamingSessions", {
      conversationId: args.conversationId,
      messageId: assistantMessageId,
      status: "active",
      currentContent: "",
      toolSteps: [],
    });

    // Schedule AI response generation
    await ctx.scheduler.runAfter(0, internal.chat.generateResponse, {
      sessionId,
      userMessage: args.content,
    });

    return {
      userMessageId,
      assistantMessageId,
      sessionId,
    };
  },
});

export const getStreamingSession = query({
  args: {
    sessionId: v.id("streamingSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const generateResponse = internalAction({
  args: {
    sessionId: v.id("streamingSessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.runQuery(internal.chat.getSession, {
      sessionId: args.sessionId,
    });

    if (!session) {
      throw new Error("Session not found");
    }

    try {
      // Simulate AI processing with tool steps
      const toolSteps = [
        { step: "Analyzing query", status: "running" as const, timestamp: Date.now() },
        { step: "Searching documents", status: "running" as const, timestamp: Date.now() + 500 },
        { step: "Generating response", status: "running" as const, timestamp: Date.now() + 1000 },
      ];

      // Update with first tool step
      await ctx.runMutation(internal.chat.updateSession, {
        sessionId: args.sessionId,
        toolSteps: [{ ...toolSteps[0], status: "completed" }],
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update with second tool step
      await ctx.runMutation(internal.chat.updateSession, {
        sessionId: args.sessionId,
        toolSteps: [
          { ...toolSteps[0], status: "completed" },
          { ...toolSteps[1], status: "completed" },
        ],
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate response content with citations
      const responseContent = `Based on the available documents, I can provide you with a comprehensive answer about ${args.userMessage}.

This information comes from multiple sources [1][2] that provide detailed insights into the topic. The research shows that [3] there are several key factors to consider when examining this subject.

Furthermore, recent studies indicate [1] that the trends are evolving rapidly, and it's important to stay updated with the latest developments [2].`;

      const citations = [
        {
          id: "1",
          title: "Research Paper on AI Applications",
          url: "/documents/research-paper.pdf",
          snippet: "Artificial intelligence applications have shown remarkable progress in recent years...",
          pageNumber: 15,
        },
        {
          id: "2",
          title: "Technology Trends Report 2024",
          url: "/documents/tech-trends.pdf",
          snippet: "The latest technology trends indicate a shift towards more intelligent systems...",
          pageNumber: 8,
        },
        {
          id: "3",
          title: "Industry Analysis Document",
          url: "/documents/industry-analysis.pdf",
          snippet: "Key factors influencing the industry include technological advancement and market demand...",
          pageNumber: 23,
        },
      ];

      // Complete the response
      await ctx.runMutation(internal.chat.completeResponse, {
        sessionId: args.sessionId,
        content: responseContent,
        citations,
        toolSteps: toolSteps.map(step => ({ ...step, status: "completed" as const })),
      });

    } catch (error) {
      await ctx.runMutation(internal.chat.updateSession, {
        sessionId: args.sessionId,
        status: "error",
      });
      throw error;
    }
  },
});

export const getSession = internalQuery({
  args: {
    sessionId: v.id("streamingSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const updateSession = internalMutation({
  args: {
    sessionId: v.id("streamingSessions"),
    currentContent: v.optional(v.string()),
    toolSteps: v.optional(v.array(v.object({
      step: v.string(),
      status: v.union(v.literal("running"), v.literal("completed")),
      timestamp: v.number(),
    }))),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"), v.literal("error"))),
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    if (args.currentContent !== undefined) updates.currentContent = args.currentContent;
    if (args.toolSteps !== undefined) updates.toolSteps = args.toolSteps;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.sessionId, updates);
  },
});

export const completeResponse = internalMutation({
  args: {
    sessionId: v.id("streamingSessions"),
    content: v.string(),
    citations: v.array(v.object({
      id: v.string(),
      title: v.string(),
      url: v.string(),
      snippet: v.string(),
      pageNumber: v.optional(v.number()),
    })),
    toolSteps: v.array(v.object({
      step: v.string(),
      status: v.union(v.literal("running"), v.literal("completed")),
      timestamp: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Update the message with final content
    await ctx.db.patch(session.messageId, {
      content: args.content,
      citations: args.citations,
      toolSteps: args.toolSteps,
    });

    // Mark session as completed
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      currentContent: args.content,
      toolSteps: args.toolSteps,
    });
  },
});
