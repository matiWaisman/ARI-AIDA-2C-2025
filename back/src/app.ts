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

const REQUIRE_LOGIN =
  process.env.REQUIRE_LOGIN === "true" || process.env.REQUIRE_LOGIN === "1";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
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

const isProduction = Boolean(
  process.env.NODE_ENV === "production" || process.env.RENDER
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi_secreto",
    resave: false,
    saveUninitialized: false,
    name: "connect.sid",
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
    },
  })
);

// Ajusta cookies según el origen: localhost (HTTP) usa secure:false, HTTPS usa secure:true
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isLocalhost = Boolean(
    origin &&
      (origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1"))
  );
  const isHttps = Boolean(origin && origin.startsWith("https://"));

  if ((isLocalhost || isHttps) && req.session && req.sessionID) {
    const originalJson = res.json;
    const originalEnd = res.end;
    const originalSend = res.send;

    const adjustCookie = () => {
      res.clearCookie("connect.sid", { path: "/" });
      res.cookie("connect.sid", req.sessionID, {
        secure: isHttps,
        httpOnly: true,
        sameSite: isHttps ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/",
      });
    };

    res.json = function (body?: any) {
      adjustCookie();
      return originalJson.call(this, body);
    };

    res.send = function (body?: any) {
      adjustCookie();
      return originalSend.call(this, body);
    };

    res.end = function (chunk?: any, encoding?: any) {
      adjustCookie();
      return originalEnd.call(this, chunk, encoding);
    };
  }

  next();
});

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
