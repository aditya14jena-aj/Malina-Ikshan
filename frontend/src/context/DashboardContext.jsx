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

  const generateLocalCoachAdvice = useCallback(() => {
    const transport = displayTransport;
    const electricity = displayElectricity;
    const diet = displayDiet;

    const calculated_total = parseFloat((transport + electricity + diet).toFixed(2));
    let transport_pct = 0, electricity_pct = 0, diet_pct = 0;

    if (calculated_total > 0) {
      transport_pct = (transport / calculated_total) * 100;
      electricity_pct = (electricity / calculated_total) * 100;
      diet_pct = (diet / calculated_total) * 100;
    }

    let initial_score = 100 - (calculated_total * 3);
    initial_score = Math.max(0, Math.min(100, initial_score));

    let penalty = 0;
    if (transport_pct > 80 || electricity_pct > 80 || diet_pct > 80) penalty = 15;
    else if (transport_pct > 60 || electricity_pct > 60 || diet_pct > 60) penalty = 8;

    let final_score = Math.max(0, Math.min(100, Math.round(initial_score - penalty)));

    let category = "🚨 Critical Impact";
    if (final_score >= 90) category = "🌟 Eco Champion";
    else if (final_score >= 75) category = "🌱 Sustainable";
    else if (final_score >= 50) category = "⚖️ Moderate Impact";
    else if (final_score >= 25) category = "⚠️ High Impact";

    let primary_source = "diet";
    if (transport >= electricity && transport >= diet) primary_source = "transport";
    else if (electricity > transport && electricity >= diet) primary_source = "electricity";
    
    let transport_insight = transport_pct > 40 ? "High localized transit emissions detected. Transition solo commutes to shared vehicle corridors or public transit." : transport_pct >= 20 ? "Moderate transportation footprint. Consolidate travel segments to maintain systemic balance." : "Excellent low-impact transit profile preserved for this logging cycle.";
    
    let electricity_insight = electricity_pct > 40 ? "Critical grid power draw observed. Audit baseline infrastructure and idle hardware configurations." : electricity_pct >= 20 ? "Standard energy optimization window available. Transition secondary loads to high-efficiency configurations." : "Superb power conservation profile with minimal active grid dependency.";
    
    let diet_insight = diet_pct > 35 ? "Dietary carbon footprint exceeds target thresholds. Substitute high-impact proteins with alternative plant profiles." : "Dietary composition metrics remain well within standard operational baselines.";

    let explanation = `Operational score evaluated at ${final_score} based on a cumulative footprint calculation of ${calculated_total} kg CO2, driven primarily by ${primary_source} metrics.`;
    
    let action = "";
    if (primary_source === "transport") action = "Deploy ride-sharing protocols or utilize public bus logistics for the next commute cycle.";
    else if (primary_source === "electricity") action = "Disconnect phantom power draws and schedule heavy computational loads during solar peak windows.";
    else action = "Incorporate a fully plant-based meal selection into your next culinary tracking log.";

    return {
      score: final_score,
      score_category: category,
      score_explanation: explanation,
      primary_source,
      transport_insight,
      electricity_insight,
      diet_insight,
      highlighted_action: action
    };
  }, [displayTransport, displayElectricity, displayDiet]);

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
