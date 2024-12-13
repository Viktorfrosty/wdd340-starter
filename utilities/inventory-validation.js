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
      .withMessage('Model must start with an uppercase letter or digit and can contain alphanumeric characters and spaces.'), 
    body("inv_make") 
      .matches(/^[A-Z0-9][a-zA-Z0-9\s]*$/) 
      .withMessage('Maker must start with an uppercase letter or digit and can contain alphanumeric characters and spaces.'), 
    body("classification_id")
      .notEmpty() 
      .withMessage('Classification ID is required.'),
    body("inv_year") 
      .matches(/^[0-9]{4}$/) 
      .withMessage('Year must be a 4-digit number.'), 
    body("inv_price") 
      .matches(/^[0-9]{1,}$/) 
      .withMessage('Price must be a number.'), 
    body("inv_miles") 
      .matches(/^[0-9]{1,}$/) 
      .withMessage('Miles must be a number.'), 
    body("inv_color") 
      .matches(/^[A-Z][a-zA-Z]*$/) 
      .withMessage('Color must start with an uppercase letter and contain only alphabetical characters.'), 
    body("inv_description") 
      .matches(/^[A-Z0-9][A-Za-z0-9\s\.\-\?]*$/)
      .withMessage('Description must have a minimun lenght of ten (10) characters, and it needs to start with an uppercase letter or a digit, followed by a combination Uppercase letters, lowercase letters, digits, spaces, dots, hyphens, or question marks.')
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
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/add-inventory", {
    errors,
    title: "Add Inventory",
    typeSelector: classificationSelect,
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

/* ******************************
 * Check data and return errors or continue to inventory update
 * ***************************** */
validate.checkInventoryUpdateData = async (req, res, next) => {
  const { inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/edit-inventory", {
    errors,
    title: `Edit ${inv_make} ${inv_model}`,
    typeSelector: classificationSelect,
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
    inv_id
    })
    return
  }
  next()
}

// validate the review data in the inv/detail form
validate.createReviewRules = () => {
  return [
    body("review_text")
      .matches(/^[A-Z0-9][A-Za-z0-9\s\.\-\?]{9,}$/)
      .withMessage('Review must have a minimun lenght of ten (10) characters, and it needs to start with an uppercase letter or a digit, followed by a combination Uppercase letters, lowercase letters, digits, spaces, dots, hyphens, or question marks.'),
  ]
}

/* ******************************
 * Check data and return errors or continue to review registration
 * ***************************** */
validate.checkReviewCreationData = async (req, res, next) => {
  const { inv_id, account_id, check, screen_name, review_text } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const info = await inventoryModel.getVehicleInfoByInventoryId(inv_id)
    const wrap = await utilities.buildVehicleInformation(info)
    const data = await inventoryModel.getVehicleReviewsByInventoryId(inv_id)
    const reviewsList = await utilities.buildVehicleReviews(data)
    const title = `${info[0].inv_make} ${info[0].inv_model}`
    const year = `${info[0].inv_year}`
    res.render("./vehicles/vehicle", {
      year: year,
      title: title,
      errors,
      nav,
      wrap,
      reviewsList,
      check,
      inv_id,
      screen_name,
      account_id,
      review_text
    })
    return
  }
  next()
}

module.exports = validate