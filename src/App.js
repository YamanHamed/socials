import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import {} from "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { logContext } from "./components/AuthContext";

import { PostsProvider } from "./components/PostsContext.jsx";
import { ColorProvider } from "./components/ColorsContext.jsx";
import LoginPage from "./pages/LogIn.jsx";
import Home1 from "./pages/Home1.jsx";
import { UsersProvider } from "./components/UsersContext.js";
import PostDetails1 from "./pages/PostDetails1.jsx";
import Profile1 from "./pages/Profile1.jsx";
import { ToggleSideBarProvider } from "./components/toggleSideBarContext.js";
export default function App() {
  const token = localStorage.getItem("token");
  const isloggedin = !(token === undefined || token === null);
  const [loggedIn, setLoggedIn] = useState(isloggedin);

  return (
    <div className="App">
      <ColorProvider>
        <logContext.Provider value={[loggedIn, setLoggedIn]}>
          <PostsProvider>
            <UsersProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/home1"
                  element={
                    <ToggleSideBarProvider>
                      {" "}
                      <Home1 />
                    </ToggleSideBarProvider>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <ToggleSideBarProvider>
                      {" "}
                      <Home1 />
                    </ToggleSideBarProvider>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ToggleSideBarProvider>
                      {" "}
                      <Home1 />
                    </ToggleSideBarProvider>
                  }
                />
                <Route
                  path="/posts/:postId"
                  element={
                    <ToggleSideBarProvider>
                      {" "}
                      <PostDetails1 />
                    </ToggleSideBarProvider>
                  }
                />
                <Route
                  path="/profile1/:userId"
                  element={
                    <ToggleSideBarProvider>
                      <Profile1 />
                    </ToggleSideBarProvider>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ToggleSideBarProvider>
                      <Profile1 />
                    </ToggleSideBarProvider>
                  }
                />
              </Routes>
            </UsersProvider>
          </PostsProvider>
        </logContext.Provider>
      </ColorProvider>
    </div>
  );
}
