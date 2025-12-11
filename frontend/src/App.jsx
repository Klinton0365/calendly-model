import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule/:eventId" element={<Schedule />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}
