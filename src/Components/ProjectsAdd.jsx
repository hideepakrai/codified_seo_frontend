import { useState } from "react";
import {
  ArrowLeft,
  Globe,
  Plus,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router";

export default function AddProjectForm(
  {
    //   onBack = () => {},
    //   onSave = () => {},
  }
) {
  const [formData, setFormData] = useState({
    url: "",
    ignoreRobotsTxt: false,
    followNofollow: false,
    includeNoindex: false,
    crawlSitemap: true,
    allowSubdomains: false,
    basicAuth: false,
    checkExternalLinks: false,
    archive: false,
    customUserAgent: false,
    customUserAgentText: "",
  });

  const [loading, setLoading] = useState(false);

  const [basicAuthData, setBasicAuthData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBasicAuthChange = (e) => {
    const { name, value } = e.target;
    setBasicAuthData({
      ...basicAuthData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const projectData = {
        ...formData,
        basicAuthCredentials: formData.basicAuth ? basicAuthData : null,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/project/add`,
        projectData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status == 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectName = () => {
    if (formData.projectName) return formData.projectName;
    if (formData.url) {
      try {
        const domain = new URL(formData.url).hostname;
        return domain.replace("www.", "");
      } catch {
        return "New Project";
      }
    }
    return "New Project";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={"/dashboard"}>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Add New Project
                </h1>
                <p className="text-gray-400">
                  Configure your website crawling settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 1
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-white/20 text-gray-400"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 ${
                currentStep >= 2 ? "bg-purple-600" : "bg-white/20"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 2
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-white/20 text-gray-400"
              }`}
            >
              2
            </div>
            <div
              className={`w-16 h-1 ${
                currentStep >= 3 ? "bg-purple-600" : "bg-white/20"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 3
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-white/20 text-gray-400"
              }`}
            >
              3
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Globe className="w-6 h-6 mr-3 text-purple-400" />
                      Project Details
                    </h2>
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="https://example.com"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Enter the complete URL of the website you want to crawl
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.url}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Crawl Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Crawl Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Settings className="w-6 h-6 mr-3 text-purple-400" />
                      Crawl Configuration
                    </h2>
                  </div>

                  {/* Basic Crawl Settings */}
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="ignoreRobotsTxt"
                        checked={formData.ignoreRobotsTxt}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Ignore Robots.txt
                        </label>
                        <p className="text-gray-400 text-sm">
                          Bypass robots.txt restrictions and crawl all pages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="followNofollow"
                        checked={formData.followNofollow}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Follow Nofollow Links
                        </label>
                        <p className="text-gray-400 text-sm">
                          Include links marked with rel="nofollow" in crawling
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="includeNoindex"
                        checked={formData.includeNoindex}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Include Noindex Pages
                        </label>
                        <p className="text-gray-400 text-sm">
                          Crawl pages with noindex directive
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="crawlSitemap"
                        checked={formData.crawlSitemap}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Crawl Sitemap
                        </label>
                        <p className="text-gray-400 text-sm">
                          Use XML sitemap for discovering pages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="allowSubdomains"
                        checked={formData.allowSubdomains}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Allow Subdomains
                        </label>
                        <p className="text-gray-400 text-sm">
                          Include subdomains in the crawl process
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="checkExternalLinks"
                        checked={formData.checkExternalLinks}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Check External Links
                        </label>
                        <p className="text-gray-400 text-sm">
                          Verify external links for broken URLs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-black/20 rounded-xl">
                      <input
                        type="checkbox"
                        name="archive"
                        checked={formData.archive}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Archive Crawled Data
                        </label>
                        <p className="text-gray-400 text-sm">
                          Store historical crawl data for comparison
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 text-gray-300 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Next: Advanced Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Advanced Settings */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-purple-400" />
                      Advanced Settings
                    </h2>
                  </div>

                  {/* Basic Authentication */}
                  <div className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-start space-x-4 mb-4">
                      <input
                        type="checkbox"
                        name="basicAuth"
                        checked={formData.basicAuth}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Basic Authentication
                        </label>
                        <p className="text-gray-400 text-sm">
                          Provide credentials for password-protected sites
                        </p>
                      </div>
                    </div>

                    {formData.basicAuth && (
                      <div className="grid md:grid-cols-2 gap-4 mt-4 pl-9">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={basicAuthData.username}
                            onChange={handleBasicAuthChange}
                            className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={basicAuthData.password}
                              onChange={handleBasicAuthChange}
                              className="w-full px-3 py-2 pr-10 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom User Agent */}
                  <div className="p-4 bg-black/20 rounded-xl">
                    <div className="flex items-start space-x-4 mb-4">
                      <input
                        type="checkbox"
                        name="customUserAgent"
                        checked={formData.customUserAgent}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-purple-600 bg-black/30 border-white/20 rounded focus:ring-purple-500"
                      />
                      <div>
                        <label className="text-white font-medium">
                          Custom User Agent
                        </label>
                        <p className="text-gray-400 text-sm">
                          Override the default crawler user agent string
                        </p>
                      </div>
                    </div>

                    {formData.customUserAgent && (
                      <div className="mt-4 pl-9">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          User Agent String
                        </label>
                        <input
                          type="text"
                          name="customUserAgentText"
                          value={formData.customUserAgentText}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Mozilla/5.0 (compatible; SEOBot/1.0; +http://example.com/bot)"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 text-gray-300 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                    <button
                      disabled={loading}
                      onClick={handleSubmit}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Create Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Project Preview
              </h3>

              <div className="space-y-4">
                {formData.url && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Website URL
                    </div>
                    <div className="text-purple-300 text-sm break-all">
                      {formData.url}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-400 mb-2">
                    Active Features
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.ignoreRobotsTxt && (
                      <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-md text-xs">
                        Ignore Robots.txt
                      </span>
                    )}
                    {formData.followNofollow && (
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md text-xs">
                        Follow Nofollow
                      </span>
                    )}
                    {formData.includeNoindex && (
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded-md text-xs">
                        Include Noindex
                      </span>
                    )}
                    {formData.crawlSitemap && (
                      <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-md text-xs">
                        Crawl Sitemap
                      </span>
                    )}
                    {formData.allowSubdomains && (
                      <span className="px-2 py-1 bg-pink-600/20 text-pink-300 rounded-md text-xs">
                        Allow Subdomains
                      </span>
                    )}
                    {formData.checkExternalLinks && (
                      <span className="px-2 py-1 bg-orange-600/20 text-orange-300 rounded-md text-xs">
                        Check External
                      </span>
                    )}
                    {formData.archive && (
                      <span className="px-2 py-1 bg-teal-600/20 text-teal-300 rounded-md text-xs">
                        Archive Data
                      </span>
                    )}
                    {formData.basicAuth && (
                      <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded-md text-xs">
                        Basic Auth
                      </span>
                    )}
                    {formData.customUserAgent && (
                      <span className="px-2 py-1 bg-indigo-600/20 text-indigo-300 rounded-md text-xs">
                        Custom UA
                      </span>
                    )}
                  </div>
                  {!Object.values(formData).some((val) => val === true) && (
                    <div className="text-gray-500 text-sm italic">
                      No features selected yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
