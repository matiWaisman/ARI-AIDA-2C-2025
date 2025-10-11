import { createServer } from "../infrastructure/http/server/server.ts";

async function main() {
  const app = createServer();
  const port = 3000;

  app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}/app/lu`);
  });
}

main().catch(console.error);
