import { randomUUID, createHash } from "node:crypto";
export const id = () => randomUUID();
export const sha = (v) => createHash("sha256").update(v).digest("hex");
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export const pick = (value, lang) => value?.[lang] || value?.fr || "";
export function normalize(v) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه");
}
export function sentiment(v) {
  const t = normalize(v);
  const positive = [
    "merci",
    "excellent",
    "satisfait",
    "bravo",
    "thank",
    "great",
    "helpful",
    "شكرا",
    "ممتاز",
    "راض",
  ];
  const negative = [
    "retard",
    "perdu",
    "plainte",
    "mauvais",
    "probleme",
    "insatisfait",
    "delay",
    "lost",
    "bad",
    "problem",
    "تاخير",
    "ضائع",
    "سيئ",
    "مشكل",
  ];
  let score = 0;
  positive.forEach((w) => {
    if (t.includes(w)) score++;
  });
  negative.forEach((w) => {
    if (t.includes(w)) score--;
  });
  return score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
}
