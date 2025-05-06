"use client";

import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect, useState, useCallback } from "react";

// JSON data for agences
const agencesData = {
  "AGENCE SIEGE": "006",
  "AGENCE PRINCIPALE PLATEAU": "006",
  "ABOBO MAIRIE": "007",
  "YOPOUGON NOUVEAU QUARTIER": "008",
  "PORT-BOUET": "009",
  "MARCORY MOSQUEE": "010",
  "COCODY CITE ROUGE": "011",
  "WILLI COMMISSARIAT": "012",
  "TREICHVILLE MARCHE": "013",
  "BOULEVARD DE MARSEILLE": "014",
  "MARCORY MARCHE": "015",
  "ADJAME MARCHE": "016",
  "KOUMASSI MARCHE": "017",
  "BOULEVARD LATRILLE": "018",
  "AGENCE PRESTIGE": "019",
  "AGENCE MARCHE COCOVICO": "020",
  "AGENCE MARCHE BELLEVILLE": "021",
  BOUAKE: "022",
  MAN: "023",
  YAMOUSSOUKRO: "024",
  ABENGOUROU: "025",
  KORHOGO: "026",
  TENGRELA: "027",
  "SAN-PEDRO": "028",
  "GRAND-BEREBY": "029",
  DALOA: "030",
  DIVO: "031",
  GUITRY: "032",
  GAGNOA: "033",
  BONON: "034",
  MEAGUI: "035",
  SOUBRE: "036",
  BUYO: "037",
  ADZOPE: "038",
  AGBOVILLE: "039",
  AGNIBILEKROU: "040",
  BONDOUKOU: "041",
  BOUAFLE: "042",
  ODIENNE: "043",
  GUIGLO: "044",
  ZAGNE: "045",
  ISSIA: "046",
  KATIOLA: "047",
  OUME: "048",
  TOUMODI: "049",
  KONG: "050",
  "GRAND-BASSAM": "051",
  BONGOUANOU: "052",
  DABOU: "053",
  SIKENSI: "054",
  DAOUKRO: "055",
  JACQUEVILLE: "056",
  SASSANDRA: "057",
  SEGUELA: "058",
  TANDA: "059",
  TOUBA: "060",
  ZUENOULA: "061",
  "M'BATTO": "062",
  BINGERVILLE: "063",
  ABATTA: "064",
  BONOUA: "065",
  TIEBISSOU: "066",
  DANANE: "067",
  DUEKOUE: "068",
  TABOU: "069",
  AKOUPE: "070",
  BOUNA: "071",
  OUANGOLODOUGOU: "072",
  "GRAND-LAHOU": "073",
  FRESCO: "074",
  OUELLE: "075",
  BOCANDA: "076",
  SINFRA: "077",
  VAVOUA: "078",
  BETTIE: "079",
  ABOISSO: "080",
};

const Details = ({ setStepValid }) => {
  const { userData, setUserData } = useContext(StepperContext);
  const [errors, setErrors] = useState({});
  const [requiredFields, setRequiredFields] = useState([
    "agence",
    "accountType",
  ]);
  const [agenceName, setAgenceName] = useState("");
  const [agenceCode, setAgenceCode] = useState("");
  const [agenceSuggestions, setAgenceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isManualCode, setIsManualCode] = useState(false);

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
      !/^\d{12}$/.test(userData["savingsAccountNumber"])
    ) {
      newErrors["savingsAccountNumber"] =
        "Le numéro de compte doit contenir exactement 12 chiffres";
      isValid = false;
    }

    if (
      userData["chequeAccountNumber"] &&
      !/^\d{12}$/.test(userData["chequeAccountNumber"])
    ) {
      newErrors["chequeAccountNumber"] =
        "Le numéro de compte doit contenir exactement 12 chiffres";
      isValid = false;
    }

    if (
      userData["otherAccountNumber"] &&
      !/^\d{12}$/.test(userData["otherAccountNumber"])
    ) {
      newErrors["otherAccountNumber"] =
        "Le numéro de compte doit contenir exactement 12 chiffres";
      isValid = false;
    }

    // Validation du code agence
    if (userData["agence"] && !/^\d{3}$/.test(userData["agence"])) {
      newErrors["agence"] =
        "Le code agence doit contenir exactement 3 chiffres";
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

  const handleAgenceNameChange = (e) => {
    const value = e.target.value;
    setAgenceName(value);
    setIsManualCode(false);

    if (value.length > 1) {
      const suggestions = Object.keys(agencesData).filter((agence) =>
        agence.toLowerCase().includes(value.toLowerCase())
      );
      setAgenceSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setAgenceSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAgenceCodeChange = (e) => {
    const value = e.target.value;
    setAgenceCode(value);
    setUserData({ ...userData, agence: value });
  };

  const selectAgence = (agence) => {
    setAgenceName(agence);
    setAgenceCode(agencesData[agence]);
    setUserData({ ...userData, agence: agencesData[agence] });
    setAgenceSuggestions([]);
    setShowSuggestions(false);
    setIsManualCode(false);
  };

  const enableManualCodeInput = () => {
    setIsManualCode(true);
    setAgenceName("");
    setAgenceCode("");
    setUserData({ ...userData, agence: "" });
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Agence */}
      <div className="w-full mx-2 flex-1 relative">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Agence
        </div>
        <div className="flex flex-col">
          {!isManualCode ? (
            <>
              <div className="flex">
                <input
                  type="text"
                  name="agenceName"
                  onChange={handleAgenceNameChange}
                  value={agenceName}
                  placeholder="Rechercher une agence (ex: ABOBO)"
                  className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
                />
                {userData.agence && (
                  <div className="ml-2 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Code: {userData.agence}
                    </span>
                  </div>
                )}
              </div>

              {showSuggestions && agenceSuggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
                  {agenceSuggestions.map((agence, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectAgence(agence)}
                    >
                      {agence}{" "}
                      <span className="text-gray-500 text-sm">
                        (Code: {agencesData[agence]})
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {agenceName && agenceSuggestions.length === 0 && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-500 text-sm mr-2">
                    Agence non trouvée
                  </span>
                  <button
                    onClick={enableManualCodeInput}
                    className="text-blue-500 text-sm underline"
                  >
                    Entrer le code manuellement
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <span className="text-gray-500 text-sm mr-2">
                  Entrez le code agence:
                </span>
                <button
                  onClick={() => setIsManualCode(false)}
                  className="text-blue-500 text-sm underline"
                >
                  Retour à la recherche
                </button>
              </div>
              <input
                type="text"
                name="agenceCode"
                onChange={handleAgenceCodeChange}
                value={agenceCode}
                placeholder="Entrez le code agence (3 chiffres)"
                maxLength={3}
                className="bg-white my-2 p-1 flex border border-gray-200 rounded w-full"
              />
            </div>
          )}
        </div>

        {errors.agence && (
          <p className="text-red-500 text-xs">{errors.agence}</p>
        )}
      </div>

      {/* Rest of your component remains the same */}
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
            maxLength={12}
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
            maxLength={12}
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
            maxLength={12}
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
            maxLength={12}
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
            maxLength={12}
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
