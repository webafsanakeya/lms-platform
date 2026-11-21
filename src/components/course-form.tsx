"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeoCard } from "@/components/neo";
import { dollarsToCents, slugify } from "@/lib/course";

export function CourseForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const slugPreview = slugify(title) || "your-course";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const priceCents = dollarsToCents(price);
    if (Number.isNaN(priceCents)) {
      setError("Enter a valid price such as 19.99, or leave it empty for a free course.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/instructor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priceCents, published }),
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

      router.push("/instructor");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = "border-2 border-ink bg-white";

  return (
    <NeoCard className="mt-8 max-w-2xl p-6 shadow-hard-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-semibold">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            required
            className={`h-10 ${fieldClass}`}
          />
          <p className="text-xs">
            Public URL: /courses/<span className="font-semibold">{slugPreview}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold">
            Description
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            required
            rows={6}
            className={`w-full rounded-md px-3 py-2 text-sm ${fieldClass}`}
          />
          <p className="text-xs">{description.length}/2000 (at least 20 characters)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="font-semibold">
            Price in dollars
          </Label>
          <Input
            id="price"
            inputMode="decimal"
            placeholder="0 for a free course"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`h-10 max-w-xs ${fieldClass}`}
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 border-2 border-ink"
          />
          Publish now (visible in the public catalog)
        </label>

        {error && (
          <p
            role="alert"
            className="border-2 border-ink bg-red-100 px-3 py-2 text-sm font-medium"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create course"}
          </Button>
          <Link href="/instructor" className="inline-block py-2 text-sm font-semibold underline">
            Cancel
          </Link>
        </div>
      </form>
    </NeoCard>
  );
}