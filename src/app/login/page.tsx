"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeoCard, Sticker } from "@/components/neo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <NeoCard className="w-full p-8 shadow-hard-lg">
        <Sticker className="text-lg">Welcome back</Sticker>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold underline">
            Register
          </Link>
        </p>
      </NeoCard>
    </main>
  );
}