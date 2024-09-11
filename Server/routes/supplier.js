import express from "express";
const router = express.Router();

// Define supplier routes here
router.get("/dashboard", (req, res) => res.send("Supplier Dashboard"));
router.get("/inventory", (req, res) => res.send("Supplier Inventory"));

export default router;
