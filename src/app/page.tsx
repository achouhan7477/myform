'use client'
import SavedForm from "./component/saved";
// import FieldPreview from "./component/field";
import FormBuilder from "./component/builder";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <main className="p-6">
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setActiveTab("create")} className="px-4 py-2 cursor-pointer border rounded">
          Create Form
        </button>
        {/* <button onClick={() => setActiveTab("preview")} className="px-4 py-2 border rounded">
          Preview
        </button> */}
        <button onClick={() => setActiveTab("saved")} className="px-4 py-2 cursor-pointer border rounded">
          My Saved Form
        </button>
      </div>

      {activeTab === "create" && <FormBuilder />}
      {/* {activeTab === "preview" && <FieldPreview  />} */}
      {activeTab === "saved" && <SavedForm />}
    </main>
  );
}
