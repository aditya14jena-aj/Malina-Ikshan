import React, { createContext, useState, useCallback } from "react";
import axios from "axios";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [result, setResult] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Shared Input states to preserve form inputs */
  const [carKm, setCarKm] = useState("");
  const [busKm, setBusKm] = useState("");
  const [electricityKwh, setElectricityKwh] = useState("");
  const [dietType, setDietType] = useState("non-vegetarian");
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const transportVal = isEditing ? (parseFloat(carKm) || 0) * 0.2 + (parseFloat(busKm) || 0) * 0.05 : (result?.transport || 0);
  const electricityVal = isEditing ? (parseFloat(electricityKwh) || 0) * 0.4 : (result?.electricity || 0);
  const dietVal = isEditing ? (dietType === "vegetarian" ? 1.5 : 3.0) : (result?.diet || 0);
  const totalVal = parseFloat((transportVal + electricityVal + dietVal).toFixed(2));

  const displayTransport = parseFloat(transportVal.toFixed(2));
  const displayElectricity = parseFloat(electricityVal.toFixed(2));
  const displayDiet = parseFloat(dietVal.toFixed(2));

  const generateLocalCoachAdvice = useCallback((scoreValue) => {
    const score = scoreValue || 0;
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
  }, [totalVal, displayTransport, displayElectricity, displayDiet]);

  const fetchDashboardData = useCallback(async (force = false) => {
    if (result && !force) return; // Prevent re-fetching if data is cached
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const historyRes = await axios.get(`${API_URL}/api/emissions/progress`, authHeaders);
      if (historyRes.data && historyRes.data.history && historyRes.data.history.length > 0) {
        const latest = historyRes.data.history[historyRes.data.history.length - 1];
        setResult(latest);
        setCoachData(generateLocalCoachAdvice(latest.eco_score));
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    } finally {
      setLoading(false);
    }
  }, [result, API_URL, generateLocalCoachAdvice]);

  return (
    <DashboardContext.Provider
      value={{
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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
