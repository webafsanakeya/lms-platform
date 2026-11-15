"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EnrollButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${slug}/enroll`, { method: "POST" });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      // 409 means "already enrolled": refreshing shows the enrolled state
      if (!res.ok && res.status !== 409) {
        const data = await res.json();
        setError(data.error ?? "Could not enroll. Please try again.");
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
    <div className="mt-6">
      <Button
        type="button"
        size="lg"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-60"
      >
        {loading ? "Enrolling..." : "Enroll now"}
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