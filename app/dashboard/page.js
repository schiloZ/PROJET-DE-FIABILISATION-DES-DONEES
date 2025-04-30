"use client";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import {
  FiUser,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiAlertCircle,
} from "react-icons/fi";

ChartJS.register(...registerables);

const Dashboard = () => {
  // Données simulées
  const userData = {
    name: "Jean Dupont",
    role: "Agent de collecte",
    avatar: "JD",
    stats: {
      totalAccounts: 124,
      verifiedAccounts: 89,
      weeklyTarget: 150,
      verificationRate: 72,
    },
    weeklyProgress: [25, 32, 28, 40, 35, 42, 38], // Comptes collectés par jour de la semaine
    verificationStatus: {
      verified: 89,
      pending: 22,
      rejected: 13,
    },
  };

  // Données pour le graphique hebdomadaire
  const weeklyData = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Comptes collectés",
        data: userData.weeklyProgress,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique de vérification
  const verificationData = {
    labels: ["Fiabilisés", "En attente", "Rejetés"],
    datasets: [
      {
        data: [
          userData.verificationStatus.verified,
          userData.verificationStatus.pending,
          userData.verificationStatus.rejected,
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Tableau de bord - Performance de collecte
      </h1>

      {/* Section profil et indicateurs clés */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Carte profil */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {userData.avatar}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {userData.name}
                </h2>
                <p className="text-gray-500">{userData.role}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Dernière activité: Aujourd'hui, 14:30
              </p>
            </div>
          </div>
        </div>

        {/* Grille d'indicateurs */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Comptes collectés */}
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
              {userData.stats.totalAccounts}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Cible: {userData.stats.weeklyTarget}/semaine
            </p>
          </div>

          {/* Comptes fiabilisés */}
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
              {userData.stats.verifiedAccounts}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Taux: {userData.stats.verificationRate}%
            </p>
          </div>

          {/* En attente */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-full bg-yellow-50 text-yellow-600">
                <FiClock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">En attente</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {userData.verificationStatus.pending}
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
              {Math.round(
                (userData.stats.totalAccounts / userData.stats.weeklyTarget) *
                  100
              )}
              %
            </p>
            <p className="text-xs text-gray-500 mt-1">Objectif hebdo</p>
          </div>
        </div>
      </div>

      {/* Section graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Graphique hebdomadaire */}
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
              data={weeklyData}
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

        {/* Graphique de vérification */}
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
              data={verificationData}
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

      {/* Section récapitulative */}
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
                  Vous avez collecté {userData.stats.totalAccounts} comptes
                  cette semaine, ce qui représente{" "}
                  {Math.round(
                    (userData.stats.totalAccounts /
                      userData.stats.weeklyTarget) *
                      100
                  )}
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
                  {userData.stats.verificationRate}% des comptes collectés ont
                  été validés comme fiables.
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
                  Jeudi avec {Math.max(...userData.weeklyProgress)} comptes
                  collectés.
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
                  {userData.verificationStatus.pending} comptes sont en attente
                  de validation et {userData.verificationStatus.rejected} ont
                  été rejetés.
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
