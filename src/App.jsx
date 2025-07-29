// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import Components
import Header from "./Components/Header.jsx";
import PanicCrisisArc from "./Components/PanicCrisisArc.jsx";
import TeamConfiguration from "./Components/TeamConfiguration.jsx";
import TrueCostOfPanic from "./Components/TrueCostOfPanic.jsx";
import ZeroMaintenanceSolution from "./Components/ZeroMaintenanceSolution.jsx";
import ActionButtons from "./Components/ActionButtons.jsx";
import StarBackground from "./Components/StarBackground.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import AdminLoginButton from "./Components/AdminLoginButton.jsx";

// Main App component
const App = () => {
  // State for input fields (kept local for now, will move to Redux later)
  const [developerCost, setDeveloperCost] = useState(900); // ₹/hour
  const [teamSize, setTeamSize] = useState(4);
  const [contextGatheringTime, setContextGatheringTime] = useState(30); // minutes
  const [bugsPerMonth, setBugsPerMonth] = useState(20);
  const [totalUserBase, setTotalUserBase] = useState(20000);
  const [usersAffectedByHiddenBug, setUsersAffectedByHiddenBug] =
    useState(1000);
  const [churnRatePerIncident, setChurnRatePerIncident] = useState(5); // %
  const [averageCustomerValue, setAverageCustomerValue] = useState(10000); // ₹/year
  const [contextLossIncidents, setContextLossIncidents] = useState(100); // % of total bugs
  const [includeNationalCustomerCosts, setIncludeNationalCustomerCosts] =
    useState(false);

  // State for calculated values
  const [wastedDeveloperTimePerBug, setWastedDeveloperTimePerBug] = useState(0);
  const [monthlyWastedDeveloperCost, setMonthlyWastedDeveloperCost] =
    useState(0);
  const [contextLossIncidentsPerMonth, setContextLossIncidentsPerMonth] =
    useState(0);
  const [realAnnualCostDeveloperOnly, setRealAnnualCostDeveloperOnly] =
    useState(0);
  const [totalAnnualCostRootOnly, setTotalAnnualCostRootOnly] = useState(0);

  // State for Admin Login Button visibility
  const [showAdminLoginButton, setShowAdminLoginButton] = useState(false);
  const secretKeySequence = ["A", "D", "M", "I", "N"]; // The secret sequence
  const [typedKeys, setTypedKeys] = useState([]);

  // Function to calculate costs
  const calculateCosts = useCallback(() => {
    const contextGatheringTimeHours = contextGatheringTime / 60;
    const calculatedWastedDeveloperTimePerBug =
      contextGatheringTimeHours * teamSize;
    setWastedDeveloperTimePerBug(calculatedWastedDeveloperTimePerBug);

    const calculatedMonthlyWastedDeveloperCost =
      calculatedWastedDeveloperTimePerBug * bugsPerMonth * developerCost;
    setMonthlyWastedDeveloperCost(calculatedMonthlyWastedDeveloperCost);

    const calculatedContextLossIncidentsPerMonth =
      (bugsPerMonth * contextLossIncidents) / 100;
    setContextLossIncidentsPerMonth(calculatedContextLossIncidentsPerMonth);

    const calculatedRealAnnualCostDeveloperOnly =
      calculatedMonthlyWastedDeveloperCost * 12;
    setRealAnnualCostDeveloperOnly(calculatedRealAnnualCostDeveloperOnly);

    let calculatedTotalAnnualCostRootOnly =
      calculatedRealAnnualCostDeveloperOnly;
    if (includeNationalCustomerCosts) {
      const customerChurnCost =
        (usersAffectedByHiddenBug *
          (churnRatePerIncident / 100) *
          averageCustomerValue *
          bugsPerMonth *
          12) /
        totalUserBase;
      calculatedTotalAnnualCostRootOnly += customerChurnCost;
    }
    setTotalAnnualCostRootOnly(calculatedTotalAnnualCostRootOnly);
  }, [
    developerCost,
    teamSize,
    contextGatheringTime,
    bugsPerMonth,
    totalUserBase,
    usersAffectedByHiddenBug,
    churnRatePerIncident,
    averageCustomerValue,
    contextLossIncidents,
    includeNationalCustomerCosts,
  ]);

  // Recalculate costs whenever relevant state changes
  useEffect(() => {
    calculateCosts();
  }, [calculateCosts]);

  // Effect for secret key sequence
  useEffect(() => {
    const handleKeyDown = (event) => {
      const newTypedKeys = [...typedKeys, event.key.toUpperCase()];
      setTypedKeys(newTypedKeys);

      // Check if the sequence matches
      const currentSequence = newTypedKeys.slice(-secretKeySequence.length);
      if (
        currentSequence.length === secretKeySequence.length &&
        currentSequence.every((key, index) => key === secretKeySequence[index])
      ) {
        setShowAdminLoginButton(true);
        setTypedKeys([]); // Reset typed keys after successful sequence
        // Optionally, remove the event listener after success if you only want it once
        // window.removeEventListener('keydown', handleKeyDown);
      } else if (newTypedKeys.length > secretKeySequence.length) {
        // Keep only the last few keys to prevent array from growing indefinitely
        setTypedKeys(newTypedKeys.slice(-secretKeySequence.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [typedKeys, secretKeySequence]); // Depend on typedKeys to re-run effect when it changes

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 font-sans text-gray-100 flex flex-col items-center relative overflow-hidden">
        <StarBackground />

        {/* Header with Navigation and Admin Login Button */}
        <header className="w-full bg-gray-900 p-4 shadow-lg relative z-20">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-white text-lg font-semibold hover:text-blue-300 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/admin"
                className="text-white text-lg font-semibold hover:text-blue-300 transition-colors duration-200"
              >
                Admin Dashboard
              </Link>
            </div>
            {/* AdminLoginButton is now conditionally rendered based on showAdminLoginButton state */}
            <AdminLoginButton isVisible={showAdminLoginButton} />
          </nav>
        </header>

        <main className="w-full flex-grow flex flex-col items-center relative z-10 px-4 sm:px-8 pb-8">
          <Routes>
            {/* Main Panic Cost Calculator Route */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl bg-transparent rounded-2xl shadow-2xl p-6 sm:p-10 relative z-10">
                    <PanicCrisisArc />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-8">
                      <TeamConfiguration
                        developerCost={developerCost}
                        setDeveloperCost={setDeveloperCost}
                        teamSize={teamSize}
                        setTeamSize={setTeamSize}
                        contextGatheringTime={contextGatheringTime}
                        setContextGatheringTime={setContextGatheringTime}
                        bugsPerMonth={bugsPerMonth}
                        setBugsPerMonth={setBugsPerMonth}
                        totalUserBase={totalUserBase}
                        setTotalUserBase={setTotalUserBase}
                        usersAffectedByHiddenBug={usersAffectedByHiddenBug}
                        setUsersAffectedByHiddenBug={
                          setUsersAffectedByHiddenBug
                        }
                        churnRatePerIncident={churnRatePerIncident}
                        setChurnRatePerIncident={setChurnRatePerIncident}
                        averageCustomerValue={averageCustomerValue}
                        setAverageCustomerValue={setAverageCustomerValue}
                        contextLossIncidents={contextLossIncidents}
                        setContextLossIncidents={setContextLossIncidents}
                        includeNationalCustomerCosts={
                          includeNationalCustomerCosts
                        }
                        setIncludeNationalCustomerCosts={
                          setIncludeNationalCustomerCosts
                        }
                      />
                      <TrueCostOfPanic
                        wastedDeveloperTimePerBug={wastedDeveloperTimePerBug}
                        monthlyWastedDeveloperCost={monthlyWastedDeveloperCost}
                        contextLossIncidentsPerMonth={
                          contextLossIncidentsPerMonth
                        }
                        realAnnualCostDeveloperOnly={
                          realAnnualCostDeveloperOnly
                        }
                        totalAnnualCostRootOnly={totalAnnualCostRootOnly}
                      />
                    </div>

                    <ZeroMaintenanceSolution />
                    <motion.div
                      className="flex flex-col items-center mt-12 mb-8 relative z-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.8, duration: 0.5 }}
                    >
                      <motion.div
                        className="text-blue-400 mb-6"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      >
                        <LucideIcons.ArrowDown size={48} />
                      </motion.div>
                      <p className="text-xl text-gray-300 font-semibold mb-8">
                        Ready to reduce your panic costs?
                      </p>
                      <ActionButtons />
                    </motion.div>
                  </div>
                </>
              }
            />

            {/* Admin Dashboard Route */}
            <Route
              path="/admin"
              element={
                <div className="w-full max-w-7xl mx-auto mt-8">
                  <AdminDashboard />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
