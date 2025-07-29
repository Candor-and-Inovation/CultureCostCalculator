import React from "react";
import { motion } from "framer-motion";

export const CandorInnovationLogo = () => (
  <svg
    className="h-16 w-auto mr-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M12 2L2 12h5v10h10V12h5L12 2z"
      fill="#3B82F6"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    <motion.path
      d="M12 6.828L17.172 12H14v6H10v-6H6.828L12 6.828z"
      fill="url(#paint0_linear)"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="12"
        y1="6.828"
        x2="12"
        y2="18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);
