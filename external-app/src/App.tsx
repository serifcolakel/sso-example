import { useState, useEffect } from "react";
import axios from "axios";
import Todos from "./components/Todos";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await axios.get("http://localhost:4000/verify", {
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
    <div className="container mx-auto p-4">
      {isLoggedIn ? (
        <Todos />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
          <a
            href="http://localhost:5173?returnUrl=http://localhost:5174" // Link to the main app's login page with returnUrl
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Go to Main App to Login
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
