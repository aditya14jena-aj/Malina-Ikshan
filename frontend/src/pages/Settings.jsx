// import React, { useState, useContext } from "react";
// import AuthContext from "../context/AuthContext";

// function Settings() {
//   const { user } = useContext(AuthContext);

//   // Profile Form State
//   const [displayName, setDisplayName] = useState(user?.username || "");
//   const [email, setEmail] = useState(user?.email || "warrior@sustainability.com");
//   const [profileSaved, setProfileSaved] = useState(false);

//   // Notifications State
//   const [notifications, setNotifications] = useState({
//     email: true,
//     achievements: true,
//     streaks: true,
//     weeklySummary: false,
//   });

//   // Application Preferences State
//   const [theme, setTheme] = useState("dark");
//   const [density, setDensity] = useState("comfortable");
//   const [aiCoach, setAiCoach] = useState(true);

//   // Sustainability Goals State
//   const [dailyTarget, setDailyTarget] = useState(5.0);
//   const [weeklyTarget, setWeeklyTarget] = useState(30.0);

//   // Danger Zone State
//   const [confirmDelete, setConfirmDelete] = useState(false);

//   const handleSaveProfile = (e) => {
//     e.preventDefault();
//     setProfileSaved(true);
//     setTimeout(() => setProfileSaved(false), 3000);
//   };

//   const handleClearCache = () => {
//     localStorage.clear();
//     alert("Local cache and history cleared successfully!");
//   };

//   const handleExportData = () => {
//     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
//       JSON.stringify({
//         user: { username: displayName, email },
//         notifications,
//         preferences: { theme, density, aiCoach },
//         goals: { dailyTarget, weeklyTarget },
//         exportedAt: new Date().toISOString()
//       }, null, 2)
//     );
//     const downloadAnchor = document.createElement('a');
//     downloadAnchor.setAttribute("href", dataStr);
//     downloadAnchor.setAttribute("download", "sustainability_data_export.json");
//     document.body.appendChild(downloadAnchor);
//     downloadAnchor.click();
//     downloadAnchor.remove();
//   };

//   const handleDeleteAccount = () => {
//     alert("Account deletion initiated. (This is a demonstration of the destructive action)");
//     setConfirmDelete(false);
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-emerald-500/30">

//       {/* Route Header Layout */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6 mb-10">
//         <div>
//           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
//             Settings
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5 text-sm">
//             Manage your account, preferences, and sustainability experience.
//           </p>
//         </div>
//       </div>

//       <div className="space-y-10">

//         {/* Profile Section */}
//         <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
//           <div className="mb-6">
//             <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">👤 Profile</h2>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
//               Update your account details and contact information.
//             </p>
//           </div>
//           <form onSubmit={handleSaveProfile} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
//                   Display Name
//                 </label>
//                 <input
//                   type="text"
//                   value={displayName}
//                   onChange={(e) => setDisplayName(e.target.value)}
//                   className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 type="submit"
//                 className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest hover:opacity-90 shadow-sm cursor-pointer"
//               >
//                 Save Changes
//               </button>
//               {profileSaved && (
//                 <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
//                   ✓ Profile saved!
//                 </span>
//               )}
//             </div>
//           </form>
//         </section>

