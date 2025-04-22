'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { Toaster, toast } from 'sonner';
import { CornerDownLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {
  addMessage,
  clearMessages,
  setLoading,
  setError,
} from '../Slices/chatSlice';

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
  const dispatch = useDispatch();
  const { messages, isLoading, error } = useSelector((state: RootState) => state.chat);
  const socketRef = useRef<WebSocket | null>(null);
  const [input, setInput] = useState('');
  const messageIdRef = useRef(1);

  // Generate a chatId (session scoped)

  useEffect(() => {
    socketRef.current = new WebSocket('wss://web-socket-server-hyrt.onrender.com/');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.answer) {
        dispatch(
          addMessage({
            id: messageIdRef.current++,
            content: data.answer,
            sender: 'ai',
          })
        );
      }

      if (data.error) {
        dispatch(setError(data.error));
        toast.error(data.error);
      }

      dispatch(setLoading(false));
    };

    socketRef.current.onerror = (e) => {
      console.error('WebSocket error:', e);
      toast.error('Something went wrong with WebSocket.');
      dispatch(setLoading(false));
      dispatch(setError('WebSocket connection error.'));
    };

    return () => {
      socketRef.current?.close();
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const generateChatId = () => {
      return Math.random().toString(36).substring(2, 15); // Random alphanumeric string
    };
    const chatId = generateChatId();  // You can generate this dynamically or retrieve from user context

    const userMsg: Message = {
      id: messageIdRef.current++,
      content: input,
      sender: 'user',
    };

    dispatch(addMessage(userMsg));
    setInput('');
    dispatch(setLoading(true));
    dispatch(setError(null));

    socketRef.current?.send(
      JSON.stringify({
        chatId,   
        question: userMsg.content,
      })
    );
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
  };

  return (
    <div className='flex flex-col items-center min-h-screen p-2 gap-5'>
      <Toaster position='top-center' />
      <div className="flex items-center justify-between p-4 bg-background rounded-lg w-full">
        <h1 className="text-xl font-bold">BrainWaveAI</h1>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <img
            className="rounded-full"
            src="https://originui.com/avatar.jpg"
            alt="Profile"
            width={40}
            height={40}
          />
        </Button>
      </div>

      <div className="md:w-[70%] w-[85%] bg-background rounded-lg flex flex-col">
      <div className="flex-1 overflow-y-auto ">
          <ChatMessageList>
            {messages.length === 0 && !isLoading && !error && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
                  fallback="AI"
                />
                <ChatBubbleMessage>
                  What can I help you with?
                </ChatBubbleMessage>
              </ChatBubble>
            )}

            {messages.map((message: Message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === 'user' ? 'sent' : 'received'}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={
                    message.sender === 'user'
                      ? 'https://originui.com/avatar.jpg'
                      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64'
                  }
                  fallback={message.sender === 'user' ? 'US' : 'AI'}
                />
                <ChatBubbleMessage>
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64"
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

      <div className="p-4 fixed bottom-0 bg-white left-0 w-full items-center flex justify-center ">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg w-[85%] md:w-[50%] bg-background overflow-hidden border-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start your discussion..."
            className="text-lg resize-none bg-background p-3 shadow-none focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-3 pt-0 mt-3 gap-2 sm:justify-between">
            <Button
              className="bg-red-400 text-white gap-1 w-full sm:w-auto hover:bg-red-500"
              size="sm"
              variant="outline"
              onClick={handleClearChat}
            >
              <Trash2 className="size-4" />
              Clear Chat
            </Button>
            <Button
              type="submit"
              size="sm"
              className="w-full sm:w-auto ml-0 sm:ml-auto gap-1.5"
              disabled={isLoading}
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
