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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management", 
    nav,
    classificationSelect
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildManagementAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
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
  const classificationSelect = await utilities.buildClassificationList()
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
      classificationSelect,
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
  const classificationSelect = await utilities.buildClassificationList()
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
      classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleInfoByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    typeSelector: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
  })
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryViem = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleInfoByInventoryId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryObject = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const deleteResult = await invModel.deleteInventoryObject(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully removed.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the removing failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont