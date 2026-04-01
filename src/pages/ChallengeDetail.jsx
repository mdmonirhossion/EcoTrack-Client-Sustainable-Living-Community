import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUsers, FaClock, FaCalendarAlt, FaLeaf,
  FaArrowLeft, FaBullseye, FaChartLine
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";

const API = import.meta.env.VITE_API_URL;

const categoryColors = {
  "Waste Reduction": "bg-yellow-100 text-yellow-700",
  "Energy Conservation": "bg-blue-100 text-blue-700",
  "Water Conservation": "bg-cyan-100 text-cyan-700",
  "Sustainable Transport": "bg-orange-100 text-orange-700",
  "Green Living": "bg-green-100 text-green-700",
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/challenges/${id}`).then((res) => {
      setChallenge(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please login to join a challenge!");
      navigate("/login");
      return;
    }
    setJoining(true);
    try {
      await axios.post(`${API}/api/challenges/join/${id}`, {
        userId: user.email,
      });
      toast.success("Successfully joined the challenge! 🎉");
      setJoined(true);
      setChallenge((prev) => ({ ...prev, participants: prev.participants + 1 }));
    } catch (err) {
      if (err.response?.data?.message === "Already joined") {
        toast.error("You have already joined this challenge!");
        setJoined(true);
      } else {
        toast.error("Failed to join. Please try again!");
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Spinner />;
  if (!challenge) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Challenge not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96">
        <img
          src={challenge.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"}
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-end p-8">
          <div className="text-white max-w-3xl">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block ${
                categoryColors[challenge.category] || "bg-gray-100 text-gray-700"
              }`}
            >
              {challenge.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black">{challenge.title}</h1>
          </div>
        </div>
        <Link
          to="/challenges"
          className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-xl text-sm transition"
        >
          <FaArrowLeft /> Back
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaLeaf className="text-green-500" /> About This Challenge
            </h2>
            <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaBullseye className="text-green-500" /> Challenge Target
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-medium">{challenge.target}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-500" /> Impact Metric
            </h2>
            <p className="text-gray-600">
              📊 Tracking:{" "}
              <span className="font-semibold text-green-600">{challenge.impactMetric}</span>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaUsers className="text-green-500 text-lg flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Participants</p>
                <p className="font-bold text-gray-800">{challenge.participants}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaClock className="text-green-500 text-lg flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="font-bold text-gray-800">{challenge.duration} days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaCalendarAlt className="text-green-500 text-lg flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Start Date</p>
                <p className="font-bold text-gray-800">
                  {new Date(challenge.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaCalendarAlt className="text-red-400 text-lg flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">End Date</p>
                <p className="font-bold text-gray-800">
                  {new Date(challenge.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaLeaf className="text-green-500 text-lg flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Created By</p>
                <p className="font-bold text-gray-800 text-xs">{challenge.createdBy}</p>
              </div>
            </div>
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={joining || joined}
            className={`w-full py-4 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-sm ${
              joined
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {joining ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : joined ? (
              "✅ Already Joined"
            ) : (
              <>
                <FaLeaf /> Join This Challenge
              </>
            )}
          </button>

          {user && (
            <Link
              to="/my-activities"
              className="block w-full py-3 border border-green-500 text-green-600 font-semibold rounded-2xl text-center text-sm hover:bg-green-50 transition"
            >
              View My Activities
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;