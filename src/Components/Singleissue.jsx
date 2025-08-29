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
  ArrowBigLeft,
  ArrowBigRightDash,
  ChevronDown,
  ChevronUp,
  ArrowBigRight,
  ArrowBigRightDashIcon,
} from "lucide-react";
import { issueDescriptions } from "../assets/Helper";
import { Link, useNavigate, useSearchParams } from "react-router";
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
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const [currentPage, setCurrentPage] = useState(1);

  const handleShow = (val) => {
    if (val == show) {
      setShow(null);
    } else {
      setShow(val);
    }
  };

  useEffect(() => {
    const fetchAllIssues = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userid");
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URI
          }/resources?pid=${pid}&rid=${rid}&eid=${eid}&t=${selectedOption}&p=${currentPage}&uid=${userId}`,
          { withCredentials: true }
        );
        if (res.data.ok) {
          setData(res.data.data);
          setCurrentPage(res.data.data.page_report_view.Paginator.CurrentPage);
        }
      } catch (err) {
        setData({});
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllIssues();
  }, [selectedOption, rid, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-300" />
          <span className="text-lg font-medium">Fetching details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-950 text-white">
        <p className="text-lg font-semibold">⚠️ Error: {error}</p>
      </div>
    );
  }

  console.log(data);

  const report = data?.page_report_view?.PageReport || {};
  const inlinks = data?.page_report_view?.InLinks || [];
  const errors = data?.page_report_view?.ErrorTypes || [];

  const external_links = report.ExternalLinks || [];
  const internal_links = report.InternalLinks || [];
  const images = report.Images || [];

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
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Report */}
        <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-black/70 hover:bg-white hover:text-black text-white p-2 rounded-full transition-all duration-300 shadow-md"
              >
                <ArrowBigLeft size={20} />
              </button>
              <h2 className="text-xl font-bold text-purple-200 flex items-center tracking-wide">
                <Info className="mr-2 w-6 h-6" /> Page Report
              </h2>
            </div>

            <select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setLoading(true);
              }}
              className="bg-slate-800/70 text-gray-200 text-sm px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-400 transition"
            >
              {[
                { value: "details", name: "Details" },
                { value: "inlinks", name: "Inlinks" },
                { value: "internal", name: "Internal links" },
                { value: "external", name: "External links" },
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
            {Object.entries(report)
              .filter(([_, value]) => {
                if (value === null || value === undefined) return false;
                if (
                  typeof value === "string" &&
                  (value.trim() === "" || value.trim() === "—")
                )
                  return false;
                if (typeof value === "number" && value === 0) return false;
                if (Array.isArray(value) && value.length === 0) return false;
                return true;
              })
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  {fieldIcons[key] || (
                    <Info className="w-4 h-4 text-gray-400" />
                  )}
                  <div className="break-words w-full">
                    <span className="font-semibold text-white">{key}:</span>{" "}
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
                      value?.toString()
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Inlinks */}
        {inlinks.length !== 0 && (
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-xl rounded-2xl border border-blue-500/30 shadow-lg p-6">
            <button
              onClick={() => handleShow("inlinks")}
              className="flex justify-between items-center w-full text-left mb-4"
            >
              <h2 className="text-xl font-bold text-blue-200 flex items-center tracking-wide">
                <LinkIcon className="mr-2 w-6 h-6" /> Inlinks ({inlinks.length})
              </h2>
              {show == "inlinks" ? (
                <ChevronUp className="w-5 h-5 text-blue-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-300" />
              )}
            </button>
            {show == "inlinks" && (
              <div className="space-y-4">
                {inlinks.map((inlink, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center justify-between rounded-xl bg-blue-900/20 border border-blue-600/30 hover:border-blue-400/60 transition"
                  >
                    <div>
                      <p className="font-medium text-white text-sm">
                        From: {inlink.PageReport.Title || "Untitled Page"}
                      </p>
                      <a
                        href={inlink.PageReport.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-300 hover:underline inline-flex items-center gap-1"
                      >
                        {inlink.PageReport.URL}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {inlink.Link.Text && (
                        <p className="text-xs text-gray-300 mt-1">
                          <span className="font-medium">Link Text:</span>{" "}
                          {inlink.Link.Text.replace(/&amp;/g, "&")}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/resources?pid=${pid}&rid=${inlink.PageReport.Id}&eid=${eid}&t=details&uid=${userId}`}
                      className="flex items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white w-10 h-10 transition"
                    >
                      <ArrowBigRightDash size={20} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {external_links.length !== 0 && (
          <div className="bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-violet-800/40 backdrop-blur-xl rounded-2xl border border-violet-500/30 shadow-lg p-6">
            <button
              onClick={() => handleShow("external")}
              className="flex justify-between items-center w-full text-left mb-4"
            >
              <h2 className="text-xl font-bold text-blue-200 flex items-center tracking-wide">
                <LinkIcon className="mr-2 w-6 h-6" /> External Links (
                {external_links.length})
              </h2>
              {show == "external" ? (
                <ChevronUp className="w-5 h-5 text-blue-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-300" />
              )}
            </button>

            {show == "external" && (
              <div className="space-y-3">
                {external_links.map((external, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-violet-900/20 border border-violet-600/30 hover:border-violet-400/60 transition text-sm"
                  >
                    {/* Title */}
                    <p className="font-medium text-white">
                      Text: {external.Text || "Untitled Link"}
                    </p>

                    {/* URL */}
                    <p className="text-blue-300 truncate">
                      URL:{" "}
                      <a
                        href={external.URL}
                        target="_blank"
                        rel={external.Rel || "noopener noreferrer"}
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {external.URL}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>

                    {/* Metadata badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {external.Rel && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-700/40 text-blue-200">
                          Rel: {external.Rel}
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          external.NoFollow
                            ? "bg-red-700/40 text-red-300"
                            : "bg-green-700/40 text-green-300"
                        }`}
                      >
                        NoFollow: {external.NoFollow ? "Yes" : "No"}
                      </span>

                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          external.Sponsored
                            ? "bg-yellow-700/40 text-yellow-200"
                            : "bg-gray-700/40 text-gray-300"
                        }`}
                      >
                        Sponsored: {external.Sponsored ? "Yes" : "No"}
                      </span>

                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          external.UGC
                            ? "bg-purple-700/40 text-purple-300"
                            : "bg-gray-700/40 text-gray-300"
                        }`}
                      >
                        UGC: {external.UGC ? "Yes" : "No"}
                      </span>

                      <span className="px-2 py-0.5 text-xs rounded-full bg-teal-700/40 text-teal-300">
                        StatusCode: {external.StatusCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {images.length !== 0 && (
          <div className="bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-violet-800/40 backdrop-blur-xl rounded-2xl border border-violet-500/30 shadow-lg p-6">
            <button
              onClick={() => handleShow("images")}
              className="flex justify-between items-center w-full text-left mb-4"
            >
              <h2 className="text-xl font-bold text-blue-200 flex items-center tracking-wide">
                <LinkIcon className="mr-2 w-6 h-6" /> Images ({images.length})
              </h2>
              {show == "external" ? (
                <ChevronUp className="w-5 h-5 text-blue-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-300" />
              )}
            </button>

            {show == "images" && (
              <div className="space-y-3">
                {images.map((image, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-violet-900/20 border border-violet-600/30 hover:border-violet-400/60 transition text-sm"
                  >
                    {/* Title */}
                    <p className="font-medium text-white">
                      Image Alt: {image.Alt || "Alt Text Absent"}
                    </p>

                    {/* URL */}
                    <p className="text-blue-300 truncate">
                      <a
                        href={image.URL}
                        target="_blank"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {image.URL.slice(0, 40)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {internal_links.length !== 0 && (
          <div className="bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-violet-800/40 backdrop-blur-xl rounded-2xl border border-violet-500/30 shadow-lg p-6">
            <button
              onClick={() => handleShow("internal")}
              className="flex justify-between items-center w-full text-left mb-4"
            >
              <h2 className="text-xl font-bold text-blue-200 flex items-center tracking-wide">
                <LinkIcon className="mr-2 w-6 h-6" /> Internal Links (
                {internal_links.length})
              </h2>
              {show == "internal" ? (
                <ChevronUp className="w-5 h-5 text-blue-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-300" />
              )}
            </button>

            {show == "internal" && (
              <div className="space-y-3">
                {internal_links.map((internal, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-violet-900/20 border border-violet-600/30 hover:border-violet-400/60 transition text-sm flex items-center justify-between"
                  >
                    {/* Title */}
                    <div>
                      <p className="font-medium text-white">
                        Text: {internal.Link.Text || "Untitled Link"}
                      </p>

                      {/* URL */}
                      <p className="text-blue-300 truncate">
                        URL:{" "}
                        <a
                          href={internal.Link.URL}
                          target="_blank"
                          rel={internal.Link.Rel || "noopener noreferrer"}
                          className="hover:underline inline-flex items-center gap-1"
                        >
                          {internal.Link.URL}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>

                      {/* Metadata badges */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {internal.Link.Rel && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-700/40 text-blue-200">
                            Rel: {internal.Link.Rel}
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            internal.Link.NoFollow
                              ? "bg-red-700/40 text-red-300"
                              : "bg-green-700/40 text-green-300"
                          }`}
                        >
                          NoFollow: {internal.Link.NoFollow ? "Yes" : "No"}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            internal.Link.Sponsored
                              ? "bg-yellow-700/40 text-yellow-200"
                              : "bg-gray-700/40 text-gray-300"
                          }`}
                        >
                          Sponsored: {internal.Link.Sponsored ? "Yes" : "No"}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            internal.Link.UGC
                              ? "bg-purple-700/40 text-purple-300"
                              : "bg-gray-700/40 text-gray-300"
                          }`}
                        >
                          UGC: {internal.Link.UGC ? "Yes" : "No"}
                        </span>

                        <span className="px-2 py-0.5 text-xs rounded-full bg-teal-700/40 text-teal-300">
                          StatusCode: {internal.Link.StatusCode}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/resources?pid=${pid}&rid=${internal.PageReport.Id}&eid=${eid}&t=details&uid=${userId}`}
                        className="flex items-center justify-center rounded-full bg-white text-black hover:bg-black hover:text-white w-10 h-10 transition"
                      >
                        <ArrowBigRightDashIcon size={20} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        <div className="bg-gradient-to-br from-red-900/40 to-red-800/30 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-lg p-6">
          <button
            onClick={() => handleShow("errors")}
            className="flex justify-between items-center w-full text-left mb-4"
          >
            <h2 className="text-xl font-bold text-red-300 flex items-center tracking-wide">
              <AlertCircle className="mr-2 w-6 h-6" /> Errors ({errors.length})
            </h2>
            {show == "errors" ? (
              <ChevronUp className="w-5 h-5 text-red-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-red-300" />
            )}
          </button>
          {show == "errors" && (
            <>
              {errors.length === 0 ? (
                <p className="text-sm text-gray-300">No errors found 🎉</p>
              ) : (
                <ul className="space-y-4">
                  {errors.map((err) => (
                    <li
                      key={err.Id}
                      className="p-4 rounded-xl bg-red-900/40 border border-red-600/40 flex justify-between items-center hover:border-red-400/60 transition"
                    >
                      <div>
                        <p className="font-semibold text-white flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-300" /> {err}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          {issueDescriptions[err] ||
                            "No description available."}
                        </p>
                      </div>
                      <Link
                        className="p-2 rounded-full bg-white hover:bg-black hover:text-white transition"
                        to={`/issues/view?pid=${pid}&eid=${err}`}
                      >
                        <ArrowBigRight size={24} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-5 justify-center mt-4">
        <button
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
          disabled={data?.page_report_view?.Paginator.PreviousPage == 0}
          className={`p-1 rounded-lg w-15 ${
            data?.page_report_view?.Paginator.PreviousPage == 0
              ? "bg-gray-400"
              : "bg-red-500"
          }`}
        >
          Prev
        </button>
        <span>
          Page: {data?.page_report_view?.Paginator.CurrentPage}/
          {data?.page_report_view?.Paginator.TotalPages}
        </span>
        <button
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
          disabled={data?.page_report_view?.Paginator.NextPage == 0}
          className={`p-1 rounded-lg w-15 ${
            data?.page_report_view?.Paginator.NextPage == 0
              ? "bg-gray-400"
              : "bg-green-500"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
