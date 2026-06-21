import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

// XP Level thresholds and rank titles
const LEVEL_THRESHOLDS = [
  { level: 1, min: 0,    max: 99,   title: "Green Seedling",  icon: "🌱" },
  { level: 2, min: 100,  max: 249,  title: "Eco Explorer",    icon: "🌿" },
  { level: 3, min: 250,  max: 499,  title: "Eco Warrior",     icon: "🌍" },
  { level: 4, min: 500,  max: 999,  title: "Earth Guardian",  icon: "🛡️" },
  { level: 5, min: 1000, max: Infinity, title: "Eco Champion", icon: "🏆" },
];

function getLevelInfo(xp) {
  const lvl = LEVEL_THRESHOLDS.find((l) => xp >= l.min && xp <= l.max) ||
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const nextLvl = LEVEL_THRESHOLDS.find((l) => l.level === lvl.level + 1);
  const progressPct = nextLvl
    ? Math.min(100, Math.round(((xp - lvl.min) / (nextLvl.min - lvl.min)) * 100))
    : 100;
  return {
    ...lvl,
    nextMin: nextLvl ? nextLvl.min : lvl.min,
    progressPct,
  };
}

function Profile() {
  const [badges, setBadges] = useState([]);
  const [xp, setXp] = useState(0);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const [badgeRes, streakRes] = await Promise.all([
          axios.get(`${API_URL}/achievements`, authHeaders),
          axios.get(`${API_URL}/api/emissions/streak`, authHeaders),
        ]);
        if (badgeRes.data) setBadges(badgeRes.data);
        if (streakRes.data?.score !== undefined) setXp(streakRes.data.score);
      } catch (e) {
        console.error("Failed to fetch profile data", e);
      }
    };
    fetchProfileData();
  }, []);

  const levelInfo = getLevelInfo(xp);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-emerald-500/30">

      {/* Title Row Header Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5 text-sm">
            Manage your credentials and track your unlocked historical milestones.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Identity Deck Asset */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

            {/* High-End Vector Identity Badge */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5 text-white text-4xl font-black tracking-wider border-4 border-white dark:border-gray-900">
              {user ? user.username.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {user ? user.username : "User"}
            </h2>

            {/* Dynamic Level Display */}
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 mt-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/10">
              {levelInfo.icon} Level {levelInfo.level} · {levelInfo.title}
            </p>

            {/* XP Progress Bar */}
            <div className="w-full mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">XP Progress</span>
                <span className="text-[10px] font-bold text-emerald-500">{xp} / {levelInfo.nextMin === levelInfo.min ? "MAX" : levelInfo.nextMin} XP</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${levelInfo.progressPct}%` }}
                />
              </div>
            </div>

            {/* Modern Clean Destruction Utility Action Button */}
            <button
              onClick={logout}
              className="w-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 dark:text-rose-400 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest border border-rose-500/10 hover:border-rose-500/20 shadow-sm cursor-pointer"
            >
              Log Out Session
            </button>
          </div>
        </div>

        {/* Right Side: Achievement System Rack */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>🏆</span> Achievement Gallery
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
                  Badges earned dynamically from active optimization data logs.
                </p>
              </div>

              <span className="bg-indigo-500/10 dark:bg-indigo-950/60 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start sm:self-auto">
                {badges.length} Unlocked
              </span>
            </div>

            {/* Condition Render Grid Deck */}
            {badges.length === 0 ? (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <span className="text-5xl mb-4 block filter drop-shadow-sm">🔒</span>
                <p className="font-extrabold text-lg text-gray-900 dark:text-white">Milestones Locked.</p>
                <p className="text-xs font-semibold mt-1 max-w-xs mx-auto leading-relaxed">
                  Start logging carbon activity indexes on your dashboard to fetch automated achievements!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {badges.map((b) => (
                  <div
                    key={b.id || b.name}
                    className="flex flex-col items-center p-5 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl text-center group hover:bg-gradient-to-b hover:from-emerald-500/5 hover:to-teal-500/5 hover:border-emerald-500/20 transition-all duration-300"
                  >
                    <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm block">
                      {b.icon || "🏅"}
                    </span>
                    <p className="font-extrabold text-gray-900 dark:text-white text-sm mb-1.5 tracking-tight group-hover:text-emerald-500 transition-colors">
                      {b.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;