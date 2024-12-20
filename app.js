const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
};

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitializ:true,
};
app.use(session(sessionOptions));
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// Catch-all route for undefined routes
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"yaha pr mistake hai bhai"));
});
// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080,()=>{
  console.log("server is listing on port 8080");
});