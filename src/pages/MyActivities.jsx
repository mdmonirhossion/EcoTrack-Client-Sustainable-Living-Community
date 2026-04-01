import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaLeaf, FaFire, FaCheckCircle,
  FaClock, FaTrophy, FaChartLine
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import SkeletonCard from "../components/SkeletonCard";

const API = import.meta.env.VITE_API_URL;

const statusColors = {
  "Not Started": "bg-gray-100 text-gray-600",
  "Ongoing": "bg-blue-100 text-blue-600",
  "Finished": "bg-green-100 text-green-600",
};

const statusIcons = {
  "Not Started": <FaClock className="text-gray-400" />,
  "Ongoing": <FaFire className="text-blue-500" />,
  "Finished": <FaCheckCircle className="text-green-500" />,
};

const MyActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [challenges, setChallenges] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/api/my-activities/${user.email}`)
      .then(async (res) => {
        setActivities(res.data);
        // Fetch challenge details for each activity
        const challengeDetails = {};
        await Promise.all(
          res.data.map(async (act) => {
            try {
              const r = await axios.get(`${API}/api/challenges/${act.challengeId}`);
              challengeDetails[act.challengeId] = r.data;
            } catch (err) {
              // Silently handle challenge fetch errors
            }
          })
        );
        setChallenges(challengeDetails);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const updateProgress = async (activityId, progress, status) => {
    setUpdating(activityId);
    try {
      await axios.patch(`${API}/api/my-activities/${activityId}/progress`, {
        progress: parseInt(progress),
        status,
      });
      setActivities((prev) =>
        prev.map((a) =>
          a._id === activityId ? { ...a, progress: parseInt(progress), status } : a
        )
      );
      toast.success("Progress updated! 🌿");
    } catch {
      toast.error("Failed to update progress!");
    } finally {
      setUpdating(null);
    }
  };

  const completedCount = activities.filter((a) => a.status === "Finished").length;
  const ongoingCount = activities.filter((a) => a.status === "Ongoing").length;

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 text-white bg-emerald-900 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt={user?.displayName}
              className="object-cover w-16 h-16 border-4 border-green-400 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-black">My Activities</h1>
              <p className="text-sm text-emerald-300">{user?.email}</p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: <FaLeaf />, value: activities.length, label: "Joined" },
              { icon: <FaFire />, value: ongoingCount, label: "Ongoing" },
              { icon: <FaTrophy />, value: completedCount, label: "Completed" },
            ].map((s, i) => (
              <div key={i} className="p-4 text-center bg-white/10 rounded-xl">
                <div className="flex justify-center mb-1 text-green-300">{s.icon}</div>
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs text-emerald-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl px-6 py-10 mx-auto">
        {activities.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-6xl">🌱</p>
            <h2 className="mb-2 text-xl font-bold text-gray-700">
              No activities yet!
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Join a challenge to start tracking your eco-impact.
            </p>
            <Link
              to="/challenges"
              className="px-6 py-3 font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl"
            >
              
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const challenge = challenges[activity.challengeId];
              return (
                <div
                  key={activity._id}
                  className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Challenge image */}
                    {challenge?.imageUrl && (
                      <img
                        src={challenge.imageUrl}
                        alt={challenge?.title}
                        className="flex-shrink-0 object-cover w-full h-40 md:w-48 md:h-auto"
                      />
                    )}

                    <div className="flex-grow p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {challenge?.title || "Challenge"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {challenge?.category} • Joined{" "}
                            {new Date(activity.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                            statusColors[activity.status]
                          }`}
                        >
                          {statusIcons[activity.status]}
                          {activity.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between mb-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaChartLine className="text-green-500" /> Progress
                          </span>
                          <span className="font-semibold text-green-600">
                            {activity.progress}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full">
                          <div
                            className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                            style={{ width: `${activity.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Update controls */}
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          defaultValue={activity.progress}
                          onChange={(e) => {
                            setActivities((prev) =>
                              prev.map((a) =>
                                a._id === activity._id
                                  ? { ...a, progress: parseInt(e.target.value) }
                                  : a
                              )
                            );
                          }}
                          className="flex-grow h-2 accent-green-500"
                        />

                        <select
                          defaultValue={activity.status}
                          onChange={(e) => {
                            setActivities((prev) =>
                              prev.map((a) =>
                                a._id === activity._id
                                  ? { ...a, status: e.target.value }
                                  : a
                              )
                            );
                          }}
                          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          <option>Not Started</option>
                          <option>Ongoing</option>
                          <option>Finished</option>
                        </select>

                        <button
                          onClick={() =>
                            updateProgress(activity._id, activity.progress, activity.status)
                          }
                          disabled={updating === activity._id}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-60"
                        >
                          {updating === activity._id ? (
                            <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActivities;