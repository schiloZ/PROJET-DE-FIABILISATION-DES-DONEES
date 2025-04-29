"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Stepper from "../components/Stepper";
import StepperControl from "../components/StepperControl";
import PersonalInfo from "../components/steps/PersonalInfo";
import Details from "../components/steps/Details";
import Review from "../components/steps/Review";
import Final from "../components/steps/Final";
import NonObligatoire from "../components/steps/NonObligatoire";
import { StepperContext } from "../context/StepperContext";

export default function Forms() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false); // Wait for token check
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState("");
  const [finalData, setFinalData] = useState([]);
  const [isStepValid, setStepValid] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirect to login page
    } else {
      setAuthChecked(true); // Auth check passed
    }
  }, []);

  const resetForm = () => {
    setUserData({});
    setCurrentStep(1);
    setStepValid(false);
  };

  const steps = [
    "IDENTIFICATION",
    "COMPTE DU CLIENT",
    "ACTIVITES PROFESSIONNELLES ",
    "INFORMATIONS NON OBLIGATOIRE",
    "Validation",
  ];

  const displaySteps = (step) => {
    switch (step) {
      case 1:
        return <PersonalInfo setStepValid={setStepValid} />;
      case 2:
        return <Details setStepValid={setStepValid} />;
      case 3:
        return <Review setStepValid={setStepValid} />;
      case 4:
        return <NonObligatoire />;
      case 5:
        return (
          <Final handleBack={() => handleClick("back")} resetForm={resetForm} />
        );
      default:
        return null;
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    if (newStep > 0 && newStep <= steps.length) {
      setCurrentStep(newStep);
    }
  };

  if (!authChecked) return null; // Wait until auth is checked

  return (
    <div className="lg:w-4/5 md:w-4/5 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
      <div className="container horizontal mt-5">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="my-10 p-10">
          <StepperContext.Provider
            value={{ userData, setUserData, finalData, setFinalData }}
          >
            {displaySteps(currentStep)}
          </StepperContext.Provider>
        </div>
      </div>

      {currentStep !== steps.length && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          isStepValid={isStepValid}
        />
      )}
    </div>
  );
}
