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
    await logout();
    toast.success("Logged out successfully!");
    navigate("/");
    setDropdownOpen(false);
  };

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
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FaLeaf className="text-green-400 text-2xl" />
          <span className="text-xl font-bold text-white">
            Eco<span className="text-green-400">Track</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full border-2 border-green-400 object-cover"
                />
                <span className="text-sm font-medium">{user.displayName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl py-2 z-50">
                  <p className="px-4 py-2 text-xs text-gray-500 border-b">
                    {user.email}
                  </p>
                  <Link
                    to="/my-activities"
                    className="block px-4 py-2 hover:bg-green-50 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Activities
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium border border-green-400 text-green-400 rounded-lg hover:bg-green-400 hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          {navLinks}
          {user ? (
            <>
              <div className="flex items-center gap-2 border-t border-gray-700 pt-3">
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-green-400"
                />
                <span>{user.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 border-t border-gray-700 pt-3">
              <Link
                to="/login"
                className="flex-1 text-center py-2 border border-green-400 text-green-400 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2 bg-green-500 text-white rounded-lg"
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