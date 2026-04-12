/**
 * Returns the number of whole days between two dates.
 * @param {Date|string} a - Start date
 * @param {Date|string} b - End date
 * @returns {number}
 */
const getDaysBetween = (a, b) =>
  Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

/**
 * Returns true if the given date is within `days` days of today.
 * @param {Date|string} date
 * @param {number} days
 * @returns {boolean}
 */
const isWithinDays = (date, days) =>
  getDaysBetween(date, new Date()) <= days;

/**
 * Returns the start and end Date objects for the current week (Mon–Sun).
 * @returns {{ start: Date, end: Date }}
 */
const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();                          // 0 = Sun, 1 = Mon …
  const diffToMonday = (day === 0 ? -6 : 1 - day);  // shift to Monday
  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Formats a Date to ISO date string: "YYYY-MM-DD"
 * @param {Date} date
 * @returns {string}
 */
const toISODate = (date = new Date()) =>
  date.toISOString().split('T')[0];

module.exports = { getDaysBetween, isWithinDays, getCurrentWeekRange, toISODate };
