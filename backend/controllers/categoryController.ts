import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import Category from "../models/categoryModels";

export const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;

      if (!name) {
        res.json({ error: "Name is required" });
        return;
      }

      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        res.json({ error: "Already exists" });
        return;
      }

      const category = await new Category({ name }).save();
      res.json(category);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
      return;
    }
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const { categoryId } = req.params;

      const category = await Category.findOne({ _id: categoryId });

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      category.name = name;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const removeCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const removed = await Category.findByIdAndDelete(req.params.categoryId);
      res.json(removed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const listCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const all = await Category.find({});
      res.json(all);
    } catch (error) {
      console.log(error);
      res.status(400).json((error as Error).message);
      return;
    }
  }
);

export const readCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      res.json(category);
    } catch (error) {
      console.log(error);
      res.status(400).json((error as Error).message);
      return;
    }
  }
);
