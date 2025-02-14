import { Request, Response, NextFunction } from "express"
import { IUser, User } from "../models/user.model"
import { MyError, handleError } from "../utils/error"
import { createResponse } from "../types/response.type"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../environ"

function createToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '999999d',
    });
}
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body
        const user: IUser | null = await User.findOne({ email })
        if (!user) {
            throw handleError(new MyError("User Not Found"), 404)

        }
        const isValid: boolean = await user.validatePassword(password)
        if (!isValid) {
            throw handleError(new MyError("Invalid password"), 401)
        }
        const token = createToken(user.email)
        res.status(200).json(createResponse(200, "Login successful", { token, email: user.email }))
    } catch (err) {
        next(err)
    }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body
        const userExisting: IUser | null = await User.findOne({ email })
        if (userExisting) {
            throw handleError(new MyError("User already exists"), 400)
        }
        const user: IUser = new User({ email, password })
        await user.save()
        res.status(201).json(createResponse(201, "User created", null))
    }
    catch (err) {
        next(err)
    }
}