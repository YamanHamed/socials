import { createContext, useState } from "react";

//=======================
export const logContext = createContext(null);

//========================
export const logBtnAndModalContext = createContext(null);

export const LogBtnAndModalProvider = ({ children }) => {
  const [logType, setLogType] = useState("logIn");

  function handleLogFirstClick(type) {
    setLogType(type);
  }
  return (
    <logBtnAndModalContext.Provider value={{ handleLogFirstClick, logType }}>
      {children}
    </logBtnAndModalContext.Provider>
  );
};
