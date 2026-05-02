import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mixed upload handler (image OR video in one request)
const mixedStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("video/")) {
      return {
        folder:        "a-louder-voice/videos",
        resource_type: "video",
      };
    }
    return {
      folder:          "a-louder-voice/images",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation:  [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
    };
  },
});

export const uploadMedia = multer({
  storage: mixedStorage,
  limits:  { fileSize: 100 * 1024 * 1024 }, // 100 MB
}).fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]);

export { cloudinary };
