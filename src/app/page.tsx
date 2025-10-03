"use client";
import { useState } from "react";
import { forms } from "./constants/page";
import MyForm from "./component/page";

export default function Page() {
  const [selectedForm, setSelectedForm] = useState(forms[0]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-black mb-6 text-center">
          MyForm
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {forms.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedForm(f)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm 
                ${
                  selectedForm.id === f.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              {f.title}
            </button>
          ))}
        </div>

        <div className="border rounded-xl p-6 bg-gray-50 text-black">
          <MyForm form={selectedForm} />
        </div>
      </div>
    </div>
  );
}
