// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build a view by vehicle info
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleInfo))

// Route to build management
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification
router.get("/add-classification", utilities.handleErrors(invController.buildManagementAddClassification))

// Route to build add classification
router.get("/add-inventory", utilities.handleErrors(invController.buildManagementAddInventory))

// Process the add classification form
router.post(
    "/add-classification",
    utilities.handleErrors(invController.buildManagementAddClassification)
)

module.exports = router