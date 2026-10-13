import { z } from "zod";
export const languages = ["fr", "ar", "en"];
const str = (max) => z.string().trim().min(1).max(max);
export const translated = z.object({
  fr: str(4000),
  ar: str(4000),
  en: str(4000),
});
export const flight = z.object({
  number: str(12).regex(/^[A-Z0-9 -]+$/),
  airline: str(80),
  city: str(100),
  direction: z.enum(["departure", "arrival"]),
  scheduled_at: z.string().datetime(),
  estimated_at: z.string().datetime(),
  gate: str(10),
  status: z.enum([
    "ON_TIME",
    "DELAYED",
    "BOARDING",
    "DEPARTED",
    "ARRIVED",
    "CANCELLED",
  ]),
  terminal: str(30).default("Terminal démo"),
});
export const service = z.object({
  slug: str(60).regex(/^[a-z0-9-]+$/),
  icon: str(40),
  title: translated,
  description: translated,
  location: translated,
  hours: translated,
});
export const faq = z.object({
  category: str(40),
  question: translated,
  answer: translated,
  keywords: z.string().max(1000),
});
export const knowledge = z.object({
  topic: str(40),
  title: translated,
  content: translated,
  keywords: str(1000),
  source: str(300),
});
export const register = z.object({
  name: str(100),
  email: z
    .string()
    .email()
    .max(180)
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(12)
    .max(72)
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Mot de passe trop long en UTF-8.",
    ),
});
export const complaint = z.object({
  name: str(100),
  email: z
    .string()
    .email()
    .max(180)
    .transform((v) => v.toLowerCase()),
  phone: z.string().max(30).optional().default(""),
  category: z.enum([
    "flights",
    "baggage",
    "parking",
    "transport",
    "assistance",
    "services",
    "other",
  ]),
  subject: str(180),
  message: z.string().trim().min(10).max(4000),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  flight_number: z.string().max(12).optional().default(""),
});
export const uuid = z.string().uuid();
