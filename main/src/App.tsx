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
