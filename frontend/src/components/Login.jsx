import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import lock from "../assets/lock.png";

// ✅ Use environment variable for backend URL
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Send login request with credentials
      const response = await axios.post(
        `${backendURL}/api/login`,
        { email, password },
        { withCredentials: true } // <--- Important
      );

      console.log("Login response:", response);

      if (response.data.success === true) {
        console.log("✅ Login successful");
        navigate("/try"); // Redirect to protected route
      } else {
        setError(response.data.message || "Unknown error occurred.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          setError(data.message || "Please fill in both email and password.");
        } else if (status === 401) {
          setError(data.message || "Invalid email or password.");
        } else if (status === 500) {
          setError(data.message || "Server error. Please try again later.");
        } else {
          setError(data.message || `Unexpected error: ${status}`);
        }
      } else if (err.request) {
        setError("No response from server. Check your internet connection.");
      } else {
        setError("Request setup error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light"
      style={{
        backgroundImage: "linear-gradient(to right, #00d5ff, #0095ff, #5d00ff)",
      }}
    >
      <div className="row w-75 shadow rounded p-4 bg-white">
        {/* 🔒 Lock Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={lock}
            alt="Lock Icon representing secure login"
            className="img-fluid"
            style={{ maxWidth: "400px", mixBlendMode: "multiply" }}
          />
        </div>

        {/* 📝 Login Form Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="mb-3 text-primary text-center">Login</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-3 text-center">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
