const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const accModel = require("../models/account-model")
const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
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
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
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
    hashedPassword
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function registerLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process logout
* *************************************** */
async function processLogout(req, res, next) {
  let nav = await utilities.getNav()
  res.clearCookie('jwt')
  req.flash("notice","Logged out succesfully.")
  res.redirect("/")
}

/* ****************************************
*  Deliver edit account view
* *************************************** */
async function buildEditAcc(req, res, next) {
  const accountId = parseInt(req.params.account_id)
  const localId = parseInt(res.locals.accountData.account_id)
  if (accountId === localId) {
    const info = await accModel.getAccountByaccountId(accountId)
    let nav = await utilities.getNav()
    res.render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id: accountId,
      account_firstname: info.account_firstname,
      account_lastname: info.account_lastname,
      account_email: info.account_email
    })
  } else {
    req.flash("notice", "Invalid access.")
    res.redirect("/account")
  }
  
}

/* ****************************************
*  generate edit account info response
* *************************************** */
async function updateInfoData(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const updateResult = await accModel.updateInfoData(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  if (updateResult) { const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    // Log the new JWT instead of the old one 
    console.log('Updated Account Data:', req.body); console.log('New JWT:', jwt.decode(accessToken))
    // Set the new JWT in the cookie 
    if (process.env.NODE_ENV === 'development') { 
      res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 }); 
    } else { 
      res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 }); 
    } 
    req.flash('notice', 'The account was successfully updated.')
    res.redirect('/account')
  } else { 
    req.flash('notice', 'Sorry, the account update failed.')
    res.status(501).render('account/edit', { 
      title: 'Edit Account', 
      nav, 
      errors: null, 
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email 
    })
  } 
}

/* ****************************************
*  generate edit account password response
* *************************************** */
async function updatePasswordData(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    account_id,
    account_password
  } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(501).redirect(`${account_id}`)
  } 
  const updateResult = await accModel.updatePasswordData(
    account_id,
    hashedPassword
  )
  if (updateResult) {
    req.flash("notice", `The account was successfully updated.`)
    res.redirect("/account")
  } else {
    req.flash('notice', 'Sorry, the account update failed.')
    res.status(501).redirect(`${account_id}`)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, registerLogin, buildAccManagement, processLogout, buildEditAcc, updateInfoData, updatePasswordData }