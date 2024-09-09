import express from "express";
const router = express.Router();

// Product routes
router
  .route("/")
  .get((req, res) => {
    // Show all products
  })
  .post((req, res) => {
    // Create new product
  });

router
  .route("/:productId")
  .get((req, res) => {
    // Get single product by ID
  })
  .patch((req, res) => {
    // Update product by ID
  })
  .delete((req, res) => {
    // Delete product by ID
  });

export default router;
