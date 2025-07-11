import express from "express"
import Review from "../reviewmodel/reviewmodel.js";
import { enums } from "../../enum/enum.js";
import dotenv from "dotenv";
import uploads from "../reviewhelpers/ReviewCloudinary.js";
import { v2 as cloudinary } from 'cloudinary';


const ReviewRoutes = express.Router()



dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


ReviewRoutes.get("/",async(req,res)=>{
    try{
        const GetAllReview = await Review.find();
        res.status(200).send({status:200,message:enums.SUCCESS,data:GetAllReview})
    }
    catch(error){
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})



ReviewRoutes.post("/add",uploads.single("ReviewImage"),async(req,res)=>{
    const{ReviewName,ReviewTitle,ReviewExperience,ReviewEmail,ReviewGender,ReviewAge}=req.body
    const ReviewImage= req.file?.path
    const ReviewImageID= req.file?.filename

    try{
        const newReview = {
            ReviewName,
            ReviewTitle,
            ReviewExperience,
            ReviewEmail,
            ReviewGender,
            ReviewAge,
            ReviewImage,
            ReviewImageID
        }
        await Review.create(newReview)
        res.status(200).send({status:200,message:enums.ADD,newReview})
    }

    catch(error){
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})



ReviewRoutes.delete("/delete/:id" ,async(req,res)=>{

    try{
        const {id}=req.params
        const reviews =await Review.findById(id)
        if (!reviews) {
      return res.status(404).send({ status: 404, message: "review not found" });
    }

     if (reviews.ReviewImageID) {
      await cloudinary.uploader.destroy(reviews.ReviewImageID);
    }

        const response = await Review.findByIdAndDelete(id)

        res.status(200).send({status:200,message:enums.DELETE,response})
    }

    catch(error){
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})




ReviewRoutes.put("/edit/:id", uploads.single("ReviewImage"), async (req, res) => {
  const { id } = req.params;
  const {
    ReviewName,
    ReviewTitle,
    ReviewExperience,
    ReviewEmail,
    ReviewGender,
    ReviewAge
  } = req.body;

  const NewReviewImage = req.file?.path;
  const NewReviewImageId = req.file?.filename;

  try {
    const existingReview = await Review.findById(id);

    if (!existingReview) {
      return res.status(404).send({ status: 404, message: "Review not found" });
    }

    // ❌ Delete old image from Cloudinary
    if (NewReviewImage && existingReview.ReviewImageID) {
      await cloudinary.uploader.destroy(existingReview.ReviewImageID);
    }

    // ✅ Update fields
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        ReviewName: ReviewName || existingReview.ReviewName,
        ReviewTitle: ReviewTitle || existingReview.ReviewTitle,
        ReviewExperience: ReviewExperience || existingReview.ReviewExperience,
        ReviewEmail: ReviewEmail || existingReview.ReviewEmail,
        ReviewGender: ReviewGender || existingReview.ReviewGender,
        ReviewAge: ReviewAge || existingReview.ReviewAge,
        ReviewImage: NewReviewImage || existingReview.ReviewImage,
        ReviewImageID: NewReviewImageId || existingReview.ReviewImageID,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: enums.UPDATE, updatedReview });

  } catch (error) {
    console.error("❌ Error in PUT /edit/:id:", error.message);
    res.status(400).send({ status: 400, message: enums.ERRORS, error: error.message });
  }
});



export default ReviewRoutes;