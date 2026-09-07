import React from "react";
export default function Field({ label, value, onChange, placeholder, type="text", required=false }) {
  return (
    <label className="field">
      <span>{label}{required && <b>*</b>}</span>
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}
