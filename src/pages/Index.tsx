
import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatMessageInput } from '@/components/ChatMessageInput';
import { ChatWelcome } from '@/components/ChatWelcome';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  image?: string;
  timestamp: Date;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Configuration for n8n webhook
  const USE_PRODUCTION = false; // Set to true for production webhook
  const WEBHOOK_URL = USE_PRODUCTION 
    ? 'https://nvrtest4.app.n8n.cloud/webhook/7386adac-d1dc-4e32-81dc-f0487aa8d9ca'
    : 'https://nvrtest4.app.n8n.cloud/webhook-test/7386adac-d1dc-4e32-81dc-f0487aa8d9ca';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, image?: File) => {
    if (!text.trim() && !image) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };
    
    // If there's an image, add it to the message
    if (image) {
      newUserMessage.image = URL.createObjectURL(image);
    }
    
    // Add user message to chat
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Create FormData object for the webhook
      const formData = new FormData();
      formData.append('message', text);
      if (image) {
        formData.append('image', image);
      }

      // Send to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Process response
      const responseData = await response.json();
      
      // Add bot response to chat
      const botResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: responseData.message || 'Sorry, I couldn\'t process that request.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      
      // Show error toast
      toast({
        title: "Communication error",
        description: "Unable to connect to the assistant. Please try again.",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 animate-fade-in">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto bg-pattern">
        <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
          {messages.length === 0 ? (
            <ChatWelcome />
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  className="animate-slide-in-right"
                />
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-4 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 backdrop-blur-sm">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-size-4 text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className={cn(
          "animate-slide-in-bottom border-t border-border/20",
          messages.length === 0 ? "" : "glass-morphism"
        )}>
          <ChatMessageInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
