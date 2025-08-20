import React, { useState } from "react";
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

export default function SEODashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock data for crawled websites
  const [projects] = useState([
    {
      id: 1,
      url: "https://example.com",
      name: "Example Website",
      status: "completed",
      lastCrawled: "2024-08-20",
      pagesFound: 1250,
      errors: 3,
      warnings: 12,
      crawlTime: "2h 15m",
      features: {
        ignoreRobotsTxt: true,
        followNofollow: false,
        crawlSitemap: true,
        allowSubdomains: true,
      },
    },
    {
      id: 2,
      url: "https://techblog.com",
      name: "Tech Blog",
      status: "running",
      lastCrawled: "2024-08-20",
      pagesFound: 847,
      errors: 0,
      warnings: 5,
      crawlTime: "1h 42m",
      features: {
        ignoreRobotsTxt: false,
        followNofollow: true,
        crawlSitemap: true,
        allowSubdomains: false,
      },
    },
    {
      id: 3,
      url: "https://ecommerce-store.com",
      name: "E-commerce Store",
      status: "failed",
      lastCrawled: "2024-08-19",
      pagesFound: 0,
      errors: 15,
      warnings: 0,
      crawlTime: "0h 5m",
      features: {
        ignoreRobotsTxt: true,
        followNofollow: true,
        crawlSitemap: false,
        allowSubdomains: true,
      },
    },
    {
      id: 4,
      url: "https://portfolio.dev",
      name: "Developer Portfolio",
      status: "completed",
      lastCrawled: "2024-08-18",
      pagesFound: 45,
      errors: 1,
      warnings: 2,
      crawlTime: "0h 8m",
      features: {
        ignoreRobotsTxt: false,
        followNofollow: false,
        crawlSitemap: true,
        allowSubdomains: false,
      },
    },
    {
      id: 5,
      url: "https://news-site.org",
      name: "News Portal",
      status: "completed",
      lastCrawled: "2024-08-17",
      pagesFound: 3420,
      errors: 8,
      warnings: 24,
      crawlTime: "4h 32m",
      features: {
        ignoreRobotsTxt: true,
        followNofollow: true,
        crawlSitemap: true,
        allowSubdomains: true,
      },
    },
  ]);

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

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
            <Plus className="w-5 h-5" />
            <span>Add New Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-300 flex items-center">
                      {project.url}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`px-3 py-1 rounded-full flex items-center space-x-2 ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    <span className="text-sm font-medium capitalize">
                      {project.status}
                    </span>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-white">
                    {project.pagesFound.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Pages Found</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-red-400">
                    {project.errors}
                  </div>
                  <div className="text-sm text-gray-400">Errors</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {project.warnings}
                  </div>
                  <div className="text-sm text-gray-400">Warnings</div>
                </div>
                <div className="bg-black/20 rounded-xl p-3">
                  <div className="text-2xl font-bold text-blue-400">
                    {project.crawlTime}
                  </div>
                  <div className="text-sm text-gray-400">Crawl Time</div>
                </div>
              </div>

              {/* Features & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.features.ignoreRobotsTxt && (
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-md text-xs">
                      Ignore Robots.txt
                    </span>
                  )}
                  {project.features.followNofollow && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md text-xs">
                      Follow Nofollow
                    </span>
                  )}
                  {project.features.crawlSitemap && (
                    <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-md text-xs">
                      Crawl Sitemap
                    </span>
                  )}
                  {project.features.allowSubdomains && (
                    <span className="px-2 py-1 bg-pink-600/20 text-pink-300 rounded-md text-xs">
                      Allow Subdomains
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.lastCrawled).toLocaleDateString()}
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
        {filteredProjects.length === 0 && (
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
