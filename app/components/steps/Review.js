"use client";
import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect, useState, useCallback } from "react";

const Review = ({ setStepValid }) => {
  const { userData, setUserData } = useContext(StepperContext);
  const [errors, setErrors] = useState({});

  // Définir les champs requis
  const requiredFields = [
    "jobFunction",
    "activitySector",
    "incomeRange",
    "maritalStatus",
    "bankDomiciliation",
    "clientSignature",
    "clientPhoto",
    "cniFront",
    "cniBack",
  ];

  // Fonction de validation des champs
  const validateFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validation des champs requis
    requiredFields.forEach((field) => {
      if (
        field === "clientSignature" ||
        field === "clientPhoto" ||
        field === "cniFront" ||
        field === "cniBack"
      ) {
        // Validation pour les fichiers
        if (!userData[field]) {
          newErrors[field] = "Veuillez télécharger ce fichier";
          isValid = false;
        }
      } else {
        // Validation pour les autres champs (chaînes de caractères)
        if (
          !userData[field] ||
          (typeof userData[field] === "string" && userData[field].trim() === "")
        ) {
          newErrors[field] = "Ce champ est requis";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [userData, setErrors]); // Dependencies of validateFields

  // Mettre à jour la validation à chaque changement de userData
  useEffect(() => {
    const isValid = validateFields();
    setStepValid(isValid);
  }, [validateFields, setStepValid]); // Include memoized validateFields and setStepValid

  // Gérer les changements dans les champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUserData({ ...userData, [name]: files[0] }); // Pour les fichiers
    } else {
      setUserData({ ...userData, [name]: value }); // Pour les autres champs
    }
  };

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Fonction exercée */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Fonction exercée
        </div>
        <input
          type="text"
          name="jobFunction"
          onChange={handleChange}
          value={userData["jobFunction"] || ""}
          placeholder="Fonction exercée"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.jobFunction && (
          <p className="text-red-500 text-xs">{errors.jobFunction}</p>
        )}
      </div>

      {/* Secteur d’activité */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Secteur d&apos;activité
        </div>
        <input
          type="text"
          name="activitySector"
          onChange={handleChange}
          value={userData["activitySector"] || ""}
          placeholder="Secteur d’activité"
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.activitySector && (
          <p className="text-red-500 text-xs">{errors.activitySector}</p>
        )}
      </div>

      {/* Tranche de revenue */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Tranche de revenue
        </div>
        <select
          name="incomeRange"
          onChange={handleChange}
          value={userData["incomeRange"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez une tranche</option>
          <option value="Inférieur à 100k">Inférieur à 100k</option>
          <option value="Entre 100k et 350k">Entre 100k et 350k</option>
          <option value="Entre 450k et 1000k">Entre 450k et 1000k</option>
        </select>
        {errors.incomeRange && (
          <p className="text-red-500 text-xs">{errors.incomeRange}</p>
        )}
      </div>

      {/* Situation matrimoniale */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Situation matrimoniale
        </div>
        <select
          name="maritalStatus"
          onChange={handleChange}
          value={userData["maritalStatus"] || ""}
          required
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez une situation</option>
          <option value="Célibataire">Célibataire</option>
          <option value="Marié(e)">Marié(e)</option>
          <option value="Divorcé(e)">Divorcé(e)</option>
          <option value="Veuf(ve)">Veuf(ve)</option>
        </select>
        {errors.maritalStatus && (
          <p className="text-red-500 text-xs">{errors.maritalStatus}</p>
        )}
      </div>

      {/* Conditional Fields for Spouse */}
      {userData["maritalStatus"] === "Marié(e)" && (
        <>
          {/* Activité professionnelle du conjoint */}
          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
              Activité professionnelle du conjoint
            </div>
            <input
              type="text"
              name="spouseOccupation"
              onChange={handleChange}
              value={userData["spouseOccupation"] || ""}
              placeholder="Activité professionnelle du conjoint"
              required
              className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
            />
            {errors.spouseOccupation && (
              <p className="text-red-500 text-xs">{errors.spouseOccupation}</p>
            )}
          </div>

          {/* Employeur du conjoint */}
          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
              Employeur du conjoint
            </div>
            <input
              type="text"
              name="spouseEmployer"
              onChange={handleChange}
              value={userData["spouseEmployer"] || ""}
              placeholder="Employeur du conjoint"
              required
              className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
            />
            {errors.spouseEmployer && (
              <p className="text-red-500 text-xs">{errors.spouseEmployer}</p>
            )}
          </div>

          {/* Fonction du conjoint */}
          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
              Fonction du conjoint
            </div>
            <input
              type="text"
              name="spouseJobFunction"
              onChange={handleChange}
              value={userData["spouseJobFunction"] || ""}
              placeholder="Fonction du conjoint"
              required
              className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
            />
            {errors.spouseJobFunction && (
              <p className="text-red-500 text-xs">{errors.spouseJobFunction}</p>
            )}
          </div>
        </>
      )}

      {/* Êtes-vous domiciliés dans une autre banque ? */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Êtes-vous domiciliés dans une autre banque ?
        </div>
        <div className="flex space-x-4 mt-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="bankDomiciliation"
              value="Oui"
              onChange={handleChange}
              checked={userData["bankDomiciliation"] === "Oui"}
              className="mr-2"
            />
            Oui
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="bankDomiciliation"
              value="Non"
              onChange={handleChange}
              checked={userData["bankDomiciliation"] === "Non"}
              className="mr-2"
            />
            Non
          </label>
        </div>
        {errors.bankDomiciliation && (
          <p className="text-red-500 text-xs">{errors.bankDomiciliation}</p>
        )}
      </div>

      {/* Signature Client */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Signature Client
        </div>
        <input
          type="file"
          name="clientSignature"
          accept="image/*"
          onChange={handleChange}
          className="bg-white my-2 p-1 flex border border-gray-200 hover:border-gray-500 rounded w-full focus"
        />
        {errors.clientSignature && (
          <p className="text-red-500 text-xs">{errors.clientSignature}</p>
        )}
      </div>

      {/* Photo du client */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Photo du client
        </div>
        <input
          type="file"
          name="clientPhoto"
          accept="image/*"
          onChange={handleChange}
          className="bg-white my-2 p-1 flex border border-gray-200 hover:border-gray-500 rounded w-full"
        />
        {errors.clientPhoto && (
          <p className="text-red-500 text-xs">{errors.clientPhoto}</p>
        )}
      </div>

      {/* Carte Nationale d'Identité (CNI) Recto */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Carte Nationale d&apos;Identité (CNI) Recto
        </div>
        <input
          type="file"
          name="cniFront"
          accept="image/*"
          onChange={handleChange}
          className="bg-white my-2 p-1 flex border border-gray-200 hover:border-gray-500 rounded w-full"
        />
        {errors.cniFront && (
          <p className="text-red-500 text-xs">{errors.cniFront}</p>
        )}
      </div>

      {/* Carte Nationale d'Identité (CNI) Verso */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Carte Nationale d&apos;Identité (CNI) Verso
        </div>
        <input
          type="file"
          name="cniBack"
          accept="image/*"
          onChange={handleChange}
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
        {errors.cniBack && (
          <p className="text-red-500 text-xs">{errors.cniBack}</p>
        )}
      </div>
    </div>
  );
};

export default Review;
