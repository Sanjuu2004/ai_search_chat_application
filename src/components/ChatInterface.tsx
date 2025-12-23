import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { PdfViewer } from './PdfViewer';
import { ThemeToggle } from './ThemeToggle';
import { SignOutButton } from '../SignOutButton';

export function ChatInterface() {
  const [currentConversationId, setCurrentConversationId] = useState<Id<"conversations"> | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<{
    url: string;
    pageNumber?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const conversations = useQuery(api.chat.getConversations);
  const messages = useQuery(
    api.chat.getMessages,
    currentConversationId ? { conversationId: currentConversationId } : "skip"
  );

  const createConversation = useMutation(api.chat.createConversation);
  const sendMessage = useMutation(api.chat.sendMessage);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0]._id);
    }
  }, [conversations, currentConversationId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      let conversationId = currentConversationId;

      if (!conversationId) {
        // Create new conversation
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        conversationId = await createConversation({ title });
        setCurrentConversationId(conversationId);
      }

      await sendMessage({
        conversationId,
        content,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (citation: { url: string; pageNumber?: number }) => {
    setSelectedCitation(citation);
  };

  const closePdfViewer = () => {
    setSelectedCitation(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className={`flex flex-col transition-all duration-300 ${
        selectedCitation ? 'w-1/2' : 'w-full'
      }`}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">AI Search Chat</h1>
            {conversations && conversations.length > 1 && (
              <select
                value={currentConversationId || ''}
                onChange={(e) => setCurrentConversationId(e.target.value as Id<"conversations">)}
                className="px-3 py-1 rounded-md border border-border bg-background text-foreground text-sm"
              >
                {conversations.map((conv) => (
                  <option key={conv._id} value={conv._id}>
                    {conv.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages && messages.length > 0 ? (
            <MessageList
              messages={messages}
              onCitationClick={handleCitationClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome to AI Search Chat
                </h2>
                <p className="text-muted-foreground mb-8">
                  Ask me anything and I'll search through documents to provide you with accurate, cited answers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  {[
                    "What are the latest trends in artificial intelligence?",
                    "How does machine learning impact business operations?",
                    "What are the key principles of data science?",
                    "Explain the benefits of cloud computing"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-4 text-left rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask me anything..."
          />
        </div>
      </div>

      {/* PDF Viewer */}
      {selectedCitation && (
        <div className="w-1/2 border-l border-border animate-in slide-in-from-right duration-300">
          <PdfViewer
            url={selectedCitation.url}
            initialPage={selectedCitation.pageNumber}
            onClose={closePdfViewer}
          />
        </div>
      )}
    </div>
  );
}
