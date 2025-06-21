import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";
import { useAuth } from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
function App() {
  const [code, setCode] = useState(``);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(``);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    prism.highlightAll();
    if (token) {
      fetchHistory();
    }
  }, [token]);

  async function fetchHistory() {
    try {
      const response = await axios.get(`${backendURL}/api/get-review-history`, {
        withCredentials: true,
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  }

  async function deleteHistoryItem(id) {
    try {
      await axios.delete(`${backendURL}/api/delete-review-history/${id}`, {
        withCredentials: true,
      });
      // Refresh history after deletion
      fetchHistory();
    } catch (error) {
      console.error("Failed to delete history item:", error);
    }
  }

  async function saveToHistory(code, review) {
    try {
      await axios.post(
        `${backendURL}/api/save-review-history`,
        {
          code,
          review,
          language: "javascript", // Can be dynamic if needed
          timestamp: new Date().toISOString(),
        },
        {
          withCredentials: true, // Required for cookies/session
        }
      );
      console.log("Review saved to history successfully");
      // Refresh history after saving
      fetchHistory();
    } catch (error) {
      console.error("Failed to save review to history:", error);
    }
  }

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/get-review`,
        { code },
        {
          withCredentials: true, // This ensures cookies are sent with the request
        }
      );
      console.log("Response received:", response.data);
      setReview(response.data);

      // Save to history after successful review
      if (token) {
        await saveToHistory(code, response.data);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
        setReview("Error: Failed to get code review. Please try again.");
      } else if (error.request) {
        // No response received
        console.error("No response from server:", error.request);
        setReview(
          "Error: No response from server. Please check your connection."
        );
      } else {
        // Other errors
        console.error("Request error:", error.message);
        setReview("Error: Request failed. Please try again.");
      }
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
    }
  };
  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              placeholder="Review Your Code Here..."
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",

                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            {" "}
            {loading ? "Loading..." : "Review"}
          </div>
        </div>
        <div className="right">
          <div className="header-controls">
            {token && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="history-btn"
                style={{ marginRight: "10px" }}
              >
                {showHistory ? "Hide History" : "Show History"}
              </button>
            )}
            {token ? (
              <button onClick={handleLogout} className="login-btn">
                Logout
              </button>
            ) : (
              <a href="/login" className="login-btn">
                Login
              </a>
            )}
          </div>

          {showHistory && token && (
            <div
              className="history-panel"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>Review History</h3>
              {history.length === 0 ? (
                <p>No review history found.</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      padding: "10px",
                      marginBottom: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <small>{item.timestamp}</small>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <strong>Code:</strong>
                      <pre
                        style={{
                          background: "#f5f5f5",
                          padding: "5px",
                          borderRadius: "3px",
                          fontSize: "12px",
                          maxHeight: "100px",
                          overflow: "auto",
                        }}
                      >
                        {item.code.substring(0, 200)}
                        {item.code.length > 200 ? "..." : ""}
                      </pre>
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <strong>Review:</strong>
                      <div
                        style={{
                          background: "#f5f5f5",
                          padding: "5px",
                          borderRadius: "3px",
                          fontSize: "12px",
                          maxHeight: "100px",
                          overflow: "auto",
                        }}
                      >
                        {item.review.substring(0, 200)}
                        {item.review.length > 200 ? "..." : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCode(item.code);
                        setReview(item.review);
                        setShowHistory(false);
                      }}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      Load This Review
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
