import express from "express";
const router = express.Router();

// controllers
import {
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
} from "../controllers/productControllers";
import { authenticate, authorizeAdmin } from "../middlewares/authHandler";
import checkId from "../middlewares/checkId";
import { upload } from "./uploadRoutes";


router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin,upload.single("image"), addProduct);
  

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin,upload.single("image"), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;
