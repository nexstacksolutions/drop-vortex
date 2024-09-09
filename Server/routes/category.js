import express from "express";
const router = express.Router();

// Category routes
router
  .route("/")
  .get((req, res) => {
    // Show all categories
  })
  .post((req, res) => {
    // Create new category
  });

router
  .route("/:categoryId")
  .get((req, res) => {
    // Get single category by ID
  })
  .patch((req, res) => {
    // Update category by ID
  })
  .delete((req, res) => {
    // Delete category by ID
  });

export default router;
