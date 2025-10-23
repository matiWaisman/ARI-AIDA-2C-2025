import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.ts";
import { UserController } from "../application/controllers/user-controller.ts";

dotenv.config({ path: "./local-sets.env" });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

declare module "express-session" {
  interface SessionData {
    usuario?: {
      id: number;
      username: string;
    };
  }
}

app.use(session({
  secret: process.env.SESSION_SECRET || "mi_secreto",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       
    httpOnly: true,
    sameSite: "lax",      
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usuario) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  next();
}

app.post("/app/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserController.authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  req.session.usuario = { id: user.id, username: user.username };
  res.json({ message: "Login exitoso", usuario: req.session.usuario });
});

app.post("/app/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Sesión finalizada" });
  });
});

app.get("/app/session", (req, res) => {
  if (req.session.usuario) {
    res.json({ autenticado: true, usuario: req.session.usuario });
  } else {
    res.status(401).json({ autenticado: false });
  }
});

app.post("/app/register", async (req, res) => {
  const { username, password, nombre, email, esProfesor, esAlumno } = req.body;

  try {
    const user = await UserController.createUser(username, password, nombre, email, esProfesor, esAlumno);

    if (!user) {
      return res.status(400).json({ message: "No se pudo crear el usuario" });
    }

    res.status(201).json({ message: "Usuario creado con éxito", usuario: user });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


app.use("/app", requireLogin, alumnoRouter);

app.listen(port, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${port}/app/`);
});
