import express from "express";
const router = express.Router();

// Cart routes
router
  .route("/")
  .get((req, res) => {
    // Show cart details
  })
  .post((req, res) => {
    // Add product to cart
  });

router.route("/:cartItemId").delete((req, res) => {
  // Remove item from cart
});

export default router;
