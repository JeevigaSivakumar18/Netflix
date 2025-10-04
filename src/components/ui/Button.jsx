import React from "react";

export const Button = ({ children, onClick, className, type = "button" }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
