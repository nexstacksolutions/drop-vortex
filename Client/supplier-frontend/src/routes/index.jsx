import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// All pages
const HomePage = lazy(() => import("../pages/Home"));
const ErrorBoundary = lazy(() => import("../pages/Error"));

// Creating routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [{ path: "/", element: <HomePage /> }],
  },
]);

export default router;
