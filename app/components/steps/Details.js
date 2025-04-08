"use client";

import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect, useState, useCallback } from "react";

const Details = ({ setStepValid }) => {
  const { userData, setUserData } = useContext(StepperContext);
  const [errors, setErrors] = useState({});
  const [requiredFields, setRequiredFields] = useState([
    "agence",
    "accountType",
  ]);

  // Fonction pour déterminer les champs requis en fonction du type de compte
  const getRequiredFields = (accountType) => {
    const baseFields = ["agence", "accountType"];
    switch (accountType) {
      case "Compte Epargne":
        return [...baseFields, "savingsAccountNumber"];
      case "Compte Chèque":
        return [...baseFields, "chequeAccountNumber"];
      case "Compte Epargne & Compte Chèque":
        return [...baseFields, "savingsAccountNumber", "chequeAccountNumber"];
      case "Autre Compte (Joint ou Mineur)":
        return [...baseFields, "otherAccountNumber"];
      default:
        return baseFields;
    }
  };

  // Mettre à jour les champs requis lorsque le type de compte change
  useEffect(() => {
    const fields = getRequiredFields(userData.accountType);
    setRequiredFields(fields);
  }, [userData.accountType]);

  const validateFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validation des champs requis
    requiredFields.forEach((field) => {
      if (!userData[field] || userData[field].trim() === "") {
        newErrors[field] = "Ce champ est requis";
        isValid = false;
      }
    });

    // Validation spécifique pour le numéro de compte (doit être numérique et de longueur spécifique)
    if (
      userData["savingsAccountNumber"] &&
      !/^\d{12}$/.test(userData["savingsAccountNumber"]) // Vérifie exactement 12 chiffres
    ) {
      newErrors["savingsAccountNumber"] =
        "Le numéro de compte doit contenir exactement 12 chiffres";
      isValid = false;
    }

    if (
      userData["chequeAccountNumber"] &&
      !/^\d{12}$/.test(userData["chequeAccountNumber"]) // Vérifie exactement 12 chiffres
    ) {
      newErrors["chequeAccountNumber"] =
        "Le numéro de compte doit contenir exactement 12 chiffres";
      isValid = false;
    }

    if (
      userData["otherAccountNumber"] &&
      !/^\d{12}$/.test(userData["otherAccountNumber"]) // Vérifie exactement 12 chiffres
    ) {
      newErrors["otherAccountNumber"] =
        "Le numéro de compte doit contenir exactement 12 chiffres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [userData, requiredFields]);

  useEffect(() => {
    const isValid = validateFields();
    setStepValid(isValid);
  }, [userData, requiredFields, setStepValid, validateFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Agence */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Agence
        </div>
        <input
          type="text"
          name="agence"
          onChange={handleChange}
          value={userData["agence"] || ""}
          placeholder="Exemple: 006"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.agence && (
          <p className="text-red-500 text-xs">{errors.agence}</p>
        )}
      </div>

      {/* Type de comptes */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Type de comptes
        </div>
        <select
          name="accountType"
          onChange={handleChange}
          value={userData["accountType"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez un type</option>
          <option value="Compte Epargne">Compte Epargne</option>
          <option value="Compte Chèque">Compte Chèque</option>
          <option value="Compte Epargne & Compte Chèque">
            Compte Epargne & Compte Chèque
          </option>
          <option value="Autre Compte (Joint ou Mineur)">
            Autre Compte (Joint ou Mineur)
          </option>
        </select>
        {errors.accountType && (
          <p className="text-red-500 text-xs">{errors.accountType}</p>
        )}
      </div>

      {/* Numéro de compte Epargne */}
      {userData["accountType"] === "Compte Epargne" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Numéro de compte Epargne
          </div>
          <input
            type="text"
            name="savingsAccountNumber"
            onChange={handleChange}
            value={userData["savingsAccountNumber"] || ""}
            placeholder="Exemple: 123456789123"
            required
            maxLength={12} // Limite à 12 caractères
            className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          />
          {errors.savingsAccountNumber && (
            <p className="text-red-500 text-xs">
              {errors.savingsAccountNumber}
            </p>
          )}
        </div>
      )}

      {/* Numéro de compte Chèque */}
      {userData["accountType"] === "Compte Chèque" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Numéro de compte Chèque
          </div>
          <input
            type="text"
            name="chequeAccountNumber"
            onChange={handleChange}
            value={userData["chequeAccountNumber"] || ""}
            placeholder="Exemple: 123456789123"
            required
            maxLength={12} // Limite à 12 caractères
            className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          />
          {errors.chequeAccountNumber && (
            <p className="text-red-500 text-xs">{errors.chequeAccountNumber}</p>
          )}
        </div>
      )}

      {/* Numéro de compte Epargne & Compte Chèque */}
      {userData["accountType"] === "Compte Epargne & Compte Chèque" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Numéro de compte Epargne
          </div>
          <input
            type="text"
            name="savingsAccountNumber"
            onChange={handleChange}
            value={userData["savingsAccountNumber"] || ""}
            placeholder="Exemple: 123456789123"
            required
            maxLength={12} // Limite à 12 caractères
            className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          />
          {errors.savingsAccountNumber && (
            <p className="text-red-500 text-xs">
              {errors.savingsAccountNumber}
            </p>
          )}

          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Numéro de compte Chèque
          </div>
          <input
            type="text"
            name="chequeAccountNumber"
            onChange={handleChange}
            value={userData["chequeAccountNumber"] || ""}
            placeholder="Exemple: 123456789123"
            required
            maxLength={12} // Limite à 12 caractères
            className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          />
          {errors.chequeAccountNumber && (
            <p className="text-red-500 text-xs">{errors.chequeAccountNumber}</p>
          )}
        </div>
      )}

      {/* Autre Numéro de compte (Compte Joint ou Mineur) */}
      {userData["accountType"] === "Autre Compte (Joint ou Mineur)" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Autre Numéro de compte (Compte Joint ou Mineur)
          </div>
          <input
            type="text"
            name="otherAccountNumber"
            onChange={handleChange}
            value={userData["otherAccountNumber"] || ""}
            placeholder="Exemple: 123456789123"
            required
            maxLength={12} // Limite à 12 caractères
            className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          />
          {errors.otherAccountNumber && (
            <p className="text-red-500 text-xs">{errors.otherAccountNumber}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Details;
