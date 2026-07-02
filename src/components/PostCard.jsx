import { isValidImage } from "../api/reqs";
import { useModal } from "../contexts/ModalContext";
import { usePosts } from "../contexts/PostContext";
import { useToast } from "../contexts/ToastContext";
import CreatePostBox from "./CreatePostCard";
import { Link, useNavigate } from "react-router-dom";

function PostCard({
  id,
  commentsCount,
  autherId,
  className,
  username,
  timestamp,
  content,
  imageUrl,
  badgeText,
  showControls = false,
  disableCommentActions = false,
}) {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { deleteExistingPost } = usePosts();

  const handleDeleteTrigger = () => {
    openModal({
      title: "Delete Publication",
      content:
        "Are you sure you want to permanently erase this post? This action cannot be undone.",
      confirmText: "Delete",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          // The context will automatically pick up this promise and display the loading spinner
          const { success, error } = await deleteExistingPost(id);

          if (success) {
            showToast("Post deleted successfully!", "success");
            return true; // 🌟 Tells ModalContext to drop the modal cleanly
          } else {
            showToast(error || "Failed to delete post.", "danger");
            return false; // 🔒 Keeps modal open so the user can read the message or try again
          }
        } catch (err) {
          showToast("An unexpected network error occurred.", "danger");
          return false; // Keeps modal open on catastrophic failures
        }
      },
    });
  };
  const handleEditTrigger = () => {
    openModal({
      title: "Edit Post",
      // We will inject the CreatePostBox component here in the next step!

      content: (
        <CreatePostBox
          mode="edit"
          variant="modal"
          initialData={{ title: "", body: content, image: imageUrl, id }}
        />
      ),
    });
  };
  const handleShareTrigger = async (e) => {
    e.stopPropagation();

    const postUrl = `${window.location.origin}/posts/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username} on Socials`,
          text: content
            ? `${content.substring(0, 60)}...`
            : "Check out this publication!",
          url: postUrl,
        });
      } catch (error) {
        // Ignore failures caused by the user closing the share panel manually
        if (error.name !== "AbortError") {
          console.error("Error sharing post:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);

        alert("Link copied to clipboard! Share it anywhere.");
      } catch (err) {
        console.error("Failed to copy link: ", err);
      }
    }
  };

  return (
    <div
      className={`bg-white position-relative rounded-3 border p-4 shadow-sm ${className}`}
    >
      {/* == CARD HEADER == */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          {/* == USER IMAGE == */}
          <Link
            to={`/user/${autherId}`}
            className="text-decoration-none d-block text-reset"
            title={`View ${username}'s profile`}
          >
            <div
              className="hover-scale rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0 cursor-pointer"
              style={{ width: "42px", height: "42px" }}
            >
              <span className="fs-5">👤</span>
            </div>
          </Link>

          {/* == USERNAME == */}
          <div>
            <div className=" d-flex align-items-center flex-wrap gap-2">
              <Link
                to={`/user/${autherId}`}
                className="hover-text mb-0 fw-bold text-dark text-decoration-none link-primary-hover "
                style={{ fontSize: "1rem" }}
              >
                {username}
              </Link>
            </div>
            <small className="text-muted d-block mt-0.5">{timestamp}</small>
          </div>
        </div>
        {showControls && (
          <div className="dropdown">
            <button
              className="btn border-0 p-1 text-muted rounded-circle hover-bg-light"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end border shadow-sm p-1 rounded-3">
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-secondary"
                  onClick={handleEditTrigger}
                >
                  <i className="bi bi-pencil-square"></i> Edit post
                </button>
              </li>
              <li>
                <hr className="dropdown-divider my-1 opacity-5" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded-2 text-danger"
                  onClick={handleDeleteTrigger}
                >
                  <i className="bi bi-trash3-fill"></i> Delete post
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* == CARD TEXT BODY == */}
      <p className="text-secondary mb-3 lh-base fs-6">{content}</p>

      {/* == POST IMAGE  == */}
      {isValidImage(imageUrl) && (
        <div
          className="overflow-hidden rounded-3 mb-3 border border-light bg-light"
          style={{ maxHeight: "450px" }}
        >
          <img
            src={imageUrl}
            alt={`${username}'s post attachment`}
            className="img-fluid w-100 h-100"
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={(e) => {
              e.target.parentElement.style.display = "none";
            }}
          />
        </div>
      )}

      <hr className="text-black-50 my-2" />

      {/* == SHARE & COMMENT == */}
      <div className="d-flex justify-content-around pt-1">
        <button
          type="button"
          className="btn border-0 d-flex align-items-center gap-2 text-secondary py-2 px-4 rounded-3 hover-right-slide active-scale transition-all text-decoration-none fw-medium fs-6"
          onClick={() => {
            if (id) {
              navigate(`/posts/${id}`);
            } else {
              console.warn(
                "⚠️ Cannot navigate: Post missing a valid network ID reference.",
              );
            }
          }}
          title="Give your comment"
        >
          <i className="bi bi-chat text-app-primary"></i>
          {`(${commentsCount}) `}{" "}
          <span className="d-none d-sm-inline">Comment</span>
        </button>

        <button
          type="button"
          className="btn border-0 d-flex align-items-center gap-2 text-secondary py-2 px-4 rounded-3 hover-right-slide active-scale transition-all text-decoration-none fw-medium fs-6"
          onClick={handleShareTrigger}
          title="Share this post"
        >
          <i className="bi bi-share fs-5"></i>
          <span className="d-none d-sm-inline">Share</span>
        </button>
      </div>
    </div>
  );
}

export default PostCard;
