import { createContext, useContext, useEffect, useState } from "react";

const toggleSideBarContext = createContext();

const ToggleSideBarProvider = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  console.log(`isSideBarOpen:  ${isSideBarOpen}`);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile, open on desktop
      if (mobile) {
        setIsSideBarOpen(false);
      } else {
        setIsSideBarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <toggleSideBarContext.Provider
      value={{ isMobile, isSideBarOpen, setIsSideBarOpen }}
    >
      {children}
    </toggleSideBarContext.Provider>
  );
};

const useToggleSideBar = () => {
  const context = useContext(toggleSideBarContext);

  if (context === undefined) {
    throw new Error(
      "useToggleSideBar must be used within a ToggleSideBarProvider ",
    );
  }

  return context;
};

export { ToggleSideBarProvider, useToggleSideBar };
