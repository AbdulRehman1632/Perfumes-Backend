import express from "express";
import Offer from "../offermodel/offermodel.js";
import { enums } from "../../enum/enum.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import uploads from "../offerHelpers/OffersCloudinary.js";



const OfferRoutes = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



OfferRoutes.get("/all",async(req,res)=>{
    try{
        const GetAllOffer = await Offer.find();
        res.status(200).send({status:200,message:enums.SUCCESS,data:GetAllOffer})
    }
    catch(error){
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})



OfferRoutes.post("/add",uploads.single("OfferImage"),async(req,res)=>{
    const { OfferProductName, OfferPercentage, OfferProductDescription, OfferProductTagline, BackgroundColor} = req.body;
    const OfferImage= req.file?.path
    const OfferImageID= req.file?.filename

     if (!OfferProductName || !OfferPercentage || !OfferProductDescription || !OfferProductTagline || !BackgroundColor || !OfferImage) {
        return res.status(400).json({ status: 400, message: "All fields are required." });
    }


    try{
      const newOffer = {
  OfferProductName,
  OfferPercentage,
  OfferProductDescription,
  OfferProductTagline,
  BackgroundColor,
  OfferImage,
  OfferImageID,
};

          const createdOffer = await Offer.create(newOffer);
        res.status(200).send({status:200,message:enums.ADD,createdOffer})
    }

    catch(error){
         console.log("Offer Add Error:", error); // ✅ Error ko log karo
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})





OfferRoutes.put("/edit/:id", uploads.single("OfferImage"), async (req, res) => {
  const { id } = req.params;
 const { OfferProductName, OfferPercentage, OfferProductDescription, OfferProductTagline, BackgroundColor} = req.body;

  const NewOfferImage = req.file?.path;
  const NewOfferImageId = req.file?.filename;

  try {
    const existingOffer = await Offer.findById(id);

    if (!existingOffer) {
      return res.status(404).send({ status: 404, message: "Offer not found" });
    }

    // ❌ Delete old image from Cloudinary
    if (NewOfferImage && existingOffer.NewOfferImageId) {
      await cloudinary.uploader.destroy(existingOffer.NewOfferImageId);
    }

    // ✅ Update fields
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      {
        OfferProductName: OfferProductName || existingOffer.OfferProductName,
        OfferPercentage: OfferPercentage || existingOffer.OfferPercentage,
        OfferProductDescription: OfferProductDescription || existingOffer.OfferProductDescription,
        OfferProductTagline: OfferProductTagline || existingOffer.OfferProductTagline,
        BackgroundColor: BackgroundColor || existingOffer.BackgroundColor,
        OfferImage: NewOfferImage || existingOffer.OfferImage,
        NewOfferImageId: NewOfferImageId || existingOffer.NewOfferImageId,
      },
      { new: true }
    );

    res.status(200).send({ status: 200, message: enums.UPDATE, updatedOffer });

  } catch (error) {
    console.error("❌ Error in PUT /edit/:id:", error.message);
    res.status(400).send({ status: 400, message: enums.ERRORS, error: error.message });
  }
});


OfferRoutes.delete("/delete/:id" ,async(req,res)=>{
    try{
        const {id}=req.params
        const offers =await Offer.findById(id)
        if (!offers) {
      return res.status(404).send({ status: 404, message: "offer not found" });
    }

     if (offers.OfferImageID) {
      await cloudinary.uploader.destroy(offers.OfferImageID);
    }
        const response = await Offer.findByIdAndDelete(id)
        res.status(200).send({status:200,message:enums.DELETE,response})
    }
    catch(error){
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})

export default OfferRoutes;