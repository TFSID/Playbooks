"use client";

export default function FormField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  rows,
  className,
  error,
  children,
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

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
          onChange={handleChange}
          value={value}
          className={`w-full p-2 rounded-md border ${
            error ? "border-destructive" : "border-input"
          } bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          onChange={handleChange}
          value={value}
          className={`w-full p-2 rounded-md border ${
            error ? "border-destructive" : "border-input"
          } bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary neon-input-focus file-input-custom`}
        />
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      {children}
    </div>
  );
}
