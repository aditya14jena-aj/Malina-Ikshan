import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
function Profile() {
  const [badges, setBadges] = useState([]);
  const { user, logout } = useContext(AuthContext);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const badgeRes = await axios.get("http://127.0.0.1:8000/achievements");
        if (badgeRes.data) {
          setBadges(badgeRes.data);
        }
      } catch (e) {
        console.error("Failed to fetch badges", e);
      }
    };
    fetchProfileData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8 mt-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Profile
          </h1>{" "}
          <p className="text-text-muted mt-1">
            Manage your account and view achievements.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        <div className="lg:col-span-1 space-y-6">
          {" "}
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-border flex flex-col items-center text-center">
            {" "}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 text-white text-4xl font-bold">
              {" "}
              {user ? user.username.charAt(0).toUpperCase() : "U"}{" "}
            </div>{" "}
            <h2 className="text-2xl font-black text-text-main">
              {user ? user.username : "User"}
            </h2>{" "}
            <p className="text-text-muted mb-8 mt-1">Eco Warrior</p>{" "}
            <button
              onClick={logout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 px-6 rounded-xl transition shadow-sm border border-rose-100"
            >
              {" "}
              Log Out{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-2">
          {" "}
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-border">
            {" "}
            <div className="flex items-center justify-between mb-8">
              {" "}
              <h3 className="text-xl font-bold text-text-main">
                Badge Gallery
              </h3>{" "}
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider rounded-full">
                {badges.length} Unlocked
              </span>{" "}
            </div>{" "}
            {badges.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                {" "}
                <span className="text-5xl mb-4 block">🔒</span>{" "}
                <p className="font-semibold text-lg">No badges yet.</p>{" "}
                <p className="text-sm mt-1">
                  Start logging your emissions to unlock achievements!
                </p>{" "}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {" "}
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col items-center p-4 bg-surface2 rounded-2xl border border-border text-center hover:bg-emerald-50 hover:border-emerald-100 transition"
                  >
                    {" "}
                    <span className="text-4xl mb-3 drop-shadow-sm">
                      {b.icon}
                    </span>{" "}
                    <p className="font-bold text-text-main text-sm mb-1">
                      {b.name}
                    </p>{" "}
                    <p className="text-xs text-text-muted leading-tight">
                      {b.description}
                    </p>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Profile;
