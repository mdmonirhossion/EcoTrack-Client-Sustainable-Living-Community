import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLeaf, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const { register, googleLogin, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passError, setPassError] = useState("");

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Minimum 6 characters required.";
    if (!/[A-Z]/.test(pass)) return "Must include at least 1 uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Must include at least 1 lowercase letter.";
    if (!/[!@#$%^&*(),.?"{}|<>]/.test(pass))
      return "Must include at least 1 special character.";
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const photoURL = e.target.photoURL.value;
    const password = e.target.password.value;

    const error = validatePassword(password);
    if (error) return setPassError(error);
    setPassError("");

    setLoading(true);
    try {
      await register(email, password);
      await updateUserProfile(name, photoURL);
      toast.success("Welcome to EcoTrack! 🌿");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success("Welcome to EcoTrack! 🌿");
      navigate("/");
    } catch {
      toast.error("Google signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <FaLeaf className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Join EcoTrack</h1>
          <p className="text-gray-500 text-sm mt-1">
            Start your green journey today 🌱
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Green"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                required
                placeholder="Create a strong password"
                onChange={(e) => setPassError(validatePassword(e.target.value))}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm pr-10 ${
                  passError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-green-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passError && (
              <p className="text-red-500 text-xs mt-1">{passError}</p>
            )}
            {!passError && (
              <p className="text-gray-400 text-xs mt-1">
                Min 6 chars, 1 uppercase, 1 lowercase, 1 special character
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!passError}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition text-sm font-medium text-gray-700 disabled:opacity-60"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;