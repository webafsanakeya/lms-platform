"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = ["STUDENT", "INSTRUCTOR", "ADMIN"] as const;

export function RoleSelect({
  userId,
  current,
  disabled = false,
}: {
  userId: number;
  current: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const previous = value;
    setValue(next);
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });

      if (!res.ok) {
        const data = await res.json();
        setValue(previous); // put the old value back
        setError(data.error ?? "Could not update the role");
        return;
      }
setSaved(true);
setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {
      setValue(previous);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled || saving}
        aria-label={`Role for user ${userId}`}
        className="border-2 border-ink bg-white px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
      {saved && (
  <p role="status" className="mt-1 text-xs font-medium">
    Saved ✓
  </p>
)}
    </div>
  );
}