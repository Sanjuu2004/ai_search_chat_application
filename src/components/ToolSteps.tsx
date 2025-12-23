import React from 'react';
import { CheckCircle, Clock, Search, FileText, Sparkles } from 'lucide-react';

interface ToolStep {
  step: string;
  status: 'running' | 'completed';
  timestamp: number;
}

interface ToolStepsProps {
  steps: ToolStep[];
}

export function ToolSteps({ steps }: ToolStepsProps) {
  const getIcon = (step: string, status: string) => {
    const iconClass = `w-4 h-4 ${status === 'completed' ? 'text-green-500' : 'text-blue-500'}`;
    
    if (step.toLowerCase().includes('search')) {
      return <Search className={iconClass} />;
    }
    if (step.toLowerCase().includes('generat')) {
      return <Sparkles className={iconClass} />;
    }
    if (step.toLowerCase().includes('analyz')) {
      return <FileText className={iconClass} />;
    }
    
    return status === 'completed' ? (
      <CheckCircle className={iconClass} />
    ) : (
      <Clock className={`${iconClass} animate-spin`} />
    );
  };

  return (
    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Processing</h4>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          {getIcon(step.step, step.status)}
          <span className={step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}>
            {step.step}
          </span>
          {step.status === 'running' && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
