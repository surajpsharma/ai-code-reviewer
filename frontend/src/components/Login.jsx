import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Code } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// Use environment variable for backend URL
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${backendURL}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success === true) {
        navigate("/try"); // Redirect to the main review editor
      } else {
        setError(response.data.message || "Unknown error occurred.");
      }
    } catch (err) {
      console.error("Login error:", err);

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

  const handleGuestLogin = () => {
    // Set a guest cookie that starts with guest-
    document.cookie = "token=guest-session-local; path=/; max-age=86400";
    refreshAuth();
    navigate("/try");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117] relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Main glassmorphism card */}
      <div className="w-full max-w-md p-8 mx-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 animate-pulse">
            <Code className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-2">Log in to review and optimize your code</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                id="email"
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20 active:scale-[0.98]"
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] text-sm"
        >
          Try Guest Mode (Bypass DB)
        </button>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
