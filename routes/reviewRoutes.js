const express = require("express")
const reviewController = require("../controllers/reviewController")
const authController = require("../controllers/authController")

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route("/")
  .get(reviewController.getReviews)
  .post(authController.restrictTo("user"), reviewController.createReview)

router
  .route("/:id")
  .delete(authController.restrictTo("admin", "user"), reviewController.deleteReview)
  .patch(authController.restrictTo("admin", "user"), reviewController.updateReview)
  .get(reviewController.getSingleReview)

module.exports = router
