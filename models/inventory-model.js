const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all vehicle info by inv_id
 * ************************** */
async function getVehicleInfoByInventoryId(inv_id) {
  try {
    const info = await pool.query(
      `SELECT * FROM public.inventory AS i 
      INNER JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1;`,
      [inv_id]
    )
    return info.rows
  } catch (error) {
    console.error("getVehicleInfoByInventoryId error " + error)
  }
}

/* ***************************
 *  Post new classification element in the server
 * ************************** */
async function registerClassificationElement(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("registerClassificationElement error " + error.message)
  }
}

/* ***************************
 *  check new classification element in the server
 * ************************** */
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
}  

async function checkExistingClassification(classification_name) { 
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification1 = await pool.query(sql, [classification_name.toLowerCase()])
    const classification2 = await pool.query(sql, [classification_name.toUpperCase()])
    const classification3 = await pool.query(sql, [capitalize(classification_name)])
    return classification1.rowCount + classification2.rowCount + classification3.rowCount
  } catch (error) { 
    console.error("checkExistingClassification error " + error.message);
  } 
}

/* ***************************
 *  Post new inventory element in the server
 * ************************** */
async function registerInventoryElement(inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail) {
  try {
    const sql = "INSERT INTO inventory (inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail])
  } catch (error) {
    console.error("registerClassificationElement error " + error.message)
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleInfoByInventoryId, registerClassificationElement, checkExistingClassification, registerInventoryElement }