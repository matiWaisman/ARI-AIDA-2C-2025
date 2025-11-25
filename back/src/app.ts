import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.ts";
import { UserController } from "../application/controllers/controller-user.ts";
import { userRouter } from "../infrastructure/http/routes/routes-user.ts";
import { cursaRouter } from "../infrastructure/http/routes/routes-cursa.ts";
import { materiaRouter } from "../infrastructure/http/routes/routes-materia.ts";
import { encuestasRouter } from "../infrastructure/http/routes/routes-encuestas.ts";

dotenv.config({ path: "./local-sets.env" });

// Variable de entorno para controlar si el login es obligatorio
const REQUIRE_LOGIN =
  process.env.REQUIRE_LOGIN === "true" || process.env.REQUIRE_LOGIN === "1";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

// Agregar URLs del frontend desde variables de entorno (puede ser una o varias separadas por coma)
if (process.env.FRONTEND_URL) {
  const frontendUrls = process.env.FRONTEND_URL.split(",").map((url) =>
    url.trim()
  );
  allowedOrigins.push(...frontendUrls);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, curl, etc.) en desarrollo
      if (!origin) {
        return callback(null, true);
      }

      // Si el origin está en la lista permitida, permitirlo
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Rechazar origins no permitidos
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi_secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS en producción
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" necesario para CORS cross-origin en producción
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usuario && REQUIRE_LOGIN) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  next();
}

app.use("/app", userRouter);
app.use("/app", requireLogin, materiaRouter);
app.use("/app", requireLogin, alumnoRouter);
app.use("/app", requireLogin, cursaRouter);
app.use("/app", requireLogin, encuestasRouter);

app.listen(port, () => {
  console.log(`Backend se esta corriendo en http://localhost:${port}/app/`);
});
