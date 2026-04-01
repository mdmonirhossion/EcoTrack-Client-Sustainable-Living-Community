import { Link, useRouteError } from "react-router-dom";
import { FaLeaf, FaHome } from "react-icons/fa";

const NotFound = () => {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md text-center">

        {/* Animated leaf */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <FaLeaf className="text-5xl text-green-400 animate-bounce" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="mb-2 font-black leading-none text-green-500 text-9xl">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-bold text-gray-700">
          Page Not Found
        </h2>

        <p className="mb-2 text-sm leading-relaxed text-gray-500">
          Looks like this page went off-grid! The page you are looking for
          does not exist or has been moved.
        </p>

        {error && (
          <p className="px-3 py-2 mb-6 text-xs text-red-400 rounded-lg bg-red-50">
            {error.statusText || error.message}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl"
          >
            <FaHome /> Back to Home
          </Link>
          <Link
            to="/challenges"
            className="px-6 py-3 font-semibold text-green-600 transition border border-green-500 rounded-xl hover:bg-green-50"
          >
            Browse Challenges
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;