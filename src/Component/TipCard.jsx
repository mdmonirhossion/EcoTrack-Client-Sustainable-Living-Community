import { FaThumbsUp, FaUser } from "react-icons/fa";

const TipCard = ({ tip }) => {
  const { title, content, category, authorName, upvotes, createdAt } = tip;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100 flex flex-col h-full">
      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full self-start mb-3">
        {category}
      </span>
      <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{content}</p>

      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto">
        <span className="flex items-center gap-1">
          <FaUser className="text-green-400" />
          {authorName}
        </span>
        <span className="flex items-center gap-1">
          <FaThumbsUp className="text-green-400" /> {upvotes}
        </span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TipCard;