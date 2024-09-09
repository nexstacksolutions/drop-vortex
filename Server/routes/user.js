import express from "express";
const router = express.Router();

// User profile routes
router
  .route("/profile")
  .get((req, res) => {
    // Show user profile
  })
  .patch((req, res) => {
    // Update user profile
  });

// Wishlist routes
router
  .route("/wishlist")
  .get((req, res) => {
    // Show wishlist
  })
  .post((req, res) => {
    // Add to wishlist
  });

router.route("/wishlist/:wishlistItemId").delete((req, res) => {
  // Remove from wishlist
});

export default router;
