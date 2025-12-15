import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      // If fetching user fails, token might be invalid
      handleLogout();
    }
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function getInitials(name) {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <aside className="sidebar" role="navigation">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#64748b',
          fontSize: '14px'
        }}>
          Loading...
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar" role="navigation">
      {/* Logo */}
      <div className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#006bff"/>
          <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        MiniCalendly
      </div>

      {/* Create Button */}
      <button className="create-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Create
      </button>

      {/* Navigation */}
      <nav className="nav">
        <NavLink to="/dashboard" end>
          <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2L3 7v9h5v-5h4v5h5V7l-7-5z"/>
          </svg>
          Scheduling
        </NavLink>

        <NavLink to="/meetings">
          <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v2h10V5H5zm0 4v6h10V9H5z"/>
          </svg>
          Meetings
        </NavLink>

        <NavLink to="/availability">
          <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8V6h-2v4H6l4 4 4-4h-3z"/>
          </svg>
          Availability
        </NavLink>

        <div className="nav-divider"></div>

        <NavLink to="/analytics">
          <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 16h3V9H3v7zm5 0h3V5H8v11zm5 0h3v-5h-3v5z"/>
          </svg>
          Analytics
        </NavLink>
      </nav>

      {/* Profile Section with Logout */}
      <div style={{ position: 'relative' }}>
        <div 
          className="profile"
          onClick={() => setShowLogoutMenu(!showLogoutMenu)}
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar">
            {user ? getInitials(user.name) : "U"}
          </div>
          <div className="profile-info">
            <div className="profile-label">Signed in as</div>
            <div className="profile-name">
              {user ? user.name : "User"}
            </div>
          </div>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            style={{ 
              marginLeft: 'auto',
              transition: 'transform 0.2s',
              transform: showLogoutMenu ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <path d="M4 6l4 4 4-4" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Logout Dropdown */}
        {showLogoutMenu && (
          <>
            {/* Backdrop to close menu */}
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999
              }}
              onClick={() => setShowLogoutMenu(false)}
            />
            
            {/* Menu */}
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '12px',
              right: '12px',
              marginBottom: '8px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0d3b5c',
                  marginBottom: '2px'
                }}>
                  {user?.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#64748b'
                }}>
                  {user?.email}
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#dc2626',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}