// src/components/ActionButtons.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import InputField from "./InputField";

const ActionButtons = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [clientTimeZone, setClientTimeZone] = useState("");
  const [clientShortNote, setClientShortNote] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventLink, setEventLink] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState(""); // New state for Google Meet link

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [timeZoneOptions, setTimeZoneOptions] = useState([]);
  const momentLoadedRef = useRef(false);

  // Calculate min and max dates for the input field
  const today = moment().format("YYYY-MM-DD");
  const twoMonthsFromNow = moment().add(2, "months").format("YYYY-MM-DD");

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = id;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadMomentLibraries = async () => {
      try {
        if (!window.moment) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js",
            "moment-script"
          );
        }
        if (!window.moment || !window.moment.tz) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.43/moment-timezone-with-data.min.js",
            "moment-timezone-script"
          );
        }

        if (window.moment && window.moment.tz) {
          const commonTimeZones = [
            { value: "America/New_York", label: "Eastern Time (ET)" },
            { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
            { value: "Europe/London", label: "London (GMT/BST)" },
            { value: "Europe/Berlin", label: "Central European Time (CET)" },
            { value: "Asia/Kolkata", label: "Indian Standard Time (IST)" },
            { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
            {
              value: "Australia/Sydney",
              label: "Australian Eastern Standard Time (AEST)",
            },
          ];
          const existingValues = new Set(commonTimeZones.map((tz) => tz.value));
          const allTimeZones = window.moment.tz
            .names()
            .filter(
              (tz) =>
                tz.includes("/") &&
                !tz.includes("Etc/") &&
                !existingValues.has(tz)
            )
            .map((tz) => ({ value: tz, label: tz }));

          const sortedTimeZones = [...commonTimeZones, ...allTimeZones].sort(
            (a, b) => a.label.localeCompare(b.label)
          );
          setTimeZoneOptions(sortedTimeZones);
          setClientTimeZone(window.moment.tz.guess());
          momentLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error loading moment.js or moment-timezone:", error);
        setBookingMessage(
          "Failed to load time zone features. Please try refreshing."
        );
      }
    };

    loadMomentLibraries();
  }, []);

  const handleBookingClick = () => {
    const now = moment(); // Use moment for current time
    const year = now.format("YYYY");
    const month = now.format("MM");
    const day = now.format("DD");
    setSelectedDate(`${year}-${month}-${day}`);

    const hours = now.format("HH");
    const currentMinutes = now.minutes();
    let roundedMinutes = Math.ceil(currentMinutes / 30) * 30;
    let roundedHours = parseInt(hours);
    if (roundedMinutes === 60) {
      roundedMinutes = 0;
      roundedHours = (roundedHours + 1) % 24;
    }
    setSelectedTime(
      `${String(roundedHours).padStart(2, "0")}:${String(
        roundedMinutes
      ).padStart(2, "0")}`
    );

    setShowBookingModal(true);
    setBookingMessage("");
    setEventLink("");
    setGoogleMeetLink(""); // Clear Meet link on new booking attempt
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setClientName("");
    setClientEmail("");
    setLinkedin("");
    setTwitter("");
    setClientShortNote("");
    setSelectedDate("");
    setSelectedTime("");
    setBookingMessage("");
    setEventLink("");
    setGoogleMeetLink("");
  };

  const handleSubmitBooking = async () => {
    if (
      !clientName ||
      !clientEmail ||
      !selectedDate ||
      !selectedTime ||
      !clientTimeZone
    ) {
      setBookingMessage("Please fill in all required fields.");
      return;
    }

    if (!momentLoadedRef.current) {
      setBookingMessage(
        "Error: Timezone library not loaded yet. Please wait a moment and try again."
      );
      return;
    }

    // --- Frontend Date Validation ---
    const bookingMoment = moment.tz(
      `${selectedDate} ${selectedTime}`,
      clientTimeZone
    );
    const nowInClientTimeZone = moment().tz(clientTimeZone);
    const twoMonthsFromNowInClientTimeZone = moment()
      .tz(clientTimeZone)
      .add(2, "months");

    if (bookingMoment.isBefore(nowInClientTimeZone, "minute")) {
      setBookingMessage("Error: Cannot book meetings for past dates.");
      return;
    }
    if (bookingMoment.isAfter(twoMonthsFromNowInClientTimeZone, "minute")) {
      setBookingMessage(
        "Error: Cannot book meetings more than 2 months in advance."
      );
      return;
    }
    // --- End Frontend Date Validation ---

    setLoading(true);
    setBookingMessage("Booking your meeting...");

    try {
      const clientDateTime = moment.tz(
        `${selectedDate} ${selectedTime}`,
        clientTimeZone
      );
      const istDateTime = clientDateTime.clone().tz("Asia/Kolkata"); // Example for IST conversion
      const istEquivalent = istDateTime.format("YYYY-MM-DD HH:mm z");

      let noteForBackend = clientShortNote;
      if (noteForBackend) {
        noteForBackend += `\n`;
      }
      noteForBackend += `Client Time: ${clientDateTime.format(
        "YYYY-MM-DD HH:mm z"
      )}. IST Equivalent: ${istEquivalent}`;

      const response = await fetch(`${backendUrl}/api/create-calendar-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
          eventDate: selectedDate,
          eventTime: selectedTime,
          linkedin,
          twitter,
          clientTimeZone, // Send timezone to backend for accurate event creation
          clientNote: noteForBackend, // Send full note to backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingMessage(`Success! Meeting booked. ${data.message}`);
        setEventLink(data.eventLink);
        setGoogleMeetLink(data.googleMeetLink); // Capture the Google Meet link
      } else {
        setBookingMessage(`Error: ${data.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Frontend error during booking:", error);
      setBookingMessage(
        "Network error or server unavailable. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (linkToCopy) => {
    if (linkToCopy) {
      const tempInput = document.createElement("input");
      tempInput.value = linkToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setBookingMessage("Link copied to clipboard!");
    }
  };

  const handleAmazonBookRedirection = () => {
    const amazonBookUrl =
      "https://www.amazon.in/Silent-Nods-Lost-Dollars-Psychological/dp/B0DCGQDNJF";
    window.open(amazonBookUrl, "_blank");
  };

  return (
    <motion.section
      className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 w-full max-w-full relative z-10 px-4 sm:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.6 }}
    >
      <motion.button
        onClick={handleBookingClick}
        className="flex items-center justify-center px-6 py-3 sm:px-10 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-bold rounded-full shadow-lg transition-all duration-300 ease-out"
        whileHover={{
          scale: 1.05,
          backgroundColor: "#2563EB",
          boxShadow: "0 12px 28px rgba(59, 130, 246, 0.6)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <LucideIcons.CalendarDays className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
        Book an Appointment
      </motion.button>

      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" // Added p-4 for mobile padding
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseModal} // Click overlay to close
          >
            <motion.div
              className="bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md relative border border-gray-700 max-h-[90vh] overflow-y-auto" // Added max-h and overflow-y-auto
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700" // Adjusted top/right for better mobile exit
              >
                <LucideIcons.X className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <h3 className="text-xl sm:text-3xl font-bold text-blue-400 mb-6 sm:mb-8 text-center">
                Book Your Appointment 📅
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4">
                <InputField
                  label="Your Name"
                  type="text"
                  value={clientName}
                  onChange={setClientName}
                  placeholder="John Doe"
                  icon={LucideIcons.User}
                />
                <InputField
                  label="Your Email"
                  type="email"
                  value={clientEmail}
                  onChange={setClientEmail}
                  placeholder="john.doe@example.com"
                  icon={LucideIcons.Mail}
                />
                <InputField
                  label="Preferred Date"
                  type="date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  icon={LucideIcons.Calendar}
                  min={today} // Set min date to today
                  max={twoMonthsFromNow} // Set max date to 2 months from now
                />
                <InputField
                  label="Preferred Time"
                  type="time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  icon={LucideIcons.Clock}
                />
                <InputField
                  label="Your Time Zone"
                  type="select"
                  value={clientTimeZone}
                  onChange={setClientTimeZone}
                  icon={LucideIcons.Globe}
                  options={timeZoneOptions}
                />
                <InputField
                  label="LinkedIn Profile"
                  type="url"
                  value={linkedin}
                  onChange={setLinkedin}
                  placeholder="https://linkedin.com/in/johndoe"
                  icon={LucideIcons.Linkedin}
                  tooltip="Optional: Share your LinkedIn profile"
                />
                <InputField
                  label="Twitter Handle"
                  type="text"
                  value={twitter}
                  onChange={setTwitter}
                  placeholder="@johndoe"
                  icon={LucideIcons.Twitter}
                  tooltip="Optional: Share your Twitter handle"
                />
                <InputField
                  label="Short Note"
                  type="textarea"
                  value={clientShortNote}
                  onChange={setClientShortNote}
                  placeholder="Any specific topics or questions?"
                  icon={LucideIcons.MessageSquare}
                  tooltip="Optional: Add a short note for the meeting."
                />
              </div>
              <motion.button
                onClick={handleSubmitBooking}
                className={`mt-6 sm:mt-8 w-full flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-emerald-600 text-white text-base sm:text-lg font-bold rounded-full shadow-md transition-colors duration-200
                  ${
                    loading || !momentLoadedRef.current
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-emerald-700"
                  }`}
                whileHover={{
                  scale: loading || !momentLoadedRef.current ? 1 : 1.03,
                  backgroundColor:
                    loading || !momentLoadedRef.current ? "#059669" : "#047857",
                }}
                whileTap={{
                  scale: loading || !momentLoadedRef.current ? 1 : 0.97,
                }}
                disabled={loading || !momentLoadedRef.current}
              >
                {loading ? (
                  <>
                    <LucideIcons.Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                    Booking...
                  </>
                ) : !momentLoadedRef.current ? (
                  <>
                    <LucideIcons.Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                    Loading Timezones...
                  </>
                ) : (
                  "Confirm Booking ✨"
                )}
              </motion.button>
              {bookingMessage && (
                <motion.p
                  className={`mt-4 sm:mt-5 text-center text-sm sm:text-base flex items-center justify-center ${
                    bookingMessage.startsWith("Error")
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {bookingMessage.startsWith("Error") ? (
                    <LucideIcons.AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  ) : (
                    <LucideIcons.CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  )}
                  {bookingMessage}
                  {googleMeetLink && ( // Display Google Meet link if available
                    <motion.button
                      onClick={() => handleCopyLink(googleMeetLink)}
                      className="ml-2 sm:ml-3 p-1 sm:p-2 bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <LucideIcons.Video className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />{" "}
                      Copy Meet Link
                    </motion.button>
                  )}
                  {!googleMeetLink &&
                    eventLink && ( // Fallback to general event link if no Meet link
                      <motion.button
                        onClick={() => handleCopyLink(eventLink)}
                        className="ml-2 sm:ml-3 p-1 sm:p-2 bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <LucideIcons.Link className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />{" "}
                        Copy Event Link
                      </motion.button>
                    )}
                </motion.p>
              )}
              <p className="text-xs text-gray-400 mt-4 sm:mt-5 text-center">
                Your meeting request will be sent to the admin's Google
                Calendar.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleAmazonBookRedirection}
        className="flex items-center justify-center px-6 py-3 sm:px-10 sm:py-4 bg-amber-500 text-gray-900 text-base sm:text-lg font-bold rounded-full shadow-lg transition-all duration-300 ease-out"
        whileHover={{
          scale: 1.05,
          backgroundColor: "#D97706",
          boxShadow: "0 12px 28px rgba(217, 119, 6, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <LucideIcons.BookOpen className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
        Find a Book on Amazon 📚
      </motion.button>
    </motion.section>
  );
};

export default ActionButtons;
