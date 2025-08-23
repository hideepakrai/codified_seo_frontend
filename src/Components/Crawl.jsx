// import React, { useState, useEffect, useRef } from "react";
// import {
//   Play,
//   Pause,
//   Square,
//   ArrowLeft,
//   Globe,
//   Clock,
//   Activity,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Download,
//   RefreshCw,
//   Zap,
//   Database,
//   ExternalLink,
//   TrendingUp,
// } from "lucide-react";
// import { useParams, useSearchParams } from "react-router";
// import axios from "axios";

// export default function CrawlComponent({ projectData }) {
//   const [crawlStatus, setCrawlStatus] = useState("idle"); // idle, starting, running, paused, completed, failed
//   const [crawlData, setCrawlData] = useState({
//     pagesFound: 0,
//     pagesCrawled: 0,
//     errors: 0,
//     warnings: 0,
//     startTime: null,
//     elapsed: 0,
//     estimatedTimeRemaining: null,
//     currentUrl: "",
//     queueSize: 0,
//     crawlSpeed: 0,
//   });
//   const [crawledata, setCrawledData] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [showLogs, setShowLogs] = useState(false);
//   const [wsurl, setWsurl] = useState(null);
//   const wsRef = useRef(null);
//   const [searchParams] = useSearchParams();

//   const id = searchParams.get("pid");
//   const [crawling, setCrawling] = useState(
//     searchParams.get("Crawling") == "true"
//   );

//   const progress =
//     crawlData.length > 0
//       ? (crawlData.map((d) => d.data.statusCode == 200).length /
//           crawlData.crawlData.length) *
//         100
//       : 0;

//   const stopCrawl = async () => {
//     try {
//       // Hit the actual endpoint
//       const response = await axios.get(
//         // `${import.meta.env.VITE_API_URI}/crawl/stop?pid=${id}`,
//         `${import.meta.env.VITE_API_URI}/crawl/stop?pid=${id}`,
//         {
//           withCredentials: true,
//         }
//       );
//       if (response.status == 200) {
//         if (wsRef.current) {
//           wsRef.current.close();
//           wsRef.current = null;
//         }
//         setCrawlStatus("idle");
//         setWsurl(null);
//         setCrawling(false);
//       }
//     } catch (error) {
//       console.error("Error starting crawl:", error);
//     }
//   };

//   const startCrawl = async (crawling) => {
//     try {
//       setCrawlStatus("starting");
//       // Hit the actual endpoint
//       let response = null;
//       if (!crawling) {
//         response = await axios.get(
//           `${import.meta.env.VITE_API_URI}/crawl/start?pid=${id}`,
//           {
//             withCredentials: true,
//           }
//         );
//       }
//       if (response != null) {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URI}/crawl/live?pid=${id}`,
//           {
//             withCredentials: true,
//           }
//         );
//         console.log(response);
//         setWsurl(response.data.ws_url);
//       } else if (crawling) {
//         setWsurl(`ws://localhost:9000/crawl/ws?pid=${id}`);
//       }
//     } catch (error) {
//       console.error("Error starting crawl:", error);
//       setCrawlStatus("idle");
//       stopCrawl();
//       setCrawling(false);
//     }
//   };

//   useEffect(() => {
//     // const startCrawl =
//     // if (crawling == "true") {
//     //   setWsurl(`ws://localhost:9000/crawl/ws?pid=${id}`);
//     // }
//     startCrawl(crawling);
//   }, []);

//   useEffect(() => {
//     if (!wsurl) return;

