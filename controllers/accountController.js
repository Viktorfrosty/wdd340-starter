const bcrypt = require("bcryptjs") // team activity #2 week 04
const accModel = require("../models/account-model")
const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the login view.")
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the register view.")
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // team activity #2 week 04
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 100)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  // 
  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    // account_password
    hashedPassword // team activity #2 week 04
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

// team activity #2 week 04
/* ****************************************
*  Process login
* *************************************** */
async function registerLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const regResult = await accModel.registerLogin(
    account_email,
    // hashedPassword
    account_password
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re logged in ${account_firstname}.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, registerLogin }