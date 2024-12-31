import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer draggable newestOnTop limit={3} position="bottom-center" />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
