import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import ListingRoutes from "./routes/ListingRoutes/ListingRoutes.js"
import ReviewRoutes from "./reviews/reviewroutes/ReviewRoutes.js"
import OrderRoutes from "./orders/orderroutes/OrderRoutes.js"
import AdminRoutes from "./admin/adminroutes/AdminRoutes.js"
import OfferRoutes from "./offers/offerRoutes/OfferRoutes.js"
// import OfferRoutes from "./offers/offerRoutes/OfferRoutes.js"

const app = express()
app.use(cors({
  origin: ["https://perfumes-frontend-one.vercel.app", "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Preflight handle
app.options('*', cors({
  origin: ["https://perfumes-frontend-one.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json())




dotenv.config();

const PORT=process.env.PORT || 16000
const MONOGO_URI = process.env.URL_MONGODB

app.get("/",(req,res)=>{
    res.send("welcome to perfumes backend ")
})


const DB_CONNECTION = async() => {
    try{
        await mongoose.connect(MONOGO_URI)
        console.log("Db connected")
    }
    catch(error){
        console.log("Db not connected")
    }
}

DB_CONNECTION()

app.use("/Listing", ListingRoutes)
app.use("/Reviews", ReviewRoutes)
app.use("/Orders", OrderRoutes)
app.use("/Offer", OfferRoutes)
app.use("/api/admin", AdminRoutes);

app.listen(PORT,()=>{
    console.log(`server start ${PORT}`)
})



// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;
//   await mongoose.connect(process.env.URL_MONGODB);
//   isConnected = true;
// };

// export default async function handler(req, res) {
//   await connectDB();
//   return app(req, res);
// }