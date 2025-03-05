import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import Product from "../models/productModels";
import { AuthenticatedRequest } from "../middlewares/authHandler"; // Ensure this includes `user`

const addProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, category, quantity, brand } =
      req.fields as {
        name?: string;
        description?: string;
        price?: string;
        category?: string;
        quantity?: string;
        brand?: string;
      };

    if (!name || !brand || !description || !price || !category || !quantity) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  }
);

const updateProductDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, price, category, quantity, brand } =
        req.fields as {
          name?: string;
          description?: string;
          price?: string;
          category?: string;
          quantity?: string;
          brand?: string;
        };

      if (!name || !brand || !description || !price || !category || !quantity) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.fields },
        { new: true }
      );

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

const removeProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json({ message: "Product removed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

const fetchProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const pageSize = 6;
      const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: "i" } }
        : {};

      const count = await Product.countDocuments({ ...keyword });
      const products = await Product.find({ ...keyword }).limit(pageSize);

      res.json({
        products,
        page: 1,
        pages: Math.ceil(count / pageSize),
        hasMore: false,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

const fetchProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Product not found" });
    }
  }
);

const fetchAllProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find({})
        .populate("category")
        .limit(12)
        .sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

const addProductReview = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { rating, comment } = req.fields as {
        rating?: string;
        comment?: string;
      };

      if (!req.user) {
        res.status(401).json({ error: "Not authorized" });
        return;
      }

      const product = await Product.findById(req.params.id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user!._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ error: "Product already reviewed" });
        return;
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

const fetchTopProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find({}).sort({ rating: -1 }).limit(4);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

const fetchNewProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find().sort({ _id: -1 }).limit(5);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

const filterProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { checked, radio } = req.fields as {
        checked?: string[];
        radio?: number[];
      };

      let args: any = {};
      if (checked?.length) args.category = checked;
      if (radio?.length) args.price = { $gte: radio[0], $lte: radio[1] };

      const products = await Product.find(args);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
