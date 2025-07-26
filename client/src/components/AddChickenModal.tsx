import { useState } from "react";
import { X, Camera } from "lucide-react";

interface AddChickenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddChickenModal({ isOpen, onClose }: AddChickenModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    specificBreed: "",
    dateOfBirth: "",
    photo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photo: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.dateOfBirth) {
      alert("Please fill in all required fields");
      return;
    }

    const newChicken = {
      id: Date.now().toString(),
      ...formData,
    };

    // Save to localStorage
    const savedChickens = localStorage.getItem("coop-chickens");
    const chickens = savedChickens ? JSON.parse(savedChickens) : [];
    chickens.push(newChicken);
    localStorage.setItem("coop-chickens", JSON.stringify(chickens));

    // Reset form and close modal
    setFormData({
      name: "",
      breed: "",
      specificBreed: "",
      dateOfBirth: "",
      photo: "",
    });
    onClose();
    
    // Reload the page to show the new chicken
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-coop-brown">Add New Chicken</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <div className="relative">
                {formData.photo ? (
                  <div className="relative">
                    <img
                      src={formData.photo}
                      alt="Chicken preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: "" }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors cursor-pointer block">
                    <Camera className="mx-auto text-4xl text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">Tap to add photo</p>
                    <p className="text-xs text-gray-500 mt-1">Take photo or choose from gallery</p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter chicken name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed Type *</label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              >
                <option value="">Select breed type</option>
                <option value="Broiler">Broiler</option>
                <option value="Layer">Layer</option>
                <option value="Bantam">Bantam</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Specific Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Breed (Optional)</label>
              <input
                type="text"
                name="specificBreed"
                placeholder="e.g., Rhode Island Red"
                value={formData.specificBreed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 coop-brown font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors"
              >
                Add Chicken
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
