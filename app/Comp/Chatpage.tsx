'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { Paperclip, Mic, CornerDownLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
};

export default function Chatpage() {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdRef = useRef(1);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3001/api/ask');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdRef.current++,
          content: data.content,
          sender: 'ai',
        },
      ]);
      setIsLoading(false);
    };

    socketRef.current.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('Something went wrong with WebSocket.');
      setIsLoading(false);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: messageIdRef.current++,
      content: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    socketRef.current?.send(
      JSON.stringify({
        type: 'chat',
        content: userMsg.content,
      })
    );
  };

  return (
    <div className='flex flex-col items-center min-h-screen  p-2 gap-5'>
        <div className="flex items-center justify-between p-4 bg-background rounded-lg w-[100%]">
          <h1 className="text-xl font-bold">Chat with AI</h1>
          <div className="flex items-center gap-2">
            <Paperclip className="size-4" />
            <Mic className="size-4" />
          </div>
      </div>
        <div className=" w-[70%]  bg-background rounded-lg  flex flex-col">
          <div className="flex-1 overflow-y-auto ">
          <ChatMessageList> 
          {messages.length === 0 && !isLoading && !error && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="AI"
              />
              <ChatBubbleMessage>
                What can I help you with?
              </ChatBubbleMessage>
            </ChatBubble>
          )}

          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === 'user' ? 'sent' : 'received'}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src={
                  message.sender === 'user'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop'
                    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop'
                }
                fallback={message.sender === 'user' ? 'US' : 'AI'}
              />
              <ChatBubbleMessage
                variant={message.sender === 'user' ? 'sent' : 'received'}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}

          {error && (
            <div className="text-red-500 px-4 pb-2 text-sm">{error}</div>
          )}

        </ChatMessageList>
      </div>

    </div>
    <div className="p-4 fixed mb-10 bottom-0 left-0 bg-white w-full items-center flex justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg p-2 w-[70%] bg-background border-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=" Start your discussion..."
            className=" resize-none bg-background p-3 shadow-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center p-3 pt-0 mt-3 justify-between">
            <Button className='bg-red-400 text-white gap-1' size="sm" variant="outline">
              <Trash2 className="size-4" /> 
              Clear Chat
            </Button>
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
         
          </div>
        </form>
      </div>
    </div>
   
  );
}



