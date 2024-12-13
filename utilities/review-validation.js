/**********************************
* Final Enhancement Task
***********************************/

/**********************************
* Needed Resources
***********************************/
const revModel = require("../models/review-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/**********************************
* Review Validation Rules
***********************************/
validate.reviewRules = () => {
  return [
    body("review_text") 
      .matches(/^[A-Z0-9][A-Za-z0-9\s\.\-\?]*$/)
      .withMessage('Review Text must start with an uppercase letter or a digit, followed by any combination of uppercase letters, lowercase letters, digits, spaces, dots, hyphens, or question marks.')
      .notEmpty() 
      .withMessage('Review Text is required.')
  ]
}

/**********************************
* Check data and return errors or continue to process review update
***********************************/
validate.checkReviewEditData = async (req, res, next) => {
  const { review_id, review_text } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const info = await revModel.getReviewByReviewId(review_id)
    let nav = await utilities.getNav()
    let title = `Edit ${info.inv_year} ${info.inv_make} ${info.inv_model} Review`
    res.render("./reviews/edit", {
      title,
      nav,
      errors,
      review_id,
      review_text,
      review_date: info.review_date
    })
    return
  }
  next()
}

module.exports = validate