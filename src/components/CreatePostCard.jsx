import { useState, useRef, useEffect } from "react";
import { useModal } from "../contexts/ModalContext";
import { usePosts } from "../contexts/PostContext";
import { useToast } from "../contexts/ToastContext";
import Button from "./Button";

function CreatePostCard({
  mode = "create",
  initialData = null,
  variant = "card",
  className,
}) {
  // Using initialData.body as per your updated model configuration
  const [postText, setPostText] = useState(initialData?.body || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);

  const { isActionLoading, createNewPost, updateExistingPost } = usePosts();
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  // Background hook to convert image URLs to native binary File objects during edit mode
  useEffect(() => {
    const seedInitialImageFile = async () => {
      if (mode === "edit" && initialData?.image) {
        try {
          const response = await fetch(initialData.image);
          const blob = await response.blob();

          // Extrapolate filename from the URL or fallback securely
          const filename =
            initialData.image.split("/").pop() || "existing-image.jpg";
          const file = new File([blob], filename, { type: blob.type });

          setSelectedImage(file);
        } catch (err) {
          console.error(
            "Failed to convert existing image URL to a File object:",
            err,
          );
        }
      }
    };

    seedInitialImageFile();
  }, [mode, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (imagePreview && !selectedImage) {
      showToast("loading the image, please wait a second...", "warning");
      return;
    }
    // Validate against imagePreview so existing images satisfy textless visual posts
    if (!postText.trim() || !selectedImage) {
      showToast(
        "Your post cannot be empty! Write something or attach an image.",
        "danger",
      );
      return;
    }

    if (mode === "edit") {
      try {
        const { success, error } = await updateExistingPost(
          initialData.id,
          "", // title parameter placeholder required by context
          postText,
          selectedImage,
        );

        if (success) {
          showToast("Post updated successfully!", "success");
          closeModal();
          // if (profileUser) {
          //   fetchUserProfileData(profileUser.id);
          // } else {
          //   fetchAllPosts(1, 10, true);
          // }
        } else {
          showToast(
            error || "Failed to update your post. Please try again.",
            "danger",
          );
        }
      } catch (err) {
        showToast(err.message || "An unexpected error occurred.", "danger");
      }
    } else {
      // ==========================================
      // CREATE MODE
      // ==========================================
      try {
        const { success, error } = await createNewPost(
          "",
          postText,
          selectedImage,
        );

        if (success) {
          showToast("Post published successfully!", "success");
          setPostText("");
          handleRemoveImage();

          // if (profileUser) {
          //   fetchUserProfileData(profileUser.id);
          // } else {
          //   fetchAllPosts(1, 10, true);
          // }
        } else {
          showToast(
            error || "Could not publish your post. Please try again.",
            "danger",
          );
        }
      } catch (err) {
        showToast(err.message || "An unexpected error occurred.", "danger");
      }
    }
  };

  if (variant === "modal") {
    return (
      <div className={`modal-workspace-canvas w-100 ${className || ""}`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="d-none"
        />

        <textarea
          rows="4"
          className="premium-textarea form-control modal-seamless-textarea p-0 mb-3 text-dark resize-none"
          placeholder="Edit your thoughts or update your post description..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          disabled={isActionLoading}
        ></textarea>

        {imagePreview && (
          <div className="position-relative mb-4 rounded-3 overflow-hidden border bg-light d-flex justify-content-center align-items-center modal-preview-box">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-100 object-fit-cover"
              style={{ maxHeight: "220px" }}
            />
            <button
              type="button"
              className="btn btn-dark btn-sm rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center"
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: "#0f172a",
              }}
              onClick={handleRemoveImage}
              disabled={isActionLoading}
            >
              <i className="bi bi-x-lg small text-white"></i>
            </button>
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light-subtle">
          <Button
            variant="notFilled"
            className="modal-toolbar-btn py-1.5 px-2.5 rounded-2"
            onClick={() => fileInputRef.current.click()}
            type="button"
            disabled={isActionLoading}
          >
            <i className="bi bi-image text-primary me-2"></i>
            <span className="small fw-semibold text-secondary">
              {imagePreview ? "Change Photo" : "Attach Photo"}
            </span>
          </Button>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light border px-3 rounded-2 small fw-medium text-muted"
              onClick={closeModal}
              disabled={isActionLoading}
            >
              Cancel
            </button>
            <Button
              className="rounded-2 px-4 fw-semibold shadow-sm"
              onClick={handleFormSubmit}
              disabled={isActionLoading}
            >
              {isActionLoading && (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`create-post-canvas rounded-3 p-4 mb-4 bg-white border shadow-sm ${className || ""}`}
    >
      <form onSubmit={handleFormSubmit} className="d-flex gap-3">
        <div
          className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: "42px", height: "42px" }}
        >
          <span className="fs-5">👤</span>
        </div>

        <div className="flex-grow-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="d-none"
          />
          <textarea
            rows="3"
            className="form-control premium-textarea py-2.5 px-3 mb-3 text-dark rounded-3 resize-none"
            placeholder="What's on your mind? Share an update..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            style={{ fontSize: "0.95rem", boxShadow: "none" }}
            disabled={isActionLoading}
          ></textarea>

          {imagePreview && (
            <div
              className="position-relative mb-3 rounded-3 overflow-hidden border bg-light d-flex justify-content-center align-items-center"
              style={{ maxHeight: "240px" }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="w-100 object-fit-cover"
                style={{ maxHeight: "240px" }}
              />
              <button
                type="button"
                className="btn btn-dark btn-sm rounded-circle position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#0f172a",
                }}
                onClick={handleRemoveImage}
                disabled={isActionLoading}
              >
                <i className="bi bi-x-lg fs-6 text-white"></i>
              </button>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between pt-1">
            <Button
              variant="notFilled"
              onClick={() => fileInputRef.current.click()}
              type="button"
              disabled={isActionLoading}
            >
              <i className="bi bi-camera"></i>
              <small className="ms-2 fw-semibold text-secondary">
                {imagePreview ? "Change Photo" : "Add Photo"}
              </small>
            </Button>

            <button
              type="submit"
              className="btn btn-gradient rounded-pill px-4 py-2 btn-sm fw-semibold"
              disabled={isActionLoading}
            >
              {isActionLoading && (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                />
              )}
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePostCard;
