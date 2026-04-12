const { getDaysBetween } = require('../../utils/helpers/dateHelpers');
const { clamp } = require('../../utils/helpers/mathHelpers');

/**
 * Consistency Tracker Service
 *
 * Calculates two metrics from a sorted array of activity dates:
 *   1. currentStreak  — consecutive days of activity ending today (or yesterday)
 *   2. maxStreak      — longest consecutive-day streak ever recorded
 *   3. score (0–100)  — percentage of last 30 days that had activity
 */

/**
 * Calculates the current streak and max streak from a sorted date array.
 *
 * @param {(Date|string)[]} dates - Sorted ascending array of activity dates
 * @returns {{ currentStreak: number, maxStreak: number }}
 */
const getStreakData = (dates = []) => {
  if (!dates.length) return { currentStreak: 0, maxStreak: 0 };

  // Normalise to date-only strings "YYYY-MM-DD" and deduplicate
  // (multiple events on same day count as one active day)
  const uniqueDays = [
    ...new Set(
      dates.map((d) => new Date(d).toISOString().split('T')[0])
    ),
  ].sort();

  if (!uniqueDays.length) return { currentStreak: 0, maxStreak: 0 };

  // ── Calculate current streak ───────────────────────────────────────────────
  // Walk backwards from today. If the most recent activity was today or
  // yesterday, start counting. Stop when a gap > 1 day is found.
  const today = new Date().toISOString().split('T')[0];
  const lastDay = uniqueDays[uniqueDays.length - 1];
  const gapFromToday = getDaysBetween(lastDay, today);

  let currentStreak = 0;
  if (gapFromToday <= 1) {
    // Start from the last recorded day and walk backwards
    currentStreak = 1;
    for (let i = uniqueDays.length - 1; i > 0; i--) {
      const gap = getDaysBetween(uniqueDays[i - 1], uniqueDays[i]);
      if (gap === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // ── Calculate max streak ───────────────────────────────────────────────────
  let maxStreak = 1;
  let runningStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const gap = getDaysBetween(uniqueDays[i - 1], uniqueDays[i]);
    if (gap === 1) {
      runningStreak++;
      if (runningStreak > maxStreak) maxStreak = runningStreak;
    } else {
      runningStreak = 1;
    }
  }

  return { currentStreak, maxStreak };
};

/**
 * Calculates a 0–100 consistency score based on activity density
 * in the last 30 days.
 *
 * @param {(Date|string)[]} activityLog - Array of activity dates
 * @returns {number} Score 0–100
 */
const calculateConsistencyScore = (activityLog = []) => {
  if (!activityLog.length) return 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeDays = new Set(
    activityLog
      .filter((d) => new Date(d) >= thirtyDaysAgo)
      .map((d) => new Date(d).toISOString().split('T')[0])
  ).size;

  return clamp(Math.round((activeDays / 30) * 100), 0, 100);
};

module.exports = { getStreakData, calculateConsistencyScore };
