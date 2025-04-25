"use client";
import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect, useState, useCallback } from "react";
import countries from "../../utils/data/countries.json";

// Define requiredFields outside the component
const requiredFields = [
  "authorization",
  "identityType",
  "identityNumber",
  "firstName",
  "lastName",
  "birthDate",
  "gender",
  "nationality",
  "birthPlace",
  "birthCountry",
  "expiryDate",
  "issueDate",
  "issuePlace",
  "mobile1Number",
  "email",
  "address",
  "residenceCountry",
];

const PersonalInfo = ({ setStepValid }) => {
  const { userData, setUserData } = useContext(StepperContext);
  const [errors, setErrors] = useState({});

  const validateFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!userData[field] || userData[field].trim() === "") {
        newErrors[field] = "Ce champ est requis";
        isValid = false;
      }
    });

    if (userData["mobile1Number"]) {
      // Validate full phone number with exactly 14 characters (e.g., +2250584185367)
      if (!/^\+\d{13}$/.test(userData["mobile1Number"])) {
        newErrors["mobile1Number"] =
          "Le numéro doit commencer par '+' suivi de 13 chiffres (14 caractères au total)";
        isValid = false;
      }
    }

    if (userData["mobile2Number"]) {
      // Optional mobile2Number validation
      if (!/^\+\d{13}$/.test(userData["mobile2Number"])) {
        newErrors["mobile2Number"] =
          "Le numéro doit commencer par '+' suivi de 13 chiffres (14 caractères au total)";
        isValid = false;
      }
    }

    if (userData.firstName && userData.firstName.length < 3) {
      newErrors.firstName = "Le prénom doit contenir au moins 3 caractères";
      isValid = false;
    }

    if (userData.lastName && userData.lastName.length < 3) {
      newErrors.lastName = "Le nom doit contenir au moins 3 caractères";
      isValid = false;
    }

    if (userData.birthDate) {
      const birthDate = new Date(userData.birthDate);
      const currentDate = new Date();
      const minDate = new Date("1900-01-01");
      if (birthDate < minDate || birthDate > currentDate) {
        newErrors.birthDate =
          "La date de naissance doit être entre 1900 et aujourd'hui";
        isValid = false;
      }
    }

    if (userData.issueDate) {
      const issueDate = new Date(userData.issueDate);
      const currentDate = new Date();
      const minDate = new Date("1940-01-01");
      if (issueDate < minDate || issueDate > currentDate) {
        newErrors.issueDate =
          "La date de délivrance doit être entre 1940 et aujourd'hui";
        isValid = false;
      }
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [userData, setErrors]);

  useEffect(() => {
    const isValid = validateFields();
    setStepValid(isValid);
  }, [validateFields, setStepValid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    console.log("userData:", userData);
    console.log("mobile2Number:", userData.mobile2Number);
  }, [userData]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Authorization */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Je soussigné Mme/Mlle/M ………………. autorise AFG Bank CI à actualiser mes
          informations dans leur base de données.
          <a
            href="https://afgbank.sharepoint.com/:w:/s/PROJETDEFIABILISATIONUAT/EbfuEQfJz5NHhDPxGgP48zsB6DY7nshiZ6rPEgx9fnWYpQ?e=uyNQnZ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-1"
          >
            Lien pour plus de détails
          </a>
        </div>
        <div className="bg-white mt-25 md:mt-10 my-2 p-1 flex gap-2 ">
          <label className="flex items-center">
            <input
              type="radio"
              name="authorization"
              value="accept"
              required
              onChange={handleChange}
              className="mr-2"
            />
            J'accepte
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="authorization"
              value="refuse"
              required
              onChange={handleChange}
              className="mr-2"
            />
            Je refuse
          </label>
        </div>
        {errors.authorization && (
          <p className="text-red-500 text-xs">{errors.authorization}</p>
        )}
      </div>
      {/* Type de pièce d'identité */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Type de pièce d'identité
        </div>
        <select
          name="identityType"
          onChange={handleChange}
          required
          value={userData["identityType"] || ""}
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez un type</option>
          <option value="CNI">CNI</option>
          <option value="Carte Consulaire (CC)">Carte Consulaire (CC)</option>
          <option value="Permis de Conduire + Récépissé CNI">
            Permis de Conduire + Récépissé CNI
          </option>
          <option value="Carte de Résident (CR)">Carte de Résident (CR)</option>
          <option value="other">Autre</option>
        </select>
        {userData["identityType"] === "other" && (
          <div className="mt-2">
            <input
              type="text"
              name="customIdentityType"
              onChange={handleChange}
              value={userData["customIdentityType"] || ""}
              placeholder="Veuillez préciser"
              required
              className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
            />
          </div>
        )}
      </div>
      {errors.identityType && (
        <p className="text-red-500 text-xs">{errors.identityType}</p>
      )}
      {/* N° pièce d’identité */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          N° pièce d’identité
        </div>
        <input
          type="text"
          name="identityNumber"
          onChange={handleChange}
          value={userData["identityNumber"] || ""}
          placeholder="Exemple: CI009878789"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.identityNumber && (
          <p className="text-red-500 text-xs">{errors.identityNumber}</p>
        )}
      </div>
      {/* Prénoms */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Prénoms
        </div>
        <input
          type="text"
          name="firstName"
          onChange={handleChange}
          value={userData["firstName"] || ""}
          placeholder="Exemple: John"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs">{errors.firstName}</p>
        )}
      </div>
      {/* Nom */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Nom
        </div>
        <input
          type="text"
          name="lastName"
          onChange={handleChange}
          value={userData["lastName"] || ""}
          placeholder="Exemple: Doe"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs">{errors.lastName}</p>
        )}
      </div>
      {/* Date de naissance */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date de naissance
        </div>
        <input
          type="date"
          name="birthDate"
          onChange={handleChange}
          value={userData["birthDate"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.birthDate && (
          <p className="text-red-500 text-xs">{errors.birthDate}</p>
        )}
      </div>
      {/* Sexe */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Sexe
        </div>
        <select
          name="gender"
          onChange={handleChange}
          value={userData["gender"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez</option>
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs">{errors.gender}</p>
        )}
      </div>
      {/* Nationalité */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Nationalité
        </div>
        <input
          type="text"
          name="nationality"
          onChange={handleChange}
          value={userData["nationality"] || ""}
          placeholder="Exemple: Ivoirienne"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.nationality && (
          <p className="text-red-500 text-xs">{errors.nationality}</p>
        )}
      </div>
      {/* Lieu de naissance (ville) */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Lieu de naissance (ville)
        </div>
        <input
          type="text"
          name="birthPlace"
          onChange={handleChange}
          value={userData["birthPlace"] || ""}
          placeholder="Exemple: Abidjan"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.birthPlace && (
          <p className="text-red-500 text-xs">{errors.birthPlace}</p>
        )}
      </div>
      {/* Pays de naissance */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Pays de naissance
        </div>
        <select
          name="birthCountry"
          onChange={handleChange}
          value={userData["birthCountry"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez un pays</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.birthCountry && (
          <p className="text-red-500 text-xs">{errors.birthCountry}</p>
        )}
      </div>
      {/* Date d'expiration */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date d'expiration
        </div>
        <input
          type="date"
          name="expiryDate"
          onChange={handleChange}
          value={userData["expiryDate"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.expiryDate && (
          <p className="text-red-500 text-xs">{errors.expiryDate}</p>
        )}
      </div>
      {/* Date de délivrance */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Date de délivrance
        </div>
        <input
          type="date"
          name="issueDate"
          onChange={handleChange}
          value={userData["issueDate"] || ""}
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.issueDate && (
          <p className="text-red-500 text-xs">{errors.issueDate}</p>
        )}
      </div>
      {/* Lieu de délivrance */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Lieu de délivrance
        </div>
        <input
          type="text"
          name="issuePlace"
          onChange={handleChange}
          value={userData["issuePlace"] || ""}
          placeholder="Exemple: Abidjan"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.issuePlace && (
          <p className="text-red-500 text-xs">{errors.issuePlace}</p>
        )}
      </div>
      {/* Mobile 1 (WhatsApp si possible) */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Mobile 1 (WhatsApp si possible)
        </div>
        <input
          type="text"
          name="mobile1Number"
          onChange={handleChange}
          value={userData["mobile1Number"] || ""}
          placeholder="Exemple: +2250584185367"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          maxLength={14}
        />
        {errors.mobile1Number && (
          <p className="text-red-500 text-xs">{errors.mobile1Number}</p>
        )}
      </div>
      {/* Mobile 2 (WhatsApp) */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Mobile 2 (WhatsApp)
        </div>
        <input
          type="text"
          name="mobile2Number"
          onChange={handleChange}
          value={userData["mobile2Number"] || ""}
          placeholder="Exemple: +2250584185367"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          maxLength={14}
        />
        {errors.mobile2Number && (
          <p className="text-red-500 text-xs">{errors.mobile2Number}</p>
        )}
      </div>
      {/* E-mail */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          E-mail
        </div>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={userData["email"] || ""}
          placeholder="Exemple: szokou45@gmail.com"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </div>
      {/* Adresse Géographique */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Adresse Géographique (Lot, quartier, ville, pays)
        </div>
        <input
          type="text"
          name="address"
          onChange={handleChange}
          value={userData["address"] || ""}
          placeholder="Abidjan, Cocody Rivera 2"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}
      </div>
      {/* Pays de residence */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Pays de residence
        </div>
        <select
          name="residenceCountry"
          onChange={handleChange}
          value={userData["residenceCountry"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez un pays</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.residenceCountry && (
          <p className="text-red-500 text-xs">{errors.residenceCountry}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
