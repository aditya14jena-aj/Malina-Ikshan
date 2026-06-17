import React, { useState, useEffect } from "react";
import axios from "axios";
function Community() {
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const leaderboardRes = await axios.get(
          "http://127.0.0.1:8000/leaderboard",
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
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8 mt-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Community
          </h1>{" "}
          <p className="text-text-muted mt-1">
            See how you rank against other eco-champions.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-border">
        {" "}
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6">
          Top Eco Champions
        </h3>{" "}
        <div className="space-y-4">
          {" "}
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              {" "}
              <p className="font-semibold text-lg">No data yet.</p>{" "}
              <p className="text-sm">
                Be the first to calculate your footprint!
              </p>{" "}
            </div>
          ) : (
            leaderboard.map((entry, idx) => {
              const isCurrentUser =
                localStorage.getItem("username") === entry.username;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isCurrentUser ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-surface2 border-border hover:bg-surface2"}`}
                >
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <span
                      className={`font-black w-8 text-center flex items-center justify-center h-8 rounded-full ${idx === 0 ? "bg-amber-100 text-amber-600 text-lg" : idx === 1 ? "bg-surface2 text-text-muted text-base" : idx === 2 ? "bg-orange-100 text-orange-700 text-base" : "bg-surface border text-text-muted text-sm"}`}
                    >
                      {" "}
                      {idx === 0 ? "👑" : idx + 1}{" "}
                    </span>{" "}
                    <span
                      className={`text-lg font-bold ${isCurrentUser ? "text-emerald-800" : "text-text-muted"}`}
                    >
                      {" "}
                      {entry.username}{" "}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          (You)
                        </span>
                      )}{" "}
                    </span>{" "}
                  </div>{" "}
                  <div className="text-right">
                    {" "}
                    <span
                      className={`text-xl font-black ${isCurrentUser ? "text-emerald-600" : "text-text-main"}`}
                    >
                      {entry.avg_score}
                    </span>{" "}
                    <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                      Avg Score
                    </p>{" "}
                  </div>{" "}
                </div>
              );
            })
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Community;
