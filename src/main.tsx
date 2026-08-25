import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";
import Demo from "./Demo";
import "./styles.css";

function App() {
  const [route, setRoute] = React.useState(window.location.hash);

  React.useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route.startsWith("#/demo") ? <Demo /> : <Home />;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
