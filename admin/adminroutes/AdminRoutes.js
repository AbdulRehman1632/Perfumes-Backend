import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../adminmodels/AdminModel.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { enums } from "../../enum/enum.js";

dotenv.config();

const AdminRoutes = express.Router();

AdminRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.status(404).send({ status: 404, message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);

    if (!isPasswordValid) {
      return res.status(401).send({ status: 401, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingAdmin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      status: 200,
      message: enums.SUCCESS,
      token,
      admin: {
        id: existingAdmin._id,
        email: existingAdmin.email,
      },
    });
  } catch (error) {
    res.status(400).send({ status: 400, message: enums.ERRORS, error: error.message });
  }
});

// adminroutes/AdminRoutes.js
AdminRoutes.post("/logout", (req, res) => {
  // Normally frontend handles logout by removing token
  return res.status(200).send({ status: 200, message: "Admin logged out" });
});




AdminRoutes.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send({ status: 400, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();

    res.status(201).send({ status: 201, message: "Admin signed up successfully", newAdmin });
  } catch (error) {
    res.status(500).send({ status: 500, message: "Something went wrong", error: error.message });
  }
});

export default AdminRoutes;
