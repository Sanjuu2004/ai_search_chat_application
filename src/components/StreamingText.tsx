import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface StreamingTextProps {
  messageId: Id<"messages">;
}

export function StreamingText({ messageId }: StreamingTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Find the streaming session for this message
  const sessions = useQuery(api.chat.getConversations); // We'll need to modify this to get sessions
  
  // Simulate streaming effect
  useEffect(() => {
    const targetText = "I'm analyzing your question and searching through the available documents...";
    
    if (currentIndex < targetText.length) {
      const timer = setTimeout(() => {
        setDisplayText(targetText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="flex items-center space-x-2">
      <span className="whitespace-pre-wrap">{displayText}</span>
      {currentIndex < 50 && (
        <div className="w-2 h-4 bg-primary animate-pulse rounded-sm" />
      )}
    </div>
  );
}
