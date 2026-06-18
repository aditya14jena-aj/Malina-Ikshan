// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
// } from "recharts";
// import DarkModeToggle from "../components/DarkModeToggle";
// function Dashboard() {
//   /* Inputs */ const [carKm, setCarKm] = useState("15");
//   const [busKm, setBusKm] = useState("10");
//   const [electricityKwh, setElectricityKwh] = useState("8");
//   const [dietType, setDietType] = useState("non-vegetarian");
//   /* Request state */ const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   /* Result state */ const [result, setResult] = useState(null);
//   const [coachData, setCoachData] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const generateLocalCoachAdvice = (currentResult) => {
//     const total = currentResult.total || 1.0;
//     const t_pct = Math.round((currentResult.transport / total) * 100);
//     const e_pct = Math.round((currentResult.electricity / total) * 100);
//     const d_pct = Math.round((currentResult.diet / total) * 100);
//     const score = currentResult.eco_score || 50;
//     let score_category = "";
//     let score_explanation = "";
//     if (score >= 90) {
//       score_category = "🌟 Eco Champion";
//       score_explanation = "Outstanding! Your footprint is well below average.";
//     } else if (score >= 75) {
//       score_category = "🌱 Sustainable";
//       score_explanation = "Great job! Your emissions are manageable.";
//     } else if (score >= 60) {
//       score_category = "⚖️ Moderate Impact";
//       score_explanation = "Your carbon footprint is average.";
//     } else if (score >= 40) {
//       score_category = "⚠️ High Impact";
//       score_explanation = "Your emissions are above the recommended threshold.";
//     } else {
//       score_category = "🚨 Critical Impact";
//       score_explanation = "Urgent action is needed across all categories.";
//     }
//     const pcts = { Transportation: t_pct, Electricity: e_pct, Diet: d_pct };
//     const primary = Object.keys(pcts).reduce((a, b) =>
//       pcts[a] > pcts[b] ? a : b,
//     );
//     let t_insight =
//       t_pct < 20
//         ? `Your transportation emissions are relatively low.`
//         : `Transportation accounts for ${t_pct}% of your emissions.`;
//     let e_insight =
//       e_pct < 20
//         ? `Your electricity usage is highly efficient.`
//         : `Electricity accounts for ${e_pct}% of your emissions.`;
//     let d_insight =
//       d_pct < 20
//         ? `Your diet is very eco-friendly.`
//         : `Food choices contribute ${d_pct}% of your emissions.`;
//     let highlight =
//       primary === "Transportation"
//         ? "Take public transit."
//         : primary === "Electricity"
//           ? "Unplug unused electronics."
//           : "Try a plant-based meal.";
//     return {
//       score,
//       score_category,
//       score_explanation,
//       primary_source: primary,
//       transport_insight: t_insight,
//       electricity_insight: e_insight,
//       diet_insight: d_insight,
//       highlighted_action: highlight,
//     };
//   };
//   const fetchDashboardData = async () => {
//     try {
//       const historyRes = await axios.get("http://https://malina-ikshan.onrender.com:8000/logs/weekly");
//       if (historyRes.data && historyRes.data.length > 0) {
//         const latest = historyRes.data[historyRes.data.length - 1];
//         if (!result) {
//           setResult(latest);
//           setCoachData(generateLocalCoachAdvice(latest));
//         }
//       }
//     } catch (e) {
//       console.error("Failed to fetch dashboard data", e);
//     }
//   };
//   const updateDashboard = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const logRes = await axios.post("http://https://malina-ikshan.onrender.com:8000/api/emissions/daily", {
//         car_km: parseFloat(carKm) || 0,
//         bus_km: parseFloat(busKm) || 0,
//         electricity_kwh: parseFloat(electricityKwh) || 0,
//         diet_type: dietType,
//       });

//       if (logRes.data && logRes.data.log) {
//         setResult(logRes.data.log);
//         setCoachData(generateLocalCoachAdvice(logRes.data.log));
//       }

//       if (
//         logRes.data &&
//         logRes.data.new_badges &&
//         logRes.data.new_badges.length > 0
//       ) {
//         setNotifications(logRes.data.new_badges);
//         setTimeout(() => setNotifications([]), 6000);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to sync dashboard.");
//     } finally {
//       await fetchDashboardData();
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchDashboardData();
//   }, []);
//   const transportVal = (parseFloat(carKm) || 0) * 0.2 + (parseFloat(busKm) || 0) * 0.05;
//   const electricityVal = (parseFloat(electricityKwh) || 0) * 0.4;
//   const dietVal = dietType === "vegetarian" ? 1.5 : 3.0;
//   const totalVal = transportVal + electricityVal + dietVal;

//   const displayTotal = parseFloat(totalVal.toFixed(2));
//   const displayTransport = parseFloat(transportVal.toFixed(2));
//   const displayElectricity = parseFloat(electricityVal.toFixed(2));
//   const displayDiet = parseFloat(dietVal.toFixed(2));

//   const pieChartData = [
//     { name: "Transportation", value: displayTransport, color: "#3B82F6" },
//     { name: "Electricity", value: displayElectricity, color: "#F59E0B" },
//     { name: "Diet", value: displayDiet, color: "#10B981" },
//   ].filter((item) => item.value > 0);

//   const getStatus = (total) => {
//     if (total < 5)
//       return {
//         label: "Low Impact",
//         color: "bg-emerald-50 text-emerald-700 border-emerald-200",
//         dot: "bg-emerald-500",
//       };
//     if (total <= 10)
//       return {
//         label: "Moderate Impact",
//         color: "bg-amber-50 text-amber-700 border-amber-200",
//         dot: "bg-amber-500",
//       };
//     return {
//       label: "High Impact",
//       color: "bg-rose-50 text-rose-700 border-rose-200",
//       dot: "bg-rose-500",
//     };
//   };

