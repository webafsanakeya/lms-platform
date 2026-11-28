"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MarkCompleteButton({ lessonId }: { lessonId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not save your progress");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        size="lg"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border-2 border-ink bg-brand-green font-semibold text-ink shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-60"
      >
        {loading ? "Saving..." : "Mark as complete"}
      </Button>
      {error && (
        <p
          role="alert"
          className="mt-3 border-2 border-ink bg-red-100 px-3 py-2 text-sm font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}