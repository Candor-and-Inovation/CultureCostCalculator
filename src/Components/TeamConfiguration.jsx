import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import InputField from "./InputField";

const TeamConfiguration = ({
  developerCost,
  setDeveloperCost,
  teamSize,
  setTeamSize,
  contextGatheringTime,
  setContextGatheringTime,
  bugsPerMonth,
  setBugsPerMonth,
  totalUserBase,
  setTotalUserBase,
  usersAffectedByHiddenBug,
  setUsersAffectedByHiddenBug,
  churnRatePerIncident,
  setChurnRatePerIncident,
  averageCustomerValue,
  setAverageCustomerValue,
  contextLossIncidents,
  setContextLossIncidents,
  includeNationalCustomerCosts,
  setIncludeNationalCustomerCosts,
}) => (
  <motion.section
    className="rounded-2xl shadow-xl border border-gray-800 p-6 sm:p-8"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 1.2 }}
  >
    <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6 sm:mb-8 border-b pb-4 border-gray-800">
      Your Team Configuration
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-4">
      <InputField
        label="Developer Cost"
        value={developerCost}
        onChange={setDeveloperCost}
        type="number"
        unit="₹/hour"
        tooltip="Average hourly cost of a developer."
        icon={LucideIcons.DollarSign}
      />
      <InputField
        label="Team Size"
        value={teamSize}
        onChange={setTeamSize}
        type="number"
        tooltip="Number of people involved in bug handling."
        icon={LucideIcons.Users}
      />
      <InputField
        label="Context Gathering Time Per Person"
        value={contextGatheringTime}
        onChange={setContextGatheringTime}
        type="number"
        unit="minutes"
        tooltip="Time each person spends understanding the bug context."
        icon={LucideIcons.Clock}
      />
      <InputField
        label="Bugs per Month"
        value={bugsPerMonth}
        onChange={setBugsPerMonth}
        type="number"
        tooltip="Average number of bugs encountered monthly."
        icon={LucideIcons.Bug}
      />
      <InputField
        label="Total User Base"
        value={totalUserBase}
        onChange={setTotalUserBase}
        type="number"
        tooltip="Total number of users for your product/service."
        icon={LucideIcons.Users}
      />
      <InputField
        label="Users Affected by Hidden Bug"
        value={usersAffectedByHiddenBug}
        onChange={setUsersAffectedByHiddenBug}
        type="number"
        unit="users"
        tooltip="Number of users impacted by a single hidden bug."
        icon={LucideIcons.TrendingDown}
      />
      <InputField
        label="Churn Rate per Incident"
        value={churnRatePerIncident}
        onChange={setChurnRatePerIncident}
        type="number"
        unit="%"
        tooltip="Percentage of affected users who churn due to an incident."
        icon={LucideIcons.TrendingUp}
      />
      <InputField
        label="Average Customer Value"
        value={averageCustomerValue}
        onChange={setAverageCustomerValue}
        type="number"
        unit="₹/year"
        tooltip="Average annual revenue generated per customer. Optional for notional calculation."
        icon={LucideIcons.DollarSign}
      />
      <InputField
        label="Context Loss Incidents"
        value={contextLossIncidents}
        onChange={setContextLossIncidents}
        type="number"
        unit="% of total bugs"
        tooltip="Percentage of bugs that lead to significant context loss."
        icon={LucideIcons.GitBranch}
      />
    </div>

    <div className="flex items-center mt-6">
      <input
        type="checkbox"
        id="includeNationalCustomerCosts"
        checked={includeNationalCustomerCosts}
        onChange={(e) => setIncludeNationalCustomerCosts(e.target.checked)}
        className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 bg-gray-700 border-gray-600"
      />
      <label
        htmlFor="includeNationalCustomerCosts"
        className="ml-2 text-gray-200 text-sm cursor-pointer"
      >
        Include Notional Customer Costs
      </label>
    </div>
    <p className="text-xs text-gray-400 mt-2">
      Enable to see theoretical customer churn costs (requires proof of
      concession)
    </p>
  </motion.section>
);

export default TeamConfiguration;
