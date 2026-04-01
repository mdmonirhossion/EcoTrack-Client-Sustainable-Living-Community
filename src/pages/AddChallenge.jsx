import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLeaf, FaPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const categories = [
  "Waste Reduction",
  "Energy Conservation",
  "Water Conservation",
  "Sustainable Transport",
  "Green Living",
];

const AddChallenge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value,
      category: form.category.value,
      description: form.description.value,
      duration: parseInt(form.duration.value),
      target: form.target.value,
      impactMetric: form.impactMetric.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      imageUrl: form.imageUrl.value,
      createdBy: user.email,
      participants: 0,
    };

    setLoading(true);
    try {
      await axios.post(`${API}/api/challenges`, data);
      toast.success("Challenge created successfully! 🌿");
      navigate("/challenges");
    } catch (err) {
      toast.error("Failed to create challenge. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <FaLeaf className="text-green-500 text-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800">Create a Challenge</h1>
          <p className="text-gray-500 text-sm mt-1">
            Inspire the community with a new sustainability challenge
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challenge Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Plastic-Free July"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Describe your challenge..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Goal <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="target"
              required
              placeholder="e.g. Reduce plastic waste by 50%"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Impact Metric */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Impact Metric <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="impactMetric"
              required
              placeholder="e.g. kg plastic saved"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="duration"
              required
              min={1}
              placeholder="30"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <FaPlus /> Create Challenge
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChallenge;