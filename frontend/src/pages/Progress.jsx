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
function Progress() {
  const [history, setHistory] = useState([]);
  const [streaks, setStreaks] = useState({
    current_streak: 0,
    longest_streak: 0,
  });
  const [result, setResult] = useState(null);
  const fetchProgressData = async () => {
    try {
      const historyRes = await axios.get("http://127.0.0.1:8000/logs/weekly");
      if (historyRes.data) {
        setHistory(historyRes.data);
        if (historyRes.data.length > 0) {
          setResult(historyRes.data[historyRes.data.length - 1]);
        }
      }
      const streakRes = await axios.get("http://127.0.0.1:8000/logs/streak");
      if (streakRes.data) setStreaks(streakRes.data);
    } catch (e) {
      console.error("Failed to fetch progress data", e);
    }
  };
  useEffect(() => {
    fetchProgressData();
  }, []);
  const bestDay =
    history.length > 0
      ? history.reduce((min, p) => (p.total < min.total ? p : min), history[0])
      : null;
  const avgWeekly =
    history.length > 0
      ? (history.reduce((acc, p) => acc + p.total, 0) / history.length).toFixed(
        2,
      )
      : 0;
  let pctChange = 0;
  let insightText = "Not enough data to calculate trends.";
  if (history.length > 1) {
    const firstHalfAvg =
      history
        .slice(0, Math.ceil(history.length / 2))
        .reduce((a, b) => a + b.total, 0) / Math.ceil(history.length / 2);
    const lastHalfAvg =
      history
        .slice(Math.ceil(history.length / 2))
        .reduce((a, b) => a + b.total, 0) / Math.floor(history.length / 2);
    pctChange = (((lastHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(
      1,
    );
    if (pctChange < 0) {
      insightText = `Awesome! Your footprint decreased by ${Math.abs(pctChange)}% compared to earlier this week.`;
    } else if (pctChange > 0) {
      insightText = `Your footprint increased by ${pctChange}% compared to earlier this week. Check your AI coach to see where to cut back.`;
    } else {
      insightText = `Your footprint is completely stable compared to earlier this week.`;
    }
  }
  const GOAL_CO2 = 5.0;
  let goalStatus = "";
  let progressPct = 0;
  let progressColor = "";
  if (result && result.total <= GOAL_CO2) {
    goalStatus = "Goal Achieved! 🎉";
    progressPct = 100;
    progressColor = "bg-emerald-500";
  } else if (result) {
    const reductionNeeded = result.total - GOAL_CO2;
    const reductionPct = Math.round((reductionNeeded / result.total) * 100);
    goalStatus = `${reductionPct}% reduction needed`;
    progressPct = Math.min(100, Math.round((GOAL_CO2 / result.total) * 100));
    progressColor = progressPct > 70 ? "bg-amber-400" : "bg-rose-500";
  }
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 mb-8 mt-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Progress
          </h1>{" "}
          <p className="text-text-muted mt-1">
            Review your sustainability journey over time.
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {result ? (
        <>
          {" "}
          <div className="mb-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-1 shadow-lg">
            {" "}
            <div className="bg-surface rounded-[1.4rem] p-6 lg:p-8 h-full">
              {" "}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                {" "}
                <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                  🎯 Daily Sustainability Goal
                </h2>{" "}
                <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full self-start md:self-auto">
                  {" "}
                  Target: &lt; 5 kg CO₂{" "}
                </span>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {" "}
                <div className="col-span-1 border border-border rounded-2xl p-6 bg-surface2 flex flex-col justify-center">
                  {" "}
                  <div className="flex justify-between items-center mb-3">
                    {" "}
                    <span className="text-text-muted text-sm font-semibold uppercase tracking-wider">
                      Current
                    </span>{" "}
                    <span className="font-black text-xl text-text-main">
                      {result.total} kg
                    </span>{" "}
                  </div>{" "}
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
                    {" "}
                    <span className="text-text-muted text-sm font-semibold uppercase tracking-wider">
                      Goal
                    </span>{" "}
                    <span className="font-black text-xl text-emerald-600">
                      5.0 kg
                    </span>{" "}
                  </div>{" "}
                  <div className="text-center">
                    {" "}
                    <p
                      className={`text-lg font-black bg-surface py-2 px-4 rounded-xl border ${result.total <= 5 ? "text-emerald-600 border-emerald-200" : "text-rose-600 border-rose-200"}`}
                    >
                      {" "}
                      {goalStatus}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="col-span-1 lg:col-span-2 flex flex-col justify-center">
                  {" "}
                  <div className="mb-3 flex justify-between text-sm font-bold text-text-muted">
                    {" "}
                    <span className="uppercase tracking-wider text-text-muted">
                      Progress towards target
                    </span>{" "}
                    <span className="text-emerald-600">
                      {progressPct}%
                    </span>{" "}
                  </div>{" "}
                  <div className="h-4 w-full bg-surface2 rounded-full overflow-hidden mb-10 shadow-inner">
                    {" "}
                    <div
                      className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${progressPct}%` }}
                    ></div>{" "}
                  </div>{" "}
                  <div className="flex justify-between items-center relative mb-6">
                    {" "}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface2 -z-10 -translate-y-1/2"></div>{" "}
                    <div className="flex flex-col items-center bg-surface px-3 relative">
                      {" "}
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 0 ? "bg-emerald-500 text-text-main border-emerald-100" : "bg-surface2 text-text-muted border-border"}`}
                      >
                        1
                      </div>{" "}
                      <span className="text-[10px] font-bold text-text-muted uppercase absolute -bottom-4 whitespace-nowrap">
                        Started
                      </span>{" "}
                    </div>{" "}
                    <div className="flex flex-col items-center bg-surface px-3 relative">
                      {" "}
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 50 ? "bg-emerald-500 text-text-main border-emerald-100" : "bg-surface2 text-text-muted border-border"}`}
                      >
                        2
                      </div>{" "}
                      <span className="text-[10px] font-bold text-text-muted uppercase absolute -bottom-4 whitespace-nowrap">
                        Halfway
                      </span>{" "}
                    </div>{" "}
                    <div className="flex flex-col items-center bg-surface px-3 relative">
                      {" "}
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-xl font-black mb-2 border-4 transition-all duration-500 ${progressPct >= 100 ? "bg-emerald-500 text-text-main border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-surface2 text-text-muted border-border"}`}
                      >
                        🏆
                      </div>{" "}
                      <span className="text-[10px] font-bold text-text-muted uppercase absolute -bottom-4 whitespace-nowrap">
                        Goal Met
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <div className="flex items-center gap-3 mb-6">
              {" "}
              <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
                Weekly Analytics
              </h2>{" "}
              <span className="px-3 py-1 bg-surface2 text-text-muted text-xs font-bold uppercase tracking-wider rounded-full">
                Past 7 Calculations
              </span>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {" "}
              <div className="lg:col-span-8 bg-surface p-8 rounded-3xl shadow-sm border border-border">
                {" "}
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">
                  Emissions Trend (kg CO₂)
                </h3>{" "}
                <div className="h-64 w-full">
                  {" "}
                  <ResponsiveContainer width="100%" height="100%">
                    {" "}
                    <LineChart
                      data={history}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      {" "}
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E5E7EB"
                      />{" "}
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dy={10}
                      />{" "}
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        dx={-10}
                      />{" "}
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        cursor={{
                          stroke: "#9CA3AF",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />{" "}
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#4F46E5"
                        strokeWidth={4}
                        dot={{
                          fill: "#4F46E5",
                          strokeWidth: 2,
                          r: 4,
                          stroke: "#FFFFFF",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#4F46E5",
                          stroke: "#FFFFFF",
                          strokeWidth: 2,
                        }}
                        animationDuration={1500}
                      />{" "}
                    </LineChart>{" "}
                  </ResponsiveContainer>{" "}
                </div>{" "}
                <div className="mt-6 flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900">
                  {" "}
                  <span className="text-xl">📈</span>{" "}
                  <p className="text-sm font-medium">{insightText}</p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="lg:col-span-4 space-y-6">
                {" "}
                <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
                  {" "}
                  <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                    📊
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                      Weekly Avg
                    </p>{" "}
                    <h4 className="text-2xl font-black text-text-main">
                      {avgWeekly}{" "}
                      <span className="text-sm font-normal text-text-muted">
                        kg CO₂
                      </span>
                    </h4>{" "}
                  </div>{" "}
                </div>{" "}
                {bestDay && (
                  <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
                    {" "}
                    <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                      🏆
                    </div>{" "}
                    <div>
                      {" "}
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                        Best Day
                      </p>{" "}
                      <h4 className="text-2xl font-black text-text-main">
                        {bestDay.total}{" "}
                        <span className="text-sm font-normal text-text-muted">
                          kg CO₂
                        </span>
                      </h4>{" "}
                      <p className="text-xs text-text-muted mt-0.5">
                        Recorded on {bestDay.day}
                      </p>{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
                  {" "}
                  <div className="h-14 w-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                    🔥
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                      Current Streak
                    </p>{" "}
                    <h4 className="text-2xl font-black text-text-main">
                      {streaks.current_streak}{" "}
                      <span className="text-sm font-normal text-text-muted">
                        days
                      </span>
                    </h4>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border flex items-center">
                  {" "}
                  <div className="h-14 w-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mr-4 shrink-0">
                    ⭐
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                      Longest Streak
                    </p>{" "}
                    <h4 className="text-2xl font-black text-text-main">
                      {streaks.longest_streak}{" "}
                      <span className="text-sm font-normal text-text-muted">
                        days
                      </span>
                    </h4>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </>
      ) : (
        <div className="bg-surface p-12 rounded-[2rem] shadow-sm border border-border flex flex-col items-center justify-center text-center">
          {" "}
          <div className="h-20 w-20 bg-surface2 rounded-full flex items-center justify-center text-4xl mb-6">
            📉
          </div>{" "}
          <h2 className="text-2xl font-extrabold text-text-main mb-2">
            No data available
          </h2>{" "}
          <p className="text-text-muted max-w-md mx-auto mb-8">
            Go to the Dashboard to calculate your first footprint and unlock
            progress tracking.
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default Progress;
