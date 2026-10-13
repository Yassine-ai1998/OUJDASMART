import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { query, rows, one, tx } from "../config/db.js";
import { issue, guest, cookieOptions } from "../middleware/auth.js";
import * as v from "../models/validation.js";
import { id, fail, sha, sentiment, normalize } from "../utils/helpers.js";
import { answer } from "../services/assistant.js";
import { MOROCCO_SCHEDULED_CLOCK_SQL } from "../utils/moroccoTime.js";
export async function register(req, res) {
  const d = v.register.parse(req.body);
  if (await one("SELECT id FROM users WHERE email=$1", [d.email]))
    throw fail(409, "Cette adresse est déjà utilisée.");
  const user = { id: id(), name: d.name, email: d.email, role: "USER" };
  await query(
    "INSERT INTO users(id,name,email,password_hash) VALUES($1,$2,$3,$4)",
    [user.id, d.name, d.email, await bcrypt.hash(d.password, 12)],
  );
  await issue(user, res);
  res.status(201).json(user);
}
export async function login(req, res) {
  const d = z
    .object({
      email: z.string().email().max(180),
      password: z
        .string()
        .min(1)
        .max(72)
        .refine((value) => Buffer.byteLength(value, "utf8") <= 72),
    })
    .parse(req.body);
  const u = await one("SELECT * FROM users WHERE email=$1", [
    d.email.toLowerCase(),
  ]);
  if (!u || !(await bcrypt.compare(d.password, u.password_hash)))
    throw fail(401, "Identifiants incorrects.");
  await issue(u, res);
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}
export async function logout(req, res) {
  if (req.authId)
    await query("DELETE FROM auth_sessions WHERE id=$1", [req.authId]);
  res.clearCookie("oas_auth", {
    httpOnly: true,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
    path: "/",
  });
  res.json({ ok: true });
}
export async function flights(req, res) {
  const p = [],
    where = [];
  const add = (expr, value) => {
    p.push(value);
    where.push(expr.replace("?", `$${p.length}`));
  };
  for (const key of ["direction", "status", "airline"])
    if (req.query[key]) add(`${key}=?`, String(req.query[key]).slice(0, 80));
  if (req.query.q)
    add(
      "(number||' '||airline||' '||city) ILIKE ?",
      "%" + String(req.query.q).slice(0, 100) + "%",
    );
  if (req.query.city)
    add("city ILIKE ?", "%" + String(req.query.city).slice(0, 100) + "%");
  if (req.query.after) {
    const t = z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .parse(req.query.after);
    add(`${MOROCCO_SCHEDULED_CLOCK_SQL}>=?`, t);
  }
  res.json(
    await rows(
      "SELECT * FROM flights" +
        (where.length ? " WHERE " + where.join(" AND ") : "") +
        " ORDER BY scheduled_at LIMIT 200",
      p,
    ),
  );
}
export async function flightDetails(req, res) {
  const f = await one("SELECT * FROM flights WHERE id=$1", [
    v.uuid.parse(req.params.id),
  ]);
  if (!f) throw fail(404, "Vol introuvable.");
  res.json(f);
}
export async function services(req, res) {
  res.json(await rows("SELECT * FROM services ORDER BY slug"));
}
export async function serviceView(req, res) {
  const sid = v.uuid.parse(req.params.id);
  if (!(await one("SELECT id FROM services WHERE id=$1", [sid])))
    throw fail(404, "Service introuvable.");
  await query("UPDATE services SET views=views+1 WHERE id=$1", [sid]);
  await query("INSERT INTO analytics(id,event,topic) VALUES($1,$2,$3)", [
    id(),
    "service_view",
    sid,
  ]);
  res.json({ ok: true });
}
export async function faq(req, res) {
  let list = await rows("SELECT * FROM faq ORDER BY category");
  if (req.query.category)
    list = list.filter((f) => f.category === req.query.category);
  if (req.query.q) {
    const q = normalize(String(req.query.q).slice(0, 200));
    list = list.filter((f) =>
      normalize(
        JSON.stringify(f.question) +
          " " +
          JSON.stringify(f.answer) +
          " " +
          f.keywords,
      ).includes(q),
    );
  }
  res.json(list);
}
export async function favorites(req, res) {
  res.json(
    await rows(
      "SELECT f.* FROM flights f JOIN favorites a ON a.flight_id=f.id WHERE a.user_id=$1 ORDER BY f.scheduled_at",
      [req.user.id],
    ),
  );
}
export async function toggleFavorite(req, res) {
  const fid = v.uuid.parse(req.params.id);
  if (!(await one("SELECT id FROM flights WHERE id=$1", [fid])))
    throw fail(404, "Vol introuvable.");
  if (req.method === "DELETE")
    await query("DELETE FROM favorites WHERE user_id=$1 AND flight_id=$2", [
      req.user.id,
      fid,
    ]);
  else
    await query("INSERT INTO favorites VALUES($1,$2) ON CONFLICT DO NOTHING", [
      req.user.id,
      fid,
    ]);
  res.json({ ok: true });
}
export async function complaint(req, res) {
  const d = v.complaint.parse(req.body),
    cid = id(),
    code = randomBytes(15).toString("base64url"),
    ref = "OUD-" + randomBytes(5).toString("hex").toUpperCase();
  await query(
    "INSERT INTO complaints(id,reference,access_hash,user_id,name,email,phone,category,subject,message,priority,flight_number,sentiment) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
    [
      cid,
      ref,
      sha(code),
      req.user?.id || null,
      d.name,
      d.email,
      d.phone,
      d.category,
      d.subject,
      d.message,
      d.priority,
      d.flight_number,
      sentiment(d.message),
    ],
  );
  res
    .status(201)
    .json({ reference: ref, accessCode: code, status: "RECEIVED" });
}
export async function track(req, res) {
  const d = z
    .object({
      reference: z.string().max(30),
      email: z.string().email(),
      accessCode: z.string().min(10).max(100),
    })
    .parse(req.body);
  const c = await one(
    "SELECT reference,subject,status,response,created_at,updated_at FROM complaints WHERE reference=$1 AND email=$2 AND access_hash=$3",
    [d.reference, d.email.toLowerCase(), sha(d.accessCode)],
  );
  if (!c) throw fail(404, "Demande introuvable ou code incorrect.");
  res.json(c);
}
export async function myComplaints(req, res) {
  res.json(
    await rows(
      "SELECT id,reference,subject,message,status,response,category,created_at FROM complaints WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id],
    ),
  );
}
async function ownChat(req, res, cid) {
  const h = guest(req, res);
  const s = await one("SELECT * FROM chat_sessions WHERE id=$1", [
    v.uuid.parse(cid),
  ]);
  if (
    !s ||
    !(
      (req.user && s.user_id === req.user.id) ||
      (!s.user_id && s.guest_hash === h)
    )
  )
    throw fail(404, "Conversation introuvable.");
  return s;
}
export async function chat(req, res) {
  const d = z
    .object({
      message: z.string().trim().min(2).max(1500),
      language: z.enum(v.languages),
      sessionId: v.uuid.optional(),
    })
    .parse(req.body);
  let cid = d.sessionId;
  if (cid) await ownChat(req, res, cid);
  else {
    cid = id();
    await query(
      "INSERT INTO chat_sessions(id,user_id,guest_hash,language) VALUES($1,$2,$3,$4)",
      [
        cid,
        req.user?.id || null,
        req.user ? null : guest(req, res),
        d.language,
      ],
    );
  }
  const response = await answer(d.message, d.language);
  await tx(async (q) => {
    await q(
      "INSERT INTO chat_messages(id,session_id,role,content,topic) VALUES($1,$2,$3,$4,$5)",
      [id(), cid, "user", d.message, response.topic],
    );
    await q(
      "INSERT INTO chat_messages(id,session_id,role,content,source,topic) VALUES($1,$2,$3,$4,$5,$6)",
      [id(), cid, "assistant", response.text, response.source, response.topic],
    );
    await q("INSERT INTO analytics(id,event,topic) VALUES($1,$2,$3)", [
      id(),
      "chat_question",
      response.topic,
    ]);
  });
  res.json({ ...response, sessionId: cid });
}
export async function chats(req, res) {
  const h = guest(req, res);
  res.json(
    await rows(
      "SELECT s.id,s.language,s.created_at,(SELECT content FROM chat_messages m WHERE m.session_id=s.id AND m.role='user' ORDER BY m.created_at LIMIT 1) AS title FROM chat_sessions s WHERE " +
        (req.user ? "s.user_id=$1" : "s.guest_hash=$1 AND s.user_id IS NULL") +
        " ORDER BY s.created_at DESC",
      [req.user?.id || h],
    ),
  );
}
export async function chatHistory(req, res) {
  await ownChat(req, res, req.params.id);
  res.json(
    await rows(
      "SELECT role,content,source,created_at FROM chat_messages WHERE session_id=$1 ORDER BY sequence",
      [req.params.id],
    ),
  );
}
