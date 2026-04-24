import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUsers, FaClock, FaCalendarAlt, FaLeaf,
  FaArrowLeft, FaBullseye, FaChartLine,
  FaEdit, FaTrash,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";

const API = import.meta.env.VITE_API_URL;

const categories = [
  "Waste Reduction",
  "Energy Conservation",
  "Water Conservation",
  "Sustainable Transport",
  "Green Living",
];

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
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    axios
      .get(`${API}/api/challenges/${id}`)
      .then((res) => {
        setChallenge(res.data);
        setEditData({
          ...res.data,
          startDate: res.data.startDate?.split("T")[0] || res.data.startDate,
          endDate: res.data.endDate?.split("T")[0] || res.data.endDate,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load challenge!");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      
      await axios.delete(`${API}/api/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Challenge deleted successfully!");
      setShowDeleteModal(false);
      navigate("/challenges");
    } catch {
      toast.error("Failed to delete challenge!");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      
      await axios.patch(`${API}/api/challenges/${id}`, {
        ...editData,
        duration: Number(editData.duration),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChallenge((prev) => ({ ...prev, ...editData }));
      toast.success("Challenge updated successfully! 🌿");
      setShowEditModal(false);
    } catch {
      toast.error("Failed to update challenge!");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!challenge) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Challenge not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img
          src={challenge.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"}
          alt={challenge.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/55"></div>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute z-10 flex items-center gap-2 px-4 py-2 text-sm text-white transition top-6 left-6 bg-black/30 hover:bg-black/50 rounded-xl"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Edit + Delete — login থাকলে সবাই */}
        {user && (
          <div className="absolute z-10 flex gap-2 top-6 right-6">
            <button
              onClick={() => {
                setEditData({
                  ...challenge,
                  startDate: challenge.startDate?.split("T")[0] || challenge.startDate,
                  endDate: challenge.endDate?.split("T")[0] || challenge.endDate,
                });
                setShowEditModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition bg-blue-500 hover:bg-blue-600 rounded-xl"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition bg-red-500 hover:bg-red-600 rounded-xl"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}

        {/* Title */}
        <div className="absolute inset-0 flex items-end p-8">
          <div className="max-w-3xl text-white">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block ${categoryColors[challenge.category] || "bg-gray-100 text-gray-700"}`}>
              {challenge.category}
            </span>
            <h1 className="text-3xl font-black md:text-4xl">{challenge.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 mx-auto lg:grid-cols-3">

        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-3 text-xl font-bold text-gray-800">
              <FaLeaf className="text-green-500" /> About This Challenge
            </h2>
            <p className="leading-relaxed text-gray-600">{challenge.description}</p>
          </div>

          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
              <FaBullseye className="text-green-500" /> Challenge Target
            </h2>
            <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
              <p className="font-medium text-green-800">{challenge.target}</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
              <FaChartLine className="text-green-500" /> Impact Metric
            </h2>
            <p className="text-gray-600">
              Tracking:{" "}
              <span className="font-semibold text-green-600">
                {challenge.impactMetric}
              </span>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="p-6 space-y-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
            {[
              { icon: <FaUsers className="text-green-500" />, label: "Participants", value: challenge.participants },
              { icon: <FaClock className="text-green-500" />, label: "Duration", value: `${challenge.duration} days` },
              { icon: <FaCalendarAlt className="text-green-500" />, label: "Start Date", value: new Date(challenge.startDate).toLocaleDateString() },
              { icon: <FaCalendarAlt className="text-red-400" />, label: "End Date", value: new Date(challenge.endDate).toLocaleDateString() },
              { icon: <FaLeaf className="text-green-500" />, label: "Created By", value: challenge.createdBy },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0 text-lg">{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-xs font-bold text-gray-800 break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ JOIN BUTTON — /challenges/join/:id এ নিয়ে যাবে */}
          <Link
            to={`/challenges/join/${id}`}
            className="flex items-center justify-center w-full gap-2 py-4 text-sm font-bold text-white transition bg-green-500 hover:bg-green-600 rounded-2xl"
          >
            <FaLeaf /> Join This Challenge
          </Link>

          {user && (
            <Link
              to="/my-activities"
              className="block w-full py-3 text-sm font-semibold text-center text-green-600 transition border border-green-500 rounded-2xl hover:bg-green-50"
            >
              View My Activities
            </Link>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
          <div className="w-full max-w-sm p-8 bg-white shadow-2xl rounded-2xl">
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <FaTrash className="text-2xl text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-black text-gray-800">Delete Challenge?</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 text-sm font-semibold text-gray-600 transition border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center flex-1 py-3 text-sm font-semibold text-white transition bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-60"
              >
                {deleting ? (
                  <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                ) : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto bg-black/60">
          <div className="w-full max-w-xl p-8 my-auto bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-800">Edit Challenge</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  required
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Category *</label>
                <select
                  required
                  value={editData.category || ""}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editData.description || ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Target *</label>
                <input
                  type="text"
                  required
                  value={editData.target || ""}
                  onChange={(e) => setEditData({ ...editData, target: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Impact Metric *</label>
                <input
                  type="text"
                  required
                  value={editData.impactMetric || ""}
                  onChange={(e) => setEditData({ ...editData, impactMetric: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Duration (days) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editData.duration || ""}
                  onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={editData.startDate || ""}
                    onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">End Date *</label>
                  <input
                    type="date"
                    required
                    value={editData.endDate || ""}
                    onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={editData.imageUrl || ""}
                  onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 text-sm font-semibold text-gray-600 transition border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-semibold text-white transition bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-60"
                >
                  {editLoading ? (
                    <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail;