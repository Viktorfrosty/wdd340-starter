// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require('express')
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require('../utilities');

const baseController = require("../controllers/baseController")
// Route to build login
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build registration
router.get("/register", utilities.handleErrors(accController.buildRegister))

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
    // (req, res) => {
    //   res.status(200).send('login process')
    // },
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(baseController.buildHome)
  )

module.exports = router