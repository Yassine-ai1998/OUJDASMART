import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomBytes } from "node:crypto";
const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "oujda-api-test-"));
process.env.DB_MODE = "embedded";
process.env.DATA_DIR = dataDir;
process.env.SEED_DEMO = "true";
process.env.JWT_SECRET = randomBytes(48).toString("hex");
process.env.ADMIN_PASSWORD = randomBytes(20).toString("base64url");
process.env.DEMO_PASSWORD = randomBytes(20).toString("base64url");
process.env.AI_API_KEY = "";
process.env.TRACKING_PROVIDER = "disabled";
process.env.FR24_MODE = "disabled";
process.env.FR24_API_TOKEN = "";
const { default: app } = await import("../src/app.js");
const { initialize, close, query, rows } = await import("../src/config/db.js");
const { seed } = await import("../src/services/seed.js");
await initialize();
await seed({ writeFiles: false });
const server = await new Promise((resolve) => {
  const s = app.listen(0, "127.0.0.1", () => resolve(s));
});
const base = "http://127.0.0.1:" + server.address().port + "/api";
function client() {
  let cookie = "";
  return {
    get cookie() {
      return cookie;
    },
    async req(
      url,
      method = "GET",
      body,
      expected = 200,
      origin = "http://localhost:3102",
    ) {
      const r = await fetch(base + url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
          Cookie: cookie,
        },
        body: method === "GET" ? undefined : JSON.stringify(body || {}),
      });
      const set = r.headers.getSetCookie();
      if (set.length) {
        const values = Object.fromEntries(
          cookie
            .split("; ")
            .filter(Boolean)
            .map((s) => s.split("=")),
        );
        set.forEach((v) => {
          const [k, val] = v.split(";")[0].split("=");
          values[k] = val;
        });
        cookie = Object.entries(values)
          .map(([k, v]) => k + "=" + v)
          .join("; ");
      }
      const d = await r.json();
      assert.equal(r.status, expected, url + ": " + JSON.stringify(d));
      return d;
    },
  };
}
test(
  "Parcours complets, contrôle des accès et cohérence des données",
  { timeout: 60000 },
  async () => {
    const guest = client(),
      user = client(),
      other = client(),
      admin = client();
    await guest.req("/admin/dashboard", "GET", null, 401);
    const tracking = await guest.req("/tracking/flights");
    assert.equal(tracking.status, "not_configured");
    assert.equal(tracking.flights.length, 0);
    await guest.req("/tracking/flights?direction=invalid", "GET", null, 400);
    await guest.req("/tracking/flights?airport=OTHER", "GET", null, 400);
    const flights = await guest.req("/flights");
    assert.equal(flights.length, 12);
    assert.equal((await guest.req("/services")).length, 10);
    assert.equal((await guest.req("/faq")).length, 10);
    assert.equal((await guest.req("/flights?q=AT700")).length, 1);
    assert.ok(
      (await guest.req("/flights?direction=arrival")).every(
        (f) => f.direction === "arrival",
      ),
    );
    assert.equal(
      (await guest.req("/flights?q=" + encodeURIComponent("' OR 1=1 --")))
        .length,
      0,
    );
    await guest.req(
      "/auth/register",
      "POST",
      { name: "Test", email: "short@example.test", password: "short" },
      400,
    );
    await user.req(
      "/auth/register",
      "POST",
      {
        name: "Passager test",
        email: "test-a@example.test",
        password: "TestPasswordLong!2026",
        role: "ADMIN",
      },
      201,
    );
    assert.equal((await user.req("/auth/me")).role, "USER");
    await other.req(
      "/auth/register",
      "POST",
      {
        name: "Autre test",
        email: "test-b@example.test",
        password: "TestPasswordLong!2026",
      },
      201,
    );
    await user.req("/admin/dashboard", "GET", null, 403);
    await guest.req(
      "/auth/login",
      "POST",
      { email: "test-a@example.test", password: "wrong" },
      401,
    );
    await user.req("/favorites/" + flights[0].id, "POST");
    assert.equal((await user.req("/favorites")).length, 1);
    await user.req("/favorites/" + flights[0].id, "POST");
    assert.equal((await user.req("/favorites")).length, 1);
    assert.equal((await other.req("/favorites")).length, 0);
    await user.req("/favorites/" + flights[0].id, "DELETE");
    assert.equal((await user.req("/favorites")).length, 0);
    const complaint = await user.req(
      "/complaints",
      "POST",
      {
        name: "Test",
        email: "test-a@example.test",
        category: "parking",
        subject: "Test parking",
        message: "Le parking est difficile à trouver dans le prototype.",
        priority: "NORMAL",
      },
      201,
    );
    await guest.req(
      "/complaints/track",
      "POST",
      {
        reference: complaint.reference,
        email: "test-a@example.test",
        accessCode: "incorrect-code",
      },
      404,
    );
    assert.equal(
      (
        await guest.req("/complaints/track", "POST", {
          reference: complaint.reference,
          email: "test-a@example.test",
          accessCode: complaint.accessCode,
        })
      ).status,
      "RECEIVED",
    );
    assert.equal((await other.req("/complaints/mine")).length, 0);
    const chat = await user.req("/chat", "POST", {
      message: "Où se trouve le parking ?",
      language: "fr",
    });
    assert.equal(chat.source, "knowledge_base");
    assert.equal(chat.topic, "parking");
    assert.deepEqual(
      (await user.req("/chat/" + chat.sessionId)).map((m) => m.role),
      ["user", "assistant"],
    );
    await other.req("/chat/" + chat.sessionId, "GET", null, 404);
    const ar = await guest.req("/chat", "POST", {
      message: "أين موقف السيارات؟",
      language: "ar",
    });
    assert.match(ar.text, /[\u0600-\u06ff]/);
    assert.equal(ar.topic, "parking");
    const flightAnswer = await guest.req("/chat", "POST", {
      message: "Mon vol AT700 est-il retardé ?",
      language: "fr",
      sessionId: ar.sessionId,
    });
    assert.equal(flightAnswer.source, "demo_flight");
    assert.match(flightAnswer.text, /fictif/);
    const unknown = await guest.req("/chat", "POST", {
      message: "xyzxyz inconnu",
      language: "fr",
    });
    assert.equal(unknown.source, "fallback");
    await user.req("/complaints", "POST", {}, 403, "https://evil.invalid");
    await admin.req("/auth/login", "POST", {
      email: "admin@oujda-demo.test",
      password: process.env.ADMIN_PASSWORD,
    });
    const stats = await admin.req("/admin/dashboard");
    assert.equal(stats.counts.users, 4);
    assert.ok(stats.counts.complaints >= 6);
    const f = {
      number: "ZZ999",
      airline: "Compagnie Test",
      city: "Ville Test",
      direction: "departure",
      scheduled_at: new Date().toISOString(),
      estimated_at: new Date().toISOString(),
      gate: "9",
      status: "ON_TIME",
      terminal: "Test",
    };
    const created = await admin.req("/admin/flights", "POST", f, 201);
    await admin.req("/admin/flights/" + created.id, "PUT", {
      ...f,
      status: "DELAYED",
    });
    assert.equal((await guest.req("/flights/" + created.id)).status, "DELAYED");
    await admin.req("/admin/flights/" + created.id, "DELETE");
    await guest.req("/flights/" + created.id, "GET", null, 404);
    const c = (await user.req("/complaints/mine"))[0];
    await admin.req(
      "/admin/complaints/" + c.id,
      "PUT",
      { status: "CLOSED", response: "" },
      400,
    );
    await admin.req("/admin/complaints/" + c.id, "PUT", {
      status: "IN_PROGRESS",
      response: "Nous examinons votre demande.",
    });
    assert.equal((await user.req("/complaints/mine"))[0].status, "IN_PROGRESS");
    const tr = {
      fr: "Test de connaissance",
      en: "Knowledge test",
      ar: "اختبار المعرفة",
    };
    const kb = await admin.req(
      "/admin/knowledge",
      "POST",
      {
        topic: "services",
        title: tr,
        content: tr,
        keywords: "uniqueapifaq",
        source: "Test",
      },
      201,
    );
    assert.equal(
      (
        await user.req("/chat", "POST", {
          message: "uniqueapifaq",
          language: "fr",
        })
      ).text,
      tr.fr,
    );
    await admin.req("/admin/knowledge/" + kb.id, "DELETE");
    const cookie = user.cookie;
    await user.req("/auth/logout", "POST");
    await user.req("/auth/me", "GET", null, 401);
    assert.equal(
      (await fetch(base + "/auth/me", { headers: { Cookie: cookie } })).status,
      401,
    );
    assert.ok((await rows("SELECT * FROM audit_log")).length >= 5);
  },
);
test("Adaptateur LLM remplaçable et secours local en cas d’échec", async () => {
  const { createServer } = await import("node:http");
  const { answer } = await import("../src/services/assistant.js");
  let failing = false,
    received;
  const provider = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    received = {
      authorization: req.headers.authorization,
      data: JSON.parse(body),
    };
    res.writeHead(failing ? 503 : 200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        failing
          ? { error: "Unavailable" }
          : {
              choices: [
                { message: { content: "Réponse du fournisseur de test." } },
              ],
            },
      ),
    );
  });
  await new Promise((resolve) => provider.listen(0, "127.0.0.1", resolve));
  process.env.AI_ENDPOINT =
    "http://127.0.0.1:" + provider.address().port + "/chat";
  process.env.AI_API_KEY = "test-only-key";
  process.env.AI_MODEL = "test-model";
  try {
    const response = await answer("xyzxyz sujet inconnu", "fr");
    assert.equal(response.source, "llm");
    assert.equal(response.text, "Réponse du fournisseur de test.");
    assert.equal(received.authorization, "Bearer test-only-key");
    assert.equal(received.data.model, "test-model");
    failing = true;
    assert.equal(
      (await answer("xyzxyz sujet inconnu", "fr")).source,
      "fallback",
    );
    assert.equal((await answer("parking", "fr")).source, "knowledge_base");
  } finally {
    process.env.AI_API_KEY = "";
    await new Promise((resolve) => provider.close(resolve));
  }
});
test("La limite bcrypt porte sur les octets UTF-8", async () => {
  const c = client();
  await c.req(
    "/auth/register",
    "POST",
    {
      name: "Test unicode",
      email: "unicode@example.test",
      password: "é".repeat(40),
    },
    400,
  );
});

test.after(async () => {
  await new Promise((r) => server.close(r));
  await close();
  const target = path.resolve(dataDir);
  assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
  assert.ok(path.basename(target).startsWith("oujda-api-test-"));
  await fs.rm(target, { recursive: true, force: true });
});
