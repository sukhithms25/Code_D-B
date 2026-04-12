const resources = require("../../data/resources");

const getResources = async (req, res) => {
  const topic = (req.query.topic || "").toLowerCase().trim();

  if (!topic) {
    return res.status(400).json({
      success: false,
      message: "Topic is required"
    });
  }

  const result = resources[topic] || [];

  return res.status(200).json({
    success: true,
    topic,
    count: result.length,
    resources: result
  });
};

module.exports = { getResources };
