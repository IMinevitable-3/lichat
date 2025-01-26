import express, { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/authMiddleware";
const userRouter: Router = express.Router()
userRouter.use(verifyToken)
userRouter.get("/get-all-users", getAllUsers)
userRouter.get("/get-user-by-id", getUserById)
export default userRouter