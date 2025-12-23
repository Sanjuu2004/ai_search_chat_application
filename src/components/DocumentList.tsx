import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { FileText, Calendar, HardDrive } from 'lucide-react';

export function DocumentList() {
  const documents = useQuery(api.files.getDocuments);

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No documents uploaded yet</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Uploaded Documents</h3>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {doc.title}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <HardDrive className="w-3 h-3" />
                  <span>{formatFileSize(doc.metadata.fileSize)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(doc.metadata.uploadedAt)}</span>
                </div>
                <span>{doc.metadata.pageCount} pages</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
