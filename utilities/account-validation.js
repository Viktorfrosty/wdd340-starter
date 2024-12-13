const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/***********************************
* Registration Data Validation Rules
***********************************/
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name is required.") 
    .matches(/^[A-Z][A-Za-z]*$/) 
    .withMessage('First name must start with an uppercase letter and can contain only alphabetic characters.')
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.
  
    // lastname is required and must be string
    body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name is required.") 
    .matches(/^[A-Z][A-Za-z]*$/) 
    .withMessage('Last name must start with an uppercase letter and can contain only alphabetic characters.')
    .isLength({ min: 1 })
    .withMessage("Please provide a last name."), // on error this message is sent.
  
    // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required.")
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
      }
    }),
  
    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
  }

/***********************************
* login Data Validation Rules
***********************************/
validate.loginRules = () => {
  return [
  // valid email is required and cannot already exist in the database
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required.") 
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (!emailExists){
      throw new Error("Email doesn't exists. Please use a valid email")
    }
    }),

  // password is required and must be strong password
  body("account_password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
}

/***********************************
* Check data and return errors or continue to registration
*******************************/
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
    errors,
    title: "Registration",
    nav,
    account_firstname,
    account_lastname,
    account_email,
    })
    return
  }
  next()
  }

/*******************************
* Check data and return errors or continue to login
*******************************/
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    errors,
    title: "login",
    nav,
    account_email,
  })
  return
  }
  next()
}

/***********************************
* update account info Validation Rules
***********************************/
validate.UpdateInfoRules = () => {
  return [
  body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name is required.") 
    .matches(/^[A-Z][A-Za-z]*$/) 
    .withMessage('First name must start with an uppercase letter and can contain only alphabetic characters.')
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."),

  body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name is required.") 
    .matches(/^[A-Z][A-Za-z]*$/) 
    .withMessage('Last name must start with an uppercase letter and can contain only alphabetic characters.')
    .isLength({ min: 1 })
    .withMessage("Please provide a last name."),

  body("account_email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required.")
    .normalizeEmail()
    .withMessage("A valid email is required.") 
    .custom(async (account_email, { req }) => {
    const account_id = req.body.account_id
    const emailExists = await accountModel.checkExistingUnboundEmail(account_email, account_id)
    if (emailExists) { 
      throw new Error("Email error. Please use a different email")
    } 
    }),
  ]
}

/***********************************
* update account password Validation Rules
***********************************/
validate.UpdatePasswordRules = () => {
  return [
  body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    }),
  ]
}

/***********************************
* Check data and return errors or continue to update information
*******************************/
validate.checkUpdateInfoData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
  let nav = await utilities.getNav()
  res.render("account/edit", {
    errors,
    title: "Edit Account",
    nav,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  })
  return
  }
  next()
}

/***********************************
* Check data and return errors or continue to login
*******************************/
validate.checkUpdatePasswordData = async (req, res, next) => {
const { account_id } = req.body
let errors = []
errors = validationResult(req)
if (!errors.isEmpty()) {
  req.flash("notice", "Invalid password.")
  res.redirect(`${account_id}`)
  return
}
next()
}

module.exports = validate  