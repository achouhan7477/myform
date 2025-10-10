"use client";
import { useEffect, useState } from "react";

export default function SavedFormsPreview() {
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem("savedForms")) || [];
    setSavedForms(forms);
  }, []);

  if (savedForms.length === 0) {
    return (
      <div className="text-gray-400 text-center py-6">
        No forms created yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedForms.map((form) => (
        <div
          key={form.id}
          className="border border-gray-700 rounded-xl p-4 bg-[#1E1E1E] text-gray-200 shadow-lg hover:shadow-amber-500/30 transition-all duration-200"
        >
          <h3 className="text-xl font-bold text-amber-400 mb-2">
            {form.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Saved At: {form.savedAt}
          </p>
          <div className="space-y-2">
            {form.fields.map((f) => (
              <div key={f.uniqueId} className="flex items-center gap-2">
                <span className="font-medium text-gray-300">{f.label}:</span>
                <span className="text-gray-200">
                  {form.data[f.uniqueId] || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
