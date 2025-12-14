import React, { useState } from "react";
import api, { setAuthToken } from "../api";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Frontend validation
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
      });

      setAuthToken(res.data.token);
      window.location.href = "/login";

    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: "Registration failed. Try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* LEFT SIDE - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#0d3b5c',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            Create your free account
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7c93',
            marginBottom: '32px'
          }}>
            No credit card required. Upgrade anytime.
          </p>

          {errors.general && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={submit}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #d1dbe5',
                borderRadius: '8px',
                marginBottom: '4px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.name && (
              <span style={{ color: '#dc2626', fontSize: '13px', display: 'block', marginBottom: '12px' }}>
                {errors.name}
              </span>
            )}

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #d1dbe5',
                borderRadius: '8px',
                marginBottom: '4px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.email && (
              <span style={{ color: '#dc2626', fontSize: '13px', display: 'block', marginBottom: '12px' }}>
                {errors.email}
              </span>
            )}

            <input
              type="password"
              placeholder="Create password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #d1dbe5',
                borderRadius: '8px',
                marginBottom: '4px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.password && (
              <span style={{ color: '#dc2626', fontSize: '13px', display: 'block', marginBottom: '12px' }}>
                {errors.password}
              </span>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#006bff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Creating account..." : "Continue with email"}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            margin: '24px 0',
            color: '#6b7c93',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            OR
          </div>

          <a
            href="http://localhost:8000/api/auth/google/redirect"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#0d3b5c',
              background: '#ffffff',
              border: '1px solid #d1dbe5',
              borderRadius: '8px',
              textDecoration: 'none',
              marginBottom: '12px',
              cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
            Continue with Google
          </a>

          <a
            href="http://localhost:8000/api/auth/microsoft/redirect"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#0d3b5c',
              background: '#ffffff',
              border: '1px solid #d1dbe5',
              borderRadius: '8px',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <svg width="21" height="21" viewBox="0 0 21 21">
              <path fill="#f25022" d="M0 0h10v10H0z" />
              <path fill="#00a4ef" d="M11 0h10v10H11z" />
              <path fill="#7fba00" d="M0 11h10v10H0z" />
              <path fill="#ffb900" d="M11 11h10v10H11z" />
            </svg>
            Continue with Microsoft
          </a>

          <p style={{
            fontSize: '14px',
            color: '#6b7c93',
            marginTop: '20px',
            textAlign: 'left'
          }}>
            Continue with Google or Microsoft to connect your calendar.
          </p>

          <p style={{
            fontSize: '15px',
            color: '#0d3b5c',
            marginTop: '24px'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: '#006bff',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Log In →
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Marketing */}
      <div style={{
        flex: 1,
        background: '#f8fafb',
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '500px' }}>
          <span style={{
            display: 'inline-block',
            background: '#e6f0ff',
            color: '#006bff',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            Try Teams plan free
          </span>

          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#0d3b5c',
            lineHeight: '1.3',
            marginBottom: '32px'
          }}>
            Explore premium features with your<br />
            free 14-day Teams plan trial
          </h2>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              'Multi-person and co-hosted meetings',
              'Round Robin meeting distribution',
              'Meeting reminders, follow-ups, and notifications',
              'Connect payment tools like PayPal or Stripe',
              'Remove Calendly branding'
            ].map((feature, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '16px',
                color: '#516f90'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#006bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <p style={{
            fontSize: '13px',
            color: '#97a8ba',
            marginTop: '48px',
            marginBottom: '24px'
          }}>
            Join leading companies using the #1 scheduling tool
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#516f90' }}>Dropbox</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#516f90' }}>ancestry</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#516f90' }}>zendesk</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#516f90' }}>L'ORÉAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}