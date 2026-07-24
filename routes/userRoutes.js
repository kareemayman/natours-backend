const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

// param middleware for id validation
// router.param('id', userController.checkId)

router.route("/").get(userController.getAllUsers).post(userController.createUser)
router.route("/:id").get(userController.getSingleUser).patch(userController.updateUser).delete(userController.deleteUser)

module.exports = router