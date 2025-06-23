import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { registerSW } from "virtual:pwa-register";

import App from "./App.jsx";

registerSW();

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    //</StrictMode>
);
