import { useEffect, useState } from "react";
import axios from "axios";
import ChallengeCard from "../components/ChallengeCard";
import SkeletonCard from "../components/SkeletonCard";
import { FaFilter, FaSearch } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const categories = [
  "All",
  "Waste Reduction",
  "Energy Conservation",
  "Water Conservation",
  "Sustainable Transport",
  "Green Living",
];

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");

  const fetchChallenges = () => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== "All") params.category = selectedCategory;
    if (minP) params.minP = minP;
    if (maxP) params.maxP = maxP;

    axios
      .get(`${API}/api/challenges`, { params })
      .then((res) => {
        setChallenges(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedCategory]);

  const filtered = challenges.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-emerald-900 text-white py-14 px-6 text-center">
        <h1 className="text-4xl font-black mb-2">Browse Challenges</h1>
        <p className="text-emerald-300 text-sm max-w-xl mx-auto">
          Find the perfect sustainability challenge and start making a difference today.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-green-500" />
            <span className="font-semibold text-gray-700">Filter Challenges</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Min Participants */}
            <input
              type="number"
              placeholder="Min participants"
              value={minP}
              onChange={(e) => setMinP(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Max Participants */}
            <input
              type="number"
              placeholder="Max participants"
              value={maxP}
              onChange={(e) => setMaxP(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={fetchChallenges}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setMinP("");
                setMaxP("");
                setSearch("");
              }}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-semibold text-green-600">{filtered.length}</span> challenges
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
            ? filtered.map((c) => <ChallengeCard key={c._id} challenge={c} />)
            : (
              <div className="col-span-3 text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🌿</p>
                <p className="text-lg font-semibold">No challenges found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;