import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = ({ isMobile = false, onCloseMobile, isMiddle = false }) => {
  // == GENERALS ==
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, filteredResults } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef(null);

  // == CLICK OUTSIDE DETECTION ==
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event) => {
      const target = event.target;

      // Safe guard against dynamic unmounting elements
      if (target && !target.isConnected) return;

      // Closes ONLY this instance if the click occurs outside its container boundaries
      if (elementRef.current && !elementRef.current.contains(target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // == HANDLERS ==
  const handleSelect = (userId) => {
    navigate(`/user/${userId}`);
    setIsFocused(false);
    setSearchQuery("");
    if (onCloseMobile) onCloseMobile();
  };

  const renderResultsList = () => (
    <div className="w-100">
      <div
        className="text-muted text-uppercase fw-bold px-2 mb-2"
        style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
      >
        Creators Found ({filteredResults.length})
      </div>
      <div className="d-flex flex-column gap-1">
        {filteredResults.length > 0 ? (
          filteredResults.map((user) => (
            <button
              key={user.id}
              type="button"
              className={`btn btn-link text-decoration-none d-flex align-items-center  ${isMiddle ? "py-2 px-0 gap-1" : "p-2 gap-3"} rounded-3 text-start w-100 text-dark border-0 search-result-row`}
              style={{ backgroundColor: "transparent" }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(user.id);
              }}
            >
              <img
                src={
                  user.profile_image && typeof user.profile_image === "string"
                    ? user.profile_image
                    : "https://placehold.co/100"
                }
                alt={user.name}
                className="rounded-circle border object-fit-cover"
                style={{ width: "30px", height: "30px" }}
              />
              <div className="overflow-hidden">
                <div className="fw-bold text-dark text-truncate small m-0">
                  {user.name}
                </div>
                <div
                  className="text-muted text-truncate"
                  style={{ fontSize: "0.75rem" }}
                >
                  @{user.username}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-4 text-muted small">
            <i className="bi bi-person-exclamation d-block fs-4 mb-1 opacity-50"></i>
            No creators match your query
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="d-flex flex-column w-100 h-100">
        <div className="d-flex align-items-center gap-2 p-3 border-bottom bg-white">
          <button
            type="button"
            className="btn p-1 border-0 text-dark "
            onClick={onCloseMobile}
          >
            <i className="bi bi-arrow-left fs-4"></i>
          </button>
          <div className="input-group align-items-center bg-light border rounded-3 px-3 flex-grow-1">
            <span className="text-muted pe-2">
              <i className="bi bi-search fs-6"></i>
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-0 py-2 shadow-none text-dark"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ fontSize: "0.95rem" }}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn p-0 border-0 text-muted"
                onClick={() => setSearchQuery("")}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>
        </div>

        {searchQuery.trim().length > 0 && (
          <div className="flex-grow-1 p-3 overflow-y-auto bg-white">
            {renderResultsList()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={elementRef} className="position-relative w-100 mb-2">
      <div className="aside-search-box rounded-3 p-2 mb-2 bg-light border">
        <div className="input-group align-items-center">
          <span
            className={`input-group-text bg-transparent border-0  ${isMiddle ? "ps-1 pe-2 " : "ps-3 pe-2"} text-muted`}
          >
            <i className="bi bi-search fs-6"></i>
          </span>
          <input
            type="text"
            className="form-control bg-transparent border-0 py-2 pe-3 text-dark shadow-none"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            style={{ fontSize: "0.95rem" }}
          />
        </div>
      </div>

      {isFocused && searchQuery.trim().length > 0 && (
        <div
          className="position-absolute bg-white border p-2 shadow-sm rounded-3 mt-2 w-100 search-results-dropdown custom-scrollbar"
          style={{ zIndex: 100, maxHeight: "320px", overflowY: "auto" }}
        >
          {renderResultsList()}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
