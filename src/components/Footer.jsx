import { Link } from "react-router-dom";
import { FaLeaf, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaLeaf className="text-green-400 text-xl" />
            <span className="text-white font-bold text-lg">
              Eco<span className="text-green-400">Track</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A community platform for eco-conscious people to discover challenges,
            share tips, and track their environmental impact together.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-green-400 transition">Home</Link>
            </li>
            <li>
              <Link to="/challenges" className="hover:text-green-400 transition">Challenges</Link>
            </li>
            <li>
              <a href="#about" className="hover:text-green-400 transition">About</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-400 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3 mb-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="X Twitter"
              className="w-9 h-9 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition"
            >
              <FaXTwitter />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 bg-gray-700 hover:bg-green-500 rounded-full flex items-center justify-center transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
          <p className="text-xs text-gray-500">
            Join us in making the planet greener, one challenge at a time.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 pt-4 text-center text-xs text-gray-500 space-y-1">
        <p>2025 EcoTrack. All rights reserved.</p>
        <p>
          This site is committed to{" "}
          <span className="text-green-400">accessibility</span> and{" "}
          <span className="text-green-400">user privacy</span>. We do not sell your data.
        </p>
      </div>
    </footer>
  );
};

export default Footer;