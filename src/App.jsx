
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import GetStarted from "./pages/GetStarted";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/get-started" element={<GetStarted />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
