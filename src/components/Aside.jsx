import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "./HomePage.css";

const Aside = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {};

  return (
    <div className="d-flex">
      {/* Toggle Button for mobile */}
      <button
        className="btn btn-primary d-md-none m-2 position-fixed"
        onClick={toggleSidebar}
        style={{ zIndex: 1050 }}
      >
        ☰ Menu
      </button>

      {/* Sidebar using Bootstrap Offcanvas */}
      <div
        className="offcanvas offcanvas-start show"
        tabIndex="-1"
        id="sidebarMenu"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        style={{ width: "250px", position: "relative" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            type="button"
            className="btn-close d-md-none"
            onClick={toggleSidebar}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <nav className="nav flex-column">
            <a className="nav-link active" href="#">
              <span className="me-2">🏠</span> Home
            </a>
            <a className="nav-link" href="#">
              <span className="me-2">👤</span> Profile
            </a>
            <a className="nav-link" href="#">
              <span className="me-2">⚙️</span> Settings
            </a>
            <a className="nav-link" href="#">
              <span className="me-2">💬</span> Messages
            </a>
            <a className="nav-link" href="#">
              <span className="me-2">📊</span> Analytics
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h1>Main Content</h1>
        <p>Your main content goes here...</p>
      </div>
    </div>
  );
};

export default Aside;
