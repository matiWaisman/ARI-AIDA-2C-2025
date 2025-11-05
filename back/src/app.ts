import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.ts";
import { UserController } from "../application/controllers/controller-user.ts";
import { userRouter } from "../infrastructure/http/routes/routes-user.ts";
import { cursaRouter } from "../infrastructure/http/routes/routes-cursa.ts";

dotenv.config({ path: "./local-sets.env" });

// Variable de entorno para controlar si el login es obligatorio
const REQUIRE_LOGIN = process.env.REQUIRE_LOGIN === "true" || process.env.REQUIRE_LOGIN === "1";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

declare module "express-session" {
  interface SessionData {
    usuario?: {
      id: number;
      username: string;
    };
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi_secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usuario) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  next();
}

app.use("/app", userRouter); 
app.use("/app", requireLogin, alumnoRouter);
app.use("/app", requireLogin, cursaRouter);


app.listen(port, () => {
  console.log(`💦🍆  Backend se esta corriendo 😲 ...en http://localhost:${port}/app/`);
});
