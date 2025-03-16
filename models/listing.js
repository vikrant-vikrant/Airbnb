const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./review.js");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  position: {
    type: {
      type: String,
      enum: ["Point"], // Must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers: [lng, lat]
      required: true,
    },
  },
});

listingSchema.post("findOneDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
