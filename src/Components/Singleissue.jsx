import { useEffect, useState } from "react";
import {
  ExternalLink,
  Info,
  AlertCircle,
  Link as LinkIcon,
  FileText,
  Hash,
  CheckCircle,
  XCircle,
  Database,
  Clock,
  Type,
  List,
  Loader2,
} from "lucide-react";
import { issueDescriptions } from "../assets/Helper";
import { useSearchParams } from "react-router";
import axios from "axios";

export default function IssueDetails() {
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const rid = searchParams.get("rid");
  const eid = searchParams.get("eid");
  const t = searchParams.get("t");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [selectedOption, setSelectedOption] = useState(t || "details");

  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URI
          }/resources?pid=${pid}&rid=${rid}&eid=${eid}&t=${selectedOption}`,
          { withCredentials: true }
        );

        if (res.data.ok) {
          setData(res.data.data);
        }
      } catch (err) {
        setData({});
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues();
  }, [selectedOption]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-200">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-300" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-900 text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  const report = data?.page_report_view?.PageReport || {};
  const inlinks = data?.page_report_view?.InLinks || [];
  const errors = data?.page_report_view?.ErrorTypes || [];

  // Map icons to fields
  const fieldIcons = {
    Id: <Hash className="w-4 h-4 text-purple-300" />,
    URL: <LinkIcon className="w-4 h-4 text-blue-300" />,
    StatusCode: <CheckCircle className="w-4 h-4 text-green-300" />,
    ContentType: <FileText className="w-4 h-4 text-pink-300" />,
    MediaType: <FileText className="w-4 h-4 text-pink-300" />,
    Size: <Database className="w-4 h-4 text-yellow-300" />,
    Depth: <List className="w-4 h-4 text-orange-300" />,
    TTFB: <Clock className="w-4 h-4 text-cyan-300" />,
    Title: <Type className="w-4 h-4 text-purple-300" />,
    Description: <Type className="w-4 h-4 text-purple-300" />,
    Canonical: <LinkIcon className="w-4 h-4 text-blue-300" />,
    H1: <Type className="w-4 h-4 text-purple-300" />,
    H2: <Type className="w-4 h-4 text-purple-300" />,
    Noindex: <XCircle className="w-4 h-4 text-red-400" />,
    Nofollow: <XCircle className="w-4 h-4 text-red-400" />,
    InSitemap: <CheckCircle className="w-4 h-4 text-green-400" />,
    Crawled: <CheckCircle className="w-4 h-4 text-green-400" />,
    BlockedByRobotstxt: <XCircle className="w-4 h-4 text-red-400" />,
    Timeout: <Clock className="w-4 h-4 text-orange-400" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-gray-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Report */}
        <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-300 flex items-center">
              <Info className="mr-2 w-5 h-5" /> Page Report
            </h2>

            {/* Select Dropdown */}
            <select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setLoading(true);
              }}
              className="bg-slate-800 text-gray-200 text-sm px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {[
                { value: "details", name: "Details" },
                { value: "inlinks", name: "Inlinks" },
                { value: "internal-links", name: "Internal links" },
                { value: "external-links", name: "External links" },
                { value: "redirections", name: "Redirections" },
                { value: "audios", name: "Audios" },
                { value: "videos", name: "Videos" },
                { value: "images", name: "Images" },
                { value: "iframes", name: "Iframes" },
                { value: "scripts", name: "Scripts" },
                { value: "styles", name: "Styles" },
              ].map((d) => (
                <option key={d.value} value={d.value}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {Object.entries(report).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition break-word"
              >
                {fieldIcons[key] || <Info className="w-4 h-4 text-gray-400" />}
                <div className="break-words w-full">
                  <span className="font-medium text-white text-wrap">
                    {key}:
                  </span>{" "}
                  {key === "URL" ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words text-blue-300 hover:underline inline-flex items-center gap-1"
                    >
                      {value}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : typeof value === "boolean" ? (
                    value ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    value?.toString() || "—"
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inlinks */}
        {inlinks.length > 0 && (
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-xl rounded-2xl border border-blue-500/30 shadow-xl p-6">
            <h2 className="text-lg font-semibold text-blue-300 flex items-center mb-4">
              <LinkIcon className="mr-2 w-5 h-5" /> Inlinks ({inlinks.length})
            </h2>
            <div className="space-y-3">
              {inlinks.map((inlink, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-blue-900/20 border border-blue-600/30 shadow-sm"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-blue-300 mt-0.5" />
                    <div className="flex-1 break-words">
                      <p className="font-medium text-white text-sm">
                        From: {inlink.PageReport.Title || "Untitled Page"}
                      </p>
                      <a
                        href={inlink.PageReport.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-300 hover:underline break-words inline-flex items-center gap-1"
                      >
                        {inlink.PageReport.URL}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  {inlink.Link.Text && (
                    <div className="pl-6">
                      <p className="text-xs text-gray-300">
                        <span className="font-medium">Link Text:</span>{" "}
                        {inlink.Link.Text.replace(/&amp;/g, "&")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors */}
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/30 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-red-300 flex items-center mb-4">
            <AlertCircle className="mr-2 w-5 h-5" /> Errors
          </h2>
          {errors.length === 0 ? (
            <p className="text-sm">No errors found.</p>
          ) : (
            <ul className="space-y-3">
              {errors.map((err, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-red-900/40 border border-red-600/40 shadow-md"
                >
                  <p className="font-semibold text-white flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-300" /> {err}
                  </p>
                  <p className="text-sm text-gray-300 mt-1 break-words">
                    {issueDescriptions[err] || "No description available."}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
