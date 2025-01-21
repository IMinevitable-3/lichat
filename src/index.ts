import express, { Express, Request, Response, Application } from 'express';
import { PORT } from './environ';

const app: Application = express();
const port: number = PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});