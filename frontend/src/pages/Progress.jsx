// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
// } from "recharts";

// function Progress() {
//   const [history, setHistory] = useState([]);
//   const [streaks, setStreaks] = useState({
//     current_streak: 0,
//     longest_streak: 0,
//   });
//   const [result, setResult] = useState(null);

//   const fetchProgressData = async () => {
//     try {
//       const response = await axios.get("http://https://malina-ikshan.onrender.com:8000/api/emissions/progress");
//       if (response.data) {
//         const historyData = response.data.history || [];
//         setHistory(historyData);
//         setStreaks(response.data.streaks || { current_streak: 0, longest_streak: 0 });
//         if (historyData.length > 0) {
//           setResult(historyData[historyData.length - 1]);
//         }
//       }
//     } catch (e) {
//       console.error("Failed to fetch progress data", e);
//     }
//   };

//   // Live Cross-Tab Synchronizer Lifecycle Engine
//   useEffect(() => {
//     fetchProgressData(); // Initial load

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         fetchProgressData();
//       }
//     };

//     window.addEventListener("focus", fetchProgressData);
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       window.removeEventListener("focus", fetchProgressData);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   // Safe numerical baseline calculations
//   const bestDay =
//     history.length > 0
//       ? history.reduce((min, p) => (Number(p.total) < Number(min.total) ? p : min), history[0])
//       : null;

//   const avgWeekly =
//     history.length > 0
//       ? (history.reduce((acc, p) => acc + Number(p.total), 0) / history.length).toFixed(2)
//       : "0.00";

//   let pctChange = 0;
//   let insightText = "Not enough data to calculate trends.";

//   if (history.length > 1) {
//     const half = Math.ceil(history.length / 2);
//     const firstHalfAvg =
//       history.slice(0, half).reduce((a, b) => a + Number(b.total), 0) / half;
//     const lastHalfAvg =
//       history.slice(half).reduce((a, b) => a + Number(b.total), 0) / history.slice(half).length;

//     if (firstHalfAvg > 0) {
//       pctChange = (((lastHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1);
//       if (pctChange < 0) {
//         insightText = `Awesome! Your footprint decreased by ${Math.abs(pctChange)}% compared to earlier this week.`;
//       } else if (pctChange > 0) {
//         insightText = `Your footprint increased by ${pctChange}% compared to earlier this week. Check your AI coach to see where to cut back.`;
//       } else {
//         insightText = `Your footprint is completely stable compared to earlier this week.`;
//       }
//     }
//   }

//   const GOAL_CO2 = 5.0;
//   let goalStatus = "";
//   let progressPct = 0;
//   let progressColor = "";

//   if (result) {
//     const currentTotal = Number(result.total);
//     if (currentTotal <= GOAL_CO2) {
//       goalStatus = "Goal Achieved! 🎉";
//       progressPct = 100;
//       progressColor = "bg-emerald-500";
//     } else {
//       const reductionNeeded = currentTotal - GOAL_CO2;
//       const reductionPct = Math.round((reductionNeeded / currentTotal) * 100);
//       goalStatus = `${reductionPct}% reduction needed`;
//       progressPct = Math.min(100, Math.round((GOAL_CO2 / currentTotal) * 100));
//       progressColor = progressPct > 70 ? "bg-amber-400" : "bg-rose-500";
//     }
//   }

//   // Format dates smoothly for XAxis charts line markers
//   const formatChartDate = (item) => {
//     if (!item) return "";
//     const rawDate = item.date || item.day || "";
//     if (rawDate.includes("-")) {
//       const parts = rawDate.split("-");
//       if (parts.length === 3) {
//         const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         const monthIdx = parseInt(parts[1], 10) - 1;
//         return `${months[monthIdx]} ${parseInt(parts[2], 10)}`;
//       }
//     }
//     return rawDate;
//   };

//   const chartData = history.map(item => ({
//     ...item,
//     formattedDate: formatChartDate(item)
//   }));

//   return (
//     <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8 mt-6">
//         <div>
//           <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
//             Progress
//           </h1>
//           <p className="text-text-muted mt-1">
//             Review your sustainability journey over time.
//           </p>
//         </div>
//       </div>

