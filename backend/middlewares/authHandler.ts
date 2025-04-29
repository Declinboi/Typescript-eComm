import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModels";
import asyncHandler from "./asyncHandler";
import { Document } from "mongoose";

// Extend Express Request to include user property
interface IUser {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

// Extend Express Request to include `user`
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt;

    // if (!token) {
    //   res.status(401);
    //   throw new Error("Not authorized, no token.");
    // }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

      // Find the user and ensure it's properly typed
      const user = (await User.findById(decoded.userId).select("-password")) as
        | (Document & IUser)
        | null;

      if (!user) {
        res.status(404);
        throw new Error("User not found.");
      }

      // Assign the user to req.user
      req.user = { ...user.toObject(), _id: user._id.toString() };

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  }
);

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Not authorized as an admin.");
  }
};
