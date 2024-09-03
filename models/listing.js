const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./review.js")

const listingSchema = new Schema({
  title: {type:String,required:true},
  description:{type:String},
  image: {
    url:{type:String,
        default:"https://images.unsplash.com/photo-1723442246044-7ccd50c84386?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set:(v)=> v ===""?"https://images.unsplash.com/photo-1443397646383-16272048780e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
  },
  price:Number,
  location:String,
  country:String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }]
});

listingSchema.post("findOneDelete", async (listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  };
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;