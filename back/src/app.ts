import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { alumnoRouter } from "../infrastructure/http/routes/routes-alumno.ts";
import { UserController } from "../application/controllers/user-controller.ts";
import { type Request} from "express";
import { type Response} from "express";
import { type NextFunction} from "express";


dotenv.config({ path: './local-sets.env' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

declare module "express-session" {
  interface SessionData {
    usuario?: {
      id: number;
      username: string;
    };
  }
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24  
    }  
}));

function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usuario) {
    return res.redirect("/app/login");
  }
  next();
}

app.get("/app/login", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Login</h1>
        <form method="POST" action="/app/login">
          <input name="username" placeholder="Usuario" required />
          <input type="password" name="password" placeholder="Contraseña" required />
          <button type="submit">Ingresar</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/app/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await UserController.authenticateUser(req, res);
});

app.get("/app/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/app/login");
  });
});

app.get("/app/menu", requireLogin, (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Menú</h1>
        <p>Bienvenido, ${req.session.usuario?.username}</p>
        <a href="/app/lu">Imprimir certificado por LU</a><br>
        <a href="/app/fecha">Imprimir certificado por fecha de trámite</a><br>
        <a href="/app/archivo">Subir .csv con novedades</a><br>
        <a href="/app/logout">Cerrar sesión</a>
      </body>
    </html>
  `);
});


app.use("/app", requireLogin, alumnoRouter);

app.listen(port, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
});
