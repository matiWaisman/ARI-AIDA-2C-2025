import { Router } from "express";
import { UserController } from "../../../application/controllers/user-controller.ts";

export const userRouter = Router();

userRouter.post("/authenticate", UserController.authenticateUser);
userRouter.post("/create", UserController.createUser);