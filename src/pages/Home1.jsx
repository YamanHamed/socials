import React, { useMemo, useState, useCallback, useEffect } from "react";

import {} from "../App.css";
import { useColors } from "../components/ColorsContext";
import defUserImage from "../imgs/Unknown_person.jpg";
import { getValidImage, isValidImage, addPost } from "../components/Auth";
import { useUsers } from "../components/UsersContext";

import { useNavigate } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { usePosts } from "../components/PostsContext";
import LoadingSpin from "../components/LoadingSpin";
import { useToggleSideBar } from "../components/toggleSideBarContext";

const Home1 = () => {
  const colors = useColors();

  const navigate = useNavigate();

  const mainUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!mainUser) {
      navigate("/login");
    }
  }, [mainUser]);

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
          backgroundColor: " rgb(247 247 247)",
        }}
      >
        <SearchBar />
        <Homep />
      </div>
    </div>
  );
};

export default Home1;

const UserInSerach = ({ user }) => {
  return (
    <div style={{ borderRadius: "20px" }} className="d-flex p-2 ">
      <div style={{}} className=" ">
        <img
          className=""
          style={{
            maxWidth: "100%",
            width: "50px",
            borderRadius: "50%",
          }}
          src={getValidImage(user.profile_image, defUserImage)}
          onError={(e) => {
            e.target.src = defUserImage;
          }}
          alt=""
        />
      </div>
      <p className="ms-2 p-2">{user.username}</p>
    </div>
  );
};

