import React, { useState, useContext } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, token } = useContext(AuthContext);
  const navigate = useNavigate();
  /* If already authenticated, redirect to dashboard */ if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const result = await register(username, email, password);
    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] px-4">
      {" "}
      <div className="max-w-md w-full bg-[#111827] rounded-2xl shadow-xl border border-gray-800 p-8 relative overflow-hidden">
        {" "}
        {/* Decorative blobs */}{" "}
        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl"></div>{" "}
        <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl"></div>{" "}
        <div className="relative z-10">
          {" "}
          <div className="text-center mb-8">
            {" "}
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>{" "}
            <p className="text-gray-400">
              Join Malina-Ikshan to track your impact
            </p>{" "}
          </div>{" "}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {" "}
              {error}{" "}
            </div>
          )}{" "}
          <form onSubmit={handleSubmit} className="space-y-5">
            {" "}
            <div>
              {" "}
              <label
                className="block text-sm font-medium text-gray-400 mb-1.5"
                htmlFor="username"
              >
                {" "}
                Username{" "}
              </label>{" "}
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all duration-200"
                placeholder="johndoe"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                className="block text-sm font-medium text-gray-400 mb-1.5"
                htmlFor="email"
              >
                {" "}
                Email Address{" "}
              </label>{" "}
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all duration-200"
                placeholder="you@example.com"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                className="block text-sm font-medium text-gray-400 mb-1.5"
                htmlFor="password"
              >
                {" "}
                Password{" "}
              </label>{" "}
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all duration-200"
                placeholder="••••••••"
              />{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {" "}
              {isSubmitting ? "Creating account..." : "Sign Up"}{" "}
            </button>{" "}
          </form>{" "}
          <p className="mt-8 text-center text-sm text-gray-400">
            {" "}
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              {" "}
              Sign in{" "}
            </Link>{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Register;
