"use client";
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import FieldPreview from "../../component/field";
import { availableFields } from "../../constants/availableFields";
import Navbar from '../../component/navbar'


export default function FormConfigure() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [activeFieldId, setActiveFieldId] = useState(null);
  const [showValidationDropdown, setShowValidationDropdown] = useState(false);

  const validationRulesByType = {
    text: [
      { key: "required", label: "Required" },
      { key: "minLength", label: "Minimum Length", requiresValue: true },
      { key: "maxLength", label: "Maximum Length", requiresValue: true },
    ],
    email: [
      { key: "required", label: "Required" },
      { key: "emailFormat", label: "Valid Email (@ required)" },
    ],
    number: [
      { key: "required", label: "Required" },
      { key: "min", label: "Minimum Value", requiresValue: true },
      { key: "max", label: "Maximum Value", requiresValue: true },
    ],
    password: [
      { key: "required", label: "Required" },
      { key: "minLength", label: "Minimum Length", requiresValue: true },
      { key: "uppercase", label: "Must contain uppercase" },
      { key: "lowercase", label: "Must contain lowercase" },
      { key: "number", label: "Must contain number" },
      { key: "specialChar", label: "Must contain special character" },
    ],
    select: [{ key: "required", label: "Required" }],
    radio: [{ key: "required", label: "Required" }],
    checkbox: [{ key: "required", label: "Required" }],
    date: [{ key: "futureDate", label: "Date must be after today" }],
  };

  const getDefaultValue = (type) => {
    switch (type) {
      case "text": return "Name";
      case "email": return "@example.com";
      case "number": return "10";
      case "password": return "";
      case "select":
      case "radio": return "Option 1";
      case "checkbox": return false;
      case "date": return "";
      default: return "";
    }
  };

  const addField = (field) => {
    const newField = {
      ...field,
      uniqueId: Date.now().toString(),
      label: field.label,
      defaultValue: getDefaultValue(field.type),
      validations: {},
      dateFormat: field.type === "date" ? "YYYY-MM-DD" : undefined,
      options: field.type === "radio" || field.type === "select" || field.type === "checkbox"
        ? ["Option 1", "Option 2"]
        : [],
      data: getDefaultValue(field.type),
    };
    setSelectedFields([...selectedFields, newField]);
    setActiveFieldId(newField.uniqueId);
  };

  const updateField = (id, key, value) => {
    setSelectedFields(prev =>
      prev.map(f => f.uniqueId === id ? { ...f, [key]: value, data: key === "defaultValue" ? value : f.data } : f)
    );
  };

  const updateValidation = (id, key, value) => {
    setSelectedFields(prev =>
      prev.map(f => f.uniqueId === id
        ? { ...f, validations: { ...f.validations, [key]: value } }
        : f
      )
    );
  };

  const updateOption = (id, index, value) => {
    setSelectedFields(prev =>
      prev.map(f => f.uniqueId === id
        ? { ...f, options: f.options.map((opt, i) => i === index ? value : opt) }
        : f
      )
    );
  };

  const addOption = (id) => {
    setSelectedFields(prev =>
      prev.map(f => f.uniqueId === id
        ? { ...f, options: [...f.options, "New Option"] }
        : f
      )
    );
  };

  const clearFields = () => {
    setSelectedFields([]);
    setActiveFieldId(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSelectedFields(items => {
      const oldIndex = items.findIndex(i => i.uniqueId === active.id);
      const newIndex = items.findIndex(i => i.uniqueId === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSaveForm = () => {
    const newForm = {
      id: Date.now().toString(),
      name: "My Form",
      fields: selectedFields,
      data: selectedFields.reduce((acc, f) => {
        acc[f.uniqueId] = f.data ?? f.defaultValue;
        return acc;
      }, {}),
    };

    const saved = JSON.parse(localStorage.getItem("savedForms") || "[]");
    saved.push(newForm);
    localStorage.setItem("savedForms", JSON.stringify(saved));
    alert("✅ Form saved successfully!");
    clearFields();
  };

  const activeField = selectedFields.find(f => f.uniqueId === activeFieldId);

  return (
    <div className="grid grid-cols-4 gap-6 p-6 bg-black text-white min-h-screen">
   
      <div className="col-span-1">
        <h2 className="font-bold text-lg mb-4 text-blue-400">Available Fields</h2>
        {availableFields.map(f => (
          <div
            key={f.id}
            className="border border-gray-700 p-3 mb-2 rounded-xl cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-md"
            onClick={() => addField(f)}
          >
            <div className="font-semibold text-white">{f.label}</div>
            <div className="text-sm text-gray-400">{f.details}</div>
          </div>
        ))}
      </div>
      


      <div className="col-span-2">
        <h2 className="font-bold text-lg mb-4 text-blue-400">Let's Create</h2>
        <FieldPreview selectedFields={selectedFields} setSelectedFields={setSelectedFields} />

        {/* <button
          onClick={handleSaveForm}
          className="mt-4 bg-blue-400 hover:bg-blue-500 text-black font-bold rounded-xl p-2 transition-all duration-200"
        >
          Save Form
        </button> */}
      </div>

      <div className="col-span-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-blue-400">Selected Fields</h2>
          <button
            onClick={clearFields}
            className="text-sm cursor-pointer bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl px-2 py-1 transition-all duration-200"
          >
            Clear Fields
          </button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={selectedFields.map(f => f.uniqueId)}
            strategy={verticalListSortingStrategy}
          >
            {selectedFields.map(f => (
              <div
                key={f.uniqueId}
                onClick={() => setActiveFieldId(f.uniqueId)}
                className={`border border-gray-700 p-2 mb-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  f.uniqueId === activeFieldId ? "bg-gray-800 border-amber-500" : "bg-gray-900"
                } hover:scale-105`}
              >
                {f.label}
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {activeField && (
          <div className="mt-4 p-4 border border-gray-700 rounded-xl bg-gray-900 shadow-lg transition-all duration-300">
            <h3 className="font-semibold mb-3 text-lg text-blue-400">Field Options</h3>

            <label className="block mb-1 text-sm font-medium text-gray-300">Label</label>
            <input
              type="text"
              className="border border-gray-600 rounded-xl p-2 w-full mb-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={activeField.label}
              onChange={(e) => updateField(activeField.uniqueId, "label", e.target.value)}
            />

            <label className="block mb-1 text-sm font-medium text-gray-300">Default Value</label>
            <input
              type={activeField.type === "date" ? "date" : "text"}
              className="border border-gray-600 rounded-xl p-2 w-full mb-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={activeField.defaultValue}
              onChange={(e) => updateField(activeField.uniqueId, "defaultValue", e.target.value)}
            />

            {activeField.type === "date" && (
              <div className="mb-2">
                <label className="block mb-1 text-sm font-medium text-gray-300">Date Format</label>
                <select
                  className="border border-gray-600 rounded-xl p-2 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={activeField.dateFormat || "YYYY-MM-DD"}
                  onChange={(e) => updateField(activeField.uniqueId, "dateFormat", e.target.value)}
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>
            )}

            <div className="mt-3 relative">
              <button
                onClick={() => setShowValidationDropdown(!showValidationDropdown)}
                className="w-full text-left p-2 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl transition-all duration-200"
              >
                Validation Rules
              </button>

              {showValidationDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-3 max-h-64 overflow-auto">
                  {validationRulesByType[activeField.type]?.map(rule => (
                    <div key={rule.key} className="flex items-center gap-2 mb-2">
                      {rule.requiresValue ? (
                        <>
                          <label className="text-gray-300 text-sm">{rule.label}:</label>
                          <input
                            type="text"
                            className="border border-gray-600 rounded-xl p-1 w-20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={activeField.validations[rule.key] || ""}
                            onChange={(e) => updateValidation(activeField.uniqueId, rule.key, e.target.value)}
                          />
                        </>
                      ) : (
                        <label className="inline-flex items-center gap-2 text-gray-300 text-sm">
                          <input
                            type="checkbox"
                            checked={!!activeField.validations[rule.key]}
                            onChange={(e) => updateValidation(activeField.uniqueId, rule.key, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-amber-400"
                          />
                          {rule.label}
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(activeField.type === "radio" ||
              activeField.type === "select" ||
              activeField.type === "checkbox") && (
              <div className="mt-2">
                <label className="block mb-2 text-sm font-medium text-gray-300">Options</label>
                {activeField.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    className="border border-gray-600 rounded-xl p-2 w-full mb-1 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={opt}
                    onChange={(e) => updateOption(activeField.uniqueId, i, e.target.value)}
                  />
                ))}
                <button
                  className="text-sm bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-xl px-2 py-1 mt-1 transition-all duration-200"
                  onClick={() => addOption(activeField.uniqueId)}
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
