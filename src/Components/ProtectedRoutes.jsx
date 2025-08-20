import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  console.log(user);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to={"/signin"} />;
  }

  return children;
};
