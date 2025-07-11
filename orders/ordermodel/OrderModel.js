// orders/ordermodel/OrderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "listing", required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);
export default Order;
