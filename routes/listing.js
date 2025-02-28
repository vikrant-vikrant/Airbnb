const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
//Index route
router.get("/", listingController.index);

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});
// router.get("/id", listingController.showListing);

//create route
router.post("/", isLoggedIn, validateListing, listingController.createListing);

//edit route
router.get("/:id/edit", isLoggedIn, listingController.renderEditForm);

//update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  listingController.updateListing
);
//delete route
//unable to delete all reviews of listing from dbs
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;
