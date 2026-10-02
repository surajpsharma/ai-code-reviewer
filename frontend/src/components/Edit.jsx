// Edit.jsx — Premium AI Code Review Workspace
import { useEffect, useState, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Code2, Shield, Zap, Sparkles, Cpu, FileText,
  CheckCircle, AlertTriangle, Info, Copy, Trash2,
  Download, LogOut, Send, ChevronLeft, ChevronRight,
  User, Loader2, FileCode2, Check, Plus, History,
  MessageSquare, BarChart3, TestTube, Wrench, X,
  Moon, Sun, TrendingUp, Award, Brain
} from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

// ---- Language options ----
const LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "php", label: "PHP" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
];

// ---- Focus Modes ----
const FOCUS_MODES = [
  { value: "general", label: "General Review", icon: BarChart3, color: "#818cf8" },
  { value: "security", label: "Security Audit", icon: Shield, color: "#34d399" },
  { value: "performance", label: "Performance", icon: Zap, color: "#fbbf24" },
  { value: "clean", label: "Clean & Refactor", icon: Sparkles, color: "#c084fc" },
  { value: "tests", label: "Test Generator", icon: TestTube, color: "#f87171" },
];

// ---- Score Gauge SVG ----
const ScoreGauge = ({ score, label, color }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
          <circle
            cx="40" cy="40" r={radius}
            stroke={color} strokeWidth="6" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{score}</div>
        </div>
      </div>
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
    </div>
  );
};

// ---- Progress Bar ----
const MetricBar = ({ label, score, color, icon: Icon }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
        <Icon size={13} color={color} />{label}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 800, color: '#f1f5f9' }}>{score}%</span>
    </div>
    <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${score}%`, borderRadius: '999px',
        background: `linear-gradient(90deg, ${color}80, ${color})`,
        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 8px ${color}50`
      }} />
    </div>
  </div>
);

// ---- Issue Severity ----
const getSeverityConfig = (sev) => {
  switch (sev?.toLowerCase()) {
    case "critical":
      return { bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.25)', color: '#f43f5e', icon: <AlertTriangle size={14} color="#f43f5e" /> };
    case "warning":
      return { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b', icon: <AlertTriangle size={14} color="#f59e0b" /> };
    default:
      return { bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.25)', color: '#22d3ee', icon: <Info size={14} color="#22d3ee" /> };
  }
};

// ---- Empty State ----
const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', textAlign: 'center',
    padding: '40px 20px'
  }}>
    <div style={{
      width: '72px', height: '72px', borderRadius: '20px',
      background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '20px', animation: 'float 3s ease-in-out infinite'
    }}>
      <Icon size={30} color="rgba(99,102,241,0.6)" />
    </div>
    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{title}</h3>
    <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, maxWidth: '280px', marginBottom: action ? '20px' : 0 }}>{desc}</p>
    {action}
  </div>
);

