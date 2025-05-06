"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

const ClientId = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [fileNames, setFileNames] = useState({
    cniFrontPath: "",
    cniBackPath: "",
    clientPhotoPath: "",
    clientSignaturePath: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token non trouvé");

        const response = await fetch(`/api/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              "Échec de la récupération des données du client"
          );
        }

        const data = await response.json();

        const transformedData = {
          id: data.id,
          authorization: data.authorization || "",
          identityType: data.identityType || "",
          identityNumber: data.identityNumber || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
          gender: data.gender || "",
          nationality: data.nationality || "",
          birthPlace: data.birthPlace || "",
          birthCountry: data.birthCountry || "",
          expiryDate: data.expiryDate ? data.expiryDate.split("T")[0] : "",
          issueDate: data.issueDate ? data.issueDate.split("T")[0] : "",
          issuePlace: data.issuePlace || "",
          mobile1Number: data.mobile1Number || "",
          mobile1Prefix: data.mobile1Prefix || "",
          mobile2Number: data.mobile2Number || "",
          mobile2Prefix: data.mobile2Prefix || "",
          email: data.email || "",
          address: data.address || "",
          residenceCountry: data.residenceCountry || "",
          agence: data.agence || "",
          accountType: data.accountType || "",
          savingsAccountNumber: data.savingsAccountNumber || "",
          chequeAccountNumber: data.chequeAccountNumber || "",
          numberOfChildren: data.numberOfChildren || 0,
          spouseEmployer: data.spouseEmployer || "",
          spouseOccupation: data.spouseOccupation || "",
          spouseJobFunction: data.spouseJobFunction || "",
          otherAccountNumber: data.otherAccountNumber || "",
          clientNumber: data.clientNumber || "",
          jobFunction: data.jobFunction || "",
          activitySector: data.activitySector || "",
          incomeRange: data.incomeRange || "",
          maritalStatus: data.maritalStatus || "",
          motherName: data.motherName || "",
          contractType: data.contractType || "",
          otherActivities: data.otherActivities || "",
          secondNationality: data.secondNationality || "",
          bankDomiciliation: data.bankDomiciliation || "",
          status: data.status || "PENDING",
          clientPhotoPath: data.clientPhoto
            ? `data:image/jpeg;base64,${data.clientPhoto}`
            : null,
          clientSignaturePath: data.clientSignature
            ? `data:image/jpeg;base64,${data.clientSignature}`
            : null,
          cniBackPath: data.cniBack
            ? `data:image/jpeg;base64,${data.cniBack}`
            : null,
          cniFrontPath: data.cniFront
            ? `data:image/jpeg;base64,${data.cniFront}`
            : null,
        };

        setFormData(transformedData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Token non trouvé")) {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, router]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file change
  const handleImageChange = (e, field) => {
    const file =
      e.target.files[0] || (e.dataTransfer && e.dataTransfer.files[0]);
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide (JPEG, PNG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setFormData((prev) => ({
        ...prev,
        [field]: base64Data,
      }));
      setFileNames((prev) => ({
        ...prev,
        [field]: file.name,
      }));
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture de l'image");
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      // Prepare data for API, removing "data:image/...;base64," prefix
      const payload = {
        ...formData,
        cniFrontPath: formData.cniFrontPath
          ? formData.cniFrontPath.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
        cniBackPath: formData.cniBackPath
          ? formData.cniBackPath.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
        clientPhotoPath: formData.clientPhotoPath
          ? formData.clientPhotoPath.replace(/^data:image\/[a-z]+;base64,/, "")
          : null,
        clientSignaturePath: formData.clientSignaturePath
          ? formData.clientSignaturePath.replace(
              /^data:image\/[a-z]+;base64,/,
              ""
            )
          : null,
      };

      const response = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update client data");
      }

      toast.success("Données du Client modifiées avec succès");
      router.push("/dashboard/clients");
    } catch (err) {
      toast.error("Échec de la mise à jour des données: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Handle image click to view full-screen
  const openFile = (fileUrl) => {
    if (fileUrl) setSelectedFile(fileUrl);
  };

  const closeFile = () => {
    setSelectedFile(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        {error}
        <button
          onClick={() => router.push("/dashboard/clients")}
          className="block mt-4 mx-auto bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
        >
          Retour
        </button>
      </div>
    );
  }

  // No data state
  if (!formData) {
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        Client non trouvé
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Modifier les Détails du Client
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <InputField
              label="Prénoms"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <InputField
              label="Type de pièce d'identité"
              name="identityType"
              value={formData.identityType}
              onChange={handleChange}
            />
            <InputField
              label="N° pièce d'identité"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
            />
            <InputField
              label="Date de naissance"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
            <InputField
              label="Sexe"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
            <InputField
              label="Nationalité"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />
            <InputField
              label="Lieu de naissance"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
            />
            <InputField
              label="Pays de naissance"
              name="birthCountry"
              value={formData.birthCountry}
              onChange={handleChange}
            />
            <InputField
              label="Date d'expiration"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
            />
            <InputField
              label="Date de délivrance"
              name="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={handleChange}
            />
            <InputField
              label="Lieu de délivrance"
              name="issuePlace"
              value={formData.issuePlace}
              onChange={handleChange}
            />
            <InputField
              label="Mobile 1"
              name="mobile1Number"
              value={`${formData.mobile1Prefix || ""} ${
                formData.mobile1Number || ""
              }`}
              onChange={(e) => {
                const [prefix, number] = e.target.value.split(" ");
                setFormData((prev) => ({
                  ...prev,
                  mobile1Prefix: prefix || "",
                  mobile1Number: number || "",
                }));
              }}
            />
            <InputField
              label="Mobile 2"
              name="mobile2Number"
              value={`${formData.mobile2Prefix || ""} ${
                formData.mobile2Number || ""
              }`}
              onChange={(e) => {
                const [prefix, number] = e.target.value.split(" ");
                setFormData((prev) => ({
                  ...prev,
                  mobile2Prefix: prefix || "",
                  mobile2Number: number || "",
                }));
              }}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <InputField
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Adresse Géographique"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <InputField
              label="Pays de Résidence"
              name="residenceCountry"
              value={formData.residenceCountry}
              onChange={handleChange}
            />
            <InputField
              label="Code agence"
              name="agence"
              value={formData.agence}
              onChange={handleChange}
            />
            <InputField
              label="Type de comptes"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
            />
            <InputField
              label="Numéro de compte Épargne"
              name="savingsAccountNumber"
              value={formData.savingsAccountNumber}
              onChange={handleChange}
            />
            <InputField
              label="Numéro de compte Chèque"
              name="chequeAccountNumber"
              value={formData.chequeAccountNumber}
              onChange={handleChange}
            />
            <InputField
              label="Autre Numéro de compte"
              name="otherAccountNumber"
              value={formData.otherAccountNumber || ""}
              onChange={handleChange}
            />
            <InputField
              label="Fonction exercée"
              name="jobFunction"
              value={formData.jobFunction}
              onChange={handleChange}
            />
            <InputField
              label="Secteur d'activité"
              name="activitySector"
              value={formData.activitySector}
              onChange={handleChange}
            />
            <InputField
              label="Tranche de revenu"
              name="incomeRange"
              value={formData.incomeRange}
              onChange={handleChange}
            />
            <InputField
              label="Situation matrimoniale"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            />
            <InputField
              label="Activité professionnelle du conjoint"
              name="spouseOccupation"
              value={formData.spouseOccupation || ""}
              onChange={handleChange}
            />
            <InputField
              label="Nom de jeune fille de la mère"
              name="motherName"
              value={formData.motherName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Fonction du conjoint"
              name="spouseJobFunction"
              value={formData.spouseJobFunction || ""}
              onChange={handleChange}
            />
            <InputField
              label="Type de contrat"
              name="contractType"
              value={formData.contractType || ""}
              onChange={handleChange}
            />
            <InputField
              label="Domicilié dans une autre banque ?"
              name="bankDomiciliation"
              value={formData.bankDomiciliation}
              onChange={handleChange}
            />
            <InputField
              label="Statut"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ImageUploadField
            label="CNI (Recto)"
            field="cniFrontPath"
            filePath={formData.cniFrontPath}
            fileName={fileNames.cniFrontPath}
            onChange={handleImageChange}
            onClick={() => openFile(formData.cniFrontPath)}
          />
          <ImageUploadField
            label="CNI (Verso)"
            field="cniBackPath"
            filePath={formData.cniBackPath}
            fileName={fileNames.cniBackPath}
            onChange={handleImageChange}
            onClick={() => openFile(formData.cniBackPath)}
          />
          <ImageUploadField
            label="Photo"
            field="clientPhotoPath"
            filePath={formData.clientPhotoPath}
            fileName={fileNames.clientPhotoPath}
            onChange={handleImageChange}
            onClick={() => openFile(formData.clientPhotoPath)}
          />
          <ImageUploadField
            label="Signature"
            field="clientSignaturePath"
            filePath={formData.clientSignaturePath}
            fileName={fileNames.clientSignaturePath}
            onChange={handleImageChange}
            onClick={() => openFile(formData.clientSignaturePath)}
          />
        </div>

        {/* Full-Screen Image View */}
        {selectedFile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeFile}
          >
            <img
              src={selectedFile}
              alt="Full-Screen View"
              className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/clients")}
            className="bg-indigo-600 text-white px-8 py-2 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition duration-200"
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={updating}
            className={`bg-green-500 text-white px-8 py-2 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition duration-200 ${
              updating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updating ? "Mise à jour..." : "Modifier"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
      placeholder={label}
    />
  </div>
);

// Reusable Image Upload Field Component (Drag-and-Drop)
const ImageUploadField = ({
  label,
  field,
  filePath,
  fileName,
  onChange,
  onClick,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onChange(e, field);
  };

  const imageSrc = filePath || "/assets/images/placeholder.jpg";

  return (
    <div>
      <p className="font-semibold text-gray-800 mb-2">{label}:</p>
      <p className="text-sm text-gray-600 mb-2 truncate">{fileName}</p>
      <div
        className={`relative h-24 w-24 rounded-md shadow-sm border ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
        } overflow-hidden cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onClick}
      >
        <img
          src={imageSrc}
          alt={label}
          className="h-full w-full object-cover rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e, field)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          title={`Upload ${label}`}
        />
      </div>
    </div>
  );
};

export default ClientId;
