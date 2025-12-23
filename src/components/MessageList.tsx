import React from 'react';
import { Doc } from '../../convex/_generated/dataModel';
import { Message } from './Message';

interface MessageListProps {
  messages: Doc<"messages">[];
  onCitationClick: (citation: { url: string; pageNumber?: number }) => void;
}

export function MessageList({ messages, onCitationClick }: MessageListProps) {
  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {messages.map((message) => (
        <Message
          key={message._id}
          message={message}
          onCitationClick={onCitationClick}
        />
      ))}
    </div>
  );
}
