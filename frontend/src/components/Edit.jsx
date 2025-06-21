import { useEffect, useState } from "react";
import "prismjs/themes/prism.css";
import Editor from "react-simple-code-editor";
import "./edit.css";
import prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
const backendURL = import.meta.env.VITE_BACKEND_URL;

import {
  FaBars,
  FaUserCircle,
  FaPlus,
  FaRobot,
  FaTrash,
  FaCopy,
  FaDownload,
  FaSignOutAlt,
  FaChevronLeft,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Edit() {
  const [code, setCode] = useState(
    '// Welcome to AI Code Reviewer\nfunction example() {\n  console.log("Hello, World!");\n}'
  );
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(-1);

  const { logout } = useAuth();
  const navigate = useNavigate();

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
  }, [userInfo]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL;

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const reviewCode = async () => {
    if (!code.trim()) {
      setReview("⚠️ Please enter some code to review.");
      return;
    }

    setLoading(true);
    try {
      console.log("Frontend: Sending review request...");

      const backendURL = import.meta.env.VITE_BACKEND_URL;

      const reviewResponse = await axios.post(
        `${backendURL}/api/get-review`,
        {
          code,
          language: "javascript",
        },
        {
          withCredentials: true,
        }
      );

      const reviewText = reviewResponse.data;

      // ✅ Set review text
      setReview(reviewText);

      // ⚡️ Save review
      await axios.post(
        `${backendURL}/api/save-review-history`,
        {
          code,
          review: reviewText,
          language: "javascript",
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error during code review:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        if (error.response.status === 401) {
          alert("Session expired or unauthorized. Please log in again.");
          logout();
        } else {
          alert(
            "Failed to get review: " +
              (error.response.data.message || error.message)
          );
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert(
          "No response received from server. Please check your network connection."
        );
      } else {
        console.error("Error message:", error.message);
        alert("An unexpected error occurred: " + error.message);
      }
      setReview("Error: Could not retrieve review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setReview("");
    setCurrentReviewIndex(-1);
  };
  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };
  const downloadReview = () => {
    if (!review) return;
    const blob = new Blob(
      [
        `# Code Review\n\n## Code:\n\`\`\`javascript\n${code}\n\`\`\`\n\n## Review:\n${review}`,
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
          setReview("");
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
  const themeConfig = {
    bg: "bg-gray-100",
    text: "text-gray-800",
    header: "bg-gray-800 border-b border-gray-700 text-white shadow-lg",
    sidebar: "bg-gray-700 border-r border-gray-600 text-white",
    card: "bg-white border border-gray-200 rounded-xl shadow-md",
    editor: "bg-gray-100 border border-gray-300",
    button: {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-600 hover:bg-gray-500 text-white",
      danger: "bg-red-500 hover:bg-red-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white",
    },
    accent: "text-blue-500",
    sidebarText: "text-gray-200",
    sidebarHeader: "text-white",
    sidebarButtonText: "text-white",
  };
  const t = themeConfig;

  return (
    <div className={`min-h-screen flex flex-col ${t.bg} ${t.text}`}>
      <header
        className={`flex justify-between items-center px-6 py-4 ${t.header}`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg ${t.button.secondary}`}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${t.accent} bg-opacity-10`}>
              <FaRobot className={`text-xl ${t.accent} text-white`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Code Reviewer</h1>
              <p className="text-sm opacity-80 text-gray-300">
                Smart code reviews, simplified
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 p-2 rounded-lg ${t.button.secondary}`}
            >
              <FaUserCircle className="text-xl" />
              <span className="hidden md:block">
                {userInfo?.name || "User"}
              </span>
            </button>
            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 ${t.card} rounded-lg shadow-lg z-50`}
              >
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{userInfo?.name}</p>
                  <p className="text-sm opacity-70 text-gray-600">
                    {userInfo?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 text-red-600 rounded-b-lg"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className={`w-80 ${t.sidebar} flex flex-col`}>
            <div className="p-4 border-b border-gray-600">
              <h3
                className={`font-semibold flex items-center gap-2 mb-3 ${t.sidebarHeader}`}
              >
                Review History
              </h3>
              <button
                onClick={() => {
                  setCode("");
                  setReview("");
                  setCurrentReviewIndex(-1);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${t.button.primary}`}
              >
                <FaPlus />
                New Review
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {reviewHistory.length === 0 ? (
                <p className={`text-center opacity-70 py-8 ${t.sidebarText}`}>
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-2">
                  {reviewHistory.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        currentReviewIndex === index
                          ? "border-blue-400 bg-blue-100 text-gray-800"
                          : "border-gray-600 hover:bg-gray-600 text-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          onClick={() => loadHistoryItem(item, index)}
                          className="flex-1"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FaRobot className="text-sm opacity-70" />
                            <span className="text-sm font-medium">
                              {item.language}
                            </span>
                          </div>
                          <p className="text-sm opacity-70 truncate">
                            {item.code.split("\n")[0]}
                          </p>
                          <p className="text-xs opacity-50 mt-1">
                            {item.timestamp}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteHistoryItem(item.id, index)}
                          className="p-1 text-red-300 hover:bg-red-700 rounded"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`flex flex-col ${t.card}`}>
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="font-semibold flex items-center gap-2">
                  <FaRobot />
                  Code Editor
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className={`p-2 rounded-lg ${t.button.secondary} text-gray-700`}
                    title="Copy Code"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={clearCode}
                    className={`p-2 rounded-lg ${t.button.danger}`}
                    title="Clear Code"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div
                  className={`h-full rounded-lg ${t.editor} overflow-hidden`}
                >
                  <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={(code) =>
                      prism.highlight(
                        code,
                        prism.languages["javascript"],
                        "javascript"
                      )
                    }
                    padding={16}
                    className="h-full font-mono text-sm leading-relaxed"
                    style={{
                      fontFamily:
                        '"Fira Code", "JetBrains Mono", "Consolas", monospace',
                      fontSize: 14,
                      lineHeight: 1.6,
                      minHeight: "400px",
                    }}
                    placeholder="Paste your code here for AI analysis..."
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={reviewCode}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  } ${t.button.success}`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <FaRobot />
                      Analyze Code
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className={`flex flex-col ${t.card}`}>
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="font-semibold flex items-center gap-2">
                  <FaRobot />
                  AI Review
                </h2>
                {review && (
                  <button
                    onClick={downloadReview}
                    className={`p-2 rounded-lg ${t.button.secondary} text-gray-700`}
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {review ? (
                  <div className="prose prose-sm max-w-none">
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {review}
                    </Markdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                    <FaRobot className="text-5xl mb-4 opacity-40" />
                    <h3 className="text-lg font-medium mb-2">
                      Ready for Analysis
                    </h3>
                    <p className="text-sm">
                      Paste your code in the editor and click "Analyze Code" to
                      get smart review.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}
