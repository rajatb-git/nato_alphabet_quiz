import { loadRatingShown, saveRatingShown } from './storage';

let StoreReview: typeof import('expo-store-review') | null = null;

async function getStoreReview() {
  if (!StoreReview) {
    try {
      StoreReview = await import('expo-store-review');
    } catch {
      return null;
    }
  }
  return StoreReview;
}

/**
 * Request a store review if the user has completed enough sessions and
 * we haven't prompted them before.
 *
 * Call this after a quiz session completes. It silently no-ops if:
 * - Already shown once
 * - expo-store-review is unavailable (e.g. dev/Expo Go)
 * - The device doesn't support the native review dialog
 */
export async function maybeRequestReview(totalSessions: number): Promise<void> {
  // Only trigger at the 3rd session (first meaningful milestone)
  // and again at the 10th, as a second chance if the first was dismissed.
  if (totalSessions !== 3 && totalSessions !== 10) return;

  const alreadyShown = await loadRatingShown();
  if (alreadyShown) return;

  const sr = await getStoreReview();
  if (!sr) return;

  try {
    const isAvailable = await sr.isAvailableAsync();
    if (!isAvailable) return;

    await sr.requestReview();
    await saveRatingShown();
  } catch {
    // Silently ignore — rating prompt is non-critical
  }
}
