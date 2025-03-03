import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authHandler";
import {
  createCategory,
  listCategory,
  readCategory,
  removeCategory,
  updateCategory,
} from "../controllers/categoryController";
const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
