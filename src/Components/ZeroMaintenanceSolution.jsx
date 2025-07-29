import React from "react";
import { motion } from "framer-motion";
import {
  BugsReducedIcon,
  ProactiveReportingIcon,
  CustomerChurnIcon,
} from "../icons/SolutionIcons";

const ZeroMaintenanceSolution = () => (
  <motion.section
    className="text-center mb-8 sm:mb-12 p-6 sm:p-8 rounded-2xl shadow-xl border border-emerald-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1.8 }}
  >
    <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-6 sm:mb-8">
      Zero Maintenance Solution
    </h2>
    <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 sm:px-0">
      At{" "}
      <span className="font-semibold text-emerald-200">
        Candor & Innovation
      </span>
      , we replace panic with psychological safety. No more firefighting.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      <motion.div
        className="p-6 sm:p-8 bg-gray-800 rounded-2xl shadow-lg border border-emerald-700 flex flex-col items-center justify-center"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 12px 28px rgba(16, 185, 129, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.0 }}
      >
        <BugsReducedIcon />
        <h3 className="text-lg sm:text-xl font-semibold text-emerald-300 mb-2 sm:mb-4 mt-2">
          50% Fewer Customer-Reported Bugs
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          Proactive problem identification prevents issues from reaching
          customers.
        </p>
      </motion.div>
      <motion.div
        className="p-6 sm:p-8 bg-gray-800 rounded-2xl shadow-lg border border-sky-700 flex flex-col items-center justify-center"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 12px 28px rgba(59, 130, 246, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.2 }}
      >
        <ProactiveReportingIcon />
        <h3 className="text-xl font-semibold text-sky-300 mb-2 sm:mb-4 mt-2">
          3x More Proactive Problem Reporting
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          Teams feel safe to share problems early when they're cheap to fix.
        </p>
      </motion.div>
      <motion.div
        className="p-6 sm:p-8 bg-gray-800 rounded-2xl shadow-lg border border-indigo-700 flex flex-col items-center justify-center"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 12px 28px rgba(139, 92, 246, 0.4)",
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.4 }}
      >
        <CustomerChurnIcon />
        <h3 className="text-xl font-semibold text-indigo-300 mb-2 sm:mb-4 mt-2">
          25% Lower Customer Churn
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          Better product quality leads to happier, more loyal customers
        </p>
      </motion.div>
    </div>
  </motion.section>
);

export default ZeroMaintenanceSolution;
