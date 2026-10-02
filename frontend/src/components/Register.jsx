// Register.jsx — Premium Registration Page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail, Lock, User, ArrowRight, Code2,
  Eye, EyeOff, Check, Shield, Zap, Sparkles
} from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// Same animated background as login
const AuthBackground = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
    <div style={{
      position: 'absolute', top: '-20%', right: '-15%',
      width: '60%', height: '60%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)',
      filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite'
    }} />
    <div style={{
      position: 'absolute', bottom: '-25%', left: '-20%',
      width: '70%', height: '70%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)',
      filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite reverse'
    }} />
    <div style={{
      position: 'absolute', top: '40%', left: '30%',
      width: '25%', height: '25%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)',
      filter: 'blur(50px)', animation: 'float 7s ease-in-out infinite 2s'
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }} />
  </div>
);

// Password strength indicator
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /\d/.test(password) },
    { label: 'Contains special char', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['#f43f5e', '#f43f5e', '#f59e0b', '#f59e0b', '#10b981'];
  const labels = ['', 'Weak', 'Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div className="animate-fade-in" style={{ marginTop: '10px' }}>
      {/* Strength bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '3px', borderRadius: '999px',
            background: i < score ? colors[score] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s ease'
          }} />
        ))}
        <span style={{ fontSize: '11px', fontWeight: 700, color: colors[score], marginLeft: '8px', whiteSpace: 'nowrap' }}>
          {labels[score]}
        </span>
      </div>
      {/* Checks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {checks.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: c.pass ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${c.pass ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease', flexShrink: 0
            }}>
              <Check size={8} color={c.pass ? '#10b981' : '#334155'} />
            </div>
            <span style={{ fontSize: '11px', color: c.pass ? '#94a3b8' : '#334155', transition: 'color 0.3s' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusField, setFocusField] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${backendURL}/api/register`, { name, email, password });
      if (response.status === 201 || response.data.success === true) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response.data.message || "Failed to register.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Error occurred during registration.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '13px 16px 13px 44px',
    background: focusField === field ? 'rgba(5,7,15,0.8)' : 'rgba(5,7,15,0.4)',
    border: `1px solid ${focusField === field ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '12px', color: '#f1f5f9', fontSize: '14px', fontFamily: 'inherit',
    outline: 'none', transition: 'all 0.25s ease',
    boxShadow: focusField === field ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none'
  });

  const iconColor = (field) => focusField === field ? '#6366f1' : '#334155';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#05070f', position: 'relative' }}>
      <AuthBackground />

      {/* LEFT: Form Panel */}
      <div style={{
        flex: '1', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', position: 'relative', zIndex: 1
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '11px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.35)'
            }}>
              <Code2 size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              AI<span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reviewer</span>
            </span>
          </div>

          {/* Header */}
          <div className="animate-fade-in" style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>
              Start reviewing code with AI in minutes. Free forever.
            </p>
          </div>

          {/* Success State */}
          {success && (
            <div className="animate-fade-in" style={{
              padding: '16px 20px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Check size={15} color="#10b981" />
              </div>
              <div>
                <p style={{ color: '#6ee7b7', fontSize: '14px', fontWeight: 700 }}>Account created!</p>
                <p style={{ color: '#475569', fontSize: '12px' }}>Redirecting to login...</p>
              </div>
            </div>
          )}

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
            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: iconColor('name'), transition: 'color 0.25s'
                }}>
                  <User size={17} />
                </div>
                <input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocusField('name')}
                  onBlur={() => setFocusField('')}
                  required
                  disabled={loading || success}
                  style={inputStyle('name')}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: iconColor('email'), transition: 'color 0.25s'
                }}>
                  <Mail size={17} />
                </div>
                <input
                  id="register-email"
                  type="email"
                  placeholder="developer@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField('')}
                  required
                  disabled={loading || success}
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
                  color: iconColor('password'), transition: 'color 0.25s'
                }}>
                  <Lock size={17} />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField('')}
                  required
                  minLength={8}
                  disabled={loading || success}
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
              <PasswordStrength password={password} />
            </div>

            {/* Terms notice */}
            <p style={{ fontSize: '12px', color: '#334155', marginBottom: '18px', lineHeight: 1.6 }}>
              By creating an account, you agree to our{' '}
              <span style={{ color: '#6366f1', cursor: 'pointer' }}>Terms of Service</span> and{' '}
              <span style={{ color: '#6366f1', cursor: 'pointer' }}>Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%', padding: '14px',
                background: (loading || success) ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                color: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                border: 'none', cursor: (loading || success) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.25s ease',
                boxShadow: (loading || success) ? 'none' : '0 8px 24px rgba(99,102,241,0.3)'
              }}
              onMouseEnter={e => { if (!loading && !success) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = (loading || success) ? 'none' : '0 8px 24px rgba(99,102,241,0.3)'; }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', animation: 'spin 1s linear infinite' }} />
                  Creating account...
                </>
              ) : success ? (
                <><Check size={16} /> Account Created!</>
              ) : (
                <>Create Free Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#334155' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
              onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: Info Panel */}
      <div style={{
        flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', position: 'relative', zIndex: 1,
        borderLeft: '1px solid rgba(255,255,255,0.05)'
      }} className="hide-mobile">
        <div style={{ marginBottom: '48px' }}>
          <div className="badge badge-primary" style={{ marginBottom: '20px' }}>
            <Sparkles size={12} /> Free Forever
          </div>
          <h2 style={{
            fontSize: '38px', fontWeight: 900, letterSpacing: '-0.04em',
            color: '#f1f5f9', lineHeight: 1.1, marginBottom: '18px'
          }}>
            Your code,<br />
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>10x better.</span>
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, maxWidth: '360px' }}>
            Join 50,000+ developers who use AI-powered code reviews to ship higher-quality, more secure code every day.
          </p>
        </div>

        {/* Benefit list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icon: Shield, text: "Security vulnerability scanning for 50+ attack types", color: '16,185,129' },
            { icon: Zap, text: "Performance analysis and automatic code optimization", color: '245,158,11' },
            { icon: Sparkles, text: "AI-generated test suites with full coverage", color: '99,102,241' },
            { icon: Code2, text: "Support for 40+ programming languages", color: '34,211,238' },
          ].map((item, i) => (
            <div key={i} className="animate-fade-in" style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              animationDelay: `${i * 0.08}s`
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: `rgba(${item.color}, 0.1)`,
                border: `1px solid rgba(${item.color}, 0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <item.icon size={18} color={`rgb(${item.color})`} />
              </div>
              <span style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div style={{
          marginTop: '48px', padding: '20px', borderRadius: '16px',
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
            <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, marginLeft: '4px' }}>4.9/5 rating</span>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
            "Set up in 2 minutes, caught 8 security bugs in our first review. Incredible tool."
          </p>
          <p style={{ fontSize: '12px', color: '#334155', marginTop: '8px', fontWeight: 600 }}>— Alex K., Lead Developer</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Register;