//       {result ? (
//         <>
//           <div className="mb-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-1 shadow-lg">
//             <div className="bg-surface rounded-[1.4rem] p-6 lg:p-8 h-full">
//               <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//                 <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
//                   🎯 Daily Sustainability Goal
//                 </h2>
//                 <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full self-start md:self-auto">
//                   Target: &lt; 5 kg CO₂
//                 </span>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="col-span-1 border border-border rounded-2xl p-6 bg-surface2 flex flex-col justify-center">
//                   <div className="flex justify-between items-center mb-3">
//                     <span className="text-text-muted text-sm font-semibold uppercase tracking-wider">
//                       Current
//                     </span>
//                     <span className="font-black text-xl text-text-main">
//                       {result.total} kg
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
//                     <span className="text-text-muted text-sm font-semibold uppercase tracking-wider">
//                       Goal
//                     </span>
//                     <span className="font-black text-xl text-emerald-600">
//                       5.0 kg
//                     </span>
//                   </div>
//                   <div className="text-center">
//                     <p className={`text-lg font-black bg-surface py-2 px-4 rounded-xl border ${Number(result.total) <= 5 ? "text-emerald-600 border-emerald-200" : "text-rose-600 border-rose-200"}`}>
//                       {goalStatus}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-span-1 lg:col-span-2 flex flex-col justify-center">
//                   <div className="mb-3 flex justify-between text-sm font-bold text-text-muted">
//                     <span className="uppercase tracking-wider text-text-muted">
//                       Progress towards target
//                     </span>
//                     <span className="text-emerald-600">{progressPct}%</span>
//                   </div>
//                   <div className="h-4 w-full bg-surface2 rounded-full overflow-hidden mb-10 shadow-inner">
//                     <div
//                       className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
//                       style={{ width: `${progressPct}%` }}
//                     ></div>
//                   </div>

//                   <div className="flex justify-between items-center relative mb-6">
//                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface2 -z-10 -translate-y-1/2"></div>
//                     <div className="flex flex-col items-center bg-surface px-3 relative">
//                       <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 0 ? "bg-emerald-500 text-text-main border-emerald-100" : "bg-surface2 text-text-muted border-border"}`}>
//                         1
//                       </div>
//                       <span className="text-[10px] font-bold text-text-muted uppercase absolute -bottom-4 whitespace-nowrap">
//                         Started
//                       </span>
//                     </div>

//                     <div className="flex flex-col items-center bg-surface px-3 relative">
//                       <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 50 ? "bg-emerald-500 text-text-main border-emerald-100" : "bg-surface2 text-text-muted border-border"}`}>
//                         2
//                       </div>
//                       <span className="text-[10px] font-bold text-text-muted uppercase absolute -bottom-4 whitespace-nowrap">
//                         Halfway
//                       </span>
//                     </div>

//                     <div className="flex flex-col items-center bg-surface px-3 relative">
//                       <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 100 ? "bg-emerald-500 text-text-main border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-surface2 text-text-muted border-border"}`}>
//                         🏆
//                       </div>
//                       <span className="text-[10px] font-bold text-text-muted uppercase absolute -bottom-4 whitespace-nowrap">
//                         Goal Met
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center gap-3 mb-6">
//               <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
//                 Weekly Analytics
//               </h2>
//               <span className="px-3 py-1 bg-surface2 text-text-muted text-xs font-bold uppercase tracking-wider rounded-full">
//                 Past 7 Calculations
//               </span>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//               <div className="lg:col-span-8 bg-surface p-8 rounded-3xl shadow-sm border border-border">
//                 <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">
//                   Emissions Trend (kg CO₂)
//                 </h3>
//                 <div className="h-64 w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart
//                       data={chartData}
//                       margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
//                     >
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         vertical={false}
//                         stroke="#E5E7EB"
//                       />
//                       <XAxis
//                         dataKey="formattedDate"
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6B7280", fontSize: 12 }}
//                         dy={10}
//                       />
//                       <YAxis
//                         axisLine={false}
//                         tickLine={false}
//                         tick={{ fill: "#6B7280", fontSize: 12 }}
//                         dx={-10}
//                       />
//                       <RechartsTooltip
//                         contentStyle={{
//                           borderRadius: "12px",
//                           border: "none",
//                           boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//                         }}
//                         cursor={{
//                           stroke: "#9CA3AF",
//                           strokeWidth: 1,
//                           strokeDasharray: "4 4",
//                         }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="total"
//                         stroke="#4F46E5"
//                         strokeWidth={4}
//                         dot={{
//                           fill: "#4F46E5",
//                           strokeWidth: 2,
//                           r: 4,
//                           stroke: "#FFFFFF",
//                         }}
//                         activeDot={{
//                           r: 6,
//                           fill: "#4F46E5",
//                           stroke: "#FFFFFF",
//                           strokeWidth: 2,
//                         }}
//                         animationDuration={1500}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="mt-6 flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900">
//                   <span className="text-xl">📈</span>
//                   <p className="text-sm font-medium">{insightText}</p>
//                 </div>
//               </div>

