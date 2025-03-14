// import path from "path";
// import express, { Request, Response } from "express";
// import multer, { FileFilterCallback, MulterError } from "multer";
// import fs from "fs";
// import { fileURLToPath } from "url";
// const router = express.Router();

// // ✅ Fix: Define `__dirname` for ESM compatibility
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // const __dirname = path.resolve();
// const uploadDir: string = path.join(__dirname, "uploads");

// // ✅ Ensure uploads directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ✅ Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     const extname: string = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// // ✅ File filter function
// const fileFilter = (
//   _req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   const allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp"];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file type"));
//   }
// };

// const upload = multer({ storage, fileFilter });
// const uploadSingleImage = upload.single("image");

// // ✅ Upload route
// router.post("/", (req: Request, res: Response) => {
//   uploadSingleImage(req, res, (err?: any) => {
//     if (err) {
//       console.error("Upload error:", err);

//       if (err instanceof MulterError) {
//         return res.status(400).json({ message: `Multer error: ${err.message}` });
//       }

//       return res.status(400).json({ message: err.message || "Upload failed" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No image file provided" });
//     }

//     // ✅ Fix: Use correct path for response
//     const imagePath: string = `./uploads/${req.file.filename}`;

//     res.status(200).json({
//       message: "Image uploaded successfully",
//       image: imagePath,
//     });
//   });
// });

// export default router;





import path from "path";
import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
export const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
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

const upload = multer({ storage, fileFilter });
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
      image: `/${req.file.path}`,
    });
  });
});

export default router;
