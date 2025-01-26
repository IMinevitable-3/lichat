import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { JWT_SECRET } from '../environ';
import { MyError, handleError } from '../utils/error';
import { AuthenticatedRequest } from '../types/authenticatedRequest.type';

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.header('Authorization');
    if (!authHeader) throw handleError(new MyError("Need Token"), 401);

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) throw handleError(new MyError("Need Token"), 401);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId; // Attach `userId` to the request
        next();
    } catch (error) {
        throw handleError(new MyError("Invalid token"), 401);
    }
}
