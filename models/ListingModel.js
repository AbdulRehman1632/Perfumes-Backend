import mongoose from "mongoose";


const ListingSchema = new mongoose.Schema({
    PerfumeTitle:{type:String},
    PerfumeCategory:{type:String},
    PerfumeDescription:{type:String},
    PerfumePrice:{type:String},
    PerfumeBottleML:{type:String},
    PerfumeDetail:{type:String},
    PerfumePicture: {
    type: [String], // ✅ Array of Cloudinary image URLs
    default: []
  },
  PerfumePictureIds: {
    type: [String], // ✅ Array of Cloudinary image URLs
    default: []
  },
},{timestamps:true})


const Listing = mongoose.model("listing",ListingSchema)


export default Listing;