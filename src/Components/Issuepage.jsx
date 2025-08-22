import { useEffect, useState } from "react";
import {
  Globe,
  AlertCircle,
  XCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Link, useParams } from "react-router";
import axios from "axios";
import { issueDescriptions, issues } from "../assets/Helper";

export default function CrawlSummary() {
  const [Project, setProject] = useState({});
  const [Crawl, setCrawl] = useState({});
  const [Issues, setIssues] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchAllIssues = async (id) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/issues?pid=${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.ok) {
          setProject(response.data.data.ProjectView.Project);
          setCrawl(response.data.data.ProjectView.Crawl);
          setIssues(response.data.data.IssueCount); // contains grouped issues
        }
      } catch (error) {
        setProject([]);
        setCrawl({});
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues(id);
  }, [id]);

  const totalIssues =
    Crawl.CriticalIssues + Crawl.AlertIssues + Crawl.WarningIssues;

  const percent = (val) =>
    totalIssues ? Math.round((val / totalIssues) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-purple-200 font-semibold">
          Fetching crawl data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Crawl Summary</h1>
          <p className="text-gray-300">
            Overview of issues and statistics for{" "}
            <span className="font-semibold">{Project.Host}</span>
          </p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {Project.Host}
                </h2>
                <p className="text-gray-400 flex items-center text-sm">
                  {Project.URL}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-semibold text-white">User Agent:</span>{" "}
                {Project.UserAgent}
              </p>
              <p>
                <span className="font-semibold text-white">Created:</span>{" "}
                {new Date(Project.Created).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-white">
                  Allow Subdomains:
                </span>{" "}
                {Project.AllowSubdomains ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Crawl Stats */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Crawl Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {Crawl.TotalURLs}
                </p>
                <p className="text-sm text-gray-400">URLs Crawled</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {Crawl.TotalIssues}
                </p>
                <p className="text-sm text-gray-400">Total Issues</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {Crawl.InternalFollowLinks}
                </p>
                <p className="text-sm text-gray-400">Internal Links</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {Crawl.ExternalFollowLinks}
                </p>
                <p className="text-sm text-gray-400">External Links</p>
              </div>
            </div>
          </div>

          {/* Issues Breakdown */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Issues Breakdown
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="flex items-center text-red-400">
                    <XCircle className="w-4 h-4 mr-1" /> Critical
                  </span>
                  <span>{Crawl.CriticalIssues}</span>
                </div>
                <div className="w-full bg-red-900/30 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${percent(Crawl.CriticalIssues)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="flex items-center text-orange-400">
                    <AlertCircle className="w-4 h-4 mr-1" /> Alerts
                  </span>
                  <span>{Crawl.AlertIssues}</span>
                </div>
                <div className="w-full bg-orange-900/30 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${percent(Crawl.AlertIssues)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="flex items-center text-yellow-400">
                    <CheckCircle className="w-4 h-4 mr-1" /> Warnings
                  </span>
                  <span>{Crawl.WarningIssues}</span>
                </div>
                <div className="w-full bg-yellow-900/30 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percent(Crawl.WarningIssues)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Issues</h2>

          {Object.keys(Issues).map((group) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-semibold text-purple-300 border-b border-white/20 pb-2 mb-3">
                {issues[group]} ({Issues[group].length})
              </h3>
              {/* <ul className="space-y-2">
                {Issues[group].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/10 hover:bg-black/30"
                  >
                    <span className="text-gray-200 text-sm">
                      {item.ErrorType}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {item.Count} pages
                    </span>
                  </li>
                ))}
              </ul> */}
              <ul className="space-y-2">
                {Issues[group].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-start bg-black/20 p-3 rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
                  >
                    <div className="flex flex-col">
                      {/* <span className="text-gray-200 text-sm font-medium">
                        {item.ErrorType}
                      </span> */}
                      {issueDescriptions[item.ErrorType] && (
                        <span className="text-gray-200 text-sm font-medium">
                          {issueDescriptions[item.ErrorType]}
                        </span>
                      )}
                    </div>
                    <Link
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white transition-colors"
                      to={`/issues/view?pid=${Project.Id}&eid=${item.ErrorType}`}
                    >
                      <p>{item.Count} pages</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
