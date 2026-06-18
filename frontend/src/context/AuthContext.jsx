import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || null,
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  /* Adjust as needed */ useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUsername = localStorage.getItem("username");
      if (storedToken && storedUsername) {
        setToken(storedToken);
        setUser({ username: storedUsername });
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${storedToken}`;
      } else {
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
      }
      setLoading(false);
    };
    initAuth();
  }, []);
  const formatError = (error, fallback) => {
    const detail = error.response?.data?.detail;
    if (!detail) return fallback;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((err) => {
          const field = err.loc && err.loc.length > 1 ? `${err.loc[1]}: ` : "";
          return `${field}${err.msg}`;
        })
        .join(", ");
    }
    return typeof detail === "object" ? JSON.stringify(detail) : String(detail);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { access_token, username } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("username", username);
      setToken(access_token);
      setUser({ username });
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: formatError(error, "Login failed"),
      };
    }
  };
  const register = async (username, email, password) => {
    try {
      await axios.post(`${API_URL}/register`, { username, email, password });
      /* Auto login after successful registration */ return await login(
        email,
        password,
      );
    } catch (error) {
      return {
        success: false,
        message: formatError(error, "Registration failed"),
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };
  const value = { user, token, loading, login, register, logout };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
