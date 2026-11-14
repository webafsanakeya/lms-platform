import { NeoCard } from "@/components/neo";
import { Tilt } from "@/components/tilt";

// The floating preview cards in the hero. Each one floats on its own timing
// and tilts in 3D when the mouse moves over it.
export function HeroCards() {
  return (
    <div className="relative hidden h-[420px] lg:block">
      <span
        aria-hidden
        className="absolute right-6 top-2 h-3 w-3 rotate-12 border-2 border-ink bg-brand-purple"
      />
      <span
        aria-hidden
        className="absolute bottom-8 left-6 h-4 w-4 -rotate-12 border-2 border-ink bg-brand-yellow"
      />

      {/* Today's course */}
      <Tilt className="absolute left-8 top-0 w-72">
        <div className="animate-float" style={{ animationDelay: "0s" }}>
          <NeoCard className="rotate-1 p-0">
            <div className="p-4 text-sm font-semibold">Today&apos;s course</div>
            <div className="rounded-b-2xl bg-brand-green p-4">
              <p className="font-display text-lg font-bold">React Basics</p>
              <p className="text-xs">Sample data</p>
              <div className="mt-3 h-2 rounded-full bg-white/60">
                <div className="h-2 w-4/5 rounded-full bg-ink" />
              </div>
            </div>
          </NeoCard>
        </div>
      </Tilt>

      {/* Performance */}
      <Tilt className="absolute left-0 top-44 w-64">
        <div className="animate-float" style={{ animationDelay: "1.2s" }}>
          <NeoCard className="-rotate-1">
            <p className="text-sm font-semibold">Performance</p>
            <svg viewBox="0 0 200 80" className="mt-3 h-20 w-full" aria-hidden>
              <polyline
                points="0,60 30,40 60,50 90,20 120,35 150,15 200,30"
                fill="none"
                stroke="#2f6bff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="0,70 40,55 80,65 120,45 160,55 200,40"
                fill="none"
                stroke="#ffe53b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 text-xs text-muted-foreground">Sample data</p>
          </NeoCard>
        </div>
      </Tilt>

      {/* Scheduled */}
      <Tilt className="absolute right-0 top-52 w-64">
        <div className="animate-float" style={{ animationDelay: "2.4s" }}>
          <NeoCard className="rotate-2">
            <p className="text-sm font-semibold">Scheduled</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-lg border-2 border-ink bg-brand-purple px-3 py-2 text-sm font-semibold text-white">
                Intro to React
              </div>
              <div className="rounded-lg border-2 border-ink bg-brand-yellow px-3 py-2 text-sm font-semibold">
                Node.js APIs
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Sample data</p>
          </NeoCard>
        </div>
      </Tilt>
    </div>
  );
}