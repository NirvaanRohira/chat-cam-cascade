
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: {
    type: 'user' | 'bot';
    content: string;
    image?: string;
    timestamp: Date;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex max-w-[85%] md:max-w-[70%]',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className={cn('flex-shrink-0 flex items-start mt-1', isUser ? 'ml-3' : 'mr-3')}>
          <Avatar className={cn('h-8 w-8', isUser ? 'bg-primary' : 'bg-accent')}>
            {isUser ? (
              <User className="h-4 w-4 text-primary-foreground" />
            ) : (
              <Bot className="h-4 w-4 text-accent-foreground" />
            )}
          </Avatar>
        </div>
        
        <div
          className={cn(
            'flex flex-col space-y-2 p-4 rounded-lg',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-secondary text-secondary-foreground rounded-tl-none'
          )}
        >
          {message.image && (
            <div className="mb-2">
              <img 
                src={message.image} 
                alt="Uploaded or captured image" 
                className="rounded-md max-h-64 max-w-full object-contain"
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
            'text-size-4 opacity-70',
            isUser ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'
          )}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
