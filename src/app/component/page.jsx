"use client";
import { useState } from "react";

export default function MyForm({ form }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0]?.name : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-bold mb-4">              User Profile
</h2>
      {form.fields.map((field) => (
        <div key={field.name} className="mb-3">
          <label className="block mb-1 font-medium">{field.label}</label>

          {["text", "email", "password", "number", "date"].includes(field.type) && (
            <input
              type={field.type}
              name={field.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              name={field.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          )}

          {field.type === "select" && (
            <select name={field.name} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select</option>
              {field.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === "checkbox" && (
            <input type="checkbox" name={field.name} onChange={handleChange} />
          )}

          {field.type === "file" && (
            <input type="file" name={field.name} onChange={handleChange} />
          )}
        </div>
      ))}

      <button type="submit" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
}
