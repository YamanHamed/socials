import { Link, useLocation } from "react-router-dom";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const myProfileId = loggedInUser?.id || "1";
  const isHomeActive = currentPath === "/";
  const isProfileActive = currentPath.startsWith(`/user/${myProfileId}`);

  const { logoutUser } = useAuth();
  const { openModal } = useModal();

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
    <aside
      className="d-none d-md-block col-md-3 position-sticky"
      style={{ top: "1.5rem", height: "fit-content" }}
    >
      <div
        className="sidebar-blob-card bg-white rounded-3 border p-4 shadow-sm d-flex flex-column justify-content-between"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div>
          {/* Brand Logo */}
          <h4 className=" mb-4 px-2 ">
            <span
              className="text-fancy-color fs-3"
              style={{ fontWeight: "800" }}
            >
              Socials
            </span>
          </h4>

          {/* Main Navigation List */}
          <div className="list-group list-group-flush">
            {/* 🏠 TIMELINE FEED LINK */}
            <Link
              to="/"
              className={` rounded-3 border-0 mb-2 py-3 px-3 transition-all ${
                isHomeActive
                  ? "fw-bold side-list-item-active bg-light"
                  : "side-list-item"
              }`}
            >
              <i
                className={`bi me-3 fs-5 ${isHomeActive ? "bi-house-fill " : "bi-house"}`}
              ></i>
              Home
            </Link>

            {/* 👤 AUTHENTICATED PROFILE LINK */}
            <Link
              to={`/user/${myProfileId}`} // 🎯 Dynamic routing to the true current session viewer!
              className={` rounded-3 border-0 py-3 px-3 transition-all ${
                isProfileActive
                  ? "fw-bold side-list-item-active bg-light"
                  : "side-list-item"
              }`}
            >
              <i
                className={`bi me-3 fs-5 ${isProfileActive ? "bi-person-fill " : "bi-person"}`}
              ></i>
              Profile
            </Link>
          </div>
          <div className="mb-4 px-2  d-block d-lg-none mt-4">
            <SearchBar isMiddle={true} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogoutTrigger}
          className="btn-outlined list-group-item list-group-item-action rounded-3 py-2 px-4 transition-all mt-3"
          style={
            {
              // width: "fit-content",
            }
          }
        >
          <i className="bi bi-box-arrow-right me-3 fs-5"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
