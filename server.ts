import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Load .env file
dotenv.config();

// Create an Express application
const app = express();

app.use(cors());

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Create http server from express app
const server = http.createServer(app);

// Create socket.io server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        allowedHeaders: ["chatRoomId", "userId"],
        credentials: true
    },
    maxHttpBufferSize: 5 * 1e6,
    pingTimeout: 60000
});

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