//     const ws = new WebSocket(wsurl);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ WebSocket connected:", wsurl);
//       setCrawlStatus("running");
//       setLogs((prev) => [
//         {
//           type: "success",
//           message: "Connected to live crawl",
//           timestamp: new Date(),
//         },
//         ...prev,
//       ]);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("📨 WS Message:", data);
//         // Example: server may send stats/logs
//         if (data.type === "stats") {
//           setCrawlData((prev) => ({ ...prev, ...data.payload }));
//           if (data.name == "CrawlEnd") {
//             setWsurl(null);
//             ws.close();
//           }
//         } else if (data.type === "log") {
//           setLogs((prev) => [
//             {
//               type: data.level || "info",
//               message: data.message,
//               timestamp: new Date(),
//             },
//             ...prev,
//           ]);
//         } else if (data.type === "status") {
//           setCrawlStatus(data.status);
//         }
//       } catch (err) {
//         console.error("❌ Error parsing WS message:", err, event.data);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("❌ WebSocket error:", err);
//       setLogs((prev) => [
//         { type: "error", message: "WebSocket error", timestamp: new Date() },
//         ...prev,
//       ]);
//     };

//     ws.onclose = () => {
//       console.log("🔌 WebSocket closed");
//       setLogs((prev) => [
//         {
//           type: "warning",
//           message: "Disconnected from live crawl",
//           timestamp: new Date(),
//         },
//         ...prev,
//       ]);
//       setWsurl(null);
//     };

//     return () => {
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [wsurl]);

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours}h ${minutes}m ${secs}s`;
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "running":
//         return "text-green-400 bg-green-400/20";
//       case "paused":
//         return "text-yellow-400 bg-yellow-400/20";
//       case "completed":
//         return "text-blue-400 bg-blue-400/20";
//       case "failed":
//         return "text-red-400 bg-red-400/20";
//       case "starting":
//         return "text-purple-400 bg-purple-400/20";
//       default:
//         return "text-gray-400 bg-gray-400/20";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "running":
//         return <Activity className="w-4 h-4 animate-pulse" />;
//       case "paused":
//         return <Pause className="w-4 h-4" />;
//       case "completed":
//         return <CheckCircle className="w-4 h-4" />;
//       case "failed":
//         return <XCircle className="w-4 h-4" />;
//       case "starting":
//         return <RefreshCw className="w-4 h-4 animate-spin" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getLogIcon = (type) => {
//     switch (type) {
//       case "success":
//         return <CheckCircle className="w-4 h-4 text-green-400" />;
//       case "error":
//         return <XCircle className="w-4 h-4 text-red-400" />;
//       case "warning":
//         return <AlertCircle className="w-4 h-4 text-yellow-400" />;
//       default:
//         return <Globe className="w-4 h-4 text-blue-400" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header */}
//       <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">
//                   {"Website Crawl"}
//                 </h1>
//               </div>
//             </div>

//             <div
//               className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(
//                 crawlStatus
//               )}`}
//             >
//               {getStatusIcon(crawlStatus)}
//               <span className="font-medium capitalize">{crawlStatus}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Control Panel */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
//             {/* Controls */}
//             <div className="flex items-center space-x-4">
//               {crawlStatus === "idle" && (
//                 <button
//                   onClick={() => startCrawl(crawling)}
//                   className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
//                 >
//                   <Play className="w-5 h-5" />
//                   <span>Start Crawl</span>
//                 </button>
//               )}

