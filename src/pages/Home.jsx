import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  FaLeaf, FaRecycle, FaBolt, FaWater, FaBus,
  FaArrowRight, FaUsers, FaFire, FaSeedling
} from "react-icons/fa";
import SkeletonCard from "../components/SkeletonCard";
import ChallengeCard from "../components/ChallengeCard";
import TipCard from "../components/TipCard";
import EventCard from "../components/EventCard";

const Home = () => {
  const [challenges, setChallenges] = useState([]);
  const [tips, setTips] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalChallenges: 0, totalParticipants: 0 });
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const normalizeChallenges = useCallback((payload) => {
    const walk = (value) => {
      if (Array.isArray(value)) return value;

      // Sometimes APIs return a stringified JSON array/object.
      if (typeof value === "string") {
        try {
          return walk(JSON.parse(value));
        } catch {
          return [];
        }
      }

      if (value && typeof value === "object") {
        const candidate = value.challenges ?? value.data;
        if (Array.isArray(candidate)) return candidate;
      }

      return [];
    };

    return walk(payload);
  }, []);

  const normalizeArray = useCallback((payload) => {
    const walk = (value) => {
      if (Array.isArray(value)) return value;

      // Sometimes APIs return a stringified JSON array/object.
      if (typeof value === "string") {
        try {
          return walk(JSON.parse(value));
        } catch {
          return [];
        }
      }

      if (value && typeof value === "object") {
        // Try common shapes returned from APIs.
        const candidate = value.tips ?? value.events ?? value.data ?? value.challenges;
        if (Array.isArray(candidate)) return candidate;
      }

      return [];
    };

    return walk(payload);
  }, []);

  useEffect(() => {
    // Fetch challenges
    api.get('/api/challenges').then((res) => {
      const data = normalizeChallenges(res.data);

      const topSix = data.slice(0, 6);
      setChallenges(topSix);

      const totalParticipants = data.reduce(
        (a, c) => a + (c?.participants || 0),
        0
      );
      setStats({ totalChallenges: data.length, totalParticipants });
      setLoadingChallenges(false);
    }).catch(() => setLoadingChallenges(false));

    // Fetch tips
    api.get('/api/tips').then((res) => {
      setTips(normalizeArray(res.data));
      setLoadingTips(false);
    }).catch(() => setLoadingTips(false));

    // Fetch events
    api.get('/api/events').then((res) => {
      setEvents(normalizeArray(res.data));
      setLoadingEvents(false);
    }).catch(() => setLoadingEvents(false));
  }, [normalizeChallenges, normalizeArray]);

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
          className="absolute inset-0 transition-all duration-700 bg-center bg-cover"
          style={{
            backgroundImage: heroChallenge?.imageUrl
              ? `url(${heroChallenge.imageUrl})`
              : "linear-gradient(135deg, #064e3b, #065f46)",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-20 mx-auto text-white max-w-7xl">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-green-300 uppercase border border-green-400 rounded-full bg-green-500/20">
            🌿 Featured Challenge
          </span>
          <h1 className="max-w-2xl mb-4 text-4xl font-black leading-tight md:text-6xl">
            {heroChallenge?.title || "Join the Green Revolution"}
          </h1>
          <p className="max-w-xl mb-2 text-lg text-gray-300">
            {heroChallenge?.description ||
              "Discover sustainability challenges, share tips, and track your environmental impact."}
          </p>
          {heroChallenge && (
            <p className="mb-6 text-sm font-medium text-green-400">
              📊 {heroChallenge.participants} participants • {heroChallenge.category}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {heroChallenge ? (
              <Link
                to={`/challenges/${heroChallenge._id}`}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-500 hover:bg-green-400 rounded-xl"
              >
                View Challenge <FaArrowRight />
              </Link>
            ) : (
              <Link
                to="/challenges"
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition bg-green-500 hover:bg-green-400 rounded-xl"
              >
                 <FaArrowRight />
              </Link>
            )}
            <Link
              to="/register"
              className="px-6 py-3 font-semibold text-white transition border border-white/40 hover:bg-white/10 rounded-xl"
            >
              Join Community
            </Link>
          </div>
        </div>

        {/* Carousel dots */}
        {challenges.length > 1 && (
          <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-6 left-1/2">
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
      <section className="py-10 text-white bg-green-600">
        <div className="grid grid-cols-2 gap-6 px-6 mx-auto text-center max-w-7xl md:grid-cols-4">
          {[
            { icon: <FaLeaf />, value: stats.totalChallenges + "+", label: "Active Challenges" },
            { icon: <FaUsers />, value: stats.totalParticipants + "+", label: "Participants" },
            { icon: <FaRecycle />, value: "2,400 kg", label: "Plastic Reduced" },
            { icon: <FaBolt />, value: "18,000 kWh", label: "Energy Saved" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="text-3xl text-green-200">{s.icon}</div>
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-sm text-green-100">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVE CHALLENGES ── */}
      <section className="px-6 py-16 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-semibold tracking-wider text-green-600 uppercase">
              Take Action
            </span>
            <h2 className="mt-1 text-3xl font-black text-gray-800">
              Active Challenges
            </h2>
          </div>
          <Link
            to="/challenges"
            className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingChallenges
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : challenges.map((c) => <ChallengeCard key={c._id} challenge={c} />)}
        </div>
      </section>

      {/* ── WHY GO GREEN ── */}
      <section className="py-16 text-white bg-emerald-900">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold tracking-wider text-green-400 uppercase">
              Our Mission
            </span>
            <h2 className="mt-1 text-3xl font-black">Why Go Green?</h2>
            <p className="max-w-xl mx-auto mt-2 text-sm text-emerald-300">
              Small everyday actions create massive collective change. Here&apos;s why it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="p-6 transition bg-emerald-800/60 rounded-2xl hover:bg-emerald-700/60"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-emerald-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-16 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold tracking-wider text-green-600 uppercase">
            Simple Steps
          </span>
          <h2 className="mt-1 text-3xl font-black text-gray-800">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
              className="p-8 text-center transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
            >
              <div className="mb-2 text-5xl font-black text-gray-100">{item.step}</div>
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECENT TIPS ── */}
      <section className="py-16 bg-gray-100">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-sm font-semibold tracking-wider text-green-600 uppercase">
                Community Wisdom
              </span>
              <h2 className="mt-1 text-3xl font-black text-gray-800">Recent Tips</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadingTips
              ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : (Array.isArray(tips) ? tips.slice(0, 5).map((tip, i) => <TipCard key={i} tip={tip} />) : [])}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="px-6 py-16 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-semibold tracking-wider text-green-600 uppercase">
              Get Involved
            </span>
            <h2 className="mt-1 text-3xl font-black text-gray-800">Upcoming Events</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loadingEvents
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : events.map((event, i) => <EventCard key={i} event={event} />)}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 text-center text-white bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-2xl px-6 mx-auto">
          <FaLeaf className="mx-auto mb-4 text-5xl text-green-200" />
          <h2 className="mb-3 text-3xl font-black">
            Ready to Make a Difference?
          </h2>
          <p className="mb-8 text-sm text-green-100">
            Join thousands of eco-warriors making measurable impact every single day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 font-bold text-green-700 transition bg-white rounded-xl hover:bg-green-50"
            >
              Join for Free
            </Link>
            <Link
              to="/challenges"
              className="px-8 py-3 font-bold text-white transition border border-white/50 rounded-xl hover:bg-white/10"
            >
              Sustainable Challenges
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;