//               <div className="lg:col-span-4 space-y-6">
//                 <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
//                   <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mr-4 shrink-0">
//                     📊
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
//                       Weekly Avg
//                     </p>
//                     <h4 className="text-2xl font-black text-text-main">
//                       {avgWeekly}{" "}
//                       <span className="text-sm font-normal text-text-muted">
//                         kg CO₂
//                       </span>
//                     </h4>
//                   </div>
//                 </div>

//                 {bestDay && (
//                   <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
//                     <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mr-4 shrink-0">
//                       🏆
//                     </div>
//                     <div>
//                       <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
//                         Best Day
//                       </p>
//                       <h4 className="text-2xl font-black text-text-main">
//                         {bestDay.total}{" "}
//                         <span className="text-sm font-normal text-text-muted">
//                           kg CO₂
//                         </span>
//                       </h4>
//                       <p className="text-xs text-text-muted mt-0.5">
//                         Recorded on {formatChartDate(bestDay)}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
//                   <div className="h-14 w-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-2xl mr-4 shrink-0">
//                     🔥
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
//                       Current Streak
//                     </p>
//                     <h4 className="text-2xl font-black text-text-main">
//                       {streaks.current_streak}{" "}
//                       <span className="text-sm font-normal text-text-muted">
//                         days
//                       </span>
//                     </h4>
//                   </div>
//                 </div>

//                 <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
//                   <div className="h-14 w-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mr-4 shrink-0">
//                     ⭐
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
//                       Longest Streak
//                     </p>
//                     <h4 className="text-2xl font-black text-text-main">
//                       {streaks.longest_streak}{" "}
//                       <span className="text-sm font-normal text-text-muted">
//                         days
//                       </span>
//                     </h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="bg-surface p-12 rounded-[2rem] shadow-sm border border-border flex flex-col items-center justify-center text-center">
//           <div className="h-20 w-20 bg-surface2 rounded-full flex items-center justify-center text-4xl mb-6">
//             📉
//           </div>
//           <h2 className="text-2xl font-extrabold text-text-main mb-2">
//             No data available
//           </h2>
//           <p className="text-text-muted max-w-md mx-auto mb-8">
//             Go to the Dashboard to calculate your first footprint and unlock
//             progress tracking.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Progress;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

