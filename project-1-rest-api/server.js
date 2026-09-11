const express = require("express");
const app = express();

//middleware that allows Express to read JSON data sent in a request body.
app.use(express.json());
const PORT = 3002;
const users = [];

//get all users
app.get("/users", (req, res) => {
  res
    .status(200)
    .json({ message: "users retrieved successfully", users: users });
});

//post a new user
app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);

  // Validate input
  if (!user.name || !user.role) {
    return res.status(400).json({
      message: "Name and role are required",
    });
  }

  const newUser = {
    id: users.length + 1,
    name: user.name,
    role: user.role,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: user,
  });
});

const nameExists = users.some(
  (user) => user.name.toLowerCase() === user.name.trim().toLowerCase(),
);
if (nameExists) {
  return res.status(409).json({ message: "Username already exists" });
}

app.use((req, res) => {
  res.status(404).json({ message: "Page not Found" });
});

app.listen(PORT, () => console.log(`server is running at port ${PORT}`));
