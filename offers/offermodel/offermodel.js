import mongoose from "mongoose";



const OfferSchema = new mongoose.Schema({
    OfferProductName : {type:String,required: true},
    OfferPercentage : {type:String,required: true},
    OfferProductDescription : {type:String,required: true},
     OfferProductTagline : {
  type: String,
  enum: ['Embrace the Calm Within', 'Fragrance that Breathes Serenity', 'Awaken to a World of Stillness','Let Peace Define You','Soft, Subtle, Serene',
    'A Whisper of Timeless Grace','Where Calm Meets Confidence','Refresh Your Soul','Elegance in Every Essence','The Art of Subtle Presence','A Moment of Pure Escape',
    'Simplicity. Serenity. Sophistication.','A Fragrance That Feels Like You'
  ],
  required: true, 
},
OfferImage:{type:String},
    OfferImageID:{type:String},
    BackgroundColor: { type: String },
})


const Offer = mongoose.model("offer", OfferSchema)

export default Offer;