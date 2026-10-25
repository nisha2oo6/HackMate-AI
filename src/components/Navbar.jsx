
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="site-header">
      <div className="navbar">
        {/* Brand and logo */}
        <Link to="/" className="brand">
          <div className="brand-logo">H</div>

          <div className="brand-text">
            <span className="brand-name">HackMate AI</span>
            <span className="brand-tagline">
              Find your people. Build your ideas.
            </span>
          </div>
        </Link>

        {/* Main navigation */}
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/about">
            About Us
          </NavLink>
        </nav>

        {/* Login */}
        <Link to="/login">Login</Link>
      </div>
    </header>
  );
}

export default Navbar;
