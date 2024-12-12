const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")

const util = {}

/*************************
* Constructs the nav HTML unordered list
***************************/
util.getNav = async function (req, res, next) {
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

/***************************************
* Build the classification view HTML
**************************************/
util.buildClassificationGrid = async function(data) {
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=    '<a href="../../inv/detail/'+ vehicle.inv_id 
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

/***************************************
* Build the vehicle view HTML
**************************************/
util.buildVehicleInformation = async function(info) {
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
util.buildClassificationList = async function (classification_id = null) {
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

/*****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
*****************************************/
util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
util.checkJWTToken = (req, res, next) => {
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

/*****************************************
*    Check Login
**************************************/
util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/*****************************************
*    Check Account Type
**************************************/
util.checkAccountType = (req, res, next) => {
    if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin" ) {
        next()
    } else {
        req.flash("notice", "Please log in with a valid account.")
        return res.redirect("/account/login")
    }
}

// Final Enhancement Task

/*****************************************
* Check existing relationship between 
* logged account and review info
**************************************/
util.checkReviewRelationship = async (req, res, next) => {
    const review_id = req.params.review_id
    const account_id = res.locals.accountData.account_id
    const match = await revModel.idVerification(review_id, account_id)
    if (match) {
        next()
    } else {
        req.flash("notice", "Access Forbidden")
        return res.redirect("/account")
    }
}

/*********************************************
* Build the review list html for the inv/detail
*********************************************/
util.buildAccountReviews = async function (reviewsList) {
    let reviews = '<div>'
    reviews += '<h3>My Reviews</h3>'
    reviews += '<ul id="account-reviews">'
    if (reviewsList.length >= 1) {
        reviewsList.forEach(review => {
            reviews += '<li>'
            reviews += `<p>Reviewed the ${review.inv_year} ${review.inv_make} ${review.inv_model} on ${review.review_date} | <a href="/review/edit/${review.review_id}">Edit</a> | <a href="/review/delete/${review.review_id}">Delete</a></p>`
            reviews += '</li>'
        })
    } else { 
        reviews += '<li>'
        reviews += '<p>None yet.</p>'
        reviews += '</li>'
    }
    reviews += '</ul>'
    reviews += '</div>'
    return reviews
}

/*********************************************
* Build the review list html for the inv/detail
*********************************************/
util.buildVehicleReviews = async function (reviewsList) {
    let reviews = '<div>'
    reviews += '<h2>Customer Reviews</h2>'
    reviews += '<ul id="vehicle-reviews">'
    if (reviewsList.length >= 1) {
        reviewsList.forEach(review => {
            reviews += '<li>'
            reviews += `<p><b>${review.account_firstname.charAt(0)}${review.account_lastname}</b> wrote on ${review.review_date}</p>`
            reviews += `<p>${review.review_text}</p>`
            reviews += '</li>'
        })
    } else { 
        reviews += '<li>'
        reviews += '<p>Be the first to write a review.</p>'
        reviews += '</li>'
    }
    reviews += '</ul>'
    reviews += '</div>'
    return reviews
}

/*****************************************
* Check Login for the creation of the form
**************************************/
util.addReviewFormLoginChek = (req, res, next) => {
    if (res.locals.loggedin) {
        res.locals.formCheck = true
    } else {
        res.locals.formCheck = false
    }
    next()
}

/*********************************************
* Build the review form html for the inv/detail
*********************************************/
util.addReviewForm = function(check, invId, accountId, screenName, text = "") {
    let form = '<div>'
    if (check) {
        form += '<h2>Add your own review</h2>'
        form += `<form id="VehicleReview" action="/inv/detail/create" method="post">`
        form += '<label for="screen_name">Screen Name:</label></br>'
        form += `<input type="text" id="screen_name" name="screen_name" value="${screenName}" required readonly><br>` /* pattern="^[A-Z][A-Z][a-z]*$" */
        form += '<label for="review_text">Review Text:</label></br>'
        form += '<ul>'
        form += '<li>First character should be uppercase or a number.</li>'
        form += '<li>Special characters not allowed, except spaces, hyphens, dots and question marks.</li>'
        form += '</ul>'
        form += `<textarea name="review_text" id="review_text" required>${text}</textarea><br>`
        form += `<input type="hidden" name="inv_id" value= ${invId}>`
        form += `<input type="hidden" name="account_id" value= ${accountId}>`
        form += '<input type="submit" value="Update Review">'
        form += '</form>'
        form += '<script src="/js/script.js"></script>'
    } else {
        form += '<p>You must <a href="/account/login">Login</a> to write a review.</p>'
    }
    form += '</div>'
    return form
}
//

module.exports = util