import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import Router from "./components/Router";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router />
    </React.StrictMode>,
  );
}
