import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.js";
import { userRouter } from "../infrastructure/http/routes/routes-user.js";
import { cursaRouter } from "../infrastructure/http/routes/routes-cursa.js";
import { materiaRouter } from "../infrastructure/http/routes/routes-materia.js";
import { encuestasRouter } from "../infrastructure/http/routes/routes-encuestas.js";
import { genericRouter } from "../infrastructure/http/routes/routes-generico.js";

dotenv.config({ path: "./local-sets.env" });

const app = express();
const port = process.env.PORT || 3000;

const REQUIRE_LOGIN =
  process.env.REQUIRE_LOGIN === "true" || process.env.REQUIRE_LOGIN === "1";

const isProduction = Boolean(
  process.env.NODE_ENV === "production" || process.env.RENDER
);

if (isProduction) {
  app.set("trust proxy", 1);
}

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://aida-app.onrender.com",
];

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
};
corsOptions.allowedHeaders = ["Content-Type", "Authorization"];
corsOptions.methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
});


app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

declare module "express-session" {
  interface SessionData {
    usuario?: {
      id: number;
      username: string;
      esProfesor: boolean;
      esAlumno: boolean;
      lu: string;
    };
  }
}

const sessionCookieConfig: session.CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
  path: "/",
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    name: "connect.sid",
    cookie: sessionCookieConfig,
  })
);

function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usuario && REQUIRE_LOGIN) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  next();
}

app.use("/app", userRouter);
app.use("/app", requireLogin, genericRouter);
app.use("/app", requireLogin, materiaRouter);
app.use("/app", requireLogin, alumnoRouter);
app.use("/app", requireLogin, cursaRouter);
app.use("/app", requireLogin, encuestasRouter);

app.listen(port, () => {
  console.log(
    `Backend corriendo en http://localhost:${port}/app/ (env: ${
      isProduction ? "PROD" : "DEV"
    })`
  );
});