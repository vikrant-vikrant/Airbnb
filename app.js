const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
// const { get } = require("http");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");
const Review = require("./models/review.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log("DB Connection Error:", err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}
const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};
//server side validation 
const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};

//Index route
app.get("/listings",async(req,res)=>{
  const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});
});
//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs")
})
//show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/show.ejs", { listing });
});
//create route
app.post("/listings",validateListing,async (req,res,next)=>{
  const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit", async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
  };
  res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",validateListing,async (req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
  let {id} = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  };
  res.redirect("/listings");
});
//reviews route
//post route
app.post("/listings/:id/reviews",validateReview, async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReviwe = new Review(req.body.review);

  listing.reviews.push(newReviwe);
  await newReviwe.save();
  await listing.save();

  // console.log(newReviwe);
  console.log("Review added");
  res.redirect(`/listings/${listing._id}`);
}
);
//delete review routen
app.delete("/listings/:id/reviews/:reviewsId",wrapAsync(async(req,res)=>{
  let { id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

  await Review.findByIdAndDelete(reviewId);
  //here is error
  res.redirect(`Listing/${id}`);
}))


// Catch-all route for undefined routes
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"yaha pr mistake hai bhai"));
});
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(statusCode=500).render("../views/listings/error.ejs");
});

app.listen(8080,()=>{
  console.log("server is listing on port 8080");
});