"use client";

export default function FormField({
  label,
  id,
  name,
  type = "text",
  onChange,
  rows,
  className,
  children,
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium neon-text mb-2">
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          onChange={onChange}
          className="w-full p-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus"
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          className="w-full p-2 rounded-md border border-input bg-background text-sm  focus-visible:ring-2 neon-input-focus file-input-custom focus-visible:outline-none focus-visible:ring-primary neon-input-focus"
        />
      )}
      {children}
    </div>
  );
}
