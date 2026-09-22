const express = require("express")
const tourController = require("../controllers/tourController")
const authController = require("../controllers/authController")
const reviewController = require("../controllers/reviewController")

const router = express.Router()

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour)
router.route("/stats").get(tourController.getTourStats) // Aggregate Pipeline To Get Tours Stats
router
  .route("/:id")
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  )

// Reviews nested routes
router
  .route("/:tourId/reviews")
  .post(authController.protect, authController.restrictTo("user"), reviewController.createReview)
  .get(reviewController.getReviews)

module.exports = router
