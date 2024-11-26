const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message in the login view.")
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message in the register view.")
  res.render("account/register", {
    title: "Register",
    nav,
  })
}

module.exports = { buildLogin, buildRegister }