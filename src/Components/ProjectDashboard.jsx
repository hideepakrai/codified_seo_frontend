import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Globe,
  Calendar,
  Activity,
  AlertCircle,
  Bug,
  Database,
  Link2,
  LayoutDashboard,
  BatteryWarning,
  BadgeAlert,
  Book,
} from "lucide-react";

export const ProjectDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [projectView, setProjectView] = useState(null);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/dashboard?pid=${id}&uid=${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.ok) {
          setData(response.data.data);
          setProjectView(response.data.data.project_view);
        }
      } catch (error) {
        setData(null);
        setProjectView(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-purple-200 font-semibold">
          Fetching Dashboard...
        </p>
      </div>
    );
  }

  if (error || !projectView) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400">
        Failed to load project: {error}
      </div>
    );
  }

  const { Project, Crawl } = projectView;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Project Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="shrink-0 p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Globe size={15} className="w-7 h-7 text-white" />
            </div>
            <div className="">
              <h1 className="text-1xl font-bold text-white mb-1">
                {Project.Host}
              </h1>
              <a
                href={Project.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 text-sm flex items-center"
              >
                {Project.URL}
                <Link2 className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="text-[10px] h-10 sm:text-[14px] flex-col flex gap-2 sm:flex-row-reverse flex-1">
              {/* Dashboard */}
              <Link
                to={"/dashboard"}
                className="p-2  bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex gap-1 items-center justify-center cursor-pointer hover:opacity-90 transition"
              >
                <LayoutDashboard size={15} className="text-white" />
                <span className="font-bold text-white">Dashboard</span>
              </Link>

              {/* Site Issues */}
              <Link
                to={`/crawl/${id}`}
                className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex gap-1 items-center justify-center cursor-pointer hover:opacity-90 transition"
              >
                <BadgeAlert size={15} className="text-white" />
                <span className="font-bold text-white">Site Issues</span>
              </Link>

              {/* Page Details */}
              <Link
                to={`/pagedetails/${id}`}
                className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex gap-1 items-center justify-center cursor-pointer hover:opacity-90 transition"
              >
                <Book size={15} className="text-white" />
                <span className="font-bold text-white">Page Details</span>
              </Link>
            </div>
          </div>

          <div className="text-[12px] sm:text-[16px] flex items-center text-gray-300 space-x-6">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(Project.Created).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Database className="w-4 h-4 mr-1" />
              Project ID: {Project.Id}
            </span>
            <span className="flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              {Crawl.TotalURLs} URLs Crawled
            </span>
          </div>
        </div>

        {/* Crawl Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Database className="w-6 h-6 text-blue-400" />}
            label="Total URLs"
            value={Crawl.TotalURLs}
            color="text-blue-400"
          />
          <StatCard
            icon={<Bug className="w-6 h-6 text-red-400" />}
            label="Total Issues"
            value={Crawl.TotalIssues}
            color="text-red-400"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6 text-yellow-400" />}
            label="Alerts"
            value={Crawl.AlertIssues}
            color="text-yellow-400"
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-green-400" />}
            label="Warnings"
            value={Crawl.WarningIssues}
            color="text-green-400"
          />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <ChartCard title="Crawl History">
            <CrawlHistory crawls={data.crawls} />
          </ChartCard>
          <ChartCard title="Issues Over Time">
            <IssuesHistory crawls={data.crawls} />
          </ChartCard>
          <ChartCard title="Issue Types">
            <IssueTypesPie crawl={Crawl} />
          </ChartCard>
          <ChartCard title="Canonical URLs">
            <CanonicalPie canonical={data.canonical_count} />
          </ChartCard>
          <ChartCard title="Images Alt Text">
            <ImagesAltPie alt={data.alt_count} />
          </ChartCard>
          <ChartCard title="Status Codes by Depth">
            <StatusCodeByDepth statusDepth={data.status_code_by_depth} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 flex flex-col items-start hover:bg-white/15 transition-all">
      <div className="mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-300 text-sm">{label}</div>
    </div>
  );
}

// Chart Wrapper Card
function ChartCard({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Colors for pie charts
const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#FF4444"];

export function CrawlHistory({ crawls }) {
  const data = crawls.map((c) => ({
    date: new Date(c.Start).toLocaleTimeString(),
    urls: c.TotalURLs,
  }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="date" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Bar dataKey="urls" fill="#0088FE" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IssuesHistory({ crawls }) {
  const data = crawls
    .filter(
      (c) =>
        (c.CriticalIssues || 0) > 0 ||
        (c.AlertIssues || 0) > 0 ||
        (c.WarningIssues || 0) > 0
    )
    .map((c) => ({
      date: new Date(c.Start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      critical: c.CriticalIssues || 0,
      alerts: c.AlertIssues || 0,
      warnings: c.WarningIssues || 0,
    }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="date" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Bar dataKey="critical" stackId="a" fill="#FF4444" />
        <Bar dataKey="alerts" stackId="a" fill="#FFBB28" />
        <Bar dataKey="warnings" stackId="a" fill="#0088FE" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IssueTypesPie({ crawl }) {
  const data = [
    { name: "Critical", value: crawl.CriticalIssues },
    { name: "Alerts", value: crawl.AlertIssues },
    { name: "Warnings", value: crawl.WarningIssues },
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CanonicalPie({ canonical }) {
  const data = [
    { name: "Canonical", value: canonical.Canonical },
    { name: "Non Canonical", value: canonical.NonCanonical },
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ImagesAltPie({ alt }) {
  const data = [
    { name: "With alt", value: alt.Alt },
    { name: "Without alt", value: alt.NonAlt },
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StatusCodeByDepth({ statusDepth }) {
  const data = statusDepth.map((d) => ({
    depth: d.Depth,
    "2xx": d.StatusCode200,
    "3xx": d.StatusCode300,
    "4xx": d.StatusCode400,
    "5xx": d.StatusCode500,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="depth" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Bar dataKey="2xx" stackId="a" fill="#00C49F" />
        <Bar dataKey="3xx" stackId="a" fill="#FFBB28" />
        <Bar dataKey="4xx" stackId="a" fill="#FF8042" />
        <Bar dataKey="5xx" stackId="a" fill="#FF4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
