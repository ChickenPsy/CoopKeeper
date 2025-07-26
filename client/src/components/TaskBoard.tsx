import { useState, useEffect } from "react";
import { Utensils, Droplets, Egg, Fan, Stethoscope } from "lucide-react";

interface Task {
  id: string;
  name: string;
  description: string;
  icon: any;
  completed: boolean;
}

const defaultTasks: Omit<Task, "completed">[] = [
  {
    id: "feed",
    name: "Feed hens",
    description: "Morning and evening feeding",
    icon: Utensils,
  },
  {
    id: "water",
    name: "Change water",
    description: "Fresh water daily",
    icon: Droplets,
  },
  {
    id: "collect",
    name: "Collect eggs",
    description: "Check nesting boxes",
    icon: Egg,
  },
  {
    id: "clean",
    name: "Clean bedding",
    description: "Replace dirty bedding",
    icon: Fan,
  },
  {
    id: "health",
    name: "Health check",
    description: "Observe behavior and appearance",
    icon: Stethoscope,
  },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load today's tasks
    const savedTasks = localStorage.getItem(`tasks-${today}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Initialize with default tasks
      const initialTasks = defaultTasks.map(task => ({
        ...task,
        completed: false,
      }));
      setTasks(initialTasks);
      localStorage.setItem(`tasks-${today}`, JSON.stringify(initialTasks));
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
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-coop-brown">Daily Tasks</h2>
        <div className="text-sm text-gray-600">
          <span>{completedCount}</span>/<span>{totalTasks}</span> completed
        </div>
      </div>

      {/* Task Items */}
      {tasks.map((task) => {
        const IconComponent = task.icon;
        return (
          <div key={task.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-6 h-6 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
            />
            <div className="flex-1">
              <h3 className={`font-semibold text-coop-brown ${task.completed ? 'line-through' : ''}`}>
                {task.name}
              </h3>
              <p className="text-sm text-gray-500">{task.description}</p>
            </div>
            <IconComponent 
              className={task.completed ? "text-yellow-400" : "text-gray-400"} 
              size={20} 
            />
          </div>
        );
      })}

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-coop-brown">Daily Progress</span>
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="coop-yellow h-3 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {progressPercentage === 100 ? "Excellent work! All tasks completed!" : "Great job! Keep up the good work."}
        </p>
      </div>
    </div>
  );
}
