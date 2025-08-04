import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    ReviewName:{type:String},
    ReviewTitle:{type:String},
    ReviewExperience:{type:String},
    ReviewEmail:{type:String},
    ReviewImage:{type:String},
    ReviewImageID:{type:String},
    ReviewGender:{
  type: String,
  enum: ['Male', 'Female', 'Other'],
  required: true, // optional: only if it's mandatory
},
ReviewAge:{
    type:String,
    enum:["Below 18" , "18-34" ,"35-54" ,"55+"]
},
  ReviewRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ReviewProductID: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product", // or your product model name
  required: true,
},

})



const Review = mongoose.model("review" , ReviewSchema)

export default Review;