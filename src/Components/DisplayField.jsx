import React from "react";
import { motion } from "framer-motion";

const DisplayField = ({ label, value, unit = "₹", icon: IconComponent }) => (
  <motion.div
    className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-800 rounded-2xl shadow-inner border border-gray-700"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-xs sm:text-sm font-medium text-gray-400 flex items-center">
      {IconComponent && (
        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-300" />
      )}
      {label}
    </div>
    <motion.div
      key={value}
      className="text-xl sm:text-2xl font-semibold text-cyan-400 mt-1"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {unit}{" "}
      {value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </motion.div>
  </motion.div>
);

export default DisplayField;
