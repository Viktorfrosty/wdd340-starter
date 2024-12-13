/************************
* Final Enhancement Task
*************************/

/************************
* Needed Resources
*************************/
const pool = require("../database/")

const model = {}

/************************
* ID verification
*************************/
model.idVerification = async function (review_id, account_id) {
  try {
    const sql = "SELECT * FROM public.review WHERE review_id = $1 AND account_id = $2"
    const match = await pool.query(sql, [review_id, account_id])
    return match.rowCount
  } catch (error) {
    console.error("idVerification error " + error)
  }
}

/************************
* autor data fetch by review_id
*************************/
model.getAutorByReviewId = async function (review_id) {
  try {
    const sql = "SELECT b.account_firstname, b.account_lastname FROM public.review AS a JOIN public.account AS b ON a.account_id = b.account_id WHERE a.review_id = $1"
    const data = await pool.query(sql, [review_id])
    return data.rows
  } catch (error) {
    return new Error("No matching info found")
  }
}

/************************
* Data fetch by review_id
*************************/
model.getReviewByReviewId = async function (review_id) {
  try {
    const result = await pool.query(
      "SELECT a.review_text, a.review_date, b.inv_year, b.inv_make, b.inv_model FROM public.review AS a JOIN public.inventory AS b ON a.inv_id = b.inv_id WHERE review_id = $1",
      [review_id])
      return result.rows[0]
  } catch (error) {
    return new Error("No matching info found")
  }
}

/************************
* Update review
*************************/
model.updateReview = async function (review_text, review_id) {
  try {
    const sql = "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [review_text, review_id])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

/************************
* Delete review
*************************/
model.deleteReview = async function (review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1"
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    console.error("Delete review error")
  }
}

module.exports = model