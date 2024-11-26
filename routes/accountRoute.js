// Needed Resources 
const express = require('express')
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require('../utilities');

// Route to build login
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Route to build registration
router.get("/register", utilities.handleErrors(accController.buildRegister))

// route to register an account
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router