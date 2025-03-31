import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import Product from "../models/productModels";
import { AuthenticatedRequest } from "../middlewares/authHandler"; // Ensure this includes `user`
import mongoose from "mongoose";

// const addProduct = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const {
//         name,
//         description,
//         price,
//         category,
//         quantity,
//         brand,
//         countInStock,
//       } = req.body as {
//         name?: string;
//         description?: string;
//         price?: string;
//         category?: string;
//         quantity?: string;
//         brand?: string;
//         countInStock?: string;
//       };

//       // Get image file path from Multer
//       const image = req.file ? `/uploads/${req.file.filename}` : "";

//       // Create a new product, converting numeric fields and category as needed.
//       const newProduct = new Product({
//         name,
//         description,
//         price, //Number(price),
//         category,
//         quantity,// Number(quantity),
//         brand,
//         countInStock, //Number(countInStock), // Convert if necessary
//         image,
//       });

//       const savedProduct = await newProduct.save();
//       console.log("Product saved:", savedProduct);

//       res.status(201).json(savedProduct.toObject());
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ error: (error as Error).message });
//     }
//   }
// );


const addProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, quantity, brand, countInStock } = req.body;

    // Validate required fields before proceeding
    if (!name || !description || !price || !category || !quantity || !brand || !countInStock) {
      res.status(400).json({ error: "All fields are required." });
      return 
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      description,
      price: Number(price),  // Convert to number if necessary
      category,
      quantity: Number(quantity),
      brand,
      countInStock: Number(countInStock),
      image,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});




const updateProductDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name,
        description,
        price,
        category,
        quantity,
        brand,
        countInStock,
      } = req.body as {
        name?: string;
        description?: string;
        price?: string;
        category?: string;
        quantity?: string;
        brand?: string;
        countInStock?: string;
      };

      // Get image file path from Multer
      const image = req.file ? `/uploads/${req.file.filename}` : "";

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          price: Number(price),
          category,
          quantity: Number(quantity),
          brand,
          countInStock: Number(countInStock), // Convert if necessary
          image,
        },
        { new: true }
      );

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      // Save the updated product
      const updatedProduct = await product.save();

      res.json(updatedProduct.toObject());
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
      const page = Number(req.query.page) || 1; // ✅ Read dynamic page number
      const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: "i" } }
        : {};

      const count = await Product.countDocuments({ ...keyword });

      // ✅ Fetch correct page data using `skip()`
      const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        hasMore: page * pageSize < count, // ✅ Check if more pages exist
      });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
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
      const { rating, comment } = req.body as {
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
      const { checked, radio } = req.body as {
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
