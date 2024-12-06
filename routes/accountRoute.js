// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require('express')
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require('../utilities');

// Route to build login
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build registration
router.get("/register", utilities.handleErrors(accController.buildRegister))

// Route to build management
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccManagement))


// Process the login attempt
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accController.processLogout))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.registerLogin)
)

module.exports = router