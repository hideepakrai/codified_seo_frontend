import { useState } from "react";
import {
  Search,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { Link } from "react-router";

export default function SEOLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Smart URL Crawling",
      description:
        "Advanced crawling with robots.txt handling and sitemap integration",
      details: [
        "Ignore robots.txt when needed",
        "Follow or respect nofollow links",
        "Include noindex pages in analysis",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Comprehensive Analysis",
      description:
        "Deep site analysis with subdomain support and external link checking",
      details: [
        "Allow subdomain crawling",
        "Check external link health",
        "Basic authentication support",
      ],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Custom Configuration",
      description:
        "Tailor crawling behavior with custom user agents and archiving",
      details: [
        "Custom user agent strings",
        "Archive crawled data",
        "Flexible crawling parameters",
      ],
    },
  ];

  const stats = [
    { number: "Advanced", label: "Crawling Engine" },
    { number: "Real-time", label: "Analysis" },
    { number: "Custom", label: "Configuration" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              SEO Solutions
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Redefined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Advanced website crawling and SEO analysis with intelligent
              configuration options. Boost your search rankings with
              precision-engineered tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to={"/dashboard"}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                <button className="cursor-pointer">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all backdrop-blur-xl">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Crawling Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Configure every aspect of your website crawl with granular control
              over robots.txt, sitemaps, and more.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                    activeFeature === index
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-2xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl ${
                        activeFeature === index
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : "bg-white/10"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      {activeFeature === index && (
                        <ul className="space-y-2">
                          {feature.details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-purple-300"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-purple-400" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Visualization */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-300">Ignore Robots.txt</span>
                    <div className="w-12 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-300">Follow Nofollow</span>
                    <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-300">Crawl Sitemap</span>
                    <div className="w-12 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-300">Allow Subdomains</span>
                    <div className="w-12 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Optimize Your Website?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Start optimizing your website today with our powerful SEO crawling
            solution.
          </p>
          <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl">
            Get Started Today
            <ArrowRight className="w-6 h-6 ml-3 inline-block group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Search className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                Codified SEO
              </span>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Support
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Codified SEO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
