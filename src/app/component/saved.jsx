"use client";
import { useEffect, useState } from "react";

export default function SavedForm() {
  const [savedForms, setSavedForms] = useState([]);
  const [editingFormId, setEditingFormId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("savedForms");
    if (data) setSavedForms(JSON.parse(data));
  }, []);

  const handleDelete = (id) => {
    const updated = savedForms.filter((f) => f.id !== id);
    setSavedForms(updated);
    localStorage.setItem("savedForms", JSON.stringify(updated));
  };

  const handleFieldChange = (formId, fieldId, value) => {
    const updatedForms = savedForms.map((form) =>
      form.id === formId
        ? { ...form, data: { ...form.data, [fieldId]: value } }
        : form
    );
    setSavedForms(updatedForms);
  };

  const validateField = (value, validations, type) => {
    if (!validations) return "";

    if (validations.required && (!value || value.toString().trim() === "")) {
      return "This field is required.";
    }

    if (type === "email" && validations.emailFormat) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
    }

    if (type === "number") {
      const num = Number(value);
      if (isNaN(num)) return "Please enter a valid number.";
      if (validations.min && num < Number(validations.min))
        return `Minimum value is ${validations.min}.`;
      if (validations.max && num > Number(validations.max))
        return `Maximum value is ${validations.max}.`;
    }

    if (["text", "password"].includes(type)) {
      if (validations.minLength && value.length < validations.minLength)
        return `Minimum ${validations.minLength} characters required.`;
      if (validations.maxLength && value.length > validations.maxLength)
        return `Maximum ${validations.maxLength} characters allowed.`;
    }

    if (type === "password") {
      if (validations.uppercase && !/[A-Z]/.test(value))
        return "Must include at least one uppercase letter.";
      if (validations.lowercase && !/[a-z]/.test(value))
        return "Must include at least one lowercase letter.";
      if (validations.number && !/[0-9]/.test(value))
        return "Must include at least one number.";
      if (validations.specialChar && !/[!@#$%^&*]/.test(value))
        return "Must include at least one special character (!@#$%^&*).";
    }

    return "";
  };

  const validateForm = (form) => {
    const newErrors = {};
    form.fields.forEach((f) => {
      const value = form.data[f.uniqueId] ?? "";
      const errorMsg = validateField(value, f.validations, f.type);
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

      let newName = prompt(
        "Edit form name:",
        currentForm.name ? currentForm.name : ""
      );
      if (newName) currentForm.name = newName;

      localStorage.setItem("savedForms", JSON.stringify(savedForms));
      setEditingFormId(null);
      alert("✅ Form saved successfully!");
    } else {
      setEditingFormId(id);
    }
  };

  if (savedForms.length === 0) {
    return <div className="p-6 text-center text-gray-400">No saved forms</div>;
  }

  return (
    <div className="p-6 bg-[#0D0D0D]">
      <h2 className="text-3xl font-bold text-center text-amber-400 mb-6">
        📋 Saved Forms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedForms.map((form) => {
          const isEditing = editingFormId === form.id;

          return (
            <div
              key={form.id}
              className="bg-[#1A1A1A] border border-gray-700 rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {form.name || `Form ID: ${form.id}`}
                </h3>

                <div className="space-y-3">
                  {form.fields.map((f) => {
                    const value = form.data[f.uniqueId] ?? "";
                    const errorMsg = errors[`${form.id}-${f.uniqueId}`];

                    return (
                      <div key={f.uniqueId} className="space-y-1">
                        <label className="font-medium text-gray-200 block">
                          {f.label}
                        </label>

                        {f.type === "select" ? (
                          <select
                            value={value}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldChange(
                                form.id,
                                f.uniqueId,
                                e.target.value
                              )
                            }
                            className={`p-2 rounded border bg-[#2C2C2C] text-white w-full ${
                              errorMsg
                                ? "border-red-500"
                                : "border-gray-600 focus:ring-amber-400"
                            } ${isEditing ? "focus:outline-none focus:ring-2" : "opacity-70 cursor-not-allowed"}`}
                          >
                            <option value="">Select an option</option>
                            {f.options?.map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={f.type}
                            value={value}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldChange(
                                form.id,
                                f.uniqueId,
                                e.target.value
                              )
                            }
                            className={`p-2 rounded border bg-[#2C2C2C] text-white w-full ${
                              errorMsg
                                ? "border-red-500"
                                : "border-gray-600 focus:ring-amber-400"
                            } ${isEditing ? "focus:outline-none focus:ring-2" : "opacity-70 cursor-not-allowed"}`}
                          />
                        )}

                        {errorMsg && (
                          <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between mt-4">
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
          );
        })}
      </div>
    </div>
  );
}
