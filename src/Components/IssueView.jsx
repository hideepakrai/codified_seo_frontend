import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowBigLeft, Download, ExternalLink } from "lucide-react";

export default function IssueView() {
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid");
  const eid = searchParams.get("eid");
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const handleExportURL = async () => {
    try {
      // csv?pid=2491&eid=ERROR_SHORT_TITLE

      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/export/csv?pid=${pid}&eid=${eid}`,
        {
          withCredentials: true,
          responseType: "blob", // so we can download the file
        }
      );
      // const res = await axios.get(
      //   `${import.meta.env.VITE_API_URI}/export/resources?pid=${pid}&t=issues`,
      //   {
      //     withCredentials: true,
      //     responseType: "blob", // so we can download the file
      //   }
      // );

      // trigger file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      // get filename from header if provided
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

  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URI
          }/issues/view?pid=${pid}&eid=${eid}&page=${currentPage}`,
          { withCredentials: true }
        );
        if (res.data.ok) {
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
  }, [pid, eid, currentPage]);

  const t = "details";

  const status = "timeout";

  const getStatusText = () => {
    switch (status) {
      case "timeout":
        return "Request Timed Out";
      case "error":
        return "Download Failed";
      case "success":
        return "Ready to Download";
      default:
        return "Processing";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-purple-200 font-semibold">
          Fetching issue details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-red-400 font-semibold">Error: {error}</p>
      </div>
    );
  }

  const pageReports = data?.PaginatorView?.PageReports || [];
  const totalPages = data?.PaginatorView?.Paginator?.TotalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 item">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="bg-black hover:bg-white hover:text-black w-10 h-10 text-white p-2 rounded-full transition-all duration-300"
            >
              <ArrowBigLeft />
            </button>
            <h2 className="text-2xl font-bold text-white">{getStatusText()}</h2>
          </div>
          <button
            onClick={handleExportURL}
            className="p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition flex gap-1 items-center cursor-pointer"
          >
            <Download className="w-5 h-5 text-purple-300" />{" "}
            <span className="font-bold text-white">Export</span>
          </button>
        </div>

        {/* List of URLs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-3">
          {pageReports.length === 0 ? (
            <p className="text-gray-300 text-sm">No reports found.</p>
          ) : (
            <ul className="space-y-2">
              {pageReports.map((report) => (
                <li
                  key={report.Id}
                  className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
                >
                  <span className="text-gray-200 text-sm break-all max-w-10/12">
                    {report.URL}
                  </span>
                  <Link
                    to={`/resources?pid=${pid}&rid=${report.Id}&eid=${eid}&rid=${report.Id}&t=${t}`}
                    className="flex items-center px-3 py-1 text-xs font-medium rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white transition-colors"
                  >
                    View Details
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Paginator */}
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              setLoading(true);
            }}
            disabled={currentPage === 1}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                : "bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white"
            }`}
          >
            Prev
          </button>

          <span className="text-gray-300 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages));
              setLoading(true);
            }}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                : "bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
