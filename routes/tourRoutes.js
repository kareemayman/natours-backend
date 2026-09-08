const express = require("express")
const tourController = require("../controllers/tourController")
const authController = require("../controllers/authController")

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
  .delete(tourController.deleteTour)

module.exports = router
