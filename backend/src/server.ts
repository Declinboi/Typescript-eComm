import path from "path";
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "../config/db";
import userRoutes from "../routes/userRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import productRoutes from "../routes/productRoutes";
import uploadRoutes from "../routes/uploadRoutes";
import orderRoutes from "../routes/orderRoutes";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (_req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});
app.use("/uploads", express.static(path.resolve("uploads")));

app.listen(PORT, () => {
  console.log("server is listen on port:", PORT);
});
