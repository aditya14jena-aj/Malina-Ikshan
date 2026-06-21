import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

// ─── 10-Tier Level Threshold Table ────────────────────────────────────────────
const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, next: 100, title: "Green Seedling", icon: "🌱" },
  { level: 2, min: 100, next: 250, title: "Eco Explorer", icon: "🌿" },
  { level: 3, min: 250, next: 500, title: "Eco Warrior", icon: "🌍" },
  { level: 4, min: 500, next: 1000, title: "Earth Guardian", icon: "🛡️" },
  { level: 5, min: 1000, next: 2000, title: "Eco Champion", icon: "🏆" },
  { level: 6, min: 2000, next: 3500, title: "Climate Defender", icon: "⚡" },
  { level: 7, min: 3500, next: 5000, title: "Green Oracle", icon: "🔮" },
  { level: 8, min: 5000, next: 7500, title: "Carbon Neutralizer", icon: "♻️" },
  { level: 9, min: 7500, next: 10000, title: "Planet Protector", icon: "🌐" },
  { level: 10, min: 10000, next: null, title: "Apex Sustainist", icon: "✨" },
];

// Memoization cache to prevent redundant re-computation
const _levelCache = new Map();

function calculateLevel(totalPoints) {
  if (_levelCache.has(totalPoints)) return _levelCache.get(totalPoints);

  let current = LEVEL_THRESHOLDS[0];
  for (const tier of LEVEL_THRESHOLDS) {
    if (totalPoints >= tier.min) current = tier;
    else break;
  }

  const isMax = current.level === 10;
  const pointsRequired = isMax ? 0 : Math.max(0, current.next - totalPoints);
  const span = isMax ? 1 : current.next - current.min;
  const progressPct = isMax
    ? 100
    : Math.min(100, Math.round(((totalPoints - current.min) / span) * 100));

  const result = {
    level: current.level,
    title: current.title,
    icon: current.icon,
    currentMin: current.min,
    nextMin: isMax ? current.min : current.next,
    nextLevel: isMax ? 10 : current.level + 1,
    pointsRequired,
    progressPct,
    isMax,
  };

  _levelCache.set(totalPoints, result);
  return result;
}

