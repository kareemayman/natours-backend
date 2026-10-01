const express = require("express")
const tourController = require("../controllers/tourController")
const authController = require("../controllers/authController")
const reviewRouter = require("../routes/reviewRoutes")

const router = express.Router()

// Reviews nested router
router.use("/:tourId/reviews", reviewRouter)

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour,
  )
router.route("/stats").get(tourController.getTourStats) // Aggregate Pipeline To Get Tours Stats
router
  .route("/:id")
  .get(tourController.getSingleTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  )

router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(tourController.getToursWithin)

module.exports = router
