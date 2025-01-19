import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const GRID_SIZE = 40; // Spacing between grid lines in pixels

const CursorAnimation = () => {
  const [highlightedX, setHighlightedX] = useState<number | null>(null);
  const [highlightedY, setHighlightedY] = useState<number | null>(null);
  const [hue, setHue] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize to adjust grid dynamically
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse movement to highlight nearest grid lines
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Calculate the nearest grid lines
      const nearestX = Math.round(x / GRID_SIZE) * GRID_SIZE;
      const nearestY = Math.round(y / GRID_SIZE) * GRID_SIZE;

      setHighlightedX(nearestX);
      setHighlightedY(nearestY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Color animation effect
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setHue((prevHue) => (prevHue + 1) % 360);
    }, 50); // Adjust speed of color change

    return () => clearInterval(colorInterval);
  }, []);

  // Generate vertical lines
  const verticalLines = [];
  for (let x = 0; x <= windowSize.width; x += GRID_SIZE) {
    const isHighlighted = x === highlightedX;
    const lineHue = (hue + x / GRID_SIZE * 5) % 360; // Offset hue based on position
    verticalLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={windowSize.height}
        stroke={isHighlighted 
          ? `rgba(255, 255, 255, 0.4)` 
          : `hsla(${lineHue}, 70%, 50%, 0.3)`}
        strokeWidth={isHighlighted ? 2 : 1}
        style={{ transition: "stroke 0.3s, strokeWidth 0.3s" }}
      />
    );
  }

  // Generate horizontal lines
  const horizontalLines = [];
  for (let y = 0; y <= windowSize.height; y += GRID_SIZE) {
    const isHighlighted = y === highlightedY;
    const lineHue = (hue + y / GRID_SIZE * 5) % 360; // Offset hue based on position
    horizontalLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={windowSize.width}
        y2={y}
        stroke={isHighlighted 
          ? `rgba(255, 255, 255, 0.4)` 
          : `hsla(${lineHue}, 70%, 50%, 0.3)`}
        strokeWidth={isHighlighted ? 2 : 1}
        style={{ transition: "stroke 0.3s, strokeWidth 0.3s" }}
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none block" style={{ zIndex: -1 }}>
      <svg width={windowSize.width} height={windowSize.height}>
        {verticalLines}
        {horizontalLines}
      </svg>
    </div>
  );
};

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <video 
            src="/assets/images/H.mp4"
            autoPlay
            loop
            muted
            className="hidden lg:block h-screen w-2/3 object-cover bg-no-repeat"
          ></video>
          <CursorAnimation />
        </>
      )}
    </>
  );
};

export default AuthLayout;