const pool = require("../database/")

/******************************
* Register new account
*****************************/
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/***********************
* Check for existing email
***********************/
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/******************************
* Return account data using email address
*******************************/
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/******************************
* Return account data using id
*****************************/
async function getAccountByaccountId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email FROM public.account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching info found")
  }
}

/****************************
* Update account info Data
****************************/
async function updateInfoData(
  account_id,
  account_firstname,
  account_lastname, 
  account_email
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/****************************
* Update account info Data
****************************/
async function updatePasswordData(
  account_id,
  account_password
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/***********************
* Check for existing unbound email
***********************/
async function checkExistingUnboundEmail(account_email, account_id){
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1 AND account_id != $2"
    const email = await pool.query(sql, [account_email, account_id])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/***********************
* Get the reviews using the account ID
***********************/
async function getReviewsByAccountId(account_id) {
  try {
    const sql = "SELECT a.*, b.inv_year, b.inv_make, b.inv_model FROM public.review AS a JOIN public.inventory AS b  ON a.inv_id = b.inv_id WHERE a.account_id = $1 ORDER BY a.review_date DESC"
    const reviews = await pool.query(sql, [account_id])
    return reviews.rows
  } catch (error) { 
      console.error("getReviewsByAccountId error " + error.message);
  } 
}

/***********************
* Get the reviews using the account_type "Client"
***********************/
async function getClientReviews() {
  try {
    const sql = "SELECT a.*, b.inv_year, b.inv_make, b.inv_model, c.account_firstname, c.account_lastname FROM public.review AS a JOIN public.inventory AS b  ON a.inv_id = b.inv_id JOIN public.account AS c ON a.account_id = c.account_id WHERE c.account_type = 'Client' ORDER BY a.review_date DESC"
    const reviews = await pool.query(sql)
    return reviews.rows
  } catch (error) { 
      console.error("getReviewsByAccountId error " + error.message);
  } 
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountByaccountId, updateInfoData, updatePasswordData, checkExistingUnboundEmail, getReviewsByAccountId, getClientReviews }