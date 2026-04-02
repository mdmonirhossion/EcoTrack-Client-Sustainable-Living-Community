import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaLeaf, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
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
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    if (!data.title.trim()) newErrors.title = "Title is required";
    if (!data.category) newErrors.category = "Category is required";
    if (!data.description.trim()) newErrors.description = "Description is required";
    if (!data.target.trim()) newErrors.target = "Target goal is required";
    if (!data.impactMetric.trim()) newErrors.impactMetric = "Impact metric is required";
    if (!data.location.trim()) newErrors.location = "Location is required";
    if (!data.duration || data.duration < 1) newErrors.duration = "Duration must be at least 1 day";
    if (!data.startDate) newErrors.startDate = "Start date is required";
    if (!data.endDate) newErrors.endDate = "End date is required";
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      newErrors.endDate = "End date must be after start date";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      title: form.title.value,
      category: form.category.value,
      description: form.description.value,
      target: form.target.value,
      impactMetric: form.impactMetric.value,
      location: form.location.value,
      duration: parseInt(form.duration.value),
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      imageUrl: form.imageUrl.value,
    };

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting!");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.post(`${API}/api/challenges`, {
        ...data,
        createdBy: user.email,
        participants: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Challenge created successfully! 🌿");
      navigate("/challenges");
    } catch (err) {
      toast.error("Failed to create challenge. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
      errors[field]
        ? "border-red-400 focus:ring-red-300"
        : "border-gray-200 focus:ring-green-400"
    }`;

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl">
              <FaLeaf className="text-2xl text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800">
            Create a Challenge
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Inspire the community with a new sustainability challenge
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-8 space-y-5 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Challenge Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Plastic-Free July"
              className={inputClass("title")}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-xs text-red-500">
                {errors.title}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={inputClass("category") + " bg-white"}
              aria-describedby={errors.category ? "category-error" : undefined}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className="mt-1 text-xs text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe what this challenge involves..."
              className={inputClass("description") + " resize-none"}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* Target */}
          <div>
            <label
              htmlFor="target"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Target Goal <span className="text-red-400">*</span>
            </label>
            <input
              id="target"
              type="text"
              name="target"
              placeholder="e.g. Reduce plastic waste by 50%"
              className={inputClass("target")}
              aria-describedby={errors.target ? "target-error" : undefined}
            />
            {errors.target && (
              <p id="target-error" className="mt-1 text-xs text-red-500">
                {errors.target}
              </p>
            )}
          </div>

          {/* Impact Metric */}
          <div>
            <label
              htmlFor="impactMetric"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Impact Metric <span className="text-red-400">*</span>
            </label>
            <input
              id="impactMetric"
              type="text"
              name="impactMetric"
              placeholder="e.g. kg plastic saved"
              className={inputClass("impactMetric")}
              aria-describedby={
                errors.impactMetric ? "impactMetric-error" : undefined
              }
            />
            {errors.impactMetric && (
              <p
                id="impactMetric-error"
                className="mt-1 text-xs text-red-500"
              >
                {errors.impactMetric}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Location <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FaMapMarkerAlt
                className="absolute text-sm text-green-500 -translate-y-1/2 left-3 top-1/2"
                aria-hidden="true"
              />
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Dhaka, Bangladesh"
                className={
                  inputClass("location") + " pl-9"
                }
                aria-describedby={
                  errors.location ? "location-error" : undefined
                }
              />
            </div>
            {errors.location && (
              <p id="location-error" className="mt-1 text-xs text-red-500">
                {errors.location}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Duration (days) <span className="text-red-400">*</span>
            </label>
            <input
              id="duration"
              type="number"
              name="duration"
              min={1}
              placeholder="e.g. 30"
              className={inputClass("duration")}
              aria-describedby={
                errors.duration ? "duration-error" : undefined
              }
            />
            {errors.duration && (
              <p id="duration-error" className="mt-1 text-xs text-red-500">
                {errors.duration}
              </p>
            )}
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                className={inputClass("startDate")}
                aria-describedby={
                  errors.startDate ? "startDate-error" : undefined
                }
              />
              {errors.startDate && (
                <p
                  id="startDate-error"
                  className="mt-1 text-xs text-red-500"
                >
                  {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                End Date <span className="text-red-400">*</span>
              </label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                className={inputClass("endDate")}
                aria-describedby={
                  errors.endDate ? "endDate-error" : undefined
                }
              />
              {errors.endDate && (
                <p id="endDate-error" className="mt-1 text-xs text-red-500">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Image URL{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              className={inputClass("imageUrl")}
            />
          </div>

          {/* Created By — readonly */}
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-xl">
            <FaLeaf className="text-green-400" aria-hidden="true" />
            <span>
              Created by:{" "}
              <span className="font-medium text-gray-700">{user?.email}</span>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Create challenge"
          >
            {loading ? (
              <>
                <span
                  className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"
                  aria-hidden="true"
                ></span>
                Creating...
              </>
            ) : (
              <>
                <FaPlus aria-hidden="true" /> Create Challenge
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChallenge;