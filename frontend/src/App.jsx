import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import OAuthSuccess from "./pages/OAuthSuccess";

<Route path="/oauth-success" element={<OAuthSuccess />} />


export default function App() {
  return (
    <Routes>

      {/* AUTH ROUTES (NO SIDEBAR) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* OAUTH CALLBACK (NO LAYOUT) */}
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* APP ROUTES (WITH SIDEBAR) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/availability" element={<Admin />} />
        <Route path="/schedule/:hostId" element={<Schedule />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}



// import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Home from "./pages/Home";
// import Schedule from "./pages/Schedule";
// import Admin from "./pages/Admin";

// export default function App() {
//   return (
//     <div className="app">
//       <Sidebar />
//       <main className="main">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/schedule/:eventId" element={<Schedule />} />
//           <Route path="/admin" element={<Admin />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }
