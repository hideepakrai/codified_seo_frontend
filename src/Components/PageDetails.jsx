import { useState, useMemo, useEffect } from "react";
import {
  Search,
  ArrowLeft,
  ExternalLink,
  Filter,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  FileText,
  ChevronLeft,
  ChevronRight,
  SearchCheck,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router";

function getPagination(current, total, window = 2) {
  const pages = [];

  pages.push(1);

  if (current - window > 2) {
    pages.push("...");
  }

  for (
    let i = Math.max(2, current - window);
    i <= Math.min(total, current + window);
    i++
  ) {
    pages.push(i);
  }

  if (current + window < total - 1) {
    pages.push("...");
  }

  if (total > 1 && pages[pages.length - 1] !== total) {
    pages.push(total);
  }

  return pages;
}

export const SEOPageDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isExporting, setIsExporting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/explorer?pid=${id}&p=${currentPage}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.ok) {
          console.log(response.data.data);
          setData(response.data.data);
        }
      } catch (error) {
        setData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPages();
  }, [currentPage]);

  useEffect(() => {
    const getData = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URI
          }/explorer?p=1&pid=${id}&term=${searchQuery}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.ok) {
          console.log(response.data.data);
          setData(response.data.data);
        }
      } catch (error) {
        setData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-purple-200 font-semibold">
          Fetching Export Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400">
        Failed to load project: {error} Reload
      </div>
    );
  }

  const totalPages = data.PaginatorView.Paginator.TotalPages;

  const currentPages = data.PaginatorView.PageReports;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to={"/dashboard"}
              className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">
                {data.ProjectView.Project.URL}
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">Page Details</h1>
          <p className="text-gray-300">
            Browse and analyze all crawled pages from your website
          </p>
        </div>

        {/* Search and Controls */}
        {/* <div className="flex flex-col lg:flex-row gap-4 mb-8"> */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search pages by URL or title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <SearchCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* <button className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button> */}

        {/* <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button> */}

        {/* Results Info */}
        {/* <div className="mb-6">
          <p className="text-gray-300">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredPages.length)}{" "}
            of {filteredPages.length} pages
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div> */}

        {/* Pages List */}
        <div className="space-y-4 mb-8">
          {currentPages == null && (
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all">
              NO URL FOUND
            </div>
          )}
          {currentPages !== null &&
            currentPages.map((page) => (
              <div
                key={page.Id}
                className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <Globe className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                          {page.Title}
                        </h3>
                        <div className="flex items-center text-gray-300 hover:text-purple-300 transition-colors group">
                          <span className="text-sm break-all">{page.URL}</span>
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/resources?pid=${id}&ep=1&rid=${page.Id}`}
                        className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {getPagination(currentPage, totalPages, 1).map((d, index) => {
                const isCurrentPage = d === currentPage;
                console.log(d);
                return (
                  <button
                    key={index}
                    disabled={d == "..."}
                    onClick={() => {
                      if (d == "...") {
                        return;
                      }
                      setCurrentPage(d);
                    }}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      isCurrentPage
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {currentPage.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No pages found
            </h3>
            <p className="text-gray-400 mb-8">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No pages have been crawled yet"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
