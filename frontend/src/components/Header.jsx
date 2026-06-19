import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [streak, setStreak] = useState(0);
  const [ecoScore, setEcoScore] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotificationsCount();
  }, []);

  const fetchNotificationsCount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/notifications/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.error("Failed to fetch notifications count", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const [streakRes, leaderRes] = await Promise.all([
          axios.get(`${API_URL}/logs/streak`, authHeaders),
          axios.get(`${API_URL}/leaderboard`, authHeaders),
        ]);
        if (streakRes.data) {
          setStreak(streakRes.data.current_streak || 0);
        }
        if (leaderRes.data) {
          const myEntry = leaderRes.data.find(
            (entry) => entry.username === user.username,
          );
          if (myEntry) setEcoScore(myEntry.avg_score);
        }
      } catch (err) {
        console.error("Failed to fetch header stats", err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail) {
        if (e.detail.updatedScore !== undefined) setEcoScore(e.detail.updatedScore);
        if (e.detail.updatedStreak !== undefined) setStreak(e.detail.updatedStreak);
      }
    };
    window.addEventListener("sustainDataUpdated", handleSync);
    return () => window.removeEventListener("sustainDataUpdated", handleSync);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!user) return null;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <header className="w-full bg-surface/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-border dark:border-[#222] sticky top-0 z-50 transition-colors duration-300">
      {" "}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex justify-between items-center">
        {" "}
        {/* Left Side: Greeting & Branding */}{" "}
        <div className="flex items-center space-x-6">
          {" "}
          <div className="flex items-center space-x-2 lg:hidden">
            {" "}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              {" "}
              <span className="text-text-main font-bold text-sm">M</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="hidden lg:block">
            {" "}
            <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted tracking-tight">
              {greeting},
            </h2>{" "}
            <h1 className="text-lg font-bold text-text-main leading-tight truncate max-w-[200px]">
              {user.username}
            </h1>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Side: Stats & Actions */}{" "}
        <div className="flex items-center space-x-3 lg:space-x-6">
          {" "}
          {/* Stats Badges (Hidden on very small screens) */}{" "}
          <div className="hidden sm:flex items-center space-x-3">
            {" "}
            <div className="flex items-center px-3 py-1.5 bg-emerald-50 dark:bg-[#111] rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-md cursor-default">
              {" "}
              <span className="text-sm mr-1.5">🌱</span>{" "}
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Score: {ecoScore}
              </span>{" "}
            </div>{" "}
            <div className="flex items-center px-3 py-1.5 bg-orange-50 dark:bg-[#111] rounded-full border border-orange-100 dark:border-orange-500/20 shadow-sm transition-all hover:shadow-md cursor-default">
              {" "}
              <span className="text-sm mr-1.5">🔥</span>{" "}
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                {streak} Day{streak !== 1 ? "s" : ""}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Icon Buttons */}{" "}
          {/* <div className="flex items-center space-x-2">
            {" "}
            <button className="p-2 text-text-muted hover:text-text-main dark:text-text-muted dark:hover:text-text-main hover:bg-surface2 dark:hover:bg-[#1a1a1a] rounded-full transition-colors relative">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>{" "}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>{" "}
            </button>{" "} */}

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);

                if (!showNotifications) {
                  fetchNotifications();
                  if (unreadCount > 0) {
                    const token = localStorage.getItem("access_token");
                    axios.post(
                      `${API_URL}/api/notifications/mark-read`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      }
                    )
                      .then(() => setUnreadCount(0))
                      .catch((err) => console.error("Failed to mark notifications read", err));
                  }
                }
              }}
              className="p-2 text-text-muted hover:text-text-main dark:text-text-muted dark:hover:text-text-main hover:bg-surface2 dark:hover:bg-[#1a1a1a] rounded-full transition-colors relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold shadow-sm z-10">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              // <div 
              //   className="absolute right-0 mt-3 bg-surface/80 dark:bg-[#111]/80 backdrop-blur-[8px] rounded-2xl shadow-lg border border-border/50 dark:border-[#222]/50 overflow-hidden z-[100]"
              //   style={{ width: 'min(380px, 90vw)', maxWidth: '90vw' }}
              // >
              <div
                className="absolute right-0 md:right-0 left-auto max-md:fixed max-md:top-16 max-md:left-1/2 max-md:-translate-x-1/2 mt-3 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 dark:border-[#222]/50 overflow-hidden z-[100]"
                style={{ width: 'min(380px, 90vw)', maxWidth: '90vw' }}
              >

                <div className="px-4 py-3 border-b border-border dark:border-[#222]">
                  <h3 className="font-bold text-text-main">
                    Notifications
                  </h3>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">

                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-text-muted">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border-b border-border/50 dark:border-[#222]/50 hover:bg-surface2/50 dark:hover:bg-[#1a1a1a]/50 transition-colors duration-300"
                      >
                        <div className="flex gap-3">

                          <div className="text-xl">
                            {{
                              achievement: "🏆",
                              streak: "🔥",
                              goal: "🎯",
                              leaderboard: "🥇",
                              insight: "📈",
                              system: "🌱",
                            }[n.type] || "🔔"}
                          </div>

                          <div>
                            <p className="font-semibold text-text-main">
                              {n.title}
                            </p>

                            <p className="text-sm text-text-muted break-words whitespace-normal" style={{ overflowWrap: 'break-word' }}>
                              {n.message}
                            </p>
                          </div>

                        </div>
                      </div>
                    ))
                  )}

                </div>

              </div>
            )}
            {/* <button className="p-2 text-text-muted hover:text-text-main dark:text-text-muted dark:hover:text-text-main hover:bg-surface2 dark:hover:bg-[#1a1a1a] rounded-full transition-colors hidden sm:block">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />{" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />{" "}
              </svg>{" "}
            </button>{" "} */}
          </div>{" "}
          {/* Profile Dropdown */}{" "}
          <div className="relative" ref={dropdownRef}>
            {" "}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 pl-2 sm:pl-4 border-l border-border dark:border-[#222] focus:outline-none"
            >
              {" "}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-text-main font-bold shadow-sm ring-2 ring-transparent hover:ring-indigo-500/50 transition-all">
                {" "}
                {user.username.charAt(0).toUpperCase()}{" "}
              </div>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-text-muted transition-transform ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />{" "}
              </svg>{" "}
            </button>{" "}
            {/* Dropdown Menu */}{" "}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-surface dark:bg-[#111] rounded-2xl shadow-xl border border-border dark:border-[#222] py-2 z-50 animate-fade-up">
                {" "}
                <div className="px-4 py-3 border-b border-border dark:border-[#222] mb-1">
                  {" "}
                  <p className="text-sm font-bold text-text-main truncate">
                    {user.username}
                  </p>{" "}
                  <p className="text-xs font-medium text-text-muted dark:text-text-muted truncate">
                    Eco Warrior
                  </p>{" "}
                </div>{" "}
                <NavLink
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-text-muted dark:text-text-muted hover:bg-surface2 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  {" "}
                  <svg
                    className="w-4 h-4 mr-3 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>{" "}
                  My Profile{" "}
                </NavLink>{" "}
                <NavLink
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-text-muted dark:text-text-muted hover:bg-surface2 dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  {" "}
                  <svg
                    className="w-4 h-4 mr-3 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>{" "}
                  Settings{" "}
                </NavLink>{" "}
                <div className="border-t border-border dark:border-[#222] mt-1 pt-1">
                  {" "}
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    {" "}
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>{" "}
                    Log Out{" "}
                  </button>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
};
export default Header;
