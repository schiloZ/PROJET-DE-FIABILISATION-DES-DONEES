"use client";
import Image from "next/image";
import Stepper from "../components/Stepper";
import StepperControl from "../components/StepperControl";
import PersonalInfo from "../components/steps/PersonalInfo";
import Details from "../components/steps/Details";
import Review from "../components/steps/Review";
import Final from "../components/steps/Final";
import { useState } from "react";
import { StepperContext } from "../context/StepperContext";
import NonObligatoire from "../components/steps/NonObligatoire";

export default function forms() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState("");
  const [finalData, setFinalData] = useState([]);
  const [isStepValid, setStepValid] = useState(false);
  const steps = [
    "IDENTIFICATION",
    "COMPTE DU CLIENT",
    "ACTIVITES PROFESSIONNELLES ",
    "INFORMATIONS NON OBLIGATOIRE",
    "Final",
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
        return <Final />;
      default:
        return null;
    }
  };
  const handleClick = (direction) => {
    let newStep = currentStep;
    direction === "next" ? newStep++ : newStep--;
    //check if steps are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };
  return (
    <div className="lg:w-4/5 md:w-4/5 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
      {/*STEPPER*/}
      <div className="container horizontal mt-5">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="my-10 p-10 ">
          {/* Display Information */}
          <StepperContext.Provider
            value={{ userData, setUserData, finalData, setFinalData }}
          >
            {displaySteps(currentStep)}
          </StepperContext.Provider>
        </div>
      </div>

      {/*NAVIGATION CONTROL*/}
      {currentStep != steps.length && (
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
