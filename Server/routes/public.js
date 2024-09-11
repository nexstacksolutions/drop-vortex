import express from "express";
const router = express.Router();

// Define public routes here
router.get("/home", (req, res) => res.send("Public Home Page"));
router.get("/products", (req, res) => res.send("Public Products"));

export default router;
