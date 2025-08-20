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
