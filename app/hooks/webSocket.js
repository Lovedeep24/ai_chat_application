// hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

export const webSocket = (url) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    // Cleanup on unmount
    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage, messages };
};
