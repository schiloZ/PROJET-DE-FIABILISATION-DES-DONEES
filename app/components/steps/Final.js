"use client";
import { StepperContext } from "../../context/StepperContext";
import React, { useContext, useEffect } from "react";

const Final = () => {
  const { userData } = useContext(StepperContext);

  // Log all data when the component mounts
  useEffect(() => {
    console.log("All data gathered up to Final step:", userData);
  }, [userData]);

  // Optional: Handle button click to log data again and simulate saving
  const handleSave = () => {
    console.log("Saving data:", userData);
    // You can add further logic here, e.g., API call to save data
    alert("Données enregistrées avec succès!");
  };
  return (
    <div className="container md:mt-10">
      <div className="flex flex-col items-center">
        <div className="text-green-400">
          <svg
            className=" w-24 h-24"
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
          Congratulations!
        </div>
        <div className="text-lg font-semibold text-gray-500">
          {" "}
          Your Account has been created.
        </div>
        <a className="mt-10" href="">
          <button className="bg-green-500 hover:bg-green-800 transition-colors duration-50 focus:shadow-outline text-white font-semibold px-6 py-3 rounded-md">
            {" "}
            Enregistrer de Nouvelles données
          </button>
        </a>
      </div>
    </div>
  );
};

export default Final;
