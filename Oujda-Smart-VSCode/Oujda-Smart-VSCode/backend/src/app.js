import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config } from "./config/env.js";
import router from "./routes/index.js";
const app = express();
app.disable("x-powered-by");
const origins = [config.origin];
if (config.origin.startsWith("http://localhost:"))
  origins.push(config.origin.replace("localhost", "127.0.0.1"));
app.use(helmet());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "64kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 240,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Trop de requêtes." },
  }),
);
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    (!origins.includes(req.headers.origin) || !req.is("application/json"))
  )
    return res
      .status(403)
      .json({ error: "Origine ou format de requête refusé." });
  next();
});
app.use("/api", router);
app.use((req, res) =>
  res.status(404).json({ error: "Ressource introuvable." }),
);
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError)
    return res
      .status(400)
      .json({
        error: "Vérifiez les champs du formulaire.",
        fields: err.issues.map((i) => i.path.join(".")),
      });
  if (err.code === "23505")
    return res.status(409).json({ error: "Cet élément existe déjà." });
  if (err.type === "entity.too.large")
    return res.status(413).json({ error: "Requête trop volumineuse." });
  if (err instanceof SyntaxError)
    return res.status(400).json({ error: "JSON invalide." });
  if (!err.status) console.error("[API]", err.message);
  res
    .status(err.status || 500)
    .json({
      error: err.status ? err.message : "Erreur interne. Réessayez plus tard.",
    });
});
export default app;
