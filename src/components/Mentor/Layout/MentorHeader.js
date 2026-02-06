import React from "react";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="ta-header">
      <div className="d-flex align-items-center gap-3">
        <FaBars className="ta-header-icon" />

        <div className="ta-search-box">
          <FaSearch />
          <input placeholder="Search..." />
        </div>
      </div>

      <div className="ta-notification">
        <FaBell />
        <span className="ta-badge">3</span>
      </div>
    </header>
  );
};

export default Header;
