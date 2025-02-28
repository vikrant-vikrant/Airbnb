const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError.js");
// const Review = require("../models/review");
// const Listing = require("../models/listing");
const { validateReview, isLoggedIn } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");
// Post review
// unable to write a review
// router.post(
//   "/",
//   isLoggedIn,
//   validateReview,
//   wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New Review Created");
//     res.redirect(`/listings/${listing._id}`);
//   })
// );
router.post("/", isLoggedIn, validateReview, createReview);

// Delete review
// unable to delete a review
// router.delete(
//   "/:reviewId",
//   wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", "Review Deleted!");
//     res.redirect(`/listings/${id}`);
//   })
// );
router.delete("/:reviewId", wrapAsync(destroyReview));
module.exports = router;