// ─── Tier color palette keyed by level ────────────────────────────────────────
const TIER_COLORS = {
  1: { bar: "from-emerald-400 to-teal-500", glow: "shadow-emerald-500/20", accent: "text-emerald-500", badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
  2: { bar: "from-teal-400 to-cyan-500", glow: "shadow-teal-500/20", accent: "text-teal-500", badge: "bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400" },
  3: { bar: "from-cyan-400 to-blue-500", glow: "shadow-cyan-500/20", accent: "text-cyan-500", badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400" },
  4: { bar: "from-blue-400 to-indigo-500", glow: "shadow-blue-500/20", accent: "text-blue-500", badge: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" },
  5: { bar: "from-indigo-400 to-violet-500", glow: "shadow-indigo-500/20", accent: "text-indigo-500", badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" },
  6: { bar: "from-violet-400 to-purple-500", glow: "shadow-violet-500/20", accent: "text-violet-500", badge: "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400" },
  7: { bar: "from-purple-400 to-fuchsia-500", glow: "shadow-purple-500/20", accent: "text-purple-500", badge: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400" },
  8: { bar: "from-fuchsia-400 to-pink-500", glow: "shadow-fuchsia-500/20", accent: "text-fuchsia-500", badge: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400" },
  9: { bar: "from-pink-400 to-rose-500", glow: "shadow-pink-500/20", accent: "text-pink-500", badge: "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400" },
  10: { bar: "from-amber-400 via-orange-400 to-rose-500", glow: "shadow-amber-500/20", accent: "text-amber-500", badge: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" },
};

// ─── Component ─────────────────────────────────────────────────────────────────
function Profile() {
  const [badges, setBadges] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const [badgeRes, streakRes] = await Promise.all([
          axios.get(`${API_URL}/achievements`, authHeaders),
          axios.get(`${API_URL}/api/emissions/streak`, authHeaders),
        ]);

        if (badgeRes.data) setBadges(badgeRes.data);
        if (streakRes.data?.score !== undefined) setXp(streakRes.data.score);
        if (streakRes.data?.current_streak !== undefined) setStreak(streakRes.data.current_streak);
        if (streakRes.data?.longest_streak !== undefined) setLongestStreak(streakRes.data.longest_streak);
      } catch (e) {
        console.error("Failed to fetch profile data cleanly", e);
      }
    };
    fetchProfileData();
  }, []);

  const lvl = calculateLevel(xp);
  const colors = TIER_COLORS[lvl.level] || TIER_COLORS[1];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-emerald-500/30 overflow-x-hidden w-full">

      {/* ── Title Row ─────────────────────────────────────────────────────── */}
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

      {/* ── Main Content Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT: Section A — Advanced Sustainability Progress Dashboard ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Identity & Progress Card */}
          <div className="relative bg-white/10 dark:bg-gray-900/40 backdrop-blur-md border border-white/10 dark:border-gray-800/60 rounded-[2.5rem] overflow-hidden shadow-xl">
            {/* Animated tier-colored top bar */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.bar}`} />

            {/* Background glow orb */}
            <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${colors.bar} opacity-10 blur-3xl pointer-events-none`} />

            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${colors.bar} flex items-center justify-center shadow-lg ${colors.glow} mb-4 text-white text-4xl font-black tracking-wider border-4 border-white dark:border-gray-900`}>
                {user ? user.username.charAt(0).toUpperCase() : "U"}
              </div>

              {/* Username */}
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                {user ? user.username : "User"}
              </h2>

              {/* Level title pill */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border mb-8 ${colors.badge}`}>
                {lvl.icon}&nbsp;Level {lvl.level} · {lvl.title}
              </span>

              {/* ── Sustainability Progress Engine ────────────────────────── */}
              <div className="w-full text-left border-t border-gray-100 dark:border-gray-800/40 pt-6">
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                  Sustainability Progress
                </h3>

                {/* Numeric XP display */}
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Total Points (XP)
                  </span>
                  <span className={`text-base font-black ${colors.accent}`}>
                    {xp.toLocaleString()} / {lvl.isMax ? "MAX" : lvl.nextMin.toLocaleString()} XP
                  </span>
                </div>

                {/* Fluid animated progress bar */}
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800/80 rounded-full overflow-hidden shadow-inner mb-2">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${lvl.progressPct}%` }}
                  />
                </div>

                {/* Sub-label thresholds */}
                {!lvl.isMax ? (
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 text-right tracking-tight">
                    {lvl.pointsRequired.toLocaleString()} XP until Level {lvl.nextLevel}
                  </p>
                ) : (
                  <p className={`text-[10px] font-bold uppercase tracking-widest text-right ${colors.accent}`}>
                    ✨ Maximum Tier Reached
                  </p>
                )}
              </div>
            </div>

            {/* ── Section B: Achievement Showcase Macro Ledger Card ──────── */}
            <div className="relative z-10 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/30 dark:bg-gray-950/20 px-8 py-6">
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Profile Achievement Summary
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Badges Earned */}
                <div className="flex flex-col items-center bg-white/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl p-3.5 text-center shadow-sm">
                  <span className="text-2xl mb-1">🏆</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{badges.length}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Badges Earned</p>
                </div>
                {/* Active Streak */}
                <div className="flex flex-col items-center bg-white/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl p-3.5 text-center shadow-sm">
                  <span className="text-2xl mb-1">🔥</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{streak}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Current Streak</p>
                </div>
                {/* Longest Streak */}
                <div className="flex flex-col items-center bg-white/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl p-3.5 text-center shadow-sm">
                  <span className="text-2xl mb-1">⚡</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{longestStreak}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Longest Streak</p>
                </div>
                {/* Level Indicator */}
                <div className="flex flex-col items-center bg-white/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl p-3.5 text-center shadow-sm">
                  <span className="text-2xl mb-1">⭐</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{lvl.level}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Current Level</p>
                </div>
              </div>
            </div>

            {/* Session Management Action */}
            <div className="relative z-10 px-8 pb-8 pt-2">
              <button
                onClick={logout}
                className="w-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 dark:text-rose-400 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest border border-rose-500/10 hover:border-rose-500/20 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                Log Out Session
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Section B — Main Focus Content Boards ────────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Achievement Gallery */}
          <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-md border border-white/10 dark:border-gray-700/40 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />

            <div className="p-8">
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

              {badges.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500">
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

          {/* XP Rules & Rewards Breakdown Handbook */}
          <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-md border border-white/10 dark:border-gray-800/60 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <span>📖</span> Sustainability Point Engine Handbook
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column Ledger: Daily Logs */}
              <div className="bg-gray-50/30 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800/30 rounded-2xl p-5">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider mb-3.5 flex items-center gap-1">
                  <span>🌱</span> Daily Log Eco-Score Multipliers
                </p>
                <div className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>Eco Score 90 – 100</span>
                    <span className="font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px]">+50 XP</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>Eco Score 80 – 89</span>
                    <span className="font-black text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded-md text-[10px]">+40 XP</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>Eco Score 70 – 79</span>
                    <span className="font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md text-[10px]">+30 XP</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>Eco Score 60 – 69</span>
                    <span className="font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md text-[10px]">+20 XP</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>Eco Score 50 – 59</span>
                    <span className="font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md text-[10px]">+10 XP</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span>Eco Score below 50</span>
                    <span className="font-black text-gray-400 bg-gray-400/10 px-2 py-0.5 rounded-md text-[10px]">+5 XP</span>
                  </div>
                </div>
              </div>

              {/* Right Column Ledger: Milestone Streaks */}
              <div className="bg-gray-50/30 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-800/30 rounded-2xl p-5">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-3.5 flex items-center gap-1">
                  <span>🔥</span> Milestone Streak Boosters
                </p>
                <div className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>3 Day Logging Streak</span>
                    <span className="font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md text-[10px]">+25 Bonus</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>7 Day Logging Streak</span>
                    <span className="font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md text-[10px]">+75 Bonus</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/20 pb-2">
                    <span>14 Day Logging Streak</span>
                    <span className="font-black text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-md text-[10px]">+150 Bonus</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>30 Day Logging Streak</span>
                    <span className="font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md text-[10px]">+500 Bonus</span>
                  </div>
                  <div className="pt-2 text-[10px] text-gray-400 dark:text-gray-500 font-medium italic leading-relaxed">
                    * Note: Streak milestones drop points immediately upon crossing targeted day frequencies once per logging interval.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── CENTERED FOOTER: Branding, Sanskrit Index, and Social Matrix ── */}
      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800/60 flex flex-col items-center justify-center text-center space-y-3.5">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
          Built with <span className="text-rose-500 animate-pulse">❤️</span> to promote sustainability and climate awareness.
        </p>

        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wide">
          <span className="text-emerald-500 dark:text-emerald-400 font-extrabold">Malina-Ikshan (मलिन-ईक्षण)</span> — "Pollution Monitor" in Sanskrit
        </p>

        <p className="text-[10px] font-black tracking-widest text-gray-400 dark:text-gray-600 uppercase">
          ✨ HARE KRISHNA ✨
        </p>

        {/* High-Contrast Interactive Matrix Links with explicit Text Labels */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1.5">
          <a
            href="https://github.com/aditya14jena-aj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/40 px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
            aria-label="GitHub Profile Link"
          >
            <svg className="w-4 h-4 fill-current transform group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="tracking-tight">GitHub Profile</span>
          </a>

          <a
            href="https://www.linkedin.com/in/aditya-jena-694909382/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 group bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/40 px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
            aria-label="LinkedIn Profile Link"
          >
            <svg className="w-4 h-4 fill-current transform group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span className="tracking-tight">LinkedIn Profile</span>
          </a>
        </div>
      </div>

    </div>
  );
}

export default Profile;