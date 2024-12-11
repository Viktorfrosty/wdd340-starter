// Needed Resources 
const regValidate = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build login
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build registration
router.get("/register", utilities.handleErrors(accController.buildRegister))

// Route to build management
router.get(
    "/", 
    utilities.checkLogin, 
    utilities.handleErrors(accController.buildAccManagement)
)


// Process the login attempt
router.get(
    "/logout", 
    utilities.checkLogin, 
    utilities.handleErrors(accController.processLogout)
)


// Route to build Account edit view
router.get(
    "/edit/:account_id", 
    utilities.checkLogin, 
    utilities.handleErrors(accController.buildEditAcc)
)

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

// Process the info update attempt
router.post(
    "/edit/info",
    regValidate.UpdateInfoRules(),
    regValidate.checkUpdateInfoData,
    utilities.handleErrors(accController.updateInfoData)
)

// Process the password update attempt
router.post(
    "/edit/password",
    regValidate.UpdatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accController.updatePasswordData)
)

module.exports = router