//               {crawlStatus === "running" && (
//                 <>
//                   <button
//                     onClick={stopCrawl}
//                     className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
//                   >
//                     <Square className="w-5 h-5" />
//                     <span>Stop</span>
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Progress Info */}
//             {crawlStatus !== "idle" && (
//               <div className="flex items-center space-x-6 text-sm">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white">
//                     {crawlData.length == 0 ? 0 : crawlData.length}
//                   </div>
//                   <div className="text-gray-400">Pages Crawled</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-400">
//                     {crawlData.pagesFound}
//                   </div>
//                   <div className="text-gray-400">Pages Found</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-400">
//                     {formatTime(crawlData.elapsed)}
//                   </div>
//                   <div className="text-gray-400">Elapsed Time</div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Progress Bar */}
//           {crawlStatus !== "idle" && crawlData.pagesFound > 0 && (
//             <div className="mt-6">
//               <div className="flex justify-between text-sm text-gray-300 mb-2">
//                 <span>Crawl Progress</span>
//                 <span>{Math.round(progress)}%</span>
//               </div>
//               <div className="w-full bg-black/30 rounded-full h-2">
//                 <div
//                   className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${Math.min(progress, 100)}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Stats Panel */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Configuration */}
//             <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
//               <h3 className="text-lg font-semibold text-white mb-4">
//                 Crawl Configuration
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {projectData?.ignoreRobotsTxt && (
//                   <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
//                     Ignore Robots.txt
//                   </span>
//                 )}
//                 {projectData?.followNofollow && (
//                   <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
//                     Follow Nofollow
//                   </span>
//                 )}
//                 {projectData?.crawlSitemap && (
//                   <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
//                     Crawl Sitemap
//                   </span>
//                 )}
//                 {projectData?.allowSubdomains && (
//                   <span className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">
//                     Allow Subdomains
//                   </span>
//                 )}
//                 {projectData?.checkExternalLinks && (
//                   <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">
//                     Check External Links
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Activity Log */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-white flex items-center">
//                 <Eye className="w-5 h-5 mr-2" />
//                 Activity Log
//               </h3>
//               {logs.length > 0 && (
//                 <button
//                   onClick={() => setShowLogs(!showLogs)}
//                   className="text-sm text-purple-400 hover:text-purple-300"
//                 >
//                   {showLogs ? "Hide" : "Show"} Details
//                 </button>
//               )}
//             </div>

//             <div className="space-y-2 max-h-96 overflow-y-auto">
//               {logs.length === 0 ? (
//                 <div className="text-center py-8 text-gray-400">
//                   <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                   <p>No activity yet</p>
//                   <p className="text-sm">Start crawling to see live updates</p>
//                 </div>
//               ) : (
//                 logs.map((log, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg"
//                   >
//                     {getLogIcon(log.type)}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-white text-sm">{log.message}</p>
//                       <p className="text-gray-400 text-xs mt-1">
//                         {log.timestamp.toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {crawlStatus === "completed" && (
//               <div className="mt-4 pt-4 border-t border-white/20">
//                 <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
//                   <Download className="w-4 h-4" />
//                   <span>Download Report</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Play,
//   Pause,
//   Square,
//   ArrowLeft,
//   Globe,
//   Clock,
//   Activity,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Download,
//   RefreshCw,
// } from "lucide-react";
// import { useSearchParams } from "react-router";
// import axios from "axios";

// export default function CrawlComponent({ projectData }) {
// const [crawlStatus, setCrawlStatus] = useState("idle"); // idle, starting, running, completed
// const [crawlData, setCrawlData] = useState({
//   pagesFound: 0,
//   pagesCrawled: 0,
//   currentUrl: "",
//   elapsed: 0,
// });
// const [logs, setLogs] = useState([]);
// const [showLogs, setShowLogs] = useState(false);
// const [wsurl, setWsurl] = useState(null);
// const wsRef = useRef(null);
// const [searchParams] = useSearchParams();

// const id = searchParams.get("pid");
// const [crawling, setCrawling] = useState(
//   searchParams.get("Crawling") === "true"
// );

// const progress =
//   crawlData.pagesFound > 0
//     ? (crawlData.pagesCrawled / crawlData.pagesFound) * 100
//     : 0;

// const stopCrawl = async () => {
//   try {
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URI}/crawl/stop?pid=${id}`,
//       { withCredentials: true }
//     );
//     if (response.status === 200) {
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//       setCrawlStatus("idle");
//       setWsurl(null);
//       setCrawling(false);
//     }
//   } catch (error) {
//     console.error("Error stopping crawl:", error);
//   }
// };

// const startCrawl = async (crawling) => {
//   try {
//     setCrawlStatus("starting");
//     let response = null;
//     if (!crawling) {
//       response = await axios.get(
//         `${import.meta.env.VITE_API_URI}/crawl/start?pid=${id}`,
//         { withCredentials: true }
//       );
//     }
//     if (response != null) {
//       const liveResp = await axios.get(
//         `${import.meta.env.VITE_API_URI}/crawl/live?pid=${id}`,
//         { withCredentials: true }
//       );
//       setWsurl(liveResp.data.ws_url);
//     } else if (crawling) {
//       setWsurl(`ws://localhost:9000/crawl/ws?pid=${id}`);
//     }
//   } catch (error) {
//     console.error("Error starting crawl:", error);
//     setCrawlStatus("idle");
//     stopCrawl();
//     setCrawling(false);
//   }
// };

// useEffect(() => {
//   startCrawl(crawling);
// }, []);

// useEffect(() => {
//   if (!wsurl) return;

//   const ws = new WebSocket(wsurl);
//   wsRef.current = ws;

//   ws.onopen = () => {
//     console.log("✅ WebSocket connected:", wsurl);
//     setCrawlStatus("running");
//     setLogs((prev) => [
//       {
//         type: "success",
//         message: "Connected to live crawl",
//         timestamp: new Date(),
//       },
//       ...prev,
//     ]);
//   };

//   ws.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("📨 WS Message:", data);

//       if (data.name === "PageReport") {
//         setCrawlData((prev) => ({
//           ...prev,
//           pagesCrawled: data.data.crawled,
//           pagesFound: data.data.discovered,
//           currentUrl: data.data.url,
//         }));

//         setLogs((prev) => [
//           {
//             type: data.data.statusCode === 200 ? "success" : "error",
//             message: `${data.data.statusCode} - ${data.data.url}`,
//             timestamp: new Date(),
//           },
//           ...prev,
//         ]);
//       }

//       if (data.name === "CrawlEnd") {
//         setCrawlStatus("completed");
//         setWsurl(null);
//         ws.close();
//       }
//     } catch (err) {
//       console.error("❌ Error parsing WS message:", err, event.data);
//     }
//   };

//   ws.onerror = (err) => {
//     console.error("❌ WebSocket error:", err);
//     setLogs((prev) => [
//       { type: "error", message: "WebSocket error", timestamp: new Date() },
//       ...prev,
//     ]);
//   };

//   ws.onclose = () => {
//     console.log("🔌 WebSocket closed");
//     setLogs((prev) => [
//       {
//         type: "warning",
//         message: "Disconnected from live crawl",
//         timestamp: new Date(),
//       },
//       ...prev,
//     ]);
//     setWsurl(null);
//   };

//   return () => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.close();
//     }
//   };
// }, [wsurl]);

// const formatTime = (seconds) => {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;
//   return `${hours}h ${minutes}m ${secs}s`;
// };

// const getStatusColor = (status) => {
//   switch (status) {
//     case "running":
//       return "text-green-400 bg-green-400/20";
//     case "completed":
//       return "text-blue-400 bg-blue-400/20";
//     case "starting":
//       return "text-purple-400 bg-purple-400/20";
//     default:
//       return "text-gray-400 bg-gray-400/20";
//   }
// };

// const getStatusIcon = (status) => {
//   switch (status) {
//     case "running":
//       return <Activity className="w-4 h-4 animate-pulse" />;
//     case "completed":
//       return <CheckCircle className="w-4 h-4" />;
//     case "starting":
//       return <RefreshCw className="w-4 h-4 animate-spin" />;
//     default:
//       return <Clock className="w-4 h-4" />;
//   }
// };

// const getLogIcon = (type) => {
//   switch (type) {
//     case "success":
//       return <CheckCircle className="w-4 h-4 text-green-400" />;
//     case "error":
//       return <XCircle className="w-4 h-4 text-red-400" />;
//     case "warning":
//       return <AlertCircle className="w-4 h-4 text-yellow-400" />;
//     default:
//       return <Globe className="w-4 h-4 text-blue-400" />;
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header */}
//       <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <h1 className="text-2xl font-bold text-white">Website Crawl</h1>
//             </div>

