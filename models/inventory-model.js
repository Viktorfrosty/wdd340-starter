const pool = require("../database/")

/****************************
* Get all classification data
****************************/
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/****************************
* Get all inventory items and classification_name by classification_id
****************************/
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

/****************************
* Get all vehicle info by inv_id
****************************/
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

/****************************
* Post new classification element in the server
****************************/
async function registerClassificationElement(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("registerClassificationElement error " + error.message)
  }
}

/****************************
* check new classification element in the server
****************************/
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
}  

async function checkExistingClassification(classification_name) { 
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification1 = await pool.query(sql, [classification_name.toLowerCase()])
    const classification2 = await pool.query(sql, [classification_name.toUpperCase()])
    const classification3 = await pool.query(sql, [capitalize(classification_name)])
    return classification1.rowCount + classification2.rowCount + classification3.rowCount
  } catch (error) { 
    console.error("checkExistingClassification error " + error.message);
  } 
}

/****************************
* Post new inventory element in the server
****************************/
async function registerInventoryElement(inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail) {
  try {
    if (!inv_description.endsWith(".")) {
      inv_description += "."
    }
    const sql = "INSERT INTO public.inventory (inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_model, inv_make, classification_id, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail])
  } catch (error) {
    console.error("registerClassificationElement error " + error.message)
  }
}

/****************************
* Update Inventory Data
****************************/
async function updateInventory(
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
) {
  try {
    if (!inv_description.endsWith(".")) {
      inv_description += ".";
    }
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/****************************
* Delete Inventory entry
****************************/
async function deleteInventoryObject(inv_id) {
  try {
    const preWork = deleteInventoryObjectReviews(inv_id)
    if (preWork) {
      try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
      } catch (error) {
        console.error(error)
      }
    } else {
      throw new Error("Something went wrong!")
    }
  } catch (error) {
    console.error(error)
  }
}

/****************************
* Delete Inventory entry related reviews
****************************/
async function deleteInventoryObjectReviews(inv_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error(error)
  }
}

//

/****************************
* Get Vehicle Reviews
****************************/
async function getVehicleReviewsByInventoryId(inv_id) {
  try {
    const sql = "SELECT a.*, b.account_firstname, b.account_lastname FROM public.review AS a JOIN public.account AS b ON a.account_id = b.account_id WHERE a.inv_id = $1 ORDER BY a.review_date DESC;"
    const reviews = await pool.query(sql, [inv_id])
    return reviews.rows
  } catch (error) { 
    console.error("getVehicleReviewsByInventoryId error " + error.message);
  } 
}

async function createVehicleReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    const review = await pool.query(sql, [review_text, inv_id, account_id])
    return review.rows[0]
  } catch (error) {
    console.error("createVehicleReview error " + error.message);
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleInfoByInventoryId, registerClassificationElement, checkExistingClassification, registerInventoryElement, updateInventory, deleteInventoryObject, getVehicleReviewsByInventoryId, createVehicleReview, deleteInventoryObjectReviews }