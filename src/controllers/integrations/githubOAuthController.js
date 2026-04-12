const jwt = require("jsonwebtoken");
const axios = require("axios");

const githubConnect = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId required"
    });
  }

  const state = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
    `&scope=read:user repo` +
    `&state=${state}`;

  return res.redirect(url);
};

const githubCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: { Accept: "application/json" }
      }
    );

    const githubToken = tokenRes.data.access_token;

    // Save token in DB for userId here
    const Integration = require('../../models/Integration');
    await Integration.findOneAndUpdate(
      { studentId: userId },
      { githubToken: githubToken, githubSyncedAt: Date.now(), lastSyncedAt: Date.now() },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      userId,
      githubConnected: true
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "OAuth failed"
    });
  }
};

module.exports = {
  githubConnect,
  githubCallback
};
