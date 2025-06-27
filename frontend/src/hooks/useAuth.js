import { useState, useEffect } from "react";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Use axios instead of fetch for better CORS handling
        const response = await axios.post(
          `${backendURL}/api/tokengetter`,
          {}, // Empty body
          {
            withCredentials: true, // Important for sending cookies
          }
        );

        const getRes = response.data;

        if (getRes.success === true) {
          setToken(getRes.token);
        } else {
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
    setRefresh((prev) => !prev);
  };

  return {
    token,
    loading,
    logout,
    refreshAuth,
  };
};
