import React from "react";
import { motion } from "framer-motion";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  unit = "",
  placeholder = "",
  tooltip = "",
  icon: IconComponent,
  options = [],
}) => (
  <motion.div
    className="mb-3 sm:mb-4 relative group"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-gray-200 text-xs sm:text-sm font-bold mb-1 sm:mb-2 flex items-center">
      {IconComponent && (
        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-cyan-300" />
      )}
      {label} {unit && <span className="text-gray-400 text-xs">({unit})</span>}
    </label>
    {type === "select" ? (
      <motion.select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shadow-lg appearance-none border border-gray-700 rounded-xl sm:rounded-2xl w-full py-2 px-3 sm:py-3 sm:px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 transition-all duration-200 placeholder-gray-500 text-sm sm:text-base"
        whileFocus={{
          borderColor: "#2563EB",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
    ) : type === "textarea" ? (
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shadow-lg appearance-none border border-gray-700 rounded-xl sm:rounded-2xl w-full py-2 px-3 sm:py-3 sm:px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 transition-all duration-200 placeholder-gray-500 min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
        placeholder={placeholder}
        whileFocus={{
          borderColor: "#2563EB",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
        }}
      />
    ) : (
      <motion.input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            type === "number" ? parseFloat(e.target.value) : e.target.value
          )
        }
        className="shadow-lg appearance-none border border-gray-700 rounded-xl sm:rounded-2xl w-full py-2 px-3 sm:py-3 sm:px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 transition-all duration-200 placeholder-gray-500 text-sm sm:text-base"
        placeholder={placeholder}
        whileFocus={{
          borderColor: "#2563EB",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
        }}
      />
    )}
    {tooltip && (
      <div className="absolute left-full ml-2 top-0 p-2 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 hidden sm:block">
        {tooltip}
      </div>
    )}
  </motion.div>
);

export default InputField;
