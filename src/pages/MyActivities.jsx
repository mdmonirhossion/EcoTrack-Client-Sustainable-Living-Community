import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaLeaf, FaFire, FaCheckCircle, FaClock,
  FaTrophy, FaChartLine, FaCalendarAlt
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

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
    const fetchActivities = async () => {
      if (!user) return;
      try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        
        const res = await axios.get(`${API}/api/my-activities?userId=${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const activitiesData = Array.isArray(res.data) ? res.data : [];
        setActivities(activitiesData);
        const challengeDetails = {};
        await Promise.all(
          activitiesData.map(async (act) => {
            try {
              const r = await axios.get(`${API}/api/challenges/${act.challengeId}`);
              challengeDetails[act.challengeId] = r.data;
            } catch (error) {
              console.error(`Failed to fetch challenge ${act.challengeId}:`, error);
            }
          })
        );
        setChallenges(challengeDetails);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  const handleProgressChange = (activityId, value) => {
    setActivities((prev) =>
      prev.map((a) =>
        a._id === activityId ? { ...a, progress: parseInt(value) } : a
      )
    );
  };

  const handleStatusChange = (activityId, value) => {
    setActivities((prev) =>
      prev.map((a) =>
        a._id === activityId ? { ...a, status: value } : a
      )
    );
  };

  const updateProgress = async (activityId) => {
    const activity = activities.find((a) => a._id === activityId);
    setUpdating(activityId);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      
      await axios.patch(`${API}/api/my-activities/${activityId}`, {
        progress: activity.progress,
        status: activity.status,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities((prev) =>
        prev.map((a) =>
          a._id === activityId
            ? { ...a, updatedAt: new Date().toISOString() }
            : a
        )
      );
      toast.success("Progress updated successfully! 🌿");
    } catch {
      toast.error("Failed to update progress!");
    } finally {
      setUpdating(null);
    }
  };

  const completedCount = activities.filter((a) => a.status === "Finished").length;
  const ongoingCount = activities.filter((a) => a.status === "Ongoing").length;
  const totalProgress =
    activities.length > 0
      ? Math.round(
          activities.reduce((sum, a) => sum + (a.progress || 0), 0) /
            activities.length
        )
      : 0;

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 text-white bg-emerald-900 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt={user?.displayName || "User avatar"}
              className="object-cover w-16 h-16 border-4 border-green-400 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-black">My Activities</h1>
              <p className="text-sm text-emerald-300">{user?.email}</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: <FaLeaf />, value: activities.length, label: "Total Joined" },
              { icon: <FaFire />, value: ongoingCount, label: "Ongoing" },
              { icon: <FaTrophy />, value: completedCount, label: "Completed" },
              { icon: <FaChartLine />, value: `${totalProgress}%`, label: "Avg Progress" },
            ].map((s, i) => (
              <div key={i} className="p-4 text-center bg-white/10 rounded-xl">
                <div className="flex justify-center mb-1 text-lg text-green-300">
                  {s.icon}
                </div>
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs text-emerald-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl px-6 py-10 mx-auto">
        {activities.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl" aria-hidden="true">🌱</div>
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
              Browse Challenges
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const challenge = challenges[activity.challengeId];
              const progressColor =
                activity.progress >= 100
                  ? "from-green-400 to-emerald-500"
                  : activity.progress >= 50
                  ? "from-blue-400 to-cyan-500"
                  : "from-yellow-400 to-orange-400";

              return (
                <article
                  key={activity._id}
                  className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl"
                  aria-label={`Challenge: ${challenge?.title}`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Challenge Image */}
                    {challenge?.imageUrl && (
                      <img
                        src={challenge.imageUrl}
                        alt={challenge?.title || "Challenge image"}
                        className="flex-shrink-0 object-cover w-full md:w-52 h-44 md:h-auto"
                      />
                    )}

                    <div className="flex-grow p-6">
                      {/* Title + Status */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {challenge?.title || "Challenge"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {challenge?.category}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ${statusColors[activity.status]}`}
                        >
                          {statusIcons[activity.status]}
                          {activity.status}
                        </span>
                      </div>

                      {/* Join Date + Last Updated */}
                      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-green-400" />
                          Joined: {new Date(activity.joinDate).toLocaleDateString()}
                        </span>
                        {activity.updatedAt && (
                          <span className="flex items-center gap-1">
                            <FaClock className="text-blue-400" />
                            Last updated:{" "}
                            {new Date(activity.updatedAt).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span className="flex items-center gap-1">
                            <FaChartLine className="text-green-500" />
                            Progress
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {activity.progress}%
                          </span>
                        </div>
                        {/* Visual Progress Bar */}
                        <div className="w-full h-4 overflow-hidden bg-gray-100 rounded-full">
                          <div
                            className={`bg-gradient-to-r ${progressColor} h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                            style={{ width: `${activity.progress}%` }}
                            role="progressbar"
                            aria-valuenow={activity.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Progress: ${activity.progress}%`}
                          >
                            {activity.progress >= 20 && (
                              <span className="text-xs font-bold text-white">
                                {activity.progress}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Range Slider */}
                        <div className="flex-grow min-w-40">
                          <label
                            htmlFor={`progress-${activity._id}`}
                            className="sr-only"
                          >
                            Update progress for {challenge?.title}
                          </label>
                          <input
                            id={`progress-${activity._id}`}
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={activity.progress}
                            onChange={(e) =>
                              handleProgressChange(activity._id, e.target.value)
                            }
                            className="w-full h-2 cursor-pointer accent-green-500"
                            aria-label="Progress slider"
                          />
                          <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Status Select */}
                        <select
                          value={activity.status}
                          onChange={(e) =>
                            handleStatusChange(activity._id, e.target.value)
                          }
                          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                          aria-label="Update status"
                        >
                          <option>Not Started</option>
                          <option>Ongoing</option>
                          <option>Finished</option>
                        </select>

                        {/* Save Button */}
                        <button
                          onClick={() => updateProgress(activity._id)}
                          disabled={updating === activity._id}
                          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-green-400"
                          aria-label="Save progress"
                        >
                          {updating === activity._id ? (
                            <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>

                      {/* Challenge Link */}
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        <Link
                          to={`/challenges/${activity.challengeId}`}
                          className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700"
                        >
                          <FaLeaf /> View Challenge Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyActivities;