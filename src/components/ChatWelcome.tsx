
import React from 'react';
import { Building, Camera, MessageSquareText, Info } from 'lucide-react';

export const ChatWelcome: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-8 text-center animate-fade-in">
      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
        <Building className="h-8 w-8 text-white" />
      </div>
      
      <h1 className="text-size-1 mb-3 text-gradient">
        Real Estate Assistant
      </h1>
      
      <p className="text-size-3 text-muted-foreground max-w-md mb-8">
        I can help you find properties, answer real estate questions, or analyze property images.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
          <MessageSquareText className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-size-3 font-semibold mb-2">Ask Questions</h3>
          <p className="text-size-4 text-muted-foreground">
            Ask about property details, market trends, or buying advice
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
          <Camera className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-size-3 font-semibold mb-2">Upload Photos</h3>
          <p className="text-size-4 text-muted-foreground">
            Share property images for analysis and recommendations
          </p>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border">
          <Info className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-size-3 font-semibold mb-2">Get Insights</h3>
          <p className="text-size-4 text-muted-foreground">
            Receive detailed information and professional advice
          </p>
        </div>
      </div>
    </div>
  );
};
