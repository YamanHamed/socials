const PostSkeleton = () => {
  return (
    <div className="card w-100 shadow-sm border rounded-4 p-3 mb-1 placeholder-wave">
      {/* Header Area (Avatar + Name Wireframe) */}
      <div className="d-flex align-items-center gap-3 mb-3">
        {/* Animated Avatar Circle */}
        <div
          className="placeholder rounded-circle bg-secondary opacity-25"
          style={{ width: "45px", height: "45px", flexShrink: 0 }}
        ></div>

        {/* Username & Timestamp Text Lines */}
        <div className="w-100 d-flex flex-column gap-2">
          <span className="placeholder col-4 col-sm-3 bg-secondary opacity-25 rounded py-2"></span>
          <span
            className="placeholder col-2 bg-secondary opacity-25 rounded py-1"
            style={{ fontSize: "0.75rem" }}
          ></span>
        </div>
      </div>

      {/* Body Content Paragraph Lines (The Gap Fillers) */}
      <div className="card-body p-0 d-flex flex-column gap-2 mb-3">
        <p className="placeholder col-11 bg-secondary opacity-25 rounded m-0 py-1"></p>
        <p className="placeholder col-12 bg-secondary opacity-25 rounded m-0 py-1"></p>
        <p className="placeholder col-8 bg-secondary opacity-25 rounded m-0 py-1"></p>
      </div>

      {/* Image Preview Window Block */}
      <div
        className="placeholder w-100 bg-secondary opacity-25 rounded-3 mb-3 d-block"
        style={{ minHeight: "180px" }}
      ></div>

      {/* Footer Interactive Actions Mock Line */}
      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
        <span className="placeholder col-2 bg-secondary opacity-25 rounded py-2"></span>
        <span className="placeholder col-3 bg-secondary opacity-25 rounded py-2"></span>
      </div>
    </div>
  );
};

export default PostSkeleton;
