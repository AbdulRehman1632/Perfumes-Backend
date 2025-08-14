import express from "express"
import dotenv from "dotenv"
import Contact from "../contactModel/ContactModel.js";
import { enums } from "../../enum/enum.js";


dotenv.config();
const ContactRoutes = express.Router();



// ContactRoutes.post('/add', async (req, res) => {
//   try {
//     const { name, number, email, query, brief } = req.body;
//     const newContact = new Contact({ name, number, email, query, brief });
//     await newContact.save();
//     res.status(201).json({ message: "Query saved successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: "Error saving query", error: err });
//   }
// });


ContactRoutes.post("/add",async(req,res)=>{
    const { name, number, email, query, brief } = req.body;


    try{
      const newQuery = {
  name,
  number,
  email,
  query,
  brief,
};

        await Contact.create(newQuery)
        res.status(200).send({status:200,message:enums.ADD,newQuery})
    }

    catch(error){
        res.status(404).send({status:404,message:enums.ERRORS})
    }
})



export default ContactRoutes