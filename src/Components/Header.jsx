import React from "react";
import { motion } from "framer-motion";
import { CandorInnovationLogo } from "../icons/CondorInnovationLogo";

const Header = () => (
  <header className="text-center text-white mb-8 sm:mb-12 w-full max-w-full relative z-10 px-4 sm:px-0">
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-5"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <CandorInnovationLogo />
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-4 sm:mt-0">
        Panic Cost Calculator
      </h1>
    </motion.div>
    <motion.p
      className="text-base sm:text-xl font-light mb-2 text-gray-300 px-4 sm:px-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      Discover the true cost of panic-driven development
    </motion.p>
    <motion.p
      className="text-sm sm:text-lg font-light text-blue-200 px-4 sm:px-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      We make your team Zero Maintenance
    </motion.p>
  </header>
);

export default Header;
