import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import ChallengeCard from "../components/ChallengeCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBoundary from "../components/ErrorBoundary";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const categories = [
  "All",
  "Waste Reduction",
  "Energy Conservation",
  "Water Conservation",
  "Sustainable Transport",
  "Green Living",
];

const ChallengesContent = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applying, setApplying] = useState(false);

  const normalizeChallenges = useCallback((payload) => {
    if (Array.isArray(payload)) return payload;

    // Sometimes APIs return a stringified JSON array/object.
    if (typeof payload === "string") {
      try {
        return normalizeChallenges(JSON.parse(payload));
      } catch {
        return [];
      }
    }

    if (payload && typeof payload === "object") {
      const candidate = payload.challenges ?? payload.data;
      if (Array.isArray(candidate)) return candidate;
    }

    return [];
  }, []);

  const fetchChallenges = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/api/challenges', { params });
      const data = normalizeChallenges(res.data);
      setChallenges(data);
    } catch (err) {
      toast.error("Failed to load challenges. Please try again!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [normalizeChallenges]);

  // Initial fetch
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleApplyFilters = async () => {
    setApplying(true);
    try {
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (minP) params.minP = minP;
      if (maxP) params.maxP = maxP;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/api/challenges', { params });
      const data = normalizeChallenges(res.data);
      setChallenges(data);

      if (data.length === 0) {
        toast("No challenges match your filters 🌿", { icon: "🔍" });
      } else {
        toast.success(`Found ${data.length} challenges!`);
      }
    } catch {
      toast.error("Filter failed. Please try again!");
    } finally {
      setApplying(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory("All");
    setMinP("");
    setMaxP("");
    setStartDate("");
    setEndDate("");
    setSearch("");
    fetchChallenges();
    toast.success("Filters cleared!");
  };

  const safeChallenges = Array.isArray(challenges) ? challenges : [];
  const filtered = safeChallenges.filter((c) =>
    (c?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 text-center text-white bg-emerald-900 py-14">
        <h1 className="mb-2 text-4xl font-black">Sustainable Challenges</h1>
        <p className="max-w-xl mx-auto text-sm text-emerald-300">
          Find the perfect sustainability challenge and start making a
          difference today.
        </p>
      </header>

      <main className="px-6 py-10 mx-auto max-w-7xl">
        {/* Filter Box */}
        <section
          aria-label="Filter challenges"
          className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-2xl"
        >
          <div className="flex items-center gap-2 mb-5">
            <FaFilter className="text-green-500" aria-hidden="true" />
            <h2 className="text-lg font-bold text-gray-700">
              Filter Challenges
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <label htmlFor="search" className="sr-only">
                Search challenges
              </label>
              <FaSearch
                className="absolute text-sm text-gray-400 -translate-y-1/2 left-3 top-1/2"
                aria-hidden="true"
              />
              <input
                id="search"
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 pr-4 text-sm border border-gray-200 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Search challenges by title"
              />
            </div>

            {/* Min Participants */}
            <div>
              <label
                htmlFor="minP"
                className="block mb-1 text-xs font-medium text-gray-500"
              >
                Min Participants
              </label>
              <input
                id="minP"
                type="number"
                placeholder="e.g. 10"
                value={minP}
                min={0}
                onChange={(e) => setMinP(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Minimum participants"
              />
            </div>

            {/* Max Participants */}
            <div>
              <label
                htmlFor="maxP"
                className="block mb-1 text-xs font-medium text-gray-500"
              >
                Max Participants
              </label>
              <input
                id="maxP"
                type="number"
                placeholder="e.g. 1000"
                value={maxP}
                min={0}
                onChange={(e) => setMaxP(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Maximum participants"
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block mb-1 text-xs font-medium text-gray-500"
              >
                Start Date (from)
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Filter from start date"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block mb-1 text-xs font-medium text-gray-500"
              >
                End Date (to)
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Filter to end date"
              />
            </div>
          </div>

          {/* Category Pills
          <div
            className="flex flex-wrap gap-2 mb-5"
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  selectedCategory === cat
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div> */}
          {/* Category Dropdown */}
<div className="mb-5">
  <label
    htmlFor="category"
    className="block mb-1 text-xs font-medium text-gray-500"
  >
    Category
  </label>
  <select
    id="category"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full px-4 py-3 text-sm text-gray-700 bg-white border border-green-400 cursor-pointer md:w-72 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
    aria-label="Filter by category"
  >
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApplyFilters}
              disabled={applying}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60"
              aria-label="Apply filters"
            >
              {applying ? (
                <span
                  className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"
                  aria-hidden="true"
                ></span>
              ) : (
                <FaFilter aria-hidden="true" />
              )}
              {applying ? "Applying..." : "Apply Filters"}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Reset all filters"
            >
              <FaTimes aria-hidden="true" /> Reset
            </button>
          </div>
        </section>

        {/* Results Count */}
        {!loading && (
          <p className="mb-6 text-sm text-gray-500" aria-live="polite">
            Showing{" "}
            <span className="font-bold text-green-600">
              {filtered.length}
            </span>{" "}
            challenges
            {selectedCategory !== "All" && (
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {selectedCategory}
              </span>
            )}
          </p>
        )}

        {/* Challenge Grid */}
        <section aria-label="Challenge list">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length > 0 ? (
              filtered.map((c) => (
                <ChallengeCard key={c._id} challenge={c} />
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="mb-4 text-6xl" aria-hidden="true">
                  🌿
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-600">
                  No challenges found
                </h3>
                <p className="mb-4 text-sm text-gray-400">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 text-sm font-semibold text-white transition bg-green-500 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// Wrap with ErrorBoundary
const Challenges = () => (
  <ErrorBoundary>
    <ChallengesContent />
  </ErrorBoundary>
);

export default Challenges;