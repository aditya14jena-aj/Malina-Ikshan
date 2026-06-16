import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  // AI Coach state
  const [coachData, setCoachData] = useState({
    score: 32,
    primary_source: 'Electricity',
    recommendations: [
      "Reduce household energy: Switch to LED bulbs, unplug idle devices, and manage heating/cooling.",
      "Opt for active transportation: Swap solo car rides for public transit, cycling, or walking.",
      "Integrate plant-based meals: Choose vegetarian or vegan options to reduce high-impact food emissions."
    ],
    highlighted_action: "⚡ Critical Action: Conduct a quick home energy check to unplug standby electronics and optimize your thermostat."
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

    // 2. Fetch AI Coach advice
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
      const t_pct = (currentResult.transport / total) * 100;
      const e_pct = (currentResult.electricity / total) * 100;
      const d_pct = (currentResult.diet / total) * 100;
      const score = maxScore(100 - intScore(currentResult.total * 3.5));

      const pcts = { "Transportation": t_pct, "Electricity": e_pct, "Diet": d_pct };
      const primary = Object.keys(pcts).reduce((a, b) => pcts[a] > pcts[b] ? a : b);

      const recs = [];
      if (t_pct > 40) recs.push("Opt for active transportation: Swap solo car rides for public transit, cycling, or walking.");
      if (e_pct > 40) recs.push("Reduce household energy: Switch to LED bulbs, unplug idle devices, and manage heating/cooling.");
      if (d_pct > 30) recs.push("Integrate plant-based meals: Choose vegetarian or vegan options to reduce food emissions.");
      
      const general = [
        "Monitor daily habits: Consistency helps you identify and eliminate carbon-heavy routines.",
        "Conserve water: Shorten showers to save heating energy.",
        "Compost & recycle: Reducing waste decreases landfill methane emissions."
      ];
      while(recs.length < 3) {
        recs.push(general[recs.length]);
      }

      let highlight = "";
      if (primary === "Transportation") {
        highlight = "🚗 Critical Action: Cut down car trips by 50% this week by combining errands or walking.";
      } else if (primary === "Electricity") {
        highlight = "⚡ Critical Action: Conduct a quick home energy check to unplug standby electronics.";
      } else {
        highlight = "🍽 Critical Action: Commit to a fully plant-based day tomorrow to drop your diet impact.";
      }

      setCoachData({
        score: score,
        primary_source: primary,
        recommendations: recs,
        highlighted_action: highlight
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper local functions
  const maxScore = (val) => Math.max(0, Math.min(100, val));
  const intScore = (val) => Math.floor(val);

  // Initial load
  useEffect(() => {
    updateDashboard();
  }, []);

  // Recharts Chart Data
  const chartData = [
    { name: 'Transportation', value: result.transport, color: '#3B82F6' },
    { name: 'Electricity', value: result.electricity, color: '#F59E0B' },
    { name: 'Diet', value: result.diet, color: '#10B981' },
  ].filter(item => item.value > 0);

  // Status Indicator calculations
  const getStatus = (total) => {
    if (total < 5) return { label: 'Low Impact', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    if (total <= 10) return { label: 'Moderate Impact', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    return { label: 'High Impact', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
  };

  const status = getStatus(result.total);

  // Calculate percentages for UI display
  const totalVal = result.total || 1;
  const transportPct = Math.round((result.transport / totalVal) * 100);
  const electricityPct = Math.round((result.electricity / totalVal) * 100);
  const dietPct = Math.round((result.diet / totalVal) * 100);

  // Score styling color
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-600 ring-emerald-100';
    if (score >= 45) return 'text-amber-500 ring-amber-100';
    return 'text-rose-600 ring-rose-100';
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Dashboard</h1>
          <p className="text-gray-500 mt-1">Track, analyze, and optimize your daily ecological footprint.</p>
        </div>
        <span className="mt-4 md:mt-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium bg-white shadow-sm text-gray-700">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
          AI Coach Live
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
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
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-sm transition disabled:bg-slate-500 mt-2"
              >
                {loading ? 'Optimizing...' : 'Sync Dashboard'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Charts, Stats, and AI Coach */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Total CO2 summary card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Today's Carbon Footprint</p>
                <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{result.total} <span className="text-xl font-normal text-gray-500">kg CO₂</span></h3>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">Impact Assessment</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`}></span>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Emissions Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-2">🚗 Transportation</span>
                  <span className="font-bold text-gray-900">{result.transport} kg ({transportPct}%)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-2">⚡ Electricity</span>
                  <span className="font-bold text-gray-900">{result.electricity} kg ({electricityPct}%)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-2">🍽 Diet</span>
                  <span className="font-bold text-gray-900">{result.diet} kg ({dietPct}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization & AI Coach Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-5 flex flex-col items-center justify-between">
              <div className="w-full">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Contribution Share</h3>
              </div>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} kg CO₂`, 'Emissions']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold mt-2 justify-center">
                {chartData.map((item) => (
                  <span key={item.name} className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Coach Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Sustainability Coach</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Eco Score</span>
                    <span className={`text-base font-black px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-150 ring-4 ${getScoreColor(coachData.score)}`}>
                      {coachData.score}/100
                    </span>
                  </div>
                </div>

                {/* Primary Source */}
                <div className="mb-4 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-xl inline-block border border-gray-100">
                  ⚡ Primary Carbon Source: <strong className="text-gray-800">{coachData.primary_source}</strong>
                </div>

                {/* Highlighted Action Box */}
                <div className="mb-4 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-amber-800 font-medium leading-relaxed">
                  {coachData.highlighted_action}
                </div>

                {/* Recommendations */}
                <div className="space-y-2.5">
                  {coachData.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 leading-normal">
                      <span className="text-green-500 mt-0.5 font-bold">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SustainabilityDashboard;
