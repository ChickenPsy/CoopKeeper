import * as React from "react";

const { useState, useEffect } = React;

// Simple components without external dependencies
function SimpleNavBar({ activeView, onViewChange }: { activeView: string; onViewChange: (view: string) => void }) {
  const tabs = [
    { id: "eggs", label: "Eggs", icon: "🥚" },
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "expenses", label: "Expenses", icon: "💰" },
    { id: "chickens", label: "Chickens", icon: "🐔" },
    { id: "contact", label: "Contact", icon: "📞" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeView === id ? "tab-active" : "tab-inactive"
              }`}
            >
              <span className="text-lg mb-1">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function EggCounter() {
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [eggAudio, setEggAudio] = useState<HTMLAudioElement | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedCount = localStorage.getItem(`eggs-${today}`);
    if (savedCount) {
      setTodayCount(parseInt(savedCount));
    }

    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const count = localStorage.getItem(`eggs-${dateKey}`);
      weekData.push(count ? parseInt(count) : 0);
    }
    setWeeklyData(weekData);

    // Create a simple egg click sound using Web Audio API
    const createEggSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create egg crack sound - short, soft tone
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        
        return { audioContext, oscillator, gainNode };
      } catch (e) {
        console.log('Web Audio API not supported');
        return null;
      }
    };
    
    setEggAudio(createEggSound as any);
  }, [today]);

  const addEgg = () => {
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    localStorage.setItem(`eggs-${today}`, newCount.toString());
    
    const newWeeklyData = [...weeklyData];
    newWeeklyData[6] = newCount;
    setWeeklyData(newWeeklyData);
    
    // Play egg sound on user interaction
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create egg crack sound - short, soft tone
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
      console.log('Audio playback failed:', e);
    }
  };

  const resetCount = () => {
    setTodayCount(0);
    localStorage.setItem(`eggs-${today}`, "0");
    
    const newWeeklyData = [...weeklyData];
    newWeeklyData[6] = 0;
    setWeeklyData(newWeeklyData);
  };

  const exportEggData = () => {
    const rows = ['Date,Eggs'];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const count = localStorage.getItem(`eggs-${dateKey}`) || '0';
      rows.push(`${dateKey},${count}`);
    }
    
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eggs_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const shareWeeklyCard = () => {
    const weekTotal = weeklyData.reduce((sum, count) => sum + count, 0);
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#F3D34A';
      ctx.fillRect(0, 0, 400, 300);
      
      // Title
      ctx.fillStyle = '#6F4E37';
      ctx.font = 'bold 24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('CoopKeeper', 200, 60);
      
      // Week total
      ctx.font = 'bold 48px system-ui';
      ctx.fillText(`${weekTotal}`, 200, 140);
      
      ctx.font = '20px system-ui';
      ctx.fillText('eggs this week', 200, 170);
      
      // Date
      ctx.font = '16px system-ui';
      ctx.fillText(new Date().toLocaleDateString(), 200, 220);
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'egg-streak.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const weekTotal = weeklyData.reduce((sum, count) => sum + count, 0);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 coop-yellow rounded-full mx-auto flex items-center justify-center mb-3">
            <span className="text-coop-brown text-2xl">🥚</span>
          </div>
          <h2 className="text-2xl font-bold text-coop-brown dark:text-yellow-400 mb-1">Today's Eggs</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="mb-6">
          <div className="text-5xl font-bold text-coop-brown dark:text-yellow-400 mb-2">{todayCount}</div>
          <p className="text-gray-600 dark:text-gray-300">eggs collected</p>
        </div>

        <div className="flex space-x-3 mb-4">
          <button 
            onClick={addEgg}
            className="flex-1 coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors"
          >
            🔊 Add Egg
          </button>
          <button 
            onClick={resetCount}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>

        <button 
          onClick={exportEggData}
          className="w-full mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          📤 Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-coop-brown dark:text-yellow-400 mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyData.map((count, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{dayLabels[index]}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-coop-brown font-semibold text-sm ${
                index === 6 ? "coop-yellow bg-opacity-50" : "coop-yellow"
              }`}>
                {count}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-coop-brown dark:text-yellow-400">{weekTotal}</span>
          <span className="text-gray-600 dark:text-gray-300 ml-1">eggs this week</span>
        </div>
        <button 
          onClick={shareWeeklyCard}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          📤 Share Weekly Card
        </button>
      </div>
    </div>
  );
}

