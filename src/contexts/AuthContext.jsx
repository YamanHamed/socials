import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import * as api from "../api/reqs"; // Hooks directly into your uploaded Auth.js file

// 1. Establish the Authentication Context Pipeline
const AuthContext = createContext(null);

// Helper function to safely fetch initial state from browser storage on app startup
const getInitialAuthState = () => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");

  return {
    user: userJson ? JSON.parse(userJson) : null,
    token: token || null,
    isAuthLoading: false,
    authError: null,
  };
};

// 2. THE AUTH BRAIN: Centralized Pure State Machine
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isAuthLoading: true,
        authError: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        authError: null,
      };

    case "AUTH_FAIL":
      return {
        ...state,
        isAuthLoading: false,
        user: null,
        token: null,
        authError: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        isAuthLoading: false,
        user: null,
        token: null,
        authError: null,
      };

    case "CLEAR_AUTH_ERROR":
      return {
        ...state,
        authError: null,
      };

    default:
      return state;
  }
};

// 3. THE PROVIDER: Wraps the application layout tree
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, null, getInitialAuthState);

  // Action: Log In Existing User
  const loginUser = async (username, password) => {
    dispatch({ type: "AUTH_START" });
    const result = await api.logIn(username, password);

    if (result.success) {
      // Synchronize the browser's persistent storage
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: result.data.user, token: result.data.token },
      });
      return { success: true };
    } else {
      dispatch({ type: "AUTH_FAIL", payload: result.error });
      return { success: false, error: result.error };
    }
  };

  // Action: Register New User Account
  const registerUser = async (username, password, name, email, userImage) => {
    dispatch({ type: "AUTH_START" });
    const result = await api.register(
      username,
      password,
      name,
      email,
      userImage,
    );

    if (result.success) {
      // Synchronize the browser's persistent storage
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: result.data.user, token: result.data.token },
      });
      return { success: true };
    } else {
      dispatch({ type: "AUTH_FAIL", payload: result.error });
      return { success: false, error: result.error };
    }
  };

  // Action: Terminate Session (Logout)
  const logoutUser = () => {
    // Clear out browser persistent storage entirely
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  // Administrative Housekeeping Utility
  const clearAuthError = useCallback(() => {
    dispatch({ type: "CLEAR_AUTH_ERROR" });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logoutUser,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook Consumer Helper
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be consumed strictly inside a matching <AuthProvider> wrapper layout.",
    );
  }
  return context;
};
