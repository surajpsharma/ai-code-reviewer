import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Combine imports
import axios from "axios";
import lock from "../assets/lock.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    // --- Frontend Logging (for debugging what's sent) ---
    console.log("Attempting login with:", { email, password });
    // --- End Frontend Logging ---

    try {
      const result = await axios.post(
        `${backendURL}/api/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Important for sending/receiving HTTP-only cookies
        }
      );

      console.log("Axios response:", result); // Log the full Axios response for debugging

      // The backend returns success: true on successful login
      if (result.data.success === true) {
        console.log("Login successful!");
        navigate("/try"); // Navigate to the AI Code Reviewer page
      } else {
        // This case might be hit if the backend sends success: false but a 200 status
        // (which is not expected with the current backend, but good to have)
        setError(result.data.message || "An unknown login issue occurred.");
      }
    } catch (err) {
      console.error("Login error (Axios):", err); // More descriptive log

      // --- IMPROVED ERROR HANDLING ---
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 400) {
          // Bad Request - usually due to missing email/password from frontend validation
          setError(
            err.response.data.message ||
              "Please provide both email and password."
          );
        } else if (err.response.status === 401) {
          // Unauthorized - invalid credentials (email not found or password incorrect)
          setError(
            err.response.data.message ||
              "Invalid email or password. Please try again."
          );
        } else if (err.response.status === 500) {
          // Internal Server Error
          setError(
            err.response.data.message ||
              "A server error occurred. Please try again later."
          );
        } else {
          // Any other HTTP error status
          setError(
            err.response.data.message ||
              `An unexpected error occurred (Status: ${err.response.status}).`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        // This typically means the backend server is down or unreachable
        console.error("No response received:", err.request);
        setError(
          "Network error: Could not connect to the server. Please check your internet connection or try again later."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
      // --- END IMPROVED ERROR HANDLING ---
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
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
        {/* Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={lock}
            alt="Lock Icon representing secure access or login" // More descriptive alt text
            className="img-fluid"
            style={{ maxWidth: "400px", mixBlendMode: "multiply" }}
          />
        </div>

        {/* Login Form Section */}
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
                placeholder="Enter Email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                required
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
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