//             <div
//               className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(
//                 crawlStatus
//               )}`}
//             >
//               {getStatusIcon(crawlStatus)}
//               <span className="font-medium capitalize">{crawlStatus}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Control Panel */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
//             <div className="flex items-center space-x-4">
//               {crawlStatus === "idle" && (
//                 <button
//                   onClick={() => startCrawl(crawling)}
//                   className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
//                 >
//                   <Play className="w-5 h-5" />
//                   <span>Start Crawl</span>
//                 </button>
//               )}

//               {crawlStatus === "running" && (
//                 <button
//                   onClick={stopCrawl}
//                   className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
//                 >
//                   <Square className="w-5 h-5" />
//                   <span>Stop</span>
//                 </button>
//               )}
//             </div>

//             {/* Progress Info */}
//             {crawlStatus !== "idle" && (
//               <div className="flex items-center space-x-6 text-sm">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-white">
//                     {crawlData.pagesCrawled}
//                   </div>
//                   <div className="text-gray-400">Pages Crawled</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-400">
//                     {crawlData.pagesFound}
//                   </div>
//                   <div className="text-gray-400">Pages Found</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-sm text-gray-300 truncate max-w-xs">
//                     Crawling:{" "}
//                     <span className="text-white">{crawlData.currentUrl}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Progress Bar */}
//           {crawlStatus !== "idle" && crawlData.pagesFound > 0 && (
//             <div className="mt-6">
//               <div className="flex justify-between text-sm text-gray-300 mb-2">
//                 <span>Crawl Progress</span>
//                 <span>{Math.round(progress)}%</span>
//               </div>
//               <div className="w-full bg-black/30 rounded-full h-2">
//                 <div
//                   className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${Math.min(progress, 100)}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="grid lg:grid-cols-3">
//           {/* Config */}
//           {/* <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
//               <h3 className="text-lg font-semibold text-white mb-4">
//                 Crawl Configuration
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {projectData?.ignoreRobotsTxt && (
//                   <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
//                     Ignore Robots.txt
//                   </span>
//                 )}
//                 {projectData?.followNofollow && (
//                   <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
//                     Follow Nofollow
//                   </span>
//                 )}
//                 {projectData?.crawlSitemap && (
//                   <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
//                     Crawl Sitemap
//                   </span>
//                 )}
//                 {projectData?.allowSubdomains && (
//                   <span className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">
//                     Allow Subdomains
//                   </span>
//                 )}
//                 {projectData?.checkExternalLinks && (
//                   <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">
//                     Check External Links
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div> */}

//           {/* Activity Log */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 lg:col-span-3">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-white flex items-center">
//                 <Eye className="w-5 h-5 mr-2" />
//                 Activity Log
//               </h3>
//               {logs.length > 0 && (
//                 <button
//                   onClick={() => setShowLogs(!showLogs)}
//                   className="text-sm text-purple-400 hover:text-purple-300"
//                 >
//                   {showLogs ? "Hide" : "Show"} Details
//                 </button>
//               )}
//             </div>

//             <div className="space-y-2 max-h-96 overflow-y-auto">
//               {logs.length === 0 ? (
//                 <div className="text-center py-8 text-gray-400">
//                   <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                   <p>No activity yet</p>
//                   <p className="text-sm">Start crawling to see live updates</p>
//                 </div>
//               ) : (
//                 logs.map((log, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg"
//                   >
//                     {getLogIcon(log.type)}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-white text-sm">{log.message}</p>
//                       <p className="text-gray-400 text-xs mt-1">
//                         {log.timestamp.toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {crawlStatus === "completed" && (
//               <div className="mt-4 pt-4 border-t border-white/20">
//                 <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
//                   <Download className="w-4 h-4" />
//                   <span>Download Report</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  ArrowLeft,
  Globe,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Monitor,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";

export default function CrawlComponent() {
  // const [crawlStatus, setCrawlStatus] = useState("idle"); // idle, starting, running, completed
  // const [crawlData, setCrawlData] = useState({
  //   pagesFound: 0,
  //   pagesCrawled: 0,
  //   currentUrl: "",
  //   elapsed: 0,
  // });
  // const [logs, setLogs] = useState([]);
  // const [showLogs, setShowLogs] = useState(false);
  // const [expandedLogs, setExpandedLogs] = useState(false);
  // const [wsurl, setWsurl] = useState(null);
  // const wsRef = useRef(null);
  // const [searchParams] = useSearchParams();

  // const id = searchParams.get("pid");
  // const [crawling, setCrawling] = useState(
  //   searchParams.get("Crawling") === "true"
  // );

  // const progress =
  //   crawlData.pagesFound > 0
  //     ? (crawlData.pagesCrawled / crawlData.pagesFound) * 100
  //     : 0;

  // const stopCrawl = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URI}/crawl/stop?pid=${id}`,
  //       { withCredentials: true }
  //     );
  //     if (response.status === 200) {
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //         wsRef.current = null;
  //       }
  //       setCrawlStatus("idle");
  //       setWsurl(null);
  //       setCrawling(false);
  //     }
  //   } catch (error) {
  //     console.error("Error stopping crawl:", error);
  //   }
  // };

  // const startCrawl = async (crawling) => {
  //   try {
  //     setCrawlStatus("starting");
  //     let response = null;
  //     if (!crawling) {
  //       response = await axios.get(
  //         `${import.meta.env.VITE_API_URI}/crawl/start?pid=${id}`,
  //         { withCredentials: true }
  //       );
  //     }
  //     if (response != null) {
  //       const liveResp = await axios.get(
  //         `${import.meta.env.VITE_API_URI}/crawl/live?pid=${id}`,
  //         { withCredentials: true }
  //       );
  //       setWsurl(liveResp.data.ws_url);
  //     } else if (crawling) {
  //       setWsurl(`ws://localhost:9000/crawl/ws?pid=${id}`);
  //     }
  //   } catch (error) {
  //     console.error("Error starting crawl:", error);
  //     setCrawlStatus("idle");
  //     stopCrawl();
  //     setCrawling(false);
  //   }
  // };

  // useEffect(() => {
  //   startCrawl(crawling);
  // }, []);

  // useEffect(() => {
  //   if (!wsurl) return;

  //   const ws = new WebSocket(wsurl);
  //   wsRef.current = ws;

  //   ws.onopen = () => {
  //     console.log("✅ WebSocket connected:", wsurl);
  //     setCrawlStatus("running");
  //     setLogs((prev) => [
  //       {
  //         type: "success",
  //         message: "Connected to live crawl",
  //         timestamp: new Date(),
  //       },
  //       ...prev,
  //     ]);
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       console.log("📨 WS Message:", data);

  //       if (data.name === "PageReport") {
  //         setCrawlData((prev) => ({
  //           ...prev,
  //           pagesCrawled: data.data.crawled,
  //           pagesFound: data.data.discovered,
  //           currentUrl: data.data.url,
  //         }));

  //         setLogs((prev) => [
  //           {
  //             type: data.data.statusCode === 200 ? "success" : "error",
  //             message: `${data.data.statusCode} - ${data.data.url}`,
  //             timestamp: new Date(),
  //           },
  //           ...prev,
  //         ]);
  //       }

  //       if (data.name === "CrawlEnd") {
  //         setCrawlStatus("completed");
  //         setWsurl(null);
  //         ws.close();
  //       }
  //     } catch (err) {
  //       console.error("❌ Error parsing WS message:", err, event.data);
  //     }
  //   };

  //   ws.onerror = (err) => {
  //     console.error("❌ WebSocket error:", err);
  //     setLogs((prev) => [
  //       { type: "error", message: "WebSocket error", timestamp: new Date() },
  //       ...prev,
  //     ]);
  //   };

  //   ws.onclose = () => {
  //     console.log("🔌 WebSocket closed");
  //     setLogs((prev) => [
  //       {
  //         type: "warning",
  //         message: "Disconnected from live crawl",
  //         timestamp: new Date(),
  //       },
  //       ...prev,
  //     ]);
  //     setWsurl(null);
  //   };

  //   return () => {
  //     if (ws && ws.readyState === WebSocket.OPEN) {
  //       ws.close();
  //     }
  //   };
  // }, [wsurl]);

  // const formatTime = (seconds) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;
  //   return `${hours}h ${minutes}m ${secs}s`;
  // };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "running":
  //       return "text-green-400 bg-green-400/20";
  //     case "completed":
  //       return "text-blue-400 bg-blue-400/20";
  //     case "starting":
  //       return "text-purple-400 bg-purple-400/20";
  //     default:
  //       return "text-gray-400 bg-gray-400/20";
  //   }
  // };

  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case "running":
  //       return <Activity className="w-4 h-4 animate-pulse" />;
  //     case "completed":
  //       return <CheckCircle className="w-4 h-4" />;
  //     case "starting":
  //       return <RefreshCw className="w-4 h-4 animate-spin" />;
  //     default:
  //       return <Clock className="w-4 h-4" />;
  //   }
  // };

  // const getLogIcon = (type) => {
  //   switch (type) {
  //     case "success":
  //       return <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />;
  //     case "error":
  //       return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
  //     case "warning":
  //       return (
  //         <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
  //       );
  //     default:
  //       return <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />;
  //   }
  // };

  const [crawlStatus, setCrawlStatus] = useState("idle"); // idle, starting, running, completed
  const [crawlData, setCrawlData] = useState({
    pagesFound: 0,
    pagesCrawled: 0,
    currentUrl: "",
    elapsed: 0,
  });
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [wsurl, setWsurl] = useState(null);
  const wsRef = useRef(null);
  const [searchParams] = useSearchParams();

  const id = searchParams.get("pid");
  const [crawling, setCrawling] = useState(
    searchParams.get("Crawling") === "true"
  );

  const progress =
    crawlData.pagesFound > 0
      ? (crawlData.pagesCrawled / crawlData.pagesFound) * 100
      : 0;

  const stopCrawl = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/crawl/stop?pid=${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
        setCrawlStatus("idle");
        setWsurl(null);
        setCrawling(false);
      }
    } catch (error) {
      console.error("Error stopping crawl:", error);
    }
  };

  const startCrawl = async (crawling) => {
    try {
      setCrawlStatus("starting");
      let response = null;
      if (!crawling) {
        response = await axios.get(
          `${import.meta.env.VITE_API_URI}/crawl/start?pid=${id}`,
          { withCredentials: true }
        );
      }
      if (response != null) {
        const liveResp = await axios.get(
          `${import.meta.env.VITE_API_URI}/crawl/live?pid=${id}`,
          { withCredentials: true }
        );
        setWsurl(liveResp.data.ws_url);
      } else if (crawling) {
        // const liveResp = await axios.get(
        //   `${import.meta.env.VITE_API_URI}/crawl/live?pid=${id}`,
        //   { withCredentials: true }
        // );
        // setWsurl(liveResp.data.ws_url);
        // setWsurl(`ws:/codified-seo.onrender.com/crawl/ws?pid=${id}`);
        setWsurl(`wss://codified-seo.onrender.com/crawl/ws?pid=${id}`);
      }
    } catch (error) {
      console.error("Error starting crawl:", error);
      setCrawlStatus("idle");
      stopCrawl();
      setCrawling(false);
    }
  };

  useEffect(() => {
    if (crawling) {
      startCrawl(crawling);
    }
  }, []);

  useEffect(() => {
    if (!wsurl) return;

    const ws = new WebSocket(wsurl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected:", wsurl);
      setCrawlStatus("running");
      setLogs((prev) => [
        {
          type: "success",
          message: "Connected to live crawl",
          timestamp: new Date(),
        },
        ...prev,
      ]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 WS Message:", data);

        if (data.name === "PageReport") {
          setCrawlData((prev) => ({
            ...prev,
            pagesCrawled: data.data.crawled,
            pagesFound: data.data.discovered,
            currentUrl: data.data.url,
          }));

          setLogs((prev) => [
            {
              type: data.data.statusCode === 200 ? "success" : "error",
              message: `${data.data.statusCode} - ${data.data.url}`,
              timestamp: new Date(),
            },
            ...prev,
          ]);
        }

        if (data.name === "CrawlEnd") {
          setCrawlStatus("completed");
          setWsurl(null);
          ws.close();
        }
      } catch (err) {
        console.error("❌ Error parsing WS message:", err, event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      setLogs((prev) => [
        { type: "error", message: "WebSocket error", timestamp: new Date() },
        ...prev,
      ]);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
      setLogs((prev) => [
        {
          type: "warning",
          message: "Disconnected from live crawl",
          timestamp: new Date(),
        },
        ...prev,
      ]);
      setWsurl(null);
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [wsurl]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "text-green-400 bg-green-400/20";
      case "completed":
        return "text-blue-400 bg-blue-400/20";
      case "starting":
        return "text-purple-400 bg-purple-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <Activity className="w-4 h-4 animate-pulse" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "starting":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Globe className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to={"/dashboard"}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <button className="">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  Website Crawl
                </h1>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center space-x-2 ${getStatusColor(
                crawlStatus
              )}`}
            >
              {getStatusIcon(crawlStatus)}
              <span className="font-medium capitalize text-sm sm:text-base">
                {crawlStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              {crawlStatus === "idle" && (
                <button
                  onClick={() => startCrawl(crawling)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl w-full lg:w-auto justify-center"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Crawl</span>
                </button>
              )}

              {crawlStatus === "running" && (
                <button
                  onClick={stopCrawl}
                  className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all w-full lg:w-auto justify-center"
                >
                  <Square className="w-5 h-5" />
                  <span>Stop</span>
                </button>
              )}
            </div>

            {/* Progress Info */}
            {crawlStatus !== "idle" && (
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm w-full lg:w-auto">
                <div className="text-center bg-black/20 rounded-xl px-4 py-3 min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {crawlData.pagesCrawled}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Pages Crawled
                  </div>
                </div>
                <div className="text-center bg-black/20 rounded-xl px-4 py-3 min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">
                    {crawlData.pagesFound}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Pages Found
                  </div>
                </div>
                <div className="text-center bg-black/20 rounded-xl px-4 py-3 min-w-0 w-full sm:max-w-xs">
                  <div className="text-xs sm:text-sm text-gray-300 truncate">
                    Crawling:{" "}
                    <span className="text-white">{crawlData.currentUrl}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {crawlStatus !== "idle" && crawlData.pagesFound > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Crawl Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  {crawlStatus === "running" && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Config */}
          {/* <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Crawl Configuration
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectData?.ignoreRobotsTxt && (
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                    Ignore Robots.txt
                  </span>
                )}
                {projectData?.followNofollow && (
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                    Follow Nofollow
                  </span>
                )}
                {projectData?.crawlSitemap && (
                  <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                    Crawl Sitemap
                  </span>
                )}
                {projectData?.allowSubdomains && (
                  <span className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">
                    Allow Subdomains
                  </span>
                )}
                {projectData?.checkExternalLinks && (
                  <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">
                    Check External Links
                  </span>
                )}
              </div>
            </div>
          </div> */}

          {/* Activity Log */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 sm:p-6 lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Activity Log
                {logs.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-purple-600/30 text-purple-300 rounded-full">
                    {logs.length}
                  </span>
                )}
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showLogs ? "Hide" : "Show"} Details
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-400">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-base font-medium">No activity yet</p>
                  <p className="text-sm mt-1">
                    Start crawling to see live updates
                  </p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm break-all">
                        {log.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {log.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {crawlStatus === "completed" && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02]">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
