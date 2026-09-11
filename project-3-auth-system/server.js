import express from "express";
import "dotenv/config";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { db } from "./src/prisma/db.ts";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  return typeof email === "string" && emailRegex.test(email);
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

app.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await db.orm.public.User
      .where({ email })
      .first();

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await db.orm.public.User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email",
      });
    }

    const user = await db.orm.public.User
      .where({ email })
      .first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});