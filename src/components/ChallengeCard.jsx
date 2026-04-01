import { Link } from "react-router-dom";
import { FaUsers, FaClock, FaArrowRight } from "react-icons/fa";

const categoryColors = {
  "Waste Reduction": "bg-yellow-100 text-yellow-700",
  "Energy Conservation": "bg-blue-100 text-blue-700",
  "Water Conservation": "bg-cyan-100 text-cyan-700",
  "Sustainable Transport": "bg-orange-100 text-orange-700",
  "Green Living": "bg-green-100 text-green-700",
};

const ChallengeCard = ({ challenge }) => {
  const { _id, title, category, description, duration, participants, imageUrl } = challenge;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"}
          alt={title}
          className="w-full h-44 object-cover"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            categoryColors[category] || "bg-gray-100 text-gray-700"
          }`}
        >
          {category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <FaClock className="text-green-500" /> {duration} days
          </span>
          <span className="flex items-center gap-1">
            <FaUsers className="text-green-500" /> {participants} joined
          </span>
        </div>

        <Link
          to={`/challenges/${_id}`}
          className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          View Details <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;