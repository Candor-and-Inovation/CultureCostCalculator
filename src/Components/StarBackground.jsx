import React from "react";
import { motion } from "framer-motion";

const StarBackground = () => {
  const stars = Array.from({ length: 600 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 + "%",
    y: Math.random() * 100 + "%",
    size: Math.random() * 2 + 2,
    duration: Math.random() * 5 + 2,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.8 + 0.6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: star.x,
            top: star.y,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, star.opacity, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
