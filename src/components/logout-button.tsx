"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="rounded-lg border-2 border-ink bg-white font-semibold shadow-[2px_2px_0_0_#111111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
    >
      Logout
    </Button>
  );
}