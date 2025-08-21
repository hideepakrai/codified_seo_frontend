import { Outlet } from "react-router";
import { Navbar } from "./Components/Navbar";
import SEOLandingPage from "./Components/SEOLandingPage";
import { useAuth } from "./context/AuthContext";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
