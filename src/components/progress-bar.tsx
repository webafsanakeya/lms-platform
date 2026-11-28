import { progressPercent } from "@/lib/progress";

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const percent = progressPercent(done, total);

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span>
          {done} of {total} {total === 1 ? "lesson" : "lessons"}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-1 h-3 border-2 border-ink bg-white"
      >
        <div className="h-full bg-brand-green" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}