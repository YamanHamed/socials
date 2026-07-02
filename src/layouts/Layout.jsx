import { Outlet } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MobileTopNavbar from "../components/MobileTopNavbar";
import { SearchProvider } from "../contexts/SearchContext";
import SideBar from "../components/SideBar";

function Layout({ children }) {
  return (
    <SearchProvider>
      <div className="min-vh-100 bg-light text-dark font-sans antialiased">
        <div className="container-xl">
          <div className="row g-4 pt-4">
            {/* ==================== 1. LEFT SIDEBAR ==================== */}
            <SideBar />

            {/* ==================== 2. TOP MOBILE NAVBAR ==================== */}
            <MobileTopNavbar />

            {/* ==================== 3. MAIN COLUMN ==================== */}
            <main className="main-feed-container col-12 col-md-9 col-lg-6 pb-5">
              <Outlet />
            </main>

            {/* ==================== 4. RIGHT SIDEBAR ==================== */}
            <aside
              className="d-none d-lg-block col-lg-3 position-sticky"
              style={{ top: "1.5rem", height: "fit-content" }}
            >
              {/*  SECTION 2: SEARCH BAR  */}
              <SearchBar />

              {/* SECTION 2: GLOBAL TRENDING TRACKER */}
              <div className="trending-blob-card bg-white rounded-3 border p-4 shadow-sm mb-4">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <span>⚡</span> Global Pulse
                </h5>
                <p className="text-muted small mb-4">
                  What developers are discussing across the network right now.
                </p>

                <div className="d-flex flex-column gap-3">
                  {/* Trend Item 1 */}
                  <div className="p-2.5 rounded-3 hover-bg-light transition-all cursor-pointer">
                    <div className="text-muted small fw-medium">
                      Trending in Tech
                    </div>
                    <div className="fw-bold text-app-primary">#reactjs</div>
                    <small className="text-muted">2.4k updates shared</small>
                  </div>

                  {/* Trend Item 2 */}
                  <div className="p-2.5 rounded-3 hover-bg-light transition-all cursor-pointer">
                    <div className="text-muted small fw-medium">
                      Design & Layout
                    </div>
                    <div className="fw-bold text-app-primary">#bootstrap5</div>
                    <small className="text-muted">1.8k updates shared</small>
                  </div>

                  {/* Trend Item 3 */}
                  <div className="p-2.5 rounded-3 hover-bg-light transition-all cursor-pointer">
                    <div className="text-muted small fw-medium">
                      Backend Engineering
                    </div>
                    <div className="fw-bold text-app-primary">#mongodb</div>
                    <small className="text-muted">950 posts today</small>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default Layout;
