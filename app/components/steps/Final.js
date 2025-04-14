"use client";
import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster
import Link from "next/link"; // Import Link for navigation

const Final = () => {
  const { userData, setUserData } = useContext(StepperContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // Track if user is saved
  const router = useRouter();

  useEffect(() => {
    console.log("All data gathered up to Final step:", userData);
  }, [userData]);

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

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
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

      console.log("Registration response:", data);
      toast.success("Données enregistrées avec succès!", {
        duration: 4000,
        position: "top-center",
      });

      setUserData({});
      setIsSaved(true); // Mark as saved to show the link
    } catch (error) {
      console.error("Error saving data:", error);
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

  return (
    <div className="container md:mt-10">
      <Toaster /> {/* Add Toaster for toast notifications */}
      <div className="flex flex-col items-center">
        <div className="text-green-400">
          <svg
            className="w-24 h-24"
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
        <div className="mt-3 text-xl font-semibold uppercase text-green-500">
          Felicitation !
        </div>
        <div className="text-lg font-semibold text-gray-500">
          Appuyer sur le bouton ci-dessous pour enregistrer le client
        </div>
        {error && <div className="mt-3 text-red-500">{error}</div>}
        {!isSaved ? (
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`mt-10 bg-green-500 hover:bg-green-800 transition-colors duration-50 focus:shadow-outline text-white font-semibold px-6 py-3 rounded-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Enregistrement en cours..."
              : "Donnée du Client collectée avec succès"}
          </button>
        ) : (
          <div className="mt-10">
            <Link
              href="/" // Adjust this route to your new user creation page
              className="text-blue-500 hover:underline font-semibold"
            >
              Enregistrer un nouveau client
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Final;
