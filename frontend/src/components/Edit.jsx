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
  Code,
  Shield,
  Zap,
  Sparkles,
  Cpu,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  Trash2,
  Download,
  LogOut,
  Send,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  FileCode,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Check,
  Plus,
  History
} from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function Edit() {
  const [code, setCode] = useState(
    '// Welcome to AI Code Reviewer\nfunction example() {\n  console.log("Hello, World!");\n}'
  );
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(-1);

  // New features state
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [reviewFocus, setReviewFocus] = useState("general");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dragging, setDragging] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFixedCode, setCopiedFixedCode] = useState(false);
  
  // Follow-up Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  
  const chatEndRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Parse review if it is stored as JSON or stringified JSON
  let parsedReview = null;
  let isJsonReview = false;
  try {
    if (review && typeof review === "object") {
      parsedReview = review;
      isJsonReview = true;
    } else if (review && typeof review === "string" && review.trim().startsWith("{")) {
      parsedReview = JSON.parse(review);
      isJsonReview = true;
    }
  } catch (e) {
    isJsonReview = false;
  }

  useEffect(() => {
    const fetchReviewHistory = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/get-review-history`,
          {
            withCredentials: true,
          }
        );
        setReviewHistory(response.data);
      } catch (error) {
        console.error("Error fetching review history:", error);
      }
    };
    fetchReviewHistory();
  }, [userInfo, review]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(`${backendURL}/api/tokengetter`, {
          method: "POST",
          credentials: "include",
        });
        const getRes = await response.json();
        if (getRes.success === true) {
          setUserInfo(getRes.decode);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    // Scroll chat to bottom when message log changes
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const reviewCode = async () => {
    if (!code.trim()) {
      alert("⚠️ Please enter some code to review.");
      return;
    }

    setLoading(true);
    setChatMessages([]); // Reset chat log on new review
    setActiveTab("dashboard");
    try {
      const reviewResponse = await axios.post(
        `${backendURL}/api/get-review`,
        {
          code,
          language: selectedLanguage,
          focus: reviewFocus,
        },
        {
          withCredentials: true,
        }
      );

      const reviewData = reviewResponse.data;
      setReview(reviewData);

      // Save review to history
      await axios.post(
        `${backendURL}/api/save-review-history`,
        {
          code,
          review: reviewData,
          language: reviewData.language || selectedLanguage || "auto",
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error during code review:", error);
      if (error.response?.status === 401) {
        alert("Session expired or unauthorized. Please log in again.");
        logout();
      } else {
        const errorMsg = typeof error.response?.data === "string"
          ? error.response.data
          : (error.response?.data?.message || error.message);
        alert("Failed to get review: " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading || !review) return;

    const userText = chatInput;
    setChatInput("");
    
    // Add user message to log
    const updatedMessages = [...chatMessages, { role: "user", text: userText }];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/api/chat-review`,
        {
          code,
          reviewContext: parsedReview || review,
          messages: updatedMessages,
        },
        { withCredentials: true }
      );

      if (response.data?.response) {
        setChatMessages((prev) => [
          ...prev,
          { role: "model", text: response.data.response },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { role: "model", text: "⚠️ Error sending message. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setReview(null);
    setChatMessages([]);
    setCurrentReviewIndex(-1);
  };

  const copyCodeText = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const downloadReview = () => {
    if (!review) return;
    const reviewContent = typeof review === "object" ? JSON.stringify(review, null, 2) : review;
    const blob = new Blob(
      [
        `# Code Review Report\n\n## Original Code:\n\`\`\`javascript\n${code}\n\`\`\`\n\n## Review Result:\n${reviewContent}`,
      ],
      { type: "text/markdown" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-review-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadHistoryItem = (item, index) => {
    setCode(item.code);
    setReview(item.review);
    setChatMessages([]);
    setCurrentReviewIndex(index);
  };

  const deleteHistoryItem = async (historyId, index) => {
    try {
      const response = await axios.delete(
        `${backendURL}/api/delete-review-history/${historyId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const newHistory = reviewHistory.filter((_, i) => i !== index);
        setReviewHistory(newHistory);
        if (currentReviewIndex === index) {
          setCurrentReviewIndex(-1);
          setReview(null);
          setChatMessages([]);
          setCode(
            '// Welcome to AI Code Reviewer\nfunction example() {\n  console.log("Hello, World!");\n}'
          );
        } else if (currentReviewIndex > index) {
          setCurrentReviewIndex(currentReviewIndex - 1);
        }
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
    }
  };

  // Drag and Drop File Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode(event.target.result);
        const ext = file.name.split(".").pop().toLowerCase();
        if (ext === "py") setSelectedLanguage("python");
        else if (ext === "js") setSelectedLanguage("javascript");
        else if (ext === "ts" || ext === "tsx") setSelectedLanguage("typescript");
        else if (ext === "java") setSelectedLanguage("java");
        else if (ext === "cpp" || ext === "cc" || ext === "h") setSelectedLanguage("cpp");
        else if (ext === "go") setSelectedLanguage("go");
        else if (ext === "rs") setSelectedLanguage("rust");
        else if (ext === "html") setSelectedLanguage("html");
        else if (ext === "css") setSelectedLanguage("css");
        else setSelectedLanguage("auto");
      };
      reader.readAsText(file);
    }
  };

  // Score Gauge Calculation
  const renderScoreGauge = (score) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let scoreColor = "stroke-emerald-400";
    if (score < 50) scoreColor = "stroke-rose-500";
    else if (score < 80) scoreColor = "stroke-amber-400";

    return (
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${scoreColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-extrabold text-white">{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Quality</span>
        </div>
      </div>
    );
  };

  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        };
      case "warning":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-400",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        };
      default:
        return {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/30",
          text: "text-cyan-400",
          icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-200 overflow-hidden font-sans">
      {/* Background Neon Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <header className="h-16 flex justify-between items-center px-6 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-md z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">AI Code Reviewer</h1>
              <p className="text-xs text-gray-400">Smart Code Insights & Interactive Refactoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User profile details */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm text-gray-300"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                {userInfo?.name?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden md:inline font-medium">{userInfo?.name || "Developer"}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-white/5">
                  <p className="font-semibold text-white text-sm">{userInfo?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{userInfo?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-red-500/10 text-red-400 rounded-xl mt-1 text-sm transition"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar for History Log */}
        {sidebarOpen && (
          <aside className="w-80 border-r border-white/10 bg-[#0d1117]/60 backdrop-blur-sm flex flex-col z-20">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-bold tracking-wide uppercase text-gray-400 mb-3 flex items-center gap-2">
                <History className="w-4 h-4" /> Review History
              </h3>
              <button
                onClick={clearCode}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" /> New Review
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
              {reviewHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <FileCode className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-xs">No records yet</p>
                </div>
              ) : (
                reviewHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border cursor-pointer transition relative group ${
                      currentReviewIndex === index
                        ? "border-purple-500/60 bg-purple-500/5 text-white"
                        : "border-white/5 hover:border-white/20 bg-[#0d1117]/40 hover:bg-[#0d1117] text-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start" onClick={() => loadHistoryItem(item, index)}>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider text-purple-400">
                            {item.language}
                          </span>
                        </div>
                        <p className="text-xs font-mono truncate text-gray-400 mb-1">
                          {item.code.split("\n")[0] || "Empty Code snippet"}
                        </p>
                        <p className="text-[9px] text-gray-500">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(item.id, index);
                      }}
                      className="absolute right-3 top-3 p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition"
                      title="Delete History"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {/* Editor & AI split screen viewport */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
          
          {/* LEFT: Editor Frame */}
          <div className="flex-1 flex flex-col border border-white/10 rounded-2xl bg-[#0d1117]/50 backdrop-blur-md overflow-hidden relative shadow-2xl">
            {/* Editor Config bar */}
            <div className="flex flex-wrap items-center justify-between p-3 border-b border-white/10 bg-[#0d1117]/90 gap-2">
              <div className="flex items-center gap-3">
                {/* Language Select */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="auto" className="bg-[#0b0f19]">Auto-detect</option>
                    <option value="javascript" className="bg-[#0b0f19]">JavaScript</option>
                    <option value="typescript" className="bg-[#0b0f19]">TypeScript</option>
                    <option value="python" className="bg-[#0b0f19]">Python</option>
                    <option value="java" className="bg-[#0b0f19]">Java</option>
                    <option value="cpp" className="bg-[#0b0f19]">C++</option>
                    <option value="go" className="bg-[#0b0f19]">Go</option>
                    <option value="rust" className="bg-[#0b0f19]">Rust</option>
                    <option value="html" className="bg-[#0b0f19]">HTML</option>
                    <option value="css" className="bg-[#0b0f19]">CSS</option>
                  </select>
                </div>

                {/* Review Mode Focus */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Review Focus</label>
                  <select
                    value={reviewFocus}
                    onChange={(e) => setReviewFocus(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="general" className="bg-[#0b0f19]">General Quality</option>
                    <option value="security" className="bg-[#0b0f19]">🔐 Security Audit</option>
                    <option value="performance" className="bg-[#0b0f19]">⚡ Performance Booster</option>
                    <option value="clean" className="bg-[#0b0f19]">✨ Clean & Refactor</option>
                    <option value="tests" className="bg-[#0b0f19]">🧪 Test Cases Generator</option>
                  </select>
                </div>
              </div>

              {/* Copy / Clear buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyCodeText(code, setCopiedCode)}
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition text-gray-400"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearCode}
                  className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition"
                  title="Clear Editor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Core Code Editor Input */}
            <div
              className={`flex-1 overflow-auto relative p-4 transition-colors ${
                dragging ? "bg-purple-500/10 border-2 border-dashed border-purple-500" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {dragging && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]/80 pointer-events-none z-10">
                  <FileCode className="w-12 h-12 text-purple-400 animate-bounce mb-2" />
                  <p className="text-sm font-semibold text-white">Drop your source file here</p>
                  <p className="text-xs text-gray-400">We support JS, PY, TS, C++, Go, Java, Rust</p>
                </div>
              )}
              
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  prism.highlight(
                    code,
                    prism.languages[selectedLanguage === "auto" ? "javascript" : selectedLanguage] || prism.languages.javascript,
                    selectedLanguage === "auto" ? "javascript" : selectedLanguage
                  )
                }
                padding={12}
                className="font-mono text-sm leading-relaxed"
                style={{
                  fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
                  minHeight: "100%",
                  backgroundColor: "transparent"
                }}
                placeholder="Paste code or drag and drop a file here to review..."
              />
            </div>

            {/* Submit Action */}
            <div className="p-4 border-t border-white/10 bg-[#0d1117]/60">
              <button
                onClick={reviewCode}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Reviewing & Refactoring Code...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Code Quality
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: AI Review Hub & Follow-up Chat */}
          <div className="flex-1 flex flex-col border border-white/10 rounded-2xl bg-[#0d1117]/50 backdrop-blur-md overflow-hidden shadow-2xl relative">
            
            {/* Header Tabs */}
            <div className="flex justify-between items-center border-b border-white/10 bg-[#0d1117]/90 px-4">
              {review && isJsonReview ? (
                <div className="flex overflow-x-auto gap-1 py-2 custom-scrollbar">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: <Cpu className="w-3.5 h-3.5" /> },
                    { id: "issues", label: "Issues List", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                    { id: "diff", label: "Refactored Diff", icon: <FileText className="w-3.5 h-3.5" /> },
                    { id: "tests", label: "Unit Tests", icon: <CheckCircle className="w-3.5 h-3.5" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                        activeTab === tab.id
                          ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                          : "text-gray-400 hover:text-white border border-transparent hover:bg-white/5"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-3.5">
                  <h2 className="text-sm font-bold tracking-wide uppercase text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Diagnostics Hub
                  </h2>
                </div>
              )}

              {/* Action buttons */}
              {review && (
                <button
                  onClick={downloadReview}
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition"
                  title="Download Review Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* AI Review Pane Contents */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {!review ? (
                // Empty state
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-400 mb-4 animate-pulse">
                    <Sparkles className="w-10 h-10 opacity-40" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">Code review waiting</h3>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Pasted your code snippet? Set your focus mode and hit "Analyze Code" to populate this workspace.
                  </p>
                </div>
              ) : isJsonReview ? (
                // Structured JSON Review Dashboard
                <div>
                  
                  {/* TAB 1: DASHBOARD */}
                  {activeTab === "dashboard" && (
                    <div className="space-y-6">
                      {/* Top metrics card */}
                      <div className="p-5 rounded-2xl border border-white/5 bg-[#0d1117]/70 flex flex-col sm:flex-row items-center gap-6 shadow-md">
                        {renderScoreGauge(parsedReview.scores?.quality || 0)}
                        <div className="flex-1 space-y-4 w-full">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Metrics Breakdown</h3>
                          <div className="space-y-2.5">
                            {[
                              { label: "Security Health", score: parsedReview.scores?.security, color: "bg-emerald-500", icon: <Shield className="w-3.5 h-3.5 text-emerald-400" /> },
                              { label: "Performance", score: parsedReview.scores?.performance, color: "bg-indigo-500", icon: <Zap className="w-3.5 h-3.5 text-indigo-400" /> },
                              { label: "Readability", score: parsedReview.scores?.readability, color: "bg-purple-500", icon: <FileText className="w-3.5 h-3.5 text-purple-400" /> }
                            ].map((bar) => (
                              <div key={bar.label}>
                                <div className="flex justify-between items-center text-xs mb-1 font-semibold">
                                  <span className="flex items-center gap-1.5 text-gray-300">{bar.icon}{bar.label}</span>
                                  <span className="text-white">{bar.score}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${bar.color} transition-all duration-1000`}
                                    style={{ width: `${bar.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Analysis Summary</h4>
                        <div className="p-4 rounded-xl border border-white/5 bg-[#0d1117]/30 text-sm leading-relaxed text-gray-300">
                          {parsedReview.summary}
                        </div>
                      </div>

                      {/* Improvements Card */}
                      {parsedReview.improvements && parsedReview.improvements.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Key Optimizations Added</h4>
                          <ul className="grid grid-cols-1 gap-2">
                            {parsedReview.improvements.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-300">
                                <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ISSUES LIST */}
                  {activeTab === "issues" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Vulnerabilities & Suggestions</h3>
                      {(!parsedReview.issues || parsedReview.issues.length === 0) ? (
                        <div className="p-8 border border-white/5 bg-emerald-500/10 rounded-xl flex flex-col items-center justify-center text-center">
                          <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
                          <h4 className="font-semibold text-white text-sm">Perfect Score!</h4>
                          <p className="text-xs text-gray-400 mt-1">No critical issues or warnings found in this codebase.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {parsedReview.issues.map((issue, idx) => {
                            const config = getSeverityColor(issue.severity);
                            return (
                              <div key={idx} className={`p-4 border rounded-xl flex flex-col gap-2.5 ${config.bg} ${config.border}`}>
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {config.icon}
                                    <h4 className={`text-sm font-bold truncate ${config.text}`}>{issue.title}</h4>
                                  </div>
                                  {issue.line > 0 && (
                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 shrink-0">
                                      Line {issue.line}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed font-medium">{issue.description}</p>
                                {issue.fix && (
                                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] leading-relaxed text-slate-300">
                                    <span className="text-[10px] font-bold text-emerald-400 block mb-1">Recommended Correction:</span>
                                    {issue.fix}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: DIFF VIEW */}
                  {activeTab === "diff" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Refactored Code</h3>
                        <button
                          onClick={() => copyCodeText(parsedReview.fixedCode, setCopiedFixedCode)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 transition"
                        >
                          {copiedFixedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Copy Refactored
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="border border-white/5 bg-black/40 rounded-xl overflow-hidden">
                            <div className="bg-slate-900 px-4 py-2 border-b border-white/5 text-[10px] uppercase font-bold text-emerald-400">
                              Optimized Version
                            </div>
                            <pre className="p-4 overflow-auto font-mono text-xs text-slate-300 max-h-[500px]">
                              <code>{parsedReview.fixedCode}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: TEST CASES */}
                  {activeTab === "tests" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Generated Tests Suite</h3>
                        <button
                          onClick={() => copyCodeText(parsedReview.testCases, setCopiedFixedCode)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-semibold text-gray-300 transition"
                        >
                          {copiedFixedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Copy Suite
                        </button>
                      </div>

                      <div className="border border-white/5 bg-black/40 rounded-xl overflow-hidden">
                        <pre className="p-4 overflow-auto font-mono text-xs text-slate-300 max-h-[500px]">
                          <code>{parsedReview.testCases}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                // Fallback for Raw Text / Old Markdown Reviews
                <div className="prose prose-invert prose-sm max-w-none">
                  <Markdown rehypePlugins={[rehypeHighlight]}>
                    {review}
                  </Markdown>
                </div>
              )}

              {/* Chat log displays inside the review tab if a review is active */}
              {review && chatMessages.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Interactive Discussions
                  </h4>
                  <div className="space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md leading-relaxed ${
                          msg.role === "user"
                            ? "bg-purple-600/10 border border-purple-500/20 text-gray-200 self-end ml-auto rounded-tr-none"
                            : "bg-[#0d1117]/80 border border-white/5 text-gray-300 mr-auto rounded-tl-none prose prose-invert max-w-none"
                        }`}
                      >
                        <span className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
                          {msg.role === "user" ? "You" : "AI Reviewer"}
                        </span>
                        {msg.role === "user" ? (
                          <p>{msg.text}</p>
                        ) : (
                          <Markdown rehypePlugins={[rehypeHighlight]}>{msg.text}</Markdown>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-[#0d1117]/80 border border-white/5 text-gray-300 mr-auto rounded-2xl rounded-tl-none p-3.5 text-xs max-w-[85%] flex items-center gap-2 shadow-md">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        <span className="text-gray-400">Gemini is thinking...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Follow-up Chat Console input */}
            {review && (
              <div className="p-4 border-t border-white/10 bg-[#0d1117]/80">
                <form onSubmit={sendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask follow-up questions about this review..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={chatLoading}
                    className="flex-1 bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}
