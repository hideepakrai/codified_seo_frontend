import { useState } from "react";

import { Search, User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user: isLoggedIn } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="relative z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to={"/"}>
            <div className="flex items-center space-x-2">
              <Search className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                Codified SEO
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {/* <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a> */}
            {/* <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a> */}

            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={"/signin"}
                  className="text-gray-300 hover:text-white transition-colors "
                >
                  <button className="cursor-pointer">Login</button>
                </Link>

                <Link
                  to={"/signup"}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 "
                >
                  <button className="cursor-pointer">Sign Up</button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <User className="w-5 h-5 text-white" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl">
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="border-white/20 my-2" />
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
