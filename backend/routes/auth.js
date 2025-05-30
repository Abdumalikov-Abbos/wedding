const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");

router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName, phone } = await req.body;

    console.log(username, password, fullName, phone);

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      password,
      fullName,
      phone,
      role: "user", // Set default role as 'user'
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          accessToken: token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            phone: user.phone,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          accessToken: token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            phone: user.phone,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, logout failed" });
    }

    // Find and blacklist the token
    const tokenDoc = await Token.findOne({ token });
    if (tokenDoc) {
      tokenDoc.blacklisted = true;
      await tokenDoc.save();
    }

    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
