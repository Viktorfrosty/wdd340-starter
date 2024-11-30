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
            .trim()
            .isAlpha()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a valid name.") // on error this message is sent.
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

}

/* ******************************
 * Check data and return errors or continue to classification registration
 * ***************************** */
validate.checkClassificationRegData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("the errors are: " + errors)
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

module.exports = validate