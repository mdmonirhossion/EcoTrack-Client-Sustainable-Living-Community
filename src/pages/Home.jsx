import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaLeaf, FaRecycle, FaBolt, FaWater, FaBus,
  FaArrowRight, FaUsers, FaFire, FaSeedling
} from "react-icons/fa";
import SkeletonCard from "../components/SkeletonCard";
import ChallengeCard from "../components/ChallengeCard";
import TipCard from "../components/TipCard";
import EventCard from "../components/EventCard";

const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [challenges, setChallenges] = useState([]);
  const [tips, setTips] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalChallenges: 0, totalParticipants: 0 });
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    // Fetch challenges
    axios.get(`${API}/api/challenges`).then((res) => {
      setChallenges(res.data.slice(0, 6));
      const totalParticipants = res.data.reduce((a, c) => a + (c.participants || 0), 0);
      setStats({ totalChallenges: res.data.length, totalParticipants });
      setLoadingChallenges(false);
    });

    // Fetch tips
    axios.get(`${API}/api/tips`).then((res) => {
      setTips(res.data);
      setLoadingTips(false);
    });

    // Fetch events
    axios.get(`${API}/api/events`).then((res) => {
      setEvents(res.data);
      setLoadingEvents(false);
    });
  }, []);

  // Hero carousel auto-slide
  useEffect(() => {
    if (challenges.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(challenges.length, 3));
    }, 4000);
    return () => clearInterval(timer);
  }, [challenges]);

  const heroChallenge = challenges[heroIndex];

  return (
    <div className="bg-gray-50">

      {/* ── HERO BANNER ── */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: heroChallenge?.imageUrl
              ? `url(${heroChallenge.imageUrl})`
              : "linear-gradient(135deg, #064e3b, #065f46)",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-white">
          <span className="inline-block bg-green-500/20 border border-green-400 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            🌿 Featured Challenge
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight max-w-2xl">
            {heroChallenge?.title || "Join the Green Revolution"}
          </h1>
          <p className="text-gray-300 text-lg mb-2 max-w-xl">
            {heroChallenge?.description ||
              "Discover sustainability challenges, share tips, and track your environmental impact."}
          </p>
          {heroChallenge && (
            <p className="text-green-400 text-sm mb-6 font-medium">
              📊 {heroChallenge.participants} participants • {heroChallenge.category}
            </p>
          )}
          <div className="flex gap-4 flex-wrap">
            {heroChallenge ? (
              <Link
                to={`/challenges/${heroChallenge._id}`}
                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition flex items-center gap-2"
              >
                View Challenge <FaArrowRight />
              </Link>
            ) : (
              <Link
                to="/challenges"
                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition flex items-center gap-2"
              >
                Browse Challenges <FaArrowRight />
              </Link>
            )}
            <Link
              to="/register"
              className="px-6 py-3 border border-white/40 hover:bg-white/10 text-white font-semibold rounded-xl transition"
            >
              Join Community
            </Link>
          </div>
        </div>

        {/* Carousel dots */}
        {challenges.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {challenges.slice(0, 3).map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === heroIndex ? "bg-green-400 w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── LIVE STATS ── */}
      <section className="bg-green-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <FaLeaf />, value: stats.totalChallenges + "+", label: "Active Challenges" },
            { icon: <FaUsers />, value: stats.totalParticipants + "+", label: "Participants" },
            { icon: <FaRecycle />, value: "2,400 kg", label: "Plastic Reduced" },
            { icon: <FaBolt />, value: "18,000 kWh", label: "Energy Saved" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="text-3xl text-green-200">{s.icon}</div>
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-green-100 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVE CHALLENGES ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">
              Take Action
            </span>
            <h2 className="text-3xl font-black text-gray-800 mt-1">
              Active Challenges
            </h2>
          </div>
          <Link
            to="/challenges"
            className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingChallenges
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : challenges.map((c) => <ChallengeCard key={c._id} challenge={c} />)}
        </div>
      </section>

      {/* ── WHY GO GREEN ── */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-3xl font-black mt-1">Why Go Green?</h2>
            <p className="text-emerald-300 mt-2 max-w-xl mx-auto text-sm">
              Small everyday actions create massive collective change. Here&apos;s why it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLeaf className="text-3xl text-green-400" />,
                title: "Reduce Carbon Footprint",
                desc: "Every action reduces CO₂ — from cycling to composting.",
              },
              {
                icon: <FaWater className="text-3xl text-blue-400" />,
                title: "Save Water Resources",
                desc: "Conserving water protects ecosystems and future generations.",
              },
              {
                icon: <FaRecycle className="text-3xl text-yellow-400" />,
                title: "Cut Down Waste",
                desc: "Reducing plastic and food waste keeps our oceans and land clean.",
              },
              {
                icon: <FaBus className="text-3xl text-orange-400" />,
                title: "Sustainable Transport",
                desc: "Choosing green transport slashes urban air pollution significantly.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-emerald-800/60 rounded-2xl p-6 hover:bg-emerald-700/60 transition"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-emerald-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">
            Simple Steps
          </span>
          <h2 className="text-3xl font-black text-gray-800 mt-1">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: <FaSeedling className="text-4xl text-green-500" />,
              title: "Join a Challenge",
              desc: "Browse our community challenges and pick one that fits your lifestyle and goals.",
            },
            {
              step: "02",
              icon: <FaFire className="text-4xl text-orange-500" />,
              title: "Track Progress",
              desc: "Log your daily actions, update your progress, and stay motivated.",
            },
            {
              step: "03",
              icon: <FaUsers className="text-4xl text-blue-500" />,
              title: "Share Tips",
              desc: "Share practical eco-tips with the community and inspire others to go green.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="text-5xl font-black text-gray-100 mb-2">{item.step}</div>
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECENT TIPS ── */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">
                Community Wisdom
              </span>
              <h2 className="text-3xl font-black text-gray-800 mt-1">Recent Tips</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingTips
              ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : tips.slice(0, 5).map((tip, i) => <TipCard key={i} tip={tip} />)}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">
              Get Involved
            </span>
            <h2 className="text-3xl font-black text-gray-800 mt-1">Upcoming Events</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingEvents
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : events.map((event, i) => <EventCard key={i} event={event} />)}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <FaLeaf className="text-5xl mx-auto mb-4 text-green-200" />
          <h2 className="text-3xl font-black mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-green-100 mb-8 text-sm">
            Join thousands of eco-warriors making measurable impact every single day.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition"
            >
              Join for Free
            </Link>
            <Link
              to="/challenges"
              className="px-8 py-3 border border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition"
            >
              Browse Challenges
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;