// ---- Main Edit Component ----
export default function Edit() {
  const [code, setCode] = useState(
    '// Welcome to AI Code Reviewer 🚀\n// Paste your code here or drag & drop a file\n\nfunction example() {\n  const data = fetch("/api/users?id=" + userId); // potential injection\n  return data;\n}'
  );
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(-1);
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [reviewFocus, setReviewFocus] = useState("general");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dragging, setDragging] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFixed, setCopiedFixed] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const chatEndRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Parse review JSON
  let parsedReview = null;
  let isJsonReview = false;
  try {
    if (review && typeof review === "object") {
      parsedReview = review; isJsonReview = true;
    } else if (review && typeof review === "string" && review.trim().startsWith("{")) {
      parsedReview = JSON.parse(review); isJsonReview = true;
    }
  } catch (e) { isJsonReview = false; }

  // Fetch review history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/get-review-history`, { withCredentials: true });
        setReviewHistory(res.data);
      } catch (e) { console.error(e); }
    };
    fetchHistory();
  }, [review]);

  // Fetch user info
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch(`${backendURL}/api/tokengetter`, { method: "POST", credentials: "include" });
        const data = await res.json();
        if (data.success) setUserInfo(data.decode);
      } catch (e) { console.error(e); }
    };
    getUserInfo();
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Show notification
  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Review code
  const reviewCode = async () => {
    if (!code.trim()) { showNotif("Please enter some code to review.", "error"); return; }
    setLoading(true);
    setChatMessages([]);
    setActiveTab("dashboard");
    try {
      const res = await axios.post(`${backendURL}/api/get-review`, { code, language: selectedLanguage, focus: reviewFocus }, { withCredentials: true });
      setReview(res.data);
      await axios.post(`${backendURL}/api/save-review-history`, { code, review: res.data, language: res.data.language || selectedLanguage || "auto" }, { withCredentials: true });
      showNotif("Review complete!");
    } catch (error) {
      if (error.response?.status === 401) { logout(); navigate("/login"); }
      else { showNotif(error.response?.data?.message || "Failed to get review.", "error"); }
    } finally {
      setLoading(false);
    }
  };

  // Chat message
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading || !review) return;
    const userText = chatInput;
    setChatInput("");
    const updatedMessages = [...chatMessages, { role: "user", text: userText }];
    setChatMessages(updatedMessages);
    setChatLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/chat-review`, { code, reviewContext: parsedReview || review, messages: updatedMessages }, { withCredentials: true });
      if (res.data?.response) {
        setChatMessages(prev => [...prev, { role: "model", text: res.data.response }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "model", text: "⚠️ Error sending message. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Clear editor
  const clearCode = () => {
    setCode("");
    setReview(null);
    setChatMessages([]);
    setCurrentReviewIndex(-1);
  };

  // Copy utility
  const copyText = (text, setFlag) => {
    navigator.clipboard.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), 2000);
    showNotif("Copied to clipboard!");
  };

  // Download report
  const downloadReview = () => {
    if (!review) return;
    const content = typeof review === "object" ? JSON.stringify(review, null, 2) : review;
    const blob = new Blob([`# AI Code Review Report\n\n## Code\n\`\`\`\n${code}\n\`\`\`\n\n## Review\n${content}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `review-${Date.now()}.md`; a.click();
    URL.revokeObjectURL(url);
    showNotif("Report downloaded!");
  };

  // Load history
  const loadHistoryItem = (item, index) => {
    setCode(item.code);
    setReview(item.review);
    setChatMessages([]);
    setCurrentReviewIndex(index);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Delete history
  const deleteHistoryItem = async (id, index) => {
    try {
      await axios.delete(`${backendURL}/api/delete-review-history/${id}`, { withCredentials: true });
      const updated = reviewHistory.filter((_, i) => i !== index);
      setReviewHistory(updated);
      if (currentReviewIndex === index) { setCurrentReviewIndex(-1); setReview(null); setChatMessages([]); }
      else if (currentReviewIndex > index) setCurrentReviewIndex(currentReviewIndex - 1);
      showNotif("History item deleted.");
    } catch (e) { showNotif("Failed to delete.", "error"); }
  };

  // Logout
  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate("/");
  };

  // Drag & Drop
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target.result);
      const ext = file.name.split(".").pop().toLowerCase();
      const map = { py: "python", js: "javascript", ts: "typescript", tsx: "typescript", java: "java", cpp: "cpp", cc: "cpp", h: "cpp", go: "go", rs: "rust", html: "html", css: "css", rb: "ruby", php: "php", cs: "csharp", kt: "kotlin", swift: "swift" };
      setSelectedLanguage(map[ext] || "auto");
      showNotif(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  };

  // Review tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "issues", label: "Issues", icon: AlertTriangle },
    { id: "diff", label: "Fixed Code", icon: Wrench },
    { id: "tests", label: "Test Suite", icon: TestTube },
    { id: "chat", label: "Ask AI", icon: MessageSquare },
  ];

  const scoreColors = {
    quality: '#818cf8',
    security: '#34d399',
    performance: '#fbbf24',
    readability: '#c084fc'
  };

  const userInitial = userInfo?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: '#05070f', color: '#f1f5f9', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="animate-fade-in" style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 200,
          padding: '12px 20px', borderRadius: '12px',
          background: notification.type === 'error' ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
          border: `1px solid ${notification.type === 'error' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
          color: notification.type === 'error' ? '#fb7185' : '#34d399',
          fontSize: '13px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '8px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          {notification.type === 'error' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
          {notification.msg}
        </div>
      )}

      {/* ===== HEADER ===== */}
      <header style={{
        position: 'relative', zIndex: 50, height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        background: 'rgba(5,7,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 20px rgba(0,0,0,0.3)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b'; }}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99,102,241,0.35)'
            }}>
              <Code2 size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1 }}>AI Reviewer</div>
              <div style={{ fontSize: '10px', color: '#334155', fontWeight: 500, lineHeight: 1, marginTop: '2px' }}>Powered by Gemini 2.0</div>
            </div>
          </div>
        </div>

        {/* Header right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800, color: 'white'
              }}>
                {userInitial}
              </div>
              <span style={{ display: 'none' }} className="md-show">{userInfo?.name || "Developer"}</span>
            </button>

            {showUserMenu && (
              <div className="animate-fade-in" style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: '220px', borderRadius: '14px',
                background: 'rgba(10,13,26,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)', zIndex: 100, overflow: 'hidden'
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{userInfo?.name || "Developer"}</div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>{userInfo?.email || "guest@local"}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '12px 16px', textAlign: 'left',
                    background: 'none', color: '#f43f5e', fontSize: '13px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN WORKSPACE ===== */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* ===== SIDEBAR ===== */}
        {sidebarOpen && (
          <aside style={{
            width: '280px', flexShrink: 0,
            background: 'rgba(5,7,15,0.8)', backdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', zIndex: 20
          }}>
            {/* Sidebar header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <History size={12} /> Review History
                </div>
                <span style={{
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                  color: '#818cf8', fontSize: '10px', fontWeight: 700,
                  padding: '2px 8px', borderRadius: '999px'
                }}>
                  {reviewHistory.length}
                </span>
              </div>
              <button
                onClick={clearCode}
                style={{
                  width: '100%', padding: '9px 12px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: 'white', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  cursor: 'pointer', border: 'none', transition: 'opacity 0.2s',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Plus size={13} /> New Review
              </button>
            </div>

            {/* History list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {reviewHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#334155' }}>
                  <FileCode2 size={32} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                  <p style={{ fontSize: '12px' }}>No reviews yet</p>
                  <p style={{ fontSize: '11px', marginTop: '4px', color: '#1e293b' }}>Start coding above</p>
                </div>
              ) : (
                reviewHistory.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px', borderRadius: '10px', marginBottom: '6px',
                      border: `1px solid ${currentReviewIndex === index ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.05)'}`,
                      background: currentReviewIndex === index ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      position: 'relative', overflow: 'hidden'
                    }}
                    onClick={() => loadHistoryItem(item, index)}
                    onMouseEnter={e => { if (currentReviewIndex !== index) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
                    onMouseLeave={e => { if (currentReviewIndex !== index) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; } }}
                  >
                    {/* Language badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px',
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                        color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em'
                      }}>
                        {item.language || 'auto'}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); deleteHistoryItem(item.id, index); }}
                        style={{
                          width: '22px', height: '22px', borderRadius: '6px',
                          background: 'none', color: '#334155',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s', border: 'none'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#334155'; }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                    <p style={{
                      fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
                      color: currentReviewIndex === index ? '#94a3b8' : '#475569',
                      marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {item.code.split("\n")[0] || "Empty snippet"}
                    </p>
                    <p style={{ fontSize: '10px', color: '#1e293b' }}>
                      {new Date(item.timestamp).toLocaleDateString() || item.timestamp}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px', gap: '12px' }}>

          {/* Top: Focus + Language controls */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
            padding: '10px 14px', borderRadius: '12px',
            background: 'rgba(5,7,15,0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0
          }}>
            {/* Language select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Language</span>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94a3b8', borderRadius: '8px', padding: '5px 10px',
                  fontSize: '12px', fontFamily: 'inherit', outline: 'none', cursor: 'pointer'
                }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value} style={{ background: '#0a0d1a' }}>{l.label}</option>
                ))}
              </select>
            </div>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Focus mode tabs */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {FOCUS_MODES.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => setReviewFocus(mode.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    background: reviewFocus === mode.value ? `rgba(${mode.color.includes('#818') ? '129,140,248' : mode.color.includes('#34') ? '52,211,153' : mode.color.includes('#fb') ? '251,191,36' : mode.color.includes('#c0') ? '192,132,252' : '248,113,113'}, 0.12)` : 'rgba(255,255,255,0.03)',
                    color: reviewFocus === mode.value ? mode.color : '#475569',
                    border: `1px solid ${reviewFocus === mode.value ? `${mode.color}40` : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <mode.icon size={11} /> {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code editor + Review panels */}
          <div style={{ flex: 1, display: 'flex', gap: '12px', overflow: 'hidden', minHeight: 0 }}>

            {/* ===== LEFT: Code Editor ===== */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              borderRadius: '14px', overflow: 'hidden',
              background: 'rgba(5,7,15,0.7)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
            }}>
              {/* Editor toolbar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(5,7,15,0.5)', flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCode2 size={13} color="#475569" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Code Editor</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => copyText(code, setCopiedCode)}
                    data-tooltip="Copy Code"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: copiedCode ? '#34d399' : '#475569', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = copiedCode ? '#34d399' : '#475569'; }}
                  >
                    {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <button
                    onClick={clearCode}
                    data-tooltip="Clear Editor"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#475569', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Editor area with drag/drop */}
              <div
                style={{
                  flex: 1, overflow: 'auto', position: 'relative',
                  background: dragging ? 'rgba(99,102,241,0.06)' : 'transparent',
                  borderRadius: dragging ? '0 0 14px 14px' : '0',
                  border: dragging ? '2px dashed rgba(99,102,241,0.4)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {dragging && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(5,7,15,0.85)', zIndex: 10, pointerEvents: 'none'
                  }}>
                    <FileCode2 size={40} color="rgba(99,102,241,0.7)" style={{ marginBottom: '12px', animation: 'float 1.5s ease-in-out infinite' }} />
                    <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '15px' }}>Drop your file</p>
                    <p style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>JS, TS, PY, JAVA, GO, RS, C++...</p>
                  </div>
                )}
                <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={c => prism.highlight(c, prism.languages[selectedLanguage !== 'auto' ? selectedLanguage : 'javascript'] || prism.languages.javascript, selectedLanguage !== 'auto' ? selectedLanguage : 'javascript')}
                  padding={16}
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: '13.5px', lineHeight: 1.7, minHeight: '100%',
                    backgroundColor: 'transparent', color: '#cbd5e1'
                  }}
                  placeholder="Paste your code here, or drag & drop a file..."
                />
              </div>

              {/* Review button */}
              <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,7,15,0.5)', flexShrink: 0 }}>
                <button
                  onClick={reviewCode}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px',
                    background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #4f46e5, #6366f1, #8b5cf6)',
                    color: 'white', borderRadius: '11px', fontWeight: 800, fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: loading ? 'none' : '0 6px 24px rgba(99,102,241,0.35)',
                    letterSpacing: '-0.01em'
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(99,102,241,0.45)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 24px rgba(99,102,241,0.35)'; }}
                >
                  {loading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing with Gemini AI...</>
                  ) : (
                    <><Sparkles size={16} /> Analyze Code Quality</>
                  )}
                </button>
              </div>
            </div>

            {/* ===== RIGHT: Review Panel ===== */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              borderRadius: '14px', overflow: 'hidden',
              background: 'rgba(5,7,15,0.7)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
            }}>

              {/* Tabs header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(5,7,15,0.5)', flexShrink: 0, minHeight: '48px'
              }}>
                {review && isJsonReview ? (
                  <div style={{ display: 'flex', gap: '2px', overflowX: 'auto', padding: '6px 0' }}>
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                          background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                          color: activeTab === tab.id ? '#818cf8' : '#475569',
                          border: `1px solid ${activeTab === tab.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                          cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                        }}
                      >
                        <tab.icon size={12} /> {tab.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                    <Sparkles size={13} /> AI Diagnostics Hub
                  </div>
                )}

                {/* Download button */}
                {review && (
                  <button
                    onClick={downloadReview}
                    data-tooltip="Download Report"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#475569', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <Download size={13} />
                  </button>
                )}
              </div>

              {/* Review content area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {!review ? (
                  <EmptyState
                    icon={Sparkles}
                    title="Awaiting Code Review"
                    desc="Paste your code in the editor, choose a review focus, and hit 'Analyze Code Quality' to get started."
                  />
                ) : isJsonReview ? (
                  <div className="animate-fade-in">

                    {/* TAB: DASHBOARD */}
                    {activeTab === "dashboard" && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Score gauges */}
                        <div style={{
                          padding: '20px', borderRadius: '14px',
                          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                            <BarChart3 size={14} color="#6366f1" />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quality Scores</span>
                            {parsedReview.language && (
                              <span style={{
                                marginLeft: 'auto', padding: '2px 10px', borderRadius: '999px',
                                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                                color: '#818cf8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase'
                              }}>{parsedReview.language}</span>
                            )}
                          </div>

                          {/* Score gauges row */}
                          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                            {parsedReview.scores && Object.entries(parsedReview.scores).map(([key, val]) => (
                              <ScoreGauge key={key} score={val} label={key} color={scoreColors[key] || '#818cf8'} />
                            ))}
                          </div>

                          {/* Metric bars */}
                          {parsedReview.scores && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {[
                                { label: 'Security Health', score: parsedReview.scores.security, color: '#34d399', icon: Shield },
                                { label: 'Performance', score: parsedReview.scores.performance, color: '#fbbf24', icon: Zap },
                                { label: 'Readability', score: parsedReview.scores.readability, color: '#c084fc', icon: FileText },
                              ].map(bar => <MetricBar key={bar.label} {...bar} />)}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        {parsedReview.summary && (
                          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                              <Brain size={13} color="#818cf8" />
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Summary</span>
                            </div>
                            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.75 }}>{parsedReview.summary}</p>
                          </div>
                        )}

                        {/* Improvements */}
                        {parsedReview.improvements?.length > 0 && (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                              <TrendingUp size={13} color="#34d399" />
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Key Improvements</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {parsedReview.improvements.map((item, i) => (
                                <div key={i} style={{
                                  display: 'flex', gap: '10px', padding: '10px 12px',
                                  background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.12)',
                                  borderRadius: '10px', alignItems: 'flex-start'
                                }}>
                                  <CheckCircle size={14} color="#34d399" style={{ flexShrink: 0, marginTop: '1px' }} />
                                  <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: ISSUES */}
                    {activeTab === "issues" && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                          <AlertTriangle size={13} color="#818cf8" />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Vulnerabilities & Suggestions
                          </span>
                          <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '999px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', fontSize: '10px', fontWeight: 700 }}>
                            {parsedReview.issues?.length || 0} issues
                          </span>
                        </div>

                        {(!parsedReview.issues || parsedReview.issues.length === 0) ? (
                          <EmptyState
                            icon={CheckCircle}
                            title="No Issues Found!"
                            desc="Your code is clean. No critical vulnerabilities or warnings detected."
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {parsedReview.issues.map((issue, idx) => {
                              const cfg = getSeverityConfig(issue.severity);
                              return (
                                <div key={idx} style={{
                                  padding: '14px 16px', borderRadius: '12px',
                                  background: cfg.bg, border: `1px solid ${cfg.border}`
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {cfg.icon}
                                      <span style={{ fontSize: '13px', fontWeight: 700, color: cfg.color }}>{issue.title}</span>
                                    </div>
                                    {issue.line > 0 && (
                                      <span style={{
                                        padding: '2px 8px', borderRadius: '6px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: '#475569', fontSize: '10px', fontWeight: 700, flexShrink: 0
                                      }}>
                                        Line {issue.line}
                                      </span>
                                    )}
                                  </div>
                                  <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.7, marginBottom: issue.fix ? '10px' : 0 }}>
                                    {issue.description}
                                  </p>
                                  {issue.fix && (
                                    <div style={{
                                      padding: '10px 12px', borderRadius: '8px',
                                      background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)'
                                    }}>
                                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#34d399', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        ✅ Fix
                                      </span>
                                      <code style={{ fontSize: '11.5px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
                                        {issue.fix}
                                      </code>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: FIXED CODE */}
                    {activeTab === "diff" && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Wrench size={13} color="#818cf8" />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              AI Refactored Code
                            </span>
                          </div>
                          <button
                            onClick={() => copyText(parsedReview.fixedCode, setCopiedFixed)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px',
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              color: copiedFixed ? '#34d399' : '#475569', fontSize: '12px', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s'
                            }}
                          >
                            {copiedFixed ? <Check size={12} /> : <Copy size={12} />}
                            {copiedFixed ? 'Copied!' : 'Copy Code'}
                          </button>
                        </div>
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{
                            padding: '8px 14px', background: 'rgba(52,211,153,0.06)',
                            borderBottom: '1px solid rgba(52,211,153,0.12)',
                            fontSize: '10px', fontWeight: 800, color: '#34d399',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                            <CheckCircle size={10} /> Optimized & Refactored
                          </div>
                          <pre style={{
                            padding: '16px', overflowX: 'auto', margin: 0,
                            fontFamily: "'JetBrains Mono', monospace", fontSize: '12.5px',
                            lineHeight: 1.7, color: '#94a3b8',
                            background: 'rgba(0,0,0,0.4)', maxHeight: '500px', overflowY: 'auto'
                          }}>
                            <code>{parsedReview.fixedCode}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* TAB: TEST SUITE */}
                    {activeTab === "tests" && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TestTube size={13} color="#818cf8" />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Generated Test Suite
                            </span>
                          </div>
                          <button
                            onClick={() => copyText(parsedReview.testCases, setCopiedFixed)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px',
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              color: copiedFixed ? '#34d399' : '#475569', fontSize: '12px', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s'
                            }}
                          >
                            {copiedFixed ? <Check size={12} /> : <Copy size={12} />}
                            Copy Tests
                          </button>
                        </div>
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{
                            padding: '8px 14px', background: 'rgba(99,102,241,0.06)',
                            borderBottom: '1px solid rgba(99,102,241,0.12)',
                            fontSize: '10px', fontWeight: 800, color: '#818cf8',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                            <TestTube size={10} /> Complete Test Coverage
                          </div>
                          <pre style={{
                            padding: '16px', overflowX: 'auto', margin: 0,
                            fontFamily: "'JetBrains Mono', monospace", fontSize: '12.5px',
                            lineHeight: 1.7, color: '#94a3b8',
                            background: 'rgba(0,0,0,0.4)', maxHeight: '500px', overflowY: 'auto'
                          }}>
                            <code>{parsedReview.testCases}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* TAB: CHAT */}
                    {activeTab === "chat" && (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {chatMessages.length === 0 ? (
                          <EmptyState
                            icon={MessageSquare}
                            title="Ask about this review"
                            desc="Have questions about the review? Ask the AI reviewer anything about the code, issues, or suggested fixes."
                          />
                        ) : (
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {chatMessages.map((msg, idx) => (
                              <div key={idx} style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '88%',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                              }}>
                                <span style={{
                                  fontSize: '9px', color: '#334155', fontWeight: 700,
                                  textTransform: 'uppercase', letterSpacing: '0.08em',
                                  marginBottom: '4px', paddingLeft: '4px', paddingRight: '4px'
                                }}>
                                  {msg.role === 'user' ? 'You' : '🤖 AI Reviewer'}
                                </span>
                                <div style={{
                                  padding: '10px 14px', borderRadius: '12px',
                                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                                  borderBottomLeftRadius: msg.role === 'user' ? '12px' : '4px',
                                  background: msg.role === 'user' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                                  fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7
                                }}>
                                  {msg.role === 'user' ? (
                                    <p style={{ margin: 0 }}>{msg.text}</p>
                                  ) : (
                                    <div className="prose-dark" style={{ fontSize: '13px' }}>
                                      <Markdown rehypePlugins={[rehypeHighlight]}>{msg.text}</Markdown>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {chatLoading && (
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '4px',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                                width: 'fit-content', maxWidth: '70%'
                              }}>
                                <Loader2 size={13} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                                <span style={{ fontSize: '12px', color: '#475569' }}>Gemini is thinking...</span>
                              </div>
                            )}
                            <div ref={chatEndRef} />
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  // Fallback: raw markdown review
                  <div className="prose-dark animate-fade-in">
                    <Markdown rehypePlugins={[rehypeHighlight]}>{typeof review === 'string' ? review : JSON.stringify(review, null, 2)}</Markdown>
                  </div>
                )}
              </div>

              {/* Chat input (only when review exists and on chat tab or messages exist) */}
              {review && (
                <div style={{
                  padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(5,7,15,0.5)', flexShrink: 0
                }}>
                  <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Ask follow-up questions about this review..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      disabled={chatLoading}
                      style={{
                        flex: 1, padding: '10px 14px',
                        background: 'rgba(5,7,15,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px', color: '#f1f5f9', fontSize: '13px', fontFamily: 'inherit',
                        outline: 'none', transition: 'border-color 0.2s'
                      }}
                      onFocus={e => {
                        setActiveTab('chat');
                        e.target.style.borderColor = 'rgba(99,102,241,0.5)';
                      }}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: chatInput.trim() && !chatLoading ? 'white' : '#334155',
                        cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s', flexShrink: 0
                      }}
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}
