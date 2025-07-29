import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  PanicIcon,
  SilenceIcon,
  HiddenProblemsIcon,
  BiggerPanicIcon,
  MoreSilenceIcon,
} from "../icons/SpiralIcons";

const PanicCrisisArc = () => {
  const arcSteps = [
    { name: "Panic", icon: <PanicIcon /> },
    { name: "Silence", icon: <SilenceIcon /> },
    { name: "Hidden Problems", icon: <HiddenProblemsIcon /> },
    { name: "Bigger Panic", icon: <BiggerPanicIcon /> },
    { name: "More Silence", icon: <MoreSilenceIcon /> },
  ];

  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 350,
    height: 350,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        // Cap the maximum width for the spiral on larger screens to prevent it from being too big
        const cappedWidth = Math.min(newWidth, 650);
        const newHeight = cappedWidth * (350 / 350); // Maintain aspect ratio
        setContainerDimensions({ width: cappedWidth, height: newHeight });
      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { width: currentContainerWidth, height: currentContainerHeight } =
    containerDimensions;

  // Calculate radius and center dynamically based on current container width
  const radius = currentContainerWidth * 0.35; // Adjust this factor to control arc size relative to container
  const centerX = currentContainerWidth / 2;
  const arcCenterY = currentContainerHeight * 0.7; // Adjust this factor to control vertical position of the arc base

  return (
    <motion.section
      // Adjusted vertical padding (py) to control upper spacing
      className="mb-8 sm:mb-12 py-4 px-4 sm:py-6 sm:px-8 rounded-2xl shadow-xl border border-gray-700 relative overflow-hidden w-full lg:max-w-xl mx-auto" // lg:max-w-xl helps cap size on laptops
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h2 className="text-xl sm:text-3xl font-bold text-cyan-400 mb-6 sm:mb-8 text-center">
        The Panic-to-Crisis Cycle
      </h2>
      <div
        ref={containerRef}
        className="flex justify-center items-center w-full min-h-[250px] sm:min-h-[350px] relative" // Removed lg:min-h to allow height to be solely driven by cappedWidth
        style={{ height: currentContainerHeight }} // Use dynamic height
      >
        {arcSteps.map((step, index) => {
          const startAngle = Math.PI; // 180 degrees
          const endAngle = 0; // 0 degrees
          const angleStep = (startAngle - endAngle) / (arcSteps.length - 1);
          const currentAngleRad = startAngle - index * angleStep;

          const xPos = centerX + radius * Math.cos(currentAngleRad);
          const yPos = arcCenterY - radius * Math.sin(currentAngleRad);

          return (
            <div
              key={step.name}
              className="absolute flex flex-col items-center p-1 sm:p-2 bg-gray-800 rounded-full shadow-lg z-10 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 justify-center text-center border-2 sm:border-4 border-blue-600"
              style={{
                top: `${yPos}px`,
                left: `${xPos}px`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              <div className="mb-1 text-base sm:text-lg">{step.icon}</div>
              <span className="text-xs sm:text-sm font-semibold text-gray-100">
                {step.name}
              </span>
            </div>
          );
        })}
        {/* Background arc (the "chain") */}
        <svg
          className="absolute inset-0 z-0"
          viewBox={`0 0 ${currentContainerWidth} ${currentContainerHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transformOrigin: "center center" }}
        >
          <path
            d={`M ${
              centerX - radius
            } ${arcCenterY} A ${radius} ${radius} 0 0 0 ${
              centerX + radius
            } ${arcCenterY}`}
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="10 10"
          />
        </svg>
      </div>
    </motion.section>
  );
};

export default PanicCrisisArc;
