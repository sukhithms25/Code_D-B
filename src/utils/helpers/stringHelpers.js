/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Converts a string to a URL-safe slug.
 * @param {string} str
 * @returns {string}  e.g. "Hello World!" → "hello-world"
 */
const slugify = (str = '') =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

/**
 * Truncates a string to `len` characters, appending "..." if cut.
 * @param {string} str
 * @param {number} len
 * @returns {string}
 */
const truncate = (str = '', len = 100) =>
  str.length > len ? str.slice(0, len) + '...' : str;

/**
 * Strips leading/trailing whitespace and collapses internal spaces.
 * Useful for sanitising user-input text before sending to OpenAI.
 * @param {string} str
 * @returns {string}
 */
const sanitize = (str = '') =>
  str.trim().replace(/\s+/g, ' ');

module.exports = { capitalize, slugify, truncate, sanitize };
