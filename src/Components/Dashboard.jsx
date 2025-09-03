import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Globe,
  Calendar,
  Activity,
  MoreVertical,
  Filter,
  Eye,
  Download,
  Trash2,
  User,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Database,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function SEODashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState(null);
  const [selectedValue, setSelectValue] = useState("Normal");

  const [viewother, setViewOther] = useState(false);

  useEffect(() => {
    if (!viewother) {
      (async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URI}`, {
            withCredentials: true,
          });

          if (response.data.ok) {
            const sortedByCreated = response.data.projects.sort(
              (a, b) =>
                new Date(b.Project.Created).getTime() -
                new Date(a.Project.Created).getTime()
            );

            setProjects(sortedByCreated);
          }
        } catch (error) {
          // projets
          setProjects([]);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [viewother]);

  useEffect(() => {
    if (user.user.Email == "admin@codified.com") {
      (async () => {
        const ri = await axios.get(`${import.meta.env.VITE_API_URI}/userall`, {
          withCredentials: true,
        });
        setAllUsers(ri.data);
      })();
    }
  }, [user]);

  useEffect(() => {
    localStorage.removeItem("userid");
  }, []);

  const handleSelectUser = async (id) => {
    try {
      setSelectValue(id);
      setViewOther(true);
      if (id == "Normal") {
        setViewOther(false);
        localStorage.removeItem("userid");
        return;
      }
      setLoading(true);
      localStorage.setItem("userid", id);
      const user = allUsers.user.find((d) => d.Id == id);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/user/project?email=${user.Email}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.ok) {
        setProjects(
          response.data.projects != null ? response.data.projects : []
        );
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProjects = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/project/delete?pid=${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        const copied = [...projects];
        const final = copied.filter(({ Project }) => Project.Id !== id);
        setProjects(final);
      } else {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-purple-200 font-semibold">Fetching Projects</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}

      {/* Main Content */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SEO Projects</h1>
          <p className="text-gray-300">
            Manage and monitor your website crawling projects
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Button */}
          {allUsers != null && (
            <div className="relative w-64">
              <select
                value={selectedValue}
                onChange={(e) => handleSelectUser(e.target.value)}
                className="w-full appearance-none rounded-xl bg-white/10 backdrop-blur-xl 
                   border border-white/20 py-3 pl-4 pr-10 text-white
                   focus:outline-none focus:bg-black/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   transition-all cursor-pointer"
              >
                <option value="Normal">Select a project...</option>
                {allUsers.user.map((d) => (
                  <option key={d.Id} value={d.Id}>
                    {d.Name ? d.Name : d.Email}
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow */}
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Add New Project Button */}
          <Link
            to={"/addproject"}
            className=" space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
          >
            <button className="flex items-center">
              <Plus className="w-5 h-5" />
              <span>Add New Project</span>
            </button>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-6">
          {projects.map(({ Project, Crawl }, index) => (
            <div
              key={Project.Id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      Project {index + 1}
                    </h3>
                    <p className="text-gray-300 flex items-center text-wrap">
                      {Project.URL.substr(0, 40)}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`px-3 py-1 rounded-full flex items-center space-x-2 ${
                      Project.Deleting
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {Project.Deleting ? (
                      <Trash2 className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {Project.Deleting ? "Deleting" : "Active"}
                    </span>
                  </div>

                  {Crawl.Crawling && (
                    <Link
                      to={`/crawl?pid=${Project.Id}&Crawling=${Crawl.Crawling}&crawlid=${Crawl.Id}`}
                      className={`inline-flex items-center px-5 py-1  rounded-xl  text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                        Crawl.Id == 0 ? "bg-green-600" : "bg-orange-400"
                      }`}
                    >
                      {Crawl.Id == 0 ? "Crawl First" : "Crawling"}
                    </Link>
                  )}

                  {!Crawl.Crawling && (
                    <Link
                      to={`/crawl?pid=${Project.Id}&Crawling=${Crawl.Crawling}&crawlid=${Crawl.Id}`}
                      className={`inline-flex items-center px-5 py-1  rounded-xl text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 bg-blue-600`}
                    >
                      Crawl Now
                    </Link>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              {Crawl.Id !== 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <Link
                    to={`/projectdashboard/${Project.Id}`}
                    className="bg-black/20 rounded-xl p-4 flex items-center space-x-3 hover:bg-white/10 transition-all"
                  >
                    <Activity className="w-6 h-6 text-white" />
                    <div className="text-2xl font-bold text-white">
                      Dashboard
                    </div>
                  </Link>

                  <Link
                    to={`/crawl/${Project.Id}`}
                    className="bg-black/20 rounded-xl p-4 flex items-center space-x-3 hover:bg-white/10 transition-all"
                  >
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <div className="text-2xl font-bold text-yellow-400">
                      Site Issues
                    </div>
                  </Link>

                  <Link
                    to={`/export/${Project.Id}`}
                    className="bg-black/20 rounded-xl p-4 flex items-center space-x-3 hover:bg-white/10 transition-all"
                  >
                    <Download className="w-6 h-6 text-blue-400" />
                    <div className="text-2xl font-bold text-blue-400">
                      Export
                    </div>
                  </Link>

                  <Link
                    to={`/pagedetails/${Project.Id}`}
                    className="bg-black/20 rounded-xl p-4 flex items-center space-x-3 hover:bg-white/10 transition-all"
                  >
                    <Database className="w-6 h-6 text-green-400" />
                    <div className="text-2xl font-bold text-green-400">
                      Page Details
                    </div>
                  </Link>
                </div>
              )}

              {/* Features & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {Project.IgnoreRobotsTxt && (
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-md text-xs">
                      Ignore Robots.txt
                    </span>
                  )}
                  {Project.FollowNofollow && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md text-xs">
                      Follow Nofollow
                    </span>
                  )}
                  {Project.CrawlSitemap && (
                    <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-md text-xs">
                      Crawl Sitemap
                    </span>
                  )}
                  {Project.AllowSubdomains && (
                    <span className="px-2 py-1 bg-pink-600/20 text-pink-300 rounded-md text-xs">
                      Allow Subdomains
                    </span>
                  )}
                  {Project.CheckExternalLinks && (
                    <span className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded-md text-xs">
                      Check External Links
                    </span>
                  )}
                  {Project.Archive && (
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded-md text-xs">
                      Archived
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(Project.Created).toLocaleDateString()}
                  </span>

                  <div className="flex items-center space-x-1 ml-4">
                    <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProjects(Project.Id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-400 mb-8">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first project"}
            </p>
            <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
              <Plus className="w-5 h-5" />
              <span>Add Your First Project</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
