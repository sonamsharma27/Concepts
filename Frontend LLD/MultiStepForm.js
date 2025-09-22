import React, { useState } from "react";

// Example steps config
const steps = [
  {
    label: "Step 1",
    fields: [
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["A", "B", "C"],
        required: true,
      },
      { name: "commonField", label: "Common Field", type: "text" },
    ],
  },
  {
    label: "Step 2",
    fields: [
      {
        name: "fieldA",
        label: "Field for A",
        type: "text",
        showIf: (values) => values.type === "A",
      },
      {
        name: "fieldB",
        label: "Field for B",
        type: "text",
        showIf: (values) => values.type === "B",
      },
      {
        name: "fieldC",
        label: "Field for C",
        type: "text",
        showIf: (values) => values.type === "C",
      },
    ],
  },
];

function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const currentStep = steps[step];

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(JSON.stringify(values));
      }}
    >
      <h2>{currentStep.label}</h2>
      {currentStep.fields.map((field) => {
        if (field.showIf && !field.showIf(values)) return null;
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label>{field.label}</label>
              <select
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type}
              value={values[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          </div>
        );
      })}
      <div style={{ marginTop: 16 }}>
        {step > 0 && (
          <button type="button" onClick={handleBack}>
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
  );
}

export default MultiStepForm;
