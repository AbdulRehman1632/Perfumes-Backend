// routes/OrderRoutes.js
import express from "express";
import { enums } from "../../enum/enum.js";
import Order from "../ordermodel/OrderModel.js";

const OrderRoutes = express.Router();

// CREATE order
OrderRoutes.post("/add", async (req, res) => {
  console.log("🛒 Received order body:", req.body);

  // ⬇️ Directly destructuring values as per schema
  const { name, email, phone,products, totalAmount, shippingAddress } = req.body;

   console.log("➡️ Extracted Products:", products);

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ status: 400, message: "Invalid or missing products" });
  }


  try {
    const newOrder = await Order.create({
      name,
      email,
      phone,
      products,
      totalAmount,
      shippingAddress,
    });

    res.status(200).json({ status: 200, message: "Order placed", newOrder });
  } catch (error) {
    console.error("❌ Order creation failed:", error.message);
    res.status(400).json({ status: 400, message: "Order failed", error });
  }
});

// READ all orders (admin)
OrderRoutes.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId");
    res.status(200).json({ status: 200, message: enums.SUCCESS, data: orders });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Fetch failed" });
  }
});

// READ single order (user)
OrderRoutes.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId");
    res.status(200).json({ status: 200, data: order });
  } catch (error) {
    res.status(404).json({ status: 404, message: "Order not found" });
  }
});


// GET /api/orders?email=abc@gmail.com

OrderRoutes.post("/get-order-by-email", async (req, res) => {
  const { email } = req.body;

  try {
    const orders = await Order.find({ email });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error in fetching orders:", err);
    res.status(500).json({ error: "Server Error" });
  }
});



// UPDATE order status (admin)
OrderRoutes.put("/edit/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ status: 200, message: "Order updated", updated });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Update failed" });
  }
});


OrderRoutes.put("/status/:id", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});


// DELETE order (admin)
OrderRoutes.delete("/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 200, message: "Order deleted" });
  } catch (error) {
    res.status(400).json({ status: 400, message: "Delete failed" });
  }
});


export default OrderRoutes;
