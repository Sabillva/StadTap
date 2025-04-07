import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./header.css";
import "./hero.css";
import "./logoticker.css";
import "./introduction.css";
import "./features.css";
import "./matches.css";
import "./testimonials.css";
import "./faqs.css";
import "./words.css";
import "./contact.css";
import "./footer.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
