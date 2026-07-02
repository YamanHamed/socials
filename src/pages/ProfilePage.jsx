import React, { useEffect } from "react";
import CreatePostBox from "../components/CreatePostCard";
import { useParams } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import ErrorTag from "../components/ErrorTag";
import { getValidImage } from "../api/reqs";
import PostCard from "../components/PostCard";

function ProfilePage() {
  // == GENERAL ==
  const { userId } = useParams();
  const {
    profileUser,
    profilePosts,
    mainUserProfile,
    isProfileLoading,
    profileError,
    fetchUserProfileData,
    loadMainUserFromCache,
  } = useProfile();

  // == IS MAIN USER PROFILE ==
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.id;
  const isMainUser = String(userId) === String(loggedInUserId);

  // == CACHE-FIRST CONTROL HOOK ==
  useEffect(() => {
    console.log(profileUser);
    if (isMainUser && mainUserProfile) {
      loadMainUserFromCache();
    } else if (
      !isMainUser &&
      profileUser &&
      String(profileUser.id) === String(userId)
    ) {
    } else {
      fetchUserProfileData(userId);
    } //eslint-disable-next-line
  }, [
    userId,
    isMainUser,
    mainUserProfile,
    fetchUserProfileData,
    loadMainUserFromCache,
  ]);

  // == JSX ==
  if (isProfileLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="text-muted fw-medium"> Loading user profile ...</p>
      </div>
    );
  }
  if (profileError) {
    return (
      <ErrorTag
        error={profileError}
        onRetry={() => fetchUserProfileData(userId)}
        type="big"
        severity="error"
      />
    );
  }
  return (
    <div className="profile-container animate-fade-in">
      {/* == USER PROFILE CARD == */}
      <div className="fancy-top-border bg-white rounded-3 border p-4 shadow-sm mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
          <div className="position-relative">
            <img
              src={getValidImage(profileUser?.profile_image)}
              alt={""}
              className="rounded-circle border object-fit-cover shadow-sm"
              style={{
                width: "96px",
                height: "96px",
                border: "3px solid #ffffff !important",
              }}
            />
          </div>

          {/* User Details Block */}
          <div className="text-center text-sm-start flex-grow-1">
            <h4 className="fw-bold text-dark mb-1">
              {profileUser?.name || "Anonymous User"}
            </h4>
            <p className="text-muted mb-2">@{profileUser?.username}</p>

            {/* Minimalist Contact Link */}
            {profileUser?.email && (
              <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 text-muted small">
                <i className="bi bi-envelope fs-6"></i>
                <span className="user-select-all">{profileUser?.email}</span>
              </div>
            )}
          </div>
        </div>

        <hr className="my-4 opacity-10" />

        {/* CONTRIBUTION METRICS GRID */}
        <div className="row g-3 text-center">
          {/* Post Count Block */}
          <div className="col-6">
            <div className="p-3 bg-light rounded-3 border-0 position-relative overflow-hidden">
              <div className="text-muted small fw-medium mb-1">
                Publications
              </div>
              <div className="fs-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-postcard text-app-primary fs-4"></i>
                {profileUser?.posts_count || profilePosts?.length}
              </div>
            </div>
          </div>

          {/* Comment Count Block */}
          <div className="col-6">
            <div className="p-3 bg-light rounded-3 border-0 position-relative overflow-hidden">
              <div className="text-muted small fw-medium mb-1">Discussions</div>
              <div className="fs-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-chat-left-text text-success fs-4"></i>
                {profileUser?.comments_count || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* == CREATE POST BOX ==  */}
      {isMainUser && (
        <div className="mb-4">
          <CreatePostBox mode="create" variant="card" />
        </div>
      )}

      {/* == USER POSTS == */}
      <div className="d-flex align-items-center gap-2 mb-3 px-1">
        <i className="bi bi-grid-3x3-gap-fill text-muted"></i>
        <h6
          className="fw-bold text-secondary text-uppercase m-0"
          style={{ letterSpacing: "1px", fontSize: "0.8rem" }}
        >
          Recent Activity
        </h6>
      </div>
      <div className="profile-feed">
        {profilePosts && profilePosts.length > 0 ? (
          profilePosts.map((post) => (
            <PostCard
              className="mb-4"
              id={post.id}
              autherId={userId}
              key={post.id}
              username={post.author?.username}
              commentsCount={post.comments_count}
              timestamp={post.created_at}
              content={post.body}
              imageUrl={post.image}
              showControls={isMainUser}
            />
          ))
        ) : (
          <div className="text-center p-5 bg-white rounded-3 border text-muted">
            <i className="bi bi-folder-x fs-1 d-block mb-2 opacity-50"></i>
            No posts shared by this creator yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
