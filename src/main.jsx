import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Use .jsx as per your file extension
import "./index.css"; // Import the Tailwind CSS file
import { Provider } from "react-redux"; // Import Provider
import { store } from "./app/store.js"; // Import your store

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
