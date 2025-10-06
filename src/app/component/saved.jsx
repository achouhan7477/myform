"use client";
import { useEffect, useState } from "react";

export default function SavedForm() {
  const [savedForms, setSavedForms] = useState([]);
  const [openFormId, setOpenFormId] = useState(null);
  const [editingFormId, setEditingFormId] = useState(null);

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

  const handleFieldChange = (formId, fieldId, value) => {
    const updatedForms = savedForms.map((form) => {
      if (form.id === formId) {
        return {
          ...form,
          data: { ...form.data, [fieldId]: value },
        };
      }
      return form;
    });
    setSavedForms(updatedForms);
  };

  const toggleEdit = (id) => {
    if (editingFormId === id) {
      localStorage.setItem("savedForms", JSON.stringify(savedForms));
      setEditingFormId(null);
    } else {
      setEditingFormId(id);
    }
  };

  const toggleOpenForm = (id) => {
    setOpenFormId(openFormId === id ? null : id);
  };

  if (savedForms.length === 0) {
    return <div className="p-6 text-center text-gray-400">No saved forms</div>;
  }

  return (
    <div className="p-6 space-y-4 bg-black-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Saved Forms</h2>

      <div className="space-y-2">
        {savedForms.map((form) => {
          const isOpen = openFormId === form.id;
          const isEditing = editingFormId === form.id;

          return (
            <div
              key={form.id}
              className="border border-gray-700 rounded-lg bg-gray-900 overflow-hidden shadow-md"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
                onClick={() => toggleOpenForm(form.id)}
              >
                <span className="font-semibold text-white">Form ID: {form.id}</span>
                <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-screen p-4" : "max-h-0 p-0 overflow-hidden"
                }`}
              >
                <div className="space-y-3">
                  {form.fields.map((f) => {
                    const value = form.data[f.uniqueId] ?? "";

                    return (
                      <div
                        key={f.uniqueId}
                        className="flex items-center justify-between gap-4 bg-gray-800 p-2 rounded"
                      >
                        <span className="font-medium text-white">{f.label}</span>

                        {f.type === "select" ? (
                          <select
                            value={value}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldChange(form.id, f.uniqueId, e.target.value)
                            }
                            className={`p-1 rounded border border-gray-600 bg-gray-700 text-white w-full max-w-xs ${
                              isEditing
                                ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                : "cursor-not-allowed opacity-70"
                            }`}
                          >
                            <option value="">Select an option</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                          </select>
                        ) : f.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={value || false}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldChange(form.id, f.uniqueId, e.target.checked)
                            }
                            className={`w-5 h-5 ${
                              !isEditing ? "cursor-not-allowed opacity-70" : ""
                            }`}
                          />
                        ) : f.type === "radio" ? (
                          <div className="flex gap-2">
                            <label>
                              <input
                                type="radio"
                                name={f.uniqueId}
                                value="Option 1"
                                disabled={!isEditing}
                                checked={value === "Option 1"}
                                onChange={(e) =>
                                  handleFieldChange(form.id, f.uniqueId, e.target.value)
                                }
                              />{" "}
                              Option 1
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={f.uniqueId}
                                value="Option 2"
                                disabled={!isEditing}
                                checked={value === "Option 2"}
                                onChange={(e) =>
                                  handleFieldChange(form.id, f.uniqueId, e.target.value)
                                }
                              />{" "}
                              Option 2
                            </label>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={value}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleFieldChange(form.id, f.uniqueId, e.target.value)
                            }
                            className={`p-1 rounded border border-gray-600 bg-gray-700 text-white w-full max-w-xs ${
                              isEditing
                                ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                : "cursor-not-allowed opacity-70"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>


                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => toggleEdit(form.id)}
                    className={`px-4 py-2 rounded text-white ${
                      isEditing
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    } transition-colors`}
                  >
                    {isEditing ? "Save Changes" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete Form
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
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
        >
          Clear All Saved Forms
        </button>
      </div>
    </div>
  );
}