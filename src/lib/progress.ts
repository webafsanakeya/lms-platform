// Percentage of lessons completed, rounded and kept between 0 and 100.
export function progressPercent(done: number, total: number) {
  if (total <= 0) return 0;
  const value = Math.round((done / total) * 100);
  return Math.min(100, Math.max(0, value));
}