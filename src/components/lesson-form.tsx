"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeoCard } from "@/components/neo";

export function LessonForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/instructor/courses/${slug}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.issues)) {
          setError(
            data.issues.map((i: { message: string }) => i.message).join(". "),
          );
        } else {
          setError(data.error ?? "Something went wrong");
        }
        return;
      }

      setTitle("");
      setContent("");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <NeoCard className="mt-4 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lesson-title" className="font-semibold">
            Lesson title
          </Label>
          <Input
            id="lesson-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
            className="h-10 border-2 border-ink bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lesson-content" className="font-semibold">
            Content
          </Label>
          <textarea
            id="lesson-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10000}
            required
            rows={8}
            className="w-full rounded-md border-2 border-ink bg-white px-3 py-2 text-sm"
          />
          <p className="text-xs">{content.length}/10000 (at least 10 characters)</p>
        </div>

        {error && (
          <p
            role="alert"
            className="border-2 border-ink bg-red-100 px-3 py-2 text-sm font-medium"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add lesson"}
        </Button>
      </form>
    </NeoCard>
  );
}