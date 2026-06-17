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
function Dashboard() {
  /* Inputs */ const [carKm, setCarKm] = useState("15");
  const [busKm, setBusKm] = useState("10");
  const [electricityKwh, setElectricityKwh] = useState("8");
  const [dietType, setDietType] = useState("non-vegetarian");
  /* Request state */ const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /* Result state */ const [result, setResult] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const generateLocalCoachAdvice = (currentResult) => {
    const total = currentResult.total || 1.0;
    const t_pct = Math.round((currentResult.transport / total) * 100);
    const e_pct = Math.round((currentResult.electricity / total) * 100);
    const d_pct = Math.round((currentResult.diet / total) * 100);
    const score = currentResult.eco_score || 50;
    let score_category = "";
    let score_explanation = "";
    if (score >= 90) {
      score_category = "🌟 Eco Champion";
      score_explanation = "Outstanding! Your footprint is well below average.";
    } else if (score >= 75) {
      score_category = "🌱 Sustainable";
      score_explanation = "Great job! Your emissions are manageable.";
    } else if (score >= 60) {
      score_category = "⚖️ Moderate Impact";
      score_explanation = "Your carbon footprint is average.";
    } else if (score >= 40) {
      score_category = "⚠️ High Impact";
      score_explanation = "Your emissions are above the recommended threshold.";
    } else {
      score_category = "🚨 Critical Impact";
      score_explanation = "Urgent action is needed across all categories.";
    }
    const pcts = { Transportation: t_pct, Electricity: e_pct, Diet: d_pct };
    const primary = Object.keys(pcts).reduce((a, b) =>
      pcts[a] > pcts[b] ? a : b,
    );
    let t_insight =
      t_pct < 20
        ? `Your transportation emissions are relatively low.`
        : `Transportation accounts for ${t_pct}% of your emissions.`;
    let e_insight =
      e_pct < 20
        ? `Your electricity usage is highly efficient.`
        : `Electricity accounts for ${e_pct}% of your emissions.`;
    let d_insight =
      d_pct < 20
        ? `Your diet is very eco-friendly.`
        : `Food choices contribute ${d_pct}% of your emissions.`;
    let highlight =
      primary === "Transportation"
        ? "Take public transit."
        : primary === "Electricity"
          ? "Unplug unused electronics."
          : "Try a plant-based meal.";
    return {
      score,
      score_category,
      score_explanation,
      primary_source: primary,
      transport_insight: t_insight,
      electricity_insight: e_insight,
      diet_insight: d_insight,
      highlighted_action: highlight,
    };
  };
  const fetchDashboardData = async () => {
    try {
      const historyRes = await axios.get("http://127.0.0.1:8000/logs/weekly");
      if (historyRes.data && historyRes.data.length > 0) {
        const latest = historyRes.data[historyRes.data.length - 1];
        if (!result) {
          setResult(latest);
          setCoachData(generateLocalCoachAdvice(latest));
        }
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    }
  };
  const updateDashboard = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    let currentResult = null;
    try {
      const calcResponse = await axios.post("http://127.0.0.1:8000/calculate", {
        car_km: parseFloat(carKm) || 0,
        bus_km: parseFloat(busKm) || 0,
        electricity_kwh: parseFloat(electricityKwh) || 0,
        diet_type: dietType,
      });
      currentResult = calcResponse.data;
      setResult(currentResult);
    } catch (err) {
      console.error(err);
      setError("Failed to calculate.");
      return setLoading(false);
    }
    try {
      const coachResponse = await axios.post("http://127.0.0.1:8000/coach", {
        transport: currentResult.transport,
        electricity: currentResult.electricity,
        diet: currentResult.diet,
        total: currentResult.total,
      });
      setCoachData(coachResponse.data);
      const logRes = await axios.post("http://127.0.0.1:8000/logs", {
        ...currentResult,
        eco_score: coachResponse.data.score,
      });
      if (
        logRes.data &&
        logRes.data.new_badges &&
        logRes.data.new_badges.length > 0
      ) {
        setNotifications(logRes.data.new_badges);
        setTimeout(() => setNotifications([]), 6000);
      }
    } catch (err) {
      console.error(err);
      const score = 50;
      currentResult.eco_score = score;
      setCoachData(generateLocalCoachAdvice(currentResult));
      await axios
        .post("http://127.0.0.1:8000/logs", {
          ...currentResult,
          eco_score: score,
        })
        .catch(() => { });
    } finally {
      await fetchDashboardData();
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const pieChartData = result
    ? [
      { name: "Transportation", value: result.transport, color: "#3B82F6" },
      { name: "Electricity", value: result.electricity, color: "#F59E0B" },
      { name: "Diet", value: result.diet, color: "#10B981" },
    ].filter((item) => item.value > 0)
    : [];
  const getStatus = (total) => {
    if (total < 5)
      return {
        label: "Low Impact",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    if (total <= 10)
      return {
        label: "Moderate Impact",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    return {
      label: "High Impact",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
    };
  };
  const status = result ? getStatus(result.total) : null;
  const totalVal = result ? result.total || 1 : 1;
  const transportPct = result
    ? Math.round((result.transport / totalVal) * 100)
    : 0;
  const electricityPct = result
    ? Math.round((result.electricity / totalVal) * 100)
    : 0;
  const dietPct = result ? Math.round((result.diet / totalVal) * 100) : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = coachData
    ? circumference - (coachData.score / 100) * circumference
    : circumference;
  const getScoreStrokeColor = (score) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-green-500";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-500";
    return "text-rose-500";
  };
  const getScoreBadgeColor = (score) => {
    if (score >= 90)
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (score >= 75)
      return "bg-green-50 text-green-700 border border-green-200";
    if (score >= 60)
      return "bg-amber-50 text-amber-700 border border-amber-200";
    else if (score >= 40)
      return "bg-orange-50 text-orange-700 border border-orange-200";
    return "bg-rose-50 text-rose-700 border border-rose-200";
  };
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8 mt-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Dashboard
          </h1>{" "}
          <p className="text-text-muted mt-1">
            Track and calculate your daily emissions.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {" "}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium bg-surface shadow-sm text-text-muted">
            {" "}
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
            AI Coach Live{" "}
          </span>{" "}
          <DarkModeToggle />{" "}
        </div>{" "}
      </div>{" "}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {" "}
          {notifications.map((b, i) => (
            <div
              key={i}
              className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce"
            >
              {" "}
              <span className="text-3xl">{b.icon}</span>{" "}
              <div>
                {" "}
                <p className="font-bold">Badge Unlocked!</p>{" "}
                <p className="text-sm">{b.name}</p>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {" "}
        <div className="lg:col-span-4 space-y-6">
          {" "}
          {result && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              {" "}
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-surface opacity-10 rounded-full blur-2xl"></div>{" "}
              <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-teal-400 opacity-20 rounded-full blur-2xl"></div>{" "}
              <div className="relative z-10 flex flex-col items-center text-center">
                {" "}
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border border-white/20 ${status.color.replace("bg-", "bg-surface/90 text-").replace("text-", "text-").replace("border-", "")}`}
                >
                  {" "}
                  <span
                    className={`inline-block h-2 w-2 rounded-full mr-2 ${status.dot}`}
                  ></span>{" "}
                  {status.label}{" "}
                </span>{" "}
                <p className="text-emerald-100 font-semibold tracking-wide uppercase text-xs mb-1">
                  Today's Footprint
                </p>{" "}
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  {" "}
                  <h2 className="text-6xl font-black tracking-tighter">
                    {result.total}
                  </h2>{" "}
                  <span className="text-xl font-bold text-emerald-200">
                    kg CO₂
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border">
            {" "}
            <h2 className="text-lg font-bold text-text-main mb-4">
              Update Activities
            </h2>{" "}
            {error && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs">
                {" "}
                {error}{" "}
              </div>
            )}{" "}
            <form onSubmit={updateDashboard} className="space-y-4">
              {" "}
              <div>
                {" "}
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Car Travel (km)
                </label>{" "}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={carKm}
                  onChange={(e) => setCarKm(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-surface text-text-main rounded-lg outline-none text-sm"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Bus Travel (km)
                </label>{" "}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={busKm}
                  onChange={(e) => setBusKm(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-surface text-text-main rounded-lg outline-none text-sm"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Electricity (kWh)
                </label>{" "}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-surface text-text-main rounded-lg outline-none text-sm"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Diet Type
                </label>{" "}
                <div className="grid grid-cols-2 gap-2">
                  {" "}
                  <button
                    type="button"
                    onClick={() => setDietType("vegetarian")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${dietType === "vegetarian" ? "bg-emerald-600 border-emerald-600 text-text-main" : "bg-surface border-border text-text-muted"}`}
                  >
                    Vegetarian
                  </button>{" "}
                  <button
                    type="button"
                    onClick={() => setDietType("non-vegetarian")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${dietType === "non-vegetarian" ? "bg-emerald-600 border-emerald-600 text-text-main" : "bg-surface border-border text-text-muted"}`}
                  >
                    Non-Veg
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-text-main text-bg hover:bg-slate-800 font-semibold py-3 px-4 rounded-xl text-sm shadow-sm transition disabled:bg-slate-500 mt-2"
              >
                {" "}
                {loading ? "Optimizing..." : "Sync Dashboard"}{" "}
              </button>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-8 space-y-6">
          {" "}
          {!result ? (
            <div className="bg-surface p-12 rounded-[2rem] shadow-sm border border-border flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              {" "}
              <div className="h-20 w-20 bg-surface2 rounded-full flex items-center justify-center text-4xl mb-6">
                🌱
              </div>{" "}
              <h2 className="text-2xl font-extrabold text-text-main mb-2">
                No activity recorded yet
              </h2>{" "}
              <p className="text-text-muted max-w-md mx-auto mb-8">
                Complete your first carbon calculation to start tracking your
                sustainability journey.
              </p>{" "}
              <button
                onClick={updateDashboard}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md"
              >
                {" "}
                Calculate First Footprint{" "}
              </button>{" "}
            </div>
          ) : (
            <>
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border">
                  {" "}
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-5">
                    Emissions Breakdown
                  </h3>{" "}
                  <div className="space-y-4">
                    {" "}
                    <div className="flex justify-between items-center text-sm">
                      {" "}
                      <span className="text-text-muted flex items-center gap-3">
                        <span className="flex items-center justify-center bg-blue-50 text-blue-500 h-8 w-8 rounded-full">
                          🚗
                        </span>
                        Transportation
                      </span>{" "}
                      <span className="font-bold text-text-main">
                        {result.transport} kg{" "}
                        <span className="text-text-muted font-normal ml-1">
                          ({transportPct}%)
                        </span>
                      </span>{" "}
                    </div>{" "}
                    <div className="flex justify-between items-center text-sm">
                      {" "}
                      <span className="text-text-muted flex items-center gap-3">
                        <span className="flex items-center justify-center bg-amber-50 text-amber-500 h-8 w-8 rounded-full">
                          ⚡
                        </span>
                        Electricity
                      </span>{" "}
                      <span className="font-bold text-text-main">
                        {result.electricity} kg{" "}
                        <span className="text-text-muted font-normal ml-1">
                          ({electricityPct}%)
                        </span>
                      </span>{" "}
                    </div>{" "}
                    <div className="flex justify-between items-center text-sm">
                      {" "}
                      <span className="text-text-muted flex items-center gap-3">
                        <span className="flex items-center justify-center bg-emerald-50 text-emerald-500 h-8 w-8 rounded-full">
                          🍽
                        </span>
                        Diet
                      </span>{" "}
                      <span className="font-bold text-text-main">
                        {result.diet} kg{" "}
                        <span className="text-text-muted font-normal ml-1">
                          ({dietPct}%)
                        </span>
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex flex-col items-center justify-between">
                  {" "}
                  <div className="w-full">
                    {" "}
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                      Contribution Share
                    </h3>{" "}
                  </div>{" "}
                  <div className="w-full h-40">
                    {" "}
                    <ResponsiveContainer width="100%" height="100%">
                      {" "}
                      <PieChart>
                        {" "}
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {" "}
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}{" "}
                        </Pie>{" "}
                        <RechartsTooltip
                          formatter={(value) => [
                            `${value} kg CO₂`,
                            "Emissions",
                          ]}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                          }}
                        />{" "}
                      </PieChart>{" "}
                    </ResponsiveContainer>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {coachData && (
                <div className="bg-surface/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-border relative overflow-hidden">
                  {" "}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"></div>{" "}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                    {" "}
                    <div>
                      {" "}
                      <div className="flex items-center gap-3 mb-2">
                        {" "}
                        <h3 className="text-2xl font-extrabold text-text-main tracking-tight">
                          🤖 AI Sustainability Coach
                        </h3>{" "}
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-text-main text-[10px] uppercase font-black tracking-widest rounded-full shadow-md">
                          Powered by AI
                        </span>{" "}
                      </div>{" "}
                      <p className="text-text-muted text-sm">
                        Personalized, data-driven strategies to lower your
                        ecological footprint.
                      </p>{" "}
                    </div>{" "}
                    <div className="flex flex-row items-center gap-5 bg-surface/60 p-4 rounded-3xl border border-border shadow-sm backdrop-blur-md">
                      {" "}
                      <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                        {" "}
                        <svg className="transform -rotate-90 w-20 h-20">
                          {" "}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-100"
                          />{" "}
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={`transition-all duration-1000 ease-in-out ${getScoreStrokeColor(coachData.score)}`}
                            strokeLinecap="round"
                          />{" "}
                        </svg>{" "}
                        <div className="absolute flex flex-col items-center justify-center">
                          {" "}
                          <span className="text-xl font-black text-text-main leading-none">
                            {coachData.score}
                          </span>{" "}
                          <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold mt-0.5">
                            / 100
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className="flex-1 min-w-[160px] max-w-[200px]">
                        {" "}
                        <div
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mb-1.5 ${getScoreBadgeColor(coachData.score)}`}
                        >
                          {coachData.score_category}
                        </div>{" "}
                        <p className="text-[11px] text-text-muted leading-snug">
                          {coachData.score_explanation}
                        </p>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-2xl border border-indigo-100/50 relative overflow-hidden shadow-sm">
                    {" "}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>{" "}
                    <div className="flex gap-4 items-start">
                      {" "}
                      <div className="text-2xl bg-surface p-2.5 rounded-xl shadow-sm border border-indigo-50">
                        💡
                      </div>{" "}
                      <div>
                        {" "}
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                          Top Priority Action
                        </h4>{" "}
                        <p className="text-indigo-900 font-semibold leading-relaxed text-sm">
                          {coachData.highlighted_action}
                        </p>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {" "}
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300">
                      {" "}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center bg-blue-50 text-blue-500 h-10 w-10 rounded-xl text-lg">
                          🚗
                        </span>
                        <h4 className="font-bold text-text-main text-sm">
                          Transportation
                        </h4>
                      </div>{" "}
                      <p className="text-sm text-text-muted leading-relaxed">
                        {coachData.transport_insight}
                      </p>{" "}
                    </div>{" "}
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300">
                      {" "}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center bg-amber-50 text-amber-500 h-10 w-10 rounded-xl text-lg">
                          ⚡
                        </span>
                        <h4 className="font-bold text-text-main text-sm">
                          Electricity
                        </h4>
                      </div>{" "}
                      <p className="text-sm text-text-muted leading-relaxed">
                        {coachData.electricity_insight}
                      </p>{" "}
                    </div>{" "}
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition duration-300">
                      {" "}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center bg-emerald-50 text-emerald-500 h-10 w-10 rounded-xl text-lg">
                          🍽
                        </span>
                        <h4 className="font-bold text-text-main text-sm">
                          Diet
                        </h4>
                      </div>{" "}
                      <p className="text-sm text-text-muted leading-relaxed">
                        {coachData.diet_insight}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              )}{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Dashboard;
