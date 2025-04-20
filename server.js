// import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { getEducationalAnswer } from './lib/server/educationalChat.js'; //
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer();
const wss = new WebSocketServer({ server, path: '/api/ask' });

wss.on('connection', (ws) => {
  console.log('Client connected');
  const chatId = uuidv4();

  ws.on('message', async (message) => {
    const question = message.toString();
    console.log('Received:', question);

    try {
      const reply = await getEducationalAnswer(chatId, question);
      ws.send(JSON.stringify({ content: reply }));
    } catch (error) {
      console.error('Error responding to client:', error.message);
      ws.send(JSON.stringify({ content: 'Sorry, something went wrong while fetching the answer.' }));
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected (Chat ID: ${chatId})`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}/api/ask`);
});
