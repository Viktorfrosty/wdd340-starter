const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the clasiffication view.")
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build view by vehicle info
 * ************************** */
invCont.buildByVehicleInfo = async function (req, res, next) {
  const inv_id = req.params.invId
  const info = await invModel.getVehicleInfoByInventoryId(inv_id)
  const wrap = await utilities.buildVehicleInformation(info)
  let nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the vehicle view.")
  const title = `${info[0].inv_make} ${info[0].inv_model}`
  const year = `${info[0].inv_year}`
  res.render("./vehicles/vehicle", {
    year: year,
    title: title,
    nav,
    wrap
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the Vehicle Management view.")
  res.render("./inventory/management", {title: "Vehicle Management", nav})
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildManagementAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message in the add classification view.")
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildManagementAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const typeSelector = await utilities.buildClassificationList()
  // req.flash("notice", "This is a flash message in the add inventory view.")
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    typeSelector,
    errors: null,
  })
}

/* ***************************
 *  Build register new classification view
 * ************************** */
invCont.registerNewClassificationElement = async function (req, res, next) {
  const { classification_name } = req.body
  const addResult = await invModel.registerClassificationElement(
    classification_name
  )
  if (addResult) {
    req.flash(
      "notice", 
      `The new classification (${classification_name}) was added successfully.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management", 
      nav: await utilities.getNav(),      
    })
  } else {
    req.flash(
      "notice", 
      "The new classification was not added."
    )
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification", 
      nav: await utilities.getNav(),
      errors: null,      
    })
  }
}

/* ***************************
 *  Build register new inventory view
 * ************************** */
invCont.registerNewInventoryElement = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail } = req.body
  const addResult = await invModel.registerInventoryElement(
    inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail
  )
  if (addResult) {
    req.flash(
      "notice", 
      `The new vehicle was added successfully.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management", 
      nav,      
    })
  } else {
    const typeSelector = await utilities.buildClassificationList()
    req.flash(
      "notice", 
      "The new vehicle was not added."
    )
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory", 
      nav,
      typeSelector,
      errors: null,      
    })
  }
}

module.exports = invCont