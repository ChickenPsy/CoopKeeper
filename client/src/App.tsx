import * as React from "react";
import NavBar from "./components/NavBar";
import SimpleEggCounter from "./components/SimpleEggCounter";
import TaskBoard from "./components/TaskBoard";
import Expenses from "./components/Expenses";
import Chickens from "./components/Chickens";
import AddChickenModal from "./components/AddChickenModal";

const { useState, useEffect } = React;

type View = "eggs" | "tasks" | "expenses" | "chickens";

function App() {
  const [activeView, setActiveView] = useState<View>("eggs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "short", 
      day: "numeric" 
    }));
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "eggs":
        return <SimpleEggCounter />;
      case "tasks":
        return <TaskBoard />;
      case "expenses":
        return <Expenses />;
      case "chickens":
        return <Chickens onOpenModal={() => setIsModalOpen(true)} />;
      default:
        return <SimpleEggCounter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 coop-yellow rounded-full flex items-center justify-center">
                <span className="text-coop-brown text-lg">🥚</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-coop-brown">CoopKeeper</h1>
                <p className="text-sm text-gray-500">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {renderView()}
      </main>

      {/* Navigation */}
      <NavBar activeView={activeView} onViewChange={setActiveView} />

      {/* Add Chicken Modal */}
      <AddChickenModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default App;
