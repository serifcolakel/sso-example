# How to Run Projects

## API (Node.js with Express)

1. Navigate to the `api` directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `api` directory with the following content:

   ```plaintext
   SECRET_KEY=your_secret_key
   ```

4. Start the API server:

   ```bash
   npm start
   npm run dev (for development)
   ```

## Main Application (React)

1. Navigate to the `main-app` directory:

   ```bash
   cd main-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

## External Application (React)

1. Navigate to the `external-app` directory:

   ```bash
   cd external-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

# Single Sign-On (SSO): A Comprehensive Guide

Single Sign-On (SSO) is an authentication mechanism that allows users to log in once and access multiple connected applications or systems without needing to reauthenticate for each one. SSO centralizes user authentication into a single, trusted system (often called an Identity Provider, or IdP), which then manages credentials and issues tokens or session data to verify the user's identity across other services (known as Service Providers, or SPs).

In this guide, we'll explore how SSO works, its benefits and disadvantages, common use cases, and examples of SSO implementation in an API (Node.js with Express), a main application (React), and an external application (React). By understanding the principles and practices of SSO, organizations can enhance user experience, security, and operational efficiency across their applications and systems.

## Table of Contents

- [Single Sign-On (SSO)](#single-sign-on-sso)
  - [How Does SSO Work?](#how-does-sso-work)
  - [Benefits of SSO](#benefits-of-sso)
  - [Disadvantages of SSO](#disadvantages-of-sso)
  - [Use Cases for SSO](#use-cases-for-sso)
  - [SSO Implementation Examples](#sso-implementation-examples)
    - [1. API (Node.js with Express)](#1-api-nodejs-with-express)
    - [2. Main Application (React)](#2-main-application-react)
    - [3. External Application (React)](#3-external-application-react)
- [Conclusion](#conclusion)

## Demo Video

https://github.com/user-attachments/assets/3f94f0c2-c024-4ef3-879c-e72099d14eee

## Links

- [GitHub Repository]()

## Single Sign-On (SSO)

Single Sign-On (SSO) is an authentication mechanism that allows users to log in once and gain access to multiple connected applications or systems without needing to reauthenticate for each one.

SSO centralizes user authentication into a single, trusted system (often called an Identity Provider, or IdP), which then manages credentials and issues tokens or session data to verify the user's identity across other services (known as Service Providers, or SPs).

## How Does SSO Work?

SSO operates through secure token-based mechanisms like OAuth 2.0, OpenID Connect (OIDC), or Security Assertion Markup Language (SAML). Here's a simplified flow:

- `User Login`: The user enters their credentials in the Identity Provider (IdP).

- `Token Issuance`: The IdP validates the credentials and issues an authentication token (e.g., JWT or SAML assertion).

- `Service Access`: The token is passed to the Service Providers, which validate it and grant access without requiring further logins.

## Benefits of SSO

- **Enhanced User Experience**: Users can access multiple services with a single login, reducing friction and improving usability.

- **Improved Security**:

  - Reduces password fatigue, which can lead to unsafe practices like password reuse.
  - Centralized authentication allows for stronger password policies and enforcement of multi-factor authentication (MFA).

- **Simplified User Management**:

  - Easier for administrators to manage user access across connected applications.
  - Revoking access to a user from the IdP disables their access to all integrated systems.

- **Time and Cost Efficiency**:

  - Saves time for users and support teams by reducing login-related help desk requests.
  - Reduces development time and costs by leveraging existing authentication mechanisms.

- **Compliance and Auditing**:

  - Centralized authentication and access control make it easier to enforce security policies and track user activity.

## Disadvantages of SSO

- **Single Point of Failure**:

  - If the IdP is unavailable or compromised, users cannot access any connected systems.
  - Mitigation: Use redundant IdPs and ensure high availability.

- **Complex Implementation**:

  - Integrating SSO requires significant planning and expertise, especially in environments with diverse applications and protocols.
  - Mitigation: Leverage established protocols like OAuth 2.0 or SAML and robust SSO libraries.

- **Security Risks**:

  - If an attacker gains access to the user's SSO credentials, they can potentially access all connected systems.
  - Mitigation: Enforce strong MFA and monitor for suspicious login activity.

- **Vendor Lock-In**:

  - Organizations may rely heavily on a specific IdP vendor, making migration challenging.
  - Mitigation: Choose open standards and avoid proprietary solutions.

- **Token Management Challenges**:
  - Expired or stolen tokens can disrupt access or create security vulnerabilities.
  - Mitigation: Implement token expiration, refresh mechanisms, and secure token storage.

## Use Cases for SSO

- **Enterprise Applications**:

  - Employees can access various internal tools and services with a single login.
  - Simplifies onboarding and offboarding processes.

- **Cloud Services**:

  - Users can seamlessly switch between cloud applications without repeated logins.
  - Enhances productivity and user experience.

- **Customer Portals**:

  - Provides a unified login experience for customers across different services.
  - Enables personalization and targeted marketing.

- **Partner Integration**:
  - Facilitates secure access to shared resources between partner organizations.
  - Streamlines collaboration and data exchange.

## SSO Implementation Examples

### 1. API (Node.js with Express)

The API acts as the Identity Provider (IdP). It authenticates users and issues JWT tokens for access.

Below is a structured breakdown of the provided code, explaining the purpose of each section for your followers. This serves as a robust example of how to implement SSO functionality in the API layer.

#### Setup and Dependencies

The following packages are utilized in this setup:

- **express**: For handling HTTP requests and routing.
- **jsonwebtoken**: For generating and verifying JWTs.
- **cors**: For handling cross-origin requests from different client applications.
- **@faker-js/faker**: For generating mock user and todo data.
- **cookie-parser**: For parsing cookies sent in requests.
- **dotenv**: For loading environment variables securely.

##### Configuration

- `dotenv` is used to manage the secret key securely.
- A fallback secret is provided for development environments.

```js
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "secret";
```

##### Middleware

- CORS ensures that requests from specific front-end origins (`main` and `external-app`) are allowed.
- cookieParser parses cookies sent by clients.
- express.json allows parsing of JSON request bodies.

```js
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
```

#### User Authentication and Token Generation

Mock data simulates users and their associated todos.

Users have roles (admin or user) and basic profile information.
Todos are linked to user IDs for personalized access.

- `/login`: Authenticates users based on email and password.

Users receive a cookie (sso_token) containing the JWT upon successful login.
This token is secure, HTTP-only, and time-limited to prevent tampering.

```js
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("sso_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });
    res.json({ message: "Login successful" });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});
```

- `/verify`: Validates the user’s identity by decoding the token. Invalid tokens result in an unauthorized response.

```js
app.get("/verify", (req, res) => {
  const token = req.cookies.sso_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ authenticated: true, user: decoded });
  } catch {
    res.status(401).json({ authenticated: false, error: "Invalid token" });
  }
});
```

- `/logout`: Clears the cookie containing the JWT token.

Ensures users can log out securely by clearing their token.

```js
app.post("/logout", (req, res) => {
  res.clearCookie("sso_token");
  res.json({ message: "Logout successful" });
});
```

- `/todos`: Retrieves todos associated with the authenticated user.

```js
app.get("/todos/:userId", (req, res) => {
  const ssoToken = req.cookies.sso_token;
  const user = getUser(ssoToken);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userTodos = todos.filter((todo) => todo.userId === user.id);
  res.json(userTodos);
});
```

- `/todos`: Adds a new todo for the authenticated user.

```js
app.post("/todos", (req, res) => {
  const ssoToken = req.cookies.sso_token;
  const user = getUser(ssoToken);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, description } = req.body;
  const newTodo = {
    id: faker.string.uuid(),
    userId: user.id,
    title,
    description,
  };

  todos.push(newTodo);
  res.status(201).json({ message: "Todo added successfully", data: newTodo });
});
```

- `/todos/:id`: Updates a todo based on the provided ID.

```js
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
```

- `/todos/:id`: Deletes a todo based on the provided ID.

```js
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
```

### 2. Main Application (React)

The main application acts as a Service Provider (SP) that consumes the API and manages user interactions.

Below is a structured breakdown of the provided code, explaining the purpose of each section for your followers. This serves as a robust example of how to implement SSO functionality in the main application layer.

- App Component

The App component manages user authentication and redirects based on login status.

```tsx
import { useState, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Todos from "./components/Todos";
import Login from "./components/Login";
import { toast } from "react-toastify";
import api from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      const returnUrl = searchParams.get("returnUrl");
      try {
        const response = await api.get("/verify", {
          withCredentials: true,
        });
        if (response.data.authenticated) {
          setIsLoggedIn(true);
          toast.success("You are logged in.");
          navigate("/todos");
        } else {
          setIsLoggedIn(false);
          if (!returnUrl) {
            toast.error("You are not logged in.");
          }
        }
      } catch (error) {
        setIsLoggedIn(false);
        console.error("Verification failed:", error);
      }
    };

    verifyLogin();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifyLogin();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate, searchParams]);

  return (
    <div className="container p-4 mx-auto">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/todos"
          element={isLoggedIn ? <Todos /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
```

- Login Component

The Login component handles user login and redirects to the Todos page upon successful authentication.

```tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const returnUrl = searchParams.get("returnUrl");
    setLoading(true);
    try {
      await api.post("/login", { email, password }, { withCredentials: true });
      toast.success("Login successful!");
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        navigate("/todos");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <ToastContainer />
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

- Todos Component

The Todos component displays user-specific todos and allows adding and deleting todos.

```tsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
}

interface UserInfo {
  username: string;
  email: string;
  iat: number;
  exp: number;
}

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchTodos();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTodos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get("/verify", {
        withCredentials: true,
      });

      setUserInfo({
        username: response.data.user.user.username,
        email: response.data.user.user.email,
        iat: response.data.user.iat,
        exp: response.data.user.exp,
      });
    } catch (error) {
      toast.error("Error fetching user information.");
      console.error("Error fetching user information:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos", {
        withCredentials: true,
      });
      setTodos(response.data);
    } catch (error) {
      toast.error("Error fetching todos.");
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!title || !description) {
      toast.error("Title and description are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/todos",
        { title, description },
        { withCredentials: true }
      );
      setTodos([...todos, response.data.data]);
      setTitle("");
      setDescription("");
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error("Error adding todo.");
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/todos/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Error deleting todo.");
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out.");
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold">Todos</h2>
        <button
          onClick={handleLogout}
          className="p-2 mb-4 text-white bg-red-500 rounded-full"
        >
          Logout
        </button>
      </header>
      {userInfo && (
        <div>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}
      <form className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <button
          onClick={addTodo}
          className="w-full p-2 text-white bg-green-500 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border-b"
          >
            <div>
              <h3 className="font-bold">{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-white bg-red-500 rounded"
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```

### 3. External Application (React)

The external application acts as another Service Provider (SP) that consumes the API and manages user interactions.

Below is a structured breakdown of the provided code, explaining the purpose of each section for your followers. This serves as a robust example of how to implement SSO functionality in the external application layer.

- App Component

The App component manages user authentication and redirects based on login status.

```tsx
import { useState, useEffect } from "react";
import Todos from "./components/Todos";
import api from "./api";

const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await api.get("/verify", {
          withCredentials: true,
        });
        if (response.data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setIsLoggedIn(false);
      }
    };

    verifyLogin();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifyLogin();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="container p-4 mx-auto">
      {isLoggedIn ? (
        <Todos />
      ) : (
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">You are not logged in</h2>
          <a
            href={`${MAIN_APP_URL}?returnUrl=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white bg-blue-500 rounded"
          >
            Go to Main App to Login
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
```

- Todos Component

The Todos component displays user-specific todos.

```tsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";

interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
}

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTodos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos", {
        withCredentials: true,
      });
      setTodos(response.data);
    } catch (error) {
      toast.error("Error fetching todos.");
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!title || !description) {
      toast.error("Title and description are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/todos",
        { title, description },
        { withCredentials: true }
      );
      setTodos([...todos, response.data.data]);
      setTitle("");
      setDescription("");
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error("Error adding todo.");
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/todos/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Error deleting todo.");
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">External App - Todos</h2>
      <form className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <button
          onClick={addTodo}
          className="w-full p-2 text-white bg-green-500 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border-b"
          >
            <div>
              <h3 className="font-bold">{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-white bg-red-500 rounded"
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
```

## Conclusion

Single Sign-On (SSO) simplifies user authentication and access management across multiple applications, enhancing user experience, security, and operational efficiency. By centralizing authentication and leveraging secure token-based mechanisms, organizations can streamline user access, reduce password-related risks, and improve compliance and auditing capabilities.

While SSO offers numerous benefits, it also presents challenges such as single points of failure, complex implementation requirements, security risks, and potential vendor lock-in. Organizations must carefully plan and implement SSO solutions to mitigate these risks and maximize the benefits of centralized authentication.

By following best practices, leveraging established protocols, and choosing open standards, organizations can successfully implement SSO to enhance user experience, security, and operational efficiency across their applications and systems.
