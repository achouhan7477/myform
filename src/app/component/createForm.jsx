"use client";
import FormBuilder from "./builder";

export default function CreateForm({ showExtras = false }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-[#111] text-white">
      <h2 className="text-xl font-semibold mb-4 text-center text-amber-400">
        Create a New Form
      </h2>

      <FormBuilder />

      {showExtras && (
        <div className="mt-6 space-y-3">
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Save Form
          </button>
          <button className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition">
            Preview Form
          </button>
          <p className="text-sm text-gray-400 text-center">
            Tip: You can edit or delete this form later.
          </p>
        </div>
      )}
    </div>
  );
}
