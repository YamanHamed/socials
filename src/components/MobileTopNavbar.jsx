import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";

const MobileTopNavbar = () => {
  // == GENERALS ==
  const location = useLocation();
  const currentPath = location.pathname;
  const { logoutUser } = useAuth();
  const { openModal } = useModal();

  // == STATES ==
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const myProfileId = loggedInUser?.id || "1";
  const isHomeActive = currentPath === "/";
  const isProfileActive = currentPath.startsWith(`/user/${myProfileId}`);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // == HANDLERS ==
  const handleLogoutTrigger = () => {
    openModal({
      title: "Confirm Logout",
      content:
        "Are you sure you want to log out? You will need to re-enter your credentials to sign back into your account.",
      confirmText: "Logout",
      confirmVariant: "gradient",
      onConfirm: () => {
        logoutUser();
      },
    });
  };

  return (
    <>
      {/* == TOP NAV BAR BOX == */}
      <nav
        className="d-md-none fixed-top bg-white border-bottom px-3 d-flex align-items-center justify-content-between"
        style={{ height: "58px", zIndex: 1030, margin: 0 }}
      >
        {/* == LOGO == */}
        <span className="text-fancy-color fs-5" style={{ fontWeight: "800" }}>
          Socials
        </span>
        {/* == ACTIONS == */}
        <div className="d-flex align-items-center gap-1">
          {/* == SEARCH BUTTON == */}
          <button
            type="button"
            className={`btn mobile-nav-icon-btn ${showMobileSearch ? "active" : ""}`}
            onClick={() => {
              setShowMobileSearch((prevState) => !prevState);
              setShowMobileMenu(false); // Close menu if search is opened
            }}
          >
            <i className="bi bi-search"></i>
          </button>

          {/* == MENU TOGGLE BUTTON == */}
          <button
            type="button"
            className={`btn mobile-nav-icon-btn ${showMobileMenu ? "active" : ""}`}
            onClick={() => {
              setShowMobileMenu((prevState) => !prevState);
              setShowMobileSearch(false); // Close search overlay if menu is toggled
            }}
          >
            <i
              className={`bi ${showMobileMenu ? "bi-x-lg " : "bi-list"} fs-4`}
            ></i>
          </button>
        </div>
      </nav>

      {/* == MOBILE MENU == */}
      {showMobileMenu && (
        <div
          className="d-flex justify-content-between flex-column position-fixed end-0 bg-white border-start border-bottom shadow animate-fade-in"
          style={{
            marginTop: 0,
            top: "58px",
            zIndex: 1040,
            height: "calc(100vh - 58px)",
          }}
        >
          {/* == LINKS == */}
          <div className="d-flex flex-column p-2 gap-1">
            {/* == HOME == */}
            <Link
              onClick={() => setShowMobileMenu(false)}
              to="/"
              className={`btn d-flex align-items-center gap-2 text-start px-3 py-3 border-0 ${
                isHomeActive
                  ? "bg-light side-list-item-active fw-bold"
                  : "text-secondary"
              }`}
              style={{ borderRadius: "8px" }}
            >
              <i
                className={`bi ${isHomeActive ? "bi-house-door-fill active" : "bi-house-door"} fs-5`}
              ></i>
              <span style={{ fontSize: "0.95rem" }}>Home Feed</span>
            </Link>

            {/*  == PROFILE == */}
            <Link
              to={`/user/${myProfileId}`}
              className={`btn d-flex align-items-center gap-2 text-start px-3 py-3 border-0 ${
                isProfileActive
                  ? "bg-light  side-list-item-active fw-bold"
                  : "text-secondary"
              }`}
              style={{ borderRadius: "8px" }}
              onClick={() => setShowMobileMenu(false)}
            >
              <i
                className={`bi ${isProfileActive ? "bi-person-fill" : "bi-person"} fs-5`}
              ></i>
              <span style={{ fontSize: "0.95rem" }}>My Profile</span>
            </Link>
          </div>
          {/* == LOGOUT == */}
          <div>
            <hr className="my-1 opacity-10" />
            <button
              type="button"
              className="btn active-scale side-list-item-active d-flex align-items-center gap-2 text-start p-4 border-0 w-100"
              style={{ borderRadius: "8px" }}
              onClick={handleLogoutTrigger}
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
              <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                Logout
              </span>
            </button>
          </div>
        </div>
      )}

      {/* == MOBILE SEARCH == */}
      {showMobileSearch && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-white animate-fade-in"
          style={{ zIndex: 1040, marginTop: "58px" }}
        >
          <SearchBar
            isMobile={true}
            onCloseMobile={() => setShowMobileSearch(false)}
          />
        </div>
      )}
    </>
  );
};

export default MobileTopNavbar;
