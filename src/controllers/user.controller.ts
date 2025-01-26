import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
import { MyError, handleError } from '../utils/error';
import { createResponse } from '../types/response.type';
import { AuthenticatedRequest } from '../types/authenticatedRequest.type';
// Get all users
export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json(createResponse(200, "All Users", { users }))

    } catch (error) {
        next(error);
    }
};

// Get user by ID
export const getUserById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw handleError(new MyError('User not found'), 404);
        }
        res.status(200).json(createResponse(200, "Requested user", { user }))

    } catch (error) {
        next(error);
    }
};