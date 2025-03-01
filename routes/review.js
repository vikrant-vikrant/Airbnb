const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validateReview, createReview);

router.delete("/:reviewId", wrapAsync(destroyReview));
module.exports = router;
