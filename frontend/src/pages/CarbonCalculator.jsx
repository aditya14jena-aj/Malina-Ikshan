import React, { useState } from 'react';
import axios from 'axios';

function CarbonCalculator() {
  const [carKm, setCarKm] = useState('');
  const [busKm, setBusKm] = useState('');
  const [electricityKwh, setElectricityKwh] = useState('');
  const [dietType, setDietType] = useState('vegetarian');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Pointing to FastAPI default host. Adjust port if needed.
      const response = await axios.post('http://127.0.0.1:8000/calculate', {
        car_km: parseFloat(carKm) || 0,
        bus_km: parseFloat(busKm) || 0,
        electricity_kwh: parseFloat(electricityKwh) || 0,
        diet_type: dietType,
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to calculate emissions. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Carbon Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Calculate your daily carbon footprint and understand your impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Daily Activity</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🚗 Car Travel Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={carKm}
                onChange={(e) => setCarKm(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🚌 Bus Travel Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={busKm}
                onChange={(e) => setBusKm(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ⚡ Electricity Usage (kWh)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={electricityKwh}
                onChange={(e) => setElectricityKwh(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🍽 Diet Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition ${dietType === 'vegetarian' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                  <input
                    type="radio"
                    name="dietType"
                    value="vegetarian"
                    checked={dietType === 'vegetarian'}
                    onChange={() => setDietType('vegetarian')}
                    className="sr-only"
                  />
                  Vegetarian
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition ${dietType === 'non-vegetarian' ? 'border-green-500 bg-green-50 text-green-700 font-semibold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                  <input
                    type="radio"
                    name="dietType"
                    value="non-vegetarian"
                    checked={dietType === 'non-vegetarian'}
                    onChange={() => setDietType('non-vegetarian')}
                    className="sr-only"
                  />
                  Non-Vegetarian
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition disabled:bg-green-400 mt-6"
            >
              {loading ? 'Calculating...' : 'Calculate Footprint'}
            </button>
          </form>
        </div>

        {/* Results / Empty State */}
        <div className="flex flex-col justify-between">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {result ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Result
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-6">Today's Carbon Footprint</h3>

                <div className="text-center py-6 bg-gray-50 rounded-xl mb-6">
                  <span className="block text-4xl font-extrabold text-gray-900">{result.total} kg</span>
                  <span className="text-sm text-gray-500 font-medium">Total CO₂ Emissions</span>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 text-sm border-b pb-2">Breakdown</h4>
                  
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-2">
                      <span>🚗</span> Transportation
                    </span>
                    <span className="font-bold text-gray-800">{result.transport} kg CO₂</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-2">
                      <span>⚡</span> Electricity
                    </span>
                    <span className="font-bold text-gray-800">{result.electricity} kg CO₂</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-2">
                      <span>🍽</span> Diet
                    </span>
                    <span className="font-bold text-gray-800">{result.diet} kg CO₂</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-xs text-center text-gray-400">
                Calculations based on average conversion factors.
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 p-8 rounded-2xl flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">🌱</span>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Ready to Calculate</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Fill in the details on the left and submit to view your carbon footprint breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarbonCalculator;