//         {/* Notifications Section */}
//         <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
//           <div className="mb-6">
//             <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🔔 Notifications</h2>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
//               Select which notifications you'd like to receive.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { key: "email", label: "Email notifications", desc: "Periodic updates regarding your account status." },
//               { key: "achievements", label: "Achievement notifications", desc: "Get notified when you unlock a new carbon milestone." },
//               { key: "streaks", label: "Streak reminders", desc: "Reminders to log your carbon footprint daily." },
//               { key: "weeklySummary", label: "Weekly sustainability summary", desc: "A comprehensive digest of your weekly progress." }
//             ].map(({ key, label, desc }) => (
//               <div
//                 key={key}
//                 onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
//                 className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${
//                   notifications[key]
//                     ? "bg-indigo-500/5 border-indigo-500/20"
//                     : "bg-gray-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/40"
//                 }`}
//               >
//                 <div className="pr-4">
//                   <p className={`font-bold text-sm mb-1 ${notifications[key] ? "text-indigo-500 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}>
//                     {label}
//                   </p>
//                   <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
//                     {desc}
//                   </p>
//                 </div>
//                 <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${notifications[key] ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-800"}`}>
//                   <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${notifications[key] ? "translate-x-5" : "translate-x-0"}`} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Application Preferences Section */}
//         <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
//           <div className="mb-6">
//             <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">⚙️ Application Preferences</h2>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
//               Personalize your display theme, layout density, and AI features.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//             {/* Theme Selector */}
//             <div className="p-5 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl">
//               <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
//                 Theme Selector
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {["light", "dark", "system"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTheme(t)}
//                     className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
//                       theme === t
//                         ? "bg-teal-500 text-white shadow-sm"
//                         : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
//                     }`}
//                   >
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Density Selector */}
//             <div className="p-5 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl">
//               <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
//                 Interface Density
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {["compact", "comfortable"].map((d) => (
//                   <button
//                     key={d}
//                     onClick={() => setDensity(d)}
//                     className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
//                       density === d
//                         ? "bg-teal-500 text-white shadow-sm"
//                         : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
//                     }`}
//                   >
//                     {d}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* AI Coach Insights */}
//             <div
//               onClick={() => setAiCoach(!aiCoach)}
//               className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
//                 aiCoach
//                   ? "bg-teal-500/5 border-teal-500/20"
//                   : "bg-gray-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/40"
//               }`}
//             >
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
//                   AI Coach Insights
//                 </p>
//                 <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
//                   Enable predictive advice.
//                 </p>
//               </div>
//               <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${aiCoach ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-800"}`}>
//                 <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${aiCoach ? "translate-x-5" : "translate-x-0"}`} />
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* Sustainability Goals Section */}
//         <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
//           <div className="mb-6">
//             <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🌱 Sustainability Goals</h2>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
//               Adjust your targeted daily and weekly greenhouse gas emission targets.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
//                 Daily CO₂ Target (kg)
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 value={dailyTarget}
//                 onChange={(e) => setDailyTarget(parseFloat(e.target.value) || 0)}
//                 className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
//                 Weekly Reduction Target (kg)
//               </label>
//               <input
//                 type="number"
//                 step="0.5"
//                 value={weeklyTarget}
//                 onChange={(e) => setWeeklyTarget(parseFloat(e.target.value) || 0)}
//                 className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Data & Privacy Section */}
//         <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
//           <div className="mb-6">
//             <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🔒 Data & Privacy</h2>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
//               Control your data export options and application state storage.
//             </p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={handleExportData}
//               className="flex-1 bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100 dark:hover:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800/80 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
//             >
//               Export My Data (JSON)
//             </button>
//             <button
//               onClick={handleClearCache}
//               className="flex-1 bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100 dark:hover:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800/80 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
//             >
//               Clear Local Cache / History
//             </button>
//           </div>
//         </section>

//         {/* Danger Zone Section */}
//         <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-rose-500/20 dark:border-rose-500/20 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
//           <div className="mb-6">
//             <h2 className="text-xl font-black text-rose-500 dark:text-rose-400 tracking-tight">⚠️ Danger Zone</h2>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
//               Irreversible actions that modify or delete your account permissions.
//             </p>
//           </div>
//           <div className="border border-rose-500/10 dark:border-rose-500/10 bg-rose-500/5 p-6 rounded-2xl">
//             <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
//               Delete Account Permanently
//             </h3>
//             <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed mb-6">
//               This action is destructive and irreversible. You will lose all accumulated streaks, carbon statistics, leaderboard scores, and unlocked achievement badges.
//             </p>
//             {!confirmDelete ? (
//               <button
//                 onClick={() => setConfirmDelete(true)}
//                 className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
//               >
//                 Delete My Account
//               </button>
//             ) : (
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleDeleteAccount}
//                   className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer animate-pulse"
//                 >
//                   Confirm Permanent Deletion
//                 </button>
//                 <button
//                   onClick={() => setConfirmDelete(false)}
//                   className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-250 dark:hover:bg-gray-700/60 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

// export default Settings;


import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

function Settings() {
  const { user } = useContext(AuthContext);

  // Profile Form State
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    achievements: true,
    streaks: true,
    weeklySummary: false,
  });

  // Application Preferences State
  const [theme, setTheme] = useState("dark");
  const [density, setDensity] = useState("comfortable");
  const [aiCoach, setAiCoach] = useState(true);

  // Sustainability Goals State
  const [dailyTarget, setDailyTarget] = useState(5.0);
  const [weeklyTarget, setWeeklyTarget] = useState(30.0);
  const [goalsSaved, setGoalsSaved] = useState(false);

  // Danger Zone State
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load configuration parameters on mount from localStorage or fallback defaults
  useEffect(() => {
    const savedDisplayName = localStorage.getItem("settings_display_name");
    const savedEmail = localStorage.getItem("settings_email");
    const savedNotifs = localStorage.getItem("settings_notifications");
    const savedPrefs = localStorage.getItem("settings_preferences");
    const savedGoals = localStorage.getItem("settings_goals");

    setDisplayName(savedDisplayName || user?.username || "");
    setEmail(savedEmail || user?.email || "");

    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)); } catch (e) { console.error(e); }
    }
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        setTheme(prefs.theme || "dark");
        setDensity(prefs.density || "comfortable");
        setAiCoach(prefs.aiCoach !== undefined ? prefs.aiCoach : true);
      } catch (e) { console.error(e); }
    }
    if (savedGoals) {
      try {
        const goals = JSON.parse(savedGoals);
        setDailyTarget(goals.dailyTarget || 5.0);
        setWeeklyTarget(goals.weeklyTarget || 30.0);
      } catch (e) { console.error(e); }
    }
  }, [user]);

  // Feature 1: Commit Account Changes Locally
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("settings_display_name", displayName);
    localStorage.setItem("settings_email", email);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Feature 2: Interactive Switch Notification States
  const toggleNotification = (key) => {
    const updatedNotifs = { ...notifications, [key]: !notifications[key] };
    setNotifications(updatedNotifs);
    localStorage.setItem("settings_notifications", JSON.stringify(updatedNotifs));
  };

  // Feature 3: Interface Style Preference Syncing
  const handlePreferenceUpdate = (updates) => {
    const nextPrefs = {
      theme: updates.theme ?? theme,
      density: updates.density ?? density,
      aiCoach: updates.aiCoach ?? aiCoach,
    };
    localStorage.setItem("settings_preferences", JSON.stringify(nextPrefs));
  };

  // Feature 4: Emission Goal Threshold Controls
  const handleSaveGoals = (e) => {
    e.preventDefault();
    const goalsObj = { dailyTarget, weeklyTarget };
    localStorage.setItem("settings_goals", JSON.stringify(goalsObj));
    setGoalsSaved(true);

    // Dispatches a global event so other dashboard elements can recalculate lines if needed
    window.dispatchEvent(new Event("sustainDataUpdated"));
    setTimeout(() => setGoalsSaved(false), 3000);
  };

  // Feature 5: Local Cache Cleaners
  const handleClearCache = () => {
    localStorage.removeItem("settings_notifications");
    localStorage.removeItem("settings_preferences");
    localStorage.removeItem("settings_goals");
    alert("Local system state tracking cache purged successfully.");
    window.location.reload();
  };

  // Feature 6: Functional JSON Data Exporter
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        identity: { username: displayName, email },
        alert_configurations: notifications,
        ui_ux_preferences: { theme, density, aiCoach },
        environmental_goals: { dailyTarget, weeklyTarget },
        exportedAt: new Date().toISOString()
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${displayName || "eco"}_config_package.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Feature 7: Account Destruction Simulation Handler
  const handleDeleteAccount = () => {
    localStorage.clear();
    alert("Account data sequence terminated successfully. All local browser storage keys cleared.");
    setConfirmDelete(false);
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-emerald-500/30">

      {/* Route Header Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5 text-sm">
            Manage your account, preferences, and sustainability experience.
          </p>
        </div>
      </div>

      <div className="space-y-10">

        {/* Profile Section */}
        <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">👤 Profile</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Update your account details and contact information.
            </p>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest hover:opacity-90 shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
              {profileSaved && (
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
                  ✓ Profile saved!
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Notifications Section */}
        <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🔔 Notifications</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Select which notifications you'd like to receive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "email", label: "Email notifications", desc: "Periodic updates regarding your account status." },
              { key: "achievements", label: "Achievement notifications", desc: "Get notified when you unlock a new carbon milestone." },
              { key: "streaks", label: "Streak reminders", desc: "Reminders to log your carbon footprint daily." },
              { key: "weeklySummary", label: "Weekly sustainability summary", desc: "A comprehensive digest of your weekly progress." }
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                onClick={() => toggleNotification(key)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${notifications[key]
                  ? "bg-indigo-500/5 border-indigo-500/20"
                  : "bg-gray-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/40"
                  }`}
              >
                <div className="pr-4">
                  <p className={`font-bold text-sm mb-1 ${notifications[key] ? "text-indigo-500 dark:text-indigo-400" : "text-gray-900 dark:text-white"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>
                <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 shrink-0 ${notifications[key] ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-800"}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${notifications[key] ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Preferences Section */}
        <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">⚙️ Application Preferences</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Personalize your display theme, layout density, and AI features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Theme Selector */}
            <div className="p-5 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Theme Selector
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["light", "dark", "system"].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); handlePreferenceUpdate({ theme: t }); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${theme === t
                      ? "bg-teal-500 text-white shadow-sm"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Density Selector */}
            <div className="p-5 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Interface Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["compact", "comfortable"].map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDensity(d); handlePreferenceUpdate({ density: d }); }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${density === d
                      ? "bg-teal-500 text-white shadow-sm"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Coach Insights */}
            <div
              onClick={() => { setAiCoach(!aiCoach); handlePreferenceUpdate({ aiCoach: !aiCoach }); }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${aiCoach
                ? "bg-teal-500/5 border-teal-500/20"
                : "bg-gray-50/50 dark:bg-gray-950/40 border-gray-100 dark:border-gray-800/40"
                }`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  AI Coach Insights
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                  Enable predictive advice.
                </p>
              </div>
              <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 shrink-0 ${aiCoach ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-800"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${aiCoach ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </div>

          </div>
        </section>

        {/* Sustainability Goals Section */}
        <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🌱 Sustainability Goals</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Adjust your targeted daily and weekly greenhouse gas emission targets.
            </p>
          </div>
          <form onSubmit={handleSaveGoals} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Daily CO₂ Target (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Weekly Reduction Target (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest hover:opacity-90 shadow-sm cursor-pointer"
              >
                Update Targets
              </button>
              {goalsSaved && (
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
                  ✓ Targets Synchronized!
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Data & Privacy Section */}
        <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🔒 Data & Privacy</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Control your data export options and application state storage.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExportData}
              className="flex-1 bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100 dark:hover:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800/80 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
            >
              Export My Data (JSON)
            </button>
            <button
              onClick={handleClearCache}
              className="flex-1 bg-gray-50 dark:bg-gray-950/40 hover:bg-gray-100 dark:hover:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800/80 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
            >
              Clear Local Cache / History
            </button>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-rose-500/20 dark:border-rose-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-rose-500 dark:text-rose-400 tracking-tight">⚠️ Danger Zone</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Irreversible actions that modify or delete your account permissions.
            </p>
          </div>
          <div className="border border-rose-500/10 dark:border-rose-500/10 bg-rose-500/5 p-6 rounded-2xl">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
              Delete Account Permanently
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed mb-6">
              This action is destructive and irreversible. You will lose all accumulated streaks, carbon statistics, leaderboard scores, and unlocked achievement badges.
            </p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
              >
                Delete My Account
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
                >
                  Confirm Permanent Deletion
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Settings;