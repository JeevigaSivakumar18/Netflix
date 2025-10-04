import React from "react";

export const Input = ({ value, onChange, placeholder, type = "text", className }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded border-gray-400 focus:outline-none focus:border-white bg-black text-white ${className || ""}`}
    />
  );
};
