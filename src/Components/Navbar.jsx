import { User, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user: isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const linkClasses =
    "relative text-gray-300 hover:text-white transition-all duration-300 group";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/80 via-black/80 to-pink-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-md shadow-purple-800/40">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="h-10" />
            <span className="text-xl md:block hidden font-extrabold text-white tracking-wide">
              Codified SEO
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:space-x-8">
            {!isLoggedIn ? (
              <>
                <Link to="/signin" className={linkClasses}>
                  Login
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-pink-500/50 transition-transform transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`${linkClasses} flex items-center space-x-2 ${
                    location.pathname === "/dashboard" ? "text-white" : ""
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  to="/profile"
                  className={`${linkClasses} flex items-center space-x-2 ${
                    location.pathname === "/profile" ? "text-white" : ""
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile</span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
