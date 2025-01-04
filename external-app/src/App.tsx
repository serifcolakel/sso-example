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
