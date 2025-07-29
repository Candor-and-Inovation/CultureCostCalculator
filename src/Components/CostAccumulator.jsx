import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CostAccumulator = ({ annualCost }) => {
  const [currentAccumulatedCost, setCurrentAccumulatedCost] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);

  const costPerMinute = annualCost / (365 * 24 * 60);
  const costPerHour = annualCost / (365 * 24);
  const costPerDay = annualCost / 365;

  useEffect(() => {
    if (annualCost === 0) {
      setCurrentAccumulatedCost(0);
      return;
    }

    const animateCost = () => {
      const elapsedTimeInMilliseconds = Date.now() - startTimeRef.current;
      const elapsedMinutes = elapsedTimeInMilliseconds / (1000 * 60);
      setCurrentAccumulatedCost(costPerMinute * elapsedMinutes);
      animationFrameRef.current = requestAnimationFrame(animateCost);
    };

    startTimeRef.current = Date.now();
    setCurrentAccumulatedCost(0);
    animationFrameRef.current = requestAnimationFrame(animateCost);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [annualCost, costPerMinute]);

  return (
    <motion.div
      className="text-center mt-6 p-4 bg-gray-800 rounded-2xl shadow-inner border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.0 }}
    >
      <div className="text-base sm:text-lg font-medium text-blue-300 mb-2">
        Live Cost Accumulation
      </div>
      <motion.div
        key={Math.floor(currentAccumulatedCost / 100)}
        className="text-3xl sm:text-4xl font-extrabold text-red-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, type: "tween" }}
      >
        ₹{" "}
        {currentAccumulatedCost.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </motion.div>
      <p className="text-xs sm:text-sm text-gray-400 mt-2">
        Accumulated in this session:
        <br />
        <span className="font-semibold text-gray-300">
          Current Rate: ₹{" "}
          {costPerMinute.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          / minute
        </span>
        <br />
        <span className="font-semibold text-gray-300">
          Projected: ₹{" "}
          {costPerHour.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          / hour | ₹{" "}
          {costPerDay.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          / day 💸
        </span>
      </p>
    </motion.div>
  );
};

export default CostAccumulator;
