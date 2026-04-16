const express = require('express');
const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authRouter = express.Router();

// REGISTER
authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: `User already exists with this email: ${email}`,
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  const user = await userModel.create({ name, email, password: hash });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      name: user.name,
      email: user.email,
    }
  });
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User does not exist"
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  if (user.password !== hash) {
    return res.status(401).json({
      message: "Invalid password"
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in!",
    user: {
      name: user.name,
      email: user.email
    }
  });
});

// GET-ME
authRouter.get("/get-me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    res.json({
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = authRouter;