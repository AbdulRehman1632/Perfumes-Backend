import multer from "multer";
import  { CloudinaryStorage }  from  'multer-storage-cloudinary';
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config();


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder : "review",
        allowedFormats : ["jpg" , "png" , "gif" , "jpeg" , "pdf"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    }
})


const uploads = multer({storage})

export default uploads;