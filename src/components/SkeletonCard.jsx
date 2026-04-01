const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-pulse">
      <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
      <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2 mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
    </div>
  );
};

export default SkeletonCard;