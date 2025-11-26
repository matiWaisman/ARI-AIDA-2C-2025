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

/* -------------------------------------------
   🔥 CORS ARREGLADO PARA RENDER + LOCALHOST
------------------------------------------- */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // permitir todos los deploys de Render
    if (origin.endsWith(".onrender.com")) return callback(null, true);

    // permitir localhost en desarrollo
    if (origin.startsWith("http://localhost")) return callback(null, true);

    return callback(new Error("Origen no permitido por CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// manejar preflight OPTIONS globalmente
app.options("*", cors(corsOptions));

// usar cors en todas las rutas
app.use(cors(corsOptions));

/* -------------------------------------------
              BODY PARSERS
------------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------
           CONFIG SESSION + COOKIE
------------------------------------------- */
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

/* -------------------------------------------
          MIDDLEWARE DE LOGIN
------------------------------------------- */
function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usuario && REQUIRE_LOGIN) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  next();
}

/* -------------------------------------------
               ROUTERS
------------------------------------------- */
app.use("/app", userRouter);
app.use("/app", requireLogin, materiaRouter);
app.use("/app", requireLogin, alumnoRouter);
app.use("/app", requireLogin, cursaRouter);
app.use("/app", requireLogin, encuestasRouter);

/* -------------------------------------------
                START SERVER
------------------------------------------- */
app.listen(port, () => {
  console.log(
    `Backend corriendo en http://localhost:${port}/app/ (env: ${
      isProduction ? "PROD" : "DEV"
    })`
  );
});

export default app;
