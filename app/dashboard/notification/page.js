"use client";

import React, { useState } from "react";

const Notification = () => {
  // Sample notification data (replace with API fetch if needed)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Client Added",
      message: "John Doe has been successfully added to the client list.",
      timestamp: "2025-04-29 10:30 AM",
    },
    {
      id: 2,
      title: "Profile Updated",
      message: "Your profile information has been updated successfully.",
      timestamp: "2025-04-29 09:15 AM",
    },
    {
      id: 3,
      title: "Reminder",
      message: "Don't forget to review pending client applications.",
      timestamp: "2025-04-28 03:45 PM",
    },
  ]);

  // Handle dismissing a notification
  const handleDismiss = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white border-l-4 border-indigo-500 shadow-md rounded-lg p-4 flex items-start space-x-4 animate-fade-in"
            >
              {/* Icon (Optional) */}
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              {/* Notification Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.timestamp}
                </p>
              </div>
              {/* Dismiss Button */}
              <button
                onClick={() => handleDismiss(notification.id)}
                className="flex-shrink-0 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-full p-1 transition-colors"
                aria-label="Dismiss notification"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No notifications to display.</p>
        </div>
      )}
    </div>
  );
};

// Custom animation for fade-in effect
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Notification;
