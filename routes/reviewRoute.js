/**********************************
* Final Enhancement Task
***********************************/

/************************
* Needed Resources
*************************/
const validate = require("../utilities/review-validation")
const express = require("express")
const router = new express.Router()
const revController = require("../controllers/reviewController")
const utilities = require("../utilities")

// Route to build update page
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.checkReviewRelationship,
  utilities.handleErrors(revController.buildReviewEdit)
)

// Route to build delete page
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.checkReviewRelationship,
  utilities.handleErrors(revController.buildReviewDelete)
)


// Route to build update page
router.post(
  "/edit/:review_id",
  validate.reviewRules(),
  validate.checkReviewEditData,
  utilities.handleErrors(revController.processReviewEdit)
)

// Route to build delete page
router.post("/delete", utilities.handleErrors(revController.processReviewDelete))

module.exports = router