
import React, { useState, useRef } from 'react';
import { Send, Camera, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageInputProps {
  onSendMessage: (text: string, image?: File) => Promise<void>;
  isLoading: boolean;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({ 
  onSendMessage, 
  isLoading 
}) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraToggle = async () => {
    setIsCameraOpen(!isCameraOpen);
    
    if (!isCameraOpen) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        toast({
          title: "Camera access denied",
          description: "Please allow camera access to use this feature.",
          variant: "destructive",
        });
        setIsCameraOpen(false);
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(blob));
            
            // Close camera after capture
            const stream = video.srcObject as MediaStream;
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            setIsCameraOpen(false);
          }
        }, "image/jpeg");
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedImage) || isLoading) return;
    
    try {
      console.log('Sending message from input component:', message);
      console.log('With image:', !!selectedImage);
      
      // This calls the parent component's handleSendMessage function
      await onSendMessage(message, selectedImage || undefined);
      
      setMessage('');
      clearImage();
    } catch (error) {
      console.error('Error in ChatMessageInput:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full px-4 py-4 bg-card border-t border-border">
      {/* Camera View */}
      {isCameraOpen && (
        <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full max-h-[300px] object-contain"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-4 inset-x-0 flex justify-center">
            <Button 
              onClick={handleCapture} 
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              Take Photo
            </Button>
          </div>
        </div>
      )}
      
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-full mb-4">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-[200px] max-w-full mx-auto object-contain"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
              onClick={clearImage}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleCameraToggle}
            className={cn(
              "rounded-full",
              isCameraOpen && "bg-primary text-primary-foreground"
            )}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleFileUploadClick}
            className="rounded-full"
          >
            <Image className="h-4 w-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </Button>
          
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || (!message.trim() && !selectedImage)}
            className={cn(
              "rounded-full",
              isLoading && "opacity-70"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
