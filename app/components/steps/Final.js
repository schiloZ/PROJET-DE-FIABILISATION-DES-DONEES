"use client";
import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

const Final = ({ handleBack, resetForm }) => {
  const { userData, setUserData, currentStep, setCurrentStep } =
    useContext(StepperContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter();

  // Group data by category for better organization
  const groupedData = {
    "Informations Personnelles": {
      Nom: userData.lastName,
      Prénom: userData.firstName,
      "Nom de jeune fille": userData.maidenName,
      "Nom de la mère": userData.motherName,
      "Date de naissance": userData.birthDate,
      "Lieu de naissance": userData.birthPlace,
      "Pays de naissance": userData.birthCountry,
      Nationalité: userData.nationality,
      Sexe: userData.gender === "M" ? "Masculin" : "Féminin",
      "Situation matrimoniale": userData.maritalStatus,
      "Nombre d'enfants": userData.numberOfChildren,
    },
    "Pièce d'Identité": {
      "Type de pièce": userData.identityType,
      "Numéro de pièce": userData.identityNumber,
      "Date d'émission": userData.issueDate,
      "Lieu d'émission": userData.issuePlace,
      "Date d'expiration": userData.expiryDate,
    },
    Coordonnées: {
      Adresse: userData.address,
      "Pays de résidence": userData.residenceCountry,
      "Téléphone 1": userData.mobile1Number,
      "Téléphone 2": userData.mobile2Number,
      Email: userData.email,
    },
    "Informations Professionnelles": {
      "Secteur d'activité": userData.activitySector,
      Fonction: userData.jobFunction,
      "Type de contrat": userData.contractType,
      "Autres activités": userData.otherActivities,
      "Revenu annuel": userData.incomeRange,
      "Autres revenus": userData.otherIncome,
      "Conjoint - Profession": userData.spouseOccupation,
      "Conjoint - Employeur": userData.spouseEmployer,
      "Conjoint - Fonction": userData.spouseJobFunction,
    },
    "Informations Bancaires": {
      "Type de compte": userData.accountType,
      "Numéro de compte épargne": userData.savingsAccountNumber,
      "Numéro client": userData.clientNumber,
      Agence: userData.agence,
      "Domiciliation bancaire": userData.bankDomiciliation,
    },
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      for (const key in userData) {
        if (
          key === "clientPhoto" ||
          key === "clientSignature" ||
          key === "cniBack" ||
          key === "cniFront"
        ) {
          if (userData[key]) {
            formData.append(key, userData[key]);
          }
        } else {
          formData.append(key, userData[key] || "");
        }
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save data");
      }

      toast.success("Données enregistrées avec succès!", {
        duration: 4000,
        position: "top-center",
      });

      setUserData({});
      setIsSaved(true);
    } catch (error) {
      toast.error(
        error.message === "Cet utilisateur existe déjà avec cet email."
          ? "Cet utilisateur existe déjà."
          : error.message,
        {
          duration: 4000,
          position: "top-center",
        }
      );
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewClient = () => {
    setUserData({}); // Reset userData
    setIsSaved(false); // Reset saved state
    setCurrentStep(1); // Navigate to first step
  };
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="text-green-500 mx-auto w-24 h-24">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 
                7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Récapitulatif des Informations
          </h1>
          <p className="text-gray-600">
            Veuillez vérifier toutes les informations avant soumission
          </p>
        </div>

        {/* Data Review Sections */}
        {!isSaved &&
          Object.entries(groupedData).map(([category, fields]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold bg-gray-100 p-3 rounded-t-lg border-b border-gray-200">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-b-lg">
                {Object.entries(fields).map(
                  ([label, value]) =>
                    value && (
                      <div key={label} className="mb-2">
                        <p className="text-sm font-medium text-gray-500">
                          {label}
                        </p>
                        <p className="text-gray-800 font-medium">
                          {value || (
                            <span className="text-gray-400">Non renseigné</span>
                          )}
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          ))}

        {!isSaved && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold bg-gray-100 p-3 rounded-t-lg border-b border-gray-200">
              Fichiers Téléchargés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-100 rounded-b-lg">
              {userData.clientPhoto && (
                <div className="flex flex-col items-start border p-3 rounded shadow-sm bg-white">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Photo du client
                  </p>
                  <img
                    src={URL.createObjectURL(userData.clientPhoto)}
                    alt="Client"
                    className="w-full h-auto rounded-lg shadow object-contain"
                  />
                </div>
              )}
              {userData.clientSignature && (
                <div className="flex flex-col items-start border p-3 rounded shadow-sm bg-white">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Signature du client
                  </p>
                  <img
                    src={URL.createObjectURL(userData.clientSignature)}
                    alt="Signature"
                    className="w-full h-auto rounded-lg shadow object-contain"
                  />
                </div>
              )}
              {userData.cniFront && (
                <div className="flex flex-col items-start border p-3 rounded shadow-sm bg-white">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    CNI Recto
                  </p>
                  <img
                    src={URL.createObjectURL(userData.cniFront)}
                    alt="CNI Recto"
                    className="w-full h-auto rounded-lg shadow object-contain"
                  />
                </div>
              )}
              {userData.cniBack && (
                <div className="flex flex-col items-start border p-3 rounded shadow-sm bg-white">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    CNI Verso
                  </p>
                  <img
                    src={URL.createObjectURL(userData.cniBack)}
                    alt="CNI Verso"
                    className="w-full h-auto rounded-lg shadow object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Retour
          </button>

          <div className="flex flex-col items-center">
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}

            {!isSaved ? (
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all
                  ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enregistrement en cours...
                  </span>
                ) : (
                  "Confirmer l'enregistrement"
                )}
              </button>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-green-600 font-bold text-lg mb-2">
                  Client enregistré avec succès!
                </div>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Enregistrer un nouveau client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Final;
