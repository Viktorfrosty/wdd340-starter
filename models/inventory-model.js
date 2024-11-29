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
    console.error("registerClassificationElement error " + error)
  }
}

/* ***************************
 *  Post new inventory element in the server
 * ************************** */


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleInfoByInventoryId, registerClassificationElement}