"use client";
import { useState } from "react";

export default function FieldPreview({ selectedFields, setSelectedFields }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e, fieldId) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldId]: type === "checkbox" ? checked : value,
    }));
  };

  const deleteField = (fieldId) => {
    setSelectedFields(selectedFields.filter((f) => f.uniqueId !== fieldId));
    const newFormData = { ...formData };
    delete newFormData[fieldId];
    setFormData(newFormData);
  };

  const formSave = (e) => {
    e.preventDefault();

    let formName = prompt("Enter form name:");
    if (!formName || formName.trim() === "") {
      alert("Form name is required!");
      return;
    }

    const existingForms = JSON.parse(localStorage.getItem("savedForms")) || [];

    const nameExists = existingForms.some(
      (f) => f.name && f.name.toLowerCase() === formName.toLowerCase()
    );
    if (nameExists) {
      alert("Form name already exists! Choose a different name.");
      return;
    }

    const newForm = {
      id: Date.now(),
      name: formName,
      fields: selectedFields,
      data: formData,
      savedAt: new Date().toLocaleString(),
    };

    existingForms.push(newForm);
    localStorage.setItem("savedForms", JSON.stringify(existingForms));
    alert("Form saved successfully!");
    setFormData({});
  };

  const handlePreview = () => {
    alert("");
  };

  return (
    <form
      onSubmit={formSave}
      className="space-y-6 border border-gray-700 bg-[#121212] text-gray-200 rounded-2xl shadow-2xl p-6 transition-all duration-300 relative"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-400 tracking-wide">
          🧩 Build Your Form
        </h2>

        <div className="flex gap-3">
          {/* <button
            type="button"
            onClick={handlePreview}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-gray-500/40"
          >
            👁️ Preview
          </button> */}

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-amber-500/30"
          >
            💾 Save Form
          </button>
        </div>
      </div>

      {selectedFields.map((f) => (
        <div
          key={f.uniqueId}
          className="flex items-start justify-between border border-gray-700 rounded-xl p-4 bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-all duration-200"
        >
          <div className="flex-1 pr-3">
            <label className="block mb-2 font-medium text-gray-300">{f.label}</label>
            <input
              type={f.type}
              value={formData[f.uniqueId] || ""}
              onChange={(e) => handleChange(e, f.uniqueId)}
              className="w-full p-2.5 rounded-lg bg-[#2C2C2C] border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={() => deleteField(f.uniqueId)}
            className="ml-3 text-red-500 hover:text-red-400 transition-transform transform hover:scale-110"
            title="Delete field"
          >
            🗑️
          </button>
        </div>
      ))}
    </form>
  );
}
