import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

const checkId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: `Invalid ObjectId: ${id}` });
    return;
  }

  next();
};

export default checkId;
