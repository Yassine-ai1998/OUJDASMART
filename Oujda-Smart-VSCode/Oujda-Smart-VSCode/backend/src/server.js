import app from "./app.js";
import { config } from "./config/env.js";
import { initialize, close } from "./config/db.js";
import { seed } from "./services/seed.js";
await initialize();
await seed();
const server = app.listen(config.port, "127.0.0.1", () =>
  console.log(
    `Oujda Smart API : http://localhost:${config.port} — prototype académique — DB ${config.mode}`,
  ),
);
async function stop() {
  server.close(async () => {
    await close();
    process.exit(0);
  });
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
