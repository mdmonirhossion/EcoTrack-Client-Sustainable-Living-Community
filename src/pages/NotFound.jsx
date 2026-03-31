import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="text-center">
        <FaLeaf className="text-green-400 text-6xl mx-auto mb-4 animate-bounce" />
        <h1 className="text-8xl font-black text-green-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like this page went off-grid! Let&apos;s get you back on the
          green path. 🌿
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;