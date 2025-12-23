import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

interface Citation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  pageNumber?: number;
}

interface SourceCardProps {
  citation: Citation;
  onClick: () => void;
}

export function SourceCard({ citation, onClick }: SourceCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs font-medium">
            {citation.id}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground truncate">
              {citation.title}
            </h4>
            {citation.pageNumber && (
              <span className="text-xs text-muted-foreground">
                Page {citation.pageNumber}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {citation.snippet}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </div>
    </button>
  );
}
