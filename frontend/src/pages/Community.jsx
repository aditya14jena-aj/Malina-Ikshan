import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Community() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const leaderboardRes = await axios.get(
          `${API_URL}/leaderboard`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          }
        );
        if (leaderboardRes.data) {
          setLeaderboard(leaderboardRes.data);
        }
      } catch (e) {
        console.error("Failed to fetch leaderboard data", e);
      }
    };
    fetchCommunityData();
  }, []);

  const getRankBadge = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `#${index + 1}`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-emerald-500/30">

      {/* Title Row Header Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5 text-sm">
            See how your carbon optimization metrics stack up against other active eco-champions.
          </p>
        </div>
      </div>

      {/* Global Rank Standings Deck */}
      <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>🏆</span> Top Eco Champions
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Rankings updated live from dynamic database logs.
            </p>
          </div>
          <span className="bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start sm:self-auto">
            Live Network
          </span>
        </div>

        {/* Dynamic Leaderboard Container */}
        <div className="space-y-4">
          {leaderboard.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <span className="text-4xl block mb-3">🌱</span>
              <p className="font-extrabold text-lg text-gray-900 dark:text-white">No active records found.</p>
              <p className="text-xs font-semibold mt-1">Be the first to run an environmental metrics sync!</p>
            </div>
          ) : (
            leaderboard.map((entry, idx) => {
              const isCurrentUser = localStorage.getItem("username") === entry.username;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${isCurrentUser
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/40 dark:to-teal-950/20 border-emerald-500/30 dark:border-emerald-500/20 shadow-md shadow-emerald-500/5"
                    : "bg-gray-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/40 hover:border-gray-200 dark:hover:border-gray-800/80"
                    }`}
                >
                  {/* Profile Details & Rank Block */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-10 w-10 shrink-0 font-black text-sm rounded-xl flex items-center justify-center ${idx === 0 ? "bg-amber-500/10 text-amber-500 text-lg" :
                      idx === 1 ? "bg-slate-400/10 text-slate-400 text-lg" :
                        idx === 2 ? "bg-amber-700/10 text-amber-700 text-lg" :
                          "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500"
                      }`}>
                      {getRankBadge(idx)}
                    </div>

                    {/* Generated Initials Avatar Icon */}
                    <div className={`h-10 w-10 shrink-0 rounded-full font-black text-xs uppercase flex items-center justify-center tracking-wider ${isCurrentUser
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}>
                      {entry.username ? entry.username.substring(0, 2) : "EC"}
                    </div>

                    <div className="min-w-0">
                      <h3 className={`text-sm font-extrabold tracking-tight truncate ${isCurrentUser ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                        }`}>
                        {entry.username}
                        {isCurrentUser && (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider rounded-md">
                            You
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Performance Average Node */}
                  <div className="text-right shrink-0">
                    <h4 className={`text-lg font-black tracking-tight ${isCurrentUser ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                      }`}>
                      {(entry.total_points || 0).toLocaleString()}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                      Total Pts
                    </p>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

export default Community;