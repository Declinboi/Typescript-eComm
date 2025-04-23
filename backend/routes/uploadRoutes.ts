


import path from "path";
import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /\.(jpe?g|png|webp)$/i;
  const mimetypes = /^image\/(jpe?g|png|webp)$/;
  
  const extname = path.extname(file.originalname).toLowerCase();
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
  
    res.status(200).json({
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`,
    });
  });
});

export default router;
