"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiEdit2,
  FiEye,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Client = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clientsPerPage = 8;

  // Filter states
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registrationDateFilter, setRegistrationDateFilter] = useState("");

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Veuillez vous connecter pour continuer");
        }

        const response = await fetch("/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Erreur lors de la récupération des données"
          );
        }

        const data = await response.json();
        console.log("Fetched clients:", data); // Debug the API response
        // Filter out invalid entries and normalize data
        const validClients = data
          .filter(
            (client) =>
              client &&
              typeof client.firstName === "string" &&
              typeof client.lastName === "string"
          )
          .map((client) => ({
            ...client,
            firstName: client.firstName.trim(),
            lastName: client.lastName.trim(),
          }));
        setClients(validClients);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setClients([]);
        if (err.message.includes("connecter")) {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  // Filter clients based on all criteria
  const filteredClients = clients.filter((client) => {
    // Ensure firstName and lastName are strings and trim them
    const firstName = (client.firstName || "").trim();
    const lastName = (client.lastName || "").trim();

    // Case-insensitive matching
    const matchesFirstName = firstName
      .toLowerCase()
      .includes(firstNameFilter.trim().toLowerCase());
    const matchesLastName = lastName
      .toLowerCase()
      .includes(lastNameFilter.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "All" || client.status === statusFilter;

    // Filter by registration date (exact match for the date)
    let matchesDate = true;
    if (registrationDateFilter) {
      const clientDate = new Date(client.createdAt);
      const filterDate = new Date(registrationDateFilter);
      // Compare only the date part (ignoring time)
      matchesDate =
        clientDate.getFullYear() === filterDate.getFullYear() &&
        clientDate.getMonth() === filterDate.getMonth() &&
        clientDate.getDate() === filterDate.getDate();
    }

    // Debug filter matches
    console.log(`Client: ${firstName} ${lastName}`, {
      matchesFirstName,
      matchesLastName,
      matchesStatus,
      matchesDate,
    });

    return matchesFirstName && matchesLastName && matchesStatus && matchesDate;
  });

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handleView = (clientId) => {
    router.push(`/dashboard/clients/${clientId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Gestion des Clients
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-6 text-center text-red-500 text-lg">{error}</div>
        )}

        {/* Filters Section */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Filter by First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher par prénom..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={firstNameFilter}
                    onChange={(e) => setFirstNameFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter by Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={lastNameFilter}
                    onChange={(e) => setLastNameFilter(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter by Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">Tous</option>
                  <option value="NON FIABILISER">Non fiabilisé</option>
                  <option value="PENDING">En attente</option>
                  <option value="FIABILISEE">Fiabilisée</option>
                  <option value="REJECTED">Rejetée</option>
                </select>
              </div>

              {/* Filter by Registration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'inscription
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={registrationDateFilter}
                  onChange={(e) => setRegistrationDateFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nom Complet
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Téléphone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date d'Inscription
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentClients.length > 0 ? (
                    currentClients.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {(client.firstName || "").charAt(0)}
                                {(client.lastName || "").charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.firstName || ""} {client.lastName || ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`${client.mobile1Prefix || ""} ${
                            client.mobile1Number || "N/A"
                          }`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.createdAt
                            ? new Date(client.createdAt).toLocaleDateString(
                                "fr-FR"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.status === "FIABILISEE"
                                ? "bg-green-100 text-green-800"
                                : client.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : client.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {client.status === "FIABILISEE"
                              ? "Fiabilisée"
                              : client.status === "PENDING"
                              ? "En attente"
                              : client.status === "REJECTED"
                              ? "Rejetée"
                              : "Non fiabilisé"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(client.id)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                              title="Voir"
                            >
                              <FiEye className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Aucun client trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredClients.length > clientsPerPage && (
              <div className="flex items-center justify-between mt-4 px-6 py-3 bg-gray-50 rounded-b-lg">
                <div className="text-sm text-gray-700">
                  Affichage de{" "}
                  <span className="font-medium">{indexOfFirstClient + 1}</span>{" "}
                  à{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastClient, filteredClients.length)}
                  </span>{" "}
                  sur{" "}
                  <span className="font-medium">{filteredClients.length}</span>{" "}
                  clients
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-1 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Client;
