import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { PORT } from './environ';

const APPID = process.env.APPID;

// Express application setup
const app: Application = express();
const port: number = PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

// Create Redis clients
const subscriber = new Redis({ host: 'rds', port: 6379 });
const publisher = new Redis({ host: 'rds', port: 6379 });

// Subscribe to the "livechat" channel
subscriber.subscribe('livechat', (err, count) => {
    if (err) {
        console.error('Failed to subscribe to livechat channel:', err);
    } else {
        console.log(`Subscribed to livechat channel. Count: ${count}`);
    }
});

// Create an HTTP server and integrate with Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Handle Redis messages and broadcast them to connected clients
subscriber.on('message', (channel, message) => {
    console.log(`Server ${APPID} received message on channel ${channel}: ${message}`);
    io.emit('livechat', `${APPID}: ${message}`); // Emit the message to all clients
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log(`New client connected [ID: ${socket.id}]`);

    // Send a welcome message after the client connects
    socket.emit('welcome', `Connected successfully to server ${APPID}`);

    // Handle messages received from the client
    socket.on('livechat', (message) => {
        console.log(`${APPID} received message: ${message}`);
        publisher.publish('livechat', message); // Publish the message to Redis
    });

    // Handle client disconnections
    socket.on('disconnect', () => {
        console.log(`Client disconnected [ID: ${socket.id}]`);
    });
});

// Start the server
httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
