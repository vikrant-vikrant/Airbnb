const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
//to initialize data add link of ATLASDB_URL;
// const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67e25a0920a94f62864b2d83",
    position: { type: "Point", coordinates: [77.216721, 28.6448] },
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
initDB();
