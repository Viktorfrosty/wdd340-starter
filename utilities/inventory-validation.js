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
            .matches(/^[A-Z][A-Za-z]*$/)
            .withMessage("Please provide a valid classification name.")
            .notEmpty()
            .withMessage("Please provide a classification name.")
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
        body("inv_model") 
            .matches(/^[A-Z0-9][A-Za-z0-9\s]*$/) 
            .withMessage('Model must start with an uppercase letter or digit and can contain alphanumeric characters and spaces.') 
            .notEmpty() 
            .withMessage('Model is required.'), 
        body("inv_make") 
            .matches(/^[A-Z0-9][a-zA-Z0-9\s]*$/) 
            .withMessage('Maker must start with an uppercase letter or digit and can contain alphanumeric characters and spaces.') 
            .notEmpty() 
            .withMessage('Maker is required.'), 
        body("classification_id")
            .notEmpty() 
            .withMessage('Classification ID is required.'),
        body("inv_year") 
            .matches(/^[0-9]{4}$/) 
            .withMessage('Year must be a 4-digit number.') 
            .notEmpty() 
            .withMessage('Year is required.'), 
        body("inv_price") 
            .matches(/^[0-9]{1,}$/) 
            .withMessage('Price must be a number.')
            .notEmpty() 
            .withMessage('Price is required.'), 
        body("inv_miles") 
            .matches(/^[0-9]{1,}$/) 
            .withMessage('Miles must be a number.') 
            .notEmpty() 
            .withMessage('Miles is required.'), 
        body("inv_color") 
            .matches(/^[A-Z][a-zA-Z]*$/) 
            .withMessage('Color must start with an uppercase letter and contain only alphabetical characters.') 
            .notEmpty() 
            .withMessage('Color is required.'), 
        body("inv_description") 
            .matches(/^[A-Z0-9][A-Za-z0-9\s]*$/) 
            .withMessage('Description must start with an uppercase letter or digit and can contain alphanumeric characters and spaces.') 
            .notEmpty() 
            .withMessage('Description is required.'), 
        body("inv_image") 
            .matches(/^[a-zA-Z0-9/._-]+$/) 
            .withMessage('Image must be a valid path with allowed characters.') 
            .notEmpty() 
            .withMessage('Image is required.'), 
        body("inv_thumbnail") 
            .matches(/^[a-zA-Z0-9/._-]+$/) 
            .withMessage('Thumbnail must be a valid path with allowed characters.') 
            .notEmpty() 
            .withMessage('Thumbnail is required.')
    ];
}

/* ******************************
 * Check data and return errors or continue to classification registration
 * ***************************** */
validate.checkClassificationRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to inventory registration
 * ***************************** */
validate.checkInventoryRegData = async (req, res, next) => {
    const { inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const typeSelector = await utilities.buildClassificationList(classification_id)
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        typeSelector,
        nav, 
        inv_model, 
        inv_make, 
        inv_year, 
        inv_price, 
        inv_miles, 
        inv_color, 
        inv_description, 
        inv_image, 
        inv_thumbnail,
      })
      return
    }
    next()
}

module.exports = validate