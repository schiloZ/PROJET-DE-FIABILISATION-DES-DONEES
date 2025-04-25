"use client";
import React, { useState, useEffect, useRef } from "react";

const Stepper = ({ steps, currentStep }) => {
  const [newStep, setNewStep] = useState([]);
  const stepsStateRef = useRef();

  const updateStep = (stepNumber, steps) => {
    const newSteps = [...steps];
    let count = 0;
    while (count < newSteps.length) {
      //current step
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
        count++;
      }
      //step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
        count++;
      }
      //step pending
      else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    return newSteps;
  };

  useEffect(() => {
    const stepState = steps.map((step, index) => {
      return {
        description: step,
        completed: false,
        highlighted: index === 0 ? true : false,
        selected: index === 0 ? true : false,
      };
    });
    stepsStateRef.current = stepState;
    const current = updateStep(currentStep - 1, stepsStateRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step, index) => {
    return (
      <div
        key={index}
        className={
          index !== newStep.length - 1
            ? "w-full flex items-center"
            : "flex items-center"
        }
      >
        <div className="relative flex flex-col items-center text-blue-500">
          <div
            className="rounded-full transition duration-5000 ease-in-out border-2 border-gray-300 h-12 w-12 flex items-center justify-center py-3"
            style={
              step.selected
                ? {
                    backgroundColor: "#001051",
                    borderColor: "#001051",
                    color: "white",
                  }
                : {}
            }
          >
            {step.completed ? (
              <span className="text-white font-bold text-xl">&#10003;</span>
            ) : (
              index + 1
            )}
          </div>
          <div
            className={`absolute top-0 text-center mt-16 w-20 text-[6px] md:text-xs font-medium uppercase ${
              step.highlighted ? "font-bold text-gray-900 " : "text-gray-400"
            }`}
          >
            {/* Display Description */} {step.description}
          </div>
        </div>
        <div
          className="flex-auto border-t-2 border-gray-300 transition duration-500 ease-in-out"
          style={step.completed ? { borderColor: "#001051" } : {}}
        >
          {/* Display Line */}
        </div>
      </div>
    );
  });

  return (
    <div className="mx-4 p-4 flex justify-between items-center">
      {displaySteps}
    </div>
  );
};

export default Stepper;
