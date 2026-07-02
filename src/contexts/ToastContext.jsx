import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToast must be consumed strictly within an active <ToastProvider> wrapper layout.",
    );
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toastConfig, setToastConfig] = useState({
    isOpen: false,
    message: "",
    variant: "success", // 'success' (green), 'danger' (red), 'warning' (yellow), 'info' (blue)
  });

  // Keep track of the active timer instance to cleanly handle rapid click overrides
  const timerRef = useRef(null);

  const closeToast = useCallback(() => {
    setToastConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showToast = useCallback(
    (message, variant = "success") => {
      // Clear any existing active timer to prevent premature fade-outs
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToastConfig({
        isOpen: true,
        message,
        variant,
      });

      // Automatically trigger the fade-out lifecycle window after 3.5 seconds
      timerRef.current = setTimeout(() => {
        closeToast();
      }, 3500);
    },
    [closeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}

      {toastConfig.isOpen && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{
            zIndex: 10000,
            marginTop: "65px",
            maxWidth: "100%",
            width: "auto",
          }}
        >
          <div
            className={`toast show align-items-center text-white bg-${toastConfig.variant} border-0 shadow-lg`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              minWidth: "280px",
              maxWidth: "calc(100vw - 32px)",
              borderRadius: "12px",
              backdropFilter: "blur(4px)",
              animation:
                "toast-slide-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forward",
            }}
          >
            <div className="d-flex align-items-center p-2">
              <div className="toast-body d-flex align-items-center fs-6 w-100 py-1">
                <span className="d-flex align-items-center me-2">
                  {toastConfig.variant === "success" && (
                    <i className="bi bi-check-circle-fill text-white fs-4"></i>
                  )}
                  {toastConfig.variant === "danger" && (
                    <i className="bi bi-exclamation-triangle-fill text-white fs-4"></i>
                  )}
                  {toastConfig.variant === "warning" && (
                    <i className="bi bi-exclamation-circle-fill text-dark fs-4"></i>
                  )}
                  {toastConfig.variant === "info" && (
                    <i className="bi bi-info-circle-fill text-white fs-4"></i>
                  )}
                </span>

                {/* Text Message Content */}
                <div className="fw-medium pe-2">{toastConfig.message}</div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto opacity-75"
                onClick={closeToast}
                aria-label="Close"
                style={{ shadow: "none" }}
              ></button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
