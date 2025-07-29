import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import DisplayField from "../Components/DisplayField.jsx";
import CostAccumulator from "../Components/CostAccumulator.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const TrueCostOfPanic = ({
  wastedDeveloperTimePerBug,
  monthlyWastedDeveloperCost,
  contextLossIncidentsPerMonth,
  realAnnualCostDeveloperOnly,
  totalAnnualCostRootOnly,
}) => {
  const chartData = [
    { name: "Monthly Dev Cost", value: monthlyWastedDeveloperCost },
    { name: "Annual Dev Cost", value: realAnnualCostDeveloperOnly },
    { name: "Total Annual Cost", value: totalAnnualCostRootOnly },
  ];

  const pieChartData = [
    { name: "Developer Time Waste", value: realAnnualCostDeveloperOnly },
    {
      name: "Customer Churn (Notional)",
      value: totalAnnualCostRootOnly - realAnnualCostDeveloperOnly,
    },
  ].filter((item) => item.value > 0);

  const PIE_COLORS = ["#3B82F6", "#EF4444"];

  return (
    <motion.section
      className="rounded-2xl shadow-xl border border-gray-800 p-6 sm:p-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6 sm:mb-8 border-b pb-4 border-gray-800">
          The True Cost of Panic
        </h2>
        <DisplayField
          label="Wasted Developer Time per Bug"
          value={wastedDeveloperTimePerBug}
          unit="hours"
          icon={LucideIcons.Clock}
        />
        <DisplayField
          label="Monthly Wasted Developer Cost"
          value={monthlyWastedDeveloperCost}
          icon={LucideIcons.DollarSign}
        />
        <DisplayField
          label="Context Loss Incidents per Month"
          value={contextLossIncidentsPerMonth}
          unit="incidents"
          icon={LucideIcons.Bug}
        />
        <DisplayField
          label="REAL Annual Cost (Developer Time Only)"
          value={realAnnualCostDeveloperOnly}
          icon={LucideIcons.BarChart2}
        />
      </div>

      <motion.div
        className="mt-8 sm:mt-10 p-6 sm:p-8 bg-gradient-to-r from-blue-800 to-cyan-800 rounded-2xl text-center shadow-md border border-blue-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className="text-lg sm:text-xl font-medium text-blue-300 mb-2 sm:mb-4">
          Total Annual Cost (Root Only)
        </div>
        <motion.div
          key={totalAnnualCostRootOnly}
          className="text-4xl sm:text-6xl font-extrabold text-blue-200 mb-2 sm:mb-4 animate-pulse"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ₹{" "}
          {totalAnnualCostRootOnly.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </motion.div>
        <p className="text-xs sm:text-sm text-gray-300">
          <span className="font-semibold text-blue-100">Focus on Reality:</span>{" "}
          The REAL measurable cost is developer time waste. This alone equals
          one developer's salary annually.
        </p>
      </motion.div>

      <CostAccumulator annualCost={totalAnnualCostRootOnly} />

      <motion.div
        className="mt-8 sm:mt-10 p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-inner border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4 text-center">
          Cost Breakdown Visualization
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E5E7EB" }}
              itemStyle={{ color: "#60A5FA" }}
              formatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Legend
              wrapperStyle={{
                color: "#E5E7EB",
                paddingTop: "10px",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" fill="#60A5FA" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {pieChartData.length > 1 && (
          <>
            <h3 className="text-lg sm:text-xl font-bold text-blue-300 mt-6 sm:mt-8 mb-4 text-center">
              Annual Cost Contribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#E5E7EB" }}
                  itemStyle={{ color: "#60A5FA" }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Legend
                  wrapperStyle={{
                    color: "#E5E7EB",
                    paddingTop: "10px",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </motion.div>
    </motion.section>
  );
};

export default TrueCostOfPanic;
