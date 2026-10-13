import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const envPath = path.join(ROOT, ".env");
if (!fs.existsSync(envPath) && process.env.NODE_ENV !== "production") {
  const env = fs
    .readFileSync(path.join(ROOT, ".env.example"), "utf8")
    .replace("JWT_SECRET=", "JWT_SECRET=" + randomBytes(48).toString("hex"))
    .replace(
      "DEMO_PASSWORD=",
      "DEMO_PASSWORD=" + randomBytes(14).toString("base64url"),
    )
    .replace(
      "ADMIN_PASSWORD=",
      "ADMIN_PASSWORD=" + randomBytes(16).toString("base64url"),
    );
  fs.writeFileSync(envPath, env, { mode: 0o600 });
}
dotenv.config({ path: envPath });
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw new Error("JWT_SECRET doit contenir au moins 32 caractères.");
export const config = {
  port: Number(process.env.PORT || 4102),
  origin: process.env.APP_ORIGIN || "http://localhost:3102",
  secret: process.env.JWT_SECRET,
  demo: process.env.SEED_DEMO === "true",
  mode: process.env.DB_MODE || "postgres",
};
