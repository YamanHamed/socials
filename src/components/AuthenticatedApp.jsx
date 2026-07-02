import { useAuth } from "../contexts/AuthContext";

const AuthenticatedApp = ({ children }) => {
  const { user } = useAuth();

  return <div key={user?.id || "guest"}>{children}</div>;
};
export default AuthenticatedApp;
