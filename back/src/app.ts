import express from "express";
import dotenv from "dotenv";
import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.ts";

dotenv.config({ path: './local-sets.env' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/app", alumnoRouter);

app.listen(port, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${port}/app/lu/:lu`);
});
