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
