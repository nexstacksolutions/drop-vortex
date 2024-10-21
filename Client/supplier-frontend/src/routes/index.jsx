import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// All pages
const HomePage = lazy(() => import("../pages/Home"));
const ProductForm = lazy(() => import("../pages/Products/Actions"));
const ErrorBoundary = lazy(() => import("../pages/Error"));

// Creating routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      // { path: "/products/manage", element: <ProductList /> },
      { path: "/products/add", element: <ProductForm /> },
    ],
  },
]);

export default router;
