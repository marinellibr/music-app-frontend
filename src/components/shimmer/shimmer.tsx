import "./shimmer.css";

interface ShimmerProps {
  width: number;
  height: number;
  radius: number;
}

export default function Shimmer({ width, height, radius }: ShimmerProps) {
  return (
    <div
      className="shimmer-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${radius}px`,
      }}
    ></div>
  );
}
