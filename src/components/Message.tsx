import React from 'react';
import { Doc } from '../../convex/_generated/dataModel';
import { ToolSteps } from './ToolSteps';
import { CitationBadge } from './CitationBadge';
import { SourceCard } from './SourceCard';
import { StreamingText } from './StreamingText';

interface MessageProps {
  message: Doc<"messages">;
  onCitationClick: (citation: { url: string; pageNumber?: number }) => void;
}

export function Message({ message, onCitationClick }: MessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl px-4 py-3">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-4">
        {/* Tool Steps */}
        {message.toolSteps && message.toolSteps.length > 0 && (
          <ToolSteps steps={message.toolSteps} />
        )}

        {/* Assistant Response */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content ? (
              <FormattedContent
                content={message.content}
                citations={message.citations}
                onCitationClick={onCitationClick}
              />
            ) : (
              <StreamingText messageId={message._id} />
            )}
          </div>
        </div>

        {/* Source Cards */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Sources</h4>
            <div className="grid gap-2">
              {message.citations.map((citation) => (
                <SourceCard
                  key={citation.id}
                  citation={citation}
                  onClick={() => onCitationClick({
                    url: citation.url,
                    pageNumber: citation.pageNumber,
                  })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FormattedContentProps {
  content: string;
  citations?: Array<{
    id: string;
    title: string;
    url: string;
    snippet: string;
    pageNumber?: number;
  }>;
  onCitationClick: (citation: { url: string; pageNumber?: number }) => void;
}

function FormattedContent({ content, citations, onCitationClick }: FormattedContentProps) {
  // Replace citation markers [1], [2], etc. with clickable badges
  const parts = content.split(/(\[\d+\])/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        const citationMatch = part.match(/\[(\d+)\]/);
        if (citationMatch) {
          const citationId = citationMatch[1];
          const citation = citations?.find(c => c.id === citationId);
          
          if (citation) {
            return (
              <CitationBadge
                key={index}
                number={citationId}
                onClick={() => onCitationClick({
                  url: citation.url,
                  pageNumber: citation.pageNumber,
                })}
              />
            );
          }
        }
        
        return part ? (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        ) : null;
      })}
    </div>
  );
}
