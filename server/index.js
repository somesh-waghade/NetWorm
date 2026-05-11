const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const registerHandlers = require('./src/socket/socketHandlers');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

registerHandlers(io);

app.get('/health', (_, res) => res.json({ status: 'ok', time: Date.now() }));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[NetWorm Server] Running on http://localhost:${PORT}`);
});
