import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <FaLeaf className="text-green-500 text-4xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-6">
          Please use the Gmail password reset option or contact support at{" "}
          <span className="text-green-500 font-medium">support@ecotrack.com</span>
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition inline-block"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;