// Needed Resources
const invValidate = require("../utilities/inventory-validation")
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build a view by vehicle info
router.get("/detail/:invId", utilities.addReviewFormLoginChek, utilities.handleErrors(invController.buildByVehicleInfo))

// Route to build management
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement)
)

// Route to build add classification
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementAddClassification)
)

// Route to build add inventory
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementAddInventory)
)

router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.editInventoryView)
)

// deleting process
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryViem)
)

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
router.post(
    "/update",
    invValidate.checkInventoryUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// deleting process
router.post("/delete", utilities.handleErrors(invController.deleteInventoryObject))

// create review
router.post(
    "/detail/add-review",
    invValidate.createReviewRules(),
    invValidate.checkReviewCreationData,
    utilities.handleErrors(invController.createVehicleReview)
)

module.exports = router