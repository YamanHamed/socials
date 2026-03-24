import React, { useEffect, useState } from "react";
import userImage from "../imgs/Unknown_person.jpg";
import { getUser, getUserPosts } from "../components/Auth";
import { AddPost, Post, SearchBar } from "./Home1";
import { useNavigate, useParams } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { useColors } from "../components/ColorsContext";
import LoadingSpin from "../components/LoadingSpin";
const Profile1 = ({ User, isMainUserProfile }) => {
  const mainUser = JSON.parse(localStorage.getItem("user"));
  const [userPosts, setUserPosts] = useState([]);
  const colors = useColors();
  const [user, setUser] = useState({});
  const [profileRequestInfo, setProfileRequestInfo] = useState({
    status: "initial",
    message: "",
  });
  const [PostsRequestInfo, setPostsRequestInfo] = useState({
    status: "initial",
    message: "",
  });
  console.log(user);

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mainUser) {
      navigate("/login");
    }
  }, [mainUser]);

  async function fetchUserInfo() {
    if (userId === "undefined") return;
    setProfileRequestInfo({
      status: "loading",
      message: "",
    });
    const response = await getUser(userId);
    if (response.success) {
      setUser(response.data.data);
      setProfileRequestInfo({
        status: "success",
        message: "success",
      });
    } else {
      console.log(response.error);
      setProfileRequestInfo({
        status: "failure",
        message: "FAILED TO LOAD THE PROFILE, REFRESH AND TRY AGAIN",
      });
      //todo:  handle Eror
    }
  }
  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  async function fetchUserPosts() {
    if (userId === "undefined") return;
    setPostsRequestInfo({
      status: "loading",
      message: "",
    });
    const response = await getUserPosts(userId);
    if (response.success) {
      setUserPosts(response.data.data);
      setPostsRequestInfo({
        status: "success",
        message: "success",
      });
    } else {
      console.log(response.error);
      setPostsRequestInfo({
        status: "failure",
        message: "FAILED TO LOAD THE PROFILE POSTS, REFRESH AND TRY AGAIN",
      });
      //todo:  handle Eror
    }
  }
  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SideBar />

      <div
        style={{
          flex: 1,
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100vh",
          backgroundColor: "rgb(247, 247, 247)",
        }}
      >
        <SearchBar />

        {userId && profileRequestInfo.status === "loading" && <LoadingSpin />}
        {userId === "undefined" && (
          <h1 className="m-auto"> User Doesn't Exist </h1>
        )}

        {PostsRequestInfo.status === "failure" && (
          <div className="alert alert-danger m-3" role="alert">
            {PostsRequestInfo.message}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => {
                fetchUserInfo();
                fetchUserPosts();
              }}
            >
              Retry
            </button>
          </div>
        )}
        {profileRequestInfo.status === "success" && (
          <main
            style={{
              height: "100%",
              overflowY: "auto",
              // backgroundColor: "white",
            }}
            // className="col-12 col-md-6 col-lg-7 main-content "
          >
            <div
              style={{
                backgroundColor: colors.mainColor,
                width: "100%",
                height: "250px",
              }}
            />

            <div className="p-3" id="profile">
              {user && (
                <>
                  <div className="toggle-flex-dir px-4 profile-details-container  mb-4">
                    <div style={{}}>
                      <img src={userImage} alt="" className="profile-img" />
                      <h1 className="profile-name ms-2">{user?.name}</h1>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                      className="profile-details"
                    >
                      <p className="">
                        <i
                          className="bi bi-chat-fill"
                          style={{ marginRight: "8px" }}
                        />
                        {"@" + user?.username}
                      </p>
                      <p className="">
                        <i
                          className="bi bi-envelope-at-fill"
                          style={{ marginRight: "8px" }}
                        />

                        {
                          // prettier-ignore
                          user?.email && user?.email
                        }
                        {!user?.email && "myemail@gmail.com"}
                      </p>
                      <p className="">
                        <i
                          className="bi bi-telephone-fill"
                          style={{ marginRight: "8px" }}
                        />
                        +77 999 345 22
                      </p>
                    </div>
                  </div>

                  {Number(mainUser.id) === Number(userId) && <AddPost />}
                  <div>
                    {userPosts.map((post) => {
                      return (
                        <Post
                          userName={user.username}
                          userId={userId}
                          key={userId}
                          userImage={user.profile_image}
                          postBody={post.body}
                          postImage={post.image}
                          postId={post.id}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Profile1;
