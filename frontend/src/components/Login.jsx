// Login.jsx — Premium Login Page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Code2, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// Animated orbs background
const AuthBackground = ({ accent = "#6366f1" }) => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
    <div style={{
      position: 'absolute', top: '-20%', left: '-15%',
      width: '60%', height: '60%', borderRadius: '50%',
      background: `radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)`,
      filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite'
    }} />
    <div style={{
      position: 'absolute', bottom: '-25%', right: '-20%',
      width: '70%', height: '70%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)',
      filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite reverse'
    }} />
    <div style={{
      position: 'absolute', top: '30%', right: '20%',
      width: '25%', height: '25%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)',
      filter: 'blur(50px)', animation: 'float 6s ease-in-out infinite 1.5s'
    }} />
    {/* Grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }} />
  </div>
);

// Feature pill shown on side
const FeaturePill = ({ icon: Icon, text, color, delay }) => (
  <div className="animate-fade-in" style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 16px', borderRadius: '999px',
    background: `rgba(${color}, 0.08)`,
    border: `1px solid rgba(${color}, 0.2)`,
    animationDelay: `${delay}s`,
    backdropFilter: 'blur(8px)'
  }}>
    <div style={{
      width: '28px', height: '28px', borderRadius: '50%',
      background: `rgba(${color}, 0.15)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={13} color={`rgb(${color})`} />
    </div>
    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{text}</span>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusField, setFocusField] = useState("");
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${backendURL}/api/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        window.location.href = "/try";
      } else {
        setError(response.data.message || "Unknown error occurred.");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) setError(data.message || "Please fill in both email and password.");
        else if (status === 401) setError(data.message || "Invalid email or password.");
        else if (status === 500) setError(data.message || "Server error. Please try again later.");
        else setError(data.message || `Unexpected error: ${status}`);
      } else if (err.request) {
        setError("No response from server. Check your internet connection.");
      } else {
        setError("Request setup error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    document.cookie = "token=guest-session-local; path=/; max-age=86400";
    refreshAuth();
    navigate("/try");
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '13px 16px 13px 44px',
    background: focusField === field ? 'rgba(5,7,15,0.8)' : 'rgba(5,7,15,0.4)',
    border: `1px solid ${focusField === field ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '12px', color: '#f1f5f9', fontSize: '14px', fontFamily: 'inherit',
    outline: 'none', transition: 'all 0.25s ease',
    boxShadow: focusField === field ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#05070f', position: 'relative' }}>
      <AuthBackground />

      {/* LEFT: Branding Panel */}
      <div style={{
        flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', position: 'relative', zIndex: 1,
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }} className="hide-mobile">
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(99,102,241,0.4)'
            }}>
              <Code2 size={22} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              AI<span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reviewer</span>
            </span>
          </div>

          <h2 style={{
            fontSize: '42px', fontWeight: 900, letterSpacing: '-0.04em',
            color: '#f1f5f9', lineHeight: 1.1, marginBottom: '18px'
          }}>
            Code smarter,<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>ship safer.</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, maxWidth: '380px' }}>
            AI-powered code review that catches bugs, security vulnerabilities, and performance issues before they reach production.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FeaturePill icon={Shield} text="Security vulnerability detection" color="16,185,129" delay={0.1} />
          <FeaturePill icon={Zap} text="Performance optimization suggestions" color="245,158,11" delay={0.15} />
          <FeaturePill icon={Sparkles} text="AI-generated test suites" color="99,102,241" delay={0.2} />
          <FeaturePill icon={Code2} text="40+ programming languages supported" color="34,211,238" delay={0.25} />
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div style={{
        flex: '1', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', position: 'relative', zIndex: 1
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Mobile Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', justifyContent: 'center' }} className="show-mobile">
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Code2 size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#f1f5f9' }}>
              AI<span style={{ color: '#818cf8' }}>Reviewer</span>
            </span>
          </div>

          {/* Form header */}
          <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>
              Sign in to continue reviewing code with AI
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="animate-fade-in" style={{
              padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
              color: '#fb7185', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="animate-fade-in stagger-1">
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focusField === 'email' ? '#6366f1' : '#334155', transition: 'color 0.25s'
                }}>
                  <Mail size={17} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  placeholder="developer@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField('')}
                  required
                  disabled={loading}
                  style={inputStyle('email')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focusField === 'password' ? '#6366f1' : '#334155', transition: 'color 0.25s'
                }}>
                  <Lock size={17} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField('')}
                  required
                  disabled={loading}
                  style={{ ...inputStyle('password'), paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: '#334155', background: 'none', border: 'none', padding: '4px',
                    cursor: 'pointer', transition: 'color 0.2s', display: 'flex'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                color: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.25s ease',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.3)'
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(99,102,241,0.3)'; }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '11px', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Guest Mode */}
          <button
            id="guest-login"
            type="button"
            onClick={handleGuestLogin}
            style={{
              width: '100%', padding: '13px',
              background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <Sparkles size={15} />
            Try as Guest (No account needed)
          </button>

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#334155' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#818cf8', fontWeight: 600, textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
            onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
