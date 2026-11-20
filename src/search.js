// Pure quality search, free of browser APIs so it can be unit-tested.
// `encode(quality)` returns a Promise<Blob>; quality is in the range 0..1.

/**
 * Finds the highest quality whose output fits within `targetBytes`.
 * Returns { blob, quality, reached }. When even the lowest quality is too big,
 * reached is false and blob is the smallest achievable output.
 */
export async function searchQuality({ encode, targetBytes, min = 0.05, max = 1, iterations = 9 }) {
  const top = await encode(max);
  if (top.size <= targetBytes) return { blob: top, quality: max, reached: true };

  const floor = await encode(min);
  if (floor.size > targetBytes) return { blob: floor, quality: min, reached: false };

  // Invariant: `lo` fits the target, `hi` does not.
  let lo = min, hi = max, best = floor;
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const candidate = await encode(mid);
    if (candidate.size <= targetBytes) {
      lo = mid;
      best = candidate;
    } else {
      hi = mid;
    }
  }
  return { blob: best, quality: lo, reached: true };
}
