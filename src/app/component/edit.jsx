"use client";
import { useEffect, useState } from "react";

export default function EditForm() {
  const [savedForms, setSavedForms] = useState([]);
  const [openFormId, setOpenFormId] = useState(null);
  const [editingFormId, setEditingFormId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("savedForms");
    if (data) setSavedForms(JSON.parse(data));
  }, []);

  const clearAll = () => {
    localStorage.removeItem("savedForms");
    setSavedForms([]);
    setOpenFormId(null);
  };

  const handleDelete = (id) => {
    const updated = savedForms.filter((f) => f.id !== id);
    setSavedForms(updated);
    localStorage.setItem("savedForms", JSON.stringify(updated));
    if (openFormId === id) setOpenFormId(null);
  };

  const handleFieldEdit = (formId, fieldId, key, value) => {
    const updatedForms = savedForms.map((form) =>
      form.id === formId
        ? {
            ...form,
            fields: form.fields.map((f) =>
              f.uniqueId === fieldId ? { ...f, [key]: value } : f
            ),
          }
        : form
    );
    setSavedForms(updatedForms);
  };

  const validateFieldStructure = (field) => {
    if (!field.label || field.label.trim() === "") {
      return "Field name (label) is required.";
    }
    if (!field.type) {
      return "Field type is required.";
    }
    return "";
  };

  const validateForm = (form) => {
    const newErrors = {};
    form.fields.forEach((f) => {
      const errorMsg = validateFieldStructure(f);
      if (errorMsg) {
        newErrors[`${form.id}-${f.uniqueId}`] = errorMsg;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleEdit = (id) => {
    if (editingFormId === id) {
      const currentForm = savedForms.find((f) => f.id === id);
      if (!validateForm(currentForm)) return;
      localStorage.setItem("savedForms", JSON.stringify(savedForms));
      setEditingFormId(null);
      alert("✅ Form structure saved successfully!");
    } else {
      setEditingFormId(id);
    }
  };

  const toggleOpenForm = (id) => {
    setOpenFormId(openFormId === id ? null : id);
  };

  const inputTypes = [
    "text",
    "email",
    "password",
    "number",
    "checkbox",
    "radio",
    "select",
  ];

  if (savedForms.length === 0) {
    return <div className="p-6 text-center text-gray-400">No saved forms</div>;
  }

  return (
    <div className="p-6 space-y-4 bg-[#0D0D0D] rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-3xl font-bold text-center text-amber-400 mb-6">
        ✏️ Edit Forms
      </h2>

      <div className="space-y-2">
        {savedForms.map((form) => {
          const isOpen = openFormId === form.id;
          const isEditing = editingFormId === form.id;

          return (
            <div
              key={form.id}
              className="border border-gray-700 rounded-lg bg-[#1A1A1A] overflow-hidden shadow-md"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-[#222222] hover:bg-[#2A2A2A] transition-colors"
                onClick={() => toggleOpenForm(form.id)}
              >
                <span className="font-semibold text-white">
                  Form ID: {form.id}
                </span>
                <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-screen p-4" : "max-h-0 p-0 overflow-hidden"
                }`}
              >
                <div className="space-y-3">
                  {form.fields.map((f) => {
                    const errorMsg = errors[`${form.id}-${f.uniqueId}`];

                    return (
                      <div
                        key={f.uniqueId}
                        className="bg-[#222] p-3 rounded-lg space-y-3"
                      >
                        <div className="flex gap-3 items-center">
                          <label className="font-medium text-gray-200">
                            Field Label:
                          </label>
                          <input
                            type="text"
                            value={f.label}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldEdit(
                                form.id,
                                f.uniqueId,
                                "label",
                                e.target.value
                              )
                            }
                            className={`p-2 rounded border bg-[#2C2C2C] text-white flex-1 ${
                              errorMsg ? "border-red-500" : "border-gray-600"
                            } ${isEditing ? "" : "cursor-not-allowed opacity-70"}`}
                          />
                        </div>

                        <div className="flex gap-3 items-center">
                          <label className="font-medium text-gray-200">
                            Field Type:
                          </label>
                          <select
                            value={f.type}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldEdit(
                                form.id,
                                f.uniqueId,
                                "type",
                                e.target.value
                              )
                            }
                            className={`p-2 rounded border bg-[#2C2C2C] text-white flex-1 ${
                              isEditing
                                ? "focus:ring-amber-400"
                                : "cursor-not-allowed opacity-70"
                            }`}
                          >
                            <option value="">Select Type</option>
                            {inputTypes.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex gap-3 items-center">
                          <label className="font-medium text-gray-200">
                            Required:
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!f.validations?.required}
                              disabled={!isEditing}
                              onChange={(e) =>
                                handleFieldEdit(form.id, f.uniqueId, "validations", {
                                  ...f.validations,
                                  required: e.target.checked,
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-amber-500 transition-all"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-full transition-all"></div>
                          </label>
                        </div>

                        {errorMsg && (
                          <p className="text-red-400 text-sm mt-1">
                            {errorMsg}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => toggleEdit(form.id)}
                    className={`px-4 py-2 rounded text-white font-semibold ${
                      isEditing
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-amber-500 hover:bg-amber-600"
                    } transition-colors`}
                  >
                    {isEditing ? "Save Changes" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={clearAll}
          className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 font-semibold transition-colors"
        >
          Clear All Saved Forms
        </button>
      </div>
    </div>
  );
}