//   const status = getStatus(displayTotal);
//   const activeTotal = displayTotal || 1;
//   const transportPct = Math.round((displayTransport / activeTotal) * 100);
//   const electricityPct = Math.round((displayElectricity / activeTotal) * 100);
//   const dietPct = displayTotal > 0 ? Math.max(0, 100 - transportPct - electricityPct) : 0;
//   const radius = 34;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = coachData
//     ? circumference - (coachData.score / 100) * circumference
//     : circumference;
//   const getScoreStrokeColor = (score) => {
//     if (score >= 90) return "text-emerald-400";
//     if (score >= 75) return "text-green-500";
//     if (score >= 60) return "text-amber-400";
//     if (score >= 40) return "text-orange-500";
//     return "text-rose-500";
//   };
//   const getScoreBadgeColor = (score) => {
//     if (score >= 90)
//       return "bg-emerald-50 text-emerald-700 border border-emerald-200";
//     if (score >= 75)
//       return "bg-green-50 text-green-700 border border-green-200";
//     if (score >= 60)
//       return "bg-amber-50 text-amber-700 border border-amber-200";
//     else if (score >= 40)
//       return "bg-orange-50 text-orange-700 border border-orange-200";
//     return "bg-rose-50 text-rose-700 border border-rose-200";
//   };
//   return (
//     <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
//       {" "}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8 mt-6">
//         {" "}
//         <div>
//           {" "}
//           <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
//             Dashboard
//           </h1>{" "}
//           <p className="text-text-muted mt-1">
//             Track and calculate your daily emissions.
//           </p>{" "}
//         </div>{" "}
//         <div className="flex items-center gap-4 mt-4 md:mt-0">
//           {" "}
//           <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium bg-surface shadow-sm text-text-muted">
//             {" "}
//             <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
//             AI Coach Live{" "}
//           </span>{" "}
//           <DarkModeToggle />{" "}
//         </div>{" "}
//       </div>{" "}
//       {notifications.length > 0 && (
//         <div className="fixed bottom-4 right-4 z-50 space-y-2">
//           {" "}
//           {notifications.map((b, i) => (
//             <div
//               key={i}
//               className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce"
//             >
//               {" "}
//               <span className="text-3xl">{b.icon}</span>{" "}
//               <div>
//                 {" "}
//                 <p className="font-bold">Badge Unlocked!</p>{" "}
//                 <p className="text-sm">{b.name}</p>{" "}
//               </div>{" "}
//             </div>
//           ))}{" "}
//         </div>
//       )}{" "}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
//         {" "}
//         <div className="lg:col-span-4 space-y-6">
//           {" "}
//           {result && (
//             <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
//               {" "}
//               <div className="absolute -right-10 -top-10 h-40 w-40 bg-surface opacity-10 rounded-full blur-2xl"></div>{" "}
//               <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-teal-400 opacity-20 rounded-full blur-2xl"></div>{" "}
//               <div className="relative z-10 flex flex-col items-center text-center">
//                 {" "}
//                 <span
//                   className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border border-white/20 flex-wrap ${status.color.replace("bg-", "bg-surface/90 text-").replace("text-", "text-").replace("border-", "")}`}
//                 >
//                   {" "}
//                   <span
//                     className={`inline-block h-2 w-2 rounded-full mr-2 ${status.dot}`}
//                   ></span>{" "}
//                   {status.label}{" "}
//                 </span>{" "}
//                 <p className="text-emerald-100 font-semibold tracking-wide uppercase text-xs mb-1">
//                   Today's Footprint
//                 </p>{" "}
//                 <div className="flex items-baseline justify-center gap-2 mb-2">
//                   {" "}
//                   <h2 className="text-6xl font-black tracking-tighter">
//                     {displayTotal}
//                   </h2>{" "}
//                   <span className="text-xl font-bold text-emerald-200">
//                     kg CO₂
//                   </span>{" "}
//                   <span className="text-xs text-white/60 ml-2 block">
//                     (live)
//                   </span>{" "}
//                 </div>{" "}
//               </div>{" "}
//             </div>
//           )}{" "}
//           <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border">
//             {" "}
//             <h2 className="text-lg font-bold text-text-main mb-4">
//               Update Activities
//             </h2>{" "}
//             {error && (
//               <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs">
//                 {" "}
//                 {error}{" "}
//               </div>
//             )}{" "}
//             <form onSubmit={updateDashboard} className="space-y-4">
//               {" "}
//               <div>
//                 {" "}
//                 <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
//                   Car Travel (km)
//                 </label>{" "}
//                 <input
//                   type="number"
//                   min="0"
//                   step="any"
//                   value={carKm}
//                   onChange={(e) => setCarKm(e.target.value)}
//                   className="w-full px-3 py-2 border border-border bg-surface text-text-main rounded-lg outline-none text-sm"
//                 />{" "}
//               </div>{" "}
//               <div>
//                 {" "}
//                 <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
//                   Bus Travel (km)
//                 </label>{" "}
//                 <input
//                   type="number"
//                   min="0"
//                   step="any"
//                   value={busKm}
//                   onChange={(e) => setBusKm(e.target.value)}
//                   className="w-full px-3 py-2 border border-border bg-surface text-text-main rounded-lg outline-none text-sm"
//                 />{" "}
//               </div>{" "}
//               <div>
//                 {" "}
//                 <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
//                   Electricity (kWh)
//                 </label>{" "}
//                 <input
//                   type="number"
//                   min="0"
//                   step="any"
//                   value={electricityKwh}
//                   onChange={(e) => setElectricityKwh(e.target.value)}
//                   className="w-full px-3 py-2 border border-border bg-surface text-text-main rounded-lg outline-none text-sm"
//                 />{" "}
//               </div>{" "}
//               <div>
//                 {" "}
//                 <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
//                   Diet Type
//                 </label>{" "}
//                 <div className="grid grid-cols-2 gap-2">
//                   {" "}
//                   <button
//                     type="button"
//                     onClick={() => setDietType("vegetarian")}
//                     className={`py-2 px-3 text-xs font-bold rounded-lg border transition duration-200 shadow-sm ${dietType === "vegetarian"
//                       ? "bg-emerald-600 border-emerald-600 text-white ring-2 ring-emerald-500/20"
//                       : "bg-surface border-border text-text-muted hover:bg-surface2"
//                       }`}
//                   >
//                     Vegetarian
//                   </button>{" "}
//                   <button
//                     type="button"
//                     onClick={() => setDietType("non-vegetarian")}
//                     className={`py-2 px-3 text-xs font-bold rounded-lg border transition duration-200 shadow-sm ${dietType === "non-vegetarian"
//                       ? "bg-emerald-600 border-emerald-600 text-white ring-2 ring-emerald-500/20"
//                       : "bg-surface border-border text-text-muted hover:bg-surface2"
//                       }`}
//                   >
//                     Non-Veg
//                   </button>{" "}
//                 </div>{" "}
//               </div>{" "}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all duration-200 disabled:bg-slate-500 mt-4 border-none"
//               >
//                 {" "}
//                 {loading ? "Optimizing..." : "Sync Dashboard"}{" "}
//               </button>{" "}
//             </form>{" "}
//           </div>{" "}
//         </div>{" "}
//         <div className="lg:col-span-8 space-y-6">
//           {" "}
//           {!result ? (
//             <div className="bg-surface p-12 rounded-[2rem] shadow-sm border border-border flex flex-col items-center justify-center text-center h-full min-h-[400px]">
//               {" "}
//               <div className="h-20 w-20 bg-surface2 rounded-full flex items-center justify-center text-4xl mb-6">
//                 🌱
//               </div>{" "}
//               <h2 className="text-2xl font-extrabold text-text-main mb-2">
//                 No activity recorded yet
//               </h2>{" "}
//               <p className="text-text-muted max-w-md mx-auto mb-8">
//                 Complete your first carbon calculation to start tracking your
//                 sustainability journey.
//               </p>{" "}
//               <button
//                 onClick={updateDashboard}
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md"
//               >
//                 {" "}
//                 Calculate First Footprint{" "}
//               </button>{" "}
//             </div>
//           ) : (
//             <>
//               {" "}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {" "}
//                 <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border">
//                   {" "}
//                   <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-5">
//                     Emissions Breakdown
//                   </h3>{" "}
//                   <div className="space-y-4">
//                     {" "}
//                     <div className="flex justify-between items-center text-sm">
//                       {" "}
//                       <span className="text-text-muted flex items-center gap-3">
//                         <span className="flex items-center justify-center bg-blue-50 text-blue-500 h-8 w-8 rounded-full">
//                           🚗
//                         </span>
//                         Transportation
//                       </span>{" "}
//                       <span className="font-bold text-text-main">
//                         {displayTransport} kg{" "}
//                         <span className="text-text-muted font-normal ml-1">
//                           ({transportPct}%)
//                         </span>
//                       </span>{" "}
//                     </div>{" "}
//                     <div className="flex justify-between items-center text-sm">
//                       {" "}
//                       <span className="text-text-muted flex items-center gap-3">
//                         <span className="flex items-center justify-center bg-amber-50 text-amber-500 h-8 w-8 rounded-full">
//                           ⚡
//                         </span>
//                         Electricity
//                       </span>{" "}
//                       <span className="font-bold text-text-main">
//                         {displayElectricity} kg{" "}
//                         <span className="text-text-muted font-normal ml-1">
//                           ({electricityPct}%)
//                         </span>
//                       </span>{" "}
//                     </div>{" "}
//                     <div className="flex justify-between items-center text-sm">
//                       {" "}
//                       <span className="text-text-muted flex items-center gap-3">
//                         <span className="flex items-center justify-center bg-emerald-50 text-emerald-500 h-8 w-8 rounded-full">
//                           🍽
//                         </span>
//                         Diet
//                       </span>{" "}
//                       <span className="font-bold text-text-main">
//                         {displayDiet} kg{" "}
//                         <span className="text-text-muted font-normal ml-1">
//                           ({dietPct}%)
//                         </span>
//                       </span>{" "}
//                     </div>{" "}
//                   </div>{" "}
//                 </div>{" "}
//                 <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex flex-col items-center justify-between">
//                   {" "}
//                   <div className="w-full">
//                     {" "}
//                     <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
//                       Contribution Share
//                     </h3>{" "}
//                   </div>{" "}
//                   <div className="w-full h-40">
//                     {" "}
//                     <ResponsiveContainer width="100%" height="100%">
//                       {" "}
//                       <PieChart>
//                         {" "}
//                         <Pie
//                           data={pieChartData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={45}
//                           outerRadius={65}
//                           paddingAngle={4}
//                           dataKey="value"
//                         >
//                           {" "}
//                           {pieChartData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}{" "}
//                         </Pie>{" "}
//                         <RechartsTooltip
//                           formatter={(value) => [
//                             `${value} kg CO₂`,
//                             "Emissions",
//                           ]}
//                           contentStyle={{
//                             borderRadius: "12px",
//                             border: "1px solid #E5E7EB",
//                           }}
//                         />{" "}
//                       </PieChart>{" "}
//                     </ResponsiveContainer>{" "}
//                   </div>{" "}
//                 </div>{" "}
//               </div>{" "}
//               {coachData && (
//                 <div className="bg-surface/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-border relative overflow-hidden">
//                   {" "}
//                   <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"></div>{" "}
//                   <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
//                     {" "}
//                     <div>
//                       {" "}
//                       <div className="flex items-center gap-3 mb-2">
//                         {" "}
//                         <h3 className="text-2xl font-extrabold text-text-main tracking-tight">
//                           🤖 AI Sustainability Coach
//                         </h3>{" "}
//                         <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-text-main text-[10px] uppercase font-black tracking-widest rounded-full shadow-md">
//                           Powered by AI
//                         </span>{" "}
//                       </div>{" "}
//                       <p className="text-text-muted text-sm">
//                         Personalized, data-driven strategies to lower your
//                         ecological footprint.
//                       </p>{" "}
//                     </div>{" "}
//                     <div className="flex flex-row items-center gap-5 bg-surface/60 p-4 rounded-3xl border border-border shadow-sm backdrop-blur-md">
//                       {" "}
//                       <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
//                         {" "}
//                         <svg className="transform -rotate-90 w-20 h-20">
//                           {" "}
//                           <circle
//                             cx="40"
//                             cy="40"
//                             r="34"
//                             stroke="currentColor"
//                             strokeWidth="6"
//                             fill="transparent"
//                             className="text-gray-100"
//                           />{" "}
//                           <circle
//                             cx="40"
//                             cy="40"
//                             r="34"
//                             stroke="currentColor"
//                             strokeWidth="6"
//                             fill="transparent"
//                             strokeDasharray={circumference}
//                             strokeDashoffset={strokeDashoffset}
//                             className={`transition-all duration-1000 ease-in-out ${getScoreStrokeColor(coachData.score)}`}
//                             strokeLinecap="round"
//                           />{" "}
//                         </svg>{" "}
//                         <div className="absolute flex flex-col items-center justify-center">
//                           {" "}
//                           <span className="text-xl font-black text-text-main leading-none">
//                             {coachData.score}
//                           </span>{" "}
//                           <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold mt-0.5">
//                             / 100
//                           </span>{" "}
//                         </div>{" "}
//                       </div>{" "}
//                       <div className="flex-1 min-w-0">
//                         {" "}
//                         <div
//                           className={`inline-flex flex-wrap items-center px-3 py-1 rounded-full text-xs font-bold mb-1.5 whitespace-normal break-words ${getScoreBadgeColor(coachData.score)}`}
//                         >
//                           {coachData.score_category}
//                         </div>{" "}
//                         <p className="text-[11px] text-text-muted leading-snug">
//                           {coachData.score_explanation}
//                         </p>{" "}
//                       </div>{" "}
//                     </div>{" "}
//                   </div>{" "}
//                   <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-2xl border border-indigo-100/50 relative overflow-hidden shadow-sm">
//                     {" "}
//                     <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>{" "}
//                     <div className="flex gap-4 items-start">
//                       {" "}
//                       <div className="text-2xl bg-surface p-2.5 rounded-xl shadow-sm border border-indigo-50">
//                         💡
//                       </div>{" "}
//                       <div>
//                         {" "}
//                         <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
//                           Top Priority Action
//                         </h4>{" "}
//                         <p className="text-indigo-900 font-semibold leading-relaxed text-sm">
//                           {coachData.highlighted_action}
//                         </p>{" "}
//                       </div>{" "}
//                     </div>{" "}
//                   </div>{" "}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {" "}
//                     <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300">
//                       {" "}
//                       <div className="flex items-center gap-3 mb-4">
//                         <span className="flex items-center justify-center bg-blue-50 text-blue-500 h-10 w-10 rounded-xl text-lg">
//                           🚗
//                         </span>
//                         <h4 className="font-bold text-text-main text-sm">
//                           Transportation
//                         </h4>
//                       </div>{" "}
//                       <p className="text-sm text-text-muted leading-relaxed">
//                         {coachData.transport_insight}
//                       </p>{" "}
//                     </div>{" "}
//                     <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300">
//                       {" "}
//                       <div className="flex items-center gap-3 mb-4">
//                         <span className="flex items-center justify-center bg-amber-50 text-amber-500 h-10 w-10 rounded-xl text-lg">
//                           ⚡
//                         </span>
//                         <h4 className="font-bold text-text-main text-sm">
//                           Electricity
//                         </h4>
//                       </div>{" "}
//                       <p className="text-sm text-text-muted leading-relaxed">
//                         {coachData.electricity_insight}
//                       </p>{" "}
//                     </div>{" "}
//                     <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300">
//                       {" "}
//                       <div className="flex items-center gap-3 mb-4">
//                         <span className="flex items-center justify-center bg-emerald-50 text-emerald-500 h-10 w-10 rounded-xl text-lg">
//                           🍽
//                         </span>
//                         <h4 className="font-bold text-text-main text-sm">
//                           Diet
//                         </h4>
//                       </div>{" "}
//                       <p className="text-sm text-text-muted leading-relaxed">
//                         {coachData.diet_insight}
//                       </p>{" "}
//                     </div>{" "}
//                   </div>{" "}
//                 </div>
//               )}{" "}
//             </>
//           )}{" "}
//         </div>{" "}
//       </div>{" "}
//     </div>
//   );
// }
// export default Dashboard;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as RechartsTooltip,
// } from "recharts";
// import DarkModeToggle from "../components/DarkModeToggle";

