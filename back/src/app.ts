import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.ts";

dotenv.config({ path: './local-sets.env' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));

app.use("/app", alumnoRouter);

app.listen(port, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${port}/app/`);
});
