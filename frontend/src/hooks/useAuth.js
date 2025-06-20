import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/tokengetter", {
          method: "POST",
          credentials: "include",
        });
        const getRes = await response.json();

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
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();

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
