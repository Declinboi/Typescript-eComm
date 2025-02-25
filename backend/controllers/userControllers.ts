import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/userModels";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      throw new Error("Please fill all the inputs.");
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send("User already exists");
  
   const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
  
    try {
      await newUser.save();
      createToken(res, newUser._id as mongoose.Types.ObjectId);
  
      res.status(201).json({
        newUser:{
          ...newUser.toObject(),
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400);
      console.error("Error:", (error as Error).message);
    } 
  });
  
