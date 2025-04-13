
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: {
    type: 'user' | 'bot';
    content: string;
    image?: string;
    timestamp: Date;
  };
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {
  const isUser = message.type === 'user';

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-fade-in transition-all duration-300 ease-in-out',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'flex max-w-[85%] md:max-w-[70%] items-start',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className={cn('flex-shrink-0 flex items-start mt-1', isUser ? 'ml-3' : 'mr-3')}>
          <Avatar className={cn('h-10 w-10 border-2', isUser ? 'border-primary' : 'border-accent')}>
            {isUser ? (
              <User className="h-5 w-5 text-primary" />
            ) : (
              <Bot className="h-5 w-5 text-accent" />
            )}
          </Avatar>
        </div>
        
        <div
          className={cn(
            'flex flex-col space-y-2 p-4 rounded-2xl shadow-lg transition-all duration-300 ease-in-out',
            isUser
              ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-none'
              : 'bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-tl-none',
            'hover:scale-[1.02] transform-gpu'
          )}
        >
          {message.image && (
            <div className="mb-2 rounded-lg overflow-hidden shadow-md">
              <img 
                src={message.image} 
                alt="Uploaded or captured image" 
                className="max-h-64 max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          {isUser ? (
            <p className="text-size-3">{message.content}</p>
          ) : (
            <div className="markdown">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          
          <div className={cn(
            'text-size-4 opacity-70 text-right',
            isUser ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'
          )}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
