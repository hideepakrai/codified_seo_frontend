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
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router";

export default function SEODashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}`, {
          withCredentials: true,
        });

        if (response.data.ok) {
          setProjects(response.data.projects);
        }
      } catch (error) {
        // projets
        setProjects([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  console.log(projects);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/20";
      case "running":
        return "text-blue-400 bg-blue-400/20";
      case "failed":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "running":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // const filteredProjects = projects.filter(
  //   (project) =>
  //     project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     project.url.toLowerCase().includes(searchQuery.toLowerCase())
  // );

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
          <button className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>

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
        <div className="grid gap-6">
          {projects.map(({ Project, Crawl }) => (
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
                      Project #{Project.Id}
                    </h3>
                    <p className="text-gray-300 flex items-center">
                      {Project.URL}
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
                      to={`/crawl?pid=${Project.Id}&Crawling=${Crawl.Crawling}`}
                      className="inline-flex items-center px-5 py-1  rounded-xl bg-green-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Crawling
                    </Link>
                  )}

                  {!Crawl.Crawling && (
                    <Link
                      to={`/crawl?pid=${Project.Id}&Crawling=${Crawl.Crawling}`}
                      className="inline-flex items-center px-5 py-1  rounded-xl bg-blue-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Crawl Now
                    </Link>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-white">
                    {Project.Host || "-"}
                  </div>
                  <div className="text-sm text-gray-400">Host</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Project.UserAgent.length > 15
                      ? Project.UserAgent.slice(0, 15) + "..."
                      : Project.UserAgent}
                  </div>
                  <div className="text-sm text-gray-400">User Agent</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-blue-400">
                    {new Date(Project.Created).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">Created</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-green-400">
                    {Project.BasicAuth ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-gray-400">Basic Auth</div>
                </div>
              </div>

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
                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
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
