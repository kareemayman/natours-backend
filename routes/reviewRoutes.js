const express = require("express")
const reviewController = require("../controllers/reviewController")
const authController = require("../controllers/authController")

const router = express.Router({ mergeParams: true })

router.route("/").get(reviewController.getReviews)
router
  .route("/:tourId")
  .post(authController.protect, authController.restrictTo("user"), reviewController.createReview)
  .get(reviewController.getReviews)

router
  .route("/:id")
  .delete(authController.protect, authController.restrictTo("admin"), reviewController.deleteReview)

module.exports = router
