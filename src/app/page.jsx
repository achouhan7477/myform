"use client";
import SavedForm from "./component/saved";
import EditForm from "./component/edit";
import FormBuilder from "./component/builder";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("create");

  const getTabClass = (tab) =>
    `px-4 py-2 rounded cursor-pointer transition-all duration-300 border 
   ${
     activeTab === tab
       ? "bg-amber-500 text-black border-amber-500 shadow-md"
       : "bg-white text-gray-700 hover:bg-amber-100 border-gray-300"
   }`;

  return (
    <main className="p-6">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("create")}
          className={getTabClass("create")}
        >
          Create Form
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={getTabClass("saved")}
        >
          My Saved Form
        </button>

           {/* <button
          onClick={() => setActiveTab("edit")}
          className={getTabClass("edit")}
        >
          Edit Form
        </button> */}
      </div>

      <div className="transition-all duration-500">
        {activeTab === "create" && <FormBuilder />}
        {activeTab === "saved" && <SavedForm />}
        {activeTab === "edit" && <EditForm />}
      </div>
    </main>
  );
}
