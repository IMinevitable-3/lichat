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
const io = new Server(httpServer);

//ERROR MIDDLEWARES
app.use((err: MyError, req: Request, res: Response, next: NextFunction) => {
    console.error('Error occurred:', err.message);
    res.status(err.statusCode).json(createResponse(err.statusCode, err.message, null));
});
httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
