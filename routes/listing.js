const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//Index route
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});
//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
//show route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
    // throw new ExpressError(404, "Listing not found");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
});
//create route
router.post("/", isLoggedIn, validateListing, async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing Created");
  res.redirect("/listings");
});
//edit route
//photo is not sowing up properlly after editing
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  // if (!listing) {
  //   const { statusCode = 500, message = "Something went wrong" } = err;
  //   res.status(statusCode).render("error.ejs", { message });
  // }
  res.render("listings/edit.ejs", { listing });
});
//update route
router.put("/:id", isLoggedIn, validateListing, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated!");

  res.redirect(`/listings/${id}`);
});
//delete route
//unable to delete all reviews of listing from dbs
router.delete("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
});
module.exports = router;
