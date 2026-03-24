import { useNavigate } from "react-router-dom";
import { useColors } from "./ColorsContext";
import defUserImage from "../imgs/Unknown_person.jpg";
import { useToggleSideBar } from "./toggleSideBarContext";
import { logOut } from "./Auth";

export const SideBar = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const user = JSON.parse(localStorage.getItem("user"));

  const { isMobile, isSideBarOpen, setIsSideBarOpen } = useToggleSideBar();

  return (
    <aside
      className={`d-flex flex-column p-3 side-bar  ${isMobile ? "mobile" : ""}  ${isSideBarOpen ? "open" : "closed"} `}
    >
      <div className="sidebar-content py-3 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-5 mt-4 mx-3">
          <h3 className="m-0 logo">Socials</h3>
        </div>
        <ul
          className="nav flex-column"
          style={{ gap: "4px", color: colors.mainColor }}
        >
          <li
            onClick={() => {
              setIsSideBarOpen((prev) => !prev);
              navigate("/");
            }}
            className="nav-item p-3 py-3 sidebar-item "
          >
            <i className="bi bi-house" style={{ fontSize: "1.2rem" }}></i>
            <span>Home</span>
          </li>

          <li
            onClick={() => {
              setIsSideBarOpen((prev) => !prev);
              navigate(`/profile1/${user?.id}`);
            }}
            className="nav-item p-3 py-3 sidebar-item "
          >
            <i
              className="bi bi-person-circle"
              style={{ fontSize: "1.2rem" }}
            ></i>
            <span>Profile</span>
          </li>
        </ul>
      </div>

      <div
        style={{
          borderTop: `1px solid ${colors.secondary}`,
          paddingTop: "16px",
        }}
        className="mt-auto"
      >
        <div
          className="d-flex align-items-center p-2"
          style={{
            borderRadius: "10px",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={async () => {
            await logOut();
            navigate(`/login`);
          }}
        >
          <img
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              objectFit: "cover",
              marginRight: "12px",
            }}
            src={defUserImage}
            alt="User avatar"
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "0.95rem",
                color: colors.neutral,
              }}
            >
              {user?.name || "User"}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
              onClick={() => {
                // Add your logout logic here
                console.log("Logging out...");
              }}
            >
              <i
                className="bi bi-box-arrow-right"
                style={{
                  fontSize: "0.8rem",
                  color: colors.primary,
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: colors.primary,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.danger || "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.primary;
                }}
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
{
  /* 
      
    <aside
      style={{
        backgroundColor: colors.mainColor, // #384959
        cursor: "pointer",
        fontWeight: 500,
        height: "100vh",
        width: "280px",
        flexShrink: 0,
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
        borderRight: `1px solid ${colors.secondary}20`, // Subtle border with transparency
      }}
      className="d-flex flex-column p-3"
    >
      <div className="sidebar-content py-3 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-5 mt-4 mx-3">
          <h3 className="m-0 logo" style={{ color: "white" }}>
            Socials
          </h3>
        </div>
        <ul className="nav flex-column" style={{ gap: "4px" }}>
          <li
            onClick={() => navigate("/Home1")}
            className="nav-item p-3 py-3 sidebar-item"
            style={{
              color: "#e0e0e0",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#e0e0e0";
            }}
          >
            <i className="bi bi-house" style={{ fontSize: "1.2rem" }}></i>
            <span>Home</span>
          </li>

          <li
            onClick={() => {
              navigate(`/profile1/${user?.id}`);
            }}
            className="nav-item p-3 py-3 sidebar-item"
            style={{
              color: "#e0e0e0",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#e0e0e0";
            }}
          >
            <i
              className="bi bi-person-circle"
              style={{ fontSize: "1.2rem" }}
            ></i>
            <span>Profile</span>
          </li>
        </ul>
      </div>

     
      <div
        style={{
          borderTop: `1px solid ${colors.secondary}40`, // Lighter border with transparency
          paddingTop: "16px",
        }}
        className="mt-auto"
      >
        <div
          className="d-flex align-items-center p-2"
          style={{
            borderRadius: "10px",
            transition: "all 0.2s ease",
            cursor: "pointer",
            backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle white overlay
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
          onClick={() => navigate(`/profile1/${user?.id}`)}
        >
          <img
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              objectFit: "cover",
              marginRight: "12px",
              border: `2px solid ${colors.accent}`, // Add accent border to avatar
            }}
            src={defUserImage}
            alt="User avatar"
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "white", // White text for contrast
              }}
            >
              {user?.name || "User"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: colors.secondary, // Use secondary color for subtle text
              }}
            >
              View Profile
            </p>
          </div>
        </div>
      </div>
    </aside> 
    */
}