// function Dashboard() {
//   /* Inputs */
//   const [carKm, setCarKm] = useState("15");
//   const [busKm, setBusKm] = useState("10");
//   const [electricityKwh, setElectricityKwh] = useState("8");
//   const [dietType, setDietType] = useState("non-vegetarian");

//   /* Request state */
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   /* Result state */
//   const [result, setResult] = useState(null);
//   const [coachData, setCoachData] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   // Dynamically compute values in real-time right here
//   const transportVal = (parseFloat(carKm) || 0) * 0.2 + (parseFloat(busKm) || 0) * 0.05;
//   const electricityVal = (parseFloat(electricityKwh) || 0) * 0.4;
//   const dietVal = dietType === "vegetarian" ? 1.5 : 3.0;
//   const totalVal = parseFloat((transportVal + electricityVal + dietVal).toFixed(2));

//   const displayTransport = parseFloat(transportVal.toFixed(2));
//   const displayElectricity = parseFloat(electricityVal.toFixed(2));
//   const displayDiet = parseFloat(dietVal.toFixed(2));

//   const generateLocalCoachAdvice = (scoreValue) => {
//     const score = scoreValue || 65;
//     let score_category = "";
//     let score_explanation = "";

//     if (score >= 90) {
//       score_category = "🌟 Eco Champion";
//       score_explanation = "Outstanding! Your footprint is well below average.";
//     } else if (score >= 75) {
//       score_category = "🌱 Sustainable";
//       score_explanation = "Great job! Your emissions are manageable.";
//     } else if (score >= 60) {
//       score_category = "⚖️ Moderate Impact";
//       score_explanation = "Your carbon footprint is average.";
//     } else {
//       score_category = "⚠️ High Impact";
//       score_explanation = "Your emissions are above the recommended threshold.";
//     }

