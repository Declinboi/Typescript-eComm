import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/userModels";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
        newUser: {
          ...newUser.toObject(),
        },
      });
    } catch (error) {
      res.status(400);
      console.error("Error:", (error as Error).message);
    }
  }
);

// Login

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    createToken(res, existingUser._id as mongoose.Types.ObjectId);

    res.status(200).json({
      existingUser: {
        ...existingUser.toObject(),
      },
    });
  }
);

// logout

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// get all users profile
export const getCurrentUserProfile = asyncHandler(
  async (req: Request & { user?: { _id: string } }, res: Response) => {
    const user = req.user?._id ? await User.findById(req.user._id) : null;
    user
      ? res.json({ _id: user._id, username: user.username, email: user.email })
      : res.status(404).json({ message: "User not found." });
  }
);

export const updateCurrentUserProfile = asyncHandler(
  async (
    req: Request & { user?: { _id: string } },
    res: Response
  ): Promise<void> => {
    const user = req.user?._id ? await User.findById(req.user._id) : null;

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Ensure function exits early
    }

    Object.assign(user, {
      username: req.body.username || user.username,
      email: req.body.email || user.email,
      password: req.body.password
        ? await bcrypt.hash(req.body.password, 10)
        : user.password,
    });

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
);