export const AddPost = () => {
  const [postInfo, setPostInfo] = useState({
    image: null,
    title: "",
    body: "",
  });
  const [requestInfo, setRequestInfo] = useState({
    message: "no message",
    status: "initial",
  });
  const colors = useColors();
  const navigate = useNavigate();
  async function handlePostClick() {
    const response = await addPost(
      postInfo.title,
      postInfo.body,
      postInfo.image,
    );

    if (response.success) {
      setRequestInfo({
        message: "success",
        status: "success",
      });

      setTimeout(() => {
        navigate("/");
        console.log("using the navigation to a manual route");
      }, 500);
    }
    //TODO ( handle errors )
    else {
      setRequestInfo({
        message: response.error,
        status: "failure",
      });
    }
  }
  return (
    <div
      className="p-3"
      style={{
        width: "100%",
        backgroundColor: "white",
        // borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // todo: change color
        border: "1px solid #e5e7eb", // todo: change color
      }}
    >
      <p
        className="mb-3 fw-semibold"
        style={{ fontSize: "1.1rem", color: "#1f2937" }} //todo: change color
      >
        Add Post
      </p>

      <div className="d-flex gap-2">
        <div style={{ flexShrink: 0 }}>
          <img
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #f3f4f6", // todo : change color
            }}
            src={defUserImage}
            alt="User avatar"
          />
        </div>

        <textarea
          onChange={(e) => {
            setPostInfo({ ...postInfo, body: e.target.value });
          }}
          className="add-post"
          placeholder="What's on your mind?"
          onInput={(e) => {
            // Auto-grow functionality (HARD CODED VALUES: textarea height)
            e.target.style.height = "auto";
            const newHeight = Math.min(e.target.scrollHeight, 200);
            e.target.style.height = `${newHeight}px`;
            e.target.style.overflowY =
              e.target.scrollHeight > 200 ? "auto" : "hidden";
          }}
        />
      </div>
      {requestInfo.status === "success" && (
        <SuccessAlert message={requestInfo.message} />
      )}
      {requestInfo.status === "failure" && (
        <FailureAlert message={requestInfo.message} />
      )}
      <div
        className=" mt-3 pt-3 d-flex justify-content-between align-items-center "
        style={{
          borderTop: "1px solid #e5e7eb", // todo: change color
        }}
      >
        <button
          className={`attach-image attach-button ${postInfo.image ? "has-file" : ""}`}
        >
          <i className="bi bi-paperclip" style={{ fontSize: "1.1rem" }} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setPostInfo({ ...postInfo, image: e.target.files[0] });
            }}
            style={{ fontSize: "0.9rem" }}
          />
        </button>

        <button
          className="post-button py-2 px-3"
          onClick={() => {
            // Handle post submission
            const textarea = document.querySelector(".add-post");
            if (textarea.value.trim()) {
              console.log("Post:", textarea.value);
              textarea.value = "";
              // Trigger input event to reset height
              const event = new Event("input", { bubbles: true });
              textarea.dispatchEvent(event);
            }
            handlePostClick();
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
};
{
  /*
export const Post = ({
  postId,
  userName,
  userImage,
  postImage,
  postBody,
  postDetailsView,
  children,
}) => {
  const isPostImageValid = useMemo(() => isValidImage(postImage), [postImage]);

  const colors = useColors();
  function handleShare() {
    const postUrl = `${window.location.origin}/posts/${postId}`;

    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
  }
  const navigate = useNavigate();

  function navigateToPostDetails() {
    if (!postDetailsView) {
      navigate(`/posts/${postId}`);
    }
  }

  return (
 
    <div
      className="p-3 my-3"
      style={{
        width: "100%",
        backgroundColor: "white",
        // borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // todo: change color
        border: "1px solid #e5e7eb", // todo: change color
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center pb-3"
        style={{}}
      >
        <div
          className=""
          style={{
            flexShrink: 0,
          }}
        >
          <img
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #f3f4f6", // todo : change color
            }}
            src={getValidImage(userImage, defUserImage)}
            alt=""
            onError={(e) => {
              e.target.src = defUserImage;
            }}
          />

          <p className="d-inline-block ms-2">@{userName}</p>
        </div>
      </div>
      <p
        onClick={navigateToPostDetails}
        className="ps-1 pt-3 pb-0"
        style={{
          wordWrap: "break-word", // Wraps long words
          overflowWrap: "break-word", // Modern equivalent
          whiteSpace: "normal", // Allows normal wrapping
        }}
      >
        {postBody}
      </p>
      <div className="d-flex gap-2 mt-3" style={{}}>
        {isPostImageValid && (
          <div
            onClick={navigateToPostDetails}
            style={{
              width: "100%",
              maxHeight: "70vh",
              overflow: "hidden",
              backgroundColor: "#f3f4f6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // or "cover" based on your needs
              }}
              src={postImage}
              alt=""
            />
          </div>
        )}
      </div>

      {!postDetailsView && (
        <div
          className=" mt-3 pt-3 d-flex justify-content-between align-items-center "
          style={{
            borderTop: "1px solid #e5e7eb", // todo: change color
          }}
        >
          <button
            onClick={navigateToPostDetails}
            className="attach-image attach-button"
          >
            <i class="bi bi-chat" style={{ fontSize: "1.1rem" }}></i>

            <span style={{ fontSize: "0.9rem" }}>comment </span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="bi bi-share"></i> Share
          </button>
        </div>
      )}
      {postDetailsView && children}
    </div>)
}
    */
}
export const Post = ({
  postImage,
  postBody,
  userId,
  userName,
  userImage,
  postDetailsView,
  children,

  postId,
}) => {
  const colors = useColors();

  const isPostImageValid = useMemo(() => isValidImage(postImage), [postImage]);

  const handleShare = useCallback(() => {
    const postUrl = `${window.location.origin}/posts/${postId}`;

    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
  }, [postId]);

  const navigate = useNavigate();

  function navigateToPostDetails() {
    if (!postDetailsView) {
      navigate(`/posts/${postId}`);
    }
  }
  function navigateToProfile() {
    navigate(`/profile1/${userId}`);
  }

  return (
    <div
      className="p-3 my-3"
      style={{
        // borderRadius: "16px",
        // boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        // border: `1px solid ${colors.secondary}`,
        // transition: "all 0.2s ease",

        width: "100%",
        backgroundColor: "white",
        // borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // todo: change color
        border: "1px solid #e5e7eb", // todo: change color
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
      }}
    >
      {/* Header - User Info */}
      <div className="d-flex align-items-center gap-2 pb-3">
        <img
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            objectFit: "cover",
            border: ``,
            cursor: "pointer",
          }}
          src={getValidImage(userImage, defUserImage)}
          alt=""
          onError={(e) => {
            e.target.src = defUserImage;
          }}
          onClick={navigateToProfile}
        />
        <div>
          <p
            className="mb-0 fw-semibold"
            style={{
              color: colors.neutral,
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick={navigateToProfile}
          >
            {userName}
          </p>
          <p
            className="mb-0"
            style={{ fontSize: "0.75rem", color: colors.primary }}
          >
            @{userName?.toLowerCase().replace(/\s/g, "")}
          </p>
        </div>
      </div>

      {/* Post Body */}
      <p
        onClick={navigateToPostDetails}
        className="ps-1 pt-2 pb-2"
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "normal",
          color: colors.neutral,
          fontSize: "0.95rem",
          lineHeight: "1.5",
          cursor: "pointer",
        }}
      >
        {postBody}
      </p>

      {/* Post Image */}
      {isPostImageValid && (
        <div
          onClick={navigateToPostDetails}
          style={{
            width: "100%",
            maxHeight: "500px",
            overflow: "hidden",
            backgroundColor: "rgb(247 247 247)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            marginTop: "8px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              maxHeight: "500px",
            }}
            src={postImage}
            alt="Post content"
          />
        </div>
      )}

      {/* Action Buttons */}
      {!postDetailsView && (
        <div
          className="mt-3 pt-3 d-flex justify-content-between"
          style={{
            borderTop: "1px solid #e5e7eb",
            flexWrap: "wrap",
            // `1px solid ${colors.secondary}`
          }}
        >
          <button
            onClick={navigateToPostDetails}
            className=" comment-btn py-2 px-3"
          >
            <i className="bi bi-chat" style={{ fontSize: "1.1rem" }}></i>
            <span style={{ fontSize: "0.9rem" }}>Comment</span>
          </button>

          <button
            onClick={handleShare}
            style={{
              // background: "none",
              // border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              // padding: "8px 12px",
              // borderRadius: "8px",
              // color: colors.primary,
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            // onMouseEnter={(e) => {
            //   e.currentTarget.style.backgroundColor = colors.secondary;
            // }}
            // onMouseLeave={(e) => {
            //   e.currentTarget.style.backgroundColor = "transparent";
            // }}
            className="post-button py-2 px-3 "
          >
            <i className="bi bi-share"></i>
            <span>Share</span>
          </button>
        </div>
      )}

      {postDetailsView && children}
    </div>
  );
};

export const SearchBar = () => {
  const colors = useColors();
  const [searchedUser, setSearchedUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { usersRequestInfo, searchUser, fetchUsers } = useUsers();
  const { isMobile, isSideBarOpen, setIsSideBarOpen } = useToggleSideBar();

  return (
    <div
      style={{
        padding: "15px 20px",
        backgroundColor: "white",
        flexShrink: 0,
        borderBottom: "1px solid #e5e7eb",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="my-2 d-flex align-items-center">
        <div style={{ flexGrow: 1, position: "relative" }}>
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.primary,
              fontSize: "1rem",
            }}
          />
          <input
            value={searchedUser}
            onChange={(e) => {
              setSearchedUser(e.target.value);
              setFilteredUsers(searchUser(e.target.value));
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            type="text"
            className="form-control"
            placeholder="Search users..."
            style={{
              outline: "none",
              boxShadow: "none",
              borderColor: isFocused ? colors.primary : "#e5e7eb",
              padding: "12px 40px 12px 45px",
              borderRadius: "12px",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              backgroundColor: isFocused ? "#fff" : "#f8f9fa",
              width: "100%",
            }}
          />
          {searchedUser && (
            <button
              type="button"
              onClick={() => {
                setSearchedUser("");
                setFilteredUsers([]);
              }}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: colors.primary,
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-x-circle-fill"
                style={{ fontSize: "1.1rem" }}
              ></i>
            </button>
          )}
        </div>
        {isMobile && (
          <i
            onClick={() => {
              setIsSideBarOpen((prev) => !prev);
            }}
            className="bi bi-list p-1 px-2 ms-3 menu-icon"
          ></i>
        )}
      </div>

      {/* Search Results Dropdown */}
      {filteredUsers.length > 0 &&
        searchedUser &&
        usersRequestInfo.status === "success" && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% - 5px)",
              left: "20px",
              width: "calc(100% - 40px)", // This makes it match the search input width
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              maxHeight: "400px",
              overflowY: "auto",
              zIndex: 1000,
              border: "1px solid #e5e7eb",
            }}
          >
            {filteredUsers.map((user, index) => (
              <UserInSearch key={user.id} user={user} />
            ))}
          </div>
        )}

      {/* No Results Message */}
      {searchedUser && filteredUsers.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% - 5px)",
            left: "20px",
            width: "calc(100% - 40px)", // This makes it match the search input width
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "20px",
            textAlign: "center",
            zIndex: 1000,
            border: "1px solid #e5e7eb",
          }}
        >
          {usersRequestInfo.status === "success" && (
            <>
              <i
                className="bi bi-emoji-frown"
                style={{
                  fontSize: "2rem",
                  color: colors.primary,
                  marginBottom: "10px",
                  display: "block",
                }}
              />
              <p style={{ margin: 0, color: colors.neutral }}>
                No users found for "<strong>{searchedUser}</strong>"
              </p>
            </>
          )}

          {usersRequestInfo.status === "failure" && (
            <div className="alert alert-danger m-3" role="alert">
              {usersRequestInfo.message}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => {
                  fetchUsers();
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
  {
    /*    <div
      style={{
        padding: "15px 20px",
        backgroundColor: "white",
        flexShrink: 0,
        borderBottom: "1px solid #e5e7eb",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="my-2 d-flex align-items-center">
        <div style={{ flexGrow: 1, position: "relative" }}>
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.primary,
              fontSize: "1rem",
            }}
          />
          <input
            value={searchedUser}
            onChange={(e) => {
              setSearchedUser(e.target.value);
              setFilteredUsers(searchUser(e.target.value));
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            type="text"
            className="form-control"
            placeholder="Search users..."
            style={{
              outline: "none",
              boxShadow: "none",
              borderColor: isFocused ? colors.primary : "#e5e7eb",
              padding: "12px 40px 12px 45px",
              borderRadius: "12px",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              backgroundColor: isFocused ? "#fff" : "#f8f9fa",
            }}
          />
          {searchedUser && (
            <button
              type="button"
              onClick={() => {
                setSearchedUser("");
                setFilteredUsers([]);
              }}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: colors.primary,
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-x-circle-fill"
                style={{ fontSize: "1.1rem" }}
              ></i>
            </button>
          )}
        </div>
        {isMobile && (
          <i
            onClick={() => {
              setIsSideBarOpen((prev) => !prev);
            }}
            className="bi bi-list p-1 px-2 mx-3 menu-icon"
          ></i>
        )}
      </div>

   
      {filteredUsers.length > 0 && searchedUser && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            top: "calc(100% - 10px)",
            left: "20px",
            right: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
            border: `"1px solid #e5e7eb"`,
          }}
        >
          {filteredUsers.map((user, index) => (
            <UserInSearch key={user.id} user={user} />
          ))}
        </div>
      )}

      {searchedUser && filteredUsers.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% - 10px)",
            left: "20px",
            right: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "20px",
            textAlign: "center",
            zIndex: 1000,
            border: `"1px solid #e5e7eb"`,
          }}
        >
          <i
            className="bi bi-emoji-frown"
            style={{
              fontSize: "2rem",
              color: colors.primary,
              marginBottom: "10px",
              display: "block",
            }}
          />
          <p style={{ margin: 0, color: colors.neutral }}>
            No users found for "<strong>{searchedUser}</strong>"
          </p>
        </div>
      )}
    </div> */
  }
};
export const UserInSearch = ({ user }) => {
  const navigate = useNavigate();
  const colors = useColors();

  return (
    <div
      onClick={() => navigate(`/profile1/${user.id}`)}
      style={{
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderBottom: `1px solid ${colors.secondary}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.secondary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <img
        src={user.profileImage || defUserImage}
        alt={user.name}
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, color: colors.neutral }}>
          {user.name}
        </p>
        <p style={{ margin: 0, fontSize: "0.85rem", color: colors.primary }}>
          @{user.username || user.email?.split("@")[0]}
        </p>
      </div>
    </div>
  );
};
const SuccessAlert = ({ hidden, message = "success" }) => {
  return (
    !hidden && (
      <div className="alert alert-success" role="alert">
        {message}
      </div>
    )
  );
};
const FailureAlert = ({ hidden, message = "Fail" }) => {
  return (
    !hidden && (
      <div className="alert alert-danger" role="alert">
        {message}
      </div>
    )
  );
};
const Homep = () => {
  const {
    posts,
    loading,
    hasMore,
    error,
    lastPostRef,
    fetchPosts,
    page,
    setupObserver,
  } = usePosts();

  const postsList = useMemo(() => {
    return posts.map((post) => {
      return (
        <Post
          postId={post.id}
          key={post.id}
          userName={post.author.username}
          userImage={post.author.profile_image}
          postBody={post.body}
          postImage={post.image}
          created_at={post.created_at}
          userId={post.author.id}
        />
      );
    });
  }, [posts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (setupObserver) {
        setupObserver();
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [posts, setupObserver]); // This is fine

  return (
    <main
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <AddPost />
      <div className="">
        {postsList}
        {loading && <LoadingSpin />}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => fetchPosts(page)}
            >
              Retry
            </button>
          </div>
        )}
        <div
          ref={lastPostRef}
          style={{ height: "10px", width: "100%" }}
          data-testid="sentinel"
        />
      </div>
    </main>
  );
};
