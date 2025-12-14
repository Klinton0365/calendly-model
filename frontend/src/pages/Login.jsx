import React, { useState } from "react";
import api, { setAuthToken } from "../api";
import { Link } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      setAuthToken(res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Incorrect email or password");
      } else {
        setError("Login failed. Try again.");
      }
    }

    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 0 1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: '#0d3b5c',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          Log in to your account
        </h1>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
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
                marginBottom: '16px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <button
              onClick={() => email && setStep(2)}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#006bff',
                border: 'none',
                borderRadius: '8px',
                cursor: email ? 'pointer' : 'not-allowed',
                opacity: email ? 1 : 0.6
              }}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              value={email}
              disabled
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #d1dbe5',
                borderRadius: '8px',
                marginBottom: '12px',
                boxSizing: 'border-box',
                background: '#f1f5f9',
                color: '#6b7c93'
              }}
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submit(e)}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #d1dbe5',
                borderRadius: '8px',
                marginBottom: '16px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <button
              onClick={submit}
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
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </>
        )}

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
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
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
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <svg width="21" height="21" viewBox="0 0 21 21">
            <path fill="#f25022" d="M0 0h10v10H0z"/>
            <path fill="#00a4ef" d="M11 0h10v10H11z"/>
            <path fill="#7fba00" d="M0 11h10v10H0z"/>
            <path fill="#ffb900" d="M11 11h10v10H11z"/>
          </svg>
          Continue with Microsoft
        </a>

        <p style={{
          fontSize: '15px',
          color: '#0d3b5c',
          marginTop: '28px',
          textAlign: 'center'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#006bff',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Sign up for free →
          </Link>
        </p>
      </div>
    </div>
  );
}