//     return {
//       score,
//       score_category,
//       score_explanation,
//       highlighted_action: totalVal > 5 ? "Try cutting down car travel or switching to vegetarian options today!" : "Awesome setup! Keep doing what you're doing.",
//       transport_insight: `Transit accounts for ${Math.round((displayTransport / (totalVal || 1)) * 100)}% of your day.`,
//       electricity_insight: `Power grid use accounts for ${Math.round((displayElectricity / (totalVal || 1)) * 100)}% of your day.`,
//       diet_insight: `Food choices account for ${Math.round((displayDiet / (totalVal || 1)) * 100)}% of your day.`,
//     };
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const historyRes = await axios.get("http://https://malina-ikshan.onrender.com:8000/api/emissions/progress");
//       if (historyRes.data && historyRes.data.history && historyRes.data.history.length > 0) {
//         const latest = historyRes.data.history[historyRes.data.history.length - 1];
//         setResult(latest);
//         setCoachData(generateLocalCoachAdvice(latest.eco_score));
//       }
//     } catch (e) {
//       console.error("Failed to fetch dashboard data", e);
//     }
//   };

//   const updateDashboard = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const logRes = await axios.post("http://https://malina-ikshan.onrender.com:8000/api/emissions/daily", {
//         car_km: parseFloat(carKm) || 0,
//         bus_km: parseFloat(busKm) || 0,
//         electricity_kwh: parseFloat(electricityKwh) || 0,
//         diet_type: dietType,
//       });