function Progress() {
  const [history, setHistory] = useState([]);
  const [streaks, setStreaks] = useState({ current_streak: 0, longest_streak: 0 });
  const [result, setResult] = useState(null);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/emissions/progress`);
      if (response.data && response.data.history) {
        const list = response.data.history.map(item => ({
          ...item,
          total: Number(item.total)
        }));

        setHistory(list);
        setStreaks(response.data.streaks || { current_streak: 0, longest_streak: 0 });
        if (list.length > 0) {
          setResult(list[list.length - 1]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch progress data", e);
    }
  };

  useEffect(() => {
    fetchProgressData();
    window.addEventListener("sustainDataUpdated", fetchProgressData);
    window.addEventListener("focus", fetchProgressData);

    return () => {
      window.removeEventListener("sustainDataUpdated", fetchProgressData);
      window.removeEventListener("focus", fetchProgressData);
    };
  }, []);

  const bestDay = history.length > 0 ? history.reduce((min, p) => (p.total < min.total ? p : min), history[0]) : null;
  const avgWeekly = history.length > 0 ? (history.reduce((acc, p) => acc + p.total, 0) / history.length).toFixed(2) : "--";
  let insightText = "Log your daily activities on the Dashboard to start tracking emission trends.";

  const GOAL_CO2 = 5.0;
  let goalStatus = "";
  let progressPct = 0;
  let progressColor = "";
  const currentTotal = result ? result.total : 0;

  if (!result) {
    goalStatus = "No data yet";
    progressPct = 0;
    progressColor = "bg-gray-300 dark:bg-gray-700";
  } else if (currentTotal <= GOAL_CO2) {
    goalStatus = "Target Achieved! 🎉";
    progressPct = 100;
    progressColor = "bg-emerald-500";
  } else {
    const reductionNeeded = currentTotal - GOAL_CO2;
    const reductionPct = Math.round((reductionNeeded / currentTotal) * 100);
    goalStatus = `${reductionPct}% to Target`;
    progressPct = Math.min(100, Math.round((GOAL_CO2 / currentTotal) * 100));
    progressColor = progressPct > 70 ? "bg-amber-500" : "bg-indigo-600";
  }

  const formatChartDate = (item) => {
    if (!item) return "";
    const raw = item.date || item.day || "";
    if (raw.includes("-")) {
      const parts = raw.split("-");
      if (parts.length === 3) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
      }
    }
    return raw;
  };

  const chartData = history.map(h => ({ ...h, formattedDate: formatChartDate(h) }));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-indigo-500/30">

      {/* Title Row Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Progress Tracking
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5 text-sm">
            Retrospective data structures tracking your overall decarbonization trajectory.
          </p>
        </div>
      </div>

      {/* Target Tracker Section */}
      <div className="mb-10 bg-gradient-to-br from-indigo-500/20 via-teal-500/5 to-transparent dark:from-indigo-950/40 p-0.5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/40">
        <div className="bg-white/80 dark:bg-gray-900/40 dark:backdrop-blur-xl rounded-[2.4rem] p-8 h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🎯 Environmental Milestone Matrix</h2>
            <span className="bg-indigo-500/10 dark:bg-indigo-950/60 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full self-start md:self-auto">Global Goal: &lt; 5.0 kg</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Split Metrics Card */}
            <div className="lg:col-span-4 border border-gray-100 dark:border-gray-800/60 rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-950/40 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Current Node</span>
                <span className="font-black text-base text-gray-900 dark:text-white">{currentTotal} kg</span>
              </div>
              <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-200 dark:border-gray-800/80">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Milestone Limit</span>
                <span className="font-black text-base text-indigo-500">5.0 kg</span>
              </div>
              <div className="text-center">
                <p className={`text-sm font-bold bg-white dark:bg-gray-900 py-2.5 px-4 rounded-xl border ${currentTotal <= 5 ? "text-emerald-500 border-emerald-500/20" : "text-indigo-500 border-indigo-500/20"}`}>{goalStatus}</p>
              </div>
            </div>

            {/* Micro Stepper Progression Bar */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="mb-3 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Decarbonization Efficiency</span>
                <span className="text-indigo-500">{progressPct}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden mb-8 shadow-inner">
                <div className={`h-full ${progressColor} transition-all duration-1000 ease-out`} style={{ width: `${progressPct}%` }}></div>
              </div>
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10 -translate-y-1/2"></div>
                <div className="flex flex-col items-center bg-white dark:bg-gray-900 px-3 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black border-4 ${progressPct >= 0 ? "bg-indigo-600 text-white border-indigo-100 dark:border-indigo-950" : "bg-gray-100 text-gray-400 border-gray-200"}`}>1</div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase absolute -bottom-5">Init</span>
                </div>
                <div className="flex flex-col items-center bg-white dark:bg-gray-900 px-3 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black border-4 ${progressPct >= 50 ? "bg-indigo-600 text-white border-indigo-100 dark:border-indigo-950" : "bg-gray-100 text-gray-400 border-gray-200"}`}>2</div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase absolute -bottom-5">Midway</span>
                </div>
                <div className="flex flex-col items-center bg-white dark:bg-gray-900 px-3 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-black border-4 ${progressPct >= 100 ? "bg-indigo-600 text-white border-indigo-100 dark:border-indigo-950" : "bg-gray-100 text-gray-400 border-gray-200"}`}>🏆</div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase absolute -bottom-5">Sustained</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Tracking Vector Block */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Weekly Temporal Analytics</h2>
          <span className="px-3 py-1 bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Calculations Matrix</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Trend Line Vector Layout */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.2rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Emissions Trend Curve (kg CO₂/day)</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="formattedDate" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} dx={-10} />
                    <RechartsTooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={3.5} dot={{ fill: "#4F46E5", strokeWidth: 2, r: 4, stroke: "#FFFFFF" }} activeDot={{ r: 6, fill: "#4F46E5", stroke: "#FFF" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-gray-700 dark:text-gray-300">
              <span className="text-base">📈</span>
              <p className="text-xs font-semibold leading-relaxed">{insightText}</p>
            </div>
          </div>

          {/* Aggregated Sidebar Widgets */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 flex items-center shadow-sm dark:shadow-none">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mr-4 shrink-0">📊</div>
              <div><p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Calculated Median</p><h4 className="text-xl font-black text-gray-900 dark:text-white">{avgWeekly} <span className="text-[11px] font-medium text-gray-400">kg</span></h4></div>
            </div>
            <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 flex items-center shadow-sm dark:shadow-none">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mr-4 shrink-0">🏆</div>
              <div><p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Optimized Node</p><h4 className="text-xl font-black text-gray-900 dark:text-white">{bestDay ? bestDay.total : "--"} <span className="text-[11px] font-medium text-gray-400">{bestDay ? "kg" : ""}</span></h4></div>
            </div>
            <div className="bg-white dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 flex items-center shadow-sm dark:shadow-none">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl mr-4 shrink-0">🔥</div>
              <div><p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Sequence</p><h4 className="text-xl font-black text-gray-900 dark:text-white">{streaks.current_streak} <span className="text-[11px] font-medium text-gray-400">Days</span></h4></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Progress;