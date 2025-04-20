'use client';
import React, { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

const Chatpage: React.FC = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:3000/api/ask');

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const newMsg: Message = {
        role: 'ai',
        content: data.content,
      };
      setMessages((prev) => [...prev, newMsg]);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
  
    // Check if the WebSocket is open
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      // Create user message object
      const userMsg: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, userMsg]);
  
      socketRef.current.send(
        JSON.stringify({
          type: 'chat',
          content: input,
        })
      );
  
      setInput('');
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="border p-4 rounded mb-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === 'user' ? 'text-blue-600' : 'text-green-600'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border flex-1 p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatpage;