//       if (logRes.data && logRes.data.log) {
//         setResult(logRes.data.log);
//         setCoachData(generateLocalCoachAdvice(logRes.data.log.eco_score));
//       }

//       // Notify components instantly via standard browser channel
//       window.dispatchEvent(new Event("sustainDataUpdated"));

//       if (logRes.data && logRes.data.new_badges && logRes.data.new_badges.length > 0) {
//         setNotifications(logRes.data.new_badges);
//         setTimeout(() => setNotifications([]), 6000);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to sync dashboard.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   useEffect(() => {
//     // Keep internal coach advice totally synchronized with your input numbers instantly
//     setCoachData(generateLocalCoachAdvice(result?.eco_score || 72));
//   }, [carKm, busKm, electricityKwh, dietType, result]);

//   const pieChartData = [
//     { name: "Transportation", value: displayTransport, color: "#3B82F6" },
//     { name: "Electricity", value: displayElectricity, color: "#F59E0B" },
//     { name: "Diet", value: displayDiet, color: "#10B981" },
//   ].filter((item) => item.value > 0);

//   const getStatus = (total) => {
//     if (total < 5) return { label: "Low Impact", color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30", dot: "bg-emerald-500" };
//     if (total <= 10) return { label: "Moderate Impact", color: "bg-amber-500/20 text-amber-500 border-amber-500/30", dot: "bg-amber-500" };
//     return { label: "High Impact", color: "bg-rose-500/20 text-rose-500 border-rose-500/30", dot: "bg-rose-500" };
//   };

//   const status = getStatus(totalVal);
//   const transportPct = Math.round((displayTransport / (totalVal || 1)) * 100);
//   const electricityPct = Math.round((displayElectricity / (totalVal || 1)) * 100);
//   const dietPct = totalVal > 0 ? Math.max(0, 100 - transportPct - electricityPct) : 0;
//   const circumference = 2 * Math.PI * 34;
//   const strokeDashoffset = coachData ? circumference - (coachData.score / 100) * circumference : circumference;

//   return (
//     <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12 transition-colors duration-200">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 mt-6">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
//           <p className="text-gray-500 dark:text-gray-400 mt-1">Track and calculate your daily emissions.</p>
//         </div>
//         <div className="flex items-center gap-4 mt-4 md:mt-0">
//           <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium bg-white dark:bg-gray-900 shadow-sm text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800">
//             <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
//             AI Coach Live
//           </span>
//           <DarkModeToggle />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
//             <div className="absolute -right-10 -top-10 h-40 w-40 bg-white opacity-10 rounded-full blur-2xl"></div>
//             <div className="relative z-10 flex flex-col items-center text-center">
//               <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border ${status.color}`}>
//                 <span className={`inline-block h-2 w-2 rounded-full mr-2 ${status.dot}`}></span>
//                 {status.label}
//               </span>
//               <p className="text-emerald-100 font-semibold tracking-wide uppercase text-xs mb-1">Today's Footprint</p>
//               <div className="flex items-baseline justify-center gap-2 mb-2">
//                 <h2 className="text-6xl font-black tracking-tighter">{totalVal}</h2>
//                 <span className="text-xl font-bold text-emerald-200">kg CO₂</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Update Activities</h2>
//             {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-xs">{error}</div>}
//             <form onSubmit={updateDashboard} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Car Travel (km)</label>
//                 <input type="number" min="0" step="any" value={carKm} onChange={(e) => setCarKm(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg outline-none text-sm focus:border-emerald-500" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Bus Travel (km)</label>
//                 <input type="number" min="0" step="any" value={busKm} onChange={(e) => setBusKm(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg outline-none text-sm focus:border-emerald-500" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Electricity (kWh)</label>
//                 <input type="number" min="0" step="any" value={electricityKwh} onChange={(e) => setElectricityKwh(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg outline-none text-sm focus:border-emerald-500" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Diet Type</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <button type="button" onClick={() => setDietType("vegetarian")} className={`py-2 px-3 text-xs font-bold rounded-lg border transition duration-200 shadow-sm ${dietType === "vegetarian" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>Vegetarian</button>
//                   <button type="button" onClick={() => setDietType("non-vegetarian")} className={`py-2 px-3 text-xs font-bold rounded-lg border transition duration-200 shadow-sm ${dietType === "non-vegetarian" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>Non-Veg</button>
//                 </div>
//               </div>
//               <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all duration-200 disabled:bg-slate-500 mt-4 border-none cursor-pointer">{loading ? "Optimizing..." : "Sync Dashboard"}</button>
//             </form>
//           </div>
//         </div>

//         <div className="lg:col-span-8 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
//               <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Emissions Breakdown</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-gray-600 dark:text-gray-400 flex items-center gap-3"><span className="flex items-center justify-center bg-blue-500/10 text-blue-500 h-8 w-8 rounded-full">🚗</span>Transportation</span>
//                   <span className="font-bold text-gray-900 dark:text-white">{displayTransport} kg <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({transportPct}%)</span></span>
//                 </div>
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-gray-600 dark:text-gray-400 flex items-center gap-3"><span className="flex items-center justify-center bg-amber-500/10 text-amber-500 h-8 w-8 rounded-full">⚡</span>Electricity</span>
//                   <span className="font-bold text-gray-900 dark:text-white">{displayElectricity} kg <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({electricityPct}%)</span></span>
//                 </div>
//                 <div className="flex justify-between items-center text-sm">
//                   <span className="text-gray-600 dark:text-gray-400 flex items-center gap-3"><span className="flex items-center justify-center bg-emerald-500/10 text-emerald-500 h-8 w-8 rounded-full">🍽</span>Diet</span>
//                   <span className="font-bold text-gray-900 dark:text-white">{displayDiet} kg <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({dietPct}%)</span></span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center min-h-[180px]">
//               <div className="w-full text-left mb-2"><h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contribution Share</h3></div>
//               <div className="w-full h-36">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
//                       {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                     </Pie>
//                     <RechartsTooltip formatter={(value) => [`${value} kg CO₂`, "Emissions"]} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {coachData && (
//             <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"></div>
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">🤖 AI Sustainability Coach</h3>
//                     <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-md">Powered by AI</span>
//                   </div>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">Personalized, data-driven strategies to lower your ecological footprint.</p>
//                 </div>
//                 <div className="flex flex-row items-center gap-5 bg-gray-50 dark:bg-gray-950 p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
//                   <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
//                     <svg className="transform -rotate-90 w-20 h-20">
//                       <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200 dark:text-gray-800" />
//                       <circle cx="40" cy="40" r="34" stroke="#10B981" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
//                     </svg>
//                     <div className="absolute flex flex-col items-center justify-center">
//                       <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{coachData.score}</span>
//                       <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mt-0.5">/ 100</span>
//                     </div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">{coachData.score_category}</div>
//                     <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{coachData.score_explanation}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-8 p-5 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10 relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
//                 <div className="flex gap-4 items-start">
//                   <div className="text-2xl bg-white dark:bg-gray-950 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800">💡</div>
//                   <div>
//                     <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Top Priority Action</h4>
//                     <p className="text-gray-900 dark:text-white font-semibold text-sm leading-relaxed">{coachData.highlighted_action}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"><div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center bg-blue-500/10 text-blue-500 h-10 w-10 rounded-xl text-lg">🚗</span><h4 className="font-bold text-gray-900 dark:text-white text-sm">Transportation</h4></div><p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{coachData.transport_insight}</p></div>
//                 <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"><div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center bg-amber-500/10 text-amber-500 h-10 w-10 rounded-xl text-lg">⚡</span><h4 className="font-bold text-gray-900 dark:text-white text-sm">Electricity</h4></div><p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{coachData.electricity_insight}</p></div>
//                 <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"><div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center bg-emerald-500/10 text-emerald-500 h-10 w-10 rounded-xl text-lg">🍽</span><h4 className="font-bold text-gray-900 dark:text-white text-sm">Diet</h4></div><p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{coachData.diet_insight}</p></div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Dashboard;

