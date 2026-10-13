import { initialize, close } from "../src/config/db.js";
import { seed } from "../src/services/seed.js";
await initialize();
await seed();
await close();
console.log("Schéma et données initialisés. Comptes : .local-accounts.txt");
