import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { faker } from "@faker-js/faker";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || "secret";

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const emails = ["admin@gmail.com", "serif@gmail.com"];

/**
 * @typedef {Object} TokenPayload
 * @property {string} username
 * @property {number} password
 * @property {number} email
 * @property {number} role
 * @property {number} name
 * @property {number} surname
 * @property {number} id
 * @property {number} iat
 * @property {number} exp
 */

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} password
 * @property {string} email
 * @property {string} role
 * @property {string} name
 * @property {string} surname
 * @property {string} id
 */

/**
 * @typedef {Object} UserTodo
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} description
 */

/**
 * @type {User[]}
 */
const users = [
  {
    username: "admin",
    password: "admin",
    email: emails[0],
    role: "admin",
    name: "Admin",
    surname: "Admin",
    id: faker.string.uuid(),
  },
  {
    username: "serif",
    password: "serif",
    email: emails[1],
    role: "user",
    name: "Serif",
    surname: "Serif",
    id: faker.string.uuid(),
  },
];

/**
 * @type {UserTodo[]}
 * */
let todos = [
  {
    id: faker.string.uuid(),
    userId: users[0].id,
    title: "Admin Todo",
    description: faker.lorem.sentence(),
  },
  {
    id: faker.string.uuid(),
    userId: users[1].id,
    title: "Serif Todo",
    description: faker.lorem.sentence(),
  },
];

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.post("/login", (req, res) => {
  console.log("login", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "1h" });

    res.cookie("sso_token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.json({ message: "Login successful" });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

app.get("/verify", (req, res) => {
  console.log("verify", req.cookies, req.body);
  const token = req.cookies.sso_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    /**
     * @type {TokenPayload | null}
     */
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false, error: "Invalid token" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("sso_token");
  res.json({ message: "Logout successful" });
});

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

/**
 *
 * @param {string} token
 * @returns {User | null}
 */
function getUser(token) {
  return jwt.verify(token, SECRET_KEY).user;
}

// Get todos for a specific user
app.get("/todos/:userId", (req, res) => {
  const ssoToken = req.cookies.sso_token;
  const user = getUser(ssoToken);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userTodos = todos.filter((todo) => todo.userId === user.id);
  res.json(userTodos);
});

// Add a new todo
app.post("/todos", (req, res) => {
  const ssoToken = req.cookies.sso_token;
  const user = getUser(ssoToken);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { title, description } = req.body;
  /**
   * @type {UserTodo}
   */
  const newTodo = {
    id: faker.string.uuid(),
    userId: user.id,
    title,
    description,
  };
  todos.push(newTodo);
  res.status(201).json({
    message: "Todo added successfully",
    data: newTodo,
  });
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const ssotoken = req.cookies.sso_token;
  const user = getUser(ssotoken);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const { title, description } = req.body;
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todos[index] = {
      ...todos[index],
      title,
      description,
    };
    res.json({
      message: "Todo updated successfully",
      data: todos[index],
    });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const ssoToken = req.cookies.sso_token;
  const user = getUser(ssoToken);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todos = todos.filter((todo) => todo.id !== id);
    res.json({ message: "Todo deleted successfully" });
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.listen(4000, () => {
  console.log("Server running on port https://localhost:4000");
});
