import { Router } from "express";
import rateLimit from "express-rate-limit";
import { optionalAuth, required, admin } from "../middleware/auth.js";
import { asyncRoute as wrap } from "../utils/helpers.js";
import * as c from "../controllers/public.js";
import * as a from "../controllers/admin.js";
import { trackingFlights } from "../controllers/tracking.js";
const r = Router();
const limiter = (limit) =>
  rateLimit({
    windowMs: 600000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Trop de demandes. Réessayez dans quelques minutes." },
  });
r.use(optionalAuth);
r.get("/health", (req, res) => res.json({ ok: true, prototype: true }));
r.post("/auth/register", limiter(15), wrap(c.register));
r.post("/auth/login", limiter(30), wrap(c.login));
r.post("/auth/logout", wrap(c.logout));
r.get("/auth/me", required, (req, res) => res.json(req.user));
r.get("/tracking/flights", limiter(40), wrap(trackingFlights));
r.get("/flights", wrap(c.flights));
r.get("/flights/:id", wrap(c.flightDetails));
r.get("/services", wrap(c.services));
r.post("/services/:id/view", limiter(120), wrap(c.serviceView));
r.get("/faq", wrap(c.faq));
r.get("/favorites", required, wrap(c.favorites));
r.post("/favorites/:id", required, wrap(c.toggleFavorite));
r.delete("/favorites/:id", required, wrap(c.toggleFavorite));
r.post("/complaints", limiter(20), wrap(c.complaint));
r.post("/complaints/track", limiter(20), wrap(c.track));
r.get("/complaints/mine", required, wrap(c.myComplaints));
r.post("/chat", limiter(40), wrap(c.chat));
r.get("/chat", wrap(c.chats));
r.get("/chat/:id", wrap(c.chatHistory));
r.get("/analytics", required, admin, wrap(a.analytics));
r.use("/admin", required, admin);
r.get("/admin/dashboard", wrap(a.analytics));
r.get("/admin/complaints", wrap(a.complaints));
r.put("/admin/complaints/:id", wrap(a.updateComplaint));
r.get("/admin/conversations", wrap(a.conversations));
r.get("/admin/conversations/:id", wrap(a.conversation));
r.get("/admin/:resource", wrap(a.list));
r.post("/admin/:resource", wrap(a.save));
r.put("/admin/:resource/:id", wrap(a.save));
r.delete("/admin/:resource/:id", wrap(a.remove));
export default r;
