import express from "express";
import dotenv from "dotenv";
import publicRoutes from "./routes/public.js";
import retailerRoutes from "./routes/retailer.js";
import supplierRoutes from "./routes/supplier.js";
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
app.use("/api/public", publicRoutes); // Routes for public frontend
app.use("/api/retailer", retailerRoutes); // Routes for retailer frontend
app.use("/api/supplier", supplierRoutes); // Routes for supplier frontend

// Error handling middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use(ErrorMiddleware);

export default app;
