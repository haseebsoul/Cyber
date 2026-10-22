 
import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from "react-router";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
