import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router";
import SEOLandingPage from "./Components/SEOLandingPage";
import AuthPage from "./Components/AuthenticationForm";
import SEODashboard from "./Components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "./Components/ProtectedRoutes";
import AddProjectForm from "./Components/ProjectsAdd";
import CrawlComponent from "./Components/Crawl";
import CrawlSummary from "./Components/Issuepage";
import IssueView from "./Components/IssueView";
import IssueDetails from "./Components/Singleissue";
import { ProjectDashboard } from "./Components/ProjectDashboard";
import { Export } from "./Components/Export";
import { SEOPageDetails } from "./Components/PageDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SEOLandingPage /> },
      {
        path: "signin",
        element: <AuthPage />,
      },
      {
        path: "signup",
        element: <AuthPage />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            <SEODashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/addproject",
        element: (
          <ProtectedRoutes>
            <AddProjectForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/crawl",
        element: (
          <ProtectedRoutes>
            <CrawlComponent />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/crawl/:id",
        element: (
          <ProtectedRoutes>
            <CrawlSummary />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/issues/view",
        element: (
          <ProtectedRoutes>
            <IssueView />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/resources",
        element: (
          <ProtectedRoutes>
            <IssueDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/projectdashboard/:id",
        element: (
          <ProtectedRoutes>
            <ProjectDashboard />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/export/:id",
        element: (
          <ProtectedRoutes>
            <Export />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/pagedetails/:id",
        element: (
          <ProtectedRoutes>
            <SEOPageDetails />
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
