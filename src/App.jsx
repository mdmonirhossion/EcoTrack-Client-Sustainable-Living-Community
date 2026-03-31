import { Component, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./providers/AuthProvider";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Keep fallback simple for assignment requirement.
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container">
          <section className="card">
            <h2>Something went wrong</h2>
            <p>We hit an unexpected issue. Please refresh the page.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="card">Loading account...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/");
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target)) return;
      setDropdownOpen(false);
      setMobileOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    // Close menus after navigation, including protected-route redirects.
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="header" ref={wrapperRef}>
      <Link to="/" className="brand">
        <span className="logoMark" aria-hidden="true" />
        <span className="logoText">EcoTrack</span>
      </Link>

      <button
        type="button"
        className="hamburger"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="hamburgerLines" aria-hidden="true" />
      </button>

      <nav className={`nav ${mobileOpen ? "mobileOpen" : ""}`}>
        <NavLink to="/" onClick={() => setMobileOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/challenges" onClick={() => setMobileOpen(false)}>
          Challenges
        </NavLink>
        <NavLink to="/my-activities" onClick={() => setMobileOpen(false)}>
          My Activities
        </NavLink>
      </nav>

      <div className={`auth ${mobileOpen ? "mobileOpen" : ""}`}>
        {!user ? (
          <>
            <Link to="/login" className="btn secondary" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="btn" onClick={() => setMobileOpen(false)}>
              Register
            </Link>
          </>
        ) : (
          <div className="userMenu">
            <button
              type="button"
              className="userButton"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {user.photoURL ? (
                <img src={user.photoURL} className="avatar" alt="" />
              ) : (
                <span className="avatarPlaceholder" aria-hidden="true">
                  {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="userName">{user.displayName || "Profile"}</span>
            </button>

            {dropdownOpen ? (
              <div className="dropdown" role="menu" aria-label="User menu">
                <Link
                  to="/profile"
                  role="menuitem"
                  className="dropdownItem"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  Profile
                </Link>
                <Link
                  to="/my-activities"
                  role="menuitem"
                  className="dropdownItem"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  My Activities
                </Link>
                <button type="button" role="menuitem" className="dropdownItem logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 EcoTrack</p>
      <p>
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
      </p>
      <p className="socials">
        <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
          X
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
          f
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
          in
        </a>
      </p>
      <p>Accessibility: keyboard-friendly controls. Privacy: we only use required profile info.</p>
    </footer>
  );
}

function PublicLayout() {
  return (
    <>
      <Header />
      <main className="container"><Outlet /></main>
      <Footer />
    </>
  );
}

function DashboardLayout() {
  return (
    <>
      <Header />
      <main className="container"><Outlet /></main>
    </>
  );
}

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalChallenges: 0, totalParticipants: 0, co2Saved: 0, plasticReduced: 0 });
  const [challenges, setChallenges] = useState([]);
  const [tips, setTips] = useState([]);
  const [events, setEvents] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featured = useMemo(() => challenges.slice(0, 3), [challenges]);

  useEffect(() => {
    Promise.all([
      api.get("/api/stats/live"),
      api.get("/api/challenges"),
      api.get("/api/tips/recent"),
      api.get("/api/events/upcoming"),
    ])
      .then(([statsRes, challengesRes, tipsRes, eventsRes]) => {
        const allChallenges = challengesRes.data || [];
        const totalParticipants = Number(statsRes.data?.totalParticipants || 0);
        const co2Saved = totalParticipants * 2;
        const plasticReduced = totalParticipants * 1.5;
        setStats(statsRes.data);
        setStats({
          totalChallenges: Number(statsRes.data?.totalChallenges || 0),
          totalParticipants,
          co2Saved,
          plasticReduced,
        });
        setChallenges(allChallenges.slice(0, 6));
        setTips(tipsRes.data);
        setEvents(eventsRes.data);
      })
      .catch(() => toast.error("Failed to load home data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (featured.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featured.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (loading) {
    return (
      <div className="stack">
        <section className="card spinnerWrap">
          <div className="spinner" aria-label="Loading" />
          <p>Loading community data...</p>
        </section>
        <section className="grid">
          <article className="card skeletonCard" />
          <article className="card skeletonCard" />
          <article className="card skeletonCard" />
        </section>
      </div>
    );
  }

  const currentFeatured = featured[carouselIndex];

  return (
    <div className="stack">
      <section className="card heroCard">
        <div>
          <h1>EcoTrack - Sustainable Living Community</h1>
          <p>Discover eco challenges, track impact, and grow sustainable habits together.</p>
          {currentFeatured ? (
            <Link className="btn" to={`/challenges/${currentFeatured._id}`}>
              View Challenge
            </Link>
          ) : (
            <Link className="btn" to="/challenges">
              Explore Challenges
            </Link>
          )}
        </div>
        {currentFeatured ? (
          <img src={currentFeatured.imageUrl} alt={currentFeatured.title} className="heroImage" />
        ) : null}
      </section>

      <section className="statsGrid">
        <article className="card statCard">
          <h3>Total Challenges</h3>
          <p>{stats.totalChallenges}</p>
        </article>
        <article className="card statCard">
          <h3>Total Participants</h3>
          <p>{stats.totalParticipants}</p>
        </article>
        <article className="card statCard">
          <h3>Estimated CO2 Saved</h3>
          <p>{stats.co2Saved} kg</p>
        </article>
        <article className="card statCard">
          <h3>Plastic Reduced</h3>
          <p>{stats.plasticReduced} kg</p>
        </article>
      </section>

      <section className="card">
        <h2>Active Challenges</h2>
        <div className="grid">{challenges.map((item) => <ChallengeCard key={item._id} item={item} />)}</div>
      </section>

      <section className="card">
        <h2>Recent Tips</h2>
        {tips.length ? (
          tips.map((tip) => (
            <article className="infoRow" key={tip._id || tip.title}>
              <h3>{tip.title}</h3>
              <p>
                {tip.authorName} | {tip.upvotes || 0} upvotes |{" "}
                {tip.createdAt ? new Date(tip.createdAt).toLocaleDateString() : "recent"}
              </p>
            </article>
          ))
        ) : (
          <div className="grid">
            <article className="card skeletonCard" />
            <article className="card skeletonCard" />
          </div>
        )}
      </section>

      <section className="card">
        <h2>Upcoming Events</h2>
        {events.length ? (
          events.map((event) => (
            <article className="infoRow" key={event._id || event.title}>
              <h3>{event.title}</h3>
              <p>
                {event.location} | {event.date ? new Date(event.date).toLocaleDateString() : "upcoming"}
              </p>
              <p>{event.description}</p>
            </article>
          ))
        ) : (
          <div className="grid">
            <article className="card skeletonCard" />
            <article className="card skeletonCard" />
          </div>
        )}
      </section>

      <section className="card">
        <h2>Why Go Green?</h2>
        <ul className="list">
          <li>Reduce pollution and preserve natural resources for future generations.</li>
          <li>Lower household costs by using energy and water more efficiently.</li>
          <li>Build healthier neighborhoods with cleaner air and greener spaces.</li>
        </ul>
      </section>

      <section className="card">
        <h2>How It Works</h2>
        <div className="steps">
          <article className="stepCard">
            <h3>1. Join a challenge</h3>
            <p>Pick a challenge that matches your sustainability goal.</p>
          </article>
          <article className="stepCard">
            <h3>2. Track progress</h3>
            <p>Update your challenge progress from My Activities dashboard.</p>
          </article>
          <article className="stepCard">
            <h3>3. Share tips</h3>
            <p>Help the community with practical eco-friendly tips.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

function ChallengeCard({ item }) {
  return (
    <article className="card challenge">
      <img src={item.imageUrl} alt={item.title} />
      <h3>{item.title}</h3>
      <p>{item.category}</p>
      <p>{String(item.description || "").slice(0, 100)}...</p>
      <p>{item.impactMetric || "impact"}</p>
      <p>{item.duration} days | {item.participants} participants</p>
      <Link className="btn" to={`/challenges/${item._id}`}>View Challenge</Link>
    </article>
  );
}

function ChallengesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/api/challenges").then((res) => setItems(res.data)).catch(() => toast.error("Failed to fetch challenges."));
  }, []);
  return <section className="grid">{items.map((item) => <ChallengeCard key={item._id} item={item} />)}</section>;
}

function ChallengeDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => {
    api.get(`/api/challenges/${id}`).then((res) => setItem(res.data)).catch(() => toast.error("Challenge not found."));
  }, [id]);
  if (!item) return <p className="card">Loading challenge...</p>;
  return <section className="card"><h2>{item.title}</h2><p>{item.description}</p><Link className="btn" to={`/challenges/join/${item._id}`}>Join Challenge</Link></section>;
}

function AddChallengePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: "", category: "", description: "", duration: 30, target: "", impactMetric: "", startDate: "", endDate: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/challenges", { ...form, createdBy: user?.email });
      toast.success("Challenge added.");
      setForm({ title: "", category: "", description: "", duration: 30, target: "", impactMetric: "", startDate: "", endDate: "", imageUrl: "" });
    } catch {
      toast.error("Failed to add challenge.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form className="card form" onSubmit={onSubmit}>
      <h2>Add Challenge</h2>
      {Object.keys(form).map((key) => (
        <input key={key} name={key} type={key.includes("Date") ? "date" : "text"} value={form[key]} onChange={onChange} placeholder={key} required={["title", "category", "description", "target", "impactMetric", "startDate", "endDate", "imageUrl"].includes(key)} />
      ))}
      <button className="btn" disabled={saving}>{saving ? "Saving..." : "Create Challenge"}</button>
    </form>
  );
}

function JoinChallengePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const join = async () => {
    try {
      await api.post(`/api/challenges/join/${id}`, { userId: user?.email });
      toast.success("Joined challenge.");
      navigate("/my-activities");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to join challenge.");
    }
  };
  return <section className="card"><h2>Join Challenge</h2><button className="btn" onClick={join}>Confirm Join</button></section>;
}

function MyActivitiesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!user?.email) return;
    api.get(`/api/my-activities?userId=${user.email}`).then((res) => setItems(res.data)).catch(() => toast.error("Failed to load activities."));
  }, [user]);
  return (
    <section className="stack">
      <h2>My Activities</h2>
      {items.map((item) => <Link key={item._id} className="card" to={`/my-activities/${item._id}`}>{item.challenge?.title} - {item.progress}% ({item.status})</Link>)}
    </section>
  );
}

function ActivityDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const activity = useMemo(() => activities.find((x) => x._id === id), [activities, id]);

  useEffect(() => {
    if (!user?.email) return;
    api.get(`/api/my-activities?userId=${user.email}`).then((res) => setActivities(res.data));
  }, [user]);

  const updateProgress = async (progress) => {
    await api.patch(`/api/my-activities/${id}`, { progress, status: progress >= 100 ? "Finished" : "Ongoing" });
    toast.success("Progress updated.");
  };

  if (!activity) return <p className="card">Loading activity...</p>;
  return <section className="card"><h2>{activity.challenge.title}</h2><p>Progress: {activity.progress}%</p><button className="btn" onClick={() => updateProgress(Math.min(100, (activity.progress || 0) + 10))}>+10% Progress</button></section>;
}

function ProfilePage() {
  const { user } = useAuth();
  return <section className="card"><h2>Profile</h2><p>{user?.displayName || "N/A"}</p><p>{user?.email}</p></section>;
}

function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Login successful.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Login to EcoTrack</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      <button type="button" className="btn secondary" onClick={loginGoogle}>Google Login</button>
      <Link to="/register">Register</Link>
      <Link to="/forgot-password">Forgot Password</Link>
    </form>
  );
}

function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    if (!/[A-Z]/.test(password)) return "Must include uppercase letter.";
    if (!/[a-z]/.test(password)) return "Must include lowercase letter.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Must include special character.";
    if (password.length < 6) return "Must be at least 6 characters.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(form.password);
    setError(passwordError);
    if (passwordError) return;

    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful.");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Join EcoTrack</h2>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
      <input value={form.photoURL} onChange={(e) => setForm({ ...form, photoURL: e.target.value })} placeholder="Photo URL" required />
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
      {error ? <p className="error">{error}</p> : null}
      <button className="btn" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      <button type="button" className="btn secondary" onClick={loginWithGoogle}>Google Register</button>
      <Link to="/login">Login</Link>
    </form>
  );
}

function ForgotPasswordPage() {
  return <section className="card"><h2>Forgot Password</h2><p>Password reset flow intentionally not implemented per assignment update.</p></section>;
}

function AboutPage() {
  return (
    <section className="card">
      <h2>About EcoTrack</h2>
      <p>EcoTrack connects people who want measurable sustainability impact through community challenges.</p>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="card">
      <h2>Contact</h2>
      <p>Email: hello@ecotrack.community</p>
    </section>
  );
}

function NotFoundPage() {
  return <section className="card"><h2>404</h2><p>Page not found.</p><Link to="/" className="btn">Back Home</Link></section>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/challenges/add" element={<AddChallengePage />} />
          <Route path="/challenges/join/:id" element={<JoinChallengePage />} />
          <Route path="/my-activities" element={<MyActivitiesPage />} />
          <Route path="/my-activities/:id" element={<ActivityDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
