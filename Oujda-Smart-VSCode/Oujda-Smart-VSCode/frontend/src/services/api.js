import axios from "axios";
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});
api.interceptors.request.use((request) => {
  // The API requires JSON for every mutation, including bodyless deletions.
  if (request.method === "delete" && request.data === undefined)
    request.data = {};
  return request;
});
api.interceptors.response.use(
  (r) => r.data,
  (e) =>
    Promise.reject(
      Object.assign(
        new Error(
          e.response?.data?.error || "Connexion au serveur impossible.",
        ),
        { status: e.response?.status },
      ),
    ),
);
