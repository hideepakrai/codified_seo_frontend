import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Database,
  Link,
  ExternalLink,
  Image,
  Code,
  Palette,
  Square,
  Headphones,
  Video,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

export const Export = () => {
  const [isExporting, setIsExporting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();

  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    const fetchAllExport = async () => {
      try {
        const response = await axios.get(`${API_URI}/export?pid=${id}`, {
          withCredentials: true,
        });

        if (response.data.ok) {
          setData(response.data);
        }
      } catch (error) {
        setData(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllExport();
  }, []);

  const exportOptions = [
    {
      id: "issues",
      title: "Export all issues",
      description:
        "Export all the issues with the affected URLs, issue type and priority.",
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=issues`,
    },
    {
      id: "sitemap",
      title: "Export sitemap.xml",
      description:
        "Download a sitemap.xml file with all the canonical pages in your site.",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      url: `${API_URI}/export/sitemap?pid=${id}`,
    },
    {
      id: "csv",
      title: "Export as CSV",
      description:
        "Export all crawled URLs in CSV format, including all mime types and with additional information such as status code and size.",
      icon: Database,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      url: `${API_URI}/export/csv?pid=${id}`,
    },
    {
      id: "internal-links",
      title: "Export internal links",
      description:
        "Export all the internal links in the website. Including origin, destination and anchor text.",
      icon: Link,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=internal`,
    },
    {
      id: "external-links",
      title: "Export external links",
      description:
        "Export all the external links in the website. Including origin, destination and anchor text.",
      icon: ExternalLink,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=external`,
    },
    {
      id: "images",
      title: "Export images",
      description:
        "Export all the image URLs in the website, including origin, image URLs and alt text.",
      icon: Image,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=images`,
    },
    {
      id: "scripts",
      title: "Export scripts",
      description:
        "Export all the script URLs in the website, including origin and script URLs.",
      icon: Code,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=scripts`,
    },
    {
      id: "styles",
      title: "Export styles",
      description:
        "Export all the CSS stylesheet URLs in the website, including origin and style URLs.",
      icon: Palette,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=styles`,
    },
    {
      id: "iframes",
      title: "Export iframes",
      description:
        "Export all the iframe URLs in the website, including origin and iframe URLs.",
      icon: Square,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=iframes`,
    },
    {
      id: "audios",
      title: "Export audios",
      description:
        "Export all audio URLs in the website, including origin and audio URLs.",
      icon: Headphones,
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=audios`,
    },
    {
      id: "videos",
      title: "Export videos",
      description:
        "Export all video URLs in the website, including origin and video URLs.",
      icon: Video,
      color: "text-rose-400",
      bgColor: "bg-rose-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=videos`,
    },
    {
      id: "hreflangs",
      title: "Export Hreflangs",
      description:
        "Export all hreflang URLs in the website, including origin URL and language as well as hreflang URL and language.",
      icon: Globe,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      url: `${API_URI}/export/resources?pid=${id}&t=hreflangs`,
    },
  ];

  const handleExport = async (exportId, exportURL) => {
    console.log(exportURL);
    try {
      setIsExporting(exportId);
      const res = await axios.get(exportURL, {
        withCredentials: true,
        responseType: "blob",
      });

      console.log(res);

      const URL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = URL;

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
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsExporting(null);
    }
  };

  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className="flex items-center text-gray-300 hover:text-white transition-colors mr-4 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-lg">
              <span className="text-sm font-medium">{data.project.URL}</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">Data Export</h1>
          <p className="text-gray-300">
            Export your crawl data in various formats for analysis and reporting
          </p>
        </div>

        {/* Export Options Grid */}
        <div className="grid gap-4">
          {exportOptions.map((option) => {
            const IconComponent = option.icon;
            const isCurrentlyExporting = isExporting === option.id;

            return (
              <div
                key={option.id}
                className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 ${option.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent className={`w-6 h-6 ${option.color}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => handleExport(option.id, option.url)}
                      disabled={isCurrentlyExporting}
                      className={`
                        flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg
                        ${
                          isCurrentlyExporting
                            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        }
                      `}
                    >
                      {isCurrentlyExporting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                          <span>Exporting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Export Status */}
        {isExporting && (
          <div className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white font-medium">Preparing export...</span>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Export Information
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                All exports are generated in real-time based on your latest
                crawl data. Large exports may take a few moments to prepare.
                Files will be downloaded automatically once ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
