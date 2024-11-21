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

module.exports = invCont