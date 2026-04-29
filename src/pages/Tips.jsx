import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaThumbsUp, FaUser, FaLeaf } from "react-icons/fa";
import SkeletonCard from "../components/SkeletonCard";

const categoryColors = {
  "Waste Management": "bg-yellow-100 text-yellow-700",
  "Energy Conservation": "bg-blue-100 text-blue-700",
  "Water Conservation": "bg-cyan-100 text-cyan-700",
  "Sustainable Transport": "bg-orange-100 text-orange-700",
  "Waste Reduction": "bg-green-100 text-green-700",
};

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/tips')
      .then((res) => {
        setTips(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 text-center text-white bg-emerald-900 py-14">
        <div className="flex justify-center mb-3">
          <FaLeaf className="text-4xl text-green-400" />
        </div>
        <h1 className="mb-2 text-4xl font-black">Eco Tips</h1>
        <p className="max-w-xl mx-auto text-sm text-emerald-300">
          Practical tips from our community to help you live more sustainably.
        </p>
      </div>

      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : tips.map((tip, i) => (
                <article
                  key={tip._id || i}
                  className="flex flex-col h-full p-6 transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
                >
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full self-start mb-3 ${
                      categoryColors[tip.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tip.category}
                  </span>
                  <h2 className="mb-2 text-base font-bold text-gray-800 line-clamp-2">
                    {tip.title}
                  </h2>
                  <p className="flex-grow mb-4 text-sm text-gray-500 line-clamp-4">
                    {tip.content}
                  </p>
                  <div className="flex items-center justify-between pt-3 mt-auto text-xs text-gray-400 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <FaUser className="text-green-400" />
                      {tip.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaThumbsUp className="text-green-400" />
                      {tip.upvotes}
                    </span>
                    <span>
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Tips;