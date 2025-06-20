import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    setError("");

    try {
      const result = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(result);
      if (result.data.success === true) {
        console.log("Login Success");
        // Navigate to try page (AI Code Reviewer) instead of review page
        navigate("/try");
      } else {
        setError("Incorrect email or password! Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 404) {
        setError("No account found with this email.");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
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
        {/* Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={lock}
            alt="Lock Icon"
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
