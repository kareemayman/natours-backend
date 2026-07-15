const express = require('express')
const tourController = require('../controllers/tourController')

const toursRouter = express.Router()

toursRouter.route("/").get(tourController.getAllTours).post(tourController.createTour);
toursRouter.route("/:id").get(tourController.getSingleTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = toursRouter