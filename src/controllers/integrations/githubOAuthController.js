const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../../models/User");

const githubConnect = async (req, res) => {
  // Use query param OR authenticated user ID
  const userId = req.query.userId || req.user?.id || req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required to connect GitHub"
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
    
    if (!githubToken) {
       return res.status(400).json({ success: false, message: "Invalid code or token exchange failed" });
    }

    const profileRes = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/json"
        }
      }
    );

    const reposRes = await axios.get(
      "https://api.github.com/user/repos?per_page=100",
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/json"
        }
      }
    );

    const profile = profileRes.data;
    const repos = reposRes.data;

    const githubData = {
      githubConnected: true,
      githubUsername: profile.login,
      githubProfileUrl: profile.html_url,
      githubAvatar: profile.avatar_url,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      repoCount: repos.length,
      lastGithubSync: new Date()
    };

    await User.findByIdAndUpdate(userId, {
      ...githubData
    });

    const Integration = require("../../models/Integration");
    await Integration.findOneAndUpdate(
      { studentId: userId },
      { githubToken, githubSyncedAt: Date.now(), lastSyncedAt: Date.now() },
      { new: true, upsert: true }
    );

    return res.redirect(`${process.env.FRONTEND_URL}/student/profile?github=success`);

  } catch (err) {
    console.error("GitHub OAuth Error:", err.message);
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
