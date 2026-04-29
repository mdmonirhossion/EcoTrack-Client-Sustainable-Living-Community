import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaLeaf } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
      setDropdownOpen(false);
      setMenuOpen(false);
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Adjusted navLinks including Tips and Events
  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-green-400 font-semibold" : "hover:text-green-400 transition"
        }
        onClick={() => setMenuOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/challenges"
        className={({ isActive }) =>
          isActive ? "text-green-400 font-semibold" : "hover:text-green-400 transition"
        }
        onClick={() => setMenuOpen(false)}
      >
        Challenges
      </NavLink>
      <NavLink
        to="/tips"
        className={({ isActive }) =>
          isActive ? "text-green-400 font-semibold" : "hover:text-green-400 transition"
        }
        onClick={() => setMenuOpen(false)}
      >
        Tips
      </NavLink>
      <NavLink
        to="/events"
        className={({ isActive }) =>
          isActive ? "text-green-400 font-semibold" : "hover:text-green-400 transition"
        }
        onClick={() => setMenuOpen(false)}
      >
        Events
      </NavLink>
      {user && (
        <NavLink
          to="/my-activities"
          className={({ isActive }) =>
            isActive ? "text-green-400 font-semibold" : "hover:text-green-400 transition"
          }
          onClick={() => setMenuOpen(false)}
        >
          My Activities
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 text-white bg-gray-900 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FaLeaf className="text-2xl text-green-400" />
          <span className="text-xl font-bold text-white">
            Eco<span className="text-green-400">Track</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="items-center hidden gap-6 text-sm font-medium lg:gap-8 md:flex">
          {navLinks}
        </div>

        {/* Desktop Auth */}
        <div className="items-center hidden gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt={user.displayName}
                  className="object-cover border-2 border-green-400 rounded-full w-9 h-9"
                />
                <span className="text-sm font-medium">{user.displayName}</span>
              </button>
              
              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-48 py-2 mt-2 text-gray-800 bg-white shadow-xl rounded-xl">
                  <p className="px-4 py-2 text-xs text-gray-500 truncate border-b">
                    {user.email}
                  </p>
                  <Link
                    to="/my-activities"
                    className="block px-4 py-2 text-sm hover:bg-green-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Activities
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-green-400 transition border border-green-400 rounded-lg hover:bg-green-400 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white transition bg-green-500 rounded-lg hover:bg-green-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="text-xl md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 px-6 py-6 text-sm font-medium bg-gray-800 border-t border-gray-700 md:hidden">
          {navLinks}
          {user ? (
            <div className="flex flex-col gap-4 pt-3 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt={user.displayName}
                  className="w-8 h-8 border border-green-400 rounded-full"
                />
                <span className="text-green-400">{user.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="font-semibold text-left text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-3 border-t border-gray-700">
              <Link
                to="/login"
                className="flex-1 py-2 text-center text-green-400 border border-green-400 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 py-2 text-center text-white bg-green-500 rounded-lg"
              onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;