import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  FaLeaf, FaUsers, FaClock, FaCalendarAlt,
  FaBullseye, FaArrowLeft, FaCheckCircle,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";

const categoryColors = {
  "Waste Reduction": "bg-yellow-100 text-yellow-700",
  "Energy Conservation": "bg-blue-100 text-blue-700",
  "Water Conservation": "bg-cyan-100 text-cyan-700",
  "Sustainable Transport": "bg-orange-100 text-orange-700",
  "Green Living": "bg-green-100 text-green-700",
};

const JoinChallenge = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    api.get(`/api/challenges/${id}`)
      .then((res) => {
        setChallenge(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err.response?.status, err.response?.data);
        const status = err.response?.status;
        if (status === 404) {
          setError("Challenge not found.");
        } else if (!err.response) {
          setError("Cannot connect to server. Is the backend running?");
        } else {
          setError("Failed to load challenge. Please try again later.");
        }
        setLoading(false);
      });
  }, [id]);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!agreed) return toast.error("Please agree to terms!");
    const userId = user?.uid || user?.email;
    if (!userId) return toast.error("Please sign in again.");
  
    setJoining(true);
    try {
      await api.post(`/api/challenges/${id}/join`, { userId });
    
      toast.success("Joined! Time to save the planet 🌿");
      navigate("/my-activities");
    } catch (err) {
      const msg = err.response?.data?.message || "Join failed";
      toast.error(msg);
      if(msg === "Already joined") navigate("/my-activities");
    } finally {
      setJoining(false);
    }
  };
  if (loading) return <Spinner />;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 gap-4">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="text-sm text-green-600 hover:underline">
        Retry
      </button>
    </div>
  );
  if (!challenge) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Challenge not found.
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 transition hover:text-green-600"
        >
          <FaArrowLeft /> Back to Challenge
        </button>

        {/* Challenge Info Card */}
        <div className="mb-6 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
          <img
            src={
              challenge.imageUrl ||
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
            }
            alt={challenge.title}
            className="object-cover w-full h-48"
          />
          <div className="p-6">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                categoryColors[challenge.category] || "bg-gray-100 text-gray-700"
              }`}
            >
              {challenge.category}
            </span>
            <h1 className="mt-3 mb-2 text-2xl font-black text-gray-800">
              {challenge.title}
            </h1>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              {challenge.description}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { icon: <FaUsers className="text-green-500" />, label: "Participants", value: challenge.participants },
                { icon: <FaClock className="text-green-500" />, label: "Duration", value: `${challenge.duration} days` },
                { icon: <FaCalendarAlt className="text-green-500" />, label: "Starts", value: new Date(challenge.startDate).toLocaleDateString() },
                { icon: <FaCalendarAlt className="text-red-400" />, label: "Ends", value: new Date(challenge.endDate).toLocaleDateString() },
              ].map((s, i) => (
                <div key={i} className="p-3 text-center bg-gray-50 rounded-xl">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-xs font-bold text-gray-700">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Target Card */}
        <div className="p-5 mb-6 border border-green-200 bg-green-50 rounded-2xl">
          <h3 className="flex items-center gap-2 mb-2 font-bold text-green-800">
            <FaBullseye className="text-green-600" /> Challenge Target
          </h3>
          <p className="text-sm text-green-700">{challenge.target}</p>
          <p className="mt-2 text-xs font-medium text-green-600">
            Impact Metric: {challenge.impactMetric}
          </p>
        </div>

        {/* Join Form */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <FaLeaf className="text-xl text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800">
                Join This Challenge
              </h2>
              <p className="text-xs text-gray-400">
                Joining as: {user?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            {/* What to expect */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="mb-3 text-sm font-semibold text-gray-700">
                What you will do:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Complete the challenge within {challenge.duration} days</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Track your progress regularly in My Activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Help measure: {challenge.impactMetric}</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Contribute to community eco-impact</span>
                </li>
              </ul>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-green-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-600 transition group-hover:text-gray-800">
                I understand the challenge requirements and commit to tracking
                my progress. I agree to participate in this sustainability
                challenge sincerely.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={joining || !agreed}
              className="flex items-center justify-center w-full gap-2 py-4 text-sm font-bold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joining ? (
                <>
                  <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                  Joining...
                </>
              ) : (
                <>
                  <FaLeaf /> Confirm & Join Challenge
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              You can track your progress anytime from{" "}
              <Link to="/my-activities" className="text-green-500 hover:underline">
                My Activities
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinChallenge;