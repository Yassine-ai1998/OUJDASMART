import jwt from "jsonwebtoken";
import { randomUUID, randomBytes } from "node:crypto";
import { config } from "../config/env.js";
import { one, query } from "../config/db.js";
import { fail, sha } from "../utils/helpers.js";
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.origin.startsWith("https:"),
  path: "/",
  maxAge: 7 * 86400000,
};
export function cookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .filter((s) => s.includes("="))
      .map((s) => {
        const i = s.indexOf("=");
        return [s.slice(0, i).trim(), s.slice(i + 1)];
      }),
  );
}
export async function optionalAuth(req, res, next) {
  try {
    const token = cookies(req).oas_auth;
    if (token) {
      let decoded;
      try {
        decoded = jwt.verify(token, config.secret, { algorithms: ["HS256"] });
      } catch {}
      if (decoded?.type === "user")
        req.user = await one(
          "SELECT u.id,u.name,u.email,u.role FROM users u JOIN auth_sessions s ON s.user_id=u.id WHERE s.id=$1 AND s.user_id=$2 AND s.expires_at>NOW()",
          [decoded.jti, decoded.sub],
        );
      req.authId = decoded?.jti;
    }
    next();
  } catch (e) {
    next(e);
  }
}
export function required(req, res, next) {
  if (!req.user) return next(fail(401, "Connexion requise."));
  next();
}
export function admin(req, res, next) {
  if (req.user?.role !== "ADMIN")
    return next(fail(403, "Accès administrateur requis."));
  next();
}
export async function issue(user, res) {
  const jti = randomUUID();
  await query("INSERT INTO auth_sessions VALUES($1,$2,$3)", [
    jti,
    user.id,
    new Date(Date.now() + 7 * 86400000),
  ]);
  const token = jwt.sign({ type: "user", jti }, config.secret, {
    subject: user.id,
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.cookie("oas_auth", token, cookieOptions);
}
export function guest(req, res) {
  let token = cookies(req).oas_guest;
  let decoded;
  try {
    decoded = jwt.verify(token, config.secret, { algorithms: ["HS256"] });
  } catch {}
  if (decoded?.type !== "guest") {
    token = jwt.sign(
      { type: "guest", nonce: randomBytes(24).toString("hex") },
      config.secret,
      { expiresIn: "7d", algorithm: "HS256" },
    );
    res.cookie("oas_guest", token, cookieOptions);
  }
  return sha(token);
}
