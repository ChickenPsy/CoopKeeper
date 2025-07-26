import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { calcAge } from "../utils/calcAge";

interface Chicken {
  id: string;
  name: string;
  breed: string;
  specificBreed?: string;
  dateOfBirth: string;
  photo?: string;
}

interface ChickensProps {
  onOpenModal: () => void;
}

export default function Chickens({ onOpenModal }: ChickensProps) {
  const [chickens, setChickens] = useState<Chicken[]>([]);

  useEffect(() => {
    // Load chickens from localStorage
    const savedChickens = localStorage.getItem("coop-chickens");
    if (savedChickens) {
      setChickens(JSON.parse(savedChickens));
    }
  }, []);

  const getBreedColor = (breed: string) => {
    switch (breed.toLowerCase()) {
      case "layer":
        return "bg-yellow-100 text-yellow-800";
      case "broiler":
        return "bg-orange-100 text-orange-800";
      case "bantam":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDefaultImage = (breed: string) => {
    // Use a placeholder image service or default chicken image based on breed
    const images = {
      layer: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      broiler: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      bantam: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      other: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    };
    return images[breed.toLowerCase() as keyof typeof images] || images.other;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-coop-brown">My Chickens</h2>
        <div className="text-sm text-gray-600">
          <span>{chickens.length}</span> chickens
        </div>
      </div>

      {/* Chicken Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chickens.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <p>No chickens added yet</p>
              <p className="text-sm mt-1">Tap the + button to add your first chicken</p>
            </div>
          </div>
        ) : (
          chickens.map((chicken) => (
            <div key={chicken.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={chicken.photo || getDefaultImage(chicken.breed)}
                alt={chicken.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-coop-brown">{chicken.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getBreedColor(chicken.breed)}`}>
                    {chicken.breed}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {chicken.specificBreed || chicken.breed}
                </p>
                <p className="text-xs text-gray-500">
                  {calcAge(chicken.dateOfBirth)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Chicken Floating Button */}
      <button
        onClick={onOpenModal}
        className="fixed bottom-24 right-6 w-14 h-14 coop-brown rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-105 z-10 flex items-center justify-center"
      >
        <Plus className="text-xl" size={24} />
      </button>
    </div>
  );
}
