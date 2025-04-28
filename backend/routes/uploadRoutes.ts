import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// File filter (preserved from your code)
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /\.(jpe?g|png|webp)$/i;
  const mimetypes = /^image\/(jpe?g|png|webp)$/;

  const extname = file.originalname.toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only JPEG, PNG, and WEBP images are allowed"
      )
    );
  }
};

// Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    const name = file.originalname.split(".")[0];
    return {
      folder: "ecomm_uploads",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${name}-${Date.now()}`,
    };
  },
});

export const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req: Request, res: Response) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Cloudinary returns the full URL in `path`
    res.status(200).json({
      message: "Image uploaded successfully",
      image: (req.file as any).path, // Cloudinary image URL
    });
  });
});

export default router;

