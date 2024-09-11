import express from "express";
const router = express.Router();

// Define retailer routes here
router.get("/dashboard", (req, res) => res.send("Retailer Dashboard"));
router.get("/products", (req, res) => res.send("Retailer Products"));

export default router;
