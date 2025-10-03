export const forms = [
  {
    id: "form1",
    title: "Profile 1",
    fields: [
      { type: "text", name: "username", label: "Username" },
      { type: "email", name: "email", label: "Email" },
      { type: "password", name: "password", label: "Password" },
      { type: "number", name: "age", label: "Age" },
      { type: "date", name: "dob", label: "Date of Birth" },
      { type: "select", name: "gender", label: "Gender", options: ["M", "F"] },
      { type: "checkbox", name: "terms", label: "Accept T&C" },
    ],
  },
  {
    id: "form2",
    title: "Profile 2",
    fields: [
      { type: "text", name: "name", label: "Name" },
      { type: "email", name: "email", label: "Email" },
      { type: "select", name: "rating", label: "Rating", options: ["1", "2"] },
      { type: "textarea", name: "feedback", label: "Feedback" },
      { type: "file", name: "screenshot", label: "Upload ss" },
      { type: "checkbox", name: "subscribe", label: "Subscribe" },
    ],
  },
  {
    id: "form3",
    title: "Profile 3",
    fields: [
      { type: "text", name: "fullname", label: "Name" },
      { type: "email", name: "email", label: "Email" },
      { type: "number", name: "experience", label: "YOE" },
      { type: "text", name: "skills", label: "Skills" },
      { type: "file", name: "resume", label: "Upload Resume" },
      { type: "date", name: "availability", label: "Available?" },
      { type: "select", name: "position", label: "Position", options: ["Frontend", "Backend", "Fullstack"] },
      { type: "checkbox", name: "relocate", label: "relocate?" },
    ],
  },
];
