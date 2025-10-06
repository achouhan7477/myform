"use client";
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../component/items";
import FieldPreview from "../component/field";
import { availableFields } from "../constants/page";

export default function FormConfigure() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [activeFieldId, setActiveFieldId] = useState(null);

  const addField = (field) => {
    const newField = {
      ...field,
      uniqueId: Date.now().toString(),
      label: field.label,
      defaultValue: "",
      required: false,
      validation: "",
      options: field.type === "radio" || field.type === "select" || field.type === "checkbox"
        ? ["Option 1", "Option 2"]
        : [],
    };
    setSelectedFields([...selectedFields, newField]);
    setActiveFieldId(newField.uniqueId);
  };

  const updateField = (id, key, value) => {
    setSelectedFields((prev) =>
      prev.map((f) => (f.uniqueId === id ? { ...f, [key]: value } : f))
    );
  };

  const updateOption = (id, index, value) => {
    setSelectedFields((prev) =>
      prev.map((f) =>
        f.uniqueId === id
          ? { ...f, options: f.options.map((opt, i) => (i === index ? value : opt)) }
          : f
      )
    );
  };

  const addOption = (id) => {
    setSelectedFields((prev) =>
      prev.map((f) =>
        f.uniqueId === id ? { ...f, options: [...f.options, "New Option"] } : f
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
    setSelectedFields((items) => {
      const oldIndex = items.findIndex((i) => i.uniqueId === active.id);
      const newIndex = items.findIndex((i) => i.uniqueId === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const activeField = selectedFields.find((f) => f.uniqueId === activeFieldId);

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      <div className="col-span-1">
        <h2 className="font-bold mb-4">Available Fields</h2>
        {availableFields.map((f) => (
          <div
            key={f.id}
            className="border p-2 mb-2 rounded cursor-pointer"
            onClick={() => addField(f)}
          >
            <div className="font-semibold">{f.label}</div>
            <div className="text-sm text-gray-400">{f.details}</div>
          </div>
        ))}
      </div>

      <div className="col-span-2">
        <h2 className="font-bold mb-4">Form Preview</h2>
        <FieldPreview selectedFields={selectedFields} />
      </div>

      <div className="col-span-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Selected Fields</h2>
          <button
            onClick={clearFields}
            className="text-sm text-red-600 hover:underline"
          >
            Clear Fields
          </button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={selectedFields.map((f) => f.uniqueId)}
            strategy={verticalListSortingStrategy}
          >
            {selectedFields.map((f) => (
              <div
                key={f.uniqueId}
                onClick={() => setActiveFieldId(f.uniqueId)}
                className={`border p-2 mb-2 rounded cursor-pointer ${
                  f.uniqueId === activeFieldId ? "border-blue-500 bg-black-50" : ""
                }`}
              >
                {f.label}
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {activeField && (
          <div className="mt-4 p-4 border rounded bg-black-50">
            <h3 className="font-semibold mb-2">Field Options</h3>

            <label className="block mb-1 text-sm font-medium">Label</label>
            <input
              type="text"
              className="border p-1 w-full mb-2"
              value={activeField.label}
              onChange={(e) =>
                updateField(activeField.uniqueId, "label", e.target.value)
              }
            />

            <label className="block mb-1 text-sm font-medium">Default Value</label>
            <input
              type="text"
              className="border p-1 w-full mb-2"
              value={activeField.defaultValue}
              onChange={(e) =>
                updateField(activeField.uniqueId, "defaultValue", e.target.value)
              }
            />

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Required</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={activeField.required}
                  onChange={(e) =>
                    updateField(activeField.uniqueId, "required", e.target.checked)
                  }
                />
                <div
                  className="w-11 h-6 bg-black-300 rounded-full peer
                    peer-checked:after:translate-x-full peer-checked:after:border-white
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                    after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
                ></div>
              </label>
            </div>

            <label className="block mb-1 text-sm font-medium">Validation Rules</label>
            <input
              type="text"
              className="border p-1 w-full mb-3"
              placeholder="e.g., minLength:5, pattern:^[a-z]+$"
              value={activeField.validation}
              onChange={(e) =>
                updateField(activeField.uniqueId, "validation", e.target.value)
              }
            />

            {(activeField.type === "radio" ||
              activeField.type === "select" ||
              activeField.type === "checkbox") && (
              <div>
                <label className="block mb-2 text-sm font-medium">Options</label>
                {activeField.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    className="border p-1 w-full mb-1"
                    value={opt}
                    onChange={(e) =>
                      updateOption(activeField.uniqueId, i, e.target.value)
                    }
                  />
                ))}
                <button
                  className="text-sm text-blue-600 mt-1"
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
