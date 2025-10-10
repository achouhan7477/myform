"use client";
import SavedForm from "./form/saved/page";
import EditForm from "./form/edit";
import FormBuilder from "./form/create/page";
import { useState } from "react";
import UIWrapper from './component/ui'
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
        <UIWrapper/>
      </div>
    </main>
  );
}
