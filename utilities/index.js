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
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        // grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
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
    wrap = '<div id="vehicle-info">'
    wrap += `<img loading="lazy" src="${info[0].inv_image}" alt="Image of ${info[0].inv_make} ${info[0].inv_model} on CSE Motors">`
    wrap += `<h2>${info[0].inv_make} ${info[0].inv_model} Details</h2>`
    wrap += `<h3>Type: ${info[0].classification_name}</h3>`
    wrap += `<h3>Color: ${info[0].inv_color}</h3>`
    wrap += `<h3>Miles: ${new Intl.NumberFormat('en-US').format(info[0].inv_miles)}</h3>`
    wrap += `<h3>Price: $ ${new Intl.NumberFormat('en-US').format(info[0].inv_price)}</h3>`
    wrap += `<p>${info[0].inv_description}</p>`
    wrap += '</div>'
  } else {
    wrap = '<p class="notice"> Sorry, the information could not be found.</p>'
  }
  return wrap
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util