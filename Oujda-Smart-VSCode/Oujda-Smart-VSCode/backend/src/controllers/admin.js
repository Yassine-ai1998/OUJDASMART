import { z } from "zod";
import { query, rows, one, tx } from "../config/db.js";
import * as v from "../models/validation.js";
import { id, fail } from "../utils/helpers.js";
const resources = {
  flights: { table: "flights", schema: v.flight },
  services: { table: "services", schema: v.service },
  faq: { table: "faq", schema: v.faq },
  knowledge: { table: "knowledge_base", schema: v.knowledge },
};
export async function list(req, res) {
  const item = resources[req.params.resource];
  if (!item) throw fail(404, "Ressource inconnue.");
  res.json(await rows(`SELECT * FROM ${item.table} ORDER BY id LIMIT 500`));
}
export async function save(req, res) {
  const item = resources[req.params.resource];
  if (!item) throw fail(404, "Ressource inconnue.");
  const d = item.schema.parse(req.body),
    keys = Object.keys(d),
    values = Object.values(d),
    rid = req.params.id ? v.uuid.parse(req.params.id) : id();
  await tx(async (q) => {
    if (req.method === "PUT") {
      const result = await q(
        `UPDATE ${item.table} SET ${keys.map((k, i) => k + "=$" + (i + 1)).join(",")} WHERE id=$${keys.length + 1} RETURNING id`,
        [...values, rid],
      );
      if (!result.rows.length) throw fail(404, "Élément introuvable.");
    } else
      await q(
        `INSERT INTO ${item.table}(id,${keys.join(",")}) VALUES($1,${keys.map((_, i) => "$" + (i + 2)).join(",")})`,
        [rid, ...values],
      );
    await q("INSERT INTO audit_log(id,user_id,action) VALUES($1,$2,$3)", [
      id(),
      req.user.id,
      `${req.method} ${item.table} ${rid}`,
    ]);
  });
  res.status(req.method === "POST" ? 201 : 200).json({ id: rid });
}
export async function remove(req, res) {
  const item = resources[req.params.resource];
  if (!item) throw fail(404, "Ressource inconnue.");
  const rid = v.uuid.parse(req.params.id);
  await tx(async (q) => {
    const result = await q(
      `DELETE FROM ${item.table} WHERE id=$1 RETURNING id`,
      [rid],
    );
    if (!result.rows.length) throw fail(404, "Élément introuvable.");
    await q("INSERT INTO audit_log(id,user_id,action) VALUES($1,$2,$3)", [
      id(),
      req.user.id,
      `DELETE ${item.table} ${rid}`,
    ]);
  });
  res.json({ ok: true });
}
export async function complaints(req, res) {
  res.json(
    await rows(
      "SELECT id,reference,name,email,phone,category,subject,message,priority,flight_number,status,response,sentiment,created_at,updated_at FROM complaints ORDER BY created_at DESC LIMIT 500",
    ),
  );
}
export async function updateComplaint(req, res) {
  const d = z
    .object({
      status: z.enum(["RECEIVED", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      response: z.string().max(4000),
    })
    .parse(req.body);
  const rid = v.uuid.parse(req.params.id);
  await tx(async (q) => {
    const c = (
      await q("SELECT status FROM complaints WHERE id=$1 FOR UPDATE", [rid])
    ).rows[0];
    if (!c) throw fail(404, "Demande introuvable.");
    const allowed = {
      RECEIVED: ["RECEIVED", "IN_PROGRESS"],
      IN_PROGRESS: ["IN_PROGRESS", "RESOLVED"],
      RESOLVED: ["RESOLVED", "CLOSED", "IN_PROGRESS"],
      CLOSED: ["CLOSED", "IN_PROGRESS"],
    };
    if (!allowed[c.status].includes(d.status))
      throw fail(400, "Transition de statut non autorisée.");
    await q(
      "UPDATE complaints SET status=$1,response=$2,updated_at=NOW() WHERE id=$3",
      [d.status, d.response, rid],
    );
    await q("INSERT INTO audit_log(id,user_id,action) VALUES($1,$2,$3)", [
      id(),
      req.user.id,
      "COMPLAINT " + rid + " " + d.status,
    ]);
  });
  res.json({ ok: true });
}
export async function conversations(req, res) {
  res.json(
    await rows(
      "SELECT s.id,s.language,s.created_at,u.name,COUNT(m.id)::int AS messages FROM chat_sessions s LEFT JOIN users u ON s.user_id=u.id LEFT JOIN chat_messages m ON m.session_id=s.id GROUP BY s.id,u.name ORDER BY s.created_at DESC LIMIT 200",
    ),
  );
}
export async function conversation(req, res) {
  res.json(
    await rows(
      "SELECT role,content,source,created_at FROM chat_messages WHERE session_id=$1 ORDER BY sequence",
      [v.uuid.parse(req.params.id)],
    ),
  );
}
export async function analytics(req, res) {
  const counts = await one(
    "SELECT (SELECT COUNT(*)::int FROM users) AS users,(SELECT COUNT(*)::int FROM chat_sessions) AS conversations,(SELECT COUNT(*)::int FROM complaints) AS complaints,(SELECT COUNT(*)::int FROM complaints WHERE status IN ('RECEIVED','IN_PROGRESS')) AS open",
  );
  const topics = await rows(
    "SELECT topic,COUNT(*)::int AS count FROM analytics WHERE event IN ('chat_question','demo_question') GROUP BY topic ORDER BY count DESC",
  );
  const services = await rows(
    "SELECT title,views FROM services ORDER BY views DESC LIMIT 6",
  );
  const sentiments = await rows(
    "SELECT sentiment,COUNT(*)::int AS count FROM complaints GROUP BY sentiment",
  );
  const daily = await rows(
    "SELECT TO_CHAR(created_at AT TIME ZONE 'Africa/Casablanca','YYYY-MM-DD') AS day,COUNT(*)::int AS count FROM analytics WHERE event IN ('chat_question','demo_question') GROUP BY day ORDER BY day DESC LIMIT 30",
  );
  const monthly = await rows(
    "SELECT TO_CHAR(created_at AT TIME ZONE 'Africa/Casablanca','YYYY-MM') AS month,COUNT(*)::int AS count FROM analytics WHERE event IN ('chat_question','demo_question') GROUP BY month ORDER BY month DESC LIMIT 12",
  );
  const questions = await rows(
    "SELECT content,COUNT(*)::int AS count FROM chat_messages WHERE role='user' GROUP BY content ORDER BY count DESC LIMIT 8",
  );
  res.json({
    counts,
    topics,
    services,
    sentiments,
    daily: daily.reverse(),
    monthly: monthly.reverse(),
    questions,
    recommendations: topics
      .slice(0, 3)
      .map((t) => ({ topic: t.topic, count: t.count })),
    analysisMethod: "keyword_rules",
    demo: true,
  });
}
