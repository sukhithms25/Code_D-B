/**
 * Clamps a number between min and max (inclusive).
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Rounds to 2 decimal places.
 * @param {number} num
 * @returns {number}
 */
const roundToTwo = (num) => Math.round(num * 100) / 100;

/**
 * Calculates a weighted score from an array of { value, weight } items.
 * Weights are treated as percentages (e.g. 30 = 30%).
 *
 * Example:
 *   weightedScore([
 *     { value: 80, weight: 30 },  // coding
 *     { value: 70, weight: 30 },  // projects
 *     { value: 90, weight: 20 },  // problemSolving
 *     { value: 60, weight: 20 },  // consistency
 *   ]) → 75.0
 *
 * @param {{ value: number, weight: number }[]} items
 * @returns {number}
 */
const weightedScore = (items) =>
  roundToTwo(
    items.reduce((sum, item) => sum + (item.value * item.weight) / 100, 0)
  );

/**
 * Converts a raw score (0–100) to a percentage string.
 * @param {number} score
 * @param {number} [total=100]
 * @returns {string} e.g. "75.50%"
 */
const toPercentage = (score, total = 100) =>
  `${roundToTwo((score / total) * 100)}%`;

module.exports = { clamp, roundToTwo, weightedScore, toPercentage };
