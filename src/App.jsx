import { Outlet } from "react-router";
import { Navbar } from "./Components/Navbar";
import SEOLandingPage from "./Components/SEOLandingPage";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
