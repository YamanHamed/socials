import { useColors } from "./ColorsContext";

const LoadingSpin = () => {
  const colors = useColors();
  return (
    <div className="text-center py-4">
      <div
        className="spinner-border"
        role="status"
        style={{ color: colors.primary }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpin;
