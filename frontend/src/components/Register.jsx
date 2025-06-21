import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [LoginError, setLoginError] = useState(false);
  const [LoginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${backendURL}/api/register`, { name, email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Already registered") {
          setLoginMessage("You are already registered. Please login!");
          setLoginError(true);
        } else {
          navigate("/login");
          setLoginError(false);
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 p-4"
      style={{
        backgroundImage: "linear-gradient(to right, #00d5ff, #0095ff, #5d00ff)",
      }}
    >
      <div className="row w-75 shadow-lg rounded p-4 bg-white">
        {/* Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Register Illustration"
            className="img-fluid"
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Register Form Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="mb-3 text-center text-primary">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                className="form-control"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
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
                required
              />
              {LoginError && (
                <p className="text-danger mt-1" style={{ fontSize: "12px" }}>
                  {LoginMessage}
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
