import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import DarkModeToggle from '../components/DarkModeToggle';

function SustainabilityDashboard() {
  // Inputs
  const [carKm, setCarKm] = useState('15');
  const [busKm, setBusKm] = useState('10');
  const [electricityKwh, setElectricityKwh] = useState('8');
  const [dietType, setDietType] = useState('non-vegetarian');

  // Request state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Result state
  const [result, setResult] = useState({
    total: 19.46,
    transport: 3.95,
    electricity: 6.56,
    diet: 5.0,
  });

  // History State for Analytics
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('sustainabilityHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing history", e);
      }
    }
    // Mock initial data to populate the analytics immediately
    return [
      { day: 'Mon', total: 22.4 },
      { day: 'Tue', total: 20.1 },
      { day: 'Wed', total: 24.5 },
      { day: 'Thu', total: 18.2 },
      { day: 'Fri', total: 19.5 },
      { day: 'Sat', total: 15.3 },
      { day: 'Sun', total: 19.46 }
    ];
  });

  // AI Coach state
  const [coachData, setCoachData] = useState({
    score: 68,
    score_category: "⚖️ Moderate Impact",
    score_explanation: "Your carbon footprint is average. Making small daily adjustments can easily push you into the sustainable tier.",
    primary_source: 'Electricity',
    transport_insight: "Your transportation emissions are relatively low, contributing only 20% of your footprint. Continue prioritizing efficient travel habits.",
    electricity_insight: "Electricity accounts for more than half of your emissions. Reducing daily consumption by 20% could significantly lower your environmental impact.",
    diet_insight: "Food choices contribute 25% of your emissions. Incorporating one additional plant-based day each week could reduce annual emissions.",
    highlighted_action: "Perform an energy audit today: unplug all unused electronics and lower your thermostat/AC by 1-2 degrees."
  });

  // Run calculation and fetch coaching advice
  const updateDashboard = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Calculate emissions
    let currentResult = null;
    try {
      const calcResponse = await axios.post('http://127.0.0.1:8000/calculate', {
        car_km: parseFloat(carKm) || 0,
        bus_km: parseFloat(busKm) || 0,
        electricity_kwh: parseFloat(electricityKwh) || 0,
        diet_type: dietType,
      });
      currentResult = calcResponse.data;
      setResult(currentResult);
    } catch (err) {
      console.error(err);
      setError('Failed to reach backend. Running local simulation.');
      // Local fallback calculation
      const carVal = parseFloat(carKm) || 0;
      const busVal = parseFloat(busKm) || 0;
      const elecVal = parseFloat(electricityKwh) || 0;
      const t = carVal * 0.21 + busVal * 0.08;
      const el = elecVal * 0.82;
      const d = dietType === 'vegetarian' ? 2.0 : 5.0;
      currentResult = {
        total: Math.round((t + el + d) * 100) / 100,
        transport: Math.round(t * 100) / 100,
        electricity: Math.round(el * 100) / 100,
        diet: d,
      };
      setResult(currentResult);
    }

    // 2. Update History
    setHistory(prev => {
      const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      let next = [...prev];
      if (next.length > 0 && next[next.length - 1].day === todayName) {
        next[next.length - 1] = { day: todayName, total: currentResult.total };
      } else {
        next.push({ day: todayName, total: currentResult.total });
        if (next.length > 7) next.shift();
      }
      localStorage.setItem('sustainabilityHistory', JSON.stringify(next));
      return next;
    });

    // 3. Fetch AI Coach advice
    try {
      const coachResponse = await axios.post('http://127.0.0.1:8000/coach', {
        transport: currentResult.transport,
        electricity: currentResult.electricity,
        diet: currentResult.diet,
        total: currentResult.total,
      });
      setCoachData(coachResponse.data);
    } catch (err) {
      console.error(err);
      // Local fallback coaching advice
      const total = currentResult.total || 1.0;
      const t_pct = Math.round((currentResult.transport / total) * 100);
      const e_pct = Math.round((currentResult.electricity / total) * 100);
      const d_pct = Math.round((currentResult.diet / total) * 100);

      let base_score = 100;
      if (total <= 5) base_score = 100 - (total * 2);
      else if (total <= 10) base_score = 90 - ((total - 5) * 3);
      else if (total <= 15) base_score = 75 - ((total - 10) * 3);
      else if (total <= 25) base_score = 60 - ((total - 15) * 2);
      else base_score = Math.max(0, 40 - (total - 25));

      let distribution_penalty = 0;
      const max_pct = Math.max(t_pct, e_pct, d_pct);
      if (max_pct > 80) distribution_penalty = 10;
      else if (max_pct > 60) distribution_penalty = 5;

      const score = Math.floor(Math.max(0, Math.min(100, base_score - distribution_penalty)));

      let score_category = "";
      let score_explanation = "";
      if (score >= 90) { score_category = "🌟 Eco Champion"; score_explanation = "Outstanding! Your footprint is well below average. You are leading the way in sustainable living."; }
      else if (score >= 75) { score_category = "🌱 Sustainable"; score_explanation = "Great job! Your emissions are manageable, but there's still slight room for improvement in high-impact areas."; }
      else if (score >= 60) { score_category = "⚖️ Moderate Impact"; score_explanation = "Your carbon footprint is average. Making small daily adjustments can easily push you into the sustainable tier."; }
      else if (score >= 40) { score_category = "⚠️ High Impact"; score_explanation = "Your emissions are above the recommended threshold. Focus on your primary emission source to make significant cuts."; }
      else { score_category = "🚨 Critical Impact"; score_explanation = "Your ecological footprint is critically high. Urgent action is needed across all categories to reduce your environmental impact."; }

      const pcts = { "Transportation": t_pct, "Electricity": e_pct, "Diet": d_pct };
      const primary = Object.keys(pcts).reduce((a, b) => pcts[a] > pcts[b] ? a : b);

      let t_insight = t_pct < 20 ? `Your transportation emissions are relatively low, contributing only ${t_pct}% of your footprint. Continue prioritizing efficient travel habits.` : (t_pct > 40 ? `Transportation accounts for a significant ${t_pct}% of your emissions. Try substituting a few car trips a week with public transit, cycling, or walking.` : `Transportation makes up ${t_pct}% of your carbon footprint. Look for opportunities to carpool or combine errands to keep this number down.`);
      let e_insight = e_pct < 20 ? `Your electricity usage is highly efficient, contributing just ${e_pct}% of your footprint. Great job minimizing household energy waste.` : (e_pct > 40 ? `Electricity accounts for ${e_pct}% of your emissions. Reducing daily consumption by 20% through mindful appliance use could significantly lower your environmental impact.` : `Electricity usage forms ${e_pct}% of your emissions. Ensure you are turning off idle devices and leveraging natural light to optimize this.`);
      let d_insight = d_pct < 20 ? `Your diet is very eco-friendly, adding only ${d_pct}% to your footprint. Maintaining a low-impact diet makes a massive difference.` : (d_pct > 30 ? `Food choices contribute ${d_pct}% of your emissions. Incorporating one additional plant-based day each week could significantly reduce your annual emissions.` : `Dietary choices account for ${d_pct}% of your emissions. Continuing to balance your meals with sustainable options will help maintain this moderate level.`);

      let highlight = "";
      if (primary === "Transportation") {
        highlight = "Commit to taking public transit or cycling for your commute twice this week to slash your primary emission source.";
      } else if (primary === "Electricity") {
        highlight = "Perform an energy audit today: unplug all unused electronics and lower your thermostat/AC by 1-2 degrees.";
      } else {
        highlight = "Make your next 3 meals entirely plant-based to immediately curb the high emissions from your diet.";
      }

      setCoachData({
        score: score,
        score_category: score_category,
        score_explanation: score_explanation,
        primary_source: primary,
        transport_insight: t_insight,
        electricity_insight: e_insight,
        diet_insight: d_insight,
        highlighted_action: highlight
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateDashboard();
  }, []);

  const pieChartData = [
    { name: 'Transportation', value: result.transport, color: '#3B82F6' },
    { name: 'Electricity', value: result.electricity, color: '#F59E0B' },
    { name: 'Diet', value: result.diet, color: '#10B981' },
  ].filter(item => item.value > 0);

  const getStatus = (total) => {
    if (total < 5) return { label: 'Low Impact', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    if (total <= 10) return { label: 'Moderate Impact', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    return { label: 'High Impact', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
  };
  const status = getStatus(result.total);

  const totalVal = result.total || 1;
  const transportPct = Math.round((result.transport / totalVal) * 100);
  const electricityPct = Math.round((result.electricity / totalVal) * 100);
  const dietPct = Math.round((result.diet / totalVal) * 100);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (coachData.score / 100) * circumference;

  const getScoreStrokeColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-green-500';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (score >= 75) return 'bg-green-50 text-green-700 border border-green-200';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (score >= 40) return 'bg-orange-50 text-orange-700 border border-orange-200';
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  };

  // --- Analytics Calculations ---
  const bestDay = history.length > 0 ? history.reduce((min, p) => p.total < min.total ? p : min, history[0]) : { day: '-', total: 0 };
  const worstDay = history.length > 0 ? history.reduce((max, p) => p.total > max.total ? p : max, history[0]) : { day: '-', total: 0 };
  const avgWeekly = history.length > 0 ? (history.reduce((acc, p) => acc + p.total, 0) / history.length).toFixed(2) : 0;

  let pctChange = 0;
  let insightText = "Not enough data to calculate trends.";
  if (history.length > 1) {
    const firstHalfAvg = history.slice(0, Math.ceil(history.length / 2)).reduce((a, b) => a + b.total, 0) / Math.ceil(history.length / 2);
    const lastHalfAvg = history.slice(Math.ceil(history.length / 2)).reduce((a, b) => a + b.total, 0) / Math.floor(history.length / 2);

    pctChange = (((lastHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1);

    if (pctChange < 0) {
      insightText = `Awesome! Your footprint decreased by ${Math.abs(pctChange)}% compared to earlier this week.`;
    } else if (pctChange > 0) {
      insightText = `Your footprint increased by ${pctChange}% compared to earlier this week. Check your AI coach to see where to cut back.`;
    } else {
      insightText = `Your footprint is completely stable compared to earlier this week.`;
    }
  }

  // --- Goals Module Calculations ---
  const GOAL_CO2 = 5.0;
  let goalStatus = "";
  let progressPct = 0;
  let progressColor = "";

  if (result.total <= GOAL_CO2) {
    goalStatus = "Goal Achieved! 🎉";
    progressPct = 100;
    progressColor = "bg-emerald-500";
  } else {
    const reductionNeeded = result.total - GOAL_CO2;
    const reductionPct = Math.round((reductionNeeded / result.total) * 100);
    goalStatus = `${reductionPct}% reduction needed`;
    progressPct = Math.min(100, Math.round((GOAL_CO2 / result.total) * 100));
    progressColor = progressPct > 70 ? "bg-amber-400" : "bg-rose-500";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8 mt-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Dashboard</h1>
          <p className="text-gray-500 mt-1">Track, analyze, and optimize your daily ecological footprint.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium bg-white shadow-sm text-gray-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            AI Coach Live
          </span>
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

        {/* Left Panel: Inputs & Summary */}
        <div className="lg:col-span-4 space-y-6">

          {/* Total CO2 summary card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Today's Footprint</p>
              <h3 className="text-5xl font-extrabold text-gray-900 mt-2">{result.total} <span className="text-xl font-normal text-gray-500">kg CO₂</span></h3>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-500">Impact Assessment</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`}></span>
                {status.label}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Activities</h2>
            {error && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs">
                {error}
              </div>
            )}
            <form onSubmit={updateDashboard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Car Travel (km)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={carKm}
                  onChange={(e) => setCarKm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Bus Travel (km)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={busKm}
                  onChange={(e) => setBusKm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Electricity Usage (kWh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Diet Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDietType('vegetarian')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${dietType === 'vegetarian' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietType('non-vegetarian')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${dietType === 'non-vegetarian' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-sm transition disabled:bg-slate-500 mt-2"
              >
                {loading ? 'Optimizing...' : 'Sync Dashboard'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Charts and AI Coach */}
        <div className="lg:col-span-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Breakdown Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Emissions Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-3">
                    <span className="flex items-center justify-center bg-blue-50 text-blue-500 h-8 w-8 rounded-full">🚗</span>
                    Transportation
                  </span>
                  <span className="font-bold text-gray-900">{result.transport} kg <span className="text-gray-400 font-normal ml-1">({transportPct}%)</span></span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-3">
                    <span className="flex items-center justify-center bg-amber-50 text-amber-500 h-8 w-8 rounded-full">⚡</span>
                    Electricity
                  </span>
                  <span className="font-bold text-gray-900">{result.electricity} kg <span className="text-gray-400 font-normal ml-1">({electricityPct}%)</span></span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-3">
                    <span className="flex items-center justify-center bg-emerald-50 text-emerald-500 h-8 w-8 rounded-full">🍽</span>
                    Diet
                  </span>
                  <span className="font-bold text-gray-900">{result.diet} kg <span className="text-gray-400 font-normal ml-1">({dietPct}%)</span></span>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-between">
              <div className="w-full">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Contribution Share</h3>
              </div>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => [`${value} kg CO₂`, 'Emissions']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* AI Sustainability Coach Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"></div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">🤖 AI Sustainability Coach</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] uppercase font-black tracking-widest rounded-full shadow-md">
                    Powered by AI
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Personalized, data-driven strategies to lower your ecological footprint.</p>
              </div>

              {/* Eco Score Engine Display */}
              <div className="flex flex-row items-center gap-5 bg-white/60 p-4 rounded-3xl border border-gray-100 shadow-sm backdrop-blur-md">
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                    <circle
                      cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className={`transition-all duration-1000 ease-in-out ${getScoreStrokeColor(coachData.score)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-gray-800 leading-none">{coachData.score}</span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">/ 100</span>
                  </div>
                </div>

                {/* Badge and Explanation */}
                <div className="flex-1 min-w-[160px] max-w-[200px]">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mb-1.5 ${getScoreBadgeColor(coachData.score)}`}>
                    {coachData.score_category}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {coachData.score_explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlighted Action */}
            <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-2xl border border-indigo-100/50 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
              <div className="flex gap-4 items-start">
                <div className="text-2xl bg-white p-2.5 rounded-xl shadow-sm border border-indigo-50">💡</div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Top Priority Action</h4>
                  <p className="text-indigo-900 font-semibold leading-relaxed text-sm">{coachData.highlighted_action}</p>
                </div>
              </div>
            </div>

            {/* Dynamic Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center bg-blue-50 text-blue-500 h-10 w-10 rounded-xl text-lg">🚗</span>
                  <h4 className="font-bold text-gray-800 text-sm">Transportation</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{coachData.transport_insight}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center bg-amber-50 text-amber-500 h-10 w-10 rounded-xl text-lg">⚡</span>
                  <h4 className="font-bold text-gray-800 text-sm">Electricity</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{coachData.electricity_insight}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center bg-emerald-50 text-emerald-500 h-10 w-10 rounded-xl text-lg">🍽</span>
                  <h4 className="font-bold text-gray-800 text-sm">Diet</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{coachData.diet_insight}</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Sustainability Goals Module */}
      <div className="mb-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-1 shadow-lg">
        <div className="bg-white rounded-[1.4rem] p-6 lg:p-8 h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🎯 Daily Sustainability Goal</h2>
            <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full self-start md:self-auto">
              Target: &lt; 5 kg CO₂
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Card */}
            <div className="col-span-1 border border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Current</span>
                <span className="font-black text-xl text-gray-900">{result.total} kg</span>
              </div>
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Goal</span>
                <span className="font-black text-xl text-emerald-600">5.0 kg</span>
              </div>
              <div className="text-center">
                <p className={`text-lg font-black bg-white py-2 px-4 rounded-xl border ${result.total <= 5 ? 'text-emerald-600 border-emerald-200' : 'text-rose-600 border-rose-200'}`}>
                  {goalStatus}
                </p>
              </div>
            </div>

            {/* Progress & Milestones */}
            <div className="col-span-1 lg:col-span-2 flex flex-col justify-center">
              <div className="mb-3 flex justify-between text-sm font-bold text-gray-700">
                <span className="uppercase tracking-wider text-gray-500">Progress towards target</span>
                <span className="text-emerald-600">{progressPct}%</span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden mb-10 shadow-inner">
                <div className={`h-full ${progressColor} transition-all duration-1000 ease-out`} style={{ width: `${progressPct}%` }}></div>
              </div>

              {/* Milestones */}
              <div className="flex justify-between items-center relative mb-6">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>

                <div className="flex flex-col items-center bg-white px-3 relative">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 0 ? 'bg-emerald-500 text-white border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>1</div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase absolute -bottom-4 whitespace-nowrap">Started</span>
                </div>

                <div className="flex flex-col items-center bg-white px-3 relative">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 50 ? 'bg-emerald-500 text-white border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>2</div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase absolute -bottom-4 whitespace-nowrap">Halfway</span>
                </div>

                <div className="flex flex-col items-center bg-white px-3 relative">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 100 ? 'bg-emerald-500 text-white border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>🏆</div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase absolute -bottom-4 whitespace-nowrap">Goal Met</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-teal-900 text-sm flex gap-4 items-start">
                <span className="text-2xl mt-0.5">🚀</span>
                <div>
                  <strong className="block text-teal-800 mb-1">How to crush this goal:</strong>
                  <p className="text-teal-700/90 leading-relaxed">{coachData.highlighted_action} To reach 5kg, focus intensely on driving down your primary emission source ({coachData.primary_source}).</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Weekly Analytics</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">Past 7 Calculations</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Chart */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Emissions Trend (kg CO₂)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dx={-10}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4F46E5"
                    strokeWidth={4}
                    dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Insight Text below chart */}
            <div className="mt-6 flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900">
              <span className="text-xl">📈</span>
              <p className="text-sm font-medium">{insightText}</p>
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Average */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center">
              <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                📊
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weekly Avg</p>
                <h4 className="text-2xl font-black text-gray-900">{avgWeekly} <span className="text-sm font-normal text-gray-500">kg CO₂</span></h4>
              </div>
            </div>

            {/* Best Day */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center">
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                🏆
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Best Day</p>
                <h4 className="text-2xl font-black text-gray-900">{bestDay.total} <span className="text-sm font-normal text-gray-500">kg CO₂</span></h4>
                <p className="text-xs text-gray-500 mt-0.5">Recorded on {bestDay.day}</p>
              </div>
            </div>

            {/* Worst Day */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center">
              <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                🚩
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Worst Day</p>
                <h4 className="text-2xl font-black text-gray-900">{worstDay.total} <span className="text-sm font-normal text-gray-500">kg CO₂</span></h4>
                <p className="text-xs text-gray-500 mt-0.5">Recorded on {worstDay.day}</p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default SustainabilityDashboard;
