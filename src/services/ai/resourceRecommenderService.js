const resources = require("../../data/resources");

const recommendResources = (topic) => {
  const key = (topic || "").toLowerCase().trim();
  return resources[key] || [];
};

module.exports = { recommendResources };
