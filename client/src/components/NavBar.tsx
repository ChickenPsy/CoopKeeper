import React from "react";
import { Egg, Menu, DollarSign, Bird } from "lucide-react";

type View = "eggs" | "tasks" | "expenses" | "chickens";

interface NavBarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export default function NavBar({ activeView, onViewChange }: NavBarProps) {
  const tabs = [
    { id: "eggs", label: "Eggs", icon: Egg },
    { id: "tasks", label: "Tasks", icon: Menu },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "chickens", label: "Chickens", icon: Bird },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeView === id ? "tab-active" : "tab-inactive"
              }`}
            >
              <Icon className="text-lg mb-1" size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
