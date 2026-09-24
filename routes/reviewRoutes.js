const express = require("express")
const reviewController = require("../controllers/reviewController")
const authController = require("../controllers/authController")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(reviewController.getReviews)
  .post(authController.protect, authController.restrictTo("user"), reviewController.createReview)

router
  .route("/:id")
  .delete(authController.protect, authController.restrictTo("admin"), reviewController.deleteReview)
  .patch(authController.protect, authController.restrictTo("admin"), reviewController.updateReview)
  .get(authController.protect, authController.restrictTo("admin"), reviewController.getSingleReview)

module.exports = router
