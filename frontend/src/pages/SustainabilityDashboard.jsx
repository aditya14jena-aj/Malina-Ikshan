import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function SustainabilityDashboard() {
  // Inputs
  const [carKm, setCarKm] = useState('15');
  const [busKm, setBusKm] = useState('10');
  const [electricityKwh, setElectricityKwh] = useState('8');
  const [dietType, setDietType] = useState('non-vegetarian');

  // Request state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Result state (initialized with default calculations based on initial inputs)
  const [result, setResult] = useState({
    total: 19.46,
    transport: 3.95, // (15 * 0.21) + (10 * 0.08) = 3.15 + 0.8 = 3.95
    electricity: 6.56, // 8 * 0.82 = 6.56
    diet: 5.0, // non-vegetarian = 5.0
  });

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/calculate', {
        car_km: parseFloat(carKm) || 0,
        bus_km: parseFloat(busKm) || 0,
        electricity_kwh: parseFloat(electricityKwh) || 0,
        diet_type: dietType,
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to calculate emissions. Using local estimation.');
      // Local fallback calculation if backend is unreachable
      const carVal = parseFloat(carKm) || 0;
      const busVal = parseFloat(busKm) || 0;
      const elecVal = parseFloat(electricityKwh) || 0;
      const t = carVal * 0.21 + busVal * 0.08;
      const el = elecVal * 0.82;
      const d = dietType === 'vegetarian' ? 2.0 : 5.0;
      setResult({
        total: Math.round((t + el + d) * 100) / 100,
        transport: Math.round(t * 100) / 100,
        electricity: Math.round(el * 100) / 100,
        diet: d,
      });
    } finally {
      setLoading(false);
    }
  };

  // Recharts Chart Data
  const chartData = [
    { name: 'Transportation', value: result.transport, color: '#3B82F6' }, // Blue
    { name: 'Electricity', value: result.electricity, color: '#F59E0B' }, // Amber
    { name: 'Diet', value: result.diet, color: '#10B981' }, // Emerald
  ].filter(item => item.value > 0);

  // Status Indicator calculations
  const getStatus = (total) => {
    if (total < 5) return { label: 'Low Impact', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    if (total <= 10) return { label: 'Moderate Impact', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    return { label: 'High Impact', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
  };

  const status = getStatus(result.total);

  // Calculate percentages
  const totalVal = result.total || 1;
  const transportPct = Math.round((result.transport / totalVal) * 100);
  const electricityPct = Math.round((result.electricity / totalVal) * 100);
  const dietPct = Math.round((result.diet / totalVal) * 100);

  // Generate Insights
  const getInsights = () => {
    const insights = [];
    if (transportPct > 40) {
      insights.push(`🚗 Transportation contributes a major portion (${transportPct}%) of your daily emissions. Consider carpooling, biking, or public transit to lower this.`);
    } else {
      insights.push(`🚗 Your transportation footprint is relatively low, contributing ${transportPct}% of your total daily emissions.`);
    }

    if (result.electricity > 8) {
      insights.push(`⚡ Electricity usage is high. Switching to energy-efficient appliances or turning off idle devices could save emissions.`);
    } else {
      insights.push(`⚡ Electricity usage is moderate, representing ${electricityPct}% of your carbon output.`);
    }

    if (dietType === 'non-vegetarian') {
      insights.push(`🍽 Diet contributes ${dietPct}%. Transitioning to more plant-based meals (vegetarian diet) can reduce your food emissions by up to 60%.`);
    } else {
      insights.push(`🌱 Great job! Your vegetarian diet keeps food emissions low at just ${result.diet} kg CO₂.`);
    }

    return insights;
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
          Live Calculator Connected
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Activities</h2>
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs">
                {error}
              </div>
            )}
            <form onSubmit={handleCalculate} className="space-y-4">
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
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${dietType === 'vegetarian' ? 'bg-emerald-550 border-emerald-600 text-white bg-emerald-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietType('non-vegetarian')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${dietType === 'non-vegetarian' ? 'bg-emerald-550 border-emerald-600 text-white bg-emerald-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
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
                {loading ? 'Updating...' : 'Update Dashboard'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Dashboard Charts and Stats */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top row cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Total CO2 summary card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Today's Carbon Footprint</p>
                <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{result.total} <span className="text-xl font-normal text-gray-500">kg CO₂</span></h3>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">Status Index</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                  <span className={`h-2 w-2 rounded-full ${status.dot}`}></span>
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

          {/* Visualization & Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-6 flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 self-start">Contribution Share</h3>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
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
              <div className="flex gap-4 text-xs font-semibold mt-2">
                {chartData.map((item) => (
                  <span key={item.name} className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Insights</h3>
                <div className="space-y-4">
                  {getInsights().map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                      <span className="text-green-500 mt-0.5">✦</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 mt-6">
                Daily target is under 5 kg CO₂ per person.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SustainabilityDashboard;
