import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { FaLeaf } from "react-icons/fa";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email!");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Reset link sent! Check your email 📧");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email!");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address!");
      } else {
        toast.error("Failed to send reset link. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <FaLeaf className="text-3xl text-green-500" />
          </div>
        </div>

        {!sent ? (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
              <p className="mt-1 text-sm text-gray-500">
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm text-green-500 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <span className="text-3xl">📧</span>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">
                Check Your Email!
              </h2>
              <p className="mb-2 text-sm text-gray-500">
                We sent a password reset link to:
              </p>
              <p className="mb-6 text-sm font-semibold text-green-600">
                {email}
              </p>
              <p className="mb-6 text-xs text-gray-400">
                Did not receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={() => setSent(false)}
                className="w-full py-3 mb-3 text-sm font-semibold text-green-600 transition border border-green-500 rounded-xl hover:bg-green-50"
              >
                Try Again
              </button>

              <Link
                to="/login"
                className="block w-full py-3 text-sm font-semibold text-center text-white transition bg-green-500 hover:bg-green-600 rounded-xl"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;