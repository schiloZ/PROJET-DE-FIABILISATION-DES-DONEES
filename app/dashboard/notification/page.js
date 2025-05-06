"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Fetch anomalies from API
  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch("/api/notification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch anomalies");
      }

      const { data } = await response.json();
      // Transform anomaly data into notification format
      const formattedNotifications = data.map((anomaly) => ({
        id: anomaly.id,
        title: `Anomalie remontée pour ${anomaly.clientFullName}`,
        message: anomaly.comments,
        timestamp: new Date(anomaly.clientBirthDate).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setNotifications(formattedNotifications);
      if (formattedNotifications.length === 0) {
        toast("Aucune nouvelle notification ", { icon: "ℹ️" });
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch anomalies on component mount
  useEffect(() => {
    fetchAnomalies();
  }, []);

  // Handle opening delete confirmation modal
  const openDeleteModal = (id) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  // Handle closing delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setNotificationToDelete(null);
  };

  // Handle deleting a notification (anomaly) with confirmation
  const handleDismiss = async () => {
    if (!notificationToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await fetch(
        `/api/notification?id=${notificationToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete anomaly");
      }

      // Remove the notification from the UI
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationToDelete
        )
      );
      toast.success("Anomalie supprimée avec succès");
    } catch (err) {
      toast.error("Échec de la suppression de l'anomalie");
    } finally {
      closeDeleteModal();
    }
  };

  // Handle refreshing notifications
  const handleRefresh = () => {
    fetchAnomalies();
    toast("Chargement de notifications...");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="btn bg-indigo-500 text-white hover:bg-indigo-600 px-3 py-1 rounded-md transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cette anomalie ? Cette action
              est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Notifications
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="btn bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 rounded-md shadow-md transition duration-200"
          >
            Rafraichir
          </button>
        </div>
      </div>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white dark:bg-gray-800 border-l-4 border-indigo-500 shadow-md rounded-lg p-4 flex items-start space-x-4 animate-fade-in"
            >
              {/* Icon */}
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {notification.timestamp}
                </p>
              </div>
              {/* Dismiss Button */}
              {/* <button
                onClick={() => openDeleteModal(notification.id)}
                className="flex-shrink-0 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-full p-1 transition-colors"
                aria-label="Delete anomaly"
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
              </button> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune notification à montrer
          </p>
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
