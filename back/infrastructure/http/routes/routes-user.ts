import { Router } from "express";
import { UserController } from "../../../application/controllers/user-controller.ts";

export const userRouter = Router();

userRouter.post("/authenticate", UserController.login);
userRouter.post("/create", UserController.register);
userRouter.post("/logout", UserController.logout);
userRouter.get("/session", UserController.session);