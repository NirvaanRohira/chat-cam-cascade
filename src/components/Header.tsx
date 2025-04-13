
import React from 'react';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full px-4 py-3 border-b border-border glass-morphism sticky top-0 z-10",
      className
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <span className="text-size-2 text-gradient">RealChat</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="animate-pulse-light h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-size-4 text-muted-foreground">Live Assistant</span>
        </div>
      </div>
    </header>
  );
};
