import { useEffect, useState } from "react";
import {
  Globe,
  AlertCircle,
  XCircle,
  CheckCircle,
  ExternalLink,
  ArrowBigLeft,
  DownloadIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { issueDescriptions, issues } from "../assets/Helper";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIssues } from "../redux/slices/issuePageSlice";

export default function CrawlSummary() {
  // const [Project, setProject] = useState({});
  // const [Crawl, setCrawl] = useState({});
  // const [Issues, setIssues] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  const { Project, Crawl, Issues, error, loading } = useSelector(
    (state) => state.issues
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleExportURL = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/export/resources?pid=${id}&t=issues`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = res.headers["content-disposition"];
      let fileName = "export.csv";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  console.log(error, Project, loading, Crawl, Issues);

  useEffect(() => {
    dispatch(fetchAllIssues(id));
  }, [id]);

  const totalIssues =
    (Crawl.CriticalIssues || 0) +
    (Crawl.AlertIssues || 0) +
    (Crawl.WarningIssues || 0);

  const percent = (val) =>
    totalIssues ? Math.round((val / totalIssues) * 100) : 0;

  const safeRender = (val, fallback = null) => {
    if (
      val === null ||
      val === undefined ||
      val === "" ||
      val === "—" ||
      val === 0
    )
      return fallback;
    return val;
  };

  const [expandBreakdown, setExpandBreakdown] = useState(true);
  const [expandGroups, setExpandGroups] = useState({});

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
        <div className="mb-8 flex gap-2 items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-black hover:bg-white hover:text-black w-10 h-10 text-white p-2 rounded-full transition-all duration-300"
          >
            <ArrowBigLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Crawl Summary
            </h1>
            {safeRender(Project.Host) && (
              <p className="text-gray-300">
                Overview of issues and statistics for{" "}
                <span className="font-semibold">{Project.Host}</span>
              </p>
            )}
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                {safeRender(Project.Host) && (
                  <h2 className="text-xl font-semibold text-white">
                    {Project.Host}
                  </h2>
                )}
                {safeRender(Project.URL) && (
                  <p className="text-gray-400 flex items-center text-sm">
                    {Project.URL}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              {/* {safeRender(Project.UserAgent) && (
                <p>
                  <span className="font-semibold text-white">User Agent:</span>{" "}
                  Mozilla/5.0 (compatible; CodifedBot/1.0)
                </p>
              )} */}
              {safeRender(Project.Created) && (
                <p>
                  <span className="font-semibold text-white">Created:</span>{" "}
                  {new Date(Project.Created).toLocaleString()}
                </p>
              )}
              <p>
                <span className="font-semibold text-white">
                  Allow Subdomains:
                </span>{" "}
                {Project.AllowSubdomains ? "Yes" : "No"}
              </p>
            </div>

            <button
              onClick={handleExportURL}
              className="flex gap-3 py-2 px-3 mt-2 bg-black text-white cursor-pointer hover:text-black hover:bg-white font-bold rounded-lg items-center transition-colors duration-300"
            >
              Export Data <DownloadIcon size={20} />
            </button>
          </div>

          {/* Crawl Stats */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            <h2 className="text-xl font-semibold text-white mb-4">
              Crawl Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {safeRender(Crawl.TotalURLs) && (
                <div className="bg-black/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {Crawl.TotalURLs}
                  </p>
                  <p className="text-sm text-gray-400">URLs Crawled</p>
                </div>
              )}
              {safeRender(Crawl.TotalIssues) && (
                <div className="bg-black/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {Crawl.TotalIssues}
                  </p>
                  <p className="text-sm text-gray-400">Total Issues</p>
                </div>
              )}
              {safeRender(Crawl.InternalFollowLinks) && (
                <div className="bg-black/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {Crawl.InternalFollowLinks}
                  </p>
                  <p className="text-sm text-gray-400">Internal Links</p>
                </div>
              )}
              {safeRender(Crawl.ExternalFollowLinks) && (
                <div className="bg-black/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">
                    {Crawl.ExternalFollowLinks}
                  </p>
                  <p className="text-sm text-gray-400">External Links</p>
                </div>
              )}
            </div>
          </div>

          {/* Issues Breakdown Expandable */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            <button
              onClick={() => setExpandBreakdown(!expandBreakdown)}
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-xl font-semibold text-white mb-0">
                Issues Breakdown
              </h2>
              {expandBreakdown ? (
                <ChevronDown className="text-white" />
              ) : (
                <ChevronRight className="text-white" />
              )}
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                expandBreakdown ? "max-h-[500px] mt-4" : "max-h-0"
              }`}
            >
              <div className="space-y-4">
                {safeRender(Crawl.CriticalIssues) && (
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="flex items-center text-red-400">
                        <XCircle className="w-4 h-4 mr-1" /> Critical
                      </span>
                      <span>{Crawl.CriticalIssues}</span>
                    </div>
                    <div className="w-full bg-red-900/30 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent(Crawl.CriticalIssues)}%` }}
                      />
                    </div>
                  </div>
                )}
                {safeRender(Crawl.AlertIssues) && (
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="flex items-center text-orange-400">
                        <AlertCircle className="w-4 h-4 mr-1" /> Alerts
                      </span>
                      <span>{Crawl.AlertIssues}</span>
                    </div>
                    <div className="w-full bg-orange-900/30 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent(Crawl.AlertIssues)}%` }}
                      />
                    </div>
                  </div>
                )}
                {safeRender(Crawl.WarningIssues) && (
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="flex items-center text-yellow-400">
                        <CheckCircle className="w-4 h-4 mr-1" /> Warnings
                      </span>
                      <span>{Crawl.WarningIssues}</span>
                    </div>
                    <div className="w-full bg-yellow-900/30 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percent(Crawl.WarningIssues)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Issues List Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Issues</h2>
          {Issues &&
            Object.keys(Issues).map(
              (group) =>
                Issues[group]?.length > 0 && (
                  <div key={group} className="mb-6">
                    {/* Toggle Group */}
                    <button
                      onClick={() =>
                        setExpandGroups((prev) => ({
                          ...prev,
                          [group]: !prev[group],
                        }))
                      }
                      className="w-full flex justify-between items-center px-3 py-2 bg-black/30 rounded-lg border border-white/10 hover:bg-black/40 transition-all"
                    >
                      <span className="text-purple-300 font-semibold flex items-center gap-2">
                        {expandGroups[group] ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                        {issues[group]}
                      </span>
                      <span className="text-sm text-gray-400 bg-purple-500/20 px-2 py-1 rounded-md">
                        {Issues[group].length}
                      </span>
                    </button>

                    {/* Expandable Items */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        expandGroups[group] ? "max-h-[1000px] mt-2" : "max-h-0"
                      }`}
                    >
                      <ul className="space-y-2">
                        {Issues[group].map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-start bg-black/20 p-3 rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
                          >
                            <div className="flex flex-col">
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
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
}
