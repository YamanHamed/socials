import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LogIn.jsx";
import Layout from "./layouts/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { PostProvider } from "./contexts/PostContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { ProfileProvider } from "./contexts/ProfileContext.jsx";
import AuthenticatedApp from "./components/AuthenticatedApp.jsx";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AuthenticatedApp>
              <ProfileProvider>
                <PostProvider>
                  <ModalProvider>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/" element={<Layout />}>
                        <Route element={<ProtectedRoute />}>
                          <Route index element={<HomePage />} />
                          <Route path="home" element={<HomePage />} />
                          <Route
                            path="user/:userId"
                            element={
                              <ProfilePage
                                user={localStorage.getItem("user")}
                              />
                            }
                          />
                          <Route path="posts/:id" element={<PostDetails />} />
                        </Route>
                      </Route>
                    </Routes>
                  </ModalProvider>{" "}
                </PostProvider>{" "}
              </ProfileProvider>
            </AuthenticatedApp>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </div>
  );
}
