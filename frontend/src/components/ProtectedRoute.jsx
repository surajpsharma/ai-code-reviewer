import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isChrome } from "../utils/cookieHelper";

const ProtectedRoute = ({ children }) => {
  const { token, loading, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    // For Chrome, we'll do multiple auth checks to ensure cookies are properly read
    if (!loading) {
      if (!token) {
        // If we're in Chrome and haven't tried too many times, refresh auth once more
        if (isChrome() && checkCount < 2) {
          console.log(`Auth check attempt ${checkCount + 1} for Chrome...`);
          setCheckCount((prev) => prev + 1);
          // Small delay before checking again
          setTimeout(() => {
            refreshAuth();
          }, 500);
        } else {
          // If still not authenticated after retries, redirect to login
          navigate("/login");
        }
      }
    }
  }, [token, loading, navigate, refreshAuth, checkCount]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect to login
  }

  return children;
};

export default ProtectedRoute;
