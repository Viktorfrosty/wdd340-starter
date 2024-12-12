/**********************************
* Final Enhancement Task
***********************************/

// Needed Resources
const revModel = require("../models/review-model")
const utilities = require("../utilities/")

const revCont = {}

// Build Edit Review View
revCont.buildReviewEdit = async function (req, res, next) {
    let nav = await utilities.getNav()
    const review_id = req.params.review_id
    const info = await revModel.getReviewByReviewId(review_id)
    let title = `Edit ${info.inv_year} ${info.inv_make} ${info.inv_model} Review`
    res.render("./reviews/edit", {
        title,
        nav,
        errors: null,
        review_id,
        review_text: info.review_text,
        review_date: info.review_date
    })
}

// Build delete Review View
revCont.buildReviewDelete = async function (req, res, next) {
    let nav = await utilities.getNav()
    const review_id = req.params.review_id
    const info = await revModel.getReviewByReviewId(review_id)
    let title = `Delete ${info.inv_year} ${info.inv_make} ${info.inv_model} Review`
    res.render("./reviews/delete", {
        title,
        nav,
        errors: null,
        review_id,
        review_text: info.review_text,
        review_date: info.review_date
    })
}

// Process Review Edit
revCont.processReviewEdit = async function (req, res, next) {
    const { review_id, review_text } = req.body
    const result = await revModel.updateReview(review_text, review_id)
    // const result = false
    if (result) {
        req.flash("notice", "Review updated successfully.")
        res.redirect("/account")
    } else {
        req.flash("notice", "Sorry, the process failed.")
        const info = await revModel.getReviewByReviewId(review_id)
        let nav = await utilities.getNav()
        let title = `Edit ${info.inv_year} ${info.inv_make} ${info.inv_model} Review`
        res.status(501).render("./reviews/edit", {
            title,
            nav,
            errors: null,
            review_id,
            review_text,
            review_date: info.review_date
        })
    }
}

// Process Review Delete
revCont.processReviewDelete = async function (req, res, next) {
    const { review_id } = req.body
    const result = await revModel.deleteReview(review_id)
    if (result) {
        req.flash("notice", "Review erased successfully.")
        res.redirect("/account")
    } else {
        req.flash("notice", "Sorry, the process failed.")
        res.status(501).redirect(`delete/${review_id}`)
    }
}

module.exports = revCont