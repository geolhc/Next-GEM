import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";
import Demo from "./Demo";
import "./styles.css";

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const updateRoute = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  return route.startsWith("#/demo") ? <Demo /> : <Home />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
