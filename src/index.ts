import express, { Application, NextFunction, Request, Response, Router } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { PORT, DEV, APPID, MONGO_URI } from './environ';
import { MyError } from './utils/error';
import { createResponse } from './types/response.type';
import authRouter from './routes/auth.route';
import mongoose from 'mongoose';
import userRouter from './routes/user.route';

const app: Application = express();
const port: number = PORT;

let subscriber: Redis | null = null;
let publisher: Redis | null = null;

if (!DEV) {
    subscriber = new Redis({ host: 'rds', port: 6379 });
    publisher = new Redis({ host: 'rds', port: 6379 });

    subscriber.subscribe('livechat', (err, count) => {
        if (err) {
            console.error('Failed to subscribe to livechat channel:', err);
        } else {
            console.log(`Subscribed to livechat channel. Count: ${count}`);
        }
    });

    subscriber.on('message', (channel, message) => {
        console.log(`Server ${APPID} received message on channel ${channel}: ${message}`);
        const [room, msg] = message.split(':', 2); // Message format: "room:message"
        io.to(room).emit('livechat', `${APPID}: ${msg}`); // Broadcast to the room
    });
}

//DB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to ${MONGO_URI}`);
    })
    .catch((err: Error) => {
        console.error('Error occurred while connecting to DB:', err);
        process.exit(1);
    });
//GLOBAL MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//ROUTES
const router: Router = express.Router();
router.get('/', (req: Request, res: Response) => {
    res.send(`${APPID} 🚀`);
});
app.use('/', router);
app.use('/auth', authRouter)
app.use('/user', userRouter)


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});
io.on('connection', (socket) => {
    console.log(`New client connected [ID: ${socket.id}]`);

    const { room } = socket.handshake.query; // Assume query is passed as ?room=<roomName>
    if (room) {
        socket.join(room as string);
        console.log(`Client [ID: ${socket.id}] joined room: ${room}`);

        socket.emit('welcome', `You have joined room: ${room}`);
    } else {
        console.log(`Client [ID: ${socket.id}] did not specify a room.`);
        socket.emit('error', 'Room information is required to join.');
    }

    socket.on('livechat', (message) => {
        if (room) {
            console.log(`Message received in room ${room} from client ${socket.id}: ${message}`);

            if (!DEV && publisher) {
                publisher.publish('livechat', `${room}:${message}`);
            } else {
                io.to(room as string).emit('livechat', `${APPID}: ${message}`);
            }
        } else {
            console.error(`Client ${socket.id} tried to send a message without joining a room.`);
        }
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected [ID: ${socket.id}]`);
    });
});
//ERROR MIDDLEWARES
app.use((err: MyError, req: Request, res: Response, next: NextFunction) => {
    console.error('Error occurred:', err.message);
    res.status(err.statusCode).json(createResponse(err.statusCode, err.message, null));
});
httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
