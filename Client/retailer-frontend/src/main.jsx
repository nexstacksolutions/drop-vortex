import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import MediaProvider from "./context/MediaContext";

// Render the app with routing support
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MediaProvider>
      <RouterProvider router={router} />
    </MediaProvider>
  </StrictMode>
);
