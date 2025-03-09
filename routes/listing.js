const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(listingController.index)
  // .post(
  //   isLoggedIn,
  //   validateListing,
  //   upload.single("listing[image]"),
  //   listingController.createListing
  // );
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
  .delete(isLoggedIn, isOwner, listingController.destroyListing);

router
  .route("/:id/edit")
  .get(isLoggedIn, listingController.renderEditForm)
  .get(isLoggedIn, isOwner, validateListing, listingController.updateListing);
module.exports = router;
