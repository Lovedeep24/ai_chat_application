'use client';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { Paperclip, Mic, CornerDownLeft } from 'lucide-react';
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
    <div className="h-[400px] border bg-background rounded-lg flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList>
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

      <div className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-between">
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





// "use client";
// import { useEffect, useRef, useState, FormEvent } from "react";
// import { CornerDownLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   ChatBubble,
//   ChatBubbleAvatar,
//   ChatBubbleMessage,
// } from "../../components/ui/chat-bubble";
// import { ChatMessageList } from "@/components/ui/chat-message-list";
// import { ChatInput } from "../../components/ui/chat-input";

// type Message = {
//   content: string;
//   role: "user" | "ai";
// };

// export function ChatMessageListDemo() {
//   const socketRef = useRef<WebSocket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     socketRef.current = new WebSocket("ws://localhost:3001/api/ask");

//     socketRef.current.onopen = () => {
//       console.log("WebSocket connection established");
//     };

//     socketRef.current.onmessage = (event: MessageEvent) => {
//       const data = JSON.parse(event.data);
//       const newMsg: Message = { role: "ai", content: data.content };
//       setMessages((prev) => [...prev, newMsg]);
//       setIsLoading(false);
//     };

//     socketRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setError("An error occurred while connecting to the server.");
//       setIsLoading(false);
//     };

//     socketRef.current.onclose = () => {
//       console.log("WebSocket connection closed");
//     };

//     return () => {
//       socketRef.current?.close();
//     };
//   }, []);

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMsg: Message = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setIsLoading(true);
//     setError(null);

//     socketRef.current?.send(
//       JSON.stringify({
//         type: "chat",
//         content: input,
//       })
//     );

//     setInput("");
//   };

//   return (
//     <div className="h-[500px] border bg-background rounded-lg flex flex-col">
//       <div className="flex-1 overflow-hidden">
//         <ChatMessageList>
//           {messages.map((message, idx) => (
//             <ChatBubble
//               key={idx}
//               variant={message.role === "user" ? "sent" : "received"}
//             >
//               <ChatBubbleAvatar
//                 className="h-8 w-8 shrink-0"
//                 src={
//                   message.role === "user"
//                     ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
//                     : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
//                 }
//                 fallback={message.role === "user" ? "US" : "AI"}
//               />
//               <ChatBubbleMessage
//                 variant={message.role === "user" ? "sent" : "received"}
//               >
//                 {message.content}
//               </ChatBubbleMessage>
//             </ChatBubble>
//           ))}

//           {isLoading && (
//             <ChatBubble variant="received">
//               <ChatBubbleAvatar
//                 className="h-8 w-8 shrink-0"
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
//                 fallback="AI"
//               />
//               <ChatBubbleMessage isLoading />
//             </ChatBubble>
//           )}
//         </ChatMessageList>
//       </div>

//       <div className="p-4 border-t">
//         <form
//           onSubmit={handleSubmit}
//           className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
//         >
//           <ChatInput
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask something..."
//             className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
//           />
//           <div className="flex items-center p-3 pt-0 justify-between">
//             <Button type="submit" size="sm" className="ml-auto gap-1.5">
//               Send Message
//               <CornerDownLeft className="size-3.5" />
//             </Button>
//           </div>
//         </form>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// }
