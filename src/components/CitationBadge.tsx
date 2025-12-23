import React from 'react';

interface CitationBadgeProps {
  number: string;
  onClick: () => void;
}

export function CitationBadge({ number, onClick }: CitationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/80 transition-colors mx-1 align-baseline"
      title={`View source ${number}`}
    >
      {number}
    </button>
  );
}
