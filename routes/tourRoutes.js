const express = require("express")
const tourController = require("../controllers/tourController")
const authController = require("../controllers/authController")
const reviewRouter = require("../routes/reviewRoutes")

const router = express.Router()

// Reviews nested router
router.use("/:tourId/reviews", reviewRouter)

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

module.exports = router
