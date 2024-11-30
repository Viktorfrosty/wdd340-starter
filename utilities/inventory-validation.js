const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.addClassificationElementRules = () => {
    return [
        body("classification_name")
            .isAlpha()
            .withMessage("Please provide a valid name.") // on error this message is sent.
            .notEmpty()
            .custom(async (classification_name) => {
                const classExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classExists){
                  throw new Error("Classification already exists. Please enter a new classification.")
                }
              }),
        ]
}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.addInventoryElementRules = () => {
    return [
        body("inv_model"),
        body("inv_make"),
        body("classificationList"),
        body("inv_year"),
        body("inv_price"),
        body("inv_miles"),
        body("inv_color"),
        body("inv_description"),
        body("inv_image"),
        body("inv_thumbnail")
    ]
}

/* ******************************
 * Check data and return errors or continue to classification registration
 * ***************************** */
validate.checkClassificationRegData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
      })
      return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to inventory registration
 * ***************************** */
validate.checkInventoryRegData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const typeSelector = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        typeSelector,
        nav,
      })
      return
    }
    next()
}

module.exports = validate