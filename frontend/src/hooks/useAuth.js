import { useState, useEffect } from "react";
import axios from "axios";
import { isChrome } from "../utils/cookieHelper";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        console.log("✅ Checking authentication status...");

        // Use axios instead of fetch for better CORS handling
        const response = await axios.post(
          `${backendURL}/api/tokengetter`,
          {}, // Empty body
          {
            withCredentials: true, // Important for sending cookies
            headers: {
              "Cache-Control": "no-cache", // Prevent caching issues in Chrome
            },
          }
        );

        console.log("✅ Auth Check Response:", response);
        const getRes = response.data;

        if (getRes.success === true) {
          console.log("User is authenticated");
          setToken(getRes.token);
        } else {
          console.log("User is not authenticated");
          setToken(false);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setToken(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [refresh]);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/api/logout`,
        {}, // Empty body
        { withCredentials: true } // Important for sending cookies
      );

      const result = response.data;

      if (result.success === true) {
        setToken(false);
        setRefresh((prev) => !prev);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  const refreshAuth = () => {
    console.log("Refreshing authentication state...");
    setRefresh((prev) => !prev);

    // For Chrome, we need to ensure cookies are properly read
    if (isChrome()) {
      // Force a cookie check with no-cache to avoid Chrome caching issues
      axios
        .post(
          `${backendURL}/api/tokengetter`,
          {},
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        )
        .then((response) => {
          console.log("Chrome forced auth check:", response.data);
          if (response.data.success === true) {
            setToken(response.data.token);
          }
        })
        .catch((error) => {
          console.error("Chrome forced auth check failed:", error);
        });
    }
  };

  return {
    token,
    loading,
    logout,
    refreshAuth,
  };
};
