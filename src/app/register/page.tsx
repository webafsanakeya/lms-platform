"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeoCard, Sticker } from "@/components/neo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (Array.isArray(data.issues)) {
          setError(
            data.issues
              .map((i: { message: string }) => i.message)
              .join(". "),
          );
        } else {
          setError(data.error ?? "Something went wrong");
        }
        return;
      }
      router.push("/login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <NeoCard className="w-full p-8 shadow-hard-lg">
        <Sticker className="bg-brand-green text-lg">Join us</Sticker>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 border-2 border-ink bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 border-2 border-ink bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 border-2 border-ink bg-white"
            />
            <p className="text-xs">At least 8 characters.</p>
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
            className="w-full rounded-lg border-2 border-ink bg-brand-blue font-semibold text-white shadow-hard transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold underline">
            Log in
          </Link>
        </p>
      </NeoCard>
    </main>
  );
}