// Needed Resources 
const invValidate = require("../utilities/inventory-validation")
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

// Route to build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildManagementAddInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Process the add classification form
router.post(
    "/add-classification",
    invValidate.addClassificationElementRules(),
    invValidate.checkClassificationRegData,
    utilities.handleErrors(invController.registerNewClassificationElement)
)

// Process the add inventory form
router.post(
    "/add-inventory",
    invValidate.addInventoryElementRules(),
    invValidate.checkInventoryRegData,
    utilities.handleErrors(invController.registerNewInventoryElement)
)

// process the update
router.post("/update/",
    invValidate.checkInventoryUpdateData,
     utilities.handleErrors(invController.updateInventory)
)

module.exports = router