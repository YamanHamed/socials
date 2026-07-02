const ErrorTag = ({
  error,
  onRetry,
  showRefresh = true,
  type = "big",
  severity = "info",
}) => {
  const handleRefresh = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  console.error("Layout Exception Catch:", error);

  const styles = {
    error: {
      bgClass: "bg-danger-subtle border-danger-subtle text-danger",
      icon: "bi-exclamation-octagon-fill",
      btnClass: "btn-outline-danger",
    },
    warning: {
      bgClass: "bg-warning-subtle border-warning-subtle text-warning-emphasis",
      icon: "bi-exclamation-triangle-fill",
      btnClass: "btn-outline-warning",
    },
    info: {
      // ☁️ Soft, neutral palette tailored specifically for server synchronization hitches
      bgClass: "bg-light border-secondary-subtle text-secondary shadow-sm",
      icon: "bi-cloud-slash fs-1 text-muted",
      btnClass: "btn-outline",
    },
  };

  const activeStyle = styles[severity] || styles.info;

  if (type === "small") {
    return (
      <div
        className={`d-flex align-items-center gap-2 small mt-2 px-2 py-1 rounded ${activeStyle.bgClass.split(" ")[0]}`}
      >
        <i className={`bi ${activeStyle.icon.split(" ")[0]}`}></i>
        <span>{error || "An update error occurred."}</span>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            className="btn btn-link p-0 m-0 ms-auto text-xs text-decoration-underline text-reset align-baseline"
            style={{ fontSize: "0.8rem" }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-3 p-4 p-sm-5 rounded-4 border text-center  ${activeStyle.bgClass}`}
    >
      {/* Icon Wrapper with explicit scaling */}
      <div className="opacity-75">
        <i
          className={`bi ${activeStyle.icon}`}
          style={{ fontSize: "2rem" }}
        ></i>
      </div>

      {/* Responsive Text: Smaller on mobile (fs-5), scales up on tablet/desktop (fs-sm-4) */}
      <h5 className="fw-semibold text-dark m-0 lh-base fs-5 fs-sm-4">
        {error || "Something went wrong"}
      </h5>

      {showRefresh && (
        <button
          onClick={handleRefresh}
          // 🎨 d-inline-flex ensures the button shrinks to fit its contents instead of stretching wide
          className={`btn ${activeStyle.btnClass} btn-sm fw-semibold d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2 mt-2 rounded-3 shadow-sm transition-all`}
          style={{ letterSpacing: "0.3px" }}
        >
          <i
            className="bi bi-arrow-clockwise align-middle"
            style={{ fontSize: "1.1rem" }}
          ></i>
          <span className="align-middle">Try again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorTag;
