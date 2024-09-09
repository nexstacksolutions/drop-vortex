import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import userRoutes from "./routes/user.js";
import generalRoutes from "./routes/general.js";
import ExpressError from "./classes/ExpressError.js";
import ErrorMiddleware from "./middlewares/Error.js";

dotenv.config();
const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send({ msg: "Welcome to Drop Vortex!" });
});

// Mounting API routes
app.use("/api/products", productRoutes); // For product-related API
app.use("/api/categories", categoryRoutes); // For category-related API
app.use("/api/cart", cartRoutes); // For cart-related API
app.use("/api/orders", orderRoutes); // For order-related API
app.use("/api/users", userRoutes); // For user-related API
app.use("/api", generalRoutes); // For authentication-related API

// Error handling middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use(ErrorMiddleware);

export default app;
