import React, { useState, useEffect } from "react";
import { Egg, Plus, RotateCcw } from "lucide-react";

export default function EggCounter() {
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load today's egg count
    const savedCount = localStorage.getItem(`eggs-${today}`);
    if (savedCount) {
      setTodayCount(parseInt(savedCount));
    }

    // Load weekly data
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const count = localStorage.getItem(`eggs-${dateKey}`);
      weekData.push(count ? parseInt(count) : 0);
    }
    setWeeklyData(weekData);
  }, [today]);

  const addEgg = () => {
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    localStorage.setItem(`eggs-${today}`, newCount.toString());
    
    // Update weekly data
    const newWeeklyData = [...weeklyData];
    newWeeklyData[6] = newCount;
    setWeeklyData(newWeeklyData);
  };

  const resetCount = () => {
    setTodayCount(0);
    localStorage.setItem(`eggs-${today}`, "0");
    
    // Update weekly data
    const newWeeklyData = [...weeklyData];
    newWeeklyData[6] = 0;
    setWeeklyData(newWeeklyData);
  };

  const weekTotal = weeklyData.reduce((sum, count) => sum + count, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Daily Counter Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 coop-yellow rounded-full mx-auto flex items-center justify-center mb-3">
            <Egg className="text-coop-brown text-2xl" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-coop-brown mb-1">Today's Eggs</h2>
          <p className="text-gray-600 text-sm">{formatDate(new Date())}</p>
        </div>
        
        <div className="mb-6">
          <div className="text-5xl font-bold text-coop-brown mb-2">{todayCount}</div>
          <p className="text-gray-600">eggs collected</p>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={addEgg}
            className="flex-1 coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            <Plus className="mr-2" size={16} />
            Add Egg
          </button>
          <button 
            onClick={resetCount}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="mr-2" size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-coop-brown mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyData.map((count, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{dayLabels[index]}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-coop-brown font-semibold text-sm ${
                index === 6 ? "coop-yellow bg-opacity-50" : "coop-yellow"
              }`}>
                {count}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-coop-brown">{weekTotal}</span>
          <span className="text-gray-600 ml-1">eggs this week</span>
        </div>
      </div>
    </div>
  );
}
