import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import ErrorTag from "../components/ErrorTag";
import { usePosts } from "../contexts/PostContext";

function PostDetails() {
  // == GENERAL ==
  const { id } = useParams();
  const {
    currentPost,
    isSinglePostLoading,
    singlePostError,
    isActionLoading,
    fetchPostById,
    clearSinglePost,
    addCommentToPost,
  } = usePosts();
  const commentsList = currentPost?.comments || [];

  // == FETCH POST ==
  useEffect(() => {
    fetchPostById(id);
    return () => clearSinglePost(); // Clear memory cache upon leaving the route viewport thread context
  }, [id, fetchPostById, clearSinglePost]);

  // == COMMENT STATE ==
  const [commentText, setCommentText] = useState("");

  // == COMMENT SUBMIT HANDLER
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isActionLoading) return;

    // 🎯 Triggering the context mutation directly
    const result = await addCommentToPost(id, commentText);

    if (result.success) {
      setCommentText(""); // Only clear form if the server confirms saving the string layout successfully
    } else {
      alert(
        `Comment submission rejected: ${result.error || "Network glitch."}`,
      );
    }
  };

  // == JSX ==
  if (isSinglePostLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2" role="status" />
        <p className="text-muted small">Loading post...</p>
      </div>
    );
  }
  if (singlePostError || !currentPost) {
    return (
      <div className="pt-3">
        <ErrorTag
          error={singlePostError || "Post context missing."}
          onRetry={() => fetchPostById(id)}
        />
      </div>
    );
  }
  return (
    <div className="post-details-wrapper animate-fade-in">
      {/* == POST == */}
      <PostCard
        className="fancy-top-border"
        id={currentPost.id}
        key={currentPost.id}
        autherId={currentPost.author.id}
        username={currentPost.author.username}
        commentsCount={currentPost.comments_count}
        timestamp={currentPost.created_at}
        content={currentPost.body}
        imageUrl={currentPost.image}
        showControls={false}
        disableCommentActions={true}
      />

      {/* == COMMENT FORM == */}
      <div className="bg-white rounded-3 border p-3 my-3 shadow-sm">
        <form
          onSubmit={handleCommentSubmit}
          className="d-flex gap-2 align-items-center"
        >
          <input
            type="text"
            className="form-control border-0 bg-light py-2 px-3 rounded-pill"
            placeholder={
              localStorage.getItem("token")
                ? "Write a constructive comment..."
                : "Login to join the discussion..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isActionLoading || !localStorage.getItem("token")}
            style={{ fontSize: "0.9rem", boxShadow: "none" }}
          />
          <button
            type="submit"
            className=" btn btn-gradient rounded-pill px-4 btn-sm fw-semibold"
            disabled={
              !commentText.trim() ||
              isActionLoading ||
              !localStorage.getItem("token")
            }
          >
            {isActionLoading && (
              <span
                className="spinner-border spinner-border-sm me-1"
                role="status"
              />
            )}
            Reply
          </button>
        </form>
      </div>

      {/* == COMMENTS == */}
      <div className="comments-section bg-white rounded-3 border p-4 shadow-sm mb-4">
        <h6
          className="fw-bold text-dark mb-4 small text-uppercase"
          style={{ letterSpacing: "0.5px" }}
        >
          Discussions ({commentsList.length})
        </h6>

        {commentsList.length === 0 ? (
          <p className="text-muted small text-center my-3">
            Be the first to leave a thought!
          </p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {commentsList.map((comment) => {
              return <Comment comment={comment} author={comment.author} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetails;

const Comment = ({ comment, author }) => {
  return (
    <div
      key={comment.id || Math.random()}
      className="d-flex gap-3 align-items-start"
    >
      <Link
        to={`/user/${author?.id}`}
        className="text-decoration-none d-block text-reset"
        title={`View ${author?.name}'s profile`}
      >
        <div
          className="hover-scale rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0 cursor-pointer"
          style={{ width: "42px", height: "42px" }}
        >
          <span className="fs-5">👤</span>
        </div>
      </Link>

      <div className="flex-grow-1 bg-light p-3 rounded-3 border border-light">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Link
            to={`/user/${author?.id}`}
            className="hover-text mb-0 fw-bold text-dark text-decoration-none link-primary-hover "
            style={{ fontSize: "1rem" }}
          >
            {author?.name}
          </Link>
          <span
            className="text-muted font-monospace"
            style={{ fontSize: "0.75rem" }}
          >
            @{author?.username || "anon"}
          </span>
        </div>
        <p
          className="text-secondary m-0 small lh-base"
          style={{ whiteSpace: "pre-line" }}
        >
          {comment.body || comment.content}
        </p>
      </div>
    </div>
  );
};
