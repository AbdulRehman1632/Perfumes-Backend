import express from "express"
import dotenv from "dotenv";
import Listing from "../../models/ListingModel.js";
import { enums } from "../../enum/enum.js";
import { v2 as cloudinary } from 'cloudinary';
import uploads from "../../helpers/Cloudinary/Cloudinary.js";

const ListingRoutes = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

ListingRoutes.get("/", async (req, res) => {
  try {
    const GetAllListings = await Listing.find();
    res
      .status(200)
      .send({ status: 200, message: enums.SUCCESS, data: GetAllListings });
  } catch (error) {
    res.status(400).send({ status: 404, message: enums.ERRORS });
  }
});




ListingRoutes.post("/add", uploads.array("images", 2),
   async (req, res) => {
  const {
    PerfumeTitle,
    PerfumeCategory,
    PerfumeDescription,
    PerfumePrice,
    PerfumeBottleML,
  } = req.body;

  const PerfumePictureIds = req.file?.filename
  console.log = (PerfumePictureIds)

       


  try {
    const uploadedImageIds = req.files.map(file => file.filename); // ✅ Cloudinary public_id
     const uploadedImages = req.files.map((file) => file.path); // Cloudinary URL
    const newlisting = {
      PerfumeTitle,
      PerfumeCategory,
      PerfumeDescription,
      PerfumePrice,
      PerfumeBottleML,
      PerfumePicture : uploadedImages,
      PerfumePictureIds : uploadedImageIds,
    };
    
    await Listing.create(newlisting);

    res.status(200).send({status:200,message:enums.ADD,newlisting})


  } catch (error) {
    console.error("❌ Error in POST /add:", error.message); // 👈 Console pe print hoga
  res.status(400).send({
    status: 400,
    message: enums.ERRORS,
    error: error.message // 👈 Client ko actual error milega
  });
  }
});



ListingRoutes.delete("/delete/:id",async(req,res)=>{

  try{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send({ status: 404, message: "Listing not found" });
    }

    // 🔁 Step 2: Delete images from Cloudinary using public_id(s)
    if (listing.PerfumePictureIds && listing.PerfumePictureIds.length > 0) {
      for (const publicId of listing.PerfumePictureIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 🗑️ Step 3: Delete document from DB
    const response = await Listing.findByIdAndDelete(id);

    res.status(200).send({ status: 200, message: enums.DELETE, data: response });
  }

  catch(error){
    res.status(400).send({ status: 404, message: enums.ERRORS });
  }
})


ListingRoutes.put("/edit/:id", uploads.array("images", 2), async (req, res) => {
  const { id } = req.params;
  const {
    PerfumeTitle,
    PerfumeCategory,
    PerfumeDescription,
    PerfumePrice,
    PerfumeBottleML,
  } = req.body;

  const uploadedImages = req.files?.map((file) => file.path); // new image URLs
  const uploadedImageIds = req.files?.map((file) => file.filename); // new image IDs

  try {
    const existingData = await Listing.findById(id);

    // 🧹 Delete old images from Cloudinary (if exist)
    if (existingData.PerfumePictureIds && existingData.PerfumePictureIds.length > 0) {
      for (const publicId of existingData.PerfumePictureIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 🔄 Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        PerfumeTitle: PerfumeTitle || existingData.PerfumeTitle,
        PerfumeCategory: PerfumeCategory || existingData.PerfumeCategory,
        PerfumeDescription: PerfumeDescription || existingData.PerfumeDescription,
        PerfumePrice: PerfumePrice || existingData.PerfumePrice,
        PerfumeBottleML: PerfumeBottleML || existingData.PerfumeBottleML,
        PerfumePicture: uploadedImages || existingData.PerfumePicture,
        PerfumePictureIds: uploadedImageIds || existingData.PerfumePictureIds,
      },
      { new: true }
    );

    res.status(200).send({
      status: 200,
      message: enums.UPDATE,
      UpdatingListing: updatedListing,
    });
  } catch (error) {
    console.error("❌ Update Error:", error.message);
    res.status(400).send({ status: 404, message: enums.ERRORS });
  }
});





export default ListingRoutes;
