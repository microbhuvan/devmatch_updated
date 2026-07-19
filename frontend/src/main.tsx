import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import App from "./App";

import { store } from "./redux/store";

import "./index.css";

// Immediately set the theme to prevent flickering
(function () {
  const theme = localStorage.getItem("devmatch-theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
