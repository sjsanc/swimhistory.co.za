import React from "react";

export default function Toast({ color, text, visible }) {
  return (
    <div className="toast-inner-wrapper">
      <div
        className={`toast flex items-center justify-center fixed rounded shadow-md toast-${color} ${
          visible ? "toast-visible" : undefined
        }`}>
        {text}
      </div>
    </div>
  );
}
