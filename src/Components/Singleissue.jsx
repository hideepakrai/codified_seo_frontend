import { useEffect, useState } from "react";
import {
  ExternalLink,
  Info,
  AlertCircle,
  Link,
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

// Mock Data
const mockData = {
  page_report_view: {
    PageReport: {
      Id: 11915,
      URL: "https://fonts.gstatic.com/s/baijamjuree/v12/LDIoapSCOBt_aeQQ7ftydoa8W_o6kJox.ttf",
      StatusCode: 200,
      ContentType: "font/ttf",
      MediaType: "font/ttf",
      Size: 84024,
      Depth: 4,
      Timeout: false,
      TTFB: 92,
      Title: "",
      Description: "",
      Canonical: "",
      H1: "",
      H2: "",
      Noindex: false,
      Nofollow: false,
      InSitemap: false,
      Crawled: true,
      BlockedByRobotstxt: false,
    },
    ErrorTypes: ["ERROR_MISSING_HSTS", "ERROR_UNDERSCORE_URL"],
  },
};

export default function IssueDetails() {
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const rid = searchParams.get("rid");
  const eid = searchParams.get("eid");
  const t = searchParams.get("t");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockData);
  const [selectedOption, setSelectedOption] = useState(t);

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
          console.log(res.data.data);
          setData(res.data.data);
        }
      } catch (error) {
        setData({});
        setError(error.message);
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

  // Map icons to fields
  const fieldIcons = {
    Id: <Hash className="w-4 h-4 text-purple-300" />,
    URL: <Link className="w-4 h-4 text-blue-300" />,
    StatusCode: <CheckCircle className="w-4 h-4 text-green-300" />,
    ContentType: <FileText className="w-4 h-4 text-pink-300" />,
    MediaType: <FileText className="w-4 h-4 text-pink-300" />,
    Size: <Database className="w-4 h-4 text-yellow-300" />,
    Depth: <List className="w-4 h-4 text-orange-300" />,
    TTFB: <Clock className="w-4 h-4 text-cyan-300" />,
    Title: <Type className="w-4 h-4 text-purple-300" />,
    Description: <Type className="w-4 h-4 text-purple-300" />,
    Canonical: <Link className="w-4 h-4 text-blue-300" />,
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

        {/* Errors */}
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/30 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-red-300 flex items-center mb-4">
            <AlertCircle className="mr-2 w-5 h-5" /> Errors
          </h2>
          {data.page_report_view.ErrorTypes.length === 0 ? (
            <p className="text-sm">No errors found.</p>
          ) : (
            <ul className="space-y-3">
              {data.page_report_view.ErrorTypes.map((err, i) => (
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
