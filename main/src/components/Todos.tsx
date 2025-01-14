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
