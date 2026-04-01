import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const API = import.meta.env.VITE_API_URL;

const JoinChallenge = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      try {
        await axios.post(`${API}/api/challenges/join/${id}`, {
          userId: user.email,
        });
        toast.success("Successfully joined! 🎉");
        navigate("/my-activities");
      } catch (err) {
        if (err.response?.data?.message === "Already joined") {
          toast.error("Already joined this challenge!");
        } else {
          toast.error("Failed to join!");
        }
        navigate(`/challenges/${id}`);
      }
    };
    if (user) join();
  }, [id, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Joining challenge...</p>
      </div>
    </div>
  );
};

export default JoinChallenge;