import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import DarkModeToggle from "../components/DarkModeToggle";
import DashboardContext from "../context/DashboardContext";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const {
    result,
    setResult,
    coachData,
    setCoachData,
    loading,
    setLoading,
    error,
    setError,
    carKm,
    setCarKm,
    busKm,
    setBusKm,
    electricityKwh,
    setElectricityKwh,
    dietType,
    setDietType,
    totalVal,
    displayTransport,
    displayElectricity,
    displayDiet,
    fetchDashboardData,
    generateLocalCoachAdvice,
    isEditing,
    setIsEditing,
  } = useContext(DashboardContext);

  const [notifications, setNotifications] = useState([]);
  const [tourStep, setTourStep] = useState(0);


  useEffect(() => {
    const hasBoarded = localStorage.getItem("has_boarded_v3");
    if (!hasBoarded) {
      setTourStep(1);
    }
  }, []);

  const handleNextStep = () => setTourStep((prev) => prev + 1);
  const handleSkipTour = () => {
    localStorage.setItem("has_boarded_v3", "true");
    setTourStep(0);
  };

  const updateDashboard = async (e) => {
    if (e) e.preventDefault();

    const parsedCar = parseFloat(carKm) || 0;
    const parsedBus = parseFloat(busKm) || 0;
    const parsedElec = parseFloat(electricityKwh) || 0;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const logRes = await axios.post(`${API_URL}/api/emissions/daily`, {
        car_km: parsedCar,
        bus_km: parsedBus,
        electricity_kwh: parsedElec,
        diet_type: dietType || "non-vegetarian",
      }, authHeaders);

      if (logRes.data && logRes.data.log) {
        setResult(logRes.data.log);
        setCoachData(generateLocalCoachAdvice(logRes.data.log.eco_score));
        setIsEditing(false);
        setCarKm("");
        setBusKm("");
        setElectricityKwh("");

        // Dispatch event with updatedScore and updatedStreak
        window.dispatchEvent(new CustomEvent("sustainDataUpdated", {
          detail: {
            updatedScore: logRes.data.updatedScore,
            updatedStreak: logRes.data.updatedStreak
          }
        }));
      }

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
  }, [fetchDashboardData]);



  useEffect(() => {
    if (result) {
      setCoachData(generateLocalCoachAdvice(result.eco_score));
    }
  }, [carKm, busKm, electricityKwh, dietType, result, generateLocalCoachAdvice, setCoachData]);

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
              <div className={`space-y-4 ${tourStep === 1 ? 'relative z-[150] ring-4 ring-emerald-500/50 bg-white dark:bg-gray-900 rounded-xl p-2 transition-all duration-300' : ''}`}>
                <div>
                  <label htmlFor="carKm" className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Car Logistics (KM)</label>
                  <input id="carKm" type="number" min="0" step="any" placeholder="e.g. 15 KM car travel" value={carKm} onChange={(e) => { setCarKm(e.target.value); setIsEditing(true); }} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white rounded-xl outline-none text-sm font-semibold focus:ring-4 focus-visible:outline-none focus-visible:ring-emerald-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="busKm" className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Public Bus (KM)</label>
                  <input id="busKm" type="number" min="0" step="any" placeholder="e.g. 3 KM bus travel" value={busKm} onChange={(e) => { setBusKm(e.target.value); setIsEditing(true); }} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white rounded-xl outline-none text-sm font-semibold focus:ring-4 focus-visible:outline-none focus-visible:ring-emerald-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="electricityKwh" className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Grid Electricity (KWH)</label>
                  <input id="electricityKwh" type="number" min="0" step="any" placeholder="e.g. 12 KWH electricity usage" value={electricityKwh} onChange={(e) => { setElectricityKwh(e.target.value); setIsEditing(true); }} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800/80 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white rounded-xl outline-none text-sm font-semibold focus:ring-4 focus-visible:outline-none focus-visible:ring-emerald-500 transition-colors" />
                </div>
              </div>

              <div className={`${tourStep === 2 ? 'relative z-[150] ring-4 ring-emerald-500/50 bg-white dark:bg-gray-900 rounded-xl p-2 transition-all duration-300' : ''}`}>
                <fieldset>
                  <legend className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">Dietary Profile</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" aria-pressed={dietType === "vegetarian"} onClick={() => { setDietType("vegetarian"); setIsEditing(true); }} className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-200 focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-emerald-500 ${dietType === "vegetarian" ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/10" : "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Vegetarian</button>
                    <button type="button" aria-pressed={dietType === "non-vegetarian"} onClick={() => { setDietType("non-vegetarian"); setIsEditing(true); }} className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-200 focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-emerald-500 ${dietType === "non-vegetarian" ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/10" : "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Omnivore / Non-Veg</button>
                  </div>
                </fieldset>
              </div>

              <button type="submit" disabled={loading} className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/10 transition-all duration-200 disabled:from-gray-600 disabled:to-gray-700 mt-4 border-none cursor-pointer focus-visible:ring-4 focus-visible:outline-none focus-visible:ring-emerald-500 ${tourStep === 3 ? 'relative z-[150] ring-4 ring-emerald-500/50 scale-105 transition-all duration-300' : ''}`}>
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

              {/* AI Impact Prediction Card */}
              {coachData.potential_daily_savings > 0 && (
                <div className="mb-8 p-5 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-2xl border border-emerald-500/15 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🎯</span>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Potential Savings</h4>
                    <span className="ml-auto px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
                      {coachData.potential_action}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-950/60 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800/60 text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Savings</p>
                      <p className="text-lg font-black text-emerald-500">{coachData.potential_daily_savings}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">kg CO₂</p>
                    </div>
                    <div className="bg-white dark:bg-gray-950/60 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800/60 text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Yearly Savings</p>
                      <p className="text-lg font-black text-teal-500">{coachData.potential_yearly_savings}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">kg CO₂</p>
                    </div>
                    <div className="bg-white dark:bg-gray-950/60 rounded-xl p-3.5 border border-gray-100 dark:border-gray-800/60 text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recommended</p>
                      <p className="text-xs font-black text-indigo-500 leading-tight mt-1">{coachData.potential_action}</p>
                    </div>
                  </div>
                </div>
              )}

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


      {/* TUTORIAL TABS */}
      {tourStep > 0 && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[140] transition-all duration-300 animate-in fade-in">

          <div className="absolute top-4 right-4 z-[160]">
            <button
              onClick={handleSkipTour}
              className="text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Skip Tour ✕
            </button>
          </div>

          <div className="fixed inset-x-4 bottom-10 md:bottom-auto md:top-1/3 md:left-1/2 md:-translate-x-1/2 max-w-sm w-full mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-2xl z-[160] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Guide Step ({tourStep}/4)</span>
              <span className="text-xl" role="img" aria-hidden="true">
                {tourStep === 1 ? '📊' : tourStep === 2 ? '🥗' : tourStep === 3 ? '⚡' : '🎉'}
              </span>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 min-h-[70px]">
              {tourStep === 1 && (
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">1. Track Your Transit</h4>
                  <p>This section is where you log your daily mileage. Entering values here triggers instantaneous carbon calculations dynamically without lag.</p>
                </div>
              )}
              {tourStep === 2 && (
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">2. Optimize Food Habits</h4>
                  <p>Toggle your meal configurations. Selecting eco-friendly profiles safely applies specialized math metrics to scale down your footprint.</p>
                </div>
              )}
              {tourStep === 3 && (
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">3. Immutable Ledger Sync</h4>
                  <p>Once raw metrics are configured, click this sync module. It seals entries directly to your database, locking values in place even on browser refreshes.</p>
                </div>
              )}
              {tourStep === 4 && (
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">GET SET TRACK!</h4>
                  <p>We just Help You Track... YOU MAKE THE CHANGES! #YOUR ARE THE HERO 💖 </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={tourStep === 4 ? handleSkipTour : handleNextStep}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                {tourStep === 4 ? "Begin Tracking! 🚀" : "Next Element →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;