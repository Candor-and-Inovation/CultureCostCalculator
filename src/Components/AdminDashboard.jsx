// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
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
import * as LucideIcons from "lucide-react"; // For icons in the dashboard
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // New state for auth status
  const navigate = useNavigate();

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- Authentication Check First ---
      const authCheckRes = await fetch(`${backendUrl}/api/admin/check-auth`);
      if (authCheckRes.status === 401 || authCheckRes.status === 403) {
        setIsAdminAuthenticated(false);
        // Redirect immediately if not authorized
        navigate("/"); // Redirect to home page
        // Throw error to stop further data fetching
        throw new Error("Admin not authorized. Redirecting to home.");
      }
      if (!authCheckRes.ok) {
        setIsAdminAuthenticated(false);
        // If auth check fails for other reasons (e.g., server error), show error and redirect
        navigate("/");
        throw new Error(
          `Authentication check failed: HTTP error! status: ${authCheckRes.status}. Redirecting to home.`
        );
      }
      setIsAdminAuthenticated(true); // Admin is authenticated, proceed to fetch data

      // --- Fetch Dashboard Data ---
      const statsRes = await fetch(`${backendUrl}/api/admin/stats`);
      if (!statsRes.ok)
        throw new Error(
          `Failed to fetch stats: HTTP error! status: ${statsRes.status}`
        );
      const statsData = await statsRes.json();
      setStats(statsData);

      const eventsRes = await fetch(`${backendUrl}/api/admin/events`);
      if (!eventsRes.ok)
        throw new Error(
          `Failed to fetch events: HTTP error! status: ${eventsRes.status}`
        );
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      const customersRes = await fetch(`${backendUrl}/api/admin/customers`);
      if (!customersRes.ok)
        throw new Error(
          `Failed to fetch customers: HTTP error! status: ${customersRes.status}`
        );
      const customersData = await customersRes.json();
      const sortedCustomers = customersData.sort((a, b) =>
        a.name
          ? a.name.localeCompare(b.name || "")
          : a.email
          ? a.email.localeCompare(b.email || "")
          : 0
      );
      setCustomers(sortedCustomers);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Only set error state if it's not an intentional redirect
      if (!err.message.includes("Redirecting")) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper to format Firestore Timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    const date = new Date(
      timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000
    );
    return date.toLocaleString(); // Adjust to your preferred locale format
  };

  // Helper to identify repeat customers
  const isRepeatCustomer = (customer) => customer.totalBookings > 1;

  // Data for charts
  const bookingChartData = stats
    ? [
        { name: "Today", bookings: stats.bookingsToday },
        { name: "This Week", bookings: stats.bookingsThisWeek },
        { name: "Total", bookings: stats.totalBookings },
      ]
    : [];

  const eventStatusCounts = events.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(eventStatusCounts).map((status) => ({
    name: status.replace(/_/g, " "),
    value: eventStatusCounts[status],
  }));

  // Consistent color palette for charts in dark mode
  const CHART_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"]; // Blue, Green, Amber, Red, Gray

  if (loading)
    return (
      <div className="p-5 text-center text-lg text-gray-300">
        Loading admin dashboard...
      </div>
    );

  // This block will now only be reached if isAdminAuthenticated is false AND no redirect happened
  // It's primarily for showing an error if the initial redirect somehow failed or for debugging.
  // In a typical flow, if not authenticated, the user will be redirected by the useEffect.
  if (error && !isAdminAuthenticated) {
    return (
      <div className="p-8 max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl text-center text-gray-200 border border-gray-700">
        <h2 className="text-3xl font-bold text-red-400 mb-6">Access Denied!</h2>
        <p className="text-lg text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => (window.location.href = `${backendUrl}/auth/google`)}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <LucideIcons.Lock className="w-5 h-5 mr-2" /> Login as Admin
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-8 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <LucideIcons.Home className="w-5 h-5 mr-2" /> Go to Home
        </button>
      </div>
    );
  }

  // Render dashboard content if authenticated
  return (
    <div className="p-5 font-sans max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-xl my-8 text-gray-200">
      <h1 className="text-3xl font-bold text-blue-400 text-center mb-8">
        Admin Dashboard 📊
      </h1>

      {/* Statistics Section */}
      <section className="mb-10 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold text-cyan-400 border-b-2 border-gray-700 pb-3 mb-6 flex items-center">
          <LucideIcons.BarChart2 className="w-6 h-6 mr-2" /> Application
          Statistics
        </h2>
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center">
              <LucideIcons.Globe className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-300">
                Total API Requests
              </h3>
              <p className="text-3xl font-bold text-blue-500">
                {stats.totalApiRequests}
              </p>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center">
              <LucideIcons.CheckCircle className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-300">
                Total Bookings
              </h3>
              <p className="text-3xl font-bold text-green-500">
                {stats.totalBookings}
              </p>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center">
              <LucideIcons.CalendarDays className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-300">
                Bookings Today
              </h3>
              <p className="text-3xl font-bold text-yellow-500">
                {stats.bookingsToday}
              </p>
              <small className="text-gray-400 text-xs">
                (Last reset: {new Date(stats.lastResetDay).toLocaleDateString()}
                )
              </small>
            </div>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center">
              <LucideIcons.Calendar className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-300">
                Bookings This Week
              </h3>
              <p className="text-3xl font-bold text-purple-500">
                {stats.bookingsThisWeek}
              </p>
              <small className="text-gray-400 text-xs">
                (Last reset:{" "}
                {new Date(stats.lastResetWeek).toLocaleDateString()})
              </small>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">No statistics available.</p>
        )}

        {/* Charts for Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
            <h3 className="text-xl font-semibold text-blue-300 mb-4 text-center">
              Bookings Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={bookingChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fill: "#E5E7EB" }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#E5E7EB" }} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.1)" }}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#E5E7EB",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                  itemStyle={{ color: "#60A5FA" }}
                />
                <Legend
                  wrapperStyle={{ color: "#E5E7EB", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="bookings"
                  fill="#60A5FA"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
            <h3 className="text-xl font-semibold text-blue-300 mb-4 text-center">
              Event Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#E5E7EB",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                  itemStyle={{ color: "#60A5FA" }}
                />
                <Legend
                  wrapperStyle={{ color: "#E5E7EB", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Customer Profiles Section */}
      <section className="mb-10 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold text-cyan-400 border-b-2 border-gray-700 pb-3 mb-6 flex items-center">
          <LucideIcons.Users className="w-6 h-6 mr-2" /> Customer Profiles
        </h2>
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600 rounded-tl-lg">
                    Name
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Email
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    LinkedIn
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Twitter
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Total Bookings
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Last Booked
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600 rounded-tr-lg">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className={
                      isRepeatCustomer(customer)
                        ? "bg-green-900 bg-opacity-20 hover:bg-opacity-30"
                        : "hover:bg-gray-700"
                    }
                  >
                    <td className="py-3 px-4 border-b border-gray-700">
                      {customer.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {customer.email}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {customer.linkedin ? (
                        <a
                          href={customer.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {customer.twitter ? (
                        <a
                          href={`https://twitter.com/${customer.twitter.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {customer.totalBookings}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {formatTimestamp(customer.lastBooked)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {isRepeatCustomer(customer) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-700 text-green-100">
                          Repeat
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            No customer profiles available.
          </p>
        )}
      </section>

      {/* Event History Section */}
      <section className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-semibold text-cyan-400 border-b-2 border-gray-700 pb-3 mb-6 flex items-center">
          <LucideIcons.History className="w-6 h-6 mr-2" /> Event History
        </h2>
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600 rounded-tl-lg">
                    Timestamp
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Client Name
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Client Email
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600">
                    Meet Link / Message
                  </th>
                  <th className="py-3 px-4 bg-gray-700 text-left text-sm font-semibold text-gray-300 border-b border-gray-600 rounded-tr-lg">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className={
                      event.status !== "success"
                        ? "bg-red-900 bg-opacity-20 hover:bg-opacity-30"
                        : "hover:bg-gray-700"
                    }
                  >
                    <td className="py-3 px-4 border-b border-gray-700">
                      {formatTimestamp(event.timestamp)}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {event.clientDetails?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {event.clientDetails?.email || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusBadgeClasses[event.status]
                        }`}
                      >
                        {event.status?.replace(/_/g, " ") || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {event.googleMeetLink ? ( // Prioritize Google Meet link
                        <a
                          href={event.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:underline flex items-center"
                        >
                          <LucideIcons.Video className="w-4 h-4 mr-1" /> Meet
                          Link
                        </a>
                      ) : event.eventLink ? ( // Fallback to general event link
                        <a
                          href={event.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center"
                        >
                          <LucideIcons.Link className="w-4 h-4 mr-1" /> Event
                          Link
                        </a>
                      ) : (
                        <span className="text-red-500 font-semibold text-sm flex items-center">
                          <LucideIcons.AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {event.errorMessage || "N/A"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700">
                      {event.clientDetails?.date} {event.clientDetails?.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            No event history available.
          </p>
        )}
      </section>
    </div>
  );
};

// Tailwind classes for status badges (moved outside component for clarity)
const statusBadgeClasses = {
  success: "bg-green-700 text-green-100",
  backend_api_error: "bg-red-700 text-red-100",
  backend_auth_failed: "bg-yellow-700 text-yellow-100",
  backend_validation_failed: "bg-red-700 text-red-100",
  frontend_validation_failed: "bg-yellow-700 text-yellow-100", // Not logged by backend, but good to have
  pending: "bg-gray-600 text-gray-200",
};

export default AdminDashboard;
