import { useContext, useEffect, useState } from "react";
import {} from "../login.css";
import defUserImage from "../imgs/Unknown_person.jpg";
import landingImg from "../imgs/login-img.webp";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { logContext } from "../components/AuthContext";
import {
  addComment,
  getPostDetails,
  getValidImage,
  logIn,
  register,
} from "../components/Auth";
import { Post } from "./Home1";
import LoadingSpin from "../components/LoadingSpin";
import { useColors } from "../components/ColorsContext";

const PostDetails1 = ({}) => {
  const colors = useColors();
  const [post, setpost] = useState(null);
  const { postId } = useParams();
  const [postRequestInfo, setpostRequestInfo] = useState({
    status: "initial",
    message: "",
  });

  useEffect(() => {
    async function fetchPostDetails() {
      if (postId === "undefined") return;
      setpostRequestInfo({
        status: "loading",
        message: "",
      });
      const response = await getPostDetails(postId);

      if (response.success) {
        console.log(response.data.data);
        setpost(response.data.data);
        setpostRequestInfo({
          status: "success",
          message: "success",
        });
      } else {
        console.log(response.error);
        setpostRequestInfo({
          status: "failure",
          message: "POST FAILED TO LOAD, REFRESH A TRY AGAIN",
        });
      }
    }
    fetchPostDetails();
  }, [postId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {postRequestInfo.status === "loading" && <LoadingSpin />}
      {postId === "undefined" && (
        <h1 className="m-auto"> Post Doesn't Exist </h1>
      )}
      {post && postRequestInfo.status === "success" && (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Post
            userName={post?.author?.username}
            userImage={post?.author?.profile_image}
            postBody={post?.body}
            postImage={post?.image}
            postDetailsView={true}
            userId={post?.author?.id}
          >
            <>
              <AddComment postId={postId} />
              <div
                className="my-3 py-2"
                style={{
                  width: "100%",
                  borderTop: "1px solid #e5e7eb",
                  marginTop: "20px",
                }}
              >
                {post?.comments?.map((comment) => {
                  return (
                    <Comment
                      key={comment?.id}
                      body={comment?.body}
                      authorImage={comment?.author?.profile_image}
                      authorUsername={comment?.author?.username}
                      authorId={comment?.author?.id}
                    />
                  );
                })}
              </div>
            </>
          </Post>
        </div>
      )}
    </div>
  );
};

export default PostDetails1;

export const Comment = ({ authorUsername, authorImage, body, authorId }) => {
  const navigate = useNavigate();
  const colors = useColors();

  function handleNavigateToProfile() {
    navigate(`/profile1/${authorId}`);
  }

  return (
    <div
      className="py-3 px-2 my-2 d-flex gap-3"
      style={{
        borderRadius: "12px",
        transition: "all 0.2s ease",
        backgroundColor: "white",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <img
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
          }}
          src={getValidImage(authorImage, defUserImage)}
          alt=""
          onClick={handleNavigateToProfile}
          onError={(e) => {
            e.target.src = defUserImage;
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div
          onClick={handleNavigateToProfile}
          className="my-1"
          style={{ cursor: "pointer" }}
        >
          <p
            className="mb-0 fw-semibold"
            style={{
              color: colors.neutral,
              fontSize: "0.95rem",
            }}
          >
            @{authorUsername}
          </p>
        </div>
        <div
          className="my-1"
          style={{
            color: colors.neutral,
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};

export const AddComment = ({ postId }) => {
  const colors = useColors();
  const [commentBody, setCommentBody] = useState("");
  const [requestInfo, setRequestInfo] = useState({
    message: "no message",
    status: "initial",
  });
  const navigate = useNavigate();

  async function handleComment() {
    const response = await addComment(postId, commentBody);
    if (response.success) {
      setRequestInfo({
        message: "Comment added successfully!",
        status: "success",
      });

      setTimeout(() => {
        navigate(`/posts/${postId}`);
        console.log("using the navigation to a manual route");
      }, 500);
    } else {
      setRequestInfo({
        message: response.error || "Failed to add comment",
        status: "failure",
      });
    }
  }

  return (
    <div
      className="mt-3 py-3"
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div className="d-flex gap-3">
        <div style={{ flexShrink: 0 }}>
          <img
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e5e7eb",
            }}
            src={defUserImage}
            alt="User avatar"
          />
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            onChange={(e) => {
              setCommentBody(e.target.value);
            }}
            value={commentBody}
            className="add-post"
            style={{
              minHeight: "fit-content",
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "0.95rem",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            placeholder="What do you think?"
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${colors.secondary}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.secondary;
              e.target.style.boxShadow = "none";
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              const newHeight = Math.min(e.target.scrollHeight, 200);
              e.target.style.height = `${newHeight}px`;
              e.target.style.overflowY =
                e.target.scrollHeight > 200 ? "auto" : "hidden";
            }}
          />

          {commentBody?.trim() && (
            <div
              className="mt-2"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                animation: "slideUpFadeIn 0.3s ease-in-out",
              }}
            >
              <button
                onClick={() => {
                  handleComment();
                }}
                style={{
                  padding: "8px 24px",
                  backgroundColor: colors.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.accent;
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.primary;
                  e.target.style.transform = "scale(1)";
                }}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {requestInfo.status === "success" && (
        <div
          className="mt-3"
          style={{
            padding: "12px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          {requestInfo.message}
        </div>
      )}

      {requestInfo.status === "failure" && (
        <div
          className="mt-3"
          style={{
            padding: "12px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          {requestInfo.message}
        </div>
      )}
    </div>
  );
};
