"use client";
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { availableFields } from "../constants/availableFields";

function SortableItem({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="border p-2 mb-2 bg-black shadow rounded cursor-move">
      {label}
    </div>
  );
}

export default function FormBuilder() {
  const [selectedFields, setSelectedFields] = useState([]);

  const addField = (field) => {

    setSelectedFields([...selectedFields, { ...field, uniqueId: Date.now().toString() }]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSelectedFields((items) => {
        const oldIndex = items.findIndex((i) => i.uniqueId === active.id);
        const newIndex = items.findIndex((i) => i.uniqueId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div>
        <h2 className="font-bold mb-2">Available Fields</h2>
        {availableFields.map((f) => (
          <button
            key={f.id}
            onClick={() => addField(f)}
            className="block w-full border p-2 mb-2 rounded"
          >
            ➕  {f.label}
          </button>
        ))}
      </div>

      <div>
        <h2 className="font-bold mb-2">Selected Fields</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={selectedFields.map((f) => f.uniqueId)} strategy={verticalListSortingStrategy}>
            {selectedFields.map((f) => (
              <SortableItem key={f.uniqueId} id={f.uniqueId} label={f.label} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div>
        <h2 className="font-bold text-black mb-2">Form Preview</h2>
        <form className="space-y-4 border p-4 text-black rounded bg-black-50">
          {selectedFields.map((f) => (
            <div key={f.uniqueId}>
              <label className="block mb-1 font-medium">{f.label}</label>
              {f.type === "text" && <input type="text" className="border p-2 w-full" />}
              {f.type === "email" && <input type="email" className="border p-2 w-full" />}
              {f.type === "tel" && <input type="tel" className="border p-2 w-full" />}
              {f.type === "number" && <input type="number" className="border p-2 w-full" />}
              {f.type === "date" && <input type="date" className="border p-2 w-full" />}
              {f.type === "password" && <input type="password" className="border p-2 w-full" />}
              {f.type === "textarea" && <textarea className="border p-2 w-full"></textarea>}
              {f.type === "select" && (
                <select className="border p-2 w-full">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              )}
              {f.type === "checkbox" && <input type="checkbox" />}
              {f.type === "radio" && (
                <div>
                  <input type="radio" name={f.uniqueId} /> Option 1
                  <input type="radio" name={f.uniqueId} className="ml-4" /> Option 2
                </div>
              )}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
