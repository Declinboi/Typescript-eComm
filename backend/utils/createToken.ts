import jwt from "jsonwebtoken";
import { Response } from "express";
import mongoose from "mongoose";

const generateToken = (
  res: Response,
  userId: mongoose.Types.ObjectId | string
): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
