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

function App() {
  const [code, setCode] = useState(``);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(``);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/get-review",
        { code }
      );
      console.log("Response received:", response.data);
      setReview(response.data);
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
          {token ? (
            <button onClick={handleLogout} className="login-btn">
              Logout
            </button>
          ) : (
            <a href="/login" className="login-btn">
              Login
            </a>
          )}
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
