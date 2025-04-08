"use client";
import { StepperContext } from "../../context/StepperContext";
import React, { useContext } from "react";

const NonObligatoire = () => {
  const { userData, setUserData } = useContext(StepperContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  console.log(userData);
  return (
    <div className="flex flex-col space-y-4">
      {/* Numéro client */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Numéro client
        </div>
        <input
          type="text"
          name="clientNumber"
          onChange={handleChange}
          value={userData["clientNumber"] || ""}
          placeholder="Exemple: 111122221"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
      </div>

      {/* Nom de jeune fille (si mariée) */}
      {userData["maritalStatus"] === "Marié(e)" && (
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Nom de jeune fille (si mariée)
          </div>
          <input
            type="text"
            name="maidenName"
            onChange={handleChange}
            value={userData["maidenName"] || ""}
            placeholder="Nom de jeune fille"
            className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
          />
        </div>
      )}

      {/* Seconde Nationalité */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Seconde Nationalité
        </div>
        <input
          type="text"
          name="secondNationality"
          onChange={handleChange}
          value={userData["secondNationality"] || ""}
          placeholder="Seconde Nationalité"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
      </div>

      {/* Nombre d’enfants */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Nombre d’enfants
        </div>
        <input
          type="number"
          name="numberOfChildren"
          onChange={handleChange}
          value={userData["numberOfChildren"] || ""}
          placeholder="Nombre d’enfants"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
      </div>

      {/* Nom de la mère */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Nom de la mère
        </div>
        <input
          type="text"
          name="motherName"
          onChange={handleChange}
          value={userData["motherName"] || ""}
          placeholder="Nom de la mère"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
      </div>

      {/* Nature du contrat */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Nature du contrat
        </div>
        <select
          name="contractType"
          onChange={handleChange}
          value={userData["contractType"] || ""}
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        >
          <option value="">Sélectionnez un type de contrat</option>
          <option value="CDD">CDD</option>
          <option value="CDI">CDI</option>
          <option value="Intérim">Intérim</option>
          <option value="Consultance">Consultance</option>
        </select>
      </div>

      {/* Autres activités annexes */}
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Autres activités annexes
        </div>
        <input
          type="text"
          name="otherActivities"
          onChange={handleChange}
          value={userData["otherActivities"] || ""}
          placeholder="Décrivez vos autres activités"
          className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
        />
      </div>
    </div>
  );
};

export default NonObligatoire;
