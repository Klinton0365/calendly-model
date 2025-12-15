import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import Schedule from "../pages/Schedule";
import OAuthSuccess from "../pages/OAuthSuccess";
import Meetings from "../pages/Meeting";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/schedule/:hostId" element={<Schedule />} />

      {/* AUTH ROUTES (NO SIDEBAR) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* OAUTH CALLBACK (NO LAYOUT) */}
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* PROTECTED APP ROUTES (WITH SIDEBAR) */}
      <Route
        element={
          isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/availability" element={<Admin />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}