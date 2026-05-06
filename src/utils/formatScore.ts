export function formatScore(score: number): string {
  return new Intl.NumberFormat('en-GB').format(score);
}
