
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
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import FindTeammates from "./pages/FindTeammates";
import CreateTeam from "./pages/CreateTeam";
import StudentPublicProfile from "./pages/StudentPublicProfile";
import MyTeams from "./pages/MyTeams";
import TeamDetails from "./pages/TeamDetails";
import Invitations from "./pages/Invitations";
import MyProjects from "./pages/MyProjects";
import Achievements from "./pages/Achievements";
import Connections from "./pages/Connections";
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
          <Route path="/create-team" element={<CreateTeam />} />
          <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
          <Route
  path="/dashboard"
  element={<StudentDashboard />}
/>
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/teams" element={<MyTeams />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/student/:id" element={<StudentPublicProfile />} />
        <Route
  path="/find-teammates"
  element={<FindTeammates />}
/>
    <Route path="/connections" element={<Connections />} />
    <Route path="/teams/:id" element={<TeamDetails />} />
    <Route path="/invitations" element={<Invitations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
