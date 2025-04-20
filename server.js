const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Send a response back to the client
    ws.send(JSON.stringify({ content: 'Hello from server!' }));
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(3000, () => {
  console.log('WebSocket server listening on ws://localhost:3000');
});
