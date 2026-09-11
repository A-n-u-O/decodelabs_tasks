import express from "express";
import "dotenv/config";

import { db } from "./src/prisma/db.ts";

const app = express();
const PORT = process.env.PORT || 3003;


app.use(express.json());

const validateUserId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  req.userId = id;
  next();
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/users", async (req, res) => {
  try {
    const { email, age } = req.body;

    if (!email || age === undefined) {
      return res.status(400).json({
        message: "Email and age are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof email !== "string" || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email",
      });
    }

    if (!Number.isInteger(age) || age < 1) {
      return res.status(400).json({
        message: "Age must be a positive integer",
      });
    }

    if (!email || age === undefined) {
      return res.status(400).json({
        message: "Email and age are required",
      });
    }

    const existingUser = await db.orm.public.User.where({ email }).first();

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }
    const user = await db.orm.public.User.create({
      email,
      age,
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.orm.public.User.all();

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/users/:id", validateUserId, async (req, res) => {
  try {
    const id = req.userId;

    const user = await db.orm.public.User.where({ id }).first();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
app.put("/users/:id", validateUserId, async (req, res) => {
  try {
    const id = req.userId;
    const { email, age, isActive } = req.body;

    const existingUser = await db.orm.public.User.where({ id }).first();

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = await db.orm.public.User.where({ id }).update({
      email,
      age,
      isActive,
    });

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.delete("/users/:id", validateUserId, async (req, res) => {
  try {
    const id = req.userId;

    const existingUser = await db.orm.public.User.where({ id }).first();

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await db.orm.public.User.where({ id }).delete();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
