
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mission from "./pages/Mission";
import HowItWorks from "./pages/HowItWorks";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import "./index.css";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/about/mission" element={<Mission />} />
          <Route path="/about/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
