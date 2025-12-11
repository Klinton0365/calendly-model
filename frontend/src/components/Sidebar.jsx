import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar" role="navigation">
      <div className="logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
          <circle cx="12" cy="12" r="10" stroke="#2b6ef6" strokeWidth="2"></circle>
          <path d="M7 12h10" stroke="#2b6ef6" strokeWidth="2" strokeLinecap="round"></path>
        </svg>
        MiniCalendly
      </div>

      <nav className="nav">
        <NavLink to="/" end>Scheduling</NavLink>
        <NavLink to="/admin">Availability</NavLink>
      </nav>

      <div className="profile">
        <div style={{flex:1}}>
          <div style={{fontSize:12,color:'#6b7280'}}>Signed in as</div>
          <div style={{fontWeight:600}}>Host User</div>
        </div>
        <div className="avatar">K</div>
      </div>
    </aside>
  );
}
