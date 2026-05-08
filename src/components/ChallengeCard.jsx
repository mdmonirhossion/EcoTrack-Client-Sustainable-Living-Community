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
    <div className="flex flex-col h-full overflow-hidden transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
      <div className="relative">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"}
          alt={title}
          className="object-cover w-full h-44"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            categoryColors[category] || "bg-gray-100 text-gray-700"
          }`}
        >
          {category}
        </span>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3 className="mb-2 text-lg font-bold text-gray-800 line-clamp-1">{title}</h3>
        <p className="flex-grow mb-4 text-sm text-gray-500 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
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
// submit the code for the ChallengeCard component, which displays a card with challenge information and a link to view more details. The card includes an image, category badge, title, description, duration, and participant count.


export default ChallengeCard;