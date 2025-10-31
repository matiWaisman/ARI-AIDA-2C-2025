import { Router } from "express";
import { UserController } from "../../../application/controllers/user-controller.ts";

export const userRouter = Router();

userRouter.post("/login", UserController.login);
userRouter.post("/register", UserController.register);
userRouter.post("/logout", UserController.logout);
userRouter.get("/session", UserController.session);