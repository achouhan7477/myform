"use client";
import { useState } from "react";

export default function FieldPreview({ selectedFields, setSelectedFields }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldId]: type === "checkbox" ? checked : value,
    }));

    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: false }));
    }
  };

  const deleteField = (fieldId) => {
    setSelectedFields(selectedFields.filter((f) => f.uniqueId !== fieldId));
    const newFormData = { ...formData };
    delete newFormData[fieldId];
    setFormData(newFormData);
  };

  const formSave = (e) => {
    e.preventDefault();
    let newErrors = {};

    selectedFields.forEach((f) => {
      if (
        (f.type === "email" || f.type === "password" || f.type === "text") &&
        !formData[f.uniqueId]
      ) {
        newErrors[f.uniqueId] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill all required fields.");
      return;
    }

    const existingForms = JSON.parse(localStorage.getItem("savedForms")) || [];
    const newForm = {
      id: Date.now(),
      fields: selectedFields,
      data: formData,
      savedAt: new Date().toLocaleString(),
    };

    existingForms.push(newForm);
    localStorage.setItem("savedForms", JSON.stringify(existingForms));
    alert("Form saved successfully!");
    setFormData({});
  };

  return (
    <form
      onSubmit={formSave}
      className="space-y-4 border p-4 rounded bg-black-50"
    >
      {selectedFields.map((f) => (
        <div
          key={f.uniqueId}
          className="flex items-center justify-between border-b py-2"
        >
          <div className="flex-1">
            <label className="block mb-1 font-medium text-white">{f.label}</label>

            {f.type === "text" && (
              <input
                type="text"
                className={`border p-2 w-full rounded ${
                  errors[f.uniqueId] ? "border-red-500" : "border-gray-300"
                }`}
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              />
            )}

            {f.type === "email" && (
              <input
                type="email"
                className={`border p-2 w-full rounded ${
                  errors[f.uniqueId] ? "border-red-500" : "border-gray-300"
                }`}
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              />
            )}

            {f.type === "password" && (
              <input
                type="password"
                className={`border p-2 w-full rounded ${
                  errors[f.uniqueId] ? "border-red-500" : "border-gray-300"
                }`}
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              />
            )}

            {f.type === "number" && (
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              />
            )}

            {f.type === "date" && (
              <input
                type="date"
                className="border p-2 w-full rounded"
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              />
            )}

            {f.type === "textarea" && (
              <textarea
                className="border p-2 w-full rounded"
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              />
            )}

            {f.type === "select" && (
              <select
                className="border p-2 w-full rounded"
                value={formData[f.uniqueId] || ""}
                onChange={(e) => handleChange(e, f.uniqueId)}
              >
                <option value="">Select an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            )}

            {f.type === "checkbox" && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[f.uniqueId] || false}
                  onChange={(e) => handleChange(e, f.uniqueId)}
                />
                <span>Check</span>
              </label>
            )}

            {f.type === "radio" && (
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name={f.uniqueId}
                    value="Option 1"
                    checked={formData[f.uniqueId] === "Option 1"}
                    onChange={(e) => handleChange(e, f.uniqueId)}
                  />{" "}
                  Option 1
                </label>
                <label>
                  <input
                    type="radio"
                    name={f.uniqueId}
                    value="Option 2"
                    checked={formData[f.uniqueId] === "Option 2"}
                    onChange={(e) => handleChange(e, f.uniqueId)}
                  />{" "}
                  Option 2
                </label>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => deleteField(f.uniqueId)}
            className="ml-2 text-red-500 hover:text-red-700 font-bold"
          >
            🗑️
          </button>
        </div>
      ))}

      <button
        type="submit"
        className="text-2xl rounded text-amber-300 border border-amber-400 px-4 py-2 mt-4 hover:bg-amber-400 hover:text-black"
      >
        Save Form
      </button>
    </form>
  );
}
