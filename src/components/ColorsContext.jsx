import { createContext, useContext } from "react";

const colorContext = createContext({});

const ColorProvider = ({ children }) => {
  const colors = {
    primary: "#6A89A7",
    secondary: "#BDDDFC",
    accent: "#88BDF2",
    neutral: "#384959",
    mainColor: "#384959",
  };

  return (
    <colorContext.Provider value={colors}>{children}</colorContext.Provider>
  );
};

const useColors = () => {
  const context = useContext(colorContext);

  if (context === undefined) {
    throw new Error("useColors must be used within a ColorProvider");
  }

  return context;
};

export { ColorProvider, useColors };
