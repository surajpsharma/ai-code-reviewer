// Landing.jsx — Premium AI Code Reviewer Landing Page
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Code2, Shield, Zap, CheckCircle, ArrowRight, Menu, X,
  Star, ChevronDown, Sparkles, Brain, GitMerge, Cpu,
  FileCode2, Lock, TrendingUp, MessageSquare, Play,
  Github, Twitter, Mail, ExternalLink, Check, Users,
  BarChart3, Award, Layers
} from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// ---- Sub-Components ----

// Animated Background Orbs
const BackgroundOrbs = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
    <div style={{
      position: 'absolute', top: '-15%', left: '-10%',
      width: '55%', height: '55%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
      filter: 'blur(60px)',
      animation: 'float 8s ease-in-out infinite'
    }} />
    <div style={{
      position: 'absolute', bottom: '-20%', right: '-15%',
      width: '60%', height: '60%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
      filter: 'blur(80px)',
      animation: 'float 10s ease-in-out infinite reverse'
    }} />
    <div style={{
      position: 'absolute', top: '40%', left: '40%',
      width: '30%', height: '30%', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
      filter: 'blur(40px)',
      animation: 'float 6s ease-in-out infinite 2s'
    }} />
    {/* Grid overlay */}
    <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
  </div>
);

// Navigation
const Navbar = ({ isScrolled, token, handleLogout, navigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '64px',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      background: isScrolled ? 'rgba(5, 7, 15, 0.92)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)'
          }}>
            <Code2 size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '17px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            AI<span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reviewer</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hide-mobile">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} style={{
              padding: '8px 16px', borderRadius: '8px',
              color: '#94a3b8', fontSize: '14px', fontWeight: 500,
              transition: 'all 0.2s', display: 'block'
            }}
            onMouseEnter={e => { e.target.style.color = '#f1f5f9'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.target.style.color = '#94a3b8'; e.target.style.background = 'transparent'; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {token ? (
            <>
              <button onClick={() => navigate('/try')} className="btn-ghost" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Dashboard
              </button>
              <button onClick={handleLogout} style={{
                padding: '8px 18px', borderRadius: '8px',
                background: 'rgba(244,63,94,0.1)', color: '#f43f5e',
                border: '1px solid rgba(244,63,94,0.25)', fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                Get Started <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Feature Card
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
  <div
    className="animate-fade-in glass"
    style={{
      padding: '28px', borderRadius: '16px', animationDelay: `${delay}s`,
      transition: 'all 0.3s ease', cursor: 'default',
      '--hover-glow': `rgba(${color}, 0.15)`
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = `rgba(${color}, 0.3)`;
      e.currentTarget.style.boxShadow = `0 8px 40px rgba(${color}, 0.15)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: `rgba(${color}, 0.12)`,
      border: `1px solid rgba(${color}, 0.25)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '18px'
    }}>
      <Icon size={22} color={`rgb(${color})`} />
    </div>
    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px' }}>{title}</h3>
    <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
  </div>
);

// Stat Card
const StatCard = ({ value, label, icon: Icon, color }) => (
  <div className="glass" style={{
    padding: '28px 24px', borderRadius: '16px', textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(${color}, 0.15)`; }}
  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
  >
    <div style={{ fontSize: '36px', fontWeight: 900, color: `rgb(${color})`, letterSpacing: '-0.03em', marginBottom: '4px' }}>{value}</div>
    <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
  </div>
);

// Testimonial Card
const TestimonialCard = ({ name, role, review, avatar, delay }) => (
  <div className="glass animate-fade-in" style={{
    padding: '28px', borderRadius: '16px', animationDelay: `${delay}s`,
    transition: 'transform 0.3s ease'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    {/* Stars */}
    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
      ))}
    </div>
    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>
      "{review}"
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', fontWeight: 700, color: 'white'
      }}>
        {name[0]}
      </div>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#475569' }}>{role}</div>
      </div>
    </div>
  </div>
);

// Pricing Card
const PricingCard = ({ plan, price, features, popular, navigate }) => (
  <div style={{
    padding: '36px 32px', borderRadius: '20px',
    border: popular ? '2px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
    background: popular
      ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
      : 'rgba(10,13,26,0.6)',
    backdropFilter: 'blur(16px)',
    position: 'relative',
    transition: 'all 0.3s ease'
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.15)'; }}
  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
  >
    {popular && (
      <div style={{
        position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        color: 'white', fontSize: '11px', fontWeight: 800,
        padding: '5px 16px', borderRadius: '999px', letterSpacing: '0.08em',
        textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        Most Popular
      </div>
    )}
    <div style={{ marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{plan}</span>
    </div>
    <div style={{ marginBottom: '24px' }}>
      <span style={{ fontSize: '44px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em' }}>{price}</span>
      {price !== 'Free' && <span style={{ color: '#475569', fontSize: '14px' }}>/month</span>}
    </div>
    <ul style={{ listStyle: 'none', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: f.included ? '#cbd5e1' : '#334155' }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%',
            background: f.included ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
            border: f.included ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Check size={11} color={f.included ? '#10b981' : '#334155'} />
          </div>
          {f.text}
        </li>
      ))}
    </ul>
    <button
      onClick={() => navigate(popular ? '/register' : '/register')}
      style={{
        width: '100%', padding: '13px',
        borderRadius: '12px', fontSize: '14px', fontWeight: 700,
        background: popular ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
        color: popular ? 'white' : '#94a3b8',
        border: popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s', cursor: 'pointer'
      }}
      onMouseEnter={e => { if (!popular) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; else e.currentTarget.style.opacity = '0.9'; }}
      onMouseLeave={e => { if (!popular) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; else e.currentTarget.style.opacity = '1'; }}
    >
      {popular ? 'Start Free Trial' : 'Get Started'}
    </button>
  </div>
);

// Code Preview Mockup
const CodeMockup = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 300); }, []);

  return (
    <div style={{
      borderRadius: '16px', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(5, 7, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
    }}>
      {/* Window chrome */}
      <div style={{
        padding: '12px 16px', background: 'rgba(15,19,34,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#f43f5e', '#f59e0b', '#10b981'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{
          flex: 1, textAlign: 'center',
          fontSize: '11px', color: '#475569', fontWeight: 500
        }}>
          security_review.py
        </div>
      </div>

      {/* Code content */}
      <div style={{ padding: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12.5px', lineHeight: '1.8' }}>
        <div style={{ color: '#6b7280' }}>{'# User authentication function'}</div>
        <div><span style={{ color: '#6366f1' }}>def</span> <span style={{ color: '#22d3ee' }}>authenticate_user</span><span style={{ color: '#f1f5f9' }}>(username, password):</span></div>
        <div style={{ paddingLeft: '16px' }}>
          <div><span style={{ color: '#6366f1' }}>query</span> <span style={{ color: '#f1f5f9' }}>= f</span><span style={{ color: '#10b981' }}>"SELECT * FROM users WHERE username='{'{username}'}'</span><span style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.08)', padding: '1px 3px', borderRadius: '3px' }}>🚨</span>"</div>
          <div><span style={{ color: '#6366f1' }}>cursor</span><span style={{ color: '#f1f5f9' }}>.execute(query)</span></div>
        </div>

        {/* AI Analysis overlay */}
        {visible && (
          <div className="animate-fade-in" style={{
            marginTop: '12px', padding: '12px 14px',
            background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.25)',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
              <span style={{ color: '#f43f5e', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Critical: SQL Injection</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>Line 3</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '11.5px', lineHeight: '1.6' }}>
              String interpolation in SQL queries allows injection attacks.
            </p>
            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 700 }}>FIX: </span>
              <span style={{ color: '#6ee7b7', fontSize: '11px', fontFamily: 'monospace' }}>cursor.execute("...WHERE username=?", (username,))</span>
            </div>
          </div>
        )}

        {/* Score badges */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          {[
            { label: 'Security', score: 24, color: '#f43f5e' },
            { label: 'Quality', score: 72, color: '#f59e0b' },
            { label: 'Performance', score: 88, color: '#10b981' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '5px 12px', borderRadius: '999px',
              background: `rgba(${s.color === '#f43f5e' ? '244,63,94' : s.color === '#f59e0b' ? '245,158,11' : '16,185,129'}, 0.1)`,
              border: `1px solid ${s.color}33`,
              fontSize: '11px', fontWeight: 700, color: s.color,
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              <span style={{ color: '#475569' }}>{s.label}:</span> {s.score}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Main Landing Component ----
export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const checkAuth = async () => {
      try {
        const res = await axios.post(`${backendURL}/api/tokengetter`, null, { withCredentials: true });
        setToken(!!res.data.success);
      } catch {
        setToken(false);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${backendURL}/api/logout`, null, { withCredentials: true });
      setToken(false);
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const features = [
    { icon: Brain, title: "AI-Powered Analysis", desc: "Gemini AI examines your code for bugs, security holes, and performance bottlenecks with 10+ years of expert knowledge.", color: "99,102,241", delay: 0.05 },
    { icon: Shield, title: "Security Scanning", desc: "Detect SQL injection, XSS, CSRF, buffer overflows, and 50+ other vulnerability types before they hit production.", color: "16,185,129", delay: 0.1 },
    { icon: Zap, title: "Performance Boost", desc: "Identify memory leaks, O(n²) loops, redundant DB queries, and get optimized refactored code automatically.", color: "245,158,11", delay: 0.15 },
    { icon: FileCode2, title: "Refactored Code", desc: "Get a complete, production-ready, refactored version of your code with all improvements applied instantly.", color: "34,211,238", delay: 0.2 },
    { icon: CheckCircle, title: "Test Generation", desc: "Auto-generate comprehensive unit test suites using Jest, pytest, JUnit, and more for your fixed code.", color: "168,85,247", delay: 0.25 },
    { icon: MessageSquare, title: "Interactive Chat", desc: "Ask follow-up questions about the review, get explanations, and refine the solution in a real-time conversation.", color: "244,63,94", delay: 0.3 },
  ];

  const stats = [
    { value: "50K+", label: "Developers", color: "99,102,241" },
    { value: "2.4M+", label: "Reviews Done", color: "16,185,129" },
    { value: "73%", label: "Bug Reduction", color: "245,158,11" },
    { value: "99.9%", label: "Accuracy", color: "34,211,238" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson", role: "Senior Developer @ TechCorp",
      review: "AIReviewer transformed our code quality overnight. The security scanning alone caught 12 critical SQL injection vulnerabilities in our legacy codebase that our team missed.",
      delay: 0.05
    },
    {
      name: "Michael Chen", role: "Lead Engineer @ StartupX",
      review: "The interactive chat is incredible. I ask it to explain why a fix works, and it teaches me best practices. It's like having a senior engineer pair-program with me 24/7.",
      delay: 0.1
    },
    {
      name: "Priya Patel", role: "CTO @ DevScale",
      review: "We integrated this into our CI/CD pipeline and reduced production bugs by 73%. The ROI is insane. Every team should use this before deploying anything.",
      delay: 0.15
    },
  ];

  const pricingPlans = [
    {
      plan: "Starter", price: "Free",
      features: [
        { text: "50 reviews / month", included: true },
        { text: "All focus modes", included: true },
        { text: "Code history (7 days)", included: true },
        { text: "Interactive chat", included: false },
        { text: "Test generation", included: false },
        { text: "Team workspace", included: false },
      ]
    },
    {
      plan: "Pro", price: "$19", popular: true,
      features: [
        { text: "Unlimited reviews", included: true },
        { text: "All focus modes", included: true },
        { text: "Unlimited history", included: true },
        { text: "Interactive chat", included: true },
        { text: "Test generation", included: true },
        { text: "Priority AI model", included: true },
      ]
    },
    {
      plan: "Team", price: "$49",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Team workspace", included: true },
        { text: "Shared review history", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "API access", included: true },
        { text: "Priority support", included: true },
      ]
    },
  ];

  const howItWorks = [
    { step: "01", icon: FileCode2, title: "Paste Your Code", desc: "Drop your code snippet or drag & drop a file. Supports 40+ languages including JS, Python, Java, Go, Rust." },
    { step: "02", icon: Cpu, title: "Set Review Focus", desc: "Choose Security Audit, Performance Boost, Clean & Refactor, or Test Generation. Gemini AI adapts accordingly." },
    { step: "03", icon: Sparkles, title: "Get AI Review", desc: "Receive a structured report: quality scores, issues list, refactored code, and generated test suite." },
    { step: "04", icon: MessageSquare, title: "Refine with Chat", desc: "Ask follow-up questions, request clarifications, and iterate on the solution in real time." },
  ];

  if (loadingAuth) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#05070f', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.2)',
          borderTop: '3px solid #6366f1',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#475569', fontSize: '14px' }}>Initializing...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05070f', position: 'relative' }}>
      <BackgroundOrbs />
      <Navbar isScrolled={isScrolled} token={token} handleLogout={handleLogout} navigate={navigate} />

      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px',
        textAlign: 'center'
      }}>
        {/* Hero gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div className="badge badge-primary animate-fade-in" style={{ marginBottom: '24px' }}>
            <Sparkles size={12} /> Powered by Gemini 2.0 Flash AI
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in stagger-1" style={{
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em',
            color: '#f1f5f9', marginBottom: '24px'
          }}>
            Review Code with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a855f7 70%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              AI Precision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in stagger-2" style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#64748b',
            lineHeight: 1.7, maxWidth: '650px', margin: '0 auto 40px'
          }}>
            Paste any code and instantly get a comprehensive AI review — security scores, bug detection, refactored code, test cases, and an interactive chat with our Gemini-powered expert.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in stagger-3" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            <button onClick={() => navigate(token ? '/try' : '/register')} className="btn-primary" style={{ padding: '14px 30px', fontSize: '16px', borderRadius: '12px' }}>
              <Play size={16} fill="white" /> Start Reviewing Free
            </button>
            <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="btn-ghost" style={{ padding: '14px 30px', fontSize: '16px', borderRadius: '12px' }}>
              See How It Works <ChevronDown size={16} />
            </button>
          </div>

          {/* Code Mockup */}
          <div className="animate-fade-in stagger-4" style={{ maxWidth: '680px', margin: '0 auto' }}>
            <CodeMockup />
          </div>

          {/* Social proof */}
          <div className="animate-fade-in stagger-5" style={{
            marginTop: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '24px', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>
                {['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'].map((c, i) => (
                  <div key={i} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c}, #1e1b4b)`,
                    border: '2px solid #05070f',
                    marginLeft: i === 0 ? 0 : '-8px'
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>50K+ developers trust us</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '4px' }}>4.9 / 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {stats.map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="badge badge-primary" style={{ marginBottom: '16px' }}>
              <Layers size={12} /> Core Features
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Everything a Senior Dev{' '}
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>Would Catch</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              From security vulnerabilities to performance bottlenecks — our AI covers everything in seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="badge badge-primary" style={{ marginBottom: '16px' }}>
              <GitMerge size={12} /> Workflow
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Get Reviews in{' '}
              <span style={{ background: 'linear-gradient(135deg, #10b981, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                4 Simple Steps
              </span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {howItWorks.map((step, i) => (
              <div key={i} className="glass animate-fade-in" style={{
                padding: '28px', borderRadius: '16px', animationDelay: `${i * 0.08}s`,
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  fontSize: '48px', fontWeight: 900, color: 'rgba(99,102,241,0.06)',
                  letterSpacing: '-0.05em', lineHeight: 1
                }}>
                  {step.step}
                </div>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  <step.icon size={20} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="badge badge-primary" style={{ marginBottom: '16px' }}>
              <Users size={12} /> Trusted By Devs
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Loved by{' '}
              <span style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Developers
              </span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="badge badge-primary" style={{ marginBottom: '16px' }}>
              <Award size={12} /> Simple Pricing
            </div>
            <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Start Free,{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Scale as You Grow
              </span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>No hidden fees. Cancel anytime. 14-day free trial on Pro.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {pricingPlans.map((p, i) => <PricingCard key={i} {...p} navigate={navigate} />)}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '60px 40px', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border: '1px solid rgba(99,102,241,0.25)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 60px rgba(99,102,241,0.1)'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', boxShadow: '0 0 30px rgba(99,102,241,0.4)'
            }}>
              <Code2 size={28} color="white" />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
              Ready to Write Better Code?
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
              Join 50,000+ developers who ship higher-quality, more secure code every day with AI-powered reviews.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate(token ? '/try' : '/register')} className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px' }}>
                Start For Free <ArrowRight size={16} />
              </button>
              {!token && (
                <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px' }}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Code2 size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#64748b' }}>
              AI<span style={{ color: '#6366f1' }}>Reviewer</span>
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#334155' }}>
            © 2026 AIReviewer. Built with ❤️ by Suraj Sharma
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { icon: Github, href: 'https://github.com/surajpsharma/ai-code-reviewer' },
              { icon: Mail, href: 'mailto:surajsharma030805@gmail.com' },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" style={{
                color: '#334155', transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.color = '#334155'}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
