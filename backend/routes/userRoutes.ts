import express from "express";
import { createUser } from "../controllers/userControllers";

const router = express.Router();

router.route("/").post(createUser);
export default router;
