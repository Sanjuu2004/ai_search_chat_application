import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  initialPage?: number;
  onClose: () => void;
}

export function PdfViewer({ url, initialPage = 1, onClose }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages] = useState(25); // Mock total pages
  const [zoom, setZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-foreground">Document Viewer</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={handlePageInput}
              min={1}
              max={totalPages}
              className="w-16 px-2 py-1 text-center border border-border rounded bg-background text-foreground"
            />
            <span>of {totalPages}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in document..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground"
            />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors">
              Search
            </button>
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4">
        <div 
          className="mx-auto bg-white shadow-lg"
          style={{ 
            width: `${(8.5 * zoom) / 100 * 96}px`, // 8.5 inches at current zoom
            minHeight: `${(11 * zoom) / 100 * 96}px` // 11 inches at current zoom
          }}
        >
          {/* Mock PDF Content */}
          <div className="p-8 text-gray-800 leading-relaxed">
            <h1 className="text-2xl font-bold mb-6">Research Paper on AI Applications</h1>
            <p className="mb-4">
              This document contains comprehensive research on artificial intelligence applications 
              in modern business environments. The study examines various implementations and 
              their impact on operational efficiency.
            </p>
            
            {currentPage === initialPage && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
                <p className="text-yellow-800">
                  <strong>Highlighted section:</strong> Artificial intelligence applications have shown 
                  remarkable progress in recent years, particularly in areas such as natural language 
                  processing, computer vision, and predictive analytics.
                </p>
              </div>
            )}
            
            <p className="mb-4">
              The research methodology involved analyzing data from over 500 companies across 
              different industries to understand the adoption patterns and success metrics of 
              AI implementations.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Key Findings</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>AI adoption has increased by 300% over the past five years</li>
              <li>Companies report an average ROI of 15% within the first year</li>
              <li>Natural language processing shows the highest success rate</li>
              <li>Integration challenges remain the primary barrier to adoption</li>
            </ul>
            
            <p className="mb-4">
              These findings suggest that while AI technology continues to mature, organizations 
              must carefully consider their implementation strategies to maximize benefits and 
              minimize risks.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center space-x-4 p-4 border-t border-border bg-card">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
