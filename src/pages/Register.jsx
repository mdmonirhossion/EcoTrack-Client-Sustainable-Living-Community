import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const { register, googleLogin, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passError, setPassError] = useState("");

  const validatePassword = (pass) => {
  if (pass.length < 6) return "Min 6 characters";
  if (!/[A-Z]/.test(pass)) return "Add an uppercase letter";
  if (!/[!@#$%^&*]/.test(pass)) return "Add a special character";
  return "";
};

  const getAuthError = (err) => {
    const code = err?.code || "";
    if (code.includes("email-already-in-use")) return "An account with this email already exists.";
    if (code.includes("invalid-email")) return "Invalid email address.";
    if (code.includes("weak-password")) return "Password is too weak.";
    return "Registration failed. Please try again.";
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
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success("Welcome to EcoTrack! 🌿");
      navigate(from, { replace: true });
    } catch {
      toast.error("Google signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <FaLeaf className="text-4xl text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Join EcoTrack</h1>
          <p className="mt-1 text-sm text-gray-500">
            Start your green journey today 🌱
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Green"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Photo URL</label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
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
                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passError && (
              <p className="mt-1 text-xs text-red-500">{passError}</p>
            )}
            {!passError && (
              <p className="mt-1 text-xs text-gray-400">
                Min 6 chars, 1 uppercase, 1 lowercase, 1 special character
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!passError}
            className="flex items-center justify-center w-full py-3 font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
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
          className="flex items-center justify-center w-full gap-3 py-3 text-sm font-medium text-gray-700 transition border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-60"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-green-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;