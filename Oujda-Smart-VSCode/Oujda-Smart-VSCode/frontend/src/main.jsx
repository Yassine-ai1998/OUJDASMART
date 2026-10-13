import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Provider, useApp } from "./contexts/AppContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import { Flights, FlightDetails, Services, FAQ } from "./pages/Travel";
import { Home } from "./pages/Home";
import { Assistant, Complaint, Auth, UserDashboard } from "./pages/Passenger";
import {
  AdminDashboard,
  AdminResource,
  AdminComplaints,
  AdminConversations,
} from "./pages/Admin";
import "./styles.css";
import "./international.css";
import "./airport-identity.css";
const Tracking = React.lazy(() => import("./pages/Tracking"));
function TrackingScreen() {
  const { t } = useApp();
  return (
    <React.Suspense
      fallback={
        <div className="container page" role="status">
          {t("loading")}
        </div>
      }
    >
      <Tracking />
    </React.Suspense>
  );
}
function Protected({ children, admin = false }) {
  const { user, ready, t } = useApp();
  if (!ready) return <div className="empty">{t("loading")}</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "ADMIN") return <Navigate to="/account" replace />;
  return children;
}
function NotFound() {
  const { t } = useApp();
  return (
    <main className="container page empty">
      <h1>404</h1>
      <h2>{t("noPage")}</h2>
      <Link className="btn primary" to="/">
        {t("returnHome")}
      </Link>
    </main>
  );
}
class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="container page">
          <h1>Une erreur est survenue.</h1>
          <p>Rechargez la page pour retrouver le prototype.</p>
          <button
            className="btn primary"
            onClick={() => window.location.reload()}
          >
            Recharger
          </button>
        </main>
      );
    return this.props.children;
  }
}
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="flights" element={<Flights />} />
            <Route path="tracking" element={<TrackingScreen />} />
            <Route path="flights/:id" element={<FlightDetails />} />
            <Route path="services" element={<Services />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="complaints" element={<Complaint />} />
            <Route path="login" element={<Auth />} />
            <Route path="register" element={<Auth register />} />
            <Route
              path="account"
              element={
                <Protected>
                  <UserDashboard />
                </Protected>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="admin"
            element={
              <Protected admin>
                <AdminLayout />
              </Protected>
            }
          >
            <Route index element={<AdminDashboard />} />
            {["flights", "services", "faq", "knowledge"].map((resource) => (
              <Route
                key={resource}
                path={resource}
                element={<AdminResource key={resource} resource={resource} />}
              />
            ))}
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="conversations" element={<AdminConversations />} />
            <Route path="analytics" element={<AdminDashboard full />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </ErrorBoundary>,
);
