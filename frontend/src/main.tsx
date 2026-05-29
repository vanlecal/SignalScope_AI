import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Landing from "./pages/Landing";
import "./styles.css";

const Root = () => {
  // Render Landing for the site root, otherwise render the terminal App
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    return <Landing />;
  }

  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
