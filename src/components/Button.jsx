import { useState } from "react";

const Button = ({
  type = "default",
  variant = "filled",
  className = "",
  style = {},
  onClick,
  children,
  disabled = false,
  ...props
}) => {
  // == generals ===
  const styleVariant =
    variant === "filled" ? "btn-app-primary" : "btn-app-not-filled";
  const compiledClasses = `btn ${styleVariant} ${className}`.trim();
  // == for like button ===
  const [isLiked, setIsLiked] = useState(false);
  if (type === "like") {
    return (
      <button
        className="btn-like-no-bg text-decoration-none d-flex align-items-center gap-2 py-1 px-3 rounded-2"
        onClick={() => {
          setIsLiked(!isLiked);
          onClick();
        }}
      >
        <i
          className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart text-app-primary"} fs-5`}
        ></i>

        <small
          className={`fw-medium ${isLiked ? "text-danger fw-bold" : "text-secondary"}`}
        >
          {isLiked ? "Liked" : "Like"}
        </small>
      </button>
    );
  } else if (type === "comment") {
    return (
      <button
        onClick={onClick}
        className="btn-like-no-bg text-decoration-none d-flex align-items-center gap-2 py-1 px-3 rounded-2"
      >
        <i className="bi bi-chat text-app-primary"></i>
        <small className="fw-medium text-secondary">
          {children} <span className="d-none d-sm-inline">Comment</span>{" "}
        </small>
      </button>
    );
  }
  return (
    <button
      type="button" // Explicitly locked to prevent default form submittal refreshes
      className={compiledClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
