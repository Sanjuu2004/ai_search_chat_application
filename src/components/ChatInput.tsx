import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Upload, X } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { DocumentList } from './DocumentList';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled, placeholder = "Type your message..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleUploadComplete = () => {
    // Optionally close the upload panel after successful upload
    // setShowFileUpload(false);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Panel */}
      {showFileUpload && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Upload Documents</h3>
            <button
              onClick={() => setShowFileUpload(false)}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <FileUpload onUploadComplete={handleUploadComplete} />
          <DocumentList />
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-2 p-3 bg-background border border-border rounded-2xl focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
          <button
            type="button"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={`flex-shrink-0 p-2 transition-colors rounded-lg hover:bg-accent ${
              showFileUpload ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Upload documents"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent border-none outline-none placeholder-muted-foreground text-foreground max-h-32"
          />
          
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
