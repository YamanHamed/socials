import React, { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  confirmText,
  cancelText,
  confirmVariant,
  hasActions,
  isLoading,
}) => {
  // Clean close on Escape key strike (disabled while a mutation is running)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Added d-flex and gap utilities to support inner loaders cleanly
  const btnClass = `btn btn-${confirmVariant || "danger"} px-4 fw-semibold rounded-3 d-flex align-items-center gap-2`;

  return (
    // 🔒 Block closing via backdrop click while an API call is processing
    <div
      className="custom-modal-backdrop"
      onClick={() => !isLoading && onClose()}
    >
      {/* Inner Card Modal Wrapper */}
      <div
        className="custom-modal-card bg-white rounded-4 border shadow-xl p-4 w-100"
        onClick={(e) => e.stopPropagation()} // Keeps modal from closing when clicking inside the form
      >
        {/* Header segment */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark m-0">{title}</h5>
          {/* 🔒 Disable close X button while loading */}
          <button
            className="btn-close shadow-none"
            onClick={onClose}
            disabled={isLoading}
          ></button>
        </div>

        {/* Content Body Section (Can render strings or complete sub-forms) */}
        <div className="custom-modal-body mb-4 text-secondary">
          {typeof content === "string" ? (
            <p className="m-0">{content}</p>
          ) : (
            content
          )}
        </div>

        {/* Optional Action Bar Footer */}
        {hasActions && (
          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            {/* 🔒 Disable Cancel button while loading */}
            <button
              className="btn btn-light px-4 text-muted rounded-3 border fw-medium"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            {/* 🔒 Append spinner element dynamically inside confirmation layer */}
            <button
              className={btnClass}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