//     VERSION UPDATION

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import DarkModeToggle from "../components/DarkModeToggle";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  /* Inputs */
  const [carKm, setCarKm] = useState("15");
  const [busKm, setBusKm] = useState("10");
  const [electricityKwh, setElectricityKwh] = useState("8");
  const [dietType, setDietType] = useState("non-vegetarian");

  /* Request state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Result state */
  const [result, setResult] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const transportVal = (parseFloat(carKm) || 0) * 0.2 + (parseFloat(busKm) || 0) * 0.05;
  const electricityVal = (parseFloat(electricityKwh) || 0) * 0.4;
  const dietVal = dietType === "vegetarian" ? 1.5 : 3.0;
  const totalVal = parseFloat((transportVal + electricityVal + dietVal).toFixed(2));

  const displayTransport = parseFloat(transportVal.toFixed(2));
  const displayElectricity = parseFloat(electricityVal.toFixed(2));
  const displayDiet = parseFloat(dietVal.toFixed(2));

  const generateLocalCoachAdvice = (scoreValue) => {
    const score = scoreValue || 67;
    let score_category = "";
    let score_explanation = "";

    if (score >= 90) {
      score_category = "🌟 Eco Champion";
      score_explanation = "Outstanding efficiency! You're setting a golden standard.";
    } else if (score >= 75) {
      score_category = "🌱 Sustainable";
      score_explanation = "Great job! Your footprint is under careful management.";
    } else if (score >= 60) {
      score_category = "⚖️ Moderate Impact";
      score_explanation = "Your carbon footprint is hovering around the standard baseline.";
    } else {
      score_category = "⚠️ High Impact";
      score_explanation = "Emissions exceed safe thresholds. Immediate optimization recommended.";
    }

    return {
      score,
      score_category,
      score_explanation,
      highlighted_action: totalVal > 5 ? "Consider substituting short car trips with transit or switching up a meal to plant-based options today." : "Exceptional parameters. Maintain your current active regimen!",
      transport_insight: `Transit accounts for ${Math.round((displayTransport / (totalVal || 1)) * 100)}% of your daily output.`,
      electricity_insight: `Power grid draw commands ${Math.round((displayElectricity / (totalVal || 1)) * 100)}% of your total footprint.`,
      diet_insight: `Dietary choices generate ${Math.round((displayDiet / (totalVal || 1)) * 100)}% of today's impact.`,
    };
  };

  const fetchDashboardData = async () => {
    try {
      const historyRes = await axios.get(`${API_URL}/api/emissions/progress`);
      if (historyRes.data && historyRes.data.history && historyRes.data.history.length > 0) {
        const latest = historyRes.data.history[historyRes.data.history.length - 1];
        setResult(latest);
        setCoachData(generateLocalCoachAdvice(latest.eco_score));
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    }
  };

  const updateDashboard = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const logRes = await axios.post(`${API_URL}/api/emissions/daily`, {
        car_km: parseFloat(carKm) || 0,
        bus_km: parseFloat(busKm) || 0,
        electricity_kwh: parseFloat(electricityKwh) || 0,
        diet_type: dietType,
      });

      if (logRes.data && logRes.data.log) {
        setResult(logRes.data.log);
        setCoachData(generateLocalCoachAdvice(logRes.data.log.eco_score));
      }

      window.dispatchEvent(new Event("sustainDataUpdated"));

      if (logRes.data && logRes.data.new_badges && logRes.data.new_badges.length > 0) {
        setNotifications(logRes.data.new_badges);
        setTimeout(() => setNotifications([]), 6000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to synchronize metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setCoachData(generateLocalCoachAdvice(result?.eco_score || 67));
  }, [carKm, busKm, electricityKwh, dietType, result]);

  const pieChartData = [
    { name: "Transportation", value: displayTransport, color: "#3B82F6" },
    { name: "Electricity", value: displayElectricity, color: "#F59E0B" },
    { name: "Diet", value: displayDiet, color: "#10B981" },
  ].filter((item) => item.value > 0);

  const getStatus = (total) => {
    if (total < 5) return { label: "Low Impact", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" };
    if (total <= 10) return { label: "Moderate Impact", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" };
    return { label: "High Impact", color: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "bg-rose-400" };
  };

  const status = getStatus(totalVal);
  const transportPct = Math.round((displayTransport / (totalVal || 1)) * 100);
  const electricityPct = Math.round((displayElectricity / (totalVal || 1)) * 100);
  const dietPct = totalVal > 0 ? Math.max(0, 100 - transportPct - electricityPct) : 0;
  const circumference = 2 * Math.PI * 34;
  const strokeDashoffset = coachData ? circumference - (coachData.score / 100) * circumference : circumference;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 pt-4 transition-all duration-300 antialiased selection:bg-emerald-500/30">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800/60 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Malina-Ikshan Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5 text-sm">
            Monitor, calculate, and neutralize your active footprint footprint metrics.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold bg-white/60 dark:bg-gray-900/60 backdrop-blur-md text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI Engine Connected
          </span>
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Interactive Control Column */}
        <div className="lg:col-span-4 space-y-8">

          {/* Main Footprint Readout Card */}
          <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 dark:from-emerald-600 dark:via-teal-800 dark:to-cyan-950 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-500/10 dark:shadow-none relative overflow-hidden group border border-emerald-400/20">
            <div className="absolute -right-6 -top-6 h-36 w-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-8 border ${status.color}`}>
                <span className={`h-2 w-2 rounded-full mr-2.5 ${status.dot}`}></span>
                {status.label}
              </span>
              <p className="text-emerald-100/80 font-bold tracking-widest uppercase text-[10px] mb-1">Today's Total Footprint</p>
              <div className="flex items-baseline justify-center gap-2">
                <h2 className="text-7xl font-black tracking-tight bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
                  {totalVal}
                </h2>
                <span className="text-xl font-extrabold text-emerald-200">kg CO₂</span>
              </div>
            </div>
          </div>

          {/* Activity Matrix Configuration Panel */}
          <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-7 rounded-[2.2rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight mb-5 flex items-center gap-2">
              <span>⚡</span> Activity Parameters
            </h2>
            {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium">{error}</div>}

            <form onSubmit={updateDashboard} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Car Logistics (KM)</label>
                <input type="number" min="0" step="any" value={carKm} onChange={(e) => setCarKm(e.target.value)} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white rounded-xl outline-none text-sm font-semibold focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Public Bus (KM)</label>
                <input type="number" min="0" step="any" value={busKm} onChange={(e) => setBusKm(e.target.value)} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white rounded-xl outline-none text-sm font-semibold focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Grid Electricity (KWH)</label>
                <input type="number" min="0" step="any" value={electricityKwh} onChange={(e) => setElectricityKwh(e.target.value)} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white rounded-xl outline-none text-sm font-semibold focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">Dietary Profile</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setDietType("vegetarian")} className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-200 ${dietType === "vegetarian" ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/10" : "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Vegetarian</button>
                  <button type="button" onClick={() => setDietType("non-vegetarian")} className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-200 ${dietType === "non-vegetarian" ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/10" : "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Omnivore / Non-Veg</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/10 transition-all duration-200 disabled:from-gray-600 disabled:to-gray-700 mt-4 border-none cursor-pointer">
                {loading ? "Recalculating Data..." : "Synchronize Metrics"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Data Presentation Core Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Charts & Metric Splits Card Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Split Breakdown Details */}
            <div className="md:col-span-7 bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-7 rounded-[2.2rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Emissions Component Mix</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-50/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 p-4 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold flex items-center gap-3.5">
                      <span className="flex items-center justify-center bg-blue-500/10 text-blue-400 h-9 w-9 rounded-xl text-base">🚗</span> Transportation
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{displayTransport} <span className="text-gray-400 dark:text-gray-500 font-medium text-xs ml-1">kg ({transportPct}%)</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 p-4 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold flex items-center gap-3.5">
                      <span className="flex items-center justify-center bg-amber-500/10 text-amber-400 h-9 w-9 rounded-xl text-base">⚡</span> Electricity
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{displayElectricity} <span className="text-gray-400 dark:text-gray-500 font-medium text-xs ml-1">kg ({electricityPct}%)</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50/60 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 p-4 rounded-2xl">
                    <span className="text-gray-600 dark:text-gray-300 text-sm font-semibold flex items-center gap-3.5">
                      <span className="flex items-center justify-center bg-emerald-500/10 text-emerald-400 h-9 w-9 rounded-xl text-base">🍽</span> Food / Diet
                    </span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{displayDiet} <span className="text-gray-400 dark:text-gray-500 font-medium text-xs ml-1">kg ({dietPct}%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Recharts Visualization Vector Card */}
            <div className="md:col-span-5 bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-7 rounded-[2.2rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center">
              <div className="w-full text-left mb-1"><h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Dynamic Share Allocation</h3></div>
              <div className="w-full h-40 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={5} dataKey="value" stroke="transparent">
                      {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} className="focus:outline-none" />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Optimization Intelligence Suite */}
          {coachData && (
            <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] shadow-md dark:shadow-none border border-gray-100 dark:border-gray-800/80 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500"></div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">🤖 AI Sustainability Coach</h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] uppercase font-extrabold tracking-widest rounded-full shadow-sm">Realtime Insight</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Algorithmic environmental modeling calibrated to your footprint updates.</p>
                </div>

                {/* Advanced Concentric Gauge Display */}
                <div className="flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-950/60 p-4 rounded-[1.8rem] border border-gray-100 dark:border-gray-800/60 shadow-sm w-full lg:w-auto">
                  <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                    <svg className="transform -rotate-90 w-16 h-16">
                      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                      <circle cx="32" cy="32" r="26" stroke="#10B981" strokeWidth="5" fill="transparent" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 - (coachData.score / 100) * (2 * Math.PI * 26)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-base font-black text-gray-900 dark:text-white leading-none">{coachData.score}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold mb-1 bg-amber-500/10 text-amber-500 border border-amber-500/20">{coachData.score_category}</div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold leading-tight">{coachData.score_explanation}</p>
                  </div>
                </div>
              </div>

              {/* Action Banner Highlight */}
              <div className="mb-8 p-5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex gap-4 items-start">
                  <div className="text-xl bg-white dark:bg-gray-950 p-2 rounded-xl border border-gray-100 dark:border-gray-800">💡</div>
                  <div>
                    <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">High Priority Tactical Action</h4>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm leading-relaxed">{coachData.highlighted_action}</p>
                  </div>
                </div>
              </div>

              {/* Component Strategy Analytics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/50 p-5 rounded-2xl"><div className="flex items-center gap-3 mb-3.5"><span className="flex items-center justify-center bg-blue-500/10 text-blue-400 h-9 w-9 rounded-xl text-base">🚗</span><h4 className="font-extrabold text-gray-900 dark:text-white text-xs tracking-tight">Transit Metric</h4></div><p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{coachData.transport_insight}</p></div>
                <div className="bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/50 p-5 rounded-2xl"><div className="flex items-center gap-3 mb-3.5"><span className="flex items-center justify-center bg-amber-500/10 text-amber-400 h-9 w-9 rounded-xl text-base">⚡</span><h4 className="font-extrabold text-gray-900 dark:text-white text-xs tracking-tight">Grid Draw</h4></div><p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{coachData.electricity_insight}</p></div>
                <div className="bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/50 p-5 rounded-2xl"><div className="flex items-center gap-3 mb-3.5"><span className="flex items-center justify-center bg-emerald-500/10 text-emerald-400 h-9 w-9 rounded-xl text-base">🍽</span><h4 className="font-extrabold text-gray-900 dark:text-white text-xs tracking-tight">Dietary Split</h4></div><p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{coachData.diet_insight}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;