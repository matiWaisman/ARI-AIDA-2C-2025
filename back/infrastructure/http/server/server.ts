import express from "express";
import { alumnoRouter } from "../routes/routes-alumno.ts";

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use("/app", alumnoRouter);
  return app;
}
