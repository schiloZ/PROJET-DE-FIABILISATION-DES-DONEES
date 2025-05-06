"use client";
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { jwtDecode } from "jwt-decode";
import {
  FiUser,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

ChartJS.register(...registerables);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    userInfo: {
      name: "",
      role: "",
      avatar: "",
    },
    stats: {
      totalAccounts: 0,
      verifiedAccounts: 0,
      weeklyTarget: 150, // Default target, can be customized
      verificationRate: 0,
    },
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0], // Sun-Sat
    verificationStatus: {
      verified: 0,
      pending: 0,
      rejected: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token non trouvé. Veuillez vous connecter.");
        }

        // Decode token to get user info
        const decoded = jwtDecode(token);
        const { firstName, lastName, role } = decoded;
        const fullName = `${firstName} ${lastName}`;
        const avatar = `${firstName?.[0] || ""}${
          lastName?.[0] || ""
        }`.toUpperCase();

        // Fetch account statistics from your API
        const response = await fetch("/api/clients/stats/compte_par_semaine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const statsData = await response.json();

        setDashboardData({
          userInfo: {
            name: fullName,
            role: role || "Agent de collecte",
            avatar: avatar || "UI",
          },
          stats: {
            totalAccounts: statsData.totalAccounts || 0,
            verifiedAccounts: statsData.verificationStatus?.verified || 0,
            weeklyTarget: statsData.weeklyTarget || 150,
            verificationRate: statsData.verificationRate || 0,
          },
          weeklyProgress: statsData.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
          verificationStatus: statsData.verificationStatus || {
            verified: 0,
            pending: 0,
            rejected: 0,
          },
        });
      } catch (err) {
        console.error("Échec dans le chargement du dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data configurations
  const weeklyChartData = {
    labels: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    datasets: [
      {
        label: "Comptes collectés",
        data: dashboardData.weeklyProgress,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const verificationChartData = {
    labels: ["Fiabilisés", "Non Fiabilisés", "Anomalies"],
    datasets: [
      {
        data: [
          dashboardData.verificationStatus.verified,
          dashboardData.verificationStatus.pending,
          dashboardData.verificationStatus.rejected,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">
            Chargement du tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Erreur de chargement
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Tableau de bord - Performance de collecte
      </h1>

      {/* Profile and Key Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {dashboardData.userInfo.avatar}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {dashboardData.userInfo.name}
                </h2>
                <p className="text-gray-500">{dashboardData.userInfo.role}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Dernière activité: Aujourd'hui,{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Collected Accounts */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <FiUser className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">
                Comptes collectés
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {dashboardData.stats.totalAccounts}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Cible: {dashboardData.stats.weeklyTarget}/semaine
            </p>
          </div>

          {/* Verified Accounts */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">
                Comptes fiabilisés
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {dashboardData.stats.verifiedAccounts}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Taux: {dashboardData.stats.verificationRate}%
            </p>
          </div>

          {/* Pending Accounts */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-full bg-yellow-50 text-yellow-600">
                <FiClock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">En attente</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {dashboardData.verificationStatus.pending}
            </p>
            <p className="text-xs text-gray-500 mt-1">Validation en cours</p>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-full bg-purple-50 text-purple-600">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">Performance</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {dashboardData.stats.totalAccounts > 0
                ? Math.round(
                    (dashboardData.stats.totalAccounts /
                      dashboardData.stats.weeklyTarget) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-xs text-gray-500 mt-1">Objectif hebdo</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Activité hebdomadaire - Comptes collectés
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1" />
              <span>Cette semaine</span>
            </div>
          </div>
          <div className="h-80">
            <Bar
              data={weeklyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Nombre de comptes",
                    },
                    ticks: {
                      stepSize: 1,
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Jours de la semaine",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Verification Status Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Statut de vérification
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <FiCheckCircle className="mr-1" />
              <span>Fiabilisation</span>
            </div>
          </div>
          <div className="h-80">
            <Pie
              data={verificationChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Performance Summary Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Résumé des performances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-start mb-4">
              <div className="p-2 rounded-full bg-blue-50 text-blue-600 mr-3">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Progression hebdomadaire
                </h3>
                <p className="text-gray-600 text-sm">
                  Vous avez collecté {dashboardData.stats.totalAccounts} comptes
                  cette semaine, ce qui représente{" "}
                  {dashboardData.stats.totalAccounts > 0
                    ? Math.round(
                        (dashboardData.stats.totalAccounts /
                          dashboardData.stats.weeklyTarget) *
                          100
                      )
                    : 0}
                  % de votre objectif.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-full bg-green-50 text-green-600 mr-3">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Taux de fiabilisation
                </h3>
                <p className="text-gray-600 text-sm">
                  {dashboardData.stats.verificationRate}% des comptes collectés
                  ont été validés comme fiables.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-4">
              <div className="p-2 rounded-full bg-yellow-50 text-yellow-600 mr-3">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Meilleur jour
                </h3>
                <p className="text-gray-600 text-sm">
                  {Math.max(...dashboardData.weeklyProgress) > 0
                    ? `Avec ${Math.max(
                        ...dashboardData.weeklyProgress
                      )} comptes collectés`
                    : "Aucune donnée disponible"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-full bg-red-50 text-red-600 mr-3">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Statut des comptes
                </h3>
                <p className="text-gray-600 text-sm">
                  {dashboardData.verificationStatus.pending} comptes sont en
                  attente de validation et{" "}
                  {dashboardData.verificationStatus.rejected} ont été rejetés
                  pour cause d'anomalies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
