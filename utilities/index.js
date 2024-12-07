const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + '"><img src="' + vehicle.inv_thumbnail 
        +'" alt="' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        +'"></a>'
        grid += '<div class="namePrice">'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'/#info" title="View ' 
        + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details" target="_top">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleInformation = async function(info) {
  let wrap
  if (info.length > 0) {
    wrap = '<div id="info">'
    wrap += `<img loading="lazy" src="${info[0].inv_image}" alt="${info[0].inv_year} ${info[0].inv_make} ${info[0].inv_model}">`
    wrap += `<h2>${info[0].inv_make} ${info[0].inv_model} Details</h2>`
    wrap += `<p>${info[0].inv_description}</p>`
    wrap += `<span>Type: ${info[0].classification_name}</span>`
    wrap += `<span>Color: ${info[0].inv_color}</span>`
    wrap += `<span>Miles: ${new Intl.NumberFormat('en-US').format(info[0].inv_miles)}</span>`
    wrap += `<span>Price: $ ${new Intl.NumberFormat('en-US').format(info[0].inv_price)}</span>`
    wrap += '</div>'
  } else {
    wrap = '<p class="notice"> Sorry, the information could not be found.</p>'
  }
  return wrap
}

/* **************************************
* Build the form selector in the add inventory view
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<label for="classificationList">Classification</label><br><select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin" ) {
    next()
  } else {
    req.flash("notice", "Please log in with a valid account.")
    return res.redirect("/account/login")
  }
}

module.exports = Util