function TaskBoard() {
  const [tasks, setTasks] = useState<Array<{id: string; name: string; description: string; completed: boolean}>>([]);
  
  const today = new Date().toISOString().split('T')[0];

  const defaultTasks = [
    { id: "feed", name: "Feed hens", description: "Morning and evening feeding", completed: false },
    { id: "water", name: "Change water", description: "Fresh water daily", completed: false },
    { id: "collect", name: "Collect eggs", description: "Check nesting boxes", completed: false },
    { id: "clean", name: "Clean bedding", description: "Replace dirty bedding", completed: false },
    { id: "health", name: "Health check", description: "Observe behavior", completed: false },
  ];

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks-${today}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(defaultTasks);
      localStorage.setItem(`tasks-${today}`, JSON.stringify(defaultTasks));
    }
  }, [today]);

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`tasks-${today}`, JSON.stringify(updatedTasks));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-coop-brown dark:text-yellow-400">Daily Tasks</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {completedCount}/{tasks.length} completed
        </div>
      </div>

      {tasks.map((task) => (
        <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center space-x-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            className="w-6 h-6 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
          />
          <div className="flex-1">
            <h3 className={`font-semibold text-coop-brown dark:text-yellow-400 ${task.completed ? 'line-through' : ''}`}>
              {task.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
          </div>
        </div>
      ))}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-coop-brown dark:text-yellow-400">Daily Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="coop-yellow h-3 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function Expenses() {
  const [expenses, setExpenses] = useState<Array<{id: string; description: string; amount: number; date: string}>>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const savedExpenses = localStorage.getItem("coop-expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem("coop-expenses", JSON.stringify(updatedExpenses));

    setDescription("");
    setAmount("");
  };

  const exportExpenses = () => {
    const rows = ['Date,Description,Amount'];
    expenses.forEach(expense => {
      rows.push(`${expense.date},"${expense.description}",${expense.amount}`);
    });
    
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-coop-brown dark:text-yellow-400">Expenses</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Spent</div>
          <div className="text-xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-coop-brown dark:text-yellow-400 mb-4">Add New Expense</h3>
        <form onSubmit={addExpense} className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            required
          />
          <button
            type="submit"
            className="w-full coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors"
          >
            Add Expense
          </button>
        </form>
        
        <button 
          onClick={exportExpenses}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          📤 Export CSV
        </button>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-coop-brown dark:text-yellow-400">{expense.description}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{expense.date}</p>
              </div>
              <div className="font-bold text-red-600">${expense.amount.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Chickens() {
  const [chickens, setChickens] = useState<Array<{id: string; name: string; breed: string; dateOfBirth: string; photo?: string}>>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedChickens = localStorage.getItem("coop-chickens");
    if (savedChickens) {
      setChickens(JSON.parse(savedChickens));
    }
  }, []);

  const calcAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years !== 1 ? 's' : ''} old`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-coop-brown dark:text-yellow-400">My Chickens</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {chickens.length} chickens
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chickens.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No chickens added yet</p>
          </div>
        ) : (
          chickens.map((chicken) => (
            <div key={chicken.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {chicken.photo ? (
                  <img src={chicken.photo} alt={chicken.name} className="w-full h-32 object-cover" />
                ) : (
                  <span className="text-4xl">🐔</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-coop-brown dark:text-yellow-400">{chicken.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{chicken.breed}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{calcAge(chicken.dateOfBirth)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 coop-brown rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-105 z-10 flex items-center justify-center"
      >
        <span className="text-xl">+</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-coop-brown dark:text-yellow-400 mb-4">Add New Chicken</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Feature coming soon!</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full coop-brown font-semibold py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Contact() {
  const handleSendFeedback = () => {
    window.location.href = 'mailto:eggsquadlabs@proton.me';
  };

  const handleBuyMeCoffee = () => {
    window.open('https://coff.ee/eggsquadlabs', '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-coop-brown dark:text-yellow-400 mb-4">Contact & Support</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Have feedback or questions? Reach out any time.
        </p>
        
        <button
          onClick={handleSendFeedback}
          className="w-full coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors mb-8"
        >
          Send Feedback
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-coop-brown dark:text-yellow-400 mb-4">
            Support CoopKeeper
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If CoopKeeper helps you manage your flock, consider buying us a coffee ☕
          </p>
          
          <button
            onClick={handleBuyMeCoffee}
            className="w-full coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors"
          >
            Buy Me a Coffee
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
        <div className="text-4xl mb-4">🐔</div>
        <h4 className="text-lg font-semibold text-coop-brown dark:text-yellow-400 mb-2">
          Thank you for using CoopKeeper!
        </h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We're committed to helping chicken keepers manage their flocks with ease.
        </p>
      </div>
    </div>
  );
}

function WeeklyReminderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md text-center">
        <div className="text-4xl mb-4">🔔</div>
        <h3 className="text-xl font-bold text-coop-brown dark:text-yellow-400 mb-4">Weekly Reminder</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Don't forget to record this week's final egg count and clean the coop!
        </p>
        <button
          onClick={onClose}
          className="w-full coop-brown font-semibold py-3 px-6 rounded-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("eggs");
  const [darkMode, setDarkMode] = useState(false);
  const [showWeeklyReminder, setShowWeeklyReminder] = useState(false);

  useEffect(() => {
    // Load dark mode preference
    const savedTheme = localStorage.getItem("coop-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Check for Sunday reminder
    const today = new Date();
    if (today.getDay() === 0) { // Sunday
      const todayKey = today.toISOString().split('T')[0];
      const reminderKey = `sunday-reminder-${todayKey}`;
      if (!localStorage.getItem(reminderKey)) {
        setShowWeeklyReminder(true);
        localStorage.setItem(reminderKey, "shown");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("coop-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("coop-theme", "light");
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "eggs": return <EggCounter />;
      case "tasks": return <TaskBoard />;
      case "expenses": return <Expenses />;
      case "chickens": return <Chickens />;
      case "contact": return <Contact />;
      default: return <EggCounter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 coop-yellow rounded-full flex items-center justify-center">
                <span className="text-coop-brown text-lg">🥚</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-coop-brown dark:text-yellow-400">CoopKeeper</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {renderView()}
      </main>

      <SimpleNavBar activeView={activeView} onViewChange={setActiveView} />

      {showWeeklyReminder && (
        <WeeklyReminderModal onClose={() => setShowWeeklyReminder(false)} />
      )}
    </div>